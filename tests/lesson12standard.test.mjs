import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { JSDOM } from 'jsdom';
import { segmentZh } from '../src/lib.js';
const content = JSON.parse(readFileSync(new URL('../data/content.json', import.meta.url)));
const l12 = content.additionalLessons.find((c) => c.lessonId === 'hsk1-l12');
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

test('lesson 12 build: prep groups follow the three dialogues (9/6/9 words)', () => {
  assert.deepEqual(l12.prepWords.map((w) => w.dialogueGroup), [1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 3, 3, 3, 3]);
  assert.deepEqual(l12.prepGroups.map((g) => g.trackId), ['trk-tb-l12-2', 'trk-tb-l12-4', 'trk-tb-l12-6']);
  assert.equal(l12.prepSummaryVi, '24 từ mới, chia theo ba hội thoại của bài.');
  for (const w of l12.prepWords) assert.ok(w.audio && w.audio.status === 'asr-draft', w.id);
});

test('lesson 12 build: path, three grammar points with quick checks, summary, apply', () => {
  assert.equal(l12.learningPath.length, 6);
  assert.deepEqual(l12.learningPath.map((s) => s.sectionId), ['intro', 'prep', 'knowledge', 'reader', 'exercises', 'apply']);
  const main = l12.knowledgePoints.filter((k) => k.kind === 'grammar');
  assert.equal(main.length, 3);
  for (const k of main) {
    assert.ok(k.useWhenVi && k.useWhenVi.length > 10, k.id);
    assert.ok(k.quickCheck && ['1', '2'].includes(k.quickCheck.answer), k.id);
  }
  const prog = l12.knowledgePoints.find((k) => k.id === 'kp-hsk1-l12-non-subject');
  assert.equal(prog.examples.length, 6);
  assert.ok(prog.examples.some((e) => e.zh === '下雪了。'));
  const aff = l12.knowledgePoints.find((k) => k.id === 'kp-hsk1-l12-le');
  assert.equal(aff.examples.length, 3);
  const tai = l12.knowledgePoints.find((k) => k.id === 'kp-hsk1-l12-tai');
  assert.equal(tai.examples.length, 3);
  const fnd = l12.knowledgePoints.find((k) => k.id === 'kp-hsk1-l12-strokes-5');
  assert.ok(fnd.kind.startsWith('foundation'));
  assert.equal(l12.summaryPoints.length, 4);
  assert.deepEqual(l12.apply.samplePassageIds, ['l12-dialogue-3']);
  assert.equal(l12.apply.tasks.length, 2);
});

test('lesson 12 build: 21 set items + 6 dialogue questions with print-based answers (D28)', () => {
  const items = Object.fromEntries([...l12.exerciseSet.items, ...l12.reader.passages.flatMap((g) => g.checkItems || [])].map((i) => [i.id, i]));
  assert.equal(l12.exerciseSet.items.length, 21);
  assert.equal(l12.reader.passages.flatMap((g) => g.checkItems || []).length, 6);
  assert.ok(l12.reader.passages.every((g) => (g.checkItems || []).length === 2), 'every dialogue of lesson 12 carries its two printed questions');
  const expect = {
    'wb12-warm-1': '6', 'wb12-warm-2': '3', 'wb12-warm-3': '5', 'wb12-warm-4': '2', 'wb12-warm-5': '4', 'wb12-warm-6': '1',
    'tb12-text1-1': '3', 'tb12-text1-2': '2', 'tb12-text2-1': '1', 'tb12-text2-2': '3', 'tb12-text3-1': '2', 'tb12-text3-2': '3',
    'tb12-fill-1a': '2', 'tb12-fill-1b': '5', 'tb12-fill-2': '3', 'tb12-fill-3': '1', 'tb12-fill-4': '4',
    'wb12-tone-1': '2', 'wb12-tone-2': '1', 'wb12-tone-3': '2', 'wb12-tone-4': '3',
    'wb12-match-1': '1', 'wb12-match-2': '5', 'wb12-match-3': '6', 'wb12-match-4': '2', 'wb12-match-5': '4', 'wb12-match-6': '3',
  };
  for (const [id, ans] of Object.entries(expect)) assert.equal(items[id].answer, ans, id);
  for (const it of Object.values(items)) assert.ok(it.options.some((o) => o.id === it.answer), it.id);
  // D28: every dialogue listening question carries its own playable segment from the start
  for (const id of ['tb12-text1-1', 'tb12-text1-2', 'tb12-text2-1', 'tb12-text2-2', 'tb12-text3-1', 'tb12-text3-2']) {
    const seg = items[id].audioSegment;
    assert.ok(seg && seg.status === 'asr-draft' && seg.end > seg.start, id);
  }
  const t1 = l12.selfCheckTasks.find((x) => x.id === 'st-l12-01');
  assert.equal(t1.promptImages.length, 4);
  assert.ok(t1.promptImages.every((im) => /Tranh vẽ lại/.test(im.captionVi)));
  assert.equal(t1.answerStatus, 'unverified');
  const t2 = l12.selfCheckTasks.find((x) => x.id === 'st-l12-02');
  assert.deepEqual(t2.prompts, ['昨天天气怎么样？', '杨同乐昨天做什么了？', '杨同乐生病了吗？', '看病后，杨同乐回家要做什么？']);
  const t3 = l12.selfCheckTasks.find((x) => x.id === 'st-l12-03');
  assert.deepEqual(t3.prompts, ['今天天气怎么样？', '今天下雨（下雪）了吗？', '雨（雪）大吗？', '你觉得冷不冷？']);
});

test('lesson 12 build: lookup covers every target surface', () => {
  const lex = new Map();
  for (const w of content.pilot.prepWords) lex.set(w.zh, w);
  for (const l of content.additionalLessons) for (const w of l.prepWords) if (!lex.has(w.zh)) lex.set(w.zh, w);
  for (const e of l12.lookup.extras) lex.set(e.zh, e);
  const surfaces = [...l12.reader.sentences.map((s) => s.zh),
    ...l12.knowledgePoints.filter((k) => k.kind === 'grammar').flatMap((k) => k.examples.map((e) => e.zh)),
    ...l12.summaryPoints.map((p) => p.exampleZh),
    ...l12.apply.tasks.map((t) => t.sampleZh)];
  let tokens = 0;
  for (const s of surfaces) for (const t of segmentZh(s, lex)) { if (!t.punct) { assert.ok(t.entry, `unmatched token ${t.text} in ${s}`); tokens++; } }
  assert.ok(tokens >= 30, `expected >= 30 tokens, got ${tokens}`);
});

test('lesson 12 build: intro renders path and context art; dialogue checks render and grade in place (D28)', async () => {
  localStorage.setItem('hsk30.progress.v1', JSON.stringify({ schemaVersion: 1, lessons: {} }));
  await route('lesson/hsk1-l12/intro');
  const heads = await poll(() => $$('#main h2').length >= 2 ? $$('#main h2').map((h) => h.textContent) : null);
  assert.ok(heads && heads.some((h) => h.includes('Lộ trình học bài này')), JSON.stringify(heads));
  assert.equal($$('.learn-path li').length, 6);
  assert.match($('img.context-image').getAttribute('src'), /assets\/lesson-12\/classroom\.webp/);
  assert.match($('img.context-image').getAttribute('alt'), /Tranh vẽ/);
  await route('lesson/hsk1-l12/prep');
  const titles = await poll(() => $$('.vocab-group-title').length === 3 ? $$('.vocab-group-title').map((t) => t.textContent) : null);
  assert.ok(titles && titles[0].includes('9 từ') && titles[1].includes('6 từ') && titles[2].includes('9 từ'), JSON.stringify(titles));
  await route('lesson/hsk1-l12/reader?passage=l12-dialogue-1');
  const block = await poll(() => $('.reader-checks') ? $('.reader-checks') : null);
  assert.ok(block, 'dialogue 1 must render its printed questions under the dialogue');
  assert.equal($$('.reader-check-item').length, 2);
  const first = $('#check-tb12-text1-1');
  assert.ok(first, 'first dialogue question renders in place');
  assert.ok(first.textContent.includes('Câu hỏi nghe hiểu'), first.textContent.slice(0, 120));
  assert.equal(first.querySelectorAll('.pinyin').length, 0, 'pinyin of the check item stays hidden before grading (D23)');
  assert.ok(first.querySelector('[data-play-task="trk-tb-l12-1"]'), 'listening question carries its own segment play button');
  const form = $('#rc-form-tb12-text1-1');
  form.querySelector('input[name="opt"][value="3"]').click();
  form.querySelector('button[type="submit"]').click();
  await tick();
  const graded = await poll(() => $('#check-tb12-text1-1 .feedback.ok') ? true : null);
  assert.ok(graded, 'grading in place must confirm the correct answer');
  const prog = JSON.parse(localStorage.getItem('hsk30.progress.v1'));
  const att = (prog.attempts || []).filter((a) => a.exerciseId === 'tb12-text1-1');
  assert.equal(att.length, 1);
  assert.equal(att[0].correct, true);
  assert.equal(att[0].firstAttempt, true);
});
