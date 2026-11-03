import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { JSDOM } from 'jsdom';
import { segmentZh } from '../src/lib.js';
const content = JSON.parse(readFileSync(new URL('../data/content.json', import.meta.url)));
const l15 = content.additionalLessons.find((c) => c.lessonId === 'hsk1-l15');
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
async function route(path) { location.hash = '#/' + path; for (let i = 0; i < 6; i++) await tick(); }
async function poll(fn, tries = 40) { for (let i = 0; i < tries; i++) { const v = fn(); if (v) return v; await tick(); } return null; }
const $ = (s) => document.querySelector(s);
const $$ = (s) => [...document.querySelectorAll(s)];

test('lesson 15 build: prep groups follow the three dialogues (2 words, 5 words + 2 proper nouns, 10 words + 1 proper noun)', () => {
  assert.deepEqual(l15.prepWords.map((w) => w.dialogueGroup), [1, 1, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3]);
  assert.deepEqual(l15.prepGroups.map((g) => g.trackId), ['trk-tb-l15-2', 'trk-tb-l15-4', 'trk-tb-l15-6']);
  for (const w of l15.prepWords) {
    if (w.isProperName) assert.equal(w.audio, null, w.id);
    else assert.ok(w.audio && w.audio.status === 'asr-draft', w.id);
  }
  assert.equal(l15.prepWords.filter((w) => w.isProperName).length, 3);
});

test('lesson 15 build: path, one grammar point with quick check (the book prints only one), summary, apply', () => {
  assert.equal(l15.learningPath.length, 6);
  assert.deepEqual(l15.learningPath.map((s) => s.sectionId), ['intro', 'prep', 'knowledge', 'reader', 'exercises', 'apply']);
  const main = l15.knowledgePoints.filter((k) => k.kind === 'grammar');
  assert.equal(main.length, 1); // Textbook tr.114 prints a single Xiaoyu's Classroom point for Lesson 15
  const k = main[0];
  assert.equal(k.id, 'kp-hsk1-l15-coordinate');
  assert.ok(k.useWhenVi && k.useWhenVi.length > 10);
  assert.equal(k.quickCheck.answer, '1');
  assert.equal(k.examples.length, 5);
  const fnd = l15.knowledgePoints.find((x) => x.id === 'kp-hsk1-l15-characters-8');
  assert.ok(fnd.kind.startsWith('foundation'));
  assert.equal(fnd.examples.length, 6);
  assert.equal(l15.summaryPoints.length, 4);
  assert.deepEqual(l15.apply.samplePassageIds, ['l15-dialogue-2', 'l15-dialogue-3']);
  assert.equal(l15.apply.tasks.length, 2);
});

test('lesson 15 build: 23 set items + 6 dialogue questions with print-based answers (D28)', () => {
  const items = Object.fromEntries([...l15.exerciseSet.items, ...l15.reader.passages.flatMap((g) => g.checkItems || [])].map((i) => [i.id, i]));
  assert.equal(l15.exerciseSet.items.length, 23);
  assert.equal(l15.reader.passages.flatMap((g) => g.checkItems || []).length, 6);
  assert.ok(l15.reader.passages.every((g) => (g.checkItems || []).length === 2), 'every dialogue of lesson 15 carries its two printed questions');
  const expect = {
    'wb15-warm-1': '1', 'wb15-warm-2': '2', 'wb15-warm-3': '3', 'wb15-warm-4': '4', 'wb15-warm-5': '5', 'wb15-warm-6': '6',
    'tb15-text1-1': '2', 'tb15-text1-2': '3', 'tb15-text2-1': '1', 'tb15-text2-2': '2', 'tb15-text3-1': '2', 'tb15-text3-2': '1',
    'tb15-fill-1': '4', 'tb15-fill-2': '1', 'tb15-fill-3': '3', 'tb15-fill-4a': '5', 'tb15-fill-4b': '2',
    'wb15-match-1': '1', 'wb15-match-2': '4', 'wb15-match-3': '5', 'wb15-match-4': '2', 'wb15-match-5': '6', 'wb15-match-6': '3',
    'wb15-int-1': '2', 'wb15-int-2': '1', 'wb15-int-3': '3', 'wb15-int-4': '2', 'wb15-int-5': '4', 'wb15-int-6': '2',
  };
  for (const [id, ans] of Object.entries(expect)) assert.equal(items[id].answer, ans, id);
  for (const it of Object.values(items)) assert.ok(it.options.some((o) => o.id === it.answer), it.id);
  for (const id of ['tb15-text1-1', 'tb15-text1-2', 'tb15-text2-1', 'tb15-text2-2', 'tb15-text3-1', 'tb15-text3-2']) {
    const seg = items[id].audioSegment;
    assert.ok(seg && seg.status === 'asr-draft' && seg.end > seg.start, id);
  }
  const t1 = l15.selfCheckTasks.find((x) => x.id === 'st-l15-01');
  assert.equal(t1.promptImages.length, 4);
  assert.ok(t1.promptImages.every((im) => /Tranh vẽ lại/.test(im.captionVi)));
  assert.equal(t1.answerStatus, 'unverified');
  const t2 = l15.selfCheckTasks.find((x) => x.id === 'st-l15-02');
  assert.deepEqual(t2.prompts, ['白家月爱吃哪个菜？', '李文做饭好吃不好吃？', '安妮今年想去哪儿？', '前几年白家月去了哪儿？', '大兴机场在哪儿？', '王老师的姐姐可以去接白家月和安妮吗？']);
  const t3 = l15.selfCheckTasks.find((x) => x.id === 'st-l15-03');
  assert.equal(t3.prompts.length, 4);
});

test('lesson 15 build: lookup covers every target surface', () => {
  const lex = new Map();
  for (const w of content.pilot.prepWords) lex.set(w.zh, w);
  for (const l of content.additionalLessons) for (const w of l.prepWords) if (!lex.has(w.zh)) lex.set(w.zh, w);
  for (const e of l15.lookup.extras) lex.set(e.zh, e);
  const surfaces = [...l15.reader.sentences.map((s) => s.zh),
    ...l15.knowledgePoints.filter((k) => k.kind === 'grammar').flatMap((k) => k.examples.map((e) => e.zh)),
    ...l15.summaryPoints.map((p) => p.exampleZh),
    ...l15.apply.tasks.map((t) => t.sampleZh)];
  let tokens = 0;
  for (const s of surfaces) for (const t of segmentZh(s, lex)) { if (!t.punct) { assert.ok(t.entry, `unmatched token ${t.text} in ${s}`); tokens++; } }
  assert.ok(tokens >= 30, `expected >= 30 tokens, got ${tokens}`);
});

test('lesson 15 build: intro renders path and context art; dialogue checks render and grade in place (D28)', async () => {
  localStorage.setItem('hsk30.progress.v1', JSON.stringify({ schemaVersion: 1, lessons: {} }));
  await route('lesson/hsk1-l15/intro');
  const heads = await poll(() => $$('#main h2').length >= 2 ? $$('#main h2').map((h) => h.textContent) : null);
  assert.ok(heads && heads.some((h) => h.includes('Lộ trình học bài này')), JSON.stringify(heads));
  assert.equal($$('.learn-path li').length, 6);
  assert.match($('img.context-image').getAttribute('src'), /assets\/lesson-15\/airport\.webp/);
  assert.match($('img.context-image').getAttribute('alt'), /Tranh vẽ/);
  await route('lesson/hsk1-l15/prep');
  const titles = await poll(() => $$('.vocab-group-title').length === 3 ? $$('.vocab-group-title').map((t) => t.textContent) : null);
  assert.ok(titles && titles[0].includes('2 từ') && titles[1].includes('5 từ + 2 tên riêng') && titles[2].includes('10 từ + 1 tên riêng'), JSON.stringify(titles));
  await route('lesson/hsk1-l15/reader?passage=l15-dialogue-1');
  const block = await poll(() => $('.reader-checks') ? $('.reader-checks') : null);
  assert.ok(block, 'dialogue 1 must render its printed questions under the dialogue');
  assert.equal($$('.reader-check-item').length, 2);
  const first = $('#check-tb15-text1-1');
  assert.ok(first, 'first dialogue question renders in place');
  assert.ok(first.textContent.includes('Câu hỏi nghe hiểu'), first.textContent.slice(0, 120));
  assert.equal(first.querySelectorAll('.pinyin').length, 0, 'pinyin of the check item stays hidden before grading (D23)');
  assert.ok(first.querySelector('[data-play-task="trk-tb-l15-1"]'), 'listening question carries its own segment play button');
  const form = $('#rc-form-tb15-text1-1');
  form.querySelector('input[name="opt"][value="2"]').click();
  form.querySelector('button[type="submit"]').click();
  await tick();
  const graded = await poll(() => $('#check-tb15-text1-1 .feedback.ok') ? true : null);
  assert.ok(graded, 'grading in place must confirm the correct answer');
  const prog = JSON.parse(localStorage.getItem('hsk30.progress.v1'));
  const att = (prog.attempts || []).filter((a) => a.exerciseId === 'tb15-text1-1');
  assert.equal(att.length, 1);
  assert.equal(att[0].correct, true);
  assert.equal(att[0].firstAttempt, true);
});
