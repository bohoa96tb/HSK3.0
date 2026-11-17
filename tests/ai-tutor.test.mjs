// AI Tutor module tests — new file, does not modify any existing test.
// Covers: guardrail adapter against the REAL data/content.json, scenarios,
// storage caps/scoping, Worker helpers (origin/PIN/validation/schema),
// voice MIME picking. Browser-only behaviour (mic, TTS, route in a real
// browser) is NOT covered here — see docs/AI_TUTOR_QA_REPORT.md.
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

import {
  buildLexicon, lookupLocalWord, allowedWords, allowedGrammar,
  segmentByLexicon, buildSystemInstruction, coverageNote, normalizeLevel,
} from "../js/ai-tutor/hsk-guardrail.js";
import { SCENARIOS, scenarioById } from "../js/ai-tutor/roleplay-scenarios.js";
import {
  TUTOR_KEY, defaultState, loadTutorState, saveTutorState, recordError, normalizeWorkerUrl,
  recordSpeakingSeconds, saveConversation, clearTutorHistory,
} from "../js/ai-tutor/tutor-storage.js";
import { _internal } from "../workers/ai-tutor-proxy/worker.js";
import worker from "../workers/ai-tutor-proxy/worker.js";
import { pickMimeType, micErrorVi, MAX_RECORD_SECONDS } from "../js/ai-tutor/voice-engine.js";

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
