// Validator for data/content.json: schema shape, unique IDs, cross-references,
// source provenance and rights, audio segment timestamps.
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
const lessonIds = new Set();
for (const l of data.lessons || []) {
  if (!l.id || lessonIds.has(l.id)) err(`lesson id missing/duplicate: ${l.id}`);
  lessonIds.add(l.id);
  if (!bookIds.has(l.bookId)) err(`lesson ${l.id}: unknown bookId ${l.bookId}`);
  checkRefs(l.sourceRefs, `lesson ${l.id}`);
  if (l.publicationStatus === "pilot-ready" && l.id !== data.pilot.lessonId) err(`lesson ${l.id}: pilot-ready but not the pilot lesson`);
}
const pilot = data.pilot;
if (!pilot || !lessonIds.has(pilot.lessonId)) err("pilot.lessonId does not resolve");
const kpIds = new Set();
for (const kp of pilot.knowledgePoints || []) {
  if (!kp.id || kpIds.has(kp.id)) err(`knowledge point id missing/duplicate: ${kp.id}`);
  kpIds.add(kp.id);
  checkRefs(kp.sourceRefs, `knowledge ${kp.id}`);
  if (!kp.kindLabel) err(`knowledge ${kp.id}: kindLabel missing (must state its true role)`);
}
const sentenceIds = new Set((pilot.reader?.sentences || []).map((s) => s.id));
for (const s of pilot.reader?.sentences || []) {
  checkRefs(s.sourceRefs, `sentence ${s.id}`);
  if (!s.zh || !s.pinyin || !s.vi) err(`sentence ${s.id}: zh/pinyin/vi all required`);
}
for (const kp of pilot.knowledgePoints || []) {
  for (const sid of kp.sentenceIds || []) if (!sentenceIds.has(sid)) err(`knowledge ${kp.id}: unknown sentenceId ${sid}`);
  for (const eid of kp.exerciseIds || []) {
    if (!(pilot.exerciseSet.items || []).some((i) => i.id === eid)) err(`knowledge ${kp.id}: unknown exerciseId ${eid}`);
  }
}
for (const w of [...(pilot.prepWords || []), ...(pilot.reader?.vocab || [])]) {
  if (!w.zh || !w.pinyin || !w.vi) err(`word ${w.id}: zh/pinyin/vi all required`);
  checkRefs(w.sourceRefs, `word ${w.id}`);
}
const trackIds = new Set();
for (const t of pilot.reader?.audioTracks || []) {
  if (!t.id || trackIds.has(t.id)) err(`track id missing/duplicate: ${t.id}`);
  trackIds.add(t.id);
  if (!/^https:\/\/cdn\.baulchino\.com\//.test(t.url)) err(`track ${t.id}: audio must stream from the Baulchino source CDN`);
  if (!(t.durationSec > 0)) err(`track ${t.id}: durationSec must be positive`);
  for (const seg of t.segments || []) {
    if (seg.start < 0 || seg.end > t.durationSec || seg.start >= seg.end) err(`track ${t.id}: segment out of range`);
    if (t.segmentsStatus !== "verified") err(`track ${t.id}: segments present but segmentsStatus is not "verified"`);
  }
  if ((t.segments || []).length === 0 && t.segmentsStatus !== "unverified") err(`track ${t.id}: no segments but segmentsStatus is not "unverified"`);
}
for (const g of pilot.reader.passages || []) {
 if (!trackIds.has(g.audioTrackId)) err(`passage ${g.id}: missing track`);
 for (const id of g.sentenceIds) if (!sentenceIds.has(id)) err(`passage ${g.id}: missing sentence ${id}`);
 checkRefs(g.sourceRefs, `passage ${g.id}`);
}
const exIds = new Set();
for (const item of pilot.exerciseSet?.items || []) {
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
for (const t of pilot.selfCheckTasks || []) {
  if (t.answerStatus !== "unverified") err(`self-check ${t.id}: answerStatus must be "unverified" in this pilot`);
  if (t.audioTrackId && !trackIds.has(t.audioTrackId)) err(`self-check ${t.id}: unknown audioTrackId`);
  checkRefs(t.sourceRefs, `self-check ${t.id}`);
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
console.log(`validate: OK — ${data.sources.length} sources, ${data.books.length} books, ${data.lessons.length} lessons, ${pilot.knowledgePoints.length} knowledge points, ${pilot.reader.sentences.length} sentences, ${pilot.exerciseSet.items.length} auto-graded exercises, ${pilot.selfCheckTasks.length} self-check tasks, ${pilot.reader.audioTracks.length} audio tracks`);
