// A single shared <audio> element coordinates all playback in the app:
// starting a new track always stops the previous one. Audio streams directly
// from the source (Baulchino CDN); nothing is copied or proxied.
import { loadProgress, update } from "./store.js";

const audio = new Audio();
audio.preload = "none";

const listeners = new Set();
let current = null; // {trackId, url, label}

function emit() {
  const state = {
    trackId: current ? current.trackId : null,
    playing: !audio.paused && !audio.ended,
    currentTime: audio.currentTime || 0,
    duration: Number.isFinite(audio.duration) ? audio.duration : (current ? current.durationSec || 0 : 0),
    error: lastError,
  };
  for (const fn of listeners) fn(state);
}
let lastError = null;

audio.addEventListener("timeupdate", () => {
  emit();
  if (current && Math.floor(audio.currentTime) % 5 === 0) {
    update((p) => { p.audioState[current.trackId] = { position: audio.currentTime, url: current.url }; });
  }
});
audio.addEventListener("play", emit);
audio.addEventListener("pause", emit);
audio.addEventListener("ended", emit);
audio.addEventListener("loadedmetadata", emit);
audio.addEventListener("error", () => {
  lastError = "Không phát được audio từ nguồn. Kiểm tra mạng rồi thử lại, hoặc mở trang nguồn Baulchino.";
  emit();
});

export function subscribe(fn) { listeners.add(fn); fn({ trackId: current?.trackId ?? null, playing: false, currentTime: 0, duration: current?.durationSec || 0, error: lastError }); return () => listeners.delete(fn); }

export function playTrack(track, { rate = 1 } = {}) {
  lastError = null;
  if (current && current.trackId === track.id) {
    if (audio.paused) { audio.playbackRate = rate; audio.play().catch(() => {}); }
    else audio.pause();
    emit();
    return;
  }
  audio.pause();
  current = { trackId: track.id, url: track.url, label: track.label, durationSec: track.durationSec };
  audio.src = track.url;
  audio.playbackRate = rate;
  const saved = loadProgress().audioState[track.id];
  const onMeta = () => {
    if (saved && saved.position > 3 && Number.isFinite(audio.duration) && saved.position < audio.duration - 5) {
      audio.currentTime = saved.position;
    }
    audio.removeEventListener("loadedmetadata", onMeta);
  };
  audio.addEventListener("loadedmetadata", onMeta);
  audio.play().catch(() => { lastError = "Trình duyệt chưa cho phát. Chạm nút phát để thử lại."; emit(); });
  emit();
}

export function pause() { audio.pause(); emit(); }
export function seek(sec) { if (Number.isFinite(sec)) { audio.currentTime = sec; emit(); } }
export function setRate(rate) { audio.playbackRate = rate; emit(); }
export function getState() {
  return { trackId: current?.trackId ?? null, playing: !audio.paused && !audio.ended, currentTime: audio.currentTime || 0, duration: Number.isFinite(audio.duration) ? audio.duration : (current?.durationSec || 0), error: lastError, label: current?.label ?? null, url: current?.url ?? null };
}
export function fmtTime(sec) {
  if (!Number.isFinite(sec) || sec < 0) sec = 0;
  const m = Math.floor(sec / 60); const s = Math.floor(sec % 60);
  return `${m}:${String(s).padStart(2, "0")}`;
}
