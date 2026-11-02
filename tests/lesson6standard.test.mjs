import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { JSDOM } from 'jsdom';
import { segmentZh } from '../src/lib.js';
const content = JSON.parse(readFileSync(new URL('../data/content.json', import.meta.url)));
const l6 = content.additionalLessons.find((c) => c.lessonId === 'hsk1-l06');
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
async function poll(fn, tries = 40) { for (let i = 0; i < tries; i++) { const v = fn(); if (v) return v; await tick(); } return null; }
const $ = (s) => document.querySelector(s);
const $$ = (s) => [...document.querySelectorAll(s)];

test('lesson 6 standardization: prep groups follow the three dialogues, proper noun included', () => {
  assert.deepEqual(l6.prepWords.map((w) => w.dialogueGroup), [1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3]);
  const pn = l6.prepWords.find((w) => w.zh === '西安饭店');
  assert.equal(pn.isProperName, true);
  assert.equal(pn.dialogueGroup, 3);
  assert.deepEqual(l6.prepGroups.map((g) => g.trackId), ['trk-tb-l06-2', 'trk-tb-l06-4', 'trk-tb-l06-6']);
  assert.equal(l6.prepSummaryVi, '22 từ mới và 1 tên riêng, chia theo 3 hội thoại.');
});

test('lesson 6 standardization: path, quick checks, summary and apply tasks exist', () => {
  assert.equal(l6.learningPath.length, 6);
  assert.deepEqual(l6.learningPath.map((s) => s.sectionId), ['intro', 'prep', 'reader', 'reader', 'exercises', 'summary']);
  const main = l6.knowledgePoints.filter((k) => k.kind === 'grammar');
  assert.equal(main.length, 3);
  for (const k of main) {
    assert.ok(k.useWhenVi && k.useWhenVi.length > 10, k.id);
    assert.ok(k.quickCheck && k.quickCheck.answer, k.id);
  }
  assert.equal(l6.summaryPoints.length, 4);
  assert.deepEqual(l6.apply.samplePassageIds, ['l06-dialogue-1']);
  assert.equal(l6.apply.tasks.length, 2);
  assert.ok(l6.apply.tasks[1].sampleZh.includes('星期一我想吃饺子'));
});

test('lesson 6 standardization: erhua KP carries the full printed table', () => {
  const er = l6.knowledgePoints.find((k) => k.id === 'kp-hsk1-l06-erhua');
  const zh = er.examples.map((e) => e.zh);
  for (const w of ['这儿', '哪儿', '画儿', '盖儿', '个儿', '眼儿', '面条儿']) assert.ok(zh.includes(w), w);
});

test('lesson 6 standardization: new print-based items and speaking guidance', () => {
  const items = Object.fromEntries(l6.exerciseSet.items.map((i) => [i.id, i]));
  assert.equal(items['wb6-text-5'].answer, '1');
  assert.equal(items['wb6-text-6'].answer, '1');
  for (const [id, card] of [['wb6-warm-1', 'phone'], ['wb6-warm-2', 'dinner'], ['wb6-warm-3', 'market'], ['wb6-warm-4', 'milk'], ['wb6-warm-5', 'taxi'], ['wb6-warm-6', 'rice']])
    assert.equal(items[id].answer, card, id);
  const t = l6.selfCheckTasks.find((x) => x.id === 'st-l06-03');
  assert.equal(t.promptImages.length, 4);
  assert.ok(t.promptImages.every((im) => /Tranh vẽ lại/.test(im.captionVi)));
  assert.ok(t.draftPromptVi.includes('她的手机号是多少'));
});

test('lesson 6 standardization: lookup covers every target surface', () => {
  const lex = new Map();
  for (const w of content.pilot.prepWords) lex.set(w.zh, w);
  for (const l of content.additionalLessons) for (const w of l.prepWords) if (!lex.has(w.zh)) lex.set(w.zh, w);
  for (const e of l6.lookup.extras) lex.set(e.zh, e);
  const surfaces = [...l6.reader.sentences.map((s) => s.zh),
    ...l6.knowledgePoints.filter((k) => k.kind === 'grammar').flatMap((k) => k.examples.map((e) => e.zh)),
    ...l6.summaryPoints.map((p) => p.exampleZh),
    ...l6.apply.tasks.map((t) => t.sampleZh)];
  let tokens = 0;
  for (const s of surfaces) for (const t of segmentZh(s, lex)) { if (!t.punct) { assert.ok(t.entry, `unmatched token ${t.text} in ${s}`); tokens++; } }
  assert.ok(tokens >= 30, `expected >= 30 tokens, got ${tokens}`);
});

test('lesson 6 standardization: intro renders path, context art and sections in order', async () => {
  localStorage.setItem('hsk30.progress.v1', JSON.stringify({ schemaVersion: 1, lessons: {} }));
  await route('lesson/hsk1-l06/intro');
  const heads = await poll(() => $$('#main h2').length >= 2 ? $$('#main h2').map((h) => h.textContent) : null);
  assert.ok(heads && heads.some((h) => h.includes('Lộ trình học bài này')), JSON.stringify(heads));
  assert.equal($$('.learn-path li').length, 6);
  assert.match($('img.context-image').getAttribute('src'), /assets\/lesson-06\/classroom\.webp/);
  assert.match($('img.context-image').getAttribute('alt'), /Tranh vẽ/);
  await route('lesson/hsk1-l06/prep');
  const titles = await poll(() => $$('.vocab-group-title').length === 3 ? $$('.vocab-group-title').map((t) => t.textContent) : null);
  assert.ok(titles && titles[0].includes('3 từ') && titles[1].includes('9 từ') && titles[2].includes('tên riêng'), JSON.stringify(titles));
  await route('lesson/hsk1-l06/exercises');
  const zones = await poll(() => $('.exercise-zones') ? $('.exercise-zones').textContent : null);
  assert.ok(zones && zones.includes('gồm 2 phần'), 'L6 zone header must say 2 phần');
});
