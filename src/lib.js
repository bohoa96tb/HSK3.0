// Pure helpers shared by the browser app and the Node test suite.
// No DOM access in this file.

export const REVIEW_INTERVALS_DAYS = [1, 3, 7, 14, 30];

export function normalizeTextAnswer(value) {
  return String(value ?? "")
    .normalize("NFC")
    .trim()
    .replace(/\s+/g, " ")
    .replace(/[。．]$/u, "")
    .trim();
}

// Strip tone marks so a search for "ni hao" or "nihao" finds "nǐ hǎo".
export function stripTones(value) {
  return String(value ?? "")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/ü/g, "u")
    .toLowerCase()
    .replace(/[^a-z0-9\u4e00-\u9fff]+/g, " ")
    .trim()
    .replace(/\s+/g, " ");
}

export function matchesQuery(haystacks, query) {
  const q = stripTones(query);
  if (!q) return true;
  const compact = q.replace(/\s+/g, "");
  return haystacks.some((h) => {
    const s = stripTones(h);
    return s.includes(q) || s.replace(/\s+/g, "").includes(compact);
  });
}

export function gradeChoice(item, optionId) {
  // verified-editorial grades too: the validator requires documented
  // answerEvidence for that status (D19). Without it here, editorial
  // items (Lesson 8 reduplication + the mock set) silently never graded.
  if (!item || !["verified-from-print", "verified-from-visual", "verified-editorial"].includes(item.answerStatus)) {
    return { graded: false, reason: "unverified-answer" };
  }
  // Self-check tasks share the verified-editorial status but are not
  // choice items: they carry prompts, not options — never grade them here.
  if (!Array.isArray(item.options) && Array.isArray(item.prompts)) {
    return { graded: false, reason: "unverified-answer" };
  }
  return { graded: true, correct: optionId === item.answer };
}

// --- Dictation (nghe–viết) grading -------------------------------------------
// Answers are graded only when the task carries cross-checked editorial
// answers (answerStatus "verified-editorial"); unverified tasks never grade.
const TONE_MARKS = {
  ā: ["a", 1], á: ["a", 2], ǎ: ["a", 3], à: ["a", 4],
  ē: ["e", 1], é: ["e", 2], ě: ["e", 3], è: ["e", 4],
  ī: ["i", 1], í: ["i", 2], ǐ: ["i", 3], ì: ["i", 4],
  ō: ["o", 1], ó: ["o", 2], ǒ: ["o", 3], ò: ["o", 4],
  ū: ["u", 1], ú: ["u", 2], ǔ: ["u", 3], ù: ["u", 4],
  ǖ: ["ü", 1], ǘ: ["ü", 2], ǚ: ["ü", 3], ǜ: ["ü", 4],
};
const INITIALS = ["zh", "ch", "sh", "b", "p", "m", "f", "d", "t", "n", "l", "g", "k", "h", "j", "q", "x", "r", "z", "c", "s", "y", "w"];

// Parse a pinyin answer into {base, tone}: tone marks or a trailing tone
// number (1-5) are recognised; "v" and "u:" mean ü; case/space-insensitive.
export function parsePinyin(value) {
  let s = String(value ?? "").normalize("NFC").trim().toLowerCase().replace(/\s+/g, "");
  if (!s) return { base: "", tone: 0 };
  let tone = 0;
  const num = s.match(/([0-5])$/);
  if (num) { tone = Number(num[1]) % 5; s = s.slice(0, -1); }
  s = s.replace(/u:/g, "ü").replace(/v/g, "ü");
  let base = "";
  for (const ch of s) {
    const marked = TONE_MARKS[ch];
    if (marked) { base += marked[0]; if (!tone) tone = marked[1]; }
    else base += ch;
  }
  return { base: base.replace(/[^a-zü]/g, ""), tone };
}

export function splitInitial(base) {
  for (const ini of INITIALS) if (base.startsWith(ini)) return [ini, base.slice(ini.length)];
  return ["", base];
}

// After j/q/x the letter u is written for ü (spelling rule of the lessons),
// so u and ü are interchangeable only there; everywhere else they differ.
function canonFinal(base, initial) {
  return ["j", "q", "x"].includes(initial) ? base.replace(/ü/g, "u") : base;
}

// Grade one dictation cell. task.answers[i] is the graded token for the
// task's mode: an initial ("h"), a final with tone mark ("ěn"), or a tone
// number (3). task.scriptSyllables[i] is the full syllable that was read.
// A cell whose sources conflict (e.g. the printed pair and the recording
// disagree on the very feature being tested) is suspended from grading:
// it stays available for listening practice but never counts as right or
// wrong, never enters the score denominator and never joins the review
// queue. See docs/CONTENT_STANDARD.md (source-conflict rule, D16).
export function isConflictCell(task, index) {
  return Array.isArray(task?.conflictCells) && task.conflictCells.includes(index);
}

export function gradeDictationCell(task, index, input) {
  if (isConflictCell(task, index)) {
    return { graded: false, reason: "source-conflict", conflict: true };
  }
  if (!task || task.answerStatus !== "verified-editorial" || !Array.isArray(task.answers)) {
    return { graded: false, reason: "unverified-answer" };
  }
  const raw = String(input ?? "").trim();
  if (!raw) return { graded: false, reason: "empty" };
  const expected = task.answers[index];
  const syllable = parsePinyin(task.scriptSyllables?.[index] || "");
  const given = parsePinyin(raw);
  if (task.gradingMode === "initial") {
    if (given.base === expected && given.tone === 0) return { graded: true, correct: true };
    // A full syllable is accepted only if it reproduces the read syllable
    // exactly — then its initial is what is being graded.
    const correct = given.base === syllable.base && given.tone === syllable.tone && splitInitial(given.base)[0] === expected;
    return { graded: true, correct };
  }
  if (task.gradingMode === "final") {
    const promptInitial = splitInitial(parsePinyin(task.prompts[index]).base || syllable.base)[0] || splitInitial(syllable.base)[0];
    const expFinal = parsePinyin(expected);
    // Input may be the final alone or the whole syllable.
    let candBase = given.base, candTone = given.tone;
    const [ini, rest] = splitInitial(given.base);
    if (ini && rest && given.base !== expFinal.base) { candBase = rest; }
    else if (!ini && given.base === syllable.base) { candBase = splitInitial(given.base)[1]; }
    const correct =
      canonFinal(candBase, promptInitial) === canonFinal(expFinal.base, promptInitial) &&
      candTone === expFinal.tone && candTone !== 0;
    return { graded: true, correct };
  }
  if (task.gradingMode === "syllable") {
    // The learner types the whole syllable (or disyllable, Lesson 6) they
    // heard, tone marks or tone numbers; it must reproduce the read form
    // exactly: same letters and the same sequence of tones. Comparing
    // tone-event sequences (not a single collapsed tone) is what keeps
    // dōngxi apart from dōngxī — the pairs differ on the second syllable.
    const baseOf = (s) => String(s).toLowerCase().replace(/v/g, "ü").replace(/u:/g, "ü")
      .normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[0-9\s]/g, "");
    const toneEvents = (s) => {
      const events = [];
      for (const ch of String(s).toLowerCase()) {
        const d = ch.normalize("NFD");
        if (d.length > 1 && /[aeiouü]/.test(d[0])) {
          const mark = d.codePointAt(1);
          const tone = { 0x300: 4, 0x301: 2, 0x304: 1, 0x30c: 3, 0x311: 3 }[mark];
          if (tone) events.push(tone);
        } else if (/[1-4]/.test(ch)) events.push(Number(ch));
      }
      return events;
    };
    const expectedStr = task.scriptSyllables?.[index] || "";
    const expEvents = toneEvents(expectedStr);
    const correct = baseOf(raw) === baseOf(expectedStr)
      && expEvents.length > 0
      && JSON.stringify(toneEvents(raw)) === JSON.stringify(expEvents);
    return { graded: true, correct };
  }
  if (task.gradingMode === "tone") {
    let tone = given.tone;
    if (/^[0-5]$/.test(raw)) tone = Number(raw) % 5;
    if (!tone) return { graded: true, correct: false };
    // Letters, when given, must be the prompt syllable itself.
    const promptBase = parsePinyin(task.prompts[index]).base;
    const lettersOk = !/[a-zü]/.test(given.base) || given.base === promptBase || given.base === syllable.base;
    return { graded: true, correct: tone === expected && lettersOk };
  }
  return { graded: false, reason: "unknown-mode" };
}

export function gradeDictation(task, inputs) {
  const cells = (task?.prompts || []).map((_, i) => gradeDictationCell(task, i, inputs?.[i]));
  const gradedCells = cells.filter((c) => c.graded);
  return {
    graded: gradedCells.length > 0,
    cells,
    correct: gradedCells.filter((c) => c.correct).length,
    total: gradedCells.length,
  };
}

// Display form of the expected answer for feedback after checking.
export function dictationExpected(task, index) {
  if (!task) return "";
  if (task.gradingMode === "tone") return `${task.prompts[index]}${task.answers[index]}`;
  return String(task.answers[index]);
}

// Review scheduling: wrong answer restarts at step 0 (1 day). A correct
// self-rating advances one step; "slow" keeps the step, "forgot" restarts.
export function nextReviewState(prev, rating, nowMs) {
  const step = prev && Number.isInteger(prev.intervalStep) ? prev.intervalStep : 0;
  let nextStep;
  if (rating === "forgot") nextStep = 0;
  else if (rating === "slow") nextStep = step;
  else if (rating === "known") nextStep = prev ? Math.min(step + 1, REVIEW_INTERVALS_DAYS.length - 1) : 0;
  else throw new Error(`unknown rating: ${rating}`);
  const days = REVIEW_INTERVALS_DAYS[nextStep];
  return {
    intervalStep: nextStep,
    dueAt: new Date(nowMs + days * 86400000).toISOString(),
  };
}

export function isDue(item, nowMs) {
  if (!item || !item.dueAt) return false;
  return new Date(item.dueAt).getTime() <= nowMs;
}

export const PROGRESS_SCHEMA_VERSION = 1;

export function emptyProgress() {
  return {
    schemaVersion: PROGRESS_SCHEMA_VERSION,
    settings: {
      showPinyinPrep: true,
      showViPrep: true,
      showHanVietPrep: false,
      showPinyinSentences: false,
      showViSentences: false,
      showPinyinExercises: false,
      showViExercises: false,
      fontScale: 1,
      playbackRate: 1,
    },
    lessons: {}, // lessonId -> {completedSections:[], lastSectionId, updatedAt}
    attempts: [], // {id, exerciseId, lessonId, optionId, correct, firstAttempt, hintUsed, supportUsed, at} — supportUsed = Pinyin/Nghĩa của Mục 5 đã bật khi làm câu đó
    selfChecks: {}, // taskId -> {rating, at}
    reviewItems: {}, // itemId -> {sourceItemId, kind, intervalStep, dueAt, lastResult, attempts}
    exerciseSession: null, // latest session mirror: {setId, index, answers:{}, checked:{}, hintUsed:{}, supportUsed:{}}
    exerciseSessions: {}, // setId -> session, so each lesson keeps its own exercise state
    drafts: {}, // self-check taskId:index -> learner's own written answer (never auto-graded)
    dictation: {}, // taskId -> {first:{idx:bool}, tries:{idx:n}, peeked:bool, updatedAt} — first-attempt results are never overwritten
    audioState: {}, // trackId -> {position, trackUrl}
    sessions: [], // {date, minutes} active-study estimates recorded on section completion
  };
}

export function validateProgress(data) {
  const errors = [];
  if (!data || typeof data !== "object" || Array.isArray(data)) {
    return { ok: false, errors: ["Dữ liệu sao lưu không phải là một đối tượng JSON."] };
  }
  if (data.schemaVersion !== PROGRESS_SCHEMA_VERSION) {
    errors.push(`schemaVersion phải là ${PROGRESS_SCHEMA_VERSION} (đang là ${JSON.stringify(data.schemaVersion)}).`);
  }
  for (const key of ["settings", "lessons", "selfChecks", "reviewItems", "audioState", "exerciseSessions", "drafts", "dictation"]) {
    if (data[key] !== undefined && (typeof data[key] !== "object" || data[key] === null || Array.isArray(data[key]))) {
      errors.push(`Trường "${key}" phải là một đối tượng.`);
    }
  }
  if (data.attempts !== undefined && !Array.isArray(data.attempts)) errors.push('Trường "attempts" phải là một mảng.');
  if (data.sessions !== undefined && !Array.isArray(data.sessions)) errors.push('Trường "sessions" phải là một mảng.');
  return { ok: errors.length === 0, errors };
}

export function migrateProgress(data) {
  const check = validateProgress(data);
  if (!check.ok) return null;
  const base = emptyProgress();
  return {
    ...base,
    ...data,
    settings: { ...base.settings, ...(data.settings || {}) },
    lessons: data.lessons || {},
    attempts: data.attempts || [],
    selfChecks: data.selfChecks || {},
    reviewItems: data.reviewItems || {},
    exerciseSession: data.exerciseSession ?? null,
    exerciseSessions: data.exerciseSessions || (data.exerciseSession?.setId ? { [data.exerciseSession.setId]: data.exerciseSession } : {}),
    drafts: data.drafts || {},
    dictation: data.dictation || {},
    audioState: data.audioState || {},
    sessions: data.sessions || [],
  };
}

// First-attempt score vs retries, per exercise set. Hint use is reported
// separately so it never inflates or hides the raw result.
export function summarizeAttempts(attempts, exerciseIds) {
  const byExercise = new Map();
  for (const a of attempts) {
    if (!exerciseIds.includes(a.exerciseId)) continue;
    if (!byExercise.has(a.exerciseId)) byExercise.set(a.exerciseId, []);
    byExercise.get(a.exerciseId).push(a);
  }
  let firstTotal = 0, firstCorrect = 0, retried = 0, hintUsedCount = 0, supportUsedCount = 0;
  for (const [, list] of byExercise) {
    const sorted = [...list].sort((x, y) => new Date(x.at) - new Date(y.at));
    firstTotal += 1;
    if (sorted[0].correct) firstCorrect += 1;
    if (sorted.length > 1) retried += 1;
    if (sorted.some((a) => a.hintUsed)) hintUsedCount += 1;
    if (sorted.some((a) => a.supportUsed)) supportUsedCount += 1;
  }
  return { answered: byExercise.size, firstTotal, firstCorrect, retried, hintUsedCount, supportUsedCount };
}
