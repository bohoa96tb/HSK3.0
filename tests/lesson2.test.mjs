import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { JSDOM } from 'jsdom';
import { gradeChoice, migrateProgress } from '../src/lib.js';
const content = JSON.parse(readFileSync(new URL('../data/content.json', import.meta.url)));
const l2 = content.additionalLessons.find((c) => c.lessonId === 'hsk1-l02');
const dom = new JSDOM(readFileSync(new URL('../index.html', import.meta.url), 'utf8'), { url: 'https://example.test/HSK3.0/' });
for (const k of ['window', 'document', 'location', 'localStorage', 'FormData']) globalThis[k] = dom.window[k];
Object.defineProperty(globalThis, 'navigator', { value: dom.window.navigator, configurable: true });
window.scrollTo = () => {};
const audios = [];
class TestAudio extends EventTarget {
  constructor() { super(); this.paused = true; this.ended = false; this.duration = 10; this.currentTime = 0; this.readyState = 1; audios.push(this); }
  async play() { this.paused = false; this.dispatchEvent(new Event('play')); }
  pause() { this.paused = true; this.dispatchEvent(new Event('pause')); }
}
globalThis.Audio = TestAudio;
globalThis.fetch = async () => ({ ok: true, json: async () => structuredClone(content) });
// Existing learner: Bài 1 already started, one Bài 1 exercise answered, learningRevision already migrated.
localStorage.setItem('hsk30.progress.v1', JSON.stringify({
  schemaVersion: 1, learningRevision: 'textbook-pilot-v2', contentRevision: '20261031-learning-redesign-2',
  lessons: { 'hsk1-l01': { completedSections: ['intro'], lastSectionId: 'intro', updatedAt: '2026-10-31T00:00:00.000Z' } },
  attempts: [{ exerciseId: 'wb-picture-1', lessonId: 'hsk1-l01', correct: true, at: '2026-10-31T01:00:00Z' }],
  reviewItems: {},
  exerciseSession: { setId: 'set-wb-l01-picture-v2', index: 1, answers: { 'wb-picture-1': '1' }, checked: { 'wb-picture-1': true }, hintUsed: {} },
}));
await import('../src/app.js');
const tick = () => new Promise((r) => setTimeout(r, 10));
await tick();
async function route(path) { location.hash = '#/' + path; await tick(); }
const $ = (s) => document.querySelector(s);
function change(sel, value) { const e = $(sel); if (e.type === 'checkbox') e.checked = value; else e.value = value; e.dispatchEvent(new window.Event('change', { bubbles: true })); }
function choose(value) { const e = $(`input[value="${value}"]`); e.checked = true; e.dispatchEvent(new window.Event('change', { bubbles: true })); }
const state = () => JSON.parse(localStorage.getItem('hsk30.progress.v1'));

test('lesson 2 content matches the printed books: counts, pages, answers, prompts', () => {
  assert.ok(l2, 'additionalLessons must contain hsk1-l02');
  assert.equal(l2.prepWords.length, 15);
  assert.equal(l2.knowledgePoints.length, 7);
  assert.equal(l2.knowledgePoints.filter((k) => k.kind !== 'foundation-pronunciation').length, 5);
  assert.equal(l2.reader.sentences.length, 10);
  assert.equal(l2.reader.passages.length, 3);
  assert.equal(l2.reader.audioTracks.length, 5);
  assert.deepEqual(l2.reader.audioTracks.filter((t) => t.id.startsWith('trk-tb')).map((t) => t.durationSec), [5.377, 13.222, 11.814]);
  assert.equal(l2.exerciseSet.items.length, 4);
  assert.deepEqual(l2.exerciseSet.items.map((i) => i.answer), ['3', '1', '4', '2']);
  for (const item of l2.exerciseSet.items) {
    assert.ok(existsSync(new URL('../' + item.image, import.meta.url)), item.image);
    assert.equal(gradeChoice(item, item.answer).correct, true);
    assert.equal(gradeChoice(item, item.answer === '1' ? '2' : '1').correct, false);
    assert.ok(item.answerEvidence);
    assert.equal(item.sourceRefs[0].pdfPage, 15);
    assert.equal(item.sourceRefs[0].printedPage, 8);
  }
  assert.deepEqual(l2.selfCheckTasks.map((t) => t.prompts.length), [9, 15, 12]);
  assert.deepEqual(l2.selfCheckTasks[2].prompts, ['xue', 'jiao', 'qun', 'jiu', 'xin', 'qing', 'xia', 'jia', 'qu', 'ji', 'xiao', 'jie']);
  for (const t of l2.selfCheckTasks) assert.equal(gradeChoice(t, 'x').graded, false);
  for (const sen of l2.reader.sentences) {
    assert.equal(sen.transcriptStatus, 'print-verified');
    assert.ok(sen.sourceRefs[0].pdfPage >= 20 && sen.sourceRefs[0].pdfPage <= 24, sen.id);
  }
  const lesson = content.lessons.find((l) => l.id === 'hsk1-l02');
  assert.equal(lesson.publicationStatus, 'pilot-ready');
  assert.deepEqual(lesson.grammarIds, l2.knowledgePoints.map((k) => k.id));
  assert.deepEqual(lesson.sectionIds, l2.intro.sections.map((x) => x.id));
});

test('migration keeps Bài 1 progress, attempts and its exercise session when Bài 2 is added', () => {
  const p = state();
  assert.deepEqual(p.lessons['hsk1-l01'].completedSections, ['intro']);
  assert.equal(p.attempts.length, 1);
  assert.equal(p.attempts[0].exerciseId, 'wb-picture-1');
  assert.ok(p.exerciseSessions['set-wb-l01-picture-v2']);
  assert.equal(p.exerciseSessions['set-wb-l01-picture-v2'].index, 1);
  const migrated = migrateProgress({ schemaVersion: 1, exerciseSession: { setId: 'set-x', index: 2, answers: {}, checked: {}, hintUsed: {} } });
  assert.equal(migrated.exerciseSessions['set-x'].index, 2);
});

test('lesson 2 renders all 7 sections, links back to lesson 1, and lesson 1 still renders', async () => {
  for (const sec of l2.intro.sections.map((x) => 'lesson/hsk1-l02/' + x.id)) {
    await route(sec);
    assert.ok($('#main').textContent.trim().length > 20, sec);
    assert.equal($('#main').textContent.includes('undefined'), false, sec);
  }
  await route('lesson/hsk1-l02/intro');
  assert.match($('#main').textContent, /Bài 1/);
  assert.ok(document.querySelector('a[href="#/lesson/hsk1-l01"]'));
  await route('course');
  assert.match($('#main').textContent, /Tôi tên là Lý Văn/);
  await route('grammar/kp-hsk1-l02-jiao');
  assert.match($('#main').textContent, /Bài 2/);
  await route('progress');
  assert.match($('#main').textContent, /Bài 1/);
  assert.match($('#main').textContent, /Bài 2/);
  await route('lesson/hsk1-l01/reader');
  assert.match($('#main').textContent, /Chào/);
});

test('lesson 2 reader uses its own track and independent reading aids', async () => {
  await route('lesson/hsk1-l02/reader?passage=l02-dialogue-2');
  $('.transcript').open = true;
  change('[data-setting="showPinyinSentences"]', true);
  assert.ok($('.transcript').open);
  assert.equal(document.querySelectorAll('.sentence .pinyin').length, 4);
  assert.equal(document.querySelectorAll('.sentence .vi:not(.hidden)').length, 0);
  change('[data-setting="showViSentences"]', true);
  assert.equal(document.querySelectorAll('.sentence .vi:not(.hidden)').length, 4);
  document.querySelector('[data-play]').click();
  await tick();
  assert.match(audios[0].src, /lesson-02\/02-3\.mp3$/);
  assert.equal(audios[0].paused, false);
  await route('lesson/hsk1-l02/reader?sentence=l02-s9');
  assert.ok($('#l02-s9').classList.contains('highlighted'));
});

test('exercise sessions and drafts stay separate per lesson and survive navigation', async () => {
  await route('lesson/hsk1-l02/exercises');
  assert.match($('#main').textContent, /Câu 1\/4/);
  choose('1'); // wrong for picture 1 (answer is dialogue 3)
  $('#ex-form').dispatchEvent(new window.Event('submit', { bubbles: true, cancelable: true }));
  assert.ok($('.feedback.bad'));
  const last = state().attempts.at(-1);
  assert.equal(last.exerciseId, 'wb2-picture-1');
  assert.equal(last.lessonId, 'hsk1-l02');
  assert.equal(last.correct, false);
  assert.ok(state().reviewItems['ex-wb2-picture-1']);
  // Bài 1 session is untouched and still at its own position
  await route('lesson/hsk1-l01/exercises');
  assert.match($('#main').textContent, /Câu 2\/3/);
  // Back to Bài 2: wrong answer and feedback are still there
  await route('lesson/hsk1-l02/exercises');
  assert.ok($('.feedback.bad'));
  // Previous-question navigation keeps the checked state and feedback
  $('#next-q').click();
  assert.match($('#main').textContent, /Câu 2\/4/);
  $('#prev-q').click();
  assert.match($('#main').textContent, /Câu 1\/4/);
  assert.ok($('.feedback.bad'));
  // Drafts are kept per task and survive leaving the page (refresh equivalent: state lives in localStorage)
  const input = $('[data-draft="st-l02-03:0"]');
  input.value = 'xué'; input.dispatchEvent(new window.Event('input', { bubbles: true }));
  await route('lesson/hsk1-l02/summary');
  await route('lesson/hsk1-l02/exercises');
  assert.equal($('[data-draft="st-l02-03:0"]').value, 'xué');
  assert.equal(state().drafts['st-l02-03:0'], 'xué');
});

test('marking a lesson 2 section done is idempotent and does not touch lesson 1', async () => {
  await route('lesson/hsk1-l02/intro');
  const before = state().sessions.reduce((a, x) => a + x.minutes, 0);
  $('#done-btn').click();
  const mid = state();
  assert.ok(mid.lessons['hsk1-l02'].completedSections.includes('intro'));
  assert.deepEqual(mid.lessons['hsk1-l01'].completedSections, ['intro']);
  $('#done-btn').click();
  const after = state();
  assert.equal(after.sessions.reduce((a, x) => a + x.minutes, 0), mid.sessions.reduce((a, x) => a + x.minutes, 0));
  assert.ok(mid.sessions.reduce((a, x) => a + x.minutes, 0) >= before);
});
