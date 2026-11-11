import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { JSDOM } from 'jsdom';
const content = JSON.parse(readFileSync(new URL('../data/content.json', import.meta.url)));
const l3 = content.additionalLessons.find((c) => c.lessonId === 'hsk2-l03');
const dom = new JSDOM(readFileSync(new URL('../index.html', import.meta.url), 'utf8'), { url: 'https://example.test/HSK3.0/' });
for (const k of ['window', 'document', 'location', 'localStorage', 'FormData']) globalThis[k] = dom.window[k];
Object.defineProperty(globalThis, 'navigator', { value: dom.window.navigator, configurable: true });
window.scrollTo = () => {}; window.scrollBy = () => {}; dom.window.Element.prototype.scrollIntoView = () => {};
globalThis.requestAnimationFrame = (fn) => { fn(); return 0; };
globalThis.speechSynthesis = { getVoices: () => [{ lang: 'zh-CN', name: 'Test' }], cancel() {}, speak() {}, addEventListener() {} };
class TestAudio extends EventTarget {
  constructor() { super(); this.paused = true; this.ended = false; this.duration = 10; this.currentTime = 0; this.readyState = 1; }
  async play() { this.paused = false; this.dispatchEvent(new Event('play')); }
  pause() { this.paused = true; this.dispatchEvent(new Event('pause')); }
}
globalThis.Audio = TestAudio;
globalThis.fetch = async () => ({ ok: true, json: async () => structuredClone(content) });
await import('../src/app.js');
const tick = () => new Promise((r) => setTimeout(r, 20));
await tick();
async function route(path) { location.hash = '#/' + path; await tick(); }
const $ = (s) => document.querySelector(s);
const $$ = (s) => [...document.querySelectorAll(s)];

test('hsk2 lesson 3 build: 18 sentences, 15 words in 4 groups, 8 tracks', () => {
  assert.equal(l3.reader.sentences.length, 18);
  assert.deepEqual(l3.reader.passages.map((g) => g.sentenceIds.length), [5, 5, 6, 2]);
  assert.deepEqual(l3.prepWords.map((w) => w.dialogueGroup), [1, 1, 1, 2, 2, 3, 3, 3, 3, 3, 3, 4, 4, 4, 4]);
  assert.deepEqual(l3.prepGroups.map((g) => g.trackId), ['trk-tb2-l03-2', 'trk-tb2-l03-4', 'trk-tb2-l03-6', 'trk-tb2-l03-8']);
  for (const w of l3.prepWords) assert.ok(w.audio && w.audio.status === 'asr-draft', w.id);
  const tracks = l3.reader.audioTracks.filter((t) => t.id.startsWith('trk-tb2-'));
  assert.equal(tracks.length, 8);
  for (const [i, t] of tracks.entries()) {
    assert.equal(t.url, `https://cdn.baulchino.com/new-hsk-books-audios/hsk-2-textbook/lesson-03/3-${i + 1}.mp3`, t.id);
  }
  const wbTrack = l3.reader.audioTracks.find((t) => t.id === 'trk-wb2-l03-1');
  assert.ok(wbTrack, 'workbook listening track registered (D42)');
  assert.equal(wbTrack.url, 'https://cdn.baulchino.com/new-hsk-books-audios/hsk-2-workbook/lesson-03/03-1.mp3');
  for (const s of l3.reader.sentences) {
    const t = tracks.find((x) => x.id === s.audio.trackId);
    assert.ok(t && s.audio.end <= t.durationSec && s.audio.start < s.audio.end, s.id);
    assert.equal(s.transcriptStatus, 'print-verified', s.id);
  }
});

test('hsk2 lesson 3 build: 3 grammar points with the printed examples + character foundation', () => {
  const main = l3.knowledgePoints.filter((k) => k.kind === 'grammar');
  assert.equal(main.length, 3);
  for (const k of main) {
    assert.ok(k.useWhenVi && k.useWhenVi.length > 10, k.id);
    assert.ok(k.quickCheck && ['1', '2'].includes(k.quickCheck.answer), k.id);
    assert.equal(k.examples.length, 3, k.id);
  }
  const exZh = Object.fromEntries(main.map((k) => [k.id, k.examples.map((e) => e.zh)]));
  assert.deepEqual(exZh['kp-hsk2-l03-result'], ['菜都做好了。', '我吃完饭了。', '小雪今天来晚了。']);
  assert.deepEqual(exZh['kp-hsk2-l03-redup1'], ['那你再想一想，你想好了，我来买票。', '我有点儿累，现在想休息休息。', '你能过来帮帮忙吗？']);
  assert.deepEqual(exZh['kp-hsk2-l03-redup2'], ['我看了看网上的介绍。', '我休息了一下，现在觉得不累了。', '他昨天来帮了帮忙。']);
  const f = l3.knowledgePoints.find((k) => k.kind === 'foundation-characters');
  assert.ok(f && f.title.includes('三点水') && f.title.includes('宝盖头'), 'foundation KP covers both radicals');
  assert.equal(l3.learningPath.length, 6);
  assert.equal(l3.summaryPoints.length, 5);
  for (const sp of l3.summaryPoints) assert.ok(sp.exampleZh && sp.bodyVi, sp.titleVi);
});

test('hsk2 lesson 3: 12 set items and 10 printed dialogue checks (D28)', () => {
  assert.equal(l3.exerciseSet.items.length, 12);
  const answers = Object.fromEntries([...l3.exerciseSet.items, ...l3.reader.passages.flatMap((g) => g.checkItems || [])].map((i) => [i.id, i.answer]));
  assert.deepEqual(answers, {
    'tb2l3-warm-1': '4', 'tb2l3-warm-2': '1', 'tb2l3-warm-3': '2', 'tb2l3-warm-4': '3',
    'tb2l3-fill-1': '3', 'tb2l3-fill-2': '2', 'tb2l3-fill-3': '4', 'tb2l3-fill-4': '5', 'tb2l3-fill-5': '1',
    'wb2l3-ext-1': '2', 'wb2l3-ext-2': '1', 'wb2l3-ext-3': '3',
    'tb2l3-text1-1': '1', 'tb2l3-text1-2': '2', 'tb2l3-text2-1': '2', 'tb2l3-text2-2': '3',
    'tb2l3-text3-1': '3', 'tb2l3-text3-2': '1', 'tb2l3-text4-1': '2', 'tb2l3-text4-2': '1', 'tb2l3-text4-3': '2', 'tb2l3-text4-4': '2',
  });
  const checks = l3.reader.passages.flatMap((g) => g.checkItems || []);
  assert.equal(checks.length, 10);
  const listening = checks.filter((i) => i.audioSegment);
  assert.equal(listening.length, 8); // 2 reading questions of text 4 carry no segment
  for (const i of listening) {
    const t = l3.reader.audioTracks.find((x) => x.id === i.audioSegment.trackId);
    assert.ok(t && i.audioSegment.end <= t.durationSec, i.id);
    assert.ok(i.promptVi.includes('Câu hỏi nghe hiểu'), i.id);
  }
  for (const i of [...l3.exerciseSet.items, ...checks]) assert.ok(i.answerEvidence && i.answerEvidence.length > 20, i.id);
  const q = Object.fromEntries(checks.map((i) => [i.id, i.promptZh]));
  assert.equal(q['tb2l3-text1-1'], '刘明为什么回来晚了？');
  assert.equal(q['tb2l3-text3-1'], '刘明让王一雪做什么？');
  assert.equal(q['tb2l3-text4-1'], '刘明今天没去医院上班。');
  assert.equal(q['tb2l3-text4-4'], '医院来电话有什么事？');
  // Fill-in stems are the printed sentences (TB p.026 / WB p.022), character-for-character.
  const stems = Object.fromEntries(l3.exerciseSet.items.map((i) => [i.id, i.promptZh]));
  assert.equal(stems['tb2l3-fill-1'], '已经下班了，你为什么还不（）？');
  assert.equal(stems['tb2l3-fill-2'], '他每天早上都（）女朋友去上班。');
  assert.equal(stems['tb2l3-fill-3'], '爸爸（）了一些水果给孩子们吃。');
  assert.equal(stems['tb2l3-fill-4'], 'A：我昨天晚上没睡好，今天觉得很（）。B：那你休息休息吧。');
  assert.equal(stems['tb2l3-fill-5'], 'A：你认识家月吗？B：认识啊，我们每天（）坐公交车来学校。');
  assert.equal(stems['wb2l3-ext-1'], '明天有雨，你别去（）了。');
  assert.equal(stems['wb2l3-ext-2'], '我的（）是在网上买的。');
  assert.equal(stems['wb2l3-ext-3'], '安妮有点儿事，她明天要（）。');
  for (const i of l3.exerciseSet.items.slice(0, 4)) for (const o of i.options) assert.ok(o.image && o.image.startsWith('assets/hsk2-lesson-03/'), i.id);
});

test('hsk2 lesson 3 writing set: 4 chars from writing-book page 3, stroke counts match data files', () => {
  const ws = content.writingSets.find((w) => w.id === 'writing-hsk2-l03');
  assert.ok(ws, 'writing set exists');
  assert.equal(ws.lessonId, 'hsk2-l03');
  assert.deepEqual(ws.chars.map((ch) => ch.char), ['汉', '洗', '家', '完']);
  assert.deepEqual(ws.chars.map((ch) => ch.strokeCount), [5, 9, 10, 7]);
  for (const ch of ws.chars) {
    const data = JSON.parse(readFileSync(new URL(`../data/hanzi/${ch.char}.json`, import.meta.url)));
    assert.equal(data.strokes.length, ch.strokeCount, ch.char);
  }
  const byChar = Object.fromEntries(ws.chars.map((ch) => [ch.char, ch]));
  assert.equal(byChar['汉'].word.zh, '汉字');
  assert.equal(byChar['汉'].sentence.zh, '我每天都会写写汉字。');
  assert.equal(byChar['洗'].word.zh, '洗手');
  assert.equal(byChar['洗'].sentence.zh, '饭前要洗洗手。');
  assert.equal(byChar['家'].word.zh, '在家');
  assert.equal(byChar['家'].sentence.zh, '你在家休息休息吧。');
  assert.equal(byChar['完'].word.zh, '做完');
  assert.equal(byChar['完'].sentence.zh, '我的工作做完了。');
});

test('hsk2 lesson 3 UI: intro writing entry, writing set page and char page render', async () => {
  await route('lesson/hsk2-l03');
  const entry = $('.writing-entry');
  assert.ok(entry, 'writing entry card on lesson intro');
  assert.ok(entry.textContent.includes('汉'));
  assert.ok(entry.querySelector('a[href="#/writing/hsk2-l03"]'));
  await route('writing/hsk2-l03');
  assert.equal($$('.char-card').length, 4);
  await route('writing/hsk2-l03/w-h2l3-han');
  assert.ok(document.body.textContent.includes('BƯỚC 1'));
  assert.ok(document.body.textContent.includes('BƯỚC 6'));
  assert.ok($('#hw-view'), 'stroke view box');
  assert.ok($('#hw-quiz'), 'guided quiz box');
  assert.ok($('#hw-self'), 'self writing box');
  assert.ok($('#paper-btn'), 'paper practice button');
  assert.ok($('#review-toggle'), 'needs-review toggle');
  assert.ok($('.static-char').textContent.includes('汉'));
  await route('course/HSK%202');
  assert.equal($$('.lesson-list .row-card').length, 15);
});
