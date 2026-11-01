// Lesson 8 supplementary mock set （模拟测练, WB printed 051-056) — added
// 2026-11-01 after Hoa's audio-coverage check found WB 08-2 unused.
// The mock is a SEPARATE set: it must not merge into the 19 core items.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { JSDOM } from 'jsdom';
const content = JSON.parse(readFileSync(new URL('../data/content.json', import.meta.url)));
const l8 = content.additionalLessons.find((l) => l.lessonId === 'hsk1-l08');
const supp = l8.suppExerciseSet;

test('mock set: 20 items, separate from the core 19, answers as cross-checked', () => {
  assert.equal(l8.exerciseSet.items.length, 19);
  assert.equal(supp.id, 'set-wb-l08-mock-v1');
  assert.equal(supp.items.length, 20);
  const answers = Object.fromEntries(supp.items.map((i) => [i.id, i.answer]));
  assert.deepEqual(answers, {
    'l08m-01': '3', 'l08m-02': '2', 'l08m-03': '1', 'l08m-04': '2', 'l08m-05': '1',
    'l08m-06': '4', 'l08m-07': '3', 'l08m-08': '2', 'l08m-09': '3', 'l08m-10': '2',
    'l08m-11': '2', 'l08m-12': '4', 'l08m-13': '3', 'l08m-14': '3', 'l08m-15': '2',
    'l08m-16': '1', 'l08m-17': '2', 'l08m-18': '1', 'l08m-19': '1', 'l08m-20': '1',
  });
  for (const it of supp.items) {
    assert.equal(it.answerStatus, 'verified-editorial', it.id);
    assert.ok(it.answerEvidence && it.explanationVi, it.id);
    const links = { 'l08m-01': 'kp-hsk1-l08-positional', 'l08m-02': 'kp-hsk1-l08-positional', 'l08m-06': 'kp-hsk1-l08-positional', 'l08m-08': 'kp-hsk1-l08-positional', 'l08m-04': 'kp-hsk1-l08-zai', 'l08m-09': 'kp-hsk1-l08-zai', 'l08m-11': 'kp-hsk1-l08-zai', 'l08m-16': 'kp-hsk1-l08-zai', 'l08m-19': 'kp-hsk1-l08-zai', 'l08m-05': 'kp-hsk1-l08-neng', 'l08m-18': 'kp-hsk1-l08-neng' };
    assert.deepEqual(it.grammarIds, links[it.id] ? [links[it.id]] : [], it.id);
    for (const o of it.options) { assert.ok(o.pinyin && o.vi, `${it.id}/${o.id}`); }
  }
});

test('mock set: listening items carry WB 08-2 segments in range; track registered once', () => {
  const track = l8.reader.audioTracks.find((t) => t.id === 'trk-wb-l08-2');
  assert.ok(track && track.durationSec === 487.09);
  assert.match(track.url, /workbook\/lesson-08\/08-2\.mp3$/);
  const listening = supp.items.filter((i) => i.audioSegment);
  assert.equal(listening.length, 10);
  for (const it of listening) {
    assert.equal(it.audioSegment.trackId, 'trk-wb-l08-2', it.id);
    assert.ok(it.audioSegment.start >= 0 && it.audioSegment.end <= 487.09 && it.audioSegment.end > it.audioSegment.start, it.id);
    assert.equal(it.audioSegment.status, 'asr-draft', it.id);
  }
  const reading = supp.items.filter((i) => !i.audioSegment);
  assert.equal(reading.length, 10);
});

test('mock set: all picture files exist in the repo assets', () => {
  const imgs = new Set();
  for (const it of supp.items) for (const o of it.options) if (o.image) imgs.add(o.image);
  assert.equal(imgs.size, 17);
  for (const p of imgs) assert.ok(existsSync(new URL('../' + p, import.meta.url)), p);
});

const dom = new JSDOM(readFileSync(new URL('../index.html', import.meta.url), 'utf8'), { url: 'https://example.test/HSK3.0/' });
for (const k of ['window', 'document', 'location', 'localStorage', 'FormData']) globalThis[k] = dom.window[k];
Object.defineProperty(globalThis, 'navigator', { value: dom.window.navigator, configurable: true });
window.scrollTo = () => {};
window.scrollBy = () => {};
window.HTMLElement.prototype.scrollIntoView = () => {};
globalThis.requestAnimationFrame = (fn) => { fn(); return 0; };
const audios = [];
class TestAudio extends EventTarget {
  constructor() { super(); this.paused = true; this.ended = false; this.duration = 500; this.currentTime = 0; this.readyState = 1; audios.push(this); }
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

test('mock card renders below the core card with its own session and segment play button', async () => {
  await route('lesson/hsk1-l08/exercises');
  const card = $('#supp-exercise-card');
  assert.ok(card, 'supplementary card present');
  assert.match(card.querySelector('h2').textContent, /Đề mô phỏng/);
  const play = card.querySelector('[data-play-task="trk-wb-l08-2"]');
  assert.ok(play, 'listening item has a segment play button');
  assert.equal(Number(play.dataset.segStart), 43.2);
  assert.equal(Number(play.dataset.segEnd), 48.9);
  // picture options show no word labels before grading
  assert.equal(card.querySelectorAll('.option-pic').length, 3);
  assert.equal(card.querySelectorAll('.option-pic-cap').length, 0);
  // answer Q1 correctly (C = option 3) inside the SUPP form only
  card.querySelector('input[name="opt"][value="3"]').click();
  card.querySelector('button[type="submit"]').click(); await tick();
  const ses = state().exerciseSessions['set-wb-l08-mock-v1'];
  assert.deepEqual(ses.checked, { 'l08m-01': true });
  const core = state().exerciseSessions['set-tb-l08-text-v1'];
  assert.ok(!core || Object.keys(core.checked).length === 0, 'core session untouched');
  const att = state().attempts.find((x) => x.exerciseId === 'l08m-01');
  assert.ok(att && att.correct === true && att.firstAttempt === true);
  // caption with the word appears after grading
  assert.equal($('#supp-exercise-card').querySelectorAll('.option-pic-cap').length, 3);
  // next advances the SUPP session only
  $('#supp-next-q').click(); await tick();
  assert.equal(state().exerciseSessions['set-wb-l08-mock-v1'].index, 1);
  assert.match($('#supp-exercise-card').textContent, /Câu 2\/20/);
});

test('regression: core reduplication items (verified-editorial) grade as well', async () => {
  await route('lesson/hsk1-l08/exercises?item=wb8-redup-1');
  const card = $('#exercise-card');
  assert.ok(card, 'core card shows the deep-linked redup item');
  card.querySelector('input[name="opt"][value="2"]').click(); // B, per the cross-checked key
  card.querySelector('button[type="submit"]').click(); await tick();
  const att = state().attempts.find((x) => x.exerciseId === 'wb8-redup-1');
  assert.ok(att && att.correct === true, 'editorial item must record a graded attempt');
});

test('regression TB1: deep-linking the same item twice reopens it unchecked', async () => {
  await route('lesson/hsk1-l08/exercises?item=l08m-03');
  let card = $('#supp-exercise-card');
  card.querySelector('input[name="opt"][value="1"]').click();
  card.querySelector('button[type="submit"]').click(); await tick();
  assert.equal(state().exerciseSessions['set-wb-l08-mock-v1'].checked['l08m-03'], true);
  assert.equal(state().exerciseSessions['set-wb-l08-mock-v1'].reviewTarget, undefined, 'reviewTarget cleared after re-check');
  await route('lesson/hsk1-l08/summary');
  await route('lesson/hsk1-l08/exercises?item=l08m-03');
  card = $('#supp-exercise-card');
  assert.ok(card.querySelector('button[type="submit"]'), 'second deep link shows a fresh Kiểm tra button');
  assert.ok(!card.querySelector('input[name="opt"]').disabled, 'options enabled again');
  assert.notEqual(state().exerciseSessions['set-wb-l08-mock-v1'].checked['l08m-03'], true);
});

test('progress and summary surfaces report the mock set separately', async () => {
  await route('lesson/hsk1-l08/summary');
  assert.match($('#main').textContent, /Đề mô phỏng của sách: điểm lần đầu/);
  location.hash = '#/progress'; await tick();
  assert.match($('#main').textContent, /Đề mô phỏng của sách: đã trả lời \d+\/20 câu/);
});

test('coverage round: tips, hanzi KP, reading-answer task and full apply are present', () => {
  const kps = Object.fromEntries(l8.knowledgePoints.map((k) => [k.id, k]));
  assert.deepEqual(l8.knowledgePoints.map((k) => k.id), ['kp-hsk1-l08-tip-measure', 'kp-hsk1-l08-positional', 'kp-hsk1-l08-zai', 'kp-hsk1-l08-neng', 'kp-hsk1-l08-tip-xiao', 'kp-hsk1-l08-reduplication', 'kp-hsk1-l08-hanzi-writing']);
  assert.equal(kps['kp-hsk1-l08-tip-measure'].sourceRefs[0].printedPage, '055');
  assert.equal(kps['kp-hsk1-l08-tip-xiao'].sourceRefs[0].printedPage, '059');
  const hz = kps['kp-hsk1-l08-hanzi-writing'];
  assert.equal(hz.kind, 'foundation-characters');
  assert.deepEqual(hz.examples.map((e) => e.zh), ['十', '二十', '工作']);
  assert.deepEqual(hz.sourceRefs.map((r) => r.printedPage), ['049', '050']);
  const t = l8.selfCheckTasks.find((x) => x.id === 'st-l08-03');
  assert.ok(t && t.kind === 'speaking' && t.answerStatus === 'unverified');
  assert.deepEqual(t.prompts, ['胡医生的爸爸在哪儿工作？', '胡医生的爸爸工作忙吗？']);
  assert.deepEqual(l8.apply.sourceRefs.map((r) => r.printedPage), ['055', '057', '060']);
  assert.match(l8.apply.instructionVi, /你的手机在哪儿/);
});

test('coverage round renders: knowledge section shows tips + hanzi foundation; apply and task present', async () => {
  await route('lesson/hsk1-l08/knowledge');
  const main = $('#main');
  assert.match(main.textContent, /Năm điều cần nhớ/);
  assert.match(main.textContent, /Đại từ chỉ định \+ lượng từ/);
  assert.match(main.textContent, /Gọi thân mật/);
  const fnd = main.querySelector('details.foundation');
  assert.ok(fnd, 'foundation block present');
  assert.match(fnd.textContent, /Viết chữ Hán （一）/);
  assert.match(fnd.textContent, /先横后竖|ngang trước, dọc sau/);
  await route('lesson/hsk1-l08/exercises');
  assert.match($('#main').textContent, /Trả lời câu hỏi theo Hội thoại 3/);
  await route('lesson/hsk1-l08/apply');
  assert.match($('#main').textContent, /Ba hoạt động cặp/);
});
