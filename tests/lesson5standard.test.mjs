import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { JSDOM } from 'jsdom';
import { segmentZh } from '../src/lib.js';
const content = JSON.parse(readFileSync(new URL('../data/content.json', import.meta.url)));
const l5 = content.additionalLessons.find((c) => c.lessonId === 'hsk1-l05');
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

test('lesson 5 standardization: prep groups follow the three dialogues and book word tracks', () => {
  assert.deepEqual(l5.prepWords.map((w) => w.dialogueGroup), [1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 3, 3]);
  assert.deepEqual(l5.prepGroups.map((g) => g.trackId), ['trk-tb-l05-2', 'trk-tb-l05-4', 'trk-tb-l05-6']);
  assert.equal(l5.prepSummaryVi, '22 từ mới, chia theo 3 hội thoại.');
});

test('lesson 5 standardization: path, quick checks, summary and apply tasks exist', () => {
  assert.equal(l5.learningPath.length, 6);
  assert.deepEqual(l5.learningPath.map((s) => s.sectionId), ['intro', 'prep', 'reader', 'reader', 'exercises', 'summary']);
  const main = l5.knowledgePoints.filter((k) => k.kind === 'grammar');
  assert.equal(main.length, 3);
  for (const k of main) {
    assert.ok(k.useWhenVi && k.useWhenVi.length > 10, k.id);
    assert.ok(k.quickCheck && k.quickCheck.answer, k.id);
  }
  assert.equal(l5.summaryPoints.length, 4);
  assert.deepEqual(l5.apply.samplePassageIds, ['l05-dialogue-1']);
  assert.equal(l5.apply.tasks.length, 2);
  assert.ok(l5.apply.tasks[1].sampleZh.includes('你们会做饭吗'));
});

test('lesson 5 standardization: time KP carries the full printed month and weekday tables', () => {
  const time = l5.knowledgePoints.find((k) => k.id === 'kp-hsk1-l05-time');
  const zh = time.examples.map((e) => e.zh);
  for (const m of ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月']) assert.ok(zh.includes(m), m);
  for (const wd of ['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期日']) assert.ok(zh.includes(wd), wd);
  assert.ok(zh.includes('今天是2025年5月22号。'));
  const yi = l5.knowledgePoints.find((k) => k.id === 'kp-hsk1-l05-yi-sandhi');
  assert.ok(yi.examples.map((e) => e.zh).includes('一口'));
  assert.ok(yi.examples.map((e) => e.zh).includes('一日'));
});

test('lesson 5 standardization: new print-based items and self-check tasks', () => {
  const items = Object.fromEntries(l5.exerciseSet.items.map((i) => [i.id, i]));
  assert.equal(items['wb5-text-5'].answer, '1');
  assert.equal(items['wb5-text-6'].answer, '1');
  for (const [id, card] of [['wb5-warm-1', 'calendar'], ['wb5-warm-2', 'blocks'], ['wb5-warm-3', 'computer'], ['wb5-warm-4', 'cooking'], ['wb5-warm-5', 'resting'], ['wb5-warm-6', 'dumplings']])
    assert.equal(items[id].answer, card, id);
  const tasks = Object.fromEntries(l5.selfCheckTasks.map((t) => [t.id, t]));
  assert.equal(tasks['st-l05-03'].prompts.length, 8);
  assert.equal(tasks['st-l05-04'].prompts.length, 8);
  assert.equal(tasks['st-l05-02'].promptImages.length, 4);
});

test('lesson 5 standardization: lookup covers every target surface', () => {
  const lex = new Map();
  for (const w of content.pilot.prepWords) lex.set(w.zh, w);
  for (const l of content.additionalLessons) for (const w of l.prepWords) if (!lex.has(w.zh)) lex.set(w.zh, w);
  for (const e of l5.lookup.extras) lex.set(e.zh, e);
  const surfaces = [...l5.reader.sentences.map((s) => s.zh),
    ...l5.knowledgePoints.filter((k) => k.kind === 'grammar').flatMap((k) => k.examples.map((e) => e.zh)),
    ...l5.summaryPoints.map((p) => p.exampleZh),
    ...l5.apply.tasks.map((t) => t.sampleZh)];
  let tokens = 0;
  for (const s of surfaces) for (const t of segmentZh(s, lex)) { if (!t.punct) { assert.ok(t.entry, `unmatched token ${t.text} in ${s}`); tokens++; } }
  assert.ok(tokens >= 50, `expected >= 50 tokens, got ${tokens}`);
});

test('lesson 5 standardization: intro renders path, context art and sections in order', async () => {
  localStorage.setItem('hsk30.progress.v1', JSON.stringify({ schemaVersion: 1, lessons: {} }));
  await route('lesson/hsk1-l05/intro');
  const heads = await poll(() => $$('#main h2').length >= 2 ? $$('#main h2').map((h) => h.textContent) : null);
  assert.ok(heads && heads.some((h) => h.includes('Lộ trình học bài này')), JSON.stringify(heads));
  assert.equal($$('.learn-path li').length, 6);
  assert.match($('img.context-image').getAttribute('src'), /assets\/lesson-05\/classroom\.webp/);
  assert.match($('img.context-image').getAttribute('alt'), /Tranh vẽ/);
  await route('lesson/hsk1-l05/prep');
  const titles = await poll(() => $$('.vocab-group-title').length === 3 ? $$('.vocab-group-title').map((t) => t.textContent) : null);
  assert.ok(titles && titles[0].includes('8 từ') && titles[1].includes('7 từ') && titles[2].includes('7 từ'), JSON.stringify(titles));
  await route('lesson/hsk1-l05/exercises');
  const zones = await poll(() => $('.exercise-zones') ? $('.exercise-zones').textContent : null);
  assert.ok(zones && zones.includes('gồm 2 phần'), 'L5 zone header must say 2 phần');
  assert.ok(!zones.includes('dùng 在'), 'zone header must not leak Lesson 8 text');
});
