// AI Tutor storage — the module's ONLY localStorage key.
// Never stores audio blobs or base64 audio. Never touches the app's own
// keys (hsk30.progress.v1 / hsk30.progress.backup-before-import).

export const TUTOR_KEY = "hsk3_ai_tutor_state";
export const SCHEMA_VERSION = 1;
const MAX_ERRORS = 50;
const MAX_CONVERSATIONS = 10;
const MAX_TURNS_PER_CONVERSATION = 24;

export function defaultState() {
  return {
    schemaVersion: SCHEMA_VERSION,
    config: { enabled: false, workerUrl: "", accessPin: "" },
    stats: { totalSpeakingSeconds: 0, totalSessions: 0 },
    topicProgress: {}, // scenarioId -> {sessions, turns, completedTasks: [idx]}
    vocabUsage: {},    // hanzi -> count (words the learner/tutor actually used)
    recentErrors: [],  // newest first, max 50
    recentConversations: [], // newest first, max 10; text only
  };
}

// Canonical Worker URL: trimmed, no trailing slash. A trailing "/"
// would make the client call "//api/tutor-turn", which the Worker
// answers 404 (verified live 2026-11-17). Both save forms already
// strip it; normalising again on load also repairs configs saved by
// older builds.
export function normalizeWorkerUrl(url) {
  return typeof url === "string" ? url.trim().replace(/\/+$/, "") : "";
}

export function loadTutorState(storage = localStorage) {
  try {
    const raw = storage.getItem(TUTOR_KEY);
    if (!raw) return defaultState();
    const parsed = JSON.parse(raw);
    if (!parsed || parsed.schemaVersion !== SCHEMA_VERSION) return defaultState();
    const base = defaultState();
    const config = { ...base.config, ...(parsed.config || {}) };
    config.workerUrl = normalizeWorkerUrl(config.workerUrl);
    return {
      ...base,
      ...parsed,
      config,
      stats: { ...base.stats, ...(parsed.stats || {}) },
      topicProgress: parsed.topicProgress || {},
      vocabUsage: parsed.vocabUsage || {},
      recentErrors: Array.isArray(parsed.recentErrors) ? parsed.recentErrors.slice(0, MAX_ERRORS) : [],
      recentConversations: Array.isArray(parsed.recentConversations) ? parsed.recentConversations.slice(0, MAX_CONVERSATIONS) : [],
    };
  } catch {
    return defaultState();
  }
}

export function saveTutorState(state, storage = localStorage) {
  try { storage.setItem(TUTOR_KEY, JSON.stringify(state)); return true; }
  catch { return false; } // storage full/blocked: keep working in memory
}

export function updateTutorState(mutator, storage = localStorage) {
  const state = loadTutorState(storage);
  mutator(state);
  saveTutorState(state, storage);
  return state;
}

export function recordSessionStart(storage = localStorage) {
  return updateTutorState((s) => { s.stats.totalSessions += 1; }, storage);
}

export function recordSpeakingSeconds(seconds, storage = localStorage) {
  const n = Math.max(0, Math.round(Number(seconds) || 0));
  if (!n) return loadTutorState(storage);
  return updateTutorState((s) => { s.stats.totalSpeakingSeconds += n; }, storage);
}

export function recordError(error, storage = localStorage) {
  if (!error || !error.corrected_hanzi) return loadTutorState(storage);
  return updateTutorState((s) => {
    s.recentErrors.unshift({
      at: new Date().toISOString(),
      error_type: String(error.error_type || "grammar"),
      original_hanzi: String(error.original_hanzi || ""),
      original_pinyin: String(error.original_pinyin || ""),
      corrected_hanzi: String(error.corrected_hanzi || ""),
      corrected_pinyin: String(error.corrected_pinyin || ""),
      explanation_vi: String(error.explanation_vi || ""),
      pronunciation_status: String(error.pronunciation_status || "not_assessed"),
      pronunciation_feedback_vi: String(error.pronunciation_feedback_vi || ""),
    });
    s.recentErrors = s.recentErrors.slice(0, MAX_ERRORS);
  }, storage);
}

export function recordVocabUsage(hanziList, storage = localStorage) {
  const list = (hanziList || []).filter(Boolean);
  if (!list.length) return loadTutorState(storage);
  return updateTutorState((s) => {
    for (const h of list) s.vocabUsage[h] = (s.vocabUsage[h] || 0) + 1;
  }, storage);
}

export function recordTopicProgress(scenarioId, { turns = 0 } = {}, storage = localStorage) {
  if (!scenarioId) return loadTutorState(storage);
  return updateTutorState((s) => {
    const t = (s.topicProgress[scenarioId] ||= { sessions: 0, turns: 0 });
    t.sessions += 1;
    t.turns += turns;
  }, storage);
}

// Save/replace one conversation (text turns only) in the recent list.
export function saveConversation(conversation, storage = localStorage) {
  if (!conversation?.sessionId) return loadTutorState(storage);
  return updateTutorState((s) => {
    const entry = {
      sessionId: conversation.sessionId,
      startedAt: conversation.startedAt || new Date().toISOString(),
      level: conversation.level || "HSK1",
      mode: conversation.mode || "tutor",
      scenarioId: conversation.scenarioId || null,
      turns: (conversation.turns || []).slice(-MAX_TURNS_PER_CONVERSATION).map((t) => ({
        role: t.role === "tutor" ? "tutor" : "user",
        hanzi: String(t.hanzi || ""),
        pinyin: String(t.pinyin || ""),
        translation_vi: String(t.translation_vi || ""),
      })),
    };
    s.recentConversations = [entry, ...s.recentConversations.filter((c) => c.sessionId !== entry.sessionId)]
      .slice(0, MAX_CONVERSATIONS);
  }, storage);
}

// Clear history/errors/progress ONLY — config (enabled, Worker URL, PIN)
// is kept, and no other app key is touched.
export function clearTutorHistory(storage = localStorage) {
  return updateTutorState((s) => {
    s.stats = { totalSpeakingSeconds: 0, totalSessions: 0 };
    s.topicProgress = {};
    s.vocabUsage = {};
    s.recentErrors = [];
    s.recentConversations = [];
  }, storage);
}
