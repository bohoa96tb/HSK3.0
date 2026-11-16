// HSK3.0 AI Tutor — Cloudflare Worker proxy for Google Gemini.
// The Gemini API key lives ONLY as a Worker secret (env.GEMINI_API_KEY).
// It is never sent to the browser, never logged, never put in a URL.
//
// Endpoint: POST /api/tutor-turn
// Health:   GET  /health
//
// Security/cost controls (see README.md):
// - CORS allowlist (no wildcard): https://bohoa96tb.github.io + localhost dev.
// - Optional shared PIN via env TUTOR_ACCESS_PIN + header X-Tutor-Pin
//   (timing-safe compare; PIN is a cost gate, not real authentication).
// - Body hard cap 500 KB (Content-Length AND actual bytes) -> HTTP 413.
// - Audio MIME allowlist; base64 audio size checked after decode estimate.
// - Basic per-IP+PIN in-memory rate limit -> HTTP 429 (per isolate; pair
//   with a Cloudflare Rate Limiting rule for production, see README).
// - Gemini call: single attempt, 25 s timeout, maxOutputTokens hard cap 600,
//   Structured Outputs (responseMimeType + responseSchema). No automatic
//   model fallback: upstream errors are mapped to Vietnamese messages.

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

function rateLimited(key) {
  const now = Date.now();
  const bucket = rateBuckets.get(key) || { start: now, count: 0 };
  if (now - bucket.start > RATE_LIMIT.windowMs) { bucket.start = now; bucket.count = 0; }
  bucket.count += 1;
  rateBuckets.set(key, bucket);
  if (rateBuckets.size > 5000) rateBuckets.clear(); // crude memory guard
  return bucket.count > RATE_LIMIT.max;
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
        mimeType: String(body.audioMimeType || "audio/webm").split(";")[0].trim().toLowerCase(),
        data: body.userAudioBase64,
      },
    });
    parts.push({ text: "(Người học vừa nói câu trên bằng giọng nói. Hãy chép lại đúng những gì nghe được vào user_transcript_hanzi/pinyin rồi đánh giá.)" });
  }
  contents.push({ role: "user", parts });
  return contents;
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
      maxOutputTokens: 600,
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
      return errorVi(403, "ORIGIN_DENIED", "Origin không được phép.", origin);
    }
    if (!env.GEMINI_API_KEY) {
      console.log("config_error missing GEMINI_API_KEY");
      return errorVi(503, "NOT_CONFIGURED", "Máy chủ chưa cấu hình khóa Gemini. Người quản trị cần đặt secret GEMINI_API_KEY cho Worker.", origin);
    }
    if (env.TUTOR_ACCESS_PIN) {
      const pin = request.headers.get("X-Tutor-Pin") || "";
      if (!safeEqual(pin, env.TUTOR_ACCESS_PIN)) {
        return errorVi(401, "PIN_INVALID", "Mã PIN chưa đúng hoặc chưa nhập. Kiểm tra lại trong Cài đặt của app.", origin);
      }
    }
    const declared = Number(request.headers.get("Content-Length") || 0);
    if (declared > MAX_BODY_BYTES) {
      return errorVi(413, "TOO_LARGE", "Dữ liệu gửi lên quá lớn (tối đa 500 KB). Hãy nói câu ngắn hơn.", origin);
    }
    const ip = request.headers.get("CF-Connecting-IP") || "unknown";
    const pinTag = env.TUTOR_ACCESS_PIN ? "pin" : "open";
    if (rateLimited(`${ip}|${pinTag}`)) {
      return errorVi(429, "RATE_LIMIT", "Bạn gửi quá nhanh. Đợi vài phút rồi thử lại nhé.", origin);
    }
    let raw;
    try { raw = await request.text(); }
    catch { return errorVi(400, "BAD_BODY", "Không đọc được dữ liệu gửi lên.", origin); }
    if (new TextEncoder().encode(raw).length > MAX_BODY_BYTES) {
      return errorVi(413, "TOO_LARGE", "Dữ liệu gửi lên quá lớn (tối đa 500 KB). Hãy nói câu ngắn hơn.", origin);
    }
    let body;
    try { body = JSON.parse(raw); }
    catch { return errorVi(400, "BAD_JSON", "Dữ liệu gửi lên không phải JSON hợp lệ.", origin); }
    const invalid = validateTurn(body);
    if (invalid) return errorVi(400, "BAD_TURN", invalid, origin);

    try {
      const result = await callGemini(env, body);
      return jsonResponse(200, { ok: true, ...result }, origin);
    } catch (e) {
      switch (e.code) {
        case "GEMINI_TIMEOUT": return errorVi(504, "TIMEOUT", "Máy chủ AI phản hồi quá chậm. Thử lại sau ít giây nhé.", origin);
        case "GEMINI_RATE_LIMIT": return errorVi(429, "RATE_LIMIT", "Hệ thống AI đang quá tải. Đợi một lát rồi thử lại.", origin);
        case "GEMINI_BAD_JSON": return errorVi(502, "BAD_RESPONSE", "AI trả về dữ liệu không hợp lệ. Thử lại một lần nữa nhé.", origin);
        default: return errorVi(502, "UPSTREAM", "Chưa nối được tới AI. Kiểm tra mạng rồi thử lại.", origin);
      }
    }
  },
};

// Exported for unit tests (tests/ai-tutor.test.mjs imports these helpers).
export const _internal = { isAllowedOrigin, safeEqual, validateTurn, buildContents, RESPONSE_SCHEMA, MAX_BODY_BYTES };
