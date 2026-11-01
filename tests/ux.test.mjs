import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { JSDOM } from 'jsdom';
const content = JSON.parse(readFileSync(new URL('../data/content.json', import.meta.url)));
const lessons = [content.pilot, ...content.additionalLessons];

test('speaker coverage: every unit either has a draft segment or an explicit missing marker', () => {
  const count = (arr) => arr.reduce((a, x) => [a[0] + (x.audio ? 1 : 0), a[1] + 1], [0, 0]);
  const sentences = lessons.flatMap((c) => c.reader.sentences);
  const segOf = (c, sen) => c.reader.audioTracks.find((t) => t.id === c.reader.passages.find((g) => g.id === sen.passageId)?.audioTrackId)?.segments?.find((x) => x.sentenceId === sen.id);
  assert.equal(sentences.filter((sen) => segOf(lessons.find((c) => c.reader.sentences.includes(sen)), sen)).length, 91); // all dialogue turns
  const [prepOk, prepAll] = count(lessons.flatMap((c) => c.prepWords));
  assert.deepEqual([prepOk, prepAll], [135, 137]); // 大家 (L1) and 吗 (L3) have no confident segment
  const [foundOk, foundAll] = count(lessons.flatMap((c) => c.foundationWords));
  assert.deepEqual([foundOk, foundAll], [64, 71]); // 雨/五/一/椅子 (L2), 嘴 (L3) and 盖儿/个儿 (L6) tokens not reliably identifiable
  const options = lessons.flatMap((c) => c.exerciseSet.items.flatMap((i) => i.options.filter((o) => o.zh)));
  const [optOk, optAll] = count(options);
  assert.deepEqual([optOk, optAll], [132, 164]); // token-level option segments where the exact option is read in the lesson's dialogue tracks; the rest still have none
  for (const c of lessons) for (const t of c.reader.audioTracks) for (const sg of t.segments || []) {
    assert.ok(sg.end > sg.start && sg.end <= t.durationSec, `${t.id} segment in range`);
    assert.equal(sg.status, 'asr-draft'); // machine alignment is never labelled human-verified
  }
});

// ---- DOM flow ---------------------------------------------------------------
const dom = new JSDOM(readFileSync(new URL('../index.html', import.meta.url), 'utf8'), { url: 'https://example.test/HSK3.0/' });
for (const k of ['window', 'document', 'location', 'localStorage', 'FormData']) globalThis[k] = dom.window[k];
Object.defineProperty(globalThis, 'navigator', { value: dom.window.navigator, configurable: true });
window.scrollTo = () => {};
window.scrollBy = () => {};
window.HTMLElement.prototype.scrollIntoView = () => {};
const audios = [];
class TestAudio extends EventTarget {
  constructor() { super(); this.paused = true; this.ended = false; this.duration = 400; this.currentTime = 0; this.readyState = 1; audios.push(this); }
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
const state = () => JSON.parse(localStorage.getItem('hsk30.progress.v1'));

test('support bar toggles aids in place: no re-render, no route change, settings persist', async () => {
  await route('lesson/hsk1-l01/prep');
  const bar = $('[data-support="pinyin"]');
  assert.ok(bar); assert.equal(bar.getAttribute('aria-pressed'), 'true'); // prep pinyin default on
  const cardBefore = $('.word-card');
  bar.click(); await tick();
  assert.equal($('.word-card'), cardBefore); // same DOM node: nothing was rebuilt
  assert.equal($('#main').classList.contains('off-pinyin-prep'), true);
  assert.equal(state().settings.showPinyinPrep, false);
  assert.equal(location.hash, '#/lesson/hsk1-l01/prep');
  $('[data-support="font-up"]').click(); await tick();
  assert.equal(state().settings.fontScale, 1.15);
  assert.match(document.querySelector('[data-support="font-up"]').getAttribute('aria-label'), /Lớn/); // level name lives in the accessible label, not the main row (ux3)
  assert.equal($('.support-bar').textContent.includes('Thường'), false);
  $('[data-support="font-up"]').click(); $('[data-support="font-down"]').click(); await tick();
  assert.equal(state().settings.fontScale, 1.15);
  // Support bar exists on the other learning sections too
  for (const sec of ['knowledge', 'reader', 'exercises', 'apply']) {
    await route('lesson/hsk1-l02/' + sec);
    assert.ok(document.querySelector('[data-support]'), sec);
  }
  await route('grammar/kp-hsk1-l02-shi');
  assert.ok(document.querySelector('[data-support="vi"]'));
  await route('review');
  assert.ok(document.querySelector('[data-support="font-up"]'));
});

test('speaker plays only its own segment and switching speakers replaces playback', async () => {
  await route('lesson/hsk1-l01/reader?passage=tb-dialogue-1');
  const btns = [...document.querySelectorAll('.sentence [data-speak]')];
  assert.equal(btns.length, 2);
  btns[0].click(); await tick();
  const a = audios[0];
  assert.match(a.src, /01-1\.mp3$/);
  a.onloadedmetadata && a.onloadedmetadata();
  const first = content.pilot.reader.audioTracks.find((t) => t.id === 'trk-tb-l01-1').segments[0];
  assert.equal(a.currentTime, first.start);
  assert.ok(btns[0].classList.contains('playing'));
  btns[1].click(); await tick();
  const second = content.pilot.reader.audioTracks.find((t) => t.id === 'trk-tb-l01-1').segments[1];
  assert.equal(a.currentTime, second.start); // same element, new segment — nothing overlaps
  assert.ok(btns[1].classList.contains('playing'));
  assert.equal(btns[0].classList.contains('playing'), false);
  btns[1].click(); await tick(); // toggle pauses
  assert.equal(a.paused, true);
});

test('speaker inside an exercise option does not select the option', async () => {
  await route('lesson/hsk1-l01/exercises');
  const speak = document.querySelector('.option [data-speak]');
  assert.ok(speak);
  speak.click(); await tick();
  const a = audios[0];
  assert.match(a.src, /workbook.*01-2\.mp3|hsk-1-workbook\/lesson-01\/01-2\.mp3$/);
  assert.equal(document.querySelector('input[name="opt"]:checked'), null);
  const sessions = state().exerciseSessions || {};
  assert.ok(!Object.values(sessions).some((ss) => Object.keys(ss.answers || {}).length));
});

test('dictation results survive navigation; editing a checked cell asks for a re-check; first score is locked', async () => {
  await route('lesson/hsk1-l02/exercises');
  const setDraft = (taskId, i, value) => { const el = document.querySelector(`[data-draft="${taskId}:${i}"]`); el.value = value; el.dispatchEvent(new window.Event('input', { bubbles: true })); };
  setDraft('st-l02-03', 0, 'xue2');
  setDraft('st-l02-03', 1, 'jiao1'); // wrong tone (jiào = 4)
  document.querySelector('[data-check-dict="st-l02-03"]').click(); await tick();
  assert.equal(state().dictation['st-l02-03'].first['0'], true);
  assert.equal(state().dictation['st-l02-03'].last['1'].correct, false);
  await route('lesson/hsk1-l02/intro');
  await route('lesson/hsk1-l02/exercises'); // "refresh" equivalent: fresh render from saved progress
  const task = document.querySelector('#st-l02-03');
  assert.match(task.textContent, /Điểm lần đầu: 1\/2/);
  assert.match(task.textContent, /Đáp án: jiao4/);
  assert.ok(document.querySelector('[data-draft="st-l02-03:0"]').classList.contains('cell-right'));
  // Edit the wrong cell: its old verdict must not stick to the new content
  setDraft('st-l02-03', 1, 'jiao4');
  await route('lesson/hsk1-l02/intro');
  await route('lesson/hsk1-l02/exercises');
  assert.match(document.querySelector('#st-l02-03').textContent, /Đã sửa — cần kiểm tra lại/);
  assert.equal(state().dictation['st-l02-03'].first['1'], false); // first score still locked
  document.querySelector('[data-check-dict="st-l02-03"]').click(); await tick();
  assert.equal(state().dictation['st-l02-03'].last['1'].correct, true);
  assert.equal(state().dictation['st-l02-03'].first['1'], false);
});
