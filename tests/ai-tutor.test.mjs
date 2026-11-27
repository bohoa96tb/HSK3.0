// AI Tutor module tests — new file, does not modify any existing test.
// Covers: guardrail adapter against the REAL data/content.json, scenarios,
// storage caps/scoping, Worker helpers (origin/PIN/validation/schema),
// voice MIME picking. Browser-only behaviour (mic, TTS, route in a real
// browser) is NOT covered here — see docs/AI_TUTOR_QA_REPORT.md.
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { JSDOM } from "jsdom";

import {
  PRACTICE_MODES, buildLexicon, lookupLocalWord, allowedWords, allowedGrammar,
  segmentByLexicon, buildSystemInstruction, coverageNote, normalizeLevel,
  listLessons, getLessonContext, lessonReplyHints, lessonRoleplayOpening,
  lessonTranslateSeeds, resolveDrillPassed,
} from "../js/ai-tutor/hsk-guardrail.js";
import { SCENARIOS, scenarioById } from "../js/ai-tutor/roleplay-scenarios.js";
import {
  TUTOR_KEY, defaultState, loadTutorState, saveTutorState, updateTutorPrefs, recordError, normalizeWorkerUrl,
  recordSpeakingSeconds, saveConversation, clearTutorHistory,
} from "../js/ai-tutor/tutor-storage.js";
import { _internal } from "../workers/ai-tutor-proxy/worker.js";
import worker from "../workers/ai-tutor-proxy/worker.js";
import {
  pickMimeType, micErrorVi, isVoiceInputSupported, isTtsSupported,
  pickZhVoice, cleanZhForSpeech, DEFAULT_TTS_RATE, SLOW_TTS_RATE, MAX_RECORD_SECONDS,
} from "../js/ai-tutor/voice-engine.js";

const content = JSON.parse(readFileSync(new URL("../data/content.json", import.meta.url), "utf8"));
const lex = buildLexicon(content);

function fakeStorage() {
  const map = new Map();
  return {
    getItem: (k) => (map.has(k) ? map.get(k) : null),
    setItem: (k, v) => map.set(k, String(v)),
    removeItem: (k) => map.delete(k),
    _map: map,
  };
}

// ---------- Guardrail ----------
test("guardrail builds lexicon from real content.json without mutating it", () => {
  const before = JSON.stringify(content);
  const l2 = buildLexicon(content);
  assert.equal(JSON.stringify(content), before);
  assert.ok(l2.words.length > 900, `words=${l2.words.length}`);
  assert.equal(l2.grammar.length, 105);
  assert.deepEqual(l2.levelsPresent, ["HSK 1", "HSK 2"]);
});

test("lookupLocalWord returns textbook pinyin + Vietnamese meaning", () => {
  const w = lookupLocalWord("你好", lex);
  assert.equal(w.pinyin, "nǐ hǎo");
  assert.equal(w.meaning_vi, "xin chào");
  assert.equal(w.level, "HSK 1");
  assert.equal(lookupLocalWord("不存在词", lex), null);
});

test("level gating: HSK1 excludes HSK2-only words, HSK2 includes them", () => {
  const h1 = new Set(allowedWords("HSK1", lex).map((w) => w.hanzi));
  const h2only = allowedWords("HSK2", lex).filter((w) => w.level === "HSK 2" && !h1.has(w.hanzi));
  assert.ok(h2only.length > 0);
  for (const w of h2only) assert.ok(!h1.has(w.hanzi));
  assert.ok(allowedGrammar("HSK1", lex).length < allowedGrammar("HSK2", lex).length);
  assert.equal(normalizeLevel("hsk 3"), "HSK 3");
});

test("HSK3 coverage is honestly reported as missing data", () => {
  assert.match(coverageNote("HSK3", lex), /chưa có dữ liệu.*HSK 3/);
  assert.equal(coverageNote("HSK1", lex), "");
});

test("segmentByLexicon finds known words inside a sentence", () => {
  const toks = segmentByLexicon("我想去北京", lex);
  assert.deepEqual(toks.map((t) => t.text), ["我", "想", "去", "北京"]);
  assert.ok(toks.every((t) => t.entry));
});

test("system instruction enforces level list, roleplay purity and out-of-level rule", () => {
  const si = buildSystemInstruction({ level: "HSK1", mode: "roleplay", scenario: SCENARIOS[0], lexicon: lex });
  assert.match(si, /100% VAI DIỄN/);
  assert.match(si, /out_of_level_words/);
  assert.match(si, /你好/);
  const st = buildSystemInstruction({ level: "HSK2", mode: "tutor", scenario: null, lexicon: lex });
  assert.match(st, /CHẾ ĐỘ GIÁO VIÊN/);
});

// ---------- Scenarios ----------
test("8 scenarios, each with roles, opening, 3 tasks and in-lexicon suggestions", () => {
  assert.equal(SCENARIOS.length, 8);
  for (const s of SCENARIOS) {
    assert.ok(s.aiRoleZh && s.aiRoleVi && s.learnerRoleVi, s.id);
    assert.ok(s.opening.hanzi && s.opening.pinyin && s.opening.translation_vi, s.id);
    assert.equal(s.tasksVi.length, 3, s.id);
    assert.ok(s.suggestedWords.length >= 6, s.id);
    for (const w of s.suggestedWords) assert.ok(lookupLocalWord(w, lex), `${s.id}:${w}`);
  }
  assert.equal(scenarioById("bus").titleVi, "Đi xe buýt");
  assert.equal(scenarioById("nope"), null);
});

// ---------- Storage ----------
test("storage uses only its own key and defaults are sane", () => {
  const st = fakeStorage();
  const s = loadTutorState(st);
  assert.deepEqual(s, defaultState());
  saveTutorState(s, st);
  assert.deepEqual([...st._map.keys()], [TUTOR_KEY]);
});

test("normalizeWorkerUrl strips trailing slashes and whitespace", () => {
  assert.equal(normalizeWorkerUrl("https://x.workers.dev"), "https://x.workers.dev");
  assert.equal(normalizeWorkerUrl("https://x.workers.dev/"), "https://x.workers.dev");
  assert.equal(normalizeWorkerUrl("  https://x.workers.dev///  "), "https://x.workers.dev");
  assert.equal(normalizeWorkerUrl(""), "");
  assert.equal(normalizeWorkerUrl(undefined), "");
  assert.equal(normalizeWorkerUrl(null), "");
});

test("loadTutorState repairs a stored Worker URL with trailing slash", () => {
  const st = fakeStorage();
  saveTutorState({ ...defaultState(), config: { enabled: true, workerUrl: "https://x.workers.dev/", accessPin: "" } }, st);
  assert.equal(loadTutorState(st).config.workerUrl, "https://x.workers.dev");
});

test("recordError caps at 50 and keeps newest first", () => {
  const st = fakeStorage();
  for (let i = 0; i < 55; i++) recordError({ corrected_hanzi: `句${i}`, error_type: "grammar" }, st);
  const s = loadTutorState(st);
  assert.equal(s.recentErrors.length, 50);
  assert.equal(s.recentErrors[0].corrected_hanzi, "句54");
});

test("clearTutorHistory clears progress but keeps config", () => {
  const st = fakeStorage();
  saveTutorState({ ...defaultState(), config: { enabled: true, workerUrl: "https://x.workers.dev", accessPin: "1234" } }, st);
  recordError({ corrected_hanzi: "好" }, st);
  recordSpeakingSeconds(90, st);
  saveConversation({ sessionId: "s1", turns: [{ role: "user", hanzi: "你好" }] }, st);
  const s = clearTutorHistory(st);
  assert.equal(s.config.workerUrl, "https://x.workers.dev");
  assert.equal(s.config.accessPin, "1234");
  assert.equal(s.recentErrors.length, 0);
  assert.equal(s.recentConversations.length, 0);
  assert.equal(s.stats.totalSpeakingSeconds, 0);
});

test("conversations cap at 10 and store text only (no audio fields)", () => {
  const st = fakeStorage();
  for (let i = 0; i < 12; i++) saveConversation({ sessionId: `s${i}`, turns: [{ role: "user", hanzi: "你好", audio: "BASE64" }] }, st);
  const s = loadTutorState(st);
  assert.equal(s.recentConversations.length, 10);
  assert.ok(!JSON.stringify(s).includes("BASE64"));
});

// ---------- Worker ----------
test("worker CORS allowlist: Pages origin + localhost only, no wildcard", () => {
  assert.equal(_internal.isAllowedOrigin("https://bohoa96tb.github.io"), true);
  assert.equal(_internal.isAllowedOrigin("http://localhost:8000"), true);
  assert.equal(_internal.isAllowedOrigin("http://127.0.0.1:5500"), true);
  assert.equal(_internal.isAllowedOrigin("https://evil.example.com"), false);
  assert.equal(_internal.isAllowedOrigin("https://bohoa96tb.github.io.evil.com"), false);
  assert.equal(_internal.isAllowedOrigin(""), false);
});

test("worker PIN compare is exact", () => {
  assert.equal(_internal.safeEqual("1234", "1234"), true);
  assert.equal(_internal.safeEqual("1234", "1235"), false);
  assert.equal(_internal.safeEqual("1234", "12345"), false);
});

test("worker validateTurn rejects bad input and oversize", () => {
  const base = { sessionId: "s1", level: "HSK1", mode: "tutor", systemInstruction: "x", userText: "你好" };
  assert.equal(_internal.validateTurn(base), null);
  assert.match(_internal.validateTurn({ ...base, level: "HSK9" }), /cấp độ/i);
  assert.match(_internal.validateTurn({ ...base, userText: "", userAudioBase64: "AAAA", audioMimeType: "audio/aac" }), /không được hỗ trợ/);
  assert.match(_internal.validateTurn({ ...base, userText: "a".repeat(601) }), /quá dài/);
  assert.match(_internal.validateTurn({ ...base, userText: "", userAudioBase64: "" }), /văn bản hoặc âm thanh/);
  const long = _internal.buildContents({ ...base, history: Array.from({ length: 15 }, (_, i) => ({ role: "user", hanzi: `c${i}` })) });
  assert.ok(long.length <= 11); // 10 history + current turn
});

test("worker response schema carries pronunciation assessment (Phụ lục VIII)", () => {
  const ev = _internal.RESPONSE_SCHEMA.properties.evaluation;
  assert.ok(ev.required.includes("pronunciation_status"));
  assert.ok(ev.required.includes("pronunciation_feedback_vi"));
  assert.deepEqual(ev.properties.pronunciation_status.enum, ["assessed", "uncertain", "not_assessed"]);
  assert.equal(_internal.MAX_BODY_BYTES, 500 * 1024);
});

// ---------- Voice ----------
test("pickMimeType uses isTypeSupported, never assumes", () => {
  const onlyMp4 = { isTypeSupported: (m) => m === "audio/mp4" };
  assert.equal(pickMimeType(onlyMp4), "audio/mp4");
  const none = { isTypeSupported: () => false };
  assert.equal(pickMimeType(none), "");
  assert.equal(pickMimeType(null), "");
  assert.equal(MAX_RECORD_SECONDS, 20);
  assert.match(micErrorVi({ name: "NotAllowedError" }), /quyền micro/i);
  assert.match(micErrorVi({ name: "NotFoundError" }), /Không tìm thấy micro/);
});

// ---------- Latency instrumentation (2026-11-17) ----------
test("system instruction stays compact after grammar-list compression", () => {
  const st = buildSystemInstruction({ level: "HSK2", mode: "tutor", scenario: null, lexicon: lex });
  assert.ok(st.length < 10000, `instruction too long: ${st.length}`);
  assert.match(st, /你们/); // a grammar pattern survives compression
  assert.match(st, /VỐN TỪ ĐƯỢC PHÉP/); // word list (the guardrail) intact
});

test("worker success response carries geminiMs and logs a content-free timing line", async () => {
  const payload = {
    user_transcript_hanzi: "你好", user_transcript_pinyin: "nǐhǎo",
    evaluation: { has_error: false, error_type: "none", corrected_hanzi: "", corrected_pinyin: "", explanation_vi: "", pronunciation_status: "not_assessed", pronunciation_feedback_vi: "" },
    tutor_reply: { hanzi: "你好！", pinyin: "Nǐhǎo!", translation_vi: "Xin chào!", out_of_level_words: [] },
  };
  const realFetch = globalThis.fetch;
  const realLog = console.log;
  const lines = [];
  console.log = (...a) => lines.push(a.join(" "));
  globalThis.fetch = async () => new Response(JSON.stringify({ candidates: [{ content: { parts: [{ text: JSON.stringify(payload) }] }, finishReason: "STOP" }] }), { status: 200, headers: { "Content-Type": "application/json" } });
  try {
    const res = await worker.fetch(new Request("https://w.example/api/tutor-turn", {
      method: "POST",
      headers: { "Content-Type": "application/json", Origin: "https://bohoa96tb.github.io", "X-Tutor-Pin": "test-pin-123" },
      body: JSON.stringify({ sessionId: "s1", level: "HSK1", mode: "tutor", systemInstruction: "Bạn là giáo viên.", history: [], userText: "NỘI DUNG BÍ MẬT" }),
    }), { GEMINI_API_KEY: "k", TUTOR_ACCESS_PIN: "test-pin-123" }, {});
    const data = await res.json();
    assert.equal(res.status, 200);
    assert.equal(typeof data.timings?.geminiMs, "number");
    const line = lines.find((l) => l.startsWith("tutor_timing "));
    assert.ok(line, "timing line emitted");
    assert.match(line, /"status":200/);
    assert.ok(!line.includes("test-pin-123"), "timing line must not contain the PIN");
    assert.ok(!line.includes("NỘI DUNG BÍ MẬT"), "timing line must not contain conversation content");
  } finally {
    globalThis.fetch = realFetch;
    console.log = realLog;
  }
});

test("worker timing logs carry the real HTTP status for success, timeout, rate limit, truncated and PIN rejection", async () => {
  const payload = {
    user_transcript_hanzi: "你好", user_transcript_pinyin: "nǐhǎo",
    evaluation: { has_error: false, error_type: "none", corrected_hanzi: "", corrected_pinyin: "", explanation_vi: "", pronunciation_status: "not_assessed", pronunciation_feedback_vi: "" },
    tutor_reply: { hanzi: "你好！", pinyin: "Nǐhǎo!", translation_vi: "Xin chào!", out_of_level_words: [] },
  };
  const gemOk = (fr = "STOP") => async () => new Response(JSON.stringify({ candidates: [{ content: { parts: [{ text: JSON.stringify(payload) }] }, finishReason: fr }] }), { status: 200, headers: { "Content-Type": "application/json" } });
  const realFetch = globalThis.fetch; const realLog = console.log;
  const turn = { sessionId: "s1", level: "HSK1", mode: "tutor", systemInstruction: "Bạn là giáo viên.", history: [], userText: "CÂU BÍ MẬT" };
  async function run(stub, pin = "pin-dung-123") {
    const lines = [];
    console.log = (...a) => lines.push(a.join(" "));
    globalThis.fetch = stub;
    try {
      const res = await worker.fetch(new Request("https://w.example/api/tutor-turn", {
        method: "POST",
        headers: { "Content-Type": "application/json", Origin: "https://bohoa96tb.github.io", "X-Tutor-Pin": pin },
        body: JSON.stringify(turn),
      }), { GEMINI_API_KEY: "k", TUTOR_ACCESS_PIN: "pin-dung-123" }, {});
      return { status: res.status, line: lines.find((l) => l.startsWith("tutor_timing ")), all: lines.join(" ") };
    } finally { globalThis.fetch = realFetch; console.log = realLog; }
  }
  const ok = await run(gemOk());
  assert.equal(ok.status, 200); assert.match(ok.line, /"status":200/); assert.match(ok.line, /"gemini_ms":\d+/); assert.match(ok.line, /"worker_ms":\d+/);
  const timeout = await run(async () => { const e = new Error("aborted"); e.name = "AbortError"; throw e; });
  assert.equal(timeout.status, 504); assert.match(timeout.line, /"status":504/); assert.match(timeout.line, /"code":"TIMEOUT"/);
  const rate = await run(async () => new Response("{}", { status: 429 }));
  assert.equal(rate.status, 429); assert.match(rate.line, /"status":429/); assert.match(rate.line, /"code":"RATE_LIMIT"/);
  const trunc = await run(gemOk("MAX_TOKENS"));
  assert.equal(trunc.status, 502); assert.match(trunc.line, /"status":502/); assert.match(trunc.line, /"code":"TRUNCATED"/);
  const pin = await run(gemOk(), "pin-sai-456");
  assert.equal(pin.status, 401); assert.match(pin.line, /"status":401/); assert.match(pin.line, /"code":"PIN_INVALID"/);
  assert.ok(!("gemini_ms" in JSON.parse(pin.line.slice("tutor_timing ".length))), "no gemini_ms when Gemini was never called");
  for (const r of [ok, timeout, rate, trunc, pin]) {
    assert.ok(!r.all.includes("pin-dung-123") && !r.all.includes("pin-sai-456"), "log must not contain any PIN");
    assert.ok(!r.all.includes("CÂU BÍ MẬT"), "log must not contain conversation content");
  }
});

// ---------- Fast-model round (2026-11-17) ----------
test("fast model defaults: gemini-2.5-flash, 40 s timeout, per-family thinking config", () => {
  assert.equal(_internal.DEFAULT_MODEL, "gemini-2.5-flash");
  assert.equal(_internal.GEMINI_TIMEOUT_MS, 40000);
  assert.deepEqual(_internal.thinkingConfigFor("gemini-2.5-flash"), { thinkingBudget: 0 });
  assert.deepEqual(_internal.thinkingConfigFor("gemini-4-hydrogen"), { thinkingLevel: "low" });
  assert.deepEqual(_internal.thinkingConfigFor("gemini-3.5-flash-lite"), { thinkingLevel: "low" });
  assert.equal(_internal.thinkingConfigFor("gemini-2.0-flash"), null);
  assert.equal(_internal.thinkingConfigFor(""), null);
});

test("worker sends the right thinkingConfig per model and surfaces Google status on upstream errors", async () => {
  const payload = {
    user_transcript_hanzi: "你好", user_transcript_pinyin: "nǐhǎo",
    evaluation: { has_error: false, error_type: "none", corrected_hanzi: "", corrected_pinyin: "", explanation_vi: "", pronunciation_status: "not_assessed", pronunciation_feedback_vi: "" },
    tutor_reply: { hanzi: "你好！", pinyin: "Nǐhǎo!", translation_vi: "Xin chào!", out_of_level_words: [] },
  };
  const realFetch = globalThis.fetch; const realLog = console.log;
  const turn = { sessionId: "s1", level: "HSK1", mode: "tutor", systemInstruction: "Bạn là giáo viên.", history: [], userText: "你好" };
  async function call(stub, env) {
    const lines = []; let sentBody = null;
    console.log = (...a) => lines.push(a.join(" "));
    globalThis.fetch = async (url, init) => { if (String(url).includes("generativelanguage")) sentBody = JSON.parse(init.body); return stub(url, init); };
    try {
      const res = await worker.fetch(new Request("https://w.example/api/tutor-turn", {
        method: "POST", headers: { "Content-Type": "application/json", Origin: "https://bohoa96tb.github.io", "X-Tutor-Pin": "pin-1" },
        body: JSON.stringify(turn),
      }), env, {});
      return { res, data: await res.json(), lines, sentBody };
    } finally { globalThis.fetch = realFetch; console.log = realLog; }
  }
  const okGem = async () => new Response(JSON.stringify({ candidates: [{ content: { parts: [{ text: JSON.stringify(payload) }] }, finishReason: "STOP" }] }), { status: 200, headers: { "Content-Type": "application/json" } });
  const base = { GEMINI_API_KEY: "SECRET-KEY-XYZ", TUTOR_ACCESS_PIN: "pin-1" };

  const dflt = await call(okGem, { ...base });
  assert.equal(dflt.res.status, 200);
  assert.deepEqual(dflt.sentBody.generationConfig.thinkingConfig, { thinkingBudget: 0 });

  const h4 = await call(okGem, { ...base, GEMINI_MODEL: "gemini-4-hydrogen" });
  assert.deepEqual(h4.sentBody.generationConfig.thinkingConfig, { thinkingLevel: "low" });

  const f20 = await call(okGem, { ...base, GEMINI_MODEL: "gemini-2.0-flash" });
  assert.ok(!("thinkingConfig" in f20.sentBody.generationConfig));

  const up = await call(async () => new Response(JSON.stringify({ error: { status: "INVALID_ARGUMENT", message: "bad field" } }), { status: 400, headers: { "Content-Type": "application/json" } }), { ...base });
  assert.equal(up.res.status, 502);
  assert.match(up.data.error, /mã lỗi Google: 400/);
  assert.equal(up.data.upstreamStatus, 400);
  assert.equal(typeof up.data.timings?.geminiMs, "number");
  const line = up.lines.find((l) => l.startsWith("tutor_timing "));
  assert.match(line, /"upstreamStatus":400/);
  assert.match(line, /"google_status":"INVALID_ARGUMENT"/);
  assert.ok(!up.lines.join(" ").includes("SECRET-KEY-XYZ"), "log must not contain the API key");
});

// ---------- Pedagogical Tutor Upgrade (2026-11-27) ----------
test("lesson selector and multi-layer context extract current, 2 prev, and 1 next summary only", () => {
  const allLessons = listLessons(lex);
  assert.equal(allLessons.length, 22);
  assert.equal(listLessons(lex, "HSK 1").length, 15);
  assert.equal(listLessons(lex, "HSK 2").length, 7);

  const ctx = getLessonContext("hsk2-l03", lex);
  assert.ok(ctx);
  assert.equal(ctx.current.lessonId, "hsk2-l03");
  assert.equal(ctx.current.titleZh, "我想去西安旅游");
  assert.equal(ctx.prevLessons.map((p) => p.lessonId).join(","), "hsk2-l01,hsk2-l02");
  assert.equal(ctx.nextLesson.lessonId, "hsk2-l04");
  assert.equal(ctx.nextLesson.titleZh, "你穿红色的很好看");
  assert.ok(ctx.nextLesson.topicSummaryVi.length > 0);
  // First lesson has 0 prevLessons; last populated lesson (hsk2-l07) still peeks catalogued hsk2-l08 title
  assert.equal(getLessonContext("hsk1-l01", lex).prevLessons.length, 0);
  const ctx7 = getLessonContext("hsk2-l07", lex);
  assert.equal(ctx7.nextLesson.lessonId, "hsk2-l08");
  assert.equal(ctx7.nextLesson.titleZh, "虽然你忘了，但是我记得");
});

test("multi-layer system instruction fits Worker 24KB cap across all 22 lessons and 4 modes", () => {
  assert.equal(PRACTICE_MODES.length, 4);
  for (const l of listLessons(lex)) {
    for (const pm of PRACTICE_MODES) {
      const si = buildSystemInstruction({
        level: l.level.replace(/\s+/g, ""),
        mode: pm.workerMode,
        practiceMode: pm.id,
        lessonId: l.id,
        lexicon: lex,
      });
      assert.ok(si.length > 400 && si.length <= 20000, `${l.id}/${pm.id} length=${si.length}`);
    }
  }
  const corr = buildSystemInstruction({ level: "HSK2", mode: "tutor", practiceMode: "correct", lessonId: "hsk2-l03", lexicon: lex });
  assert.match(corr, /\(1\) Ghi nhận/);
  assert.match(corr, /\(2\) Sửa lỗi/);
  assert.match(corr, /\(3\) Câu tự nhiên hơn/);
  assert.match(corr, /TUYỆT ĐỐI CẤM THUẬT NGỮ TIẾNG TRUNG KHÓ/);
  assert.match(corr, /我买好票了/);
  assert.match(corr, /BÀI LIỀN TRƯỚC/);
  assert.match(corr, /BÀI TIẾP THEO/);
  assert.match(corr, /KHÔNG dạy trước/);

  const tr = buildSystemInstruction({
    level: "HSK2", mode: "tutor", practiceMode: "translate", lessonId: "hsk2-l03",
    pendingPromptVi: "Cơm canh làm xong cả rồi.", expectedAnswerZh: "菜都做好了。", lexicon: lex,
  });
  assert.match(tr, /PHẢN XẠ DỊCH NHANH/);
  assert.match(tr, /Cơm canh làm xong cả rồi\./);
  assert.match(tr, /菜都做好了。/);
  assert.match(tr, /tuyệt đối KHÔNG viết nhầm là 'thêm 完了 sau động từ'/);
  assert.doesNotMatch(tr, /请试着翻译/);
});

test("lessonTranslateSeeds covers all 22 lessons with 6-8 natural, in-lesson sentences and resolveDrillPassed works", () => {
  for (const l of listLessons(lex)) {
    const seeds = lessonTranslateSeeds(l.id, lex);
    assert.ok(seeds.length >= 5 && seeds.length <= 8, `${l.id} seeds=${seeds.length}`);
    for (const s of seeds) {
      assert.doesNotMatch(s.vi, /trang in|chữ mẫu|thẻ từ|ví dụ trong sách|\s—\s/i, `${l.id}: ${s.vi}`);
    }
  }
  const h2l3 = lessonTranslateSeeds("hsk2-l03", lex);
  const allZh = h2l3.map((s) => s.refZh).join(" ");
  assert.equal(h2l3.length, 8);
  assert.doesNotMatch(allZh, /打算|准备/, "no out-of-level words in HSK2 L3 drill deck");
  assert.match(allZh, /做好|做完|想好|休息|看了看|为什么/);

  assert.equal(resolveDrillPassed({ passed: true, evaluation: { has_error: true } }), true);
  assert.equal(resolveDrillPassed({ passed: false, evaluation: { has_error: false } }), false);
  assert.equal(resolveDrillPassed({ evaluation: { passed: true, has_error: true } }), true);
  assert.equal(resolveDrillPassed({ evaluation: { has_error: false, pronunciation_status: "assessed" } }), true);
  assert.equal(resolveDrillPassed({ evaluation: { has_error: false, pronunciation_status: "uncertain" } }), false);
  assert.equal(resolveDrillPassed({ evaluation: { has_error: true, pronunciation_status: "assessed" } }), false);
  assert.equal(_internal.RESPONSE_SCHEMA.properties.passed.type, "BOOLEAN");
  assert.equal(_internal.RESPONSE_SCHEMA.properties.evaluation.properties.passed.type, "BOOLEAN");

  const hints = lessonReplyHints("hsk2-l03", "roleplay", lex);
  assert.ok(hints.length >= 3);
  assert.ok(hints.every((h) => h.zh && h.vi));
  const rp = lessonRoleplayOpening("hsk2-l03", lex);
  assert.ok(rp.opening.hanzi && rp.opening.pinyin && rp.opening.translation_vi);
});

test("storage prefs persist and survive clearTutorHistory", () => {
  const st = fakeStorage();
  updateTutorPrefs({ showPinyin: false, showVi: true, lessonId: "hsk2-l03", practiceMode: "correct" }, st);
  saveTutorState({ ...loadTutorState(st), config: { enabled: true, workerUrl: "https://x.workers.dev", accessPin: "" } }, st);
  const afterClear = clearTutorHistory(st);
  assert.equal(afterClear.prefs.showPinyin, false);
  assert.equal(afterClear.prefs.lessonId, "hsk2-l03");
  assert.equal(afterClear.prefs.practiceMode, "correct");
  assert.equal(afterClear.config.enabled, true);
});

test("voice capability checks, zh-CN smooth voice ranking, rate constants, and speech cleaning", () => {
  assert.equal(isVoiceInputSupported({}, undefined), false);
  assert.equal(isVoiceInputSupported({ mediaDevices: { getUserMedia: () => {} } }, function FakeRec() {}), true);
  assert.equal(isTtsSupported({}), false);
  assert.equal(isTtsSupported({ speechSynthesis: {} }), true);
  assert.equal(DEFAULT_TTS_RATE, 0.9);
  assert.equal(SLOW_TTS_RATE, 0.65);

  const picked = pickZhVoice([
    { name: "Microsoft Huihui - Chinese (Simplified, PRC)", lang: "zh-CN", localService: true },
    { name: "Microsoft WanLung Online (Natural)", lang: "zh-HK", localService: false },
    { name: "Microsoft Xiaoxiao Online (Natural) - Chinese (Mainland)", lang: "zh-CN", localService: false },
  ]);
  assert.equal(picked?.name, "Microsoft Xiaoxiao Online (Natural) - Chinese (Mainland)");

  assert.equal(cleanZhForSpeech("我买好票了！"), "我买好票了！");
  assert.equal(cleanZhForSpeech("AI小语，你好！"), "AI小语，你好！");
  assert.equal(cleanZhForSpeech("(3) 我还没想好呢。(Em chưa nghĩ xong) — nǐ hǎo 🎯"), "我还没想好呢。");
  assert.equal(cleanZhForSpeech("Chỉ có tiếng Việt thôi 123"), "");
});

test("tutor-view DOM mount: lesson selector, 4 modes, global toggles, hints, and Worker contract", async () => {
  const dom = new JSDOM("<!doctype html><html><head></head><body><main id=\"main\"></main></body></html>", {
    url: "https://bohoa96tb.github.io/HSK3.0/#/tutor",
  });
  const keys = ["window", "document", "location", "localStorage", "navigator", "fetch", "HTMLElement"];
  const prevDescriptors = Object.fromEntries(keys.map((k) => [k, Object.getOwnPropertyDescriptor(globalThis, k)]));
  const setGlobal = (k, v) => Object.defineProperty(globalThis, k, { value: v, writable: true, configurable: true });
  const storage = fakeStorage();
  saveTutorState({
    ...defaultState(),
    config: { enabled: true, workerUrl: "https://tutor.example.workers.dev/", accessPin: "9999" },
  }, storage);

  const sentPayloads = [];
  setGlobal("window", dom.window);
  setGlobal("document", dom.window.document);
  setGlobal("location", dom.window.location);
  setGlobal("localStorage", storage);
  setGlobal("navigator", {}); // no mic API -> tests graceful unsupported fallback
  setGlobal("HTMLElement", dom.window.HTMLElement);
  dom.window.HTMLElement.prototype.scrollIntoView = () => {};
  dom.window.confirm = () => true;
  setGlobal("fetch", async (url, init) => {
    if (String(url).includes("data/content.json")) {
      return new Response(JSON.stringify(content), { status: 200, headers: { "Content-Type": "application/json" } });
    }
    sentPayloads.push(JSON.parse(init.body));
    const idx = sentPayloads.length;
    if (idx === 1) {
      // Turn 1: correct mode (wrong answer)
      return new Response(JSON.stringify({
        ok: true,
        passed: false,
        user_transcript_hanzi: "我没吃完饭了",
        user_transcript_pinyin: "Wǒ méi chīwán fàn le",
        evaluation: {
          has_error: true,
          error_type: "grammar",
          corrected_hanzi: "我没吃完饭。",
          corrected_pinyin: "Wǒ méi chīwán fàn.",
          explanation_vi: "(1) Ghi nhận: Bạn dùng đúng cụm 吃完. (2) Sửa lỗi: Khi phủ định với 没 phải bỏ 了 ở cuối câu.",
          pronunciation_status: "not_assessed",
          pronunciation_feedback_vi: "",
        },
        tutor_reply: {
          hanzi: "我没吃完饭。",
          pinyin: "Wǒ méi chīwán fàn.",
          translation_vi: "(3) Câu tự nhiên hơn & lặp lại: Tôi chưa ăn xong cơm.",
          out_of_level_words: [],
        },
        timings: { geminiMs: 850 },
      }), { status: 200, headers: { "Content-Type": "application/json" } });
    }
    if (idx === 2) {
      // Turn 2: translate mode WRONG (passed: false -> stay on Câu 2)
      return new Response(JSON.stringify({
        ok: true,
        passed: false,
        user_transcript_hanzi: "我休息一休息",
        user_transcript_pinyin: "Wǒ xiūxi yì xiūxi",
        evaluation: {
          has_error: true,
          error_type: "grammar",
          corrected_hanzi: "我想休息休息。",
          corrected_pinyin: "Wǒ xiǎng xiūxi xiūxi.",
          explanation_vi: "Động từ hai âm tiết khi lặp lại không chèn 一 vào giữa, nói là 休息休息.",
          pronunciation_status: "not_assessed",
          pronunciation_feedback_vi: "",
        },
        tutor_reply: {
          hanzi: "我想休息休息。",
          pinyin: "Wǒ xiǎng xiūxi xiūxi.",
          translation_vi: "Bạn thử nói lại câu trên một lần nữa nhé.",
          out_of_level_words: [],
        },
        timings: { geminiMs: 700 },
      }), { status: 200, headers: { "Content-Type": "application/json" } });
    }
    // Turn 3: translate mode PASSED (passed: true -> advance to Câu 3 without leaking Câu 3 Chinese!)
    return new Response(JSON.stringify({
      ok: true,
      passed: true,
      user_transcript_hanzi: "我想休息休息。",
      user_transcript_pinyin: "Wǒ xiǎng xiūxi xiūxi.",
      evaluation: {
        has_error: false,
        error_type: "none",
        corrected_hanzi: "",
        corrected_pinyin: "",
        explanation_vi: "Chính xác rồi!",
        pronunciation_status: "not_assessed",
        pronunciation_feedback_vi: "",
      },
      tutor_reply: {
        hanzi: "对，很好！",
        pinyin: "Duì, hěn hǎo!",
        translation_vi: "Chuẩn rồi! Sang câu tiếp theo nhé.",
        out_of_level_words: [],
      },
      timings: { geminiMs: 650 },
    }), { status: 200, headers: { "Content-Type": "application/json" } });
  });

  try {
    const { mountTutor } = await import("../js/ai-tutor/tutor-view.js");
    const main = dom.window.document.getElementById("main");
    const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
    await mountTutor(main, {
      esc,
      header: (t, s) => `<header><h1>${t}</h1><p>${s || ""}</p></header>`,
      navActive: () => {},
      recentLessonId: "hsk2-l03",
      recentLessonUpdatedAt: "2026-11-27T12:00:00Z",
    });

    // 1. Defaults to most recent lesson (HSK 2 Bài 03)
    assert.equal(main.querySelector("#t-level").value, "HSK2");
    assert.equal(main.querySelector("#t-lesson").value, "hsk2-l03");
    assert.match(main.querySelector("#t-lesson-brief").textContent, /我想去西安旅游/);

    // 2. Graceful mic unsupported note
    assert.equal(main.querySelector("#t-mic").disabled, true);
    assert.match(main.querySelector(".tutor-mic-note").textContent, /chưa hỗ trợ ghi âm/);

    // 3. Global Pinyin & Nghĩa Việt toggles
    const root = main.querySelector("#tutor-root");
    main.querySelector("#t-toggle-global-pinyin").click();
    assert.ok(root.classList.contains("hide-pinyin"));
    main.querySelector("#t-toggle-global-vi").click();
    assert.ok(root.classList.contains("hide-vi"));
    main.querySelector("#t-toggle-global-pinyin").click();
    main.querySelector("#t-toggle-global-vi").click();

    // 4. Switch to Roleplay & open Hints drawer
    main.querySelector('[data-pmode="roleplay"]').click();
    assert.equal(main.querySelectorAll(".tutor-bubble.tutor").length, 1);
    main.querySelector("#t-hints-btn").click();
    assert.equal(main.querySelector("#t-hints-panel").hidden, false);
    assert.ok(main.querySelectorAll(".tutor-hint-item").length >= 3);

    // 5. Switch to Kiểm tra & Sửa lỗi -> send turn -> verify 3-step pedagogical rendering & Worker contract
    main.querySelector('[data-pmode="correct"]').click();
    main.querySelector("#t-text").value = "我没吃完饭了";
    main.querySelector("#t-text-form").dispatchEvent(new dom.window.Event("submit", { bubbles: true, cancelable: true }));
    await new Promise((r) => setTimeout(r, 20));
    assert.equal(sentPayloads.length, 1);
    assert.equal(_internal.validateTurn(sentPayloads[0]), null);
    assert.equal(sentPayloads[0].mode, "tutor");
    assert.match(main.textContent, /\(1\) Ghi nhận ý đúng/);
    assert.match(main.textContent, /我没吃完饭。/);

    // 6. Switch to Phản xạ dịch nhanh -> verify drill deck, skip button, pass/fail advancement, anti-leak
    const deck = lessonTranslateSeeds("hsk2-l03", lex);
    main.querySelector('[data-pmode="translate"]').click();
    assert.equal(main.querySelector("#t-drill-card").hidden, false);
    assert.equal(main.querySelector("#t-next-drill").hidden, false);
    assert.match(main.querySelector("#t-drill-card").textContent, /Câu 1 \/ 8/);
    assert.ok(main.querySelector("#t-drill-card").textContent.includes(deck[0].vi));
    assert.ok(!main.querySelector("#t-drill-card").textContent.includes(deck[0].refZh), "drill card must not leak Chinese answer");

    // Manual skip to Câu 2
    main.querySelector("#t-next-drill").click();
    assert.match(main.querySelector("#t-drill-card").textContent, /Câu 2 \/ 8/);
    assert.ok(main.querySelector("#t-drill-card").textContent.includes(deck[1].vi));

    // Wrong answer -> stays on Câu 2
    main.querySelector("#t-text").value = "我休息一休息";
    main.querySelector("#t-text-form").dispatchEvent(new dom.window.Event("submit", { bubbles: true, cancelable: true }));
    await new Promise((r) => setTimeout(r, 20));
    assert.equal(sentPayloads.length, 2);
    assert.equal(_internal.validateTurn(sentPayloads[1]), null);
    assert.match(main.querySelector("#t-drill-card").textContent, /Câu 2 \/ 8/);
    assert.match(main.querySelector(".tutor-challenge-box").textContent, /Thử nói lại câu 2\/8/);

    // Right answer (passed: true) -> auto advances to Câu 3 and does NOT leak Câu 3 Chinese
    main.querySelector("#t-text").value = "我想休息休息。";
    main.querySelector("#t-text-form").dispatchEvent(new dom.window.Event("submit", { bubbles: true, cancelable: true }));
    await new Promise((r) => setTimeout(r, 20));
    assert.equal(sentPayloads.length, 3);
    assert.match(main.querySelector("#t-drill-card").textContent, /Câu 3 \/ 8/);
    assert.ok(main.querySelector("#t-drill-card").textContent.includes(deck[2].vi));
    const latestTutorBubble = [...main.querySelectorAll(".tutor-bubble.tutor")].pop();
    assert.ok(latestTutorBubble.querySelector(".tutor-challenge-box").textContent.includes(deck[2].vi));
    assert.ok(!latestTutorBubble.querySelector(".tutor-part-zh").textContent.includes(deck[2].refZh), "part (a) must never leak next question Chinese");

    // Anti-leak in Hints drawer before failing Câu 3
    main.querySelector("#t-hints-btn").click();
    assert.ok(!main.querySelector("#t-hints-panel").textContent.includes(deck[2].refZh), "answer hidden until reveal click");
    main.querySelector("#t-reveal-drill-answer").click();
    assert.ok(main.querySelector("#t-hints-panel").textContent.includes(deck[2].refZh), "answer revealed on explicit click");
  } finally {
    for (const k of keys) {
      if (prevDescriptors[k]) Object.defineProperty(globalThis, k, prevDescriptors[k]);
      else delete globalThis[k];
    }
  }
});
