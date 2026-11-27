// HSK Lexical Guardrail & Multi-layer Lesson Context — READ-ONLY adapter over data/content.json.
//
// Real data shape (audited 2026-11-16, expanded 2026-11-27):
// - content.lessons[]: metadata {id, level: "HSK 1"|"HSK 2", lessonNumber, titleZh, titleVi, publicationStatus}
// - content.pilot + content.additionalLessons[]: per-lesson content with
//   intro {goalVi, leadVi, outcomesVi, studyTipVi, priorLessonNoteVi},
//   prepWords[] / foundationWords[] {id, zh, pinyin, vi, hanViet},
//   lookup.extras[] / lookup.phrases[],
//   knowledgePoints[] {id, kind, title, pattern, useWhenVi, explanationVi, examples},
//   reader {passages[], sentences[]},
//   apply {tasks[]},
//   summaryPoints[].
// This adapter NEVER mutates the source data.
//
// Coverage honesty: the repo currently ships HSK 1 (15 lessons) + HSK 2
// (7 lessons) content only. Selecting HSK3 therefore allows HSK1+HSK2 data
// (there is no HSK3 lexicon yet) — `coverageNote` says so in plain words.

const LEVEL_ORDER = { "HSK 1": 1, "HSK 2": 2, "HSK 3": 3 };
const MAX_PROMPT_CHARS = 19000; // safely below Worker MAX_SYSTEM_CHARS (24000)

export const PRACTICE_MODES = [
  { id: "teach", workerMode: "tutor", label: "Ôn & Dạy", icon: "📖", desc: "Giảng ngắn trọng tâm bài, liên hệ bài cũ và hỏi kiểm tra hiểu bài." },
  { id: "roleplay", workerMode: "roleplay", label: "Luyện nói (Đóng vai)", icon: "🎭", desc: "Hội thoại nhập vai ngắn 1–2 câu dùng từ & ngữ pháp của bài, có gợi ý khi bí." },
  { id: "correct", workerMode: "tutor", label: "Kiểm tra & Sửa lỗi", icon: "🩺", desc: "Phản hồi 3 bước: (1) Ghi nhận ý đúng, (2) Chỉ lỗi & liên hệ bài cũ, (3) Câu tự nhiên hơn." },
  { id: "translate", workerMode: "tutor", label: "Phản xạ dịch nhanh", icon: "⚡", desc: "Đưa câu tiếng Việt sát mẫu câu của bài để bạn nói/viết sang tiếng Trung và sửa ngay." },
];

export function practiceModeInfo(modeId) {
  return PRACTICE_MODES.find((m) => m.id === modeId) || PRACTICE_MODES[0];
}

export function normalizeLevel(level) {
  const s = String(level || "HSK1").toUpperCase().replace(/\s+/g, "");
  if (s === "HSK2") return "HSK 2";
  if (s === "HSK3") return "HSK 3";
  return "HSK 1";
}

export function compactLevelCode(level) {
  return normalizeLevel(level).replace(/\s+/g, "");
}

function clipText(str, maxLen) {
  const s = String(str || "").replace(/\s+/g, " ").trim();
  if (!s || s.length <= maxLen) return s;
  return s.slice(0, Math.max(0, maxLen - 1)).trimEnd() + "…";
}

function wordEntry(raw, level, lessonId, sourceKind) {
  if (!raw || typeof raw.zh !== "string" || !raw.zh.trim()) return null;
  return {
    hanzi: raw.zh.trim(),
    pinyin: String(raw.pinyin || ""),
    meaning_vi: String(raw.vi || ""),
    hanViet: String(raw.hanViet || ""),
    id: String(raw.id || ""),
    level,
    lessonId,
    sourceKind,
  };
}

function normalizeLessonDetail(rawContent, meta, orderIndex, cumulativeWords, cumulativeGrammar) {
  const intro = rawContent.intro || {};
  const sentences = rawContent.reader?.sentences || [];
  const sentenceMap = new Map(sentences.map((s) => [s.id, s]));
  const passages = (rawContent.reader?.passages || []).map((p) => {
    const pSentences = (p.sentenceIds || [])
      .map((id) => sentenceMap.get(id))
      .filter(Boolean)
      .map((s) => ({
        speaker: String(s.speaker || ""),
        zh: String(s.zh || ""),
        pinyin: String(s.pinyin || ""),
        vi: String(s.vi || ""),
      }));
    return {
      id: String(p.id || ""),
      title: String(p.title || p.titleVi || ""),
      context: String(p.context || ""),
      sentences: pSentences.length
        ? pSentences
        : sentences.filter((s) => s.passageId === p.id).map((s) => ({
            speaker: String(s.speaker || ""),
            zh: String(s.zh || ""),
            pinyin: String(s.pinyin || ""),
            vi: String(s.vi || ""),
          })),
    };
  });

  const prepWords = (rawContent.prepWords || []).map((w) => ({
    zh: String(w.zh || "").trim(),
    pinyin: String(w.pinyin || ""),
    vi: String(w.vi || ""),
    hanViet: String(w.hanViet || ""),
  })).filter((w) => w.zh);

  const foundationWords = (rawContent.foundationWords || []).map((w) => ({
    zh: String(w.zh || "").trim(),
    pinyin: String(w.pinyin || ""),
    vi: String(w.vi || ""),
  })).filter((w) => w.zh);

  const knowledgePoints = (rawContent.knowledgePoints || []).map((kp) => ({
    id: String(kp.id || ""),
    kind: String(kp.kind || "grammar"),
    kindLabel: String(kp.kindLabel || ""),
    title: String(kp.title || ""),
    pattern: String(kp.pattern || ""),
    useWhenVi: String(kp.useWhenVi || ""),
    explanationVi: String(kp.explanationVi || ""),
    examples: (kp.examples || []).map((ex) => ({
      zh: String(ex.zh || ""),
      pinyin: String(ex.pinyin || ""),
      vi: String(ex.noteVi || ex.vi || ""),
    })).filter((ex) => ex.zh),
  }));

  const applyTasks = (rawContent.apply?.tasks || []).map((t) => ({
    id: String(t.id || ""),
    titleVi: String(t.titleVi || ""),
    promptVi: String(t.promptVi || t.situationVi || ""),
    sampleZh: String(t.sampleZh || ""),
    samplePinyin: String(t.samplePinyin || ""),
    sampleVi: String(t.sampleVi || ""),
  }));

  const summaryPoints = (rawContent.summaryPoints || []).map((sp) => ({
    titleVi: String(sp.titleVi || ""),
    bodyVi: String(sp.bodyVi || ""),
    exampleZh: String(sp.exampleZh || ""),
    examplePinyin: String(sp.examplePinyin || ""),
    exampleVi: String(sp.exampleVi || ""),
  }));

  return {
    lessonId: rawContent.lessonId,
    level: meta?.level || "HSK 1",
    lessonNumber: meta?.lessonNumber || (orderIndex + 1),
    titleZh: String(meta?.titleZh || ""),
    titleVi: String(meta?.titleVi || ""),
    orderIndex,
    goalVi: String(intro.goalVi || ""),
    leadVi: String(intro.leadVi || ""),
    outcomesVi: Array.isArray(intro.outcomesVi) ? intro.outcomesVi.map(String) : [],
    studyTipVi: String(intro.studyTipVi || ""),
    priorLessonNoteVi: String(intro.priorLessonNoteVi || ""),
    prepWords,
    foundationWords,
    knowledgePoints,
    passages,
    allSentences: sentences.map((s) => ({
      speaker: String(s.speaker || ""),
      zh: String(s.zh || ""),
      pinyin: String(s.pinyin || ""),
      vi: String(s.vi || ""),
    })),
    applyTasks,
    summaryPoints,
    cumulativeWords: [...cumulativeWords],
    cumulativeGrammar: [...cumulativeGrammar],
  };
}

// Build the lexicon and read-only lesson index from parsed content.json.
// Pure function so tests can feed it the real file without mutating it.
export function buildLexicon(content) {
  const byHanzi = new Map();
  const words = [];
  const grammar = [];
  const lessons = [];
  const lessonDetails = new Map();
  const orderedLessonIds = [];

  if (!content || typeof content !== "object") {
    return { words, byHanzi, grammar, levelsPresent: [], lessons, lessonDetails, orderedLessonIds };
  }

  const rawContents = [content.pilot, ...(content.additionalLessons || [])].filter(Boolean);
  const rawByLessonId = new Map(rawContents.map((c) => [c.lessonId, c]));
  const metaList = Array.isArray(content.lessons) ? content.lessons : [];
  const levelOf = new Map(metaList.map((l) => [l.id, l.level]));
  const metaById = new Map(metaList.map((l) => [l.id, l]));

  const add = (entry) => {
    if (!entry) return;
    words.push(entry);
    // Official lesson vocabulary wins over extras/foundation duplicates.
    const prev = byHanzi.get(entry.hanzi);
    if (!prev || (prev.sourceKind !== "prepWords" && entry.sourceKind === "prepWords")) {
      byHanzi.set(entry.hanzi, entry);
    }
  };

  for (const c of rawContents) {
    const level = levelOf.get(c.lessonId) || "HSK 1";
    for (const w of c.prepWords || []) add(wordEntry(w, level, c.lessonId, "prepWords"));
    for (const w of c.foundationWords || []) add(wordEntry(w, level, c.lessonId, "foundationWords"));
    for (const w of c.lookup?.extras || []) add(wordEntry(w, level, c.lessonId, "lookupExtras"));
    for (const w of c.lookup?.phrases || []) add(wordEntry(w, level, c.lessonId, "lookupPhrases"));
    for (const kp of c.knowledgePoints || []) {
      grammar.push({
        id: String(kp.id || ""),
        title: String(kp.title || ""),
        pattern: String(kp.pattern || ""),
        explanationVi: String(kp.explanationVi || ""),
        level,
        lessonId: c.lessonId,
      });
    }
  }

  const cumulativeWordSet = new Set();
  const cumulativeGrammarList = [];
  for (const m of metaList) {
    const raw = rawByLessonId.get(m.id);
    const hasContent = Boolean(raw);
    lessons.push({
      id: m.id,
      level: m.level,
      lessonNumber: m.lessonNumber,
      titleZh: String(m.titleZh || ""),
      titleVi: String(m.titleVi || ""),
      publicationStatus: String(m.publicationStatus || ""),
      hasContent,
    });
    if (raw) {
      for (const w of [...(raw.prepWords || []), ...(raw.foundationWords || []), ...(raw.lookup?.extras || []), ...(raw.lookup?.phrases || [])]) {
        if (w?.zh && String(w.zh).trim()) cumulativeWordSet.add(String(w.zh).trim());
      }
      for (const kp of raw.knowledgePoints || []) {
        const gText = kp.pattern ? String(kp.pattern) : String(kp.title || "");
        if (gText) cumulativeGrammarList.push(gText);
      }
      const orderIndex = orderedLessonIds.length;
      orderedLessonIds.push(m.id);
      lessonDetails.set(m.id, normalizeLessonDetail(raw, metaById.get(m.id), orderIndex, cumulativeWordSet, cumulativeGrammarList));
    }
  }

  // Fallback in case any rawContent isn't listed in content.lessons
  for (const raw of rawContents) {
    if (!lessonDetails.has(raw.lessonId)) {
      const orderIndex = orderedLessonIds.length;
      orderedLessonIds.push(raw.lessonId);
      lessonDetails.set(raw.lessonId, normalizeLessonDetail(raw, metaById.get(raw.lessonId), orderIndex, cumulativeWordSet, cumulativeGrammarList));
    }
  }

  const levelsPresent = [...new Set(words.map((w) => w.level))].sort();
  return { words, byHanzi, grammar, levelsPresent, lessons, lessonDetails, orderedLessonIds };
}

let cachedLexicon = null;

// Load data/content.json once (relative to the site root) and build the index.
export async function loadLexicon(fetchFn = fetch) {
  if (cachedLexicon) return cachedLexicon;
  const res = await fetchFn("data/content.json");
  if (!res.ok) throw new Error("Không tải được dữ liệu từ vựng của app.");
  const content = await res.json();
  cachedLexicon = buildLexicon(content);
  return cachedLexicon;
}

export function getCachedLexicon() { return cachedLexicon; }

// Exact local dictionary lookup — returns the textbook's own pinyin and
// Vietnamese meaning, or null when the word is not in the HSK3.0 data.
export function lookupLocalWord(hanzi, lexicon = cachedLexicon) {
  if (!lexicon || !hanzi) return null;
  return lexicon.byHanzi.get(String(hanzi).trim()) || null;
}

export function allowedWords(level, lexicon = cachedLexicon) {
  if (!lexicon) return [];
  const max = LEVEL_ORDER[normalizeLevel(level)] || 1;
  return lexicon.words.filter((w) => (LEVEL_ORDER[w.level] || 1) <= max);
}

export function allowedGrammar(level, lexicon = cachedLexicon) {
  if (!lexicon) return [];
  const max = LEVEL_ORDER[normalizeLevel(level)] || 1;
  return lexicon.grammar.filter((g) => (LEVEL_ORDER[g.level] || 1) <= max);
}

export function coverageNote(level, lexicon = cachedLexicon) {
  const want = normalizeLevel(level);
  if (!lexicon) return "";
  if (want === "HSK 3" && !lexicon.levelsPresent.includes("HSK 3")) {
    return "Lưu ý: app hiện chưa có dữ liệu từ vựng/ngữ pháp HSK 3, nên ở cấp HSK 3 giáo viên AI tạm dùng vốn từ HSK 1 + HSK 2 của giáo trình.";
  }
  return "";
}

export function listLessons(lexicon = cachedLexicon, levelFilter = null) {
  if (!lexicon?.lessons) return [];
  const ready = lexicon.lessons.filter((l) => l.hasContent);
  if (!levelFilter) return ready;
  const norm = normalizeLevel(levelFilter);
  if (norm === "HSK 3" && !ready.some((l) => l.level === "HSK 3")) return [];
  return ready.filter((l) => l.level === norm);
}

export function getLessonContext(lessonId, lexicon = cachedLexicon) {
  if (!lexicon?.lessonDetails || !lessonId) return null;
  const current = lexicon.lessonDetails.get(lessonId);
  if (!current) return null;

  const idx = lexicon.orderedLessonIds.indexOf(lessonId);
  const prevIds = idx > 0 ? lexicon.orderedLessonIds.slice(Math.max(0, idx - 2), idx) : [];
  const prevLessons = prevIds.map((id) => lexicon.lessonDetails.get(id)).filter(Boolean);

  // Look up 1 immediate next lesson in the full syllabus (including catalogued-only titles).
  const metaIdx = lexicon.lessons.findIndex((l) => l.id === lessonId);
  const nextMeta = metaIdx >= 0 && metaIdx + 1 < lexicon.lessons.length ? lexicon.lessons[metaIdx + 1] : null;
  let nextLesson = null;
  if (nextMeta) {
    const nextDetail = lexicon.lessonDetails.get(nextMeta.id);
    nextLesson = {
      lessonId: nextMeta.id,
      level: nextMeta.level,
      lessonNumber: nextMeta.lessonNumber,
      titleZh: nextMeta.titleZh,
      titleVi: nextMeta.titleVi,
      topicSummaryVi: nextDetail ? clipText(nextDetail.goalVi || nextDetail.leadVi, 150) : "Chủ đề kế tiếp trong giáo trình (chưa mở nội dung chi tiết).",
    };
  }

  return { current, prevLessons, nextLesson };
}

function isEditorialNoteVi(vi) {
  return /trang in|chữ mẫu|thẻ từ|ví dụ trong sách|lược bỏ|nhóm âm tiết|bốn thanh|thanh mẫu|vận mẫu|bộ thủ|có bộ|nhờ ai làm gì|âm tiết|quy tắc|từ mới trọng tâm|chép mẫu/i.test(vi)
    || /\s—\s/.test(vi);
}

function cleanSeedVi(vi) {
  return String(vi || "")
    .replace(/\s*\([^)]*\)\s*/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function isNaturalSentencePair(zh, vi) {
  const z = String(zh || "").trim();
  const v = cleanSeedVi(vi);
  if (!z || !v || z === "—") return false;
  if (!/[\u4e00-\u9fff]/.test(z)) return false;
  if (isEditorialNoteVi(v)) return false;
  if (v.length < 8 || v.length > 90) return false;
  return true;
}

export function lessonReplyHints(lessonId, practiceMode = "roleplay", lexicon = cachedLexicon) {
  const ctx = getLessonContext(lessonId, lexicon);
  if (!ctx?.current) return [];
  const cur = ctx.current;
  const hints = [];
  const seen = new Set();
  const pushHint = (zh, pinyin, vi, tag) => {
    const clean = String(zh || "").trim();
    const cleanVi = cleanSeedVi(vi);
    if (!clean || seen.has(clean) || isEditorialNoteVi(cleanVi)) return;
    seen.add(clean);
    hints.push({ zh: clean, pinyin: String(pinyin || ""), vi: cleanVi, tag });
  };

  for (const t of cur.applyTasks) {
    if (t.sampleZh) {
      const firstLine = t.sampleZh.split(/\n+/)[0].replace(/^[^：:]+[：:]\s*/, "");
      pushHint(firstLine, t.samplePinyin?.split(/\n+/)[0] || "", t.sampleVi?.split(/\n+/)[0] || t.titleVi, "Mẫu tự nói");
    }
  }
  for (const s of cur.allSentences.slice(0, 6)) {
    if (s.zh.length >= 4) pushHint(s.zh, s.pinyin, s.vi, "Bài khóa");
  }
  for (const kp of cur.knowledgePoints) {
    if (kp.kind === "foundation" || kp.kind === "foundation-characters") continue;
    for (const ex of kp.examples.slice(0, 2)) {
      if (isNaturalSentencePair(ex.zh, ex.vi)) pushHint(ex.zh, ex.pinyin, ex.vi, kp.title);
    }
  }
  if (hints.length < 6 && practiceMode !== "translate") {
    for (const w of cur.prepWords.slice(0, 4)) {
      pushHint(w.zh, w.pinyin, w.vi, "Từ mới");
    }
  }
  return hints.slice(0, 6);
}

function lessonRoleplayOpeningFromDetail(cur) {
  if (!cur) return null;
  const p0 = cur.passages[0];
  const firstSent = p0?.sentences?.[0] || cur.allSentences[0];
  const task0 = cur.applyTasks[0];
  const lessonLabel = `${cur.level} · Bài ${String(cur.lessonNumber).padStart(2, "0")}`;
  return {
    titleVi: `Theo ngữ cảnh ${lessonLabel}: ${cur.titleVi}`,
    aiRoleVi: firstSent?.speaker ? `${firstSent.speaker} (trong bài khóa ${lessonLabel})` : `Bạn đối thoại cùng học viên (${lessonLabel})`,
    aiRoleZh: firstSent?.speaker || "中国朋友",
    learnerRoleVi: `Người học thực hành giao tiếp tình huống "${cur.titleVi}"`,
    tasksVi: cur.applyTasks.length
      ? cur.applyTasks.map((t) => t.promptVi || t.titleVi).filter(Boolean).slice(0, 3)
      : (cur.outcomesVi.slice(0, 3).length ? cur.outcomesVi.slice(0, 3) : [`Ứng dụng từ mới và mẫu câu của ${lessonLabel}`]),
    opening: firstSent
      ? { hanzi: firstSent.zh, pinyin: firstSent.pinyin, translation_vi: firstSent.vi }
      : { hanzi: "你好！今天我们一起练习这一课吧。", pinyin: "Nǐ hǎo! Jīntiān wǒmen yìqǐ liànxí zhè yí kè ba.", translation_vi: "Xin chào! Hôm nay chúng ta cùng luyện bài này nhé." },
    suggestedWords: cur.prepWords.slice(0, 8).map((w) => w.zh),
    contextVi: p0?.context || task0?.promptVi || cur.leadVi,
  };
}

export function lessonRoleplayOpening(lessonId, lexicon = cachedLexicon) {
  const ctx = getLessonContext(lessonId, lexicon);
  return lessonRoleplayOpeningFromDetail(ctx?.current);
}

export function lessonTranslateSeeds(lessonId, lexicon = cachedLexicon) {
  const ctx = getLessonContext(lessonId, lexicon);
  if (!ctx?.current) return [];
  const cur = ctx.current;
  const deck = [];
  const seenZh = new Set();
  const seenVi = new Set();

  const addItem = (zh, pinyin, vi, note, kpId = "") => {
    const cleanZh = String(zh || "").trim();
    const cleanVi = cleanSeedVi(vi);
    if (!isNaturalSentencePair(cleanZh, cleanVi)) return false;
    if (cleanZh.length < 3 || seenZh.has(cleanZh) || seenVi.has(cleanVi)) return false;
    seenZh.add(cleanZh);
    seenVi.add(cleanVi);
    deck.push({
      id: `${lessonId}-drill-${deck.length + 1}`,
      vi: cleanVi,
      refZh: cleanZh,
      refPinyin: String(pinyin || "").trim(),
      note: stripChineseMetaTerms(note || "Mẫu câu bài học"),
      kpId,
    });
    return true;
  };

  // 1. Pick up to 2 representative examples per main grammar point so all grammar targets are covered.
  const mainKps = cur.knowledgePoints.filter((kp) => kp.kind !== "foundation" && kp.kind !== "foundation-characters");
  for (const kp of mainKps) {
    let pickedForKp = 0;
    for (const ex of kp.examples) {
      if (addItem(ex.zh, ex.pinyin, ex.vi, kp.title, kp.id)) {
        pickedForKp += 1;
        if (pickedForKp >= 1) break;
      }
    }
  }

  // 2. Prioritize authentic dialogue sentences containing negative / question / lesson patterns
  //    (e.g. 没做完, 没想好, 为什么, 洗好了) to ensure traps and questions are practiced.
  const rankedSents = [...cur.allSentences].sort((a, b) => {
    const score = (s) => {
      let sc = 0;
      if (/[吗呢吧？?]/.test(s.zh)) sc += 3;
      if (/没|不|为什么/.test(s.zh)) sc += 4;
      if (s.zh.length >= 6 && s.zh.length <= 24) sc += 2;
      return sc;
    };
    return score(b) - score(a);
  });
  for (const s of rankedSents) {
    if (deck.length >= 8) break;
    addItem(s.zh, s.pinyin, s.vi, "Bài khóa");
  }

  // 3. Second pass over remaining KP examples & summaryPoints / applyTasks if < 8
  for (const kp of mainKps) {
    if (deck.length >= 8) break;
    for (const ex of kp.examples) {
      if (deck.length >= 8) break;
      addItem(ex.zh, ex.pinyin, ex.vi, kp.title, kp.id);
    }
  }
  for (const sp of cur.summaryPoints) {
    if (deck.length >= 8) break;
    addItem(sp.exampleZh, sp.examplePinyin, sp.exampleVi, sp.titleVi || "Trọng tâm bài");
  }
  for (const t of cur.applyTasks) {
    if (deck.length >= 8) break;
    if (t.sampleZh && t.sampleVi) {
      const z0 = t.sampleZh.split(/\n+/)[0].replace(/^[^：:]+[：:]\s*/, "");
      const p0 = t.samplePinyin?.split(/\n+/)[0].replace(/^[^：:]+[：:]\s*/, "") || "";
      const v0 = t.sampleVi.split(/\n+/)[0].replace(/^[^：:]+[：:]\s*/, "");
      addItem(z0, p0, v0, t.titleVi || "Mẫu tự nói");
    }
  }
  return deck.slice(0, 8);
}

export function resolveDrillPassed(data) {
  if (!data || typeof data !== "object") return false;
  if (typeof data.passed === "boolean") return data.passed;
  const ev = data.evaluation || {};
  if (typeof ev.passed === "boolean") return ev.passed;
  return ev.has_error === false && ev.pronunciation_status !== "uncertain";
}

// Segment a Chinese string into clickable tokens by longest-match against
// the local lexicon (falls back to single characters). Pure, testable.
export function segmentByLexicon(text, lexicon = cachedLexicon) {
  const s = String(text || "");
  if (!lexicon || !s) return [{ text: s, entry: null }];
  const out = [];
  let i = 0;
  while (i < s.length) {
    let matched = null;
    for (let len = Math.min(6, s.length - i); len >= 2; len--) {
      const cand = s.slice(i, i + len);
      const entry = lexicon.byHanzi.get(cand);
      if (entry) { matched = { text: cand, entry }; break; }
    }
    if (matched) { out.push(matched); i += matched.text.length; }
    else {
      const ch = s[i];
      out.push({ text: ch, entry: lexicon.byHanzi.get(ch) || null });
      i += 1;
    }
  }
  // Merge consecutive non-word characters into one plain token.
  const merged = [];
  for (const t of out) {
    const last = merged[merged.length - 1];
    if (last && !last.entry && !t.entry) last.text += t.text;
    else merged.push({ ...t });
  }
  return merged;
}

function stripChineseMetaTerms(text) {
  return String(text || "")
    .replace(/[（(]\s*(?:兼语句|提手旁|两点水|三点水|宝盖头|跟读绕口令|听读练|抄写字词|氵|扌|冫)\s*[）)]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function formatLessonContextLines(ctx) {
  const cur = ctx.current;
  const lines = [];
  const label = `${cur.level} · Bài ${String(cur.lessonNumber).padStart(2, "0")}: ${cur.titleZh} (${cur.titleVi})`;
  lines.push(`=== BÀI ĐANG CHỌN: ${label} ===`);
  if (cur.goalVi) lines.push(`MỤC TIÊU BÀI HỌC: ${cur.goalVi}`);
  if (cur.outcomesVi.length) lines.push(`MỤC TIÊU NÓI & ĐẦU RA: ${cur.outcomesVi.join(" | ")}`);
  if (cur.applyTasks.length) {
    lines.push(`NHIỆM VỤ TỰ NÓI CỦA BÀI: ${cur.applyTasks.map((t) => `${t.titleVi}: ${clipText(t.promptVi, 140)}`).join(" || ")}`);
  }

  const vocabPairs = cur.prepWords.map((w) => `${w.zh}(${w.pinyin}:${w.vi})`);
  const foundPairs = cur.foundationWords.slice(0, 12).map((w) => `${w.zh}(${w.pinyin}:${w.vi})`);
  if (vocabPairs.length) lines.push(`TỪ VỰNG TRỌNG TÂM CỦA BÀI: ${vocabPairs.join("; ")}`);
  if (foundPairs.length) lines.push(`TỪ NỀN TẢNG CỦA BÀI: ${foundPairs.join("; ")}`);

  // Grammar + Pitfalls (strip Chinese linguistic jargon so Gemini doesn't echo it)
  const kpLines = cur.knowledgePoints.map((kp) => {
    const isCharNote = kp.kind === "foundation" || kp.kind === "foundation-characters";
    const explMax = isCharNote ? 120 : 280;
    const parts = [stripChineseMetaTerms(kp.title)];
    if (kp.pattern) parts.push(`Mẫu: ${stripChineseMetaTerms(kp.pattern)}`);
    if (kp.useWhenVi && !isCharNote) parts.push(`Khi dùng: ${clipText(stripChineseMetaTerms(kp.useWhenVi), 140)}`);
    if (kp.explanationVi) parts.push(`Giải thích/Lưu ý: ${clipText(stripChineseMetaTerms(kp.explanationVi), explMax)}`);
    if (!isCharNote && kp.examples.length) {
      const cleanEx = kp.examples.filter((e) => isNaturalSentencePair(e.zh, e.vi)).slice(0, 2);
      if (cleanEx.length) parts.push(`VD: ${cleanEx.map((e) => `${e.zh} (${cleanSeedVi(e.vi)})`).join(" / ")}`);
    }
    return `- ${parts.join(" | ")}`;
  });
  if (kpLines.length) lines.push(`NGỮ PHÁP & KIẾN THỨC BÀI NÀY:\n${kpLines.join("\n")}`);

  const trapLines = [];
  if (cur.studyTipVi) trapLines.push(`Mẹo & bẫy trọng tâm: ${stripChineseMetaTerms(cur.studyTipVi)}`);
  for (const sp of cur.summaryPoints) {
    if (sp.bodyVi && /bẫy|sai|lưu ý|nhầm|không/i.test(sp.bodyVi)) {
      trapLines.push(`${stripChineseMetaTerms(sp.titleVi)}: ${clipText(stripChineseMetaTerms(sp.bodyVi), 240)}`);
    }
  }
  if (trapLines.length) lines.push(`BẪY LỖI HAY SAI CẦN SOI KỸ:\n- ${trapLines.join("\n- ")}`);

  if (cur.passages.length) {
    const pText = cur.passages.map((p) => {
      const sents = p.sentences.map((s) => `${s.speaker ? s.speaker + ": " : ""}${s.zh}`).join(" / ");
      return `[${p.title}${p.context ? " — " + clipText(p.context, 80) : ""}]: ${sents}`;
    }).join("\n");
    lines.push(`BÀI KHÓA / HỘI THOẠI CỦA BÀI:\n${pText}`);
  }

  // Layer 2: 1-2 previous lessons for natural recycling and contrast
  if (ctx.prevLessons.length) {
    const prevBlock = ctx.prevLessons.map((p) => {
      const pTitle = `${p.level} Bài ${String(p.lessonNumber).padStart(2, "0")} (${p.titleZh} — ${p.titleVi})`;
      const pVocab = p.prepWords.map((w) => `${w.zh}(${w.vi})`).join("、");
      const pGram = p.knowledgePoints
        .filter((k) => k.kind !== "foundation" && k.kind !== "foundation-characters")
        .map((k) => stripChineseMetaTerms(k.pattern || k.title))
        .join("; ");
      return `- ${pTitle}: Từ [${pVocab}] | Ngữ pháp [${pGram}]`;
    }).join("\n");
    lines.push(
      `=== BÀI LIỀN TRƯỚC (1–2 bài trước, dùng để tái sử dụng từ cũ & so sánh đối chiếu) ===\n${prevBlock}`,
      "HƯỚNG DẪN LIÊN KẾT BÀI CŨ: Tự nhiên lồng ghép từ vựng của các bài trước vào câu hỏi/ví dụ, và khi giảng hoặc sửa lỗi hãy so sánh đối chiếu điểm mới của bài này với cấu trúc bài trước bằng tiếng Việt dễ hiểu.",
    );
  }

  // Layer 3: 1 next lesson (title/topic summary ONLY — never teach ahead!)
  if (ctx.nextLesson) {
    const n = ctx.nextLesson;
    lines.push(
      `=== BÀI TIẾP THEO (CHỈ TÓM TẮT TIÊU ĐỀ/CHỦ ĐỀ) ===\n- ${n.level} Bài ${String(n.lessonNumber).padStart(2, "0")}: ${n.titleZh} (${n.titleVi}) — ${n.topicSummaryVi}`,
      "QUY TẮC BÀI SAU: TUYỆT ĐỐI KHÔNG dạy trước từ mới hoặc cấu trúc ngữ pháp của bài tiếp theo gây quá tải. Chỉ dùng chủ đề bài tiếp theo để gợi mở nhẹ hoặc trả lời ngắn gọn khi học viên chủ động hỏi mở rộng.",
    );
  }
  return lines;
}

const PEDAGOGICAL_LANGUAGE_RULES = [
  "NGUYÊN TẮC SƯ PHẠM & NGÔN NGỮ (BẮT BUỘC TUYỆT ĐỐI):",
  "1. TÁCH RÕ 2 PHẦN: (a) tutor_reply.hanzi (+ tutor_reply.pinyin) CHỈ dùng cho câu hội thoại thực tế, tự nhiên chuẩn bản xứ để học viên nghe và nói theo (1–2 câu ngắn). (b) Mọi lời nhận xét, chỉ lỗi, giải thích ngữ pháp và hướng dẫn ĐỀU viết bằng TIẾNG VIỆT tự nhiên, gần gũi như giáo viên thật trong evaluation.explanation_vi và tutor_reply.translation_vi.",
  "2. TUYỆT ĐỐI CẤM THUẬT NGỮ TIẾNG TRUNG KHÓ: Không bao giờ viết các từ thuật ngữ ngữ pháp hoặc chỉ dẫn học thuật bằng chữ Hán như 补语, 表示, 翻译, 语法, 结构, 动词, 名词, 形容词, 重叠, 兼语句, 主语, 谓语, 宾语, 肯定, 否定, 错误, 应该, 意思是, 请翻译 — cả trong tutor_reply.hanzi lẫn trong giải thích tiếng Việt!",
  "3. CHỌN KẾT HỢP TỪ & GIẢI THÍCH CHUẨN BẢN XỨ: Luôn dùng cách nói tự nhiên của người Trung Quốc (ví dụ xong xuôi việc chuẩn bị như mua vé/nấu cơm/rửa quả/nghĩ kỹ dùng 好: 我买好票了, 菜做好了, 苹果洗好了, 我想好了; ăn hết/làm hết lượng việc dùng 完: 吃完饭, 做完工作). Khi giải thích ghép động từ với 好/完/晚, nói rõ là gắn chữ 好 hoặc 完 ngay sau động từ (ví dụ 做 + 完 = 做完, 买 + 好 = 买好), tuyệt đối KHÔNG viết nhầm là 'thêm 完了 sau động từ'.",
  "4. KHÔNG KÝ HIỆU THỪA TRONG CÂU ĐỌC: tutor_reply.hanzi chỉ gồm chữ Hán và dấu câu tự nhiên (，。！？), không chèn tiếng Việt, pinyin, số mục (1)(2)(3), ngoặc đơn chú thích hay emoji.",
].join("\n");

function buildModeDirectives(practiceMode, mode, scenario, ctx, pendingPromptVi, expectedAnswerZh = "", isStarter = false, lexicon = cachedLexicon) {
  const effectivePractice = practiceMode || (mode === "roleplay" ? "roleplay" : "teach");

  if (effectivePractice === "roleplay") {
    const lessonRole = ctx?.current ? lessonRoleplayOpeningFromDetail(ctx.current) : null;
    const activeRole = scenario || lessonRole;
    if (activeRole) {
      return [
        `CHẾ ĐỘ LUYỆN NÓI (ĐÓNG VAI): Bạn đóng vai ${activeRole.aiRoleZh} (${activeRole.aiRoleVi}). Học viên đóng vai: ${activeRole.learnerRoleVi}.`,
        `Tình huống: ${activeRole.titleVi}. Nhiệm vụ của học viên: ${(activeRole.tasksVi || []).join("; ")}.`,
        "tutor_reply.hanzi phải GIỮ 100% VAI DIỄN bằng tiếng Trung tự nhiên như nhân vật thật — TUYỆT ĐỐI không chèn tiếng Việt, không giảng ngữ pháp trong lời thoại nhân vật.",
        "Mỗi lượt chỉ nói 1–2 câu tiếng Trung ngắn gọn, tự nhiên, ưu tiên tối đa từ vựng & mẫu câu của bài đang chọn để học viên dễ nghe và đáp lại.",
        "Nếu học viên mắc lỗi, sửa ngắn gọn bằng tiếng Việt tự nhiên trong evaluation.explanation_vi rồi tiếp tục mạch hội thoại tự nhiên trong tutor_reply.hanzi.",
      ];
    }
    return [
      "CHẾ ĐỘ LUYỆN NÓI (ĐÓNG VAI): tutor_reply.hanzi GIỮ 100% VAI DIỄN bằng tiếng Trung (1–2 câu ngắn tự nhiên), dẫn dắt học viên dùng từ vựng và ngữ pháp của bài đang chọn.",
    ];
  }

  if (effectivePractice === "correct") {
    return [
      "CHẾ ĐỘ KIỂM TRA & SỬA LỖI (SƯ PHẠM TỰ NHIÊN):",
      "Mỗi khi học viên gửi câu (nói hoặc gõ), bạn PHẢI phản hồi rõ 2 phần:",
      "- Phần tiếng Việt trong evaluation.explanation_vi theo 2 ý ngắn gọn, gần gũi: `(1) Ghi nhận: ... (2) Sửa lỗi: ...`.",
      "  + Ở (1) Ghi nhận: khen cụ thể phần học viên đã nói đúng ý hoặc dùng đúng từ.",
      "  + Ở (2) Sửa lỗi: chỉ rõ lỗi dùng từ, trật tự câu hoặc thanh điệu (chỉ nhận xét phát âm khi có ÂM THANH thật), giải thích hoàn toàn bằng tiếng Việt đời thường dễ hiểu (ví dụ: 'mua xong vé người bản xứ nói là 买好票 chứ không nói 买完票') và liên hệ bài trước nếu phù hợp; không dùng chữ Hán học thuật như 补语 hay 表示. Nếu câu đã đúng, ghi `(2) Nhận xét: Câu đúng và dễ hiểu rồi, có thể nói tự nhiên hơn như câu mẫu bên trên.`",
      "- Phần tiếng Trung trong tutor_reply.hanzi: CHỈ đặt 1–2 câu tiếng Trung chuẩn bản xứ tự nhiên nhất để học viên nghe và nói theo (ví dụ: `我买好票了！你跟我说一遍吧。`), KHÔNG chèn số `(3)` hay tiếng Việt vào tutor_reply.hanzi.",
      "- Trong tutor_reply.translation_vi: ghi `(3) Câu tự nhiên hơn & lặp lại:` kèm nghĩa tiếng Việt tự nhiên của câu tiếng Trung vừa đưa.",
    ];
  }

  if (effectivePractice === "translate") {
    const lines = [
      "CHẾ ĐỘ PHẢN XẠ DỊCH NHANH (VIỆT → TRUNG, ĐỀ BÀI DO HỆ THỐNG QUẢN LÝ):",
      "Nhiệm vụ của bạn ở lượt này: CHỈ chấm câu tiếng Trung học viên vừa nói/viết so với CÂU TIẾNG VIỆT ĐỀ BÀI hiện tại và phản hồi thật ngắn gọn, chính xác.",
      "- TUYỆT ĐỐI KHÔNG tự bịa hay đưa ra câu đề bài tiếng Việt mới — hệ thống bài tập sẽ tự chuyển câu tiếp theo dựa trên kết quả đánh giá của bạn!",
      "- Đánh giá passed & evaluation.has_error:",
      "  + Đặt passed=true (và evaluation.has_error=false, error_type='none', corrected_hanzi='') KHI học viên dịch đúng ý, đúng mẫu câu & từ vựng trong phạm vi bài học (hoặc bài trước), và phát âm rõ đạt (nếu gửi giọng nói). Chấp nhận các cách diễn đạt tự nhiên tương đương đúng ngữ pháp bài.",
      "  + Đặt passed=false (và evaluation.has_error=true) CHỈ KHI sai nghĩa, sai ngữ pháp, dùng nhầm từ, hoặc phát âm/thanh điệu còn lỗi rõ.",
      "- CHỐNG LỘ ĐÁP ÁN & SẠCH KÝ TỰ:",
      "  + Khi học viên ĐÚNG (passed=true / has_error=false): tutor_reply.hanzi CHỈ nói 1 câu khen ngắn tự nhiên bằng tiếng Trung (ví dụ: `对，很好！` hoặc `说得很自然！`), tutor_reply.translation_vi khen ngắn bằng tiếng Việt (ví dụ: `Chuẩn rồi! Chuyển sang câu tiếp theo nhé.`). KHÔNG nhắc tới hay viết tiếng Trung của bất kỳ câu nào khác!",
      "  + Khi học viên SAI (passed=false / has_error=true): tutor_reply.hanzi CHỈ đọc câu sửa đúng hoàn chỉnh của CHÍNH câu hiện tại (ví dụ: `我还没吃完饭。`), evaluation.explanation_vi giải thích ngắn 1–2 câu bằng tiếng Việt tự nhiên (chính xác như: thêm 完 ngay sau 做 thành 做完, không ghi nhầm là 完了; phủ định với 没 phải bỏ 了), và tutor_reply.translation_vi mời học viên nói lại câu vừa sửa.",
    ];
    if (pendingPromptVi) {
      lines.push(`CÂU TIẾNG VIỆT ĐỀ BÀI HỌC VIÊN ĐANG TRẢ LỜI: "${pendingPromptVi}".`);
    }
    if (expectedAnswerZh) {
      lines.push(`ĐÁP ÁN THAM KHẢO CỦA ĐỀ BÀI (chỉ dùng để đối chiếu chấm đúng/sai hoặc hiện khi học viên sai; KHÔNG tự bịa câu khác): "${expectedAnswerZh}".`);
    }
    return lines;
  }

  // Default: teach (Ôn & Dạy)
  const mainKps = ctx?.current
    ? ctx.current.knowledgePoints.filter((k) => k.kind !== "foundation" && k.kind !== "foundation-characters")
    : [];
  const kpSummaryPrompt = mainKps.length
    ? `CÁC ĐIỂM NGỮ PHÁP CHÍNH CỦA BÀI BẮT BUỘC PHẢI TÓM TẮT ĐẦY ĐỦ (không bỏ sót điểm nào):\n${mainKps.map((k, i) => `${i + 1}. ${stripChineseMetaTerms(k.title)}${k.pattern ? ` (${stripChineseMetaTerms(k.pattern)})` : ""}`).join("\n")}`
    : "";
  const prevTitle = ctx?.prevLessons?.length
    ? `${ctx.prevLessons[ctx.prevLessons.length - 1].level} Bài ${String(ctx.prevLessons[ctx.prevLessons.length - 1].lessonNumber).padStart(2, "0")} (${ctx.prevLessons[ctx.prevLessons.length - 1].titleZh})`
    : "";

  return [
    "CHẾ ĐỘ ÔN & DẠY (GIÁO VIÊN SƯ PHẠM GẦN GŨI):",
    ...(kpSummaryPrompt ? [kpSummaryPrompt] : []),
    ...(isStarter ? [
      "LƯỢT MỞ ĐẦU GIẢNG BÀI: Học viên vừa bấm yêu cầu tóm tắt và giảng bài (chưa trả lời câu tiếng Trung nào). BẮT BUỘC đặt evaluation.has_error=false, error_type='none', corrected_hanzi='', corrected_pinyin='', explanation_vi='', pronunciation_status='not_assessed', pronunciation_feedback_vi=''.",
    ] : []),
    "- Ở lượt mở đầu giảng bài, tutor_reply.translation_vi PHẢI trình bày gọn gàng theo đúng cấu trúc:",
    `  + 3–4 gạch đầu dòng tiếng Việt ngắn gọn (mỗi dòng 1 câu súc tích bắt đầu bằng "- ") tóm tắt ĐẦY ĐỦ toàn bộ các điểm ngữ pháp chính của bài vừa liệt kê${prevTitle ? `, kèm 1 câu liên hệ tự nhiên với ${prevTitle}` : ""}. Giải thích bằng tiếng Việt đời thường, tuyệt đối không dùng thuật ngữ chữ Hán.`,
    "  + Kết thúc bằng 1 dòng riêng ghi rõ mẫu câu cần dùng cho câu hỏi kiểm tra (ví dụ: `👉 Thực hành: Em hãy dùng mẫu \"还是……吧\" để đề xuất đi taxi đến Đại học Bắc Kinh nhé!`).",
    "- Phần tiếng Trung (tutor_reply.hanzi): CHỈ chứa 1–2 câu tiếng Trung tự nhiên ngắn gọn gắn trực tiếp với đúng 1 trong các điểm ngữ pháp vừa giảng (ví dụ đặt 1 câu hỏi tình huống ngắn để học viên vận dụng đúng mẫu câu đã chỉ dẫn ở mục Thực hành). Tuyệt đối không giảng ngữ pháp bằng tiếng Trung trong tutor_reply.hanzi.",
    "- Khi học viên gửi câu trả lời tiếng Trung ở các lượt sau: khen/chỉ lỗi ngắn gọn bằng tiếng Việt tự nhiên trong evaluation.explanation_vi rồi gợi mở sang điểm ngữ pháp tiếp theo của bài.",
  ];
}

export function buildSystemInstruction({
  level,
  mode = "tutor",
  practiceMode = null,
  lessonId = null,
  scenario = null,
  pendingPromptVi = "",
  expectedAnswerZh = "",
  isStarter = false,
  lexicon = cachedLexicon,
} = {}) {
  const ctx = lessonId ? getLessonContext(lessonId, lexicon) : null;
  const lvl = normalizeLevel(level || (ctx?.current?.level || "HSK1"));

  // Backward-compatible compact mode when called without lessonId or practiceMode
  // (keeps existing unit tests under 10,000 chars and exact assertions intact).
  if (!ctx && !practiceMode) {
    const words = allowedWords(lvl, lexicon);
    const grammar = allowedGrammar(lvl, lexicon);
    const wordList = [...new Set(words.map((w) => w.hanzi))].join("、");
    const grammarList = grammar.map((g) => (g.pattern ? g.pattern : g.title)).join("; ");
    const lines = [
      `Bạn là giáo viên tiếng Trung cho người Việt đang học ở cấp ${lvl} theo giáo trình HSK 3.0 (New HSK Course).`,
      `VỐN TỪ ĐƯỢC PHÉP (chỉ dùng các từ trong danh sách này khi nói tiếng Trung; đây là từ vựng chính thức của giáo trình tới cấp ${lvl}): ${wordList || "(chưa tải được)"}.`,
      `ĐIỂM NGỮ PHÁP ĐƯỢC PHÉP: ${grammarList || "(chưa tải được)"}.`,
      "Không tự ý dùng từ vượt cấp. Nếu bắt buộc phải dùng một từ ngoài danh sách để câu tự nhiên, vẫn dùng nhưng PHẢI liệt kê từ đó vào tutor_reply.out_of_level_words kèm pinyin và nghĩa tiếng Việt.",
      "Câu trả lời của bạn phải là JSON đúng schema đã cho, không thêm chữ ngoài JSON.",
      "tutor_reply.pinyin phải có dấu thanh đầy đủ; tutor_reply.translation_vi là bản dịch tiếng Việt của chính câu đó.",
      "user_transcript_hanzi/pinyin: chép lại đúng câu người học vừa nói/nhập (nếu họ nhập chữ sẵn thì chép nguyên văn).",
      "evaluation: nếu câu của người học đúng, has_error=false, error_type='none', corrected_hanzi/corrected_pinyin để trống, explanation_vi khen ngắn gọn hoặc để trống.",
      "Nếu có lỗi: corrected_hanzi là câu sửa đúng hoàn chỉnh, explanation_vi giải thích ngắn gọn bằng tiếng Việt, tối đa 1–2 lỗi quan trọng nhất.",
    ];
    const note = coverageNote(lvl, lexicon);
    if (note) lines.push(note.replace(/^Lưu ý: /, "LƯU Ý DỮ LIỆU: "));
    if (mode === "roleplay" && scenario) {
      lines.push(
        `CHẾ ĐỘ NHẬP VAI: Bạn đóng vai ${scenario.aiRoleZh} (${scenario.aiRoleVi}). Người học đóng vai: ${scenario.learnerRoleVi}.`,
        `Tình huống: ${scenario.titleVi}. Nhiệm vụ của người học: ${scenario.tasksVi.join("; ")}.`,
        "tutor_reply.hanzi phải GIỮ 100% VAI DIỄN bằng tiếng Trung tự nhiên như nhân vật thật — TUYỆT ĐỐI không chèn tiếng Việt, không giải thích ngữ pháp trong lời thoại nhân vật.",
        "Mọi phân tích lỗi chỉ đặt trong evaluation.explanation_vi (tiếng Việt). Sau khi sửa ngắn gọn, tiếp tục mạch hội thoại của nhân vật.",
        "Giữ câu thoại ngắn (1–2 câu), đúng cấp độ, và chủ động dẫn dắt để người học hoàn thành lần lượt 3 nhiệm vụ của tình huống.",
      );
    } else {
      lines.push(
        "CHẾ ĐỘ GIÁO VIÊN: tutor_reply.hanzi là câu tiếng Trung mẫu/tiếp nối của giáo viên (vẫn chỉ bằng tiếng Trung); phần hướng dẫn thêm bằng tiếng Việt đặt trong translation_vi khi cần.",
        "Khuyến khích người học nói tiếp bằng một câu hỏi mở ngắn, đúng cấp độ.",
      );
    }
    return lines.join("\n");
  }

  // Pedagogical lesson-aware instruction
  const activeWordList = ctx?.current
    ? ctx.current.cumulativeWords.join("、")
    : [...new Set(allowedWords(lvl, lexicon).map((w) => w.hanzi))].join("、");
  const activeGrammarList = ctx?.current
    ? ctx.current.cumulativeGrammar.join("; ")
    : allowedGrammar(lvl, lexicon).map((g) => (g.pattern ? g.pattern : g.title)).join("; ");

  const lines = [
    `Bạn là giáo viên tiếng Trung sư phạm cho người Việt theo giáo trình HSK 3.0 (New HSK Course), đang dạy ở cấp ${lvl}.`,
    `VỐN TỪ ĐƯỢC PHÉP (ưu tiên dùng các từ học viên đã học tới bài này): ${activeWordList || "(chưa tải được)"}.`,
    `KHUNG NGỮ PHÁP ĐÃ HỌC TỚI ĐÂY: ${activeGrammarList || "(chưa tải được)"}.`,
    "Không tự ý dùng từ vượt cấp. Nếu bắt buộc phải dùng từ ngoài vốn từ cho phép để câu tự nhiên, vẫn dùng nhưng PHẢI liệt kê từ đó vào tutor_reply.out_of_level_words kèm pinyin và nghĩa tiếng Việt.",
    "Câu trả lời PHẢI là JSON đúng schema đã cho, không thêm chữ ngoài JSON; giữ phần tiếng Việt súc tích để không bị cắt ngắn ở 800 tokens.",
    "tutor_reply.pinyin phải có dấu thanh đầy đủ; user_transcript_hanzi/pinyin chép lại đúng câu học viên vừa nói/nhập.",
    "evaluation: khi không có lỗi thì has_error=false, error_type='none', corrected_hanzi/corrected_pinyin để trống.",
    PEDAGOGICAL_LANGUAGE_RULES,
  ];

  const note = coverageNote(lvl, lexicon);
  if (note) lines.push(note.replace(/^Lưu ý: /, "LƯU Ý DỮ LIỆU: "));

  if (ctx?.current) {
    lines.push(...formatLessonContextLines(ctx));
  }

  lines.push(...buildModeDirectives(practiceMode, mode, scenario, ctx, pendingPromptVi, expectedAnswerZh, isStarter, lexicon));

  let result = lines.join("\n");
  if (result.length > MAX_PROMPT_CHARS) {
    result = result.slice(0, MAX_PROMPT_CHARS - 40) + "\n...(đã rút gọn ngữ cảnh để giữ độ trễ thấp)";
  }
  return result;
}
