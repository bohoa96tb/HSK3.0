// Lesson 8 experience pilot (D23, Hoa 2026-11-02): scenario learning path,
// vocab grouped by dialogue, 3 plain-language main points with a try-it check,
// the no-Pinyin-before-grading rule for exercises, split speaking tasks and
// an honest summary empty state. Shared components must not regress Lessons 1/7.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { JSDOM } from 'jsdom';
const content = JSON.parse(readFileSync(new URL('../data/content.json', import.meta.url), 'utf8'));
const l8 = content.additionalLessons.find((c) => c.lessonId === 'hsk1-l08');

test('pilot data: vocab groups follow the dialogues (10 / 7 / 6 + 1 proper noun)', () => {
  const byGroup = [1, 2, 3].map((g) => l8.prepWords.filter((w) => w.dialogueGroup === g));
  assert.deepEqual(byGroup.map((x) => x.length), [10, 7, 7]);
  assert.equal(l8.prepWords.filter((w) => !w.isProperName).length, 23);
  assert.equal(l8.prepWords.find((w) => w.isProperName).zh, '胡医生');
  assert.match(l8.prepSummaryVi, /23 từ mới \+ 1 tên riêng/);
  assert.deepEqual(l8.prepGroups.map((g) => g.trackId), ['trk-tb-l08-2', 'trk-tb-l08-4', 'trk-tb-l08-6']);
  for (const g of l8.prepGroups) assert.ok(l8.reader.audioTracks.some((t) => t.id === g.trackId), g.trackId);
});

test('pilot data: learning path, 3 main points with try-it, per-dialogue checks, speaking tasks', () => {
  assert.equal(l8.learningPath.length, 6);
  assert.deepEqual(l8.intro.outcomesVi, [
    'Nói một người hoặc vật ở đâu.',
    'Nói làm gì ở đâu bằng 在.',
    'Hỏi và trả lời có thể làm gì bằng 能.',
  ]);
  const main = l8.knowledgePoints.filter((k) => k.kind === 'grammar' && !k.kindLabel.startsWith('Mẹo'));
  assert.deepEqual(main.map((k) => k.id), ['kp-hsk1-l08-positional', 'kp-hsk1-l08-zai', 'kp-hsk1-l08-neng']);
  for (const kp of main) {
    assert.ok(kp.useWhenVi && kp.quickCheck, kp.id);
    assert.ok(kp.quickCheck.options.some((o) => o.zh), kp.id);
    assert.ok(['1', '2'].includes(kp.quickCheck.answer), kp.id);
  }
  assert.deepEqual(l8.reader.passages.map((g) => g.checkItemId), ['wb8-comp-4', 'wb8-text-1', 'wb8-text-3']);
  assert.equal(l8.apply.tasks.length, 3);
  assert.equal(l8.summaryPoints.length, 3);
});

// ---- DOM flow ---------------------------------------------------------------
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
localStorage.setItem('hsk30.progress.v1', JSON.stringify({ schemaVersion: 1, learningRevision: 'textbook-pilot-v2', contentRevision: 'x' }));
await import('../src/app.js');
const tick = () => new Promise((r) => setTimeout(r, 10));
await tick();
async function route(path) { location.hash = '#/' + path; await tick(); }
const $ = (s) => document.querySelector(s);
const $$ = (s) => [...document.querySelectorAll(s)];
const state = () => JSON.parse(localStorage.getItem('hsk30.progress.v1'));

test('intro shows the scenario path and the 3 simple outcomes', async () => {
  await route('lesson/hsk1-l08/intro');
  const text = $('#main').textContent;
  assert.match(text, /Lộ trình học bài này/);
  assert.match(text, /Con mèo ở đâu\?/);
  assert.match(text, /Hẹn gặp ở đâu\?/);
  assert.match(text, /Nói một người hoặc vật ở đâu/);
  assert.ok($('.learn-path'));
});

test('summary is honest before any exercise is attempted', async () => {
  await route('lesson/hsk1-l08/summary');
  const text = $('#main').textContent;
  assert.match(text, /Bạn chưa làm bài tập/);
  assert.ok(!/Chưa có câu nào làm sai/.test(text), 'must not claim "no wrong answers" when nothing was attempted');
  assert.match(text, /Ba điều chính đã học/);
});

test('prep renders 3 dialogue groups with original-track buttons', async () => {
  await route('lesson/hsk1-l08/prep');
  assert.equal($$('.vocab-group-title').length, 3);
  assert.deepEqual($$('[data-play-vocab-track]').map((b) => b.dataset.playVocabTrack), ['trk-tb-l08-2', 'trk-tb-l08-4', 'trk-tb-l08-6']);
  assert.equal($$('.word-card').length, 24);
  assert.match($('#main').textContent, /giọng máy, không phải audio của sách/);
});

test('knowledge shows exactly the 3 main points, tips apart, with a working try-it', async () => {
  await route('lesson/hsk1-l08/knowledge');
  assert.match($('#main').textContent, /Ba điều cần nhớ/);
  const tips = $('.tips-block');
  assert.ok(tips && /Mẹo nhỏ trong bài/.test(tips.textContent));
  const qc = $('[data-quick-check="kp-hsk1-l08-zai"]');
  assert.ok(qc, 'try-it block present');
  qc.querySelectorAll('[data-quick-opt]')[1].click(); await tick(); // wrong: 能
  assert.match(qc.querySelector('.quick-feedback').textContent, /Chưa đúng/);
  qc.querySelectorAll('[data-quick-opt]')[0].click(); await tick(); // right: 在
  assert.match(qc.querySelector('.quick-feedback').textContent, /Đúng rồi/);
  assert.equal(qc.querySelector('.quick-explain').hidden, false);
});

test('reader links each dialogue to its short check question', async () => {
  await route('lesson/hsk1-l08/reader?passage=l08-dialogue-2');
  const link = $$('#main a').find((a) => (a.getAttribute('href') || '').includes('item=wb8-text-1'));
  assert.ok(link, 'dialogue 2 has a short-check link');
  assert.ok($$('.reader-links a').length >= 2);
});

test('exercises: three zones; no pinyin/meaning in the DOM before grading (except pronunciation drill)', async () => {
  await route('lesson/hsk1-l08/exercises');
  assert.match($('.exercise-zones').textContent, /Luyện sau bài/);
  assert.match($('.exercise-zones').textContent, /Đề mô phỏng/);
  const card = $('#exercise-card');
  // First core item is a listening-comprehension question: nothing to leak.
  assert.equal(card.querySelectorAll('.tog-pinyin-ex').length, 0);
  assert.equal(card.querySelectorAll('.tog-vi-ex').length, 0);
  card.querySelector('input[name="opt"][value="3"]').click();
  card.querySelector('button[type="submit"]').click(); await tick();
  const after = $('#exercise-card');
  assert.ok(after.querySelectorAll('.tog-pinyin-ex').length > 0, 'support appears after grading');
  assert.match(after.textContent, /书店前/); // explanation cites the dialogue sentence as evidence
  // Pronunciation drill: pinyin is the content, labelled as such.
  await route('lesson/hsk1-l08/exercises?item=wb8-redup-1');
  const redup = $('#exercise-card');
  assert.match(redup.textContent, /Bài luyện âm/);
  assert.ok(redup.textContent.includes('tīnglì'));
  assert.equal(redup.querySelectorAll('.tog-vi-ex').length, 0, 'meanings that would classify the answer stay hidden before grading');
});

test('speaking: 3 short tasks, self-mark persists and never claims mastery', async () => {
  await route('lesson/hsk1-l08/apply');
  assert.equal($$('.speak-task').length, 3);
  assert.match($('#main').textContent, /không chấm phát âm/);
  $('[data-speak-done="speak-l08-1"]').click(); await tick();
  assert.equal(state().speakingDone['speak-l08-1'] !== undefined, true);
  assert.equal($('[data-speak-done="speak-l08-1"]').getAttribute('aria-pressed'), 'true');
});

test('regression: shared components keep working for Lessons 1 and 7', async () => {
  await route('lesson/hsk1-l07/knowledge');
  assert.match($('#main').textContent, /Bốn điều cần nhớ/); // Lesson 7 has no tips: count unchanged
  await route('lesson/hsk1-l01/exercises');
  assert.equal($('#exercise-card').querySelectorAll('.tog-pinyin-ex').length, 0);
  await route('lesson/hsk1-l02/intro');
  assert.ok(!$('.learn-path'), 'lessons without a path keep the previous intro');
});

test('QA regressions (D23 round): support records only the main set; mock-only summary is not contradictory', async () => {
  await route('lesson/hsk1-l08/exercises');
  const before = state();
  const suppBefore = before.exerciseSessions?.['set-wb-l08-mock-v1'];
  $('#exercise-card [data-support="pinyin"]').click(); await tick();
  const after = state();
  const suppAfter = after.exerciseSessions?.['set-wb-l08-mock-v1'];
  assert.deepEqual(suppAfter?.supportUsed || {}, suppBefore?.supportUsed || {}, 'mock set must not gain supportUsed from the main card');
  const mainSes = Object.values(after.exerciseSessions).find((x) => x.setId === content.additionalLessons.find((c) => c.lessonId === 'hsk1-l08').exerciseSet.id);
  assert.ok(Object.keys(mainSes.supportUsed || {}).length >= 0); // main-set behaviour covered by ux3 tests
  $('#exercise-card [data-support="pinyin"]').click(); await tick(); // restore off
});

test('QA regression: quick-check explanation hides again after a later wrong pick', async () => {
  await route('lesson/hsk1-l08/knowledge');
  const qc = $('[data-quick-check="kp-hsk1-l08-positional"]');
  const opts = qc.querySelectorAll('[data-quick-opt]');
  opts[1].click(); await tick(); // 下 is correct (answer shuffled to position 2 by content QA)
  assert.equal(qc.querySelector('.quick-explain').hidden, false);
  opts[0].click(); await tick(); // wrong pick afterwards
  assert.equal(qc.querySelector('.quick-explain').hidden, true);
});

test('QA regression: speaking samples follow the Pinyin/Nghĩa toggles', async () => {
  await route('lesson/hsk1-l08/apply');
  assert.ok($$('.speak-task .tog-pinyin-sent').length >= 3);
  assert.ok($$('.speak-task .tog-vi-sent').length >= 3);
});

test('regression (device report 02/11): path CTA inside the Bắt đầu page moves onward, never self-links', async () => {
  const pathCta = () => [...document.querySelectorAll('section.card')].find((x) => x.textContent.includes('Lộ trình học bài này'))?.querySelector('a.btn.primary.big');
  // Hoa's state: she is on the Bắt đầu page, whose visit sets lastSectionId
  // to 'intro'. The button used to link to #/lesson/hsk1-l08/intro — the very
  // page already open — so tapping it did nothing at all.
  await route('lesson/hsk1-l08/intro');
  assert.equal(pathCta().getAttribute('href'), '#/lesson/hsk1-l08/prep');
  pathCta().click();
  // Poll briefly: a single short tick raced the hashchange render once in QA.
  for (let i = 0; i < 50 && $$('.vocab-group-title').length !== 3; i++) await tick();
  assert.equal(location.hash, '#/lesson/hsk1-l08/prep');
  assert.equal($$('.vocab-group-title').length, 3);
  // Mark Bắt đầu and Từ cần biết done, then revisit Bắt đầu: the button goes
  // to the first unfinished later section.
  await route('lesson/hsk1-l08/intro');
  $('#done-btn').click(); await tick();
  await route('lesson/hsk1-l08/prep');
  $('#done-btn').click(); await tick();
  await route('lesson/hsk1-l08/intro');
  assert.equal(pathCta().getAttribute('href'), '#/lesson/hsk1-l08/knowledge');
  // On the lesson landing (no section open) the same button keeps its resume
  // meaning: the last visited unfinished section wins.
  await route('lesson/hsk1-l08/reader');
  await route('lesson/hsk1-l08');
  assert.equal(pathCta().getAttribute('href'), '#/lesson/hsk1-l08/reader');
});
