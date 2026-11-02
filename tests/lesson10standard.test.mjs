import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { JSDOM } from 'jsdom';
import { segmentZh } from '../src/lib.js';
const content = JSON.parse(readFileSync(new URL('../data/content.json', import.meta.url)));
const l10 = content.additionalLessons.find((c) => c.lessonId === 'hsk1-l10');
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

test('lesson 10 build: prep groups follow the three dialogues (7/6/10 words)', () => {
  assert.deepEqual(l10.prepWords.map((w) => w.dialogueGroup), [1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3]);
  assert.deepEqual(l10.prepGroups.map((g) => g.trackId), ['trk-tb-l10-2', 'trk-tb-l10-4', 'trk-tb-l10-6']);
  assert.equal(l10.prepSummaryVi, '23 từ mới, chia theo ba hội thoại của bài.');
  for (const w of l10.prepWords) assert.ok(w.audio && w.audio.status === 'asr-draft', w.id);
});

test('lesson 10 build: path, three grammar points with quick checks, summary, apply', () => {
  assert.equal(l10.learningPath.length, 6);
  assert.deepEqual(l10.learningPath.map((s) => s.sectionId), ['intro', 'prep', 'knowledge', 'reader', 'exercises', 'apply']);
  const main = l10.knowledgePoints.filter((k) => k.kind === 'grammar');
  assert.equal(main.length, 3);
  for (const k of main) {
    assert.ok(k.useWhenVi && k.useWhenVi.length > 10, k.id);
    assert.ok(k.quickCheck && ['1', '2'].includes(k.quickCheck.answer), k.id);
  }
  const money = l10.knowledgePoints.find((k) => k.id === 'kp-hsk1-l10-money');
  assert.deepEqual(money.examples.map((e) => e.zh), ['两分', '两毛', '三块', '三块二', '六块零两分', '二百零二块两毛']);
  const adj = l10.knowledgePoints.find((k) => k.id === 'kp-hsk1-l10-adj-predicate');
  assert.equal(adj.examples.length, 3);
  assert.ok(adj.examples.some((e) => e.zh === '我的房间不大。'));
  const fnd = l10.knowledgePoints.find((k) => k.id === 'kp-hsk1-l10-strokes-3');
  assert.ok(fnd.kind.startsWith('foundation'));
  assert.equal(l10.summaryPoints.length, 4);
  assert.deepEqual(l10.apply.samplePassageIds, ['l10-dialogue-1']);
  assert.equal(l10.apply.tasks.length, 2);
});

test('lesson 10 build: 16 set items + 4 dialogue questions with print-based answers (D28)', () => {
  const items = Object.fromEntries([...l10.exerciseSet.items, ...l10.reader.passages.flatMap((g) => g.checkItems || [])].map((i) => [i.id, i])); // D28: include the dialogues' questions
  assert.equal(l10.exerciseSet.items.length, 16); // D28: 4 listening questions live at Dialogues 2/3
  assert.equal(l10.reader.passages.flatMap((g) => g.checkItems || []).length, 4);
  const expect = {
    'wb10-warm-1': '1', 'wb10-warm-2': '2', 'wb10-warm-3': '3', 'wb10-warm-4': '4', 'wb10-warm-5': '5', 'wb10-warm-6': '6',
    'tb10-text2-1': '2', 'tb10-text2-2': '2', 'tb10-text3-1': '2', 'tb10-text3-2': '3',
    'tb10-fill-1': '3', 'tb10-fill-2a': '1', 'tb10-fill-2b': '5', 'tb10-fill-3': '4', 'tb10-fill-4': '2',
    'wb10-tone-1': '3', 'wb10-tone-2': '2', 'wb10-tone-3': '2', 'wb10-tone-4': '1', 'wb10-tone-5': '3',
  };
  for (const [id, ans] of Object.entries(expect)) assert.equal(items[id].answer, ans, id);
  for (const it of Object.values(items)) assert.ok(it.options.some((o) => o.id === it.answer), it.id);
  const t2 = l10.selfCheckTasks.find((x) => x.id === 'st-l10-02');
  assert.equal(t2.promptImages.length, 4);
  assert.ok(t2.promptImages.every((im) => /Tranh vẽ lại/.test(im.captionVi)));
  assert.ok(t2.draftPromptVi.includes('这儿的苹果真便宜'));
  const t1 = l10.selfCheckTasks.find((x) => x.id === 'st-l10-01');
  assert.deepEqual(t1.prompts, ['dui', 'jia', 'guo', 'xiang', 'chaoshi', 'niunai', 'shangwu', 'dianying']);
  assert.equal(t1.answerStatus, 'unverified');
  const t3 = l10.selfCheckTasks.find((x) => x.id === 'st-l10-03');
  assert.deepEqual(t3.prompts, ['那件衣服王一雪想买几件？', '男孩子的衣服在哪儿？']);
});

test('lesson 10 build: lookup covers every target surface', () => {
  const lex = new Map();
  for (const w of content.pilot.prepWords) lex.set(w.zh, w);
  for (const l of content.additionalLessons) for (const w of l.prepWords) if (!lex.has(w.zh)) lex.set(w.zh, w);
  for (const e of l10.lookup.extras) lex.set(e.zh, e);
  const surfaces = [...l10.reader.sentences.map((s) => s.zh),
    ...l10.knowledgePoints.filter((k) => k.kind === 'grammar').flatMap((k) => k.examples.map((e) => e.zh)),
    ...l10.summaryPoints.map((p) => p.exampleZh),
    ...l10.apply.tasks.map((t) => t.sampleZh)];
  let tokens = 0;
  for (const s of surfaces) for (const t of segmentZh(s, lex)) { if (!t.punct) { assert.ok(t.entry, `unmatched token ${t.text} in ${s}`); tokens++; } }
  assert.ok(tokens >= 30, `expected >= 30 tokens, got ${tokens}`);
});

test('lesson 10 build: intro renders path, context art; prep groups and exercise zones render', async () => {
  localStorage.setItem('hsk30.progress.v1', JSON.stringify({ schemaVersion: 1, lessons: {} }));
  await route('lesson/hsk1-l10/intro');
  const heads = await poll(() => $$('#main h2').length >= 2 ? $$('#main h2').map((h) => h.textContent) : null);
  assert.ok(heads && heads.some((h) => h.includes('Lộ trình học bài này')), JSON.stringify(heads));
  assert.equal($$('.learn-path li').length, 6);
  assert.match($('img.context-image').getAttribute('src'), /assets\/lesson-10\/classroom\.webp/);
  assert.match($('img.context-image').getAttribute('alt'), /Tranh vẽ/);
  await route('lesson/hsk1-l10/prep');
  const titles = await poll(() => $$('.vocab-group-title').length === 3 ? $$('.vocab-group-title').map((t) => t.textContent) : null);
  assert.ok(titles && titles[0].includes('7 từ') && titles[1].includes('6 từ') && titles[2].includes('10 từ'), JSON.stringify(titles));
  await route('lesson/hsk1-l10/exercises');
  const zones = await poll(() => $('.exercise-zones') ? $('.exercise-zones').textContent : null);
  assert.ok(zones && zones.includes('gồm 2 phần'), 'L10 zone header must say 2 phần');
});
