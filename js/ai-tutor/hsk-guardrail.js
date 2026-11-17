// HSK Lexical Guardrail — READ-ONLY adapter over data/content.json.
//
// Real data shape (audited 2026-11-16, see docs/AI_TUTOR_REPO_MAP.md):
// - content.lessons[]: metadata {id, level: "HSK 1"|"HSK 2", lessonNumber}
// - content.pilot + content.additionalLessons[]: per-lesson content with
//   prepWords[] / foundationWords[] {id, zh, pinyin, vi, hanViet},
//   lookup.extras[] / lookup.phrases[], knowledgePoints[]
//   {id, title, pattern, explanationVi}.
// This adapter NEVER mutates the source data: it builds its own normalized
// index {hanzi, pinyin, meaning_vi, hanViet, id, level, lessonId}.
//
// Coverage honesty: the repo currently ships HSK 1 (15 lessons) + HSK 2
// (7 lessons) content only. Selecting HSK3 therefore allows HSK1+HSK2 data
// (there is no HSK3 lexicon yet) — `coverageNote` says so in plain words.

const LEVEL_ORDER = { "HSK 1": 1, "HSK 2": 2, "HSK 3": 3 };

export function normalizeLevel(level) {
  const s = String(level || "HSK1").toUpperCase().replace(/\s+/g, "");
  if (s === "HSK2") return "HSK 2";
  if (s === "HSK3") return "HSK 3";
  return "HSK 1";
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

// Build the lexicon from the parsed content.json object. Pure function so
// tests can feed it the real file.
export function buildLexicon(content) {
  const byHanzi = new Map();
  const words = [];
  const grammar = [];
  if (!content || typeof content !== "object") return { words, byHanzi, grammar, levelsPresent: [] };
  const levelOf = new Map((content.lessons || []).map((l) => [l.id, l.level]));
  const contents = [content.pilot, ...(content.additionalLessons || [])].filter(Boolean);
  const add = (entry) => {
    if (!entry) return;
    words.push(entry);
    // Official lesson vocabulary wins over extras/foundation duplicates.
    const prev = byHanzi.get(entry.hanzi);
    if (!prev || (prev.sourceKind !== "prepWords" && entry.sourceKind === "prepWords")) {
      byHanzi.set(entry.hanzi, entry);
    }
  };
  for (const c of contents) {
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
  const levelsPresent = [...new Set(words.map((w) => w.level))].sort();
  return { words, byHanzi, grammar, levelsPresent };
}

let cachedLexicon = null;
let cachedContent = null;

// Load data/content.json once (relative to the site root) and build the index.
export async function loadLexicon(fetchFn = fetch) {
  if (cachedLexicon) return cachedLexicon;
  const res = await fetchFn("data/content.json");
  if (!res.ok) throw new Error("Không tải được dữ liệu từ vựng của app.");
  cachedContent = await res.json();
  cachedLexicon = buildLexicon(cachedContent);
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

export function buildSystemInstruction({ level, mode, scenario, lexicon = cachedLexicon }) {
  const lvl = normalizeLevel(level);
  const words = allowedWords(lvl, lexicon);
  const grammar = allowedGrammar(lvl, lexicon);
  const wordList = [...new Set(words.map((w) => w.hanzi))].join("、");
  // Latency round (2026-11-17): the grammar list was the bulk of the
  // instruction (10.7k of 13.5k chars at HSK2). Keep the teachable
  // structure/example (pattern) and drop the duplicate Vietnamese label
  // when a pattern exists; the title remains the fallback. The word list
  // (the actual level guardrail) is untouched.
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
