// Voice engine for the AI Tutor: microphone recording (Android-first) +
// Chinese TTS playback. Audio blobs live ONLY in RAM (object URLs); nothing
// is persisted to localStorage or disk by this module.

export const MAX_RECORD_SECONDS = 20;
export const MAX_AUDIO_BYTES = 360 * 1024; // decoded-audio budget under the Worker's 500 KB body cap

const MIME_CANDIDATES = [
  "audio/webm;codecs=opus",
  "audio/webm",
  "audio/mp4",
  "audio/ogg;codecs=opus",
  "audio/ogg",
];

export function isVoiceInputSupported(nav = typeof navigator !== "undefined" ? navigator : null, recorderCtor = typeof MediaRecorder !== "undefined" ? MediaRecorder : null) {
  return Boolean(nav?.mediaDevices?.getUserMedia && typeof recorderCtor !== "undefined");
}

export function isTtsSupported(win = typeof window !== "undefined" ? window : null) {
  return Boolean(win && "speechSynthesis" in win);
}

// Pick the first MIME the CURRENT device actually supports — never assume
// Android Chrome supports webm or mp4 uniformly.
export function pickMimeType(recorderCtor = typeof MediaRecorder !== "undefined" ? MediaRecorder : null) {
  if (!recorderCtor || typeof recorderCtor.isTypeSupported !== "function") return "";
  for (const mime of MIME_CANDIDATES) {
    try { if (recorderCtor.isTypeSupported(mime)) return mime; } catch { /* try next */ }
  }
  return ""; // empty = let the browser choose its default
}

export function micErrorVi(err) {
  const name = err?.name || "";
  if (name === "NotAllowedError" || name === "SecurityError") {
    return "Chưa được cấp quyền micro. Trên Android: chạm biểu tượng ổ khóa/thông tin ở thanh địa chỉ → Quyền (Permissions) → Micro → Cho phép, rồi thử lại. Hoặc vào Cài đặt máy → Ứng dụng → Chrome → Quyền → Micro.";
  }
  if (name === "NotFoundError" || name === "OverconstrainedError") {
    return "Không tìm thấy micro trên thiết bị này. Kiểm tra tai nghe/micro rồi thử lại.";
  }
  if (name === "NotReadableError" || name === "AbortError") {
    return "Micro đang bận (có thể một ứng dụng khác đang dùng). Đóng ứng dụng đó rồi thử lại.";
  }
  return "Chưa mở được micro. Kiểm tra quyền micro trong trình duyệt rồi thử lại.";
}

export class VoiceRecorder {
  constructor({ onState } = {}) {
    this.onState = onState || (() => {});
    this.recorder = null;
    this.stream = null;
    this.chunks = [];
    this.blobUrl = null;
    this.startedAt = 0;
    this.timer = null;
    this.mimeType = "";
    this.state = "idle"; // idle | requesting | recording | stopped
  }

  _setState(state, extra = {}) {
    this.state = state;
    this.onState(state, extra);
  }

  get recording() { return this.state === "recording"; }

  async start() {
    if (this.state === "recording" || this.state === "requesting") return false;
    if (!isVoiceInputSupported()) {
      this._setState("error", { message: "Trình duyệt này không hỗ trợ ghi âm. Hãy mở app bằng Chrome (Android) hoặc Safari/Chrome mới nhất rồi thử lại." });
      return false;
    }
    this._setState("requesting");
    let stream;
    try {
      stream = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: true, noiseSuppression: true, channelCount: 1 },
      });
    } catch (err) {
      this._setState("error", { message: micErrorVi(err) });
      return false;
    }
    this.stream = stream;
    this.chunks = [];
    this.mimeType = pickMimeType();
    try {
      this.recorder = this.mimeType ? new MediaRecorder(stream, { mimeType: this.mimeType }) : new MediaRecorder(stream);
    } catch {
      try { this.recorder = new MediaRecorder(stream); this.mimeType = ""; }
      catch {
        this._releaseStream();
        this._setState("error", { message: "Thiết bị không khởi tạo được bộ ghi âm. Thử trình duyệt Chrome mới nhất." });
        return false;
      }
    }
    this.recorder.ondataavailable = (e) => { if (e.data && e.data.size) this.chunks.push(e.data); };
    this.recorder.onstop = () => this._finish();
    this.recorder.start(250);
    this.startedAt = Date.now();
    this._setState("recording", { seconds: 0 });
    this.timer = setInterval(() => {
      const seconds = Math.floor((Date.now() - this.startedAt) / 1000);
      this._setState("recording", { seconds });
      if (seconds >= MAX_RECORD_SECONDS) this.stop(); // auto-stop + send at 20 s
    }, 250);
    return true;
  }

  stop() {
    if (this.recorder && this.state === "recording") {
      try { this.recorder.stop(); } catch { this._finish(); }
    }
  }

  _finish() {
    if (this.timer) { clearInterval(this.timer); this.timer = null; }
    const seconds = Math.max(1, Math.round((Date.now() - this.startedAt) / 1000));
    const type = this.recorder?.mimeType || this.mimeType || "audio/webm";
    const blob = new Blob(this.chunks, { type });
    this.chunks = [];
    this._releaseStream();
    this.revokePlayback();
    this.blobUrl = URL.createObjectURL(blob);
    this._setState("stopped", { blob, blobUrl: this.blobUrl, seconds, mimeType: blob.type || type });
  }

  _releaseStream() {
    if (this.stream) {
      for (const track of this.stream.getTracks()) { try { track.stop(); } catch { /* already stopped */ } }
      this.stream = null;
    }
  }

  revokePlayback() {
    if (this.blobUrl) { try { URL.revokeObjectURL(this.blobUrl); } catch { /* noop */ } this.blobUrl = null; }
  }

  // Full cleanup when the session/view goes away: stop recorder, stop mic
  // tracks, revoke the playback URL.
  dispose() {
    if (this.timer) { clearInterval(this.timer); this.timer = null; }
    if (this.recorder && this.state === "recording") {
      this.recorder.onstop = null;
      try { this.recorder.stop(); } catch { /* noop */ }
    }
    this.recorder = null;
    this._releaseStream();
    this.revokePlayback();
    this._setState("idle");
  }
}

export function blobToBase64(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const s = String(reader.result || "");
      resolve(s.slice(s.indexOf(",") + 1));
    };
    reader.onerror = () => reject(new Error("Không đọc được bản ghi âm."));
    reader.readAsDataURL(blob);
  });
}

// ---------------- TTS (device speech, labelled as machine voice) ----------

let zhVoiceCache = null;

function pickZhVoice() {
  if (!isTtsSupported()) return null;
  const voices = window.speechSynthesis.getVoices();
  zhVoiceCache = voices.find((v) => /^zh[-_]CN/i.test(v.lang || "")) ||
    voices.find((v) => /^zh/i.test(v.lang || "")) || null;
  return zhVoiceCache;
}

if (typeof window !== "undefined" && "speechSynthesis" in window) {
  try { window.speechSynthesis.onvoiceschanged = () => pickZhVoice(); } catch { /* noop */ }
}

export function speakZh(text, { rate = 1, onStatus } = {}) {
  const clean = String(text || "").trim();
  if (!clean) return false;
  if (!isTtsSupported()) {
    onStatus?.("Trình duyệt này không có giọng đọc. Hãy thử Chrome trên Android.");
    return false;
  }
  try {
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(clean);
    u.lang = "zh-CN";
    u.rate = rate === 0.75 ? 0.75 : 1;
    const voice = pickZhVoice();
    if (voice) u.voice = voice;
    else onStatus?.("Thiết bị chưa có giọng tiếng Trung — máy sẽ đọc bằng giọng mặc định, có thể không chuẩn.");
    u.onstart = () => onStatus?.(rate === 0.75 ? "Đang đọc chậm…" : "Đang đọc…");
    u.onend = () => onStatus?.("");
    u.onerror = () => onStatus?.("Chưa đọc được câu này. Thử lại một lần nữa nhé.");
    window.speechSynthesis.speak(u);
    return true;
  } catch {
    onStatus?.("Chưa đọc được câu này. Thử lại một lần nữa nhé.");
    return false;
  }
}

export function stopSpeak() {
  try { window.speechSynthesis?.cancel(); } catch { /* noop */ }
}
