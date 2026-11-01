import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { JSDOM } from 'jsdom';
import { gradeDictationCell, gradeDictation, isConflictCell } from '../src/lib.js';

const content = JSON.parse(readFileSync(new URL('../data/content.json', import.meta.url)));
const l5 = content.additionalLessons.find((c) => c.lessonId === 'hsk1-l05');
const task = l5.selfCheckTasks.find((t) => t.id === 'st-l05-01');

test('source-conflict cell is never graded and leaves the score denominator', () => {
  assert.equal(isConflictCell(task, 4), true);
  assert.equal(isConflictCell(task, 0), false);
  for (const inp of ['jiā', 'jiǎ', 'xiǎ', 'jia1', 'jia3', '']) {
    const r = gradeDictationCell(task, 4, inp);
    assert.equal(r.graded, false, inp);
    assert.equal(r.reason, 'source-conflict');
    assert.equal(r.conflict, true);
  }
  // Full run: 8 inputs, only 7 graded; the script syllables of the graded
  // cells are all correct, so the score is 7/7 — the conflict cell is in
  // neither the numerator nor the denominator.
  const all = gradeDictation(task, task.scriptSyllables);
  assert.equal(all.total, 7);
  assert.equal(all.correct, 7);
  // Even a "wrong-looking" conflict input cannot lower the score.
  const mixed = [...task.scriptSyllables];
  mixed[4] = 'jia3';
  const m = gradeDictation(task, mixed);
  assert.equal(m.total, 7);
  assert.equal(m.correct, 7);
  // A genuinely wrong graded cell still counts.
  const wrong = [...task.scriptSyllables];
  wrong[0] = 'kē';
  const w = gradeDictation(task, wrong);
  assert.equal(w.total, 7);
  assert.equal(w.correct, 6);
});

// ---- boot migration: old first/last results and the review-queue entry
// for the conflict cell are removed from current statistics, while the
// learner's history (try counts, drafts) and other cells stay intact. ----
const dom = new JSDOM(readFileSync(new URL('../index.html', import.meta.url), 'utf8'), { url: 'https://example.test/HSK3.0/' });
for (const k of ['window', 'document', 'location', 'localStorage', 'FormData']) globalThis[k] = dom.window[k];
Object.defineProperty(globalThis, 'navigator', { value: dom.window.navigator, configurable: true });
window.scrollTo = () => {};
window.scrollBy = () => {};
window.HTMLElement.prototype.scrollIntoView = () => {};
globalThis.requestAnimationFrame = (fn) => { fn(); return 0; };
class TestAudio extends EventTarget {
  constructor(src) { super(); this.src = src || ''; this.currentTime = 0; this.duration = 100; this.paused = true; this.playbackRate = 1; audios.push(this); }
  play() { this.paused = false; this.dispatchEvent(new dom.window.Event('playing')); return Promise.resolve(); }
  pause() { this.paused = true; }
  load() {}
}
const audios = [];
globalThis.Audio = TestAudio;
window.Audio = TestAudio;
globalThis.fetch = async (url) => {
  if (String(url).includes('data/content.json')) return { ok: true, json: async () => content };
  return { ok: false, status: 404, json: async () => ({}) };
};
const seed = {
  schemaVersion: 1,
  settings: {},
  lessons: {}, attempts: [], selfChecks: {},
  reviewItems: {
    'dict-st-l05-01:4': { sourceItemId: 'st-l05-01:4', kind: 'dictation', intervalStep: 0, dueAt: '2026-11-02T00:00:00.000Z', lastResult: 'wrong', attempts: 1 },
    'dict-st-l05-01:0': { sourceItemId: 'st-l05-01:0', kind: 'dictation', intervalStep: 0, dueAt: '2026-11-02T00:00:00.000Z', lastResult: 'wrong', attempts: 2 },
  },
  exerciseSession: null, exerciseSessions: {},
  drafts: { 'st-l05-01:4': 'jia3', 'st-l05-01:0': 'ge1' },
  dictation: {
    'st-l05-01': {
      first: { 0: false, 4: false },
      last: { 0: { correct: false, input: 'ke1' }, 4: { correct: false, input: 'jia3' } },
      tries: { 0: 2, 4: 3 },
      peeked: false,
    },
  },
  audioState: {}, sessions: [],
};
localStorage.setItem('hsk30.progress.v1', JSON.stringify(seed));
await import('../src/app.js');
await new Promise((r) => setTimeout(r, 30));

test('boot migration excludes the conflict cell from statistics but preserves history', () => {
  const p = JSON.parse(localStorage.getItem('hsk30.progress.v1'));
  const e = p.dictation['st-l05-01'];
  assert.ok(!('4' in e.first), 'first score of the conflict cell removed');
  assert.ok(!('4' in e.last), 'last result of the conflict cell removed');
  assert.equal(e.first['0'], false, 'other cells keep their first result');
  assert.equal(e.last['0'].input, 'ke1', 'other cells keep their last result');
  assert.equal(e.tries['4'], 3, 'try counts (history) are preserved');
  assert.equal(p.drafts['st-l05-01:4'], 'jia3', 'the learner draft is preserved');
  assert.ok(!('dict-st-l05-01:4' in p.reviewItems), 'conflict cell leaves the review queue');
  assert.ok('dict-st-l05-01:0' in p.reviewItems, 'other review items are untouched');
});

test('conflict cell renders its suspension note and no right/wrong state', async () => {
  location.hash = '#/lesson/hsk1-l05/exercises';
  window.dispatchEvent(new dom.window.Event('hashchange'));
  await new Promise((r) => setTimeout(r, 30));
  const body = document.body.textContent;
  assert.ok(body.includes('Tạm không chấm — nguồn đang mâu thuẫn'), 'cell note renders');
  assert.ok(body.includes('Ô 5 tạm không chấm'), 'task-level conflict note renders');
  assert.ok(body.includes('Lần đầu: 0/1 ô'), 'first-score summary counts only graded cells');
});
