import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { JSDOM } from 'jsdom';
import { segmentZh } from '../src/lib.js';
const content = JSON.parse(readFileSync(new URL('../data/content.json', import.meta.url)));
const l13 = content.additionalLessons.find((c) => c.lessonId === 'hsk1-l13');
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

test('lesson 13 build: prep groups follow the three dialogues (6/11/3 words)', () => {
  assert.deepEqual(l13.prepWords.map((w) => w.dialogueGroup), [1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3]);
  assert.deepEqual(l13.prepGroups.map((g) => g.trackId), ['trk-tb-l13-2', 'trk-tb-l13-4', 'trk-tb-l13-6']);
  assert.equal(l13.prepSummaryVi, '20 từ mới, chia theo ba hội thoại của bài.');
  for (const w of l13.prepWords) assert.ok(w.audio && w.audio.status === 'asr-draft', w.id);
});

test('lesson 13 build: path, three grammar points with quick checks, summary, apply', () => {
  assert.equal(l13.learningPath.length, 6);
  assert.deepEqual(l13.learningPath.map((s) => s.sectionId), ['intro', 'prep', 'knowledge', 'reader', 'exercises', 'apply']);
  const main = l13.knowledgePoints.filter((k) => k.kind === 'grammar');
  assert.equal(main.length, 3);
  for (const k of main) {
    assert.ok(k.useWhenVi && k.useWhenVi.length > 10, k.id);
    assert.ok(k.quickCheck && ['1', '2'].includes(k.quickCheck.answer), k.id);
    assert.equal(k.examples.length, 3, k.id);
  }
  const dbl = l13.knowledgePoints.find((k) => k.id === 'kp-hsk1-l13-double-object');
  assert.ok(dbl.examples.some((e) => e.zh === '请给我一杯牛奶。'));
  const fnd = l13.knowledgePoints.find((k) => k.id === 'kp-hsk1-l13-characters-6');
  assert.ok(fnd.kind.startsWith('foundation'));
  assert.equal(l13.summaryPoints.length, 4);
  assert.deepEqual(l13.apply.samplePassageIds, ['l13-dialogue-2']);
  assert.equal(l13.apply.tasks.length, 2);
});

test('lesson 13 build: 21 set items + 6 dialogue questions with print-based answers (D28)', () => {
  const items = Object.fromEntries([...l13.exerciseSet.items, ...l13.reader.passages.flatMap((g) => g.checkItems || [])].map((i) => [i.id, i]));
  assert.equal(l13.exerciseSet.items.length, 21);
  assert.equal(l13.reader.passages.flatMap((g) => g.checkItems || []).length, 6);
  assert.ok(l13.reader.passages.every((g) => (g.checkItems || []).length === 2), 'every dialogue of lesson 13 carries its two printed questions');
  const expect = {
    'wb13-warm-1': '2', 'wb13-warm-2': '4', 'wb13-warm-3': '1', 'wb13-warm-4': '5', 'wb13-warm-5': '6', 'wb13-warm-6': '3',
    'tb13-text1-1': '1', 'tb13-text1-2': '2', 'tb13-text2-1': '3', 'tb13-text2-2': '3', 'tb13-text3-1': '2', 'tb13-text3-2': '2',
    'tb13-fill-1': '3', 'tb13-fill-2': '5', 'tb13-fill-3a': '2', 'tb13-fill-3b': '4', 'tb13-fill-4': '1',
    'wb13-tone-1': '2', 'wb13-tone-2': '1', 'wb13-tone-3': '2', 'wb13-tone-4': '3',
    'wb13-match-1': '1', 'wb13-match-2': '3', 'wb13-match-3': '5', 'wb13-match-4': '6', 'wb13-match-5': '2', 'wb13-match-6': '4',
  };
  for (const [id, ans] of Object.entries(expect)) assert.equal(items[id].answer, ans, id);
  for (const it of Object.values(items)) assert.ok(it.options.some((o) => o.id === it.answer), it.id);
  // D28: every dialogue listening question carries its own playable segment from the start
  for (const id of ['tb13-text1-1', 'tb13-text1-2', 'tb13-text2-1', 'tb13-text2-2', 'tb13-text3-1', 'tb13-text3-2']) {
    const seg = items[id].audioSegment;
    assert.ok(seg && seg.status === 'asr-draft' && seg.end > seg.start, id);
  }
  const t1 = l13.selfCheckTasks.find((x) => x.id === 'st-l13-01');
  assert.equal(t1.promptImages.length, 4);
  assert.ok(t1.promptImages.every((im) => /Tranh vẽ lại/.test(im.captionVi)));
  assert.equal(t1.answerStatus, 'unverified');
  const t2 = l13.selfCheckTasks.find((x) => x.id === 'st-l13-02');
  assert.deepEqual(t2.prompts, ['白家月还有什么问题？', '王老师对白家月说什么了？', '服务员问王一雪什么问题了？', '王一雪吃早饭了吗？', '刘明想要多少饺子？', '刘明要米饭了吗？']);
});

test('lesson 13 build: lookup covers every target surface', () => {
  const lex = new Map();
  for (const w of content.pilot.prepWords) lex.set(w.zh, w);
  for (const l of content.additionalLessons) for (const w of l.prepWords) if (!lex.has(w.zh)) lex.set(w.zh, w);
  for (const e of l13.lookup.extras) lex.set(e.zh, e);
  const surfaces = [...l13.reader.sentences.map((s) => s.zh),
    ...l13.knowledgePoints.filter((k) => k.kind === 'grammar').flatMap((k) => k.examples.map((e) => e.zh)),
    ...l13.summaryPoints.map((p) => p.exampleZh),
    ...l13.apply.tasks.map((t) => t.sampleZh)];
  let tokens = 0;
  for (const s of surfaces) for (const t of segmentZh(s, lex)) { if (!t.punct) { assert.ok(t.entry, `unmatched token ${t.text} in ${s}`); tokens++; } }
  assert.ok(tokens >= 30, `expected >= 30 tokens, got ${tokens}`);
});

test('lesson 13 build: intro renders path and context art; dialogue checks render and grade in place (D28)', async () => {
  localStorage.setItem('hsk30.progress.v1', JSON.stringify({ schemaVersion: 1, lessons: {} }));
  await route('lesson/hsk1-l13/intro');
  const heads = await poll(() => $$('#main h2').length >= 2 ? $$('#main h2').map((h) => h.textContent) : null);
  assert.ok(heads && heads.some((h) => h.includes('Lộ trình học bài này')), JSON.stringify(heads));
  assert.equal($$('.learn-path li').length, 6);
  assert.match($('img.context-image').getAttribute('src'), /assets\/lesson-13\/classroom\.webp/);
  assert.match($('img.context-image').getAttribute('alt'), /Tranh vẽ/);
  await route('lesson/hsk1-l13/prep');
  const titles = await poll(() => $$('.vocab-group-title').length === 3 ? $$('.vocab-group-title').map((t) => t.textContent) : null);
  assert.ok(titles && titles[0].includes('6 từ') && titles[1].includes('11 từ') && titles[2].includes('3 từ'), JSON.stringify(titles));
  await route('lesson/hsk1-l13/reader?passage=l13-dialogue-1');
  const block = await poll(() => $('.reader-checks') ? $('.reader-checks') : null);
  assert.ok(block, 'dialogue 1 must render its printed questions under the dialogue');
  assert.equal($$('.reader-check-item').length, 2);
  const first = $('#check-tb13-text1-1');
  assert.ok(first, 'first dialogue question renders in place');
  assert.ok(first.textContent.includes('Câu hỏi nghe hiểu'), first.textContent.slice(0, 120));
  assert.equal(first.querySelectorAll('.pinyin').length, 0, 'pinyin of the check item stays hidden before grading (D23)');
  assert.ok(first.querySelector('[data-play-task="trk-tb-l13-1"]'), 'listening question carries its own segment play button');
  const form = $('#rc-form-tb13-text1-1');
  form.querySelector('input[name="opt"][value="1"]').click();
  form.querySelector('button[type="submit"]').click();
  await tick();
  const graded = await poll(() => $('#check-tb13-text1-1 .feedback.ok') ? true : null);
  assert.ok(graded, 'grading in place must confirm the correct answer');
  const prog = JSON.parse(localStorage.getItem('hsk30.progress.v1'));
  const att = (prog.attempts || []).filter((a) => a.exerciseId === 'tb13-text1-1');
  assert.equal(att.length, 1);
  assert.equal(att[0].correct, true);
  assert.equal(att[0].firstAttempt, true);
});
