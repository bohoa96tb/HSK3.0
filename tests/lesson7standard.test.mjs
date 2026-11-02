import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { JSDOM } from 'jsdom';
import { segmentZh } from '../src/lib.js';
const content = JSON.parse(readFileSync(new URL('../data/content.json', import.meta.url)));
const l7 = content.additionalLessons.find((c) => c.lessonId === 'hsk1-l07');
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

test('lesson 7 standardization: prep groups follow the three dialogues', () => {
  assert.deepEqual(l7.prepWords.map((w) => w.dialogueGroup), [1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3]);
  assert.deepEqual(l7.prepGroups.map((g) => g.trackId), ['trk-tb-l07-2', 'trk-tb-l07-4', 'trk-tb-l07-6']);
  assert.equal(l7.prepSummaryVi, '27 từ mới, chia theo 3 hội thoại.');
});

test('lesson 7 standardization: path, quick checks for all four main points, summary, apply', () => {
  assert.equal(l7.learningPath.length, 6);
  assert.deepEqual(l7.learningPath.map((s) => s.sectionId), ['intro', 'prep', 'reader', 'reader', 'exercises', 'summary']);
  const main = l7.knowledgePoints.filter((k) => k.kind === 'grammar');
  assert.equal(main.length, 4);
  for (const k of main) {
    assert.ok(k.useWhenVi && k.useWhenVi.length > 10, k.id);
    assert.ok(k.quickCheck && ['1', '2'].includes(k.quickCheck.answer), k.id);
  }
  const t2 = l7.knowledgePoints.find((k) => k.id === 'kp-hsk1-l07-time2');
  const zh = t2.examples.map((e) => e.zh);
  for (const w of ['九点', '二十点', '十五点四十', '二十一点十分', '二十二点零五', '上午', '中午十二点', '下午两点半', '晚上九点十分']) assert.ok(zh.includes(w), w);
  assert.equal(l7.summaryPoints.length, 4);
  assert.deepEqual(l7.apply.samplePassageIds, ['l07-dialogue-1']);
  assert.equal(l7.apply.tasks.length, 2);
  assert.ok(l7.apply.tasks[1].sampleZh.includes('四点下课'));
});

test('lesson 7 standardization: new print-based items and speaking guidance', () => {
  const items = Object.fromEntries([...l7.exerciseSet.items, ...l7.reader.passages.flatMap((g) => g.checkItems || [])].map((i) => [i.id, i])); // D28
  assert.equal(items['wb7-text-5'].answer, '1');
  assert.equal(items['wb7-text-6'].answer, '2');
  for (const [id, clk] of [['wb7-warm-1', 'c0815'], ['wb7-warm-2', 'c1520'], ['wb7-warm-3', 'c1010'], ['wb7-warm-4', 'c1345'], ['wb7-warm-5', 'c1230'], ['wb7-warm-6', 'c1800']])
    assert.equal(items[id].answer, clk, id);
  const t = l7.selfCheckTasks.find((x) => x.id === 'st-l07-03');
  assert.equal(t.promptImages.length, 4);
  assert.ok(t.promptImages.every((im) => /Tranh vẽ lại/.test(im.captionVi)));
  assert.ok(t.draftPromptVi.includes('现在是七点二十分'));
  assert.ok(t.draftPromptVi.includes('我今天晚上九点还有事呢'));
});

test('lesson 7 standardization: lookup covers every target surface', () => {
  const lex = new Map();
  for (const w of content.pilot.prepWords) lex.set(w.zh, w);
  for (const l of content.additionalLessons) for (const w of l.prepWords) if (!lex.has(w.zh)) lex.set(w.zh, w);
  for (const e of l7.lookup.extras) lex.set(e.zh, e);
  const surfaces = [...l7.reader.sentences.map((s) => s.zh),
    ...l7.knowledgePoints.filter((k) => k.kind === 'grammar').flatMap((k) => k.examples.map((e) => e.zh)),
    ...l7.summaryPoints.map((p) => p.exampleZh),
    ...l7.apply.tasks.map((t) => t.sampleZh)];
  let tokens = 0;
  for (const s of surfaces) for (const t of segmentZh(s, lex)) { if (!t.punct) { assert.ok(t.entry, `unmatched token ${t.text} in ${s}`); tokens++; } }
  assert.ok(tokens >= 38, `expected >= 38 tokens, got ${tokens}`);
});

test('lesson 7 standardization: intro renders path, context art and sections in order', async () => {
  localStorage.setItem('hsk30.progress.v1', JSON.stringify({ schemaVersion: 1, lessons: {} }));
  await route('lesson/hsk1-l07/intro');
  const heads = await poll(() => $$('#main h2').length >= 2 ? $$('#main h2').map((h) => h.textContent) : null);
  assert.ok(heads && heads.some((h) => h.includes('Lộ trình học bài này')), JSON.stringify(heads));
  assert.equal($$('.learn-path li').length, 6);
  assert.match($('img.context-image').getAttribute('src'), /assets\/lesson-07\/classroom\.webp/);
  assert.match($('img.context-image').getAttribute('alt'), /Tranh vẽ/);
  await route('lesson/hsk1-l07/prep');
  const titles = await poll(() => $$('.vocab-group-title').length === 3 ? $$('.vocab-group-title').map((t) => t.textContent) : null);
  assert.ok(titles && titles[0].includes('9 từ') && titles[1].includes('8 từ') && titles[2].includes('10 từ'), JSON.stringify(titles));
  await route('lesson/hsk1-l07/exercises');
  const zones = await poll(() => $('.exercise-zones') ? $('.exercise-zones').textContent : null);
  assert.ok(zones && zones.includes('gồm 2 phần'), 'L7 zone header must say 2 phần');
});
