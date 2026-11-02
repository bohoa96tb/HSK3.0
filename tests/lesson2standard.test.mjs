import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { JSDOM } from 'jsdom';
import { segmentZh } from '../src/lib.js';
const content = JSON.parse(readFileSync(new URL('../data/content.json', import.meta.url)));
const l2 = content.additionalLessons.find((c) => c.lessonId === 'hsk1-l02');
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
globalThis.window.speechSynthesis = { getVoices: () => [{ lang: 'zh-CN', name: 'Ting' }], cancel() {}, speak() {} };
globalThis.SpeechSynthesisUtterance = class { constructor(t) { this.text = t; } };
localStorage.setItem('hsk30.progress.v1', JSON.stringify({ schemaVersion: 1, learningRevision: 'textbook-pilot-v2', contentRevision: 'x' }));
await import('../src/app.js');
const tick = () => new Promise((r) => setTimeout(r, 10));
await tick();
async function route(path) { location.hash = '#/' + path; await tick(); }
const $ = (s2) => document.querySelector(s2);
const $$ = (s2) => [...document.querySelectorAll(s2)];

test('data: lesson 2 carries the D27 standard fields', () => {
  assert.equal(l2.learningPath.length, 6);
  assert.deepEqual(l2.prepWords.map((w) => w.dialogueGroup), [1,1,1,1,1,1,2,2,2,2,2,3,3,3,3]);
  assert.equal(l2.prepGroups.length, 3);
  assert.match(l2.prepSummaryVi, /15 từ mới/);
  const main = l2.knowledgePoints.filter((k) => !String(k.kind).startsWith('foundation'));
  assert.equal(main.length, 5);
  for (const k of main) { assert.ok(k.useWhenVi, k.id); assert.ok(k.quickCheck && k.quickCheck.options.length === 2 && ['1','2'].includes(k.quickCheck.answer), k.id); }
  assert.equal(l2.summaryPoints.length, 3);
  const wo = l2.knowledgePoints.find((k) => k.id === 'kp-hsk1-l02-word-order');
  assert.ok(wo.examples.some((e) => e.zh === '我是学生。'), 'the third read-aloud sentence of the book is present');
  const tw = l2.knowledgePoints.find((k) => k.id === 'kp-hsk1-l02-twister');
  assert.ok(tw && tw.audioTrackId === 'trk-tb-l02-7');
  const trk = l2.reader.audioTracks.find((t) => t.id === 'trk-tb-l02-7');
  assert.equal(trk.durationSec, 22.969);
  assert.equal(l2.exerciseSet.items.find((e) => e.id === 'wb2-picture-1').grammarIds[0], 'kp-hsk1-l02-jiao');
  assert.equal(l2.apply.tasks.length, 2);
  assert.equal(l2.lookup.extras.length, 5);
});

test('intro shows the path and the CTA moves onward; prep is grouped by dialogue', async () => {
  await route('lesson/hsk1-l02/intro');
  assert.match($('#main').textContent, /Lộ trình học bài này/);
  assert.equal($$('.learn-path li').length, 6);
  const cta = [...document.querySelectorAll('section.card')].find((x) => x.textContent.includes('Lộ trình học bài này'))?.querySelector('a.btn.primary.big');
  assert.equal(cta.getAttribute('href'), '#/lesson/hsk1-l02/prep');
  await route('lesson/hsk1-l02/prep');
  assert.equal($$('.vocab-group-title').length, 3);
  assert.match($('#main').textContent, /15 từ mới, chia theo 3 hội thoại/);
  assert.equal($$('.word-card').length, 15);
});

test('quick check works on the shi point and never writes attempts', async () => {
  await route('lesson/hsk1-l02/knowledge');
  const before = JSON.parse(localStorage.getItem('hsk30.progress.v1') || '{}');
  const card = document.querySelector('#kp-hsk1-l02-shi');
  const opts = card.querySelectorAll('[data-quick-opt]');
  opts[1].click(); await tick();
  assert.match(card.querySelector('.quick-feedback').textContent, /Chưa đúng/);
  opts[0].click(); await tick();
  assert.match(card.querySelector('.quick-feedback').textContent, /Đúng rồi/);
  const after = JSON.parse(localStorage.getItem('hsk30.progress.v1') || '{}');
  assert.equal((after.attempts || []).length, (before.attempts || []).length);
});

test('reader lookup resolves names via extras; exercises stay token-free; twister plays its track', async () => {
  await route('lesson/hsk1-l02/reader');
  const tok = $$('#main [data-tok]').find((b) => b.dataset.tok === '陈天中');
  assert.ok(tok, 'name is one token');
  tok.click(); await tick();
  assert.match($('#lookup-pop').textContent, /TRẦN THIÊN TRUNG/);
  document.querySelector('#lookup-pop [data-lk-close]').click();
  await route('lesson/hsk1-l02/knowledge');
  const btn = document.querySelector('[data-play-kp-track="trk-tb-l02-7"]');
  assert.ok(btn, 'twister track button exists');
  await route('lesson/hsk1-l02/exercises');
  assert.equal($$('#main [data-tok]').length, 0);
  await route('lesson/hsk1-l02/apply');
  assert.equal($$('.speak-task').length, 2);
  assert.match($('#speak-l02-2').textContent, /toàn bộ Hội thoại 3/);
});

test('audit coverage for lesson 2 target surfaces is complete', () => {
  const words = new Set();
  for (const c of [content.pilot, ...content.additionalLessons]) for (const w of c.prepWords) words.add(w.zh);
  for (const x of l2.lookup.extras) words.add(x.zh);
  for (const c of [content.pilot, ...content.additionalLessons]) for (const x of c.lookup?.extras || []) words.add(x.zh);
  const texts = [...l2.reader.sentences.map((s) => s.zh),
    ...l2.knowledgePoints.filter((k) => !String(k.kind).startsWith('foundation')).flatMap((k) => k.examples.map((e) => e.zh)),
    ...l2.summaryPoints.map((p) => p.exampleZh), ...l2.apply.tasks.map((t) => t.sampleZh)];
  let bad = [];
  for (const t of texts) for (const tok of segmentZh(t, words)) if (tok.entry === false && /[\u4e00-\u9fff]{2,}/.test(tok.text)) bad.push(tok.text + ' in ' + t);
  assert.deepEqual(bad, []);
});
