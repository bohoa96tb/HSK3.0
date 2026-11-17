// =====================================================================
// HSK3.0 AI Tutor — Cloudflare Worker proxy for Google Gemini
// FINAL HANDOFF v4 (2026-11-17) — complete drop-in replacement.
// Supersedes v3: same frontend contract, three hardening fixes from
// the final review round (rate-limit keying/eviction, streaming body
// cap, audio MIME normalisation). No other behaviour changed.
//
// Contract-verified line by line against the frontend at branch
// feat/ai-tutor commit f1cffec (js/ai-tutor/tutor-view.js):
//   POST {workerUrl}/api/tutor-turn
//   Request : { sessionId, level, mode, scenarioId?, systemInstruction,
//               history: [{role, hanzi}] (max 10),
//               userText }                       — text turn
//             { ..., userAudioBase64, audioMimeType } — audio turn
//   Header  : X-Tutor-Pin (sent by the app only when a PIN is set)
//   Response: { ok:true, user_transcript_hanzi, user_transcript_pinyin,
//               evaluation: { has_error, error_type, corrected_hanzi,
//                             corrected_pinyin, explanation_vi,
//                             pronunciation_status,
//                             pronunciation_feedback_vi },
//               tutor_reply: { hanzi, pinyin, translation_vi,
//                              out_of_level_words }, model }
//   Errors  : { ok:false, code, error } — Vietnamese messages.
//
// Security & limits:
//   - CORS allowlist ONLY: https://bohoa96tb.github.io plus
//     localhost / 127.0.0.1 on any port (local development). No "*".
//   - PIN (env TUTOR_ACCESS_PIN) compared timing-safe; enforced
//     whenever the secret is configured; never logged. PRODUCTION
//     MUST SET THIS SECRET — without it the endpoint is open.
//   - Body cap 500 KB enforced THREE ways: Content-Length pre-check,
//     streaming read that aborts as soon as the cap is exceeded,
//     and a final byte count. Oversize -> 413.
//   - Audio: MIME allowlist; audio/x-wav is normalised to audio/wav
//     before calling Gemini (both are listed/supported formats:
//     ai.google.dev audio guide lists audio/wav and audio/webm).
//   - Rate limit: 30 requests / 10 minutes per (IP + PIN) bucket.
//     Expired buckets are pruned; live buckets are NEVER wiped —
//     under memory pressure only the oldest buckets are evicted.
//   - Gemini: v1beta generateContent, key via x-goog-api-key header,
//     25 s timeout, single attempt, maxOutputTokens 800 with
//     thinkingConfig.thinkingLevel "low" (Gemini 4 thinks at "high"
//     by default and thought tokens count toward the output cap).
//   - The Gemini API key exists ONLY as a Cloudflare Secret; it is
//     never returned in responses and never written to logs.
// =====================================================================

const MAX_BODY_BYTES = 500 * 1024;
const MAX_HISTORY_TURNS = 10;
const MAX_SYSTEM_CHARS = 24000;
const MAX_USER_TEXT_CHARS = 600;
const GEMINI_TIMEOUT_MS = 25000;
const DEFAULT_MODEL = "gemini-4-hydrogen";
const ALLOWED_AUDIO_MIME = ["audio/webm", "audio/mp4", "audio/ogg", "audio/wav", "audio/x-wav", "audio/mpeg"];
const RATE_LIMIT = { windowMs: 10 * 60 * 1000, max: 30 }; // 30 turns / 10 min / key

const rateBuckets = new Map();

function isAllowedOrigin(origin) {
  if (!origin) return false;
  if (origin === "https://bohoa96tb.github.io") return true;
  try {
    const u = new URL(origin);
    return (u.protocol === "http:" || u.protocol === "https:") &&
      (u.hostname === "localhost" || u.hostname === "127.0.0.1");
  } catch { return false; }
}

function corsHeaders(origin) {
  if (!isAllowedOrigin(origin)) return {};
  return {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, X-Tutor-Pin",
    "Access-Control-Max-Age": "86400",
    "Vary": "Origin",
  };
}

function jsonResponse(status, obj, origin) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8", ...corsHeaders(origin) },
  });
}

function errorVi(status, code, messageVi, origin) {
  return jsonResponse(status, { ok: false, code, error: messageVi }, origin);
}

// Timing-safe string comparison (lengths leak, values do not).
function safeEqual(a, b) {
  const ea = new TextEncoder().encode(String(a || ""));
  const eb = new TextEncoder().encode(String(b || ""));
  if (ea.length !== eb.length) return false;
  let diff = 0;
  for (let i = 0; i < ea.length; i++) diff |= ea[i] ^ eb[i];
  return diff === 0;
}

// Bucket tag derived from the configured PIN (FNV-1a hash — used only
// to separate buckets, never logged, not a security control by itself).
function pinTagOf(pin) {
  const s = String(pin || "");
  if (!s) return "open";
  let h = 0x811c9dc5;
  for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 0x01000193) >>> 0; }
  return "p" + h.toString(16);
}

function rateLimited(key) {
  const now = Date.now();
  if (rateBuckets.size > 1000) {
    // Prune expired buckets first.
    for (const [k, b] of rateBuckets) {
      if (now - b.start > RATE_LIMIT.windowMs) rateBuckets.delete(k);
    }
    // Still oversized: evict OLDEST buckets one by one. Live buckets
    // are never wiped wholesale — a flood cannot reset other users'
    // counters (that was the v3 flaw this replaces).
    while (rateBuckets.size > 5000) {
      const oldest = rateBuckets.keys().next().value;
      if (oldest === undefined || oldest === key) break;
      rateBuckets.delete(oldest);
    }
  }
  const bucket = rateBuckets.get(key) || { start: now, count: 0 };
  if (now - bucket.start > RATE_LIMIT.windowMs) { bucket.start = now; bucket.count = 0; }
  bucket.count += 1;
  rateBuckets.set(key, bucket);
  return bucket.count > RATE_LIMIT.max;
}

// Read the request body as a stream and abort as soon as the byte cap
// is exceeded, so an oversize (or endless) body is never fully loaded
// into memory. Returns the decoded string, or null when over the cap.
async function readBodyCapped(request, maxBytes) {
  if (!request.body) return "";
  const reader = request.body.getReader();
  const decoder = new TextDecoder();
  let total = 0;
  let out = "";
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    total += value.byteLength;
    if (total > maxBytes) {
      try { await reader.cancel(); } catch { /* already closed */ }
      return null;
    }
    out += decoder.decode(value, { stream: true });
  }
  out += decoder.decode();
  return out;
}

const RESPONSE_SCHEMA = {
  type: "OBJECT",
  properties: {
    user_transcript_hanzi: { type: "STRING" },
    user_transcript_pinyin: { type: "STRING" },
    evaluation: {
      type: "OBJECT",
      properties: {
        has_error: { type: "BOOLEAN" },
        error_type: { type: "STRING", enum: ["none", "grammar", "vocab", "pronunciation_or_tone"] },
        corrected_hanzi: { type: "STRING" },
        corrected_pinyin: { type: "STRING" },
        explanation_vi: { type: "STRING" },
        pronunciation_status: { type: "STRING", enum: ["assessed", "uncertain", "not_assessed"] },
        pronunciation_feedback_vi: { type: "STRING" },
      },
      required: ["has_error", "error_type", "corrected_hanzi", "corrected_pinyin", "explanation_vi", "pronunciation_status", "pronunciation_feedback_vi"],
    },
    tutor_reply: {
      type: "OBJECT",
      properties: {
        hanzi: { type: "STRING" },
        pinyin: { type: "STRING" },
        translation_vi: { type: "STRING" },
        out_of_level_words: {
          type: "ARRAY",
          items: {
            type: "OBJECT",
            properties: {
              hanzi: { type: "STRING" },
              pinyin: { type: "STRING" },
              meaning_vi: { type: "STRING" },
            },
            required: ["hanzi", "pinyin", "meaning_vi"],
          },
        },
      },
      required: ["hanzi", "pinyin", "translation_vi", "out_of_level_words"],
    },
  },
  required: ["user_transcript_hanzi", "user_transcript_pinyin", "evaluation", "tutor_reply"],
};

// Server-side guardrails appended to whatever system instruction the client
// built from the HSK lexicon, so a tampered client cannot strip them.
const SERVER_GUARDRAILS = [
  "QUY TẮC BẮT BUỘC TỪ MÁY CHỦ:",
  "1. Mỗi lượt chỉ sửa tối đa 1–2 lỗi quan trọng nhất; đừng biến mỗi lượt thành bài giảng.",
  "2. pronunciation_status: chỉ 'assessed' khi lượt này có ÂM THANH và nghe rõ; 'uncertain' khi có âm thanh nhưng nhỏ/ồn/không chắc; 'not_assessed' khi lượt này chỉ có văn bản — TUYỆT ĐỐI không suy luận lỗi phát âm từ transcript chữ.",
  "3. Chỉ đặt error_type='pronunciation_or_tone' khi pronunciation_status='assessed' và có căn cứ âm thanh cụ thể; pronunciation_feedback_vi giải thích ngắn bằng tiếng Việt (âm đầu/vận mẫu/thanh điệu/thiếu âm tiết).",
  "4. Nếu nhận diện giọng nói không đáng tin (âm thanh nhỏ, ồn, thiếu/thừa âm tiết bất thường), hãy phản ánh ở pronunciation_status='uncertain' và nói rõ trong pronunciation_feedback_vi là chưa đủ dữ liệu để kết luận.",
  "5. Chế độ roleplay: tutor_reply.hanzi giữ 100% vai diễn bằng tiếng Trung; tiếng Việt chỉ ở evaluation.explanation_vi, pronunciation_feedback_vi và tutor_reply.translation_vi.",
  "6. Từ vượt cấp nếu buộc phải dùng phải liệt kê đầy đủ vào tutor_reply.out_of_level_words.",
].join("\n");

// Canonical MIME sent to Gemini. audio/x-wav is an alias of audio/wav
// (the name in Google's supported-format list); codec parameters are
// stripped. Everything else passes through unchanged.
function normalizeAudioMime(mime) {
  const m = String(mime || "").split(";")[0].trim().toLowerCase();
  if (m === "audio/x-wav") return "audio/wav";
  return m;
}

function validateTurn(body) {
  if (!body || typeof body !== "object") return "Thân yêu cầu không hợp lệ.";
  if (typeof body.sessionId !== "string" || !body.sessionId || body.sessionId.length > 80) return "Thiếu sessionId hợp lệ.";
  if (!["HSK1", "HSK2", "HSK3"].includes(body.level)) return "Cấp độ HSK không hợp lệ.";
  if (!["tutor", "roleplay"].includes(body.mode)) return "Chế độ không hợp lệ.";
  if (typeof body.systemInstruction !== "string" || !body.systemInstruction || body.systemInstruction.length > MAX_SYSTEM_CHARS) return "systemInstruction thiếu hoặc quá dài.";
  const hasText = typeof body.userText === "string" && body.userText.trim().length > 0;
  const hasAudio = typeof body.userAudioBase64 === "string" && body.userAudioBase64.length > 0;
  if (hasText && body.userText.length > MAX_USER_TEXT_CHARS) return "Câu nhập quá dài (tối đa 600 ký tự).";
  if (!hasText && !hasAudio) return "Cần gửi văn bản hoặc âm thanh.";
  if (hasAudio) {
    const mime = String(body.audioMimeType || "").split(";")[0].trim().toLowerCase();
    if (!ALLOWED_AUDIO_MIME.includes(mime)) return "Định dạng âm thanh không được hỗ trợ.";
    // Base64 inflates ~4/3; reject decoded audio over ~360 KB.
    if (body.userAudioBase64.length > 480 * 1024) return "Âm thanh quá lớn.";
  }
  if (body.history != null && !Array.isArray(body.history)) return "history phải là mảng.";
  return null;
}

function buildContents(body) {
  const contents = [];
  const history = Array.isArray(body.history) ? body.history.slice(-MAX_HISTORY_TURNS) : [];
  for (const turn of history) {
    if (!turn || typeof turn.hanzi !== "string" || !turn.hanzi) continue;
    contents.push({
      role: turn.role === "tutor" ? "model" : "user",
      parts: [{ text: turn.hanzi.slice(0, MAX_USER_TEXT_CHARS) }],
    });
  }
  const parts = [];
  if (typeof body.userText === "string" && body.userText.trim()) parts.push({ text: body.userText.trim() });
  if (typeof body.userAudioBase64 === "string" && body.userAudioBase64) {
    parts.push({
      inlineData: {
        mimeType: normalizeAudioMime(body.audioMimeType || "audio/webm"),
        data: body.userAudioBase64,
      },
    });
    parts.push({ text: "(Người học vừa nói câu trên bằng giọng nói. Hãy chép lại đúng những gì nghe được vào user_transcript_hanzi/pinyin rồi đánh giá.)" });
  }
  contents.push({ role: "user", parts });
  return contents;
}

// Single source for Gemini-error → HTTP mapping, used for BOTH the
// client response and the timing log so the logged status can never
// diverge from the status actually returned.
function geminiErrorHttp(e) {
  switch (e?.code) {
    case "GEMINI_TIMEOUT": return { status: 504, code: "TIMEOUT", message: "Máy chủ AI phản hồi quá chậm. Thử lại sau ít giây nhé." };
    case "GEMINI_RATE_LIMIT": return { status: 429, code: "RATE_LIMIT", message: "Hệ thống AI đang quá tải. Đợi một lát rồi thử lại." };
    case "GEMINI_BAD_JSON": return { status: 502, code: "BAD_RESPONSE", message: "AI trả về dữ liệu không hợp lệ. Thử lại một lần nữa nhé." };
    case "GEMINI_TRUNCATED": return { status: 502, code: "TRUNCATED", message: "Câu trả lời của AI bị cắt ngắn giữa chừng. Hãy nói câu ngắn hơn rồi thử lại." };
    default: return { status: 502, code: "UPSTREAM", message: "Chưa nối được tới AI. Kiểm tra mạng rồi thử lại." };
  }
}

function logTiming(fields) {
  // One structured line per tutor turn for Cloudflare Workers Logs:
  // durations and sizes ONLY — never PIN, key, message content or audio.
  try { console.log(`tutor_timing ${JSON.stringify(fields)}`); } catch { /* logging must never break a turn */ }
}

async function callGemini(env, body) {
  const model = (env.GEMINI_MODEL || DEFAULT_MODEL).trim();
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`;
  const payload = {
    systemInstruction: { parts: [{ text: body.systemInstruction + "\n\n" + SERVER_GUARDRAILS }] },
    contents: buildContents(body),
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema: RESPONSE_SCHEMA,
      // Thought tokens count toward maxOutputTokens on Gemini 4; keep
      // thinking at "low" (docs: fewest tokens, lowest latency, suited
      // to fast chat) and reserve the 800-token cap for the JSON body.
      thinkingConfig: { thinkingLevel: "low" },
      maxOutputTokens: 800,
    },
  };
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), GEMINI_TIMEOUT_MS);
  let res;
  try {
    res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-goog-api-key": env.GEMINI_API_KEY },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });
  } catch (e) {
    if (e && e.name === "AbortError") {
      const err = new Error("timeout"); err.code = "GEMINI_TIMEOUT"; throw err;
    }
    const err = new Error("network"); err.code = "GEMINI_NETWORK"; throw err;
  } finally {
    clearTimeout(timer);
  }
  if (res.status === 429) { const err = new Error("rate"); err.code = "GEMINI_RATE_LIMIT"; throw err; }
  if (!res.ok) {
    // Log only status + model, never the key or the request body.
    console.log(`gemini_error status=${res.status} model=${model}`);
    const err = new Error("upstream"); err.code = "GEMINI_UPSTREAM"; err.status = res.status; throw err;
  }
  const data = await res.json();
  const finishReason = data?.candidates?.[0]?.finishReason || "";
  if (finishReason === "MAX_TOKENS") {
    console.log(`gemini_truncated model=${model}`);
    const err = new Error("truncated"); err.code = "GEMINI_TRUNCATED"; throw err;
  }
  const text = data?.candidates?.[0]?.content?.parts?.map((p) => p.text || "").join("") || "";
  let parsed;
  try { parsed = JSON.parse(text); }
  catch { const err = new Error("badjson"); err.code = "GEMINI_BAD_JSON"; throw err; }
  if (!parsed || typeof parsed !== "object" || !parsed.tutor_reply || !parsed.evaluation) {
    const err = new Error("badshape"); err.code = "GEMINI_BAD_JSON"; throw err;
  }
  return parsed;
}

export default {
  async fetch(request, env) {
    // worker_ms is measured from here (fetch-handler entry) to the
    // moment the response is created; gemini_ms covers only the
    // Gemini call + response processing inside callGemini's window.
    const tReq = Date.now();
    const origin = request.headers.get("Origin") || "";
    const url = new URL(request.url);

    if (request.method === "OPTIONS") {
      if (!isAllowedOrigin(origin)) return new Response(null, { status: 403 });
      return new Response(null, { status: 204, headers: corsHeaders(origin) });
    }
    if (url.pathname === "/health" && request.method === "GET") {
      return jsonResponse(200, { ok: true, service: "hsk3-ai-tutor-proxy", model: (env.GEMINI_MODEL || DEFAULT_MODEL) }, origin);
    }
    if (url.pathname !== "/api/tutor-turn" || request.method !== "POST") {
      return errorVi(404, "NOT_FOUND", "Không tìm thấy endpoint.", origin);
    }
    if (origin && !isAllowedOrigin(origin)) {
      logTiming({ status: 403, code: "ORIGIN_DENIED", worker_ms: Date.now() - tReq });
      return errorVi(403, "ORIGIN_DENIED", "Origin không được phép.", origin);
    }
    if (!env.GEMINI_API_KEY) {
      console.log("config_error missing GEMINI_API_KEY");
      logTiming({ status: 503, code: "NOT_CONFIGURED", worker_ms: Date.now() - tReq });
      return errorVi(503, "NOT_CONFIGURED", "Máy chủ chưa cấu hình khóa Gemini. Người quản trị cần đặt secret GEMINI_API_KEY cho Worker.", origin);
    }
    if (env.TUTOR_ACCESS_PIN) {
      const pin = request.headers.get("X-Tutor-Pin") || "";
      if (!safeEqual(pin, env.TUTOR_ACCESS_PIN)) {
        logTiming({ status: 401, code: "PIN_INVALID", worker_ms: Date.now() - tReq });
        return errorVi(401, "PIN_INVALID", "Mã PIN chưa đúng hoặc chưa nhập. Kiểm tra lại trong Cài đặt của app.", origin);
      }
    }
    const declared = Number(request.headers.get("Content-Length") || 0);
    if (declared > MAX_BODY_BYTES) {
      logTiming({ status: 413, code: "TOO_LARGE", worker_ms: Date.now() - tReq });
      return errorVi(413, "TOO_LARGE", "Dữ liệu gửi lên quá lớn (tối đa 500 KB). Hãy nói câu ngắn hơn.", origin);
    }
    const ip = request.headers.get("CF-Connecting-IP") || "unknown";
    if (rateLimited(`${ip}|${pinTagOf(env.TUTOR_ACCESS_PIN)}`)) {
      logTiming({ status: 429, code: "RATE_LIMIT", worker_ms: Date.now() - tReq });
      return errorVi(429, "RATE_LIMIT", "Bạn gửi quá nhanh. Đợi vài phút rồi thử lại nhé.", origin);
    }
    let raw;
    try { raw = await readBodyCapped(request, MAX_BODY_BYTES); }
    catch { logTiming({ status: 400, code: "BAD_BODY", worker_ms: Date.now() - tReq }); return errorVi(400, "BAD_BODY", "Không đọc được dữ liệu gửi lên.", origin); }
    if (raw === null) {
      logTiming({ status: 413, code: "TOO_LARGE", worker_ms: Date.now() - tReq });
      return errorVi(413, "TOO_LARGE", "Dữ liệu gửi lên quá lớn (tối đa 500 KB). Hãy nói câu ngắn hơn.", origin);
    }
    let body;
    try { body = JSON.parse(raw); }
    catch { logTiming({ status: 400, code: "BAD_JSON", worker_ms: Date.now() - tReq }); return errorVi(400, "BAD_JSON", "Dữ liệu gửi lên không phải JSON hợp lệ.", origin); }
    const invalid = validateTurn(body);
    if (invalid) { logTiming({ status: 400, code: "BAD_TURN", worker_ms: Date.now() - tReq }); return errorVi(400, "BAD_TURN", invalid, origin); }

    const meta = {
      type: body.userAudioBase64 ? "audio" : "text",
      model: env.GEMINI_MODEL || "gemini-4-hydrogen",
      instruction_chars: String(body.systemInstruction || "").length,
      history_turns: Array.isArray(body.history) ? body.history.length : 0,
      audio_kb: body.userAudioBase64 ? Math.round(body.userAudioBase64.length / 1024) : 0,
    };
    const g0 = Date.now();
    try {
      const result = await callGemini(env, body);
      const geminiMs = Date.now() - g0;
      logTiming({ ...meta, status: 200, code: "OK", gemini_ms: geminiMs, worker_ms: Date.now() - tReq });
      return jsonResponse(200, { ok: true, ...result, timings: { geminiMs } }, origin);
    } catch (e) {
      const mapped = geminiErrorHttp(e);
      logTiming({ ...meta, status: mapped.status, code: mapped.code, gemini_ms: Date.now() - g0, worker_ms: Date.now() - tReq });
      return errorVi(mapped.status, mapped.code, mapped.message, origin);
    }
  },
};

// Exported for unit tests (tests/ai-tutor.test.mjs imports these helpers).
export const _internal = { isAllowedOrigin, safeEqual, validateTurn, buildContents, RESPONSE_SCHEMA, MAX_BODY_BYTES, normalizeAudioMime, pinTagOf, readBodyCapped };
