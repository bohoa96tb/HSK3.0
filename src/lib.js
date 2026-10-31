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
  if (!item || !["verified-from-print", "verified-from-visual"].includes(item.answerStatus)) {
    return { graded: false, reason: "unverified-answer" };
  }
  return { graded: true, correct: optionId === item.answer };
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
      showPinyinSentences: false,
      showViSentences: false,
      fontScale: 1,
      playbackRate: 1,
    },
    lessons: {}, // lessonId -> {completedSections:[], lastSectionId, updatedAt}
    attempts: [], // {id, exerciseId, lessonId, optionId, correct, firstAttempt, hintUsed, at}
    selfChecks: {}, // taskId -> {rating, at}
    reviewItems: {}, // itemId -> {sourceItemId, kind, intervalStep, dueAt, lastResult, attempts}
    exerciseSession: null, // {setId, index, answers:{}, checked:{}, hintUsed:{}}
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
  for (const key of ["settings", "lessons", "selfChecks", "reviewItems", "audioState"]) {
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
  let firstTotal = 0, firstCorrect = 0, retried = 0, hintUsedCount = 0;
  for (const [, list] of byExercise) {
    const sorted = [...list].sort((x, y) => new Date(x.at) - new Date(y.at));
    firstTotal += 1;
    if (sorted[0].correct) firstCorrect += 1;
    if (sorted.length > 1) retried += 1;
    if (sorted.some((a) => a.hintUsed)) hintUsedCount += 1;
  }
  return { answered: byExercise.size, firstTotal, firstCorrect, retried, hintUsedCount };
}
