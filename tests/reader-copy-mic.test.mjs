// D38 regression suite (Hoa's rejection of PR #130 behaviour, 2026-11-09):
// real DOM behaviour in jsdom with a mocked microphone — copy inputs exist
// ONLY in copy mode, copy mode is session-only, the recorder is
// independent of the copy block and every mic state is visible.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { JSDOM } from 'jsdom';
const content = JSON.parse(readFileSync(new URL('../data/content.json', import.meta.url)));
const css = readFileSync(new URL('../assets/styles.css', import.meta.url), 'utf8');
const appSrc = readFileSync(new URL('../src/app.js', import.meta.url), 'utf8');

const dom = new JSDOM(readFileSync(new URL('../index.html', import.meta.url), 'utf8'), { url: 'https://example.test/HSK3.0/' });
for (const k of ['window', 'document', 'location', 'localStorage', 'FormData']) globalThis[k] = dom.window[k];
Object.defineProperty(globalThis, 'navigator', { value: dom.window.navigator, configurable: true });
window.scrollTo = () => {};
window.scrollBy = () => {};
window.HTMLElement.prototype.scrollIntoView = () => {};
globalThis.requestAnimationFrame = (fn) => { fn(); return 0; };
const audios = [];
class TestAudio extends EventTarget {
  constructor(url) { super(); this.url = url; this.paused = true; audios.push(this); }
  async play() { this.paused = false; }
  pause() { this.paused = true; }
}
globalThis.Audio = TestAudio;
globalThis.fetch = async () => ({ ok: true, json: async () => structuredClone(content) });

// Mock microphone: a recorder whose stop() delivers one chunk then onstop.
const recorders = [];
const tracks = [];
class MockRecorder {
  constructor(stream, opts) { this.stream = stream; this.opts = opts; this.mimeType = opts?.mimeType || 'audio/webm'; this.stopped = false; recorders.push(this); }
  start() {}
  stop() { this.stopped = true; this.ondataavailable?.({ data: new Blob(['fake-audio']) }); this.onstop?.(); }
}
globalThis.MediaRecorder = MockRecorder;
let gumError = null;
Object.defineProperty(navigator, 'mediaDevices', { value: { getUserMedia: async () => {
  if (gumError) throw gumError;
  const track = { stopped: false, stop() { this.stopped = true; } };
  tracks.push(track);
  return { getTracks: () => [track] };
} }, configurable: true });

localStorage.setItem('hsk30.progress.v1', JSON.stringify({ schemaVersion: 1, learningRevision: 'textbook-pilot-v2', contentRevision: 'x' }));
await import('../src/app.js');
const tick = () => new Promise((r) => setTimeout(r, 10));
await tick();
async function route(path) { location.hash = '#/' + path; await tick(); }
const $ = (s) => document.querySelector(s);
const $$ = (s) => [...document.querySelectorAll(s)];

test('CSS: copy line hidden by default, shown only in copy mode', () => {
  assert.match(css, /\.copy-line\{display:none/);
  assert.match(css, /#main \.transcript\.copy-on \.copy-line\{display:block\}/);
  assert.ok(!/\.transcript \.copy-line\{display:block\}/.test(css), 'always-visible rule from the rejected build must be gone');
});

test('default reader: no copy mode, no visible copy controls state, mic present per line', async () => {
  await route('lesson/hsk2-l01/reader');
  const details = $('.transcript');
  assert.ok(details, 'transcript block exists');
  assert.ok(!details.classList.contains('copy-on'), 'copy mode off by default');
  const toggle = $('[data-copy-toggle]');
  assert.equal(toggle.getAttribute('aria-pressed'), 'false');
  for (const btn of $$('[data-rec]')) {
    assert.equal(btn.closest('.copy-line'), null, 'mic is NOT inside the copy block');
    const row = btn.closest('.line-controls');
    assert.ok(row, 'mic sits in the line control row');
    assert.ok(row.querySelector('[data-speak], [data-tts]'), 'speaker and mic share the same row');
    const zh = btn.closest('.sentence').querySelector('.zh-sentence');
    assert.ok(zh.compareDocumentPosition(row) & 4 /* DOCUMENT_POSITION_FOLLOWING */, 'control row comes right after the Hanzi line');
  }
});

test('toggle on: copy mode class applies in place; reveal is per line; toggle off restores', async () => {
  const toggle = $('[data-copy-toggle]');
  toggle.click(); await tick();
  assert.ok($('.transcript').classList.contains('copy-on'));
  assert.equal(toggle.getAttribute('aria-pressed'), 'true');
  const lines = $$('.transcript .sentence');
  assert.ok(lines.length >= 2);
  const id2 = lines[1].dataset.sentence;
  lines[0].querySelector('[data-copy-reveal]').click(); await tick();
  assert.ok(lines[0].classList.contains('copy-revealed'), 'line 1 revealed');
  assert.ok(!lines[1].classList.contains('copy-revealed'), 'line 2 stays hidden');
  assert.ok(id2, 'line 2 id present');
  toggle.click(); await tick();
  assert.ok(!$('.transcript').classList.contains('copy-on'), 'copy mode off again');
});

test('copy mode does not leak into another lesson or into saved settings', async () => {
  $('[data-copy-toggle]').click(); await tick();
  assert.ok($('.transcript').classList.contains('copy-on'));
  await route('lesson/hsk1-l01/reader');
  assert.ok(!$('.transcript').classList.contains('copy-on'), 'new lesson starts in reading mode');
  const saved = JSON.parse(localStorage.getItem('hsk30.progress.v1'));
  assert.ok(!('transcriptCopyMode' in (saved.settings || {})), 'copy mode is never persisted to settings');
});

test('mic: pending state is immediate, recording state visible, stop yields a playable take', async () => {
  const micBtn = $$('[data-rec]')[0];
  const id = micBtn.dataset.rec;
  const status = () => document.querySelector(`[data-rec-status="${id}"]`);
  micBtn.click();
  assert.equal(status().textContent, 'Đang xin quyền micro…', 'pending state shows synchronously on tap');
  await tick(); await tick();
  const btn = micBtn;
  assert.match(btn.textContent, /Dừng thu/, 'button switches to stop');
  assert.match(status().textContent, /Đang thu âm/, 'recording state with timer');
  const before = recorders.length;
  btn.click(); await tick();
  assert.equal(recorders.length, before, 'stop does not create a new recorder');
  assert.ok(tracks.at(-1).stopped, 'mic track released on stop');
  const actions = document.querySelector(`[data-rec-actions="${id}"]`);
  assert.equal(actions.hidden, false, 'playback actions appear after a take');
  assert.match(status().textContent, /Đã thu/);
  audios.length = 0;
  document.querySelector(`[data-rec-play="${id}"]`).click(); await tick();
  assert.equal(audios.length, 1, 'playback creates an Audio for the take');
  assert.equal(audios[0].paused, false, 'take actually plays');
});

test('mic: re-record replaces the take; denied permission shows a useful error', async () => {
  const micBtn2 = $$('[data-rec]')[1];
  const id = micBtn2.dataset.rec;
  micBtn2.click(); await tick(); await tick();
  micBtn2.click(); await tick(); // stop take 1
  const firstCount = recorders.length;
  document.querySelector(`[data-rec-again="${id}"]`).click(); await tick(); await tick();
  assert.equal(recorders.length, firstCount + 1, 're-record starts a new recorder');
  document.querySelector(`[data-rec="${id}"]`).click(); await tick(); // stop take 2
  audios.length = 0;
  document.querySelector(`[data-rec-play="${id}"]`).click(); await tick();
  assert.equal(audios.length, 1, 'playback after re-record plays one take');
  gumError = Object.assign(new Error('denied'), { name: 'NotAllowedError' });
  const micBtn3 = $$('[data-rec]')[0];
  const id3 = micBtn3.dataset.rec;
  micBtn3.click(); await tick(); await tick();
  assert.match(document.querySelector(`[data-rec-status="${id3}"]`).textContent, /bị từ chối quyền/, 'denial surfaces a specific, useful message');
  gumError = null;
});

test('mic: navigating away mid-recording stops the recorder and releases the mic', async () => {
  const micBtn4 = $$('[data-rec]')[3] || $$('[data-rec]')[0];
  micBtn4.click(); await tick(); await tick();
  const rec = recorders.at(-1);
  const track = tracks.at(-1);
  await route('lesson/hsk2-l01/summary');
  assert.ok(rec.stopped, 'recorder stopped on navigation');
  assert.ok(track.stopped, 'mic track released on navigation');
});

test('source: no silent audio failure remains in the recorder code', () => {
  assert.ok(!appSrc.includes('.catch(() => {})'), 'no empty catch swallows playback errors');
  assert.ok(appSrc.includes('MediaRecorder.isTypeSupported') || appSrc.includes('isTypeSupported'), 'mime support is probed');
  assert.ok(appSrc.includes('recorder.onerror'), 'recorder error handler exists');
});
