// Validator for data/content.json: schema shape, unique IDs, cross-references,
// source provenance and rights, audio segment timestamps.
// Content is organised as one `pilot` lesson (Bài 1) plus `additionalLessons`
// (Bài 2, ...) that all share the same shape; every check runs per lesson and
// IDs must be unique across lessons.
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const data = JSON.parse(readFileSync(path.join(root, "data/content.json"), "utf8"));
const errors = [];
const warnings = [];
const err = (m) => errors.push(m);

if (!data.contentVersion) err("contentVersion is missing");
const sourceIds = new Set();
for (const s of data.sources || []) {
  if (!s.id || sourceIds.has(s.id)) err(`source id missing/duplicate: ${s.id}`);
  sourceIds.add(s.id);
  if (!s.url || !/^https:\/\//.test(s.url)) err(`source ${s.id}: url must be https`);
  if (!s.rightsStatus) err(`source ${s.id}: rightsStatus missing`);
  if (!s.verification) err(`source ${s.id}: verification note missing`);
  if (s.rightsStatus !== "unknown" && !s.rightsEvidence) err(`source ${s.id}: non-unknown rights need rightsEvidence`);
}
function checkRefs(refs, owner) {
  if (!Array.isArray(refs) || refs.length === 0) { err(`${owner}: sourceRefs missing/empty`); return; }
  for (const r of refs) {
    if (!sourceIds.has(r.sourceId)) err(`${owner}: unknown sourceId ${r.sourceId}`);
    if (r.pdfPage != null && r.printedPage == null) warnings.push(`${owner}: pdfPage without printedPage`);
  }
}
const bookIds = new Set((data.books || []).map((b) => b.id));
for (const b of data.books || []) {
  if (!sourceIds.has(b.sourceId)) err(`book ${b.id}: unknown sourceId ${b.sourceId}`);
}
const contents = [data.pilot, ...(data.additionalLessons || [])].filter(Boolean);
const contentByLesson = new Map(contents.map((c) => [c.lessonId, c]));
const lessonIds = new Set();
for (const l of data.lessons || []) {
  if (!l.id || lessonIds.has(l.id)) err(`lesson id missing/duplicate: ${l.id}`);
  lessonIds.add(l.id);
  if (!bookIds.has(l.bookId)) err(`lesson ${l.id}: unknown bookId ${l.bookId}`);
  checkRefs(l.sourceRefs, `lesson ${l.id}`);
  if (l.publicationStatus === "pilot-ready" && !contentByLesson.has(l.id)) err(`lesson ${l.id}: pilot-ready but has no lesson content`);
  if (l.publicationStatus !== "pilot-ready" && contentByLesson.has(l.id)) err(`lesson ${l.id}: has lesson content but is not pilot-ready`);
  const c = contentByLesson.get(l.id);
  if (c) {
    for (const gid of l.grammarIds || []) if (!c.knowledgePoints.some((k) => k.id === gid)) err(`lesson ${l.id}: grammarId ${gid} not in its content`);
    if ((l.grammarIds || []).length !== c.knowledgePoints.length) err(`lesson ${l.id}: grammarIds do not cover all knowledge points of its content`);
    for (const sid of l.sectionIds || []) if (!c.intro.sections.some((x) => x.id === sid)) err(`lesson ${l.id}: sectionId ${sid} not in its intro sections`);
  }
}
if (!data.pilot || !lessonIds.has(data.pilot.lessonId)) err("pilot.lessonId does not resolve");
for (const c of contents) if (!lessonIds.has(c.lessonId)) err(`lesson content ${c.lessonId}: no matching lesson entry`);

// Global ID spaces (across all lessons)
const kpIds = new Set(contents.flatMap((c) => (c.knowledgePoints || []).map((k) => k.id)));
const sentenceIds = new Set();
const trackIds = new Set();
const exIds = new Set();
const summary = [];
for (const c of contents) {
  const tag = `lesson content ${c.lessonId}`;
  if (!c.intro?.goalVi || !Array.isArray(c.intro?.sections) || c.intro.sections.length !== 7) err(`${tag}: intro with goalVi and 7 sections required`);
  const localKp = new Set();
  for (const kp of c.knowledgePoints || []) {
    if (!kp.id || localKp.has(kp.id)) err(`knowledge point id missing/duplicate within ${tag}: ${kp.id}`);
    localKp.add(kp.id);
    checkRefs(kp.sourceRefs, `knowledge ${kp.id}`);
    if (!kp.kindLabel) err(`knowledge ${kp.id}: kindLabel missing (must state its true role)`);
  }
  const localSentences = new Set((c.reader?.sentences || []).map((x) => x.id));
  for (const sen of c.reader?.sentences || []) {
    if (!sen.id || sentenceIds.has(sen.id)) err(`sentence id missing/duplicate: ${sen.id}`);
    sentenceIds.add(sen.id);
    checkRefs(sen.sourceRefs, `sentence ${sen.id}`);
    if (!sen.zh || !sen.pinyin || !sen.vi) err(`sentence ${sen.id}: zh/pinyin/vi all required`);
    if (sen.transcriptStatus !== "print-verified") err(`sentence ${sen.id}: transcriptStatus must be "print-verified"`);
  }
  for (const kp of c.knowledgePoints || []) {
    for (const sid of kp.sentenceIds || []) if (!localSentences.has(sid)) err(`knowledge ${kp.id}: unknown sentenceId ${sid} in its own lesson`);
  }
  for (const w of [...(c.prepWords || []), ...(c.reader?.vocab || []), ...(c.foundationWords || [])]) {
    if (!w.zh || !w.pinyin || !w.vi) err(`word ${w.id}: zh/pinyin/vi all required`);
    checkRefs(w.sourceRefs, `word ${w.id}`);
  }
  for (const t of c.reader?.audioTracks || []) {
    if (!t.id || trackIds.has(t.id)) err(`track id missing/duplicate: ${t.id}`);
    trackIds.add(t.id);
    if (!/^https:\/\/cdn\.baulchino\.com\//.test(t.url)) err(`track ${t.id}: audio must stream from the Baulchino source CDN`);
    if (!(t.durationSec > 0)) err(`track ${t.id}: durationSec must be positive`);
    for (const seg of t.segments || []) {
      if (seg.start < 0 || seg.end > t.durationSec || seg.start >= seg.end) err(`track ${t.id}: segment out of range`);
      if (t.segmentsStatus !== "verified") err(`track ${t.id}: segments present but segmentsStatus is not "verified"`);
    }
    if ((t.segments || []).length === 0 && t.segmentsStatus !== "unverified") err(`track ${t.id}: no segments but segmentsStatus is not "unverified"`);
    if (t.sourceRefs) checkRefs(t.sourceRefs, `track ${t.id}`);
  }
  for (const g of c.reader.passages || []) {
    if (!trackIds.has(g.audioTrackId)) err(`passage ${g.id}: missing track`);
    for (const id of g.sentenceIds) if (!localSentences.has(id)) err(`passage ${g.id}: missing sentence ${id}`);
    checkRefs(g.sourceRefs, `passage ${g.id}`);
  }
  for (const item of c.exerciseSet?.items || []) {
    if (!item.id || exIds.has(item.id)) err(`exercise id missing/duplicate: ${item.id}`);
    exIds.add(item.id);
    if (item.answerStatus === "verified-from-visual" && (!item.answerEvidence || !item.image)) err(`exercise ${item.id}: visual answer needs evidence and image`);
    checkRefs(item.sourceRefs, `exercise ${item.id}`);
    for (const g of item.grammarIds || []) if (!kpIds.has(g)) err(`exercise ${item.id}: unknown grammarId ${g}`);
    if (["verified-from-print", "verified-from-visual"].includes(item.answerStatus)) {
      if (!item.options.some((o) => o.id === item.answer)) err(`exercise ${item.id}: answer not among options`);
    } else if (item.answer != null) {
      err(`exercise ${item.id}: unverified answers must not be auto-graded (answer must be null)`);
    }
  }
  for (const kp of c.knowledgePoints || []) {
    for (const eid of kp.exerciseIds || []) {
      if (!contents.some((x) => (x.exerciseSet.items || []).some((i) => i.id === eid))) err(`knowledge ${kp.id}: unknown exerciseId ${eid}`);
    }
  }
  const localTracks = new Set((c.reader?.audioTracks || []).map((t) => t.id));
  const localTrackById = new Map((c.reader?.audioTracks || []).map((t) => [t.id, t]));
  const TONE_OF = { ā: 1, á: 2, ǎ: 3, à: 4, ē: 1, é: 2, ě: 3, è: 4, ī: 1, í: 2, ǐ: 3, ì: 4, ō: 1, ó: 2, ǒ: 3, ò: 4, ū: 1, ú: 2, ǔ: 3, ù: 4, ǖ: 1, ǘ: 2, ǚ: 3, ǜ: 4 };
  const stripMarks = (x) => String(x).normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/ü/g, "u");
  for (const t of c.selfCheckTasks || []) {
    if (t.audioTrackId && !localTracks.has(t.audioTrackId)) err(`self-check ${t.id}: unknown audioTrackId`);
    if (!Array.isArray(t.prompts) || !t.prompts.length) err(`self-check ${t.id}: prompts missing`);
    checkRefs(t.sourceRefs, `self-check ${t.id}`);
    if (t.answerStatus === "unverified") {
      if (t.answers != null || t.gradingMode != null) err(`self-check ${t.id}: unverified tasks must not carry answers/gradingMode`);
    } else if (t.answerStatus === "verified-editorial") {
      if (!["initial", "final", "tone"].includes(t.gradingMode)) err(`self-check ${t.id}: gradingMode must be initial/final/tone`);
      if (!t.answerEvidence) err(`self-check ${t.id}: verified-editorial needs answerEvidence`);
      if (!Array.isArray(t.answers) || t.answers.length !== t.prompts.length) err(`self-check ${t.id}: answers must cover every prompt`);
      if (!Array.isArray(t.scriptSyllables) || t.scriptSyllables.length !== t.prompts.length) err(`self-check ${t.id}: scriptSyllables must cover every prompt`);
      if (Array.isArray(t.answers) && Array.isArray(t.scriptSyllables)) {
        t.answers.forEach((a, i) => {
          const syl = t.scriptSyllables[i];
          const base = stripMarks(syl);
          const tone = [...String(syl)].map((ch) => TONE_OF[ch]).find(Boolean) || 0;
          if (t.gradingMode === "initial" && !base.startsWith(String(a))) err(`self-check ${t.id} cell ${i + 1}: initial answer "${a}" does not match script syllable "${syl}"`);
          if (t.gradingMode === "final" && !base.endsWith(stripMarks(a))) err(`self-check ${t.id} cell ${i + 1}: final answer "${a}" does not match script syllable "${syl}"`);
          if (t.gradingMode === "tone" && a !== tone) err(`self-check ${t.id} cell ${i + 1}: tone answer ${a} does not match script syllable "${syl}" (tone ${tone})`);
        });
      }
      if (t.audioSegment) {
        const track = localTrackById.get(t.audioTrackId);
        const { start, end } = t.audioSegment;
        if (!(start >= 0 && end > start && track && end <= track.durationSec)) err(`self-check ${t.id}: audioSegment out of track range`);
      }
    } else {
      err(`self-check ${t.id}: unknown answerStatus "${t.answerStatus}"`);
    }
  }
  if (c.apply?.audioTrackId && !localTracks.has(c.apply.audioTrackId)) err(`${tag}: apply audioTrackId unknown`);
  if (c.apply) checkRefs(c.apply.sourceRefs, `${tag} apply`);
  summary.push(`${c.lessonId}: ${c.knowledgePoints.length} knowledge points, ${c.reader.sentences.length} sentences, ${c.exerciseSet.items.length} auto-graded exercises, ${c.selfCheckTasks.length} self-check tasks, ${c.reader.audioTracks.length} audio tracks`);
}
// No copied book/media assets may live in the repository data.
const raw = JSON.stringify(data);
if (/data:[a-z]+\/[a-z0-9.+-]+;base64,/i.test(raw)) err("content.json contains an embedded base64 payload — copied media is not allowed");

for (const w of warnings) console.log(`WARN: ${w}`);
if (errors.length) {
  for (const e of errors) console.error(`ERROR: ${e}`);
  console.error(`validate: FAILED with ${errors.length} error(s)`);
  process.exit(1);
}
console.log(`validate: OK — ${data.sources.length} sources, ${data.books.length} books, ${data.lessons.length} lessons | ${summary.join(" | ")}`);
