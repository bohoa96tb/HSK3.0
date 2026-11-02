import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { JSDOM } from 'jsdom';
import { segmentZh } from '../src/lib.js';
const content = JSON.parse(readFileSync(new URL('../data/content.json', import.meta.url)));
const l9 = content.additionalLessons.find((c) => c.lessonId === 'hsk1-l09');
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

test('lesson 9 build: prep groups follow the three dialogues (5/7/11 words)', () => {
  assert.deepEqual(l9.prepWords.map((w) => w.dialogueGroup), [1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3]);
  assert.deepEqual(l9.prepGroups.map((g) => g.trackId), ['trk-tb-l09-2', 'trk-tb-l09-4', 'trk-tb-l09-6']);
  assert.equal(l9.prepSummaryVi, '23 từ mới, chia theo ba hội thoại của bài.');
  for (const w of l9.prepWords) assert.ok(w.audio && w.audio.status === 'asr-draft', w.id);
});

test('lesson 9 build: path, three grammar points with quick checks, summary, apply', () => {
  assert.equal(l9.learningPath.length, 6);
  assert.deepEqual(l9.learningPath.map((s) => s.sectionId), ['intro', 'prep', 'knowledge', 'reader', 'exercises', 'apply']);
  const main = l9.knowledgePoints.filter((k) => k.kind === 'grammar');
  assert.equal(main.length, 3);
  for (const k of main) {
    assert.ok(k.useWhenVi && k.useWhenVi.length > 10, k.id);
    assert.ok(k.quickCheck && ['1', '2'].includes(k.quickCheck.answer), k.id);
  }
  const ex1 = l9.knowledgePoints.find((k) => k.id === 'kp-hsk1-l09-existential-1');
  assert.deepEqual(ex1.examples.map((e) => e.zh), ['学校前边有一家电影院。', '电影院前边是一家超市。', '电影院前边不是超市。', '桌子上没有小猫。']);
  const di = l9.knowledgePoints.find((k) => k.id === 'kp-hsk1-l09-ordinal-di');
  assert.ok(di.examples.some((e) => e.zh === '第一个学生，第一本书'));
  const fnd = l9.knowledgePoints.find((k) => k.id === 'kp-hsk1-l09-strokes-2');
  assert.ok(fnd.kind.startsWith('foundation'));
  assert.equal(l9.summaryPoints.length, 4);
  assert.deepEqual(l9.apply.samplePassageIds, ['l09-dialogue-2']);
  assert.equal(l9.apply.tasks.length, 2);
});

test('lesson 9 build: 19 main items with print-based answers', () => {
  const items = Object.fromEntries(l9.exerciseSet.items.map((i) => [i.id, i]));
  assert.equal(l9.exerciseSet.items.length, 19);
  const expect = {
    'wb9-warm-1': '1', 'wb9-warm-2': '2', 'wb9-warm-3': '3', 'wb9-warm-4': '4', 'wb9-warm-5': '5', 'wb9-warm-6': '6',
    'tb9-text2-1': '1', 'tb9-text2-2': '2', 'tb9-text3-1': '3', 'tb9-text3-2': '2',
    'tb9-fill-1a': '5', 'tb9-fill-1b': '1', 'tb9-fill-2': '4', 'tb9-fill-3': '2', 'tb9-fill-4': '3',
    'wb9-tone-1': '2', 'wb9-tone-2': '1', 'wb9-tone-3': '3', 'wb9-tone-4': '3',
  };
  for (const [id, ans] of Object.entries(expect)) assert.equal(items[id].answer, ans, id);
  for (const it of l9.exerciseSet.items) assert.ok(it.options.some((o) => o.id === it.answer), it.id);
  const t2 = l9.selfCheckTasks.find((x) => x.id === 'st-l09-02');
  assert.equal(t2.promptImages.length, 4);
  assert.ok(t2.promptImages.every((im) => /Tranh vẽ lại/.test(im.captionVi)));
  assert.ok(t2.draftPromptVi.includes('第一只小狗是我的'));
  const t1 = l9.selfCheckTasks.find((x) => x.id === 'st-l09-01');
  assert.deepEqual(t1.prompts, ['hao', 'xie', 'nin', 'zhong', 'tongxue', 'dajia', 'zaijian', 'renshi']);
  assert.equal(t1.answerStatus, 'unverified');
});

test('lesson 9 build: lookup covers every target surface', () => {
  const lex = new Map();
  for (const w of content.pilot.prepWords) lex.set(w.zh, w);
  for (const l of content.additionalLessons) for (const w of l.prepWords) if (!lex.has(w.zh)) lex.set(w.zh, w);
  for (const e of l9.lookup.extras) lex.set(e.zh, e);
  const surfaces = [...l9.reader.sentences.map((s) => s.zh),
    ...l9.knowledgePoints.filter((k) => k.kind === 'grammar').flatMap((k) => k.examples.map((e) => e.zh)),
    ...l9.summaryPoints.map((p) => p.exampleZh),
    ...l9.apply.tasks.map((t) => t.sampleZh)];
  let tokens = 0;
  for (const s of surfaces) for (const t of segmentZh(s, lex)) { if (!t.punct) { assert.ok(t.entry, `unmatched token ${t.text} in ${s}`); tokens++; } }
  assert.ok(tokens >= 30, `expected >= 30 tokens, got ${tokens}`);
});

test('lesson 9 build: intro renders path, context art; prep groups and exercise zones render', async () => {
  localStorage.setItem('hsk30.progress.v1', JSON.stringify({ schemaVersion: 1, lessons: {} }));
  await route('lesson/hsk1-l09/intro');
  const heads = await poll(() => $$('#main h2').length >= 2 ? $$('#main h2').map((h) => h.textContent) : null);
  assert.ok(heads && heads.some((h) => h.includes('Lộ trình học bài này')), JSON.stringify(heads));
  assert.equal($$('.learn-path li').length, 6);
  assert.match($('img.context-image').getAttribute('src'), /assets\/lesson-09\/classroom\.webp/);
  assert.match($('img.context-image').getAttribute('alt'), /Tranh vẽ/);
  await route('lesson/hsk1-l09/prep');
  const titles = await poll(() => $$('.vocab-group-title').length === 3 ? $$('.vocab-group-title').map((t) => t.textContent) : null);
  assert.ok(titles && titles[0].includes('5 từ') && titles[1].includes('7 từ') && titles[2].includes('11 từ'), JSON.stringify(titles));
  await route('lesson/hsk1-l09/exercises');
  const zones = await poll(() => $('.exercise-zones') ? $('.exercise-zones').textContent : null);
  assert.ok(zones && zones.includes('gồm 2 phần'), 'L9 zone header must say 2 phần');
});
