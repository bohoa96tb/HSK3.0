import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { JSDOM } from 'jsdom';
const content = JSON.parse(readFileSync(new URL('../data/content.json', import.meta.url)));
const l8 = content.additionalLessons.find((c) => c.lessonId === 'hsk1-l08');

// D28 (Hoa, 2026-11-03): the questions the book prints at a dialogue are
// answered under that dialogue in the reader, not in the exercise set.
// Attempts and the main session are keyed by item id, so state recorded
// before the move (when the items still lived in the set) must carry over.
const dom = new JSDOM(readFileSync(new URL('../index.html', import.meta.url), 'utf8'), { url: 'https://example.test/HSK3.0/' });
for (const k of ['window', 'document', 'location', 'localStorage', 'FormData']) globalThis[k] = dom.window[k];
Object.defineProperty(globalThis, 'navigator', { value: dom.window.navigator, configurable: true });
window.scrollTo = () => {};
window.scrollBy = () => {};
window.HTMLElement.prototype.scrollIntoView = () => {};
globalThis.requestAnimationFrame = (fn) => { fn(); return 0; };
class TestAudio extends EventTarget {
  constructor() { super(); this.paused = true; this.ended = false; this.duration = 500; this.currentTime = 0; this.readyState = 1; }
  async play() { this.paused = false; this.dispatchEvent(new Event('play')); }
  pause() { this.paused = true; this.dispatchEvent(new Event('pause')); }
}
globalThis.Audio = TestAudio;
globalThis.fetch = async () => ({ ok: true, json: async () => structuredClone(content) });

// State exactly as the pre-D28 build would have written it: wb8-text-1 was
// answered (correctly) from the exercise page; wb8-text-3 was answered
// wrongly and sits in the review queue.
localStorage.setItem('hsk30.progress.v1', JSON.stringify({
  schemaVersion: 1, learningRevision: 'textbook-pilot-v2', contentRevision: 'x',
  attempts: [
    { id: 'att-seed-1', exerciseId: 'wb8-text-1', lessonId: 'hsk1-l08', optionId: '3', correct: true, firstAttempt: true, hintUsed: false, supportUsed: false, at: '2026-11-03T00:00:00.000Z' },
    { id: 'att-seed-2', exerciseId: 'wb8-text-3', lessonId: 'hsk1-l08', optionId: '1', correct: false, firstAttempt: true, hintUsed: false, supportUsed: false, at: '2026-11-03T00:01:00.000Z' },
  ],
  exerciseSessions: {
    'set-tb-l08-text-v1': { setId: 'set-tb-l08-text-v1', index: 0, answers: { 'wb8-text-1': '3', 'wb8-text-3': '1' }, checked: { 'wb8-text-1': true, 'wb8-text-3': true }, hintUsed: {}, supportUsed: {} },
  },
  reviewItems: {
    'ex-wb8-text-3': { sourceItemId: 'wb8-text-3', kind: 'exercise', intervalStep: 0, dueAt: '2026-11-01T00:00:00.000Z', lastResult: 'wrong', attempts: 1 },
  },
}));
await import('../src/app.js');
const tick = () => new Promise((r) => setTimeout(r, 10));
await tick();
const $ = (s) => document.querySelector(s);
const $$ = (s) => [...document.querySelectorAll(s)];
async function route(path) { location.hash = '#/' + path; await tick(); }
const progress = () => JSON.parse(localStorage.getItem('hsk30.progress.v1'));

test('pre-move answers show as graded under their dialogue', async () => {
  await route('lesson/hsk1-l08/reader?passage=l08-dialogue-2');
  const item = $('#check-wb8-text-1');
  assert.ok(item, 'dialogue 2 carries its first question inline');
  assert.ok(item.querySelector('.feedback.ok'), 'the earlier correct answer renders as graded Đúng');
  assert.ok(item.querySelector('input[disabled]'), 'graded options are locked');
  assert.match($('#dialogue-checks').textContent, /Điểm lần đầu của phần này: 1\/1/);
});

test('answering inline records a shared first attempt', async () => {
  const form = $('#rc-form-wb8-text-2');
  assert.ok(form, 'second question form present');
  form.querySelector('input[name="opt"][value="1"]').click();
  form.querySelector('button[type="submit"]').click(); await tick();
  const item = $('#check-wb8-text-2');
  assert.ok(item.querySelector('.feedback.ok'), 'inline answer graded correct');
  const att = progress().attempts.filter((a) => a.exerciseId === 'wb8-text-2');
  assert.equal(att.length, 1);
  assert.equal(att[0].firstAttempt, true);
  assert.equal(att[0].correct, true);
});

test('the exercise set no longer contains the dialogue questions', async () => {
  await route('lesson/hsk1-l08/exercises');
  assert.match($('.exercise-zones').textContent, /Câu hỏi của hội thoại/);
  assert.match($('#exercise-card').textContent, /Câu 1\/15/);
  assert.ok(!$('#check-wb8-text-1') && !$('#rc-form-wb8-text-1'), 'no inline dialogue forms on the exercises page');
});

test('lesson summary counts dialogue checks in the graded total', async () => {
  await route('lesson/hsk1-l08/summary');
  assert.match($('#main').textContent, /Bài tập chấm tự động: điểm lần đầu 2\/3/);
  assert.match($('#main').textContent, /gồm cả câu hỏi tại các hội thoại/);
});

test('review sends a wrong dialogue answer back to its dialogue', async () => {
  await route('review');
  const link = $$('#main a').find((a) => (a.getAttribute('href') || '').includes('reader?passage=l08-dialogue-3'));
  assert.ok(link, 'review row links to Dialogue 3 in the reader');
});
