// D27: Lesson 4 standardized to the Lesson 8 standard (docs/LESSON_STANDARD.md).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { JSDOM } from 'jsdom';

const content = JSON.parse(readFileSync(new URL('../data/content.json', import.meta.url), 'utf8'));
const l4 = content.additionalLessons.find((c) => c.lessonId === 'hsk1-l04');
const { segmentZh } = await import('../src/lib.js');

test('lesson 4 standard: data carries path, groups, quick checks, summary, lookup, book exercises', () => {
  assert.ok(Array.isArray(l4.learningPath) && l4.learningPath.length === 6);
  assert.equal(l4.prepGroups.length, 3);
  const counts = [1, 2, 3].map((g) => l4.prepWords.filter((w) => w.dialogueGroup === g).length);
  assert.deepEqual(counts, [3, 10, 8]); // book order: Text 1 有/多少/个, Text 2 ten words, Text 3 eight words
  const main = l4.knowledgePoints.filter((k) => !String(k.kind).startsWith('foundation'));
  assert.equal(main.length, 4);
  for (const k of main) {
    assert.ok(k.useWhenVi, k.id);
    assert.ok(k.quickCheck && Array.isArray(k.quickCheck.options) && ['1', '2'].includes(k.quickCheck.answer), k.id);
  }
  const num = l4.knowledgePoints.find((k) => k.id === 'kp-hsk1-l04-numbers');
  assert.ok(num.examples.length >= 50 && num.examples.some((e) => e.zh === '二百零八') && num.examples.some((e) => e.zh === '两本书'));
  const fills = l4.exerciseSet.items.filter((i) => i.id.startsWith('tb4-fill'));
  assert.deepEqual(fills.map((i) => i.answer), ['2', '4', '1', '3', '5']); // 二十/口/呢/没/大 from the book's word bank
  for (const i of fills) assert.equal(i.answerStatus, 'verified-editorial');
  const t5 = l4.exerciseSet.items.find((i) => i.id === 'wb4-text-5');
  const t6 = l4.exerciseSet.items.find((i) => i.id === 'wb4-text-6');
  assert.equal(t5.answer, '1'); assert.equal(t6.answer, '1'); // 一个儿子一个女儿 / 五岁, from the printed dialogue
  const warm = l4.exerciseSet.items.filter((i) => i.id.startsWith('wb4-warm'));
  assert.equal(warm.length, 6);
  assert.deepEqual(warm.map((i) => i.options[Number(i.answer) - 1].zh), ['五', '哥哥', '学生', '六十岁', '妈妈', '老师']);
  const speak = l4.selfCheckTasks.find((t) => t.id === 'st-l04-05');
  assert.ok(speak && speak.kind === 'speaking' && speak.promptImages.length === 4);
  assert.equal(l4.selfCheckTasks.length, 5);
  assert.equal(l4.summaryPoints.length, 4);
  assert.ok(l4.apply.tasks.length === 2 && l4.apply.tasks.every((t) => t.sampleZh && t.sourceNoteVi));
});

test('lesson 4 lookup: coverage of target surfaces is complete', () => {
  const lex = new Map();
  for (const w of content.pilot.prepWords) lex.set(w.zh, w);
  for (const l of content.additionalLessons) for (const w of l.prepWords) if (!lex.has(w.zh)) lex.set(w.zh, w);
  for (const e of l4.lookup.extras) lex.set(e.zh, e);
  const texts = [...l4.reader.sentences.map((s) => s.zh),
    ...l4.knowledgePoints.filter((k) => !String(k.kind).startsWith('foundation')).flatMap((k) => k.examples.map((e) => e.zh)),
    ...l4.summaryPoints.map((p) => p.exampleZh), ...l4.apply.tasks.map((t) => t.sampleZh)];
  for (const t of texts) assert.ok(segmentZh(t, lex).every((x) => x.punct || x.entry), t);
});

// ---- DOM flow ---------------------------------------------------------------
const dom = new JSDOM(readFileSync(new URL('../index.html', import.meta.url), 'utf8'), { url: 'https://example.test/HSK3.0/', pretendToBeVisual: true });
const { window } = dom;
for (const k of ['window', 'document', 'location', 'localStorage', 'FormData', 'HTMLElement', 'Node', 'CustomEvent', 'Event']) globalThis[k] = window[k];
Object.defineProperty(globalThis, 'navigator', { value: window.navigator, configurable: true });
window.scrollTo = () => {}; window.scrollBy = () => {}; window.Element.prototype.scrollIntoView = () => {};
window.requestAnimationFrame = (cb) => setTimeout(cb, 0);
class TestAudio { constructor(src) { this.src = src || ''; this.currentTime = 0; this.duration = 200; this.paused = true; TestAudio.instances.push(this); } play() { this.paused = false; return Promise.resolve(); } pause() { this.paused = true; } addEventListener() {} removeEventListener() {} }
TestAudio.instances = [];
globalThis.Audio = TestAudio; window.Audio = TestAudio;
globalThis.fetch = async () => ({ ok: true, json: async () => structuredClone(content) });
globalThis.speechSynthesis = { getVoices: () => [{ lang: 'zh-CN', name: 'Test Chinese' }], speak() {}, cancel() {} };
window.speechSynthesis = globalThis.speechSynthesis;
window.localStorage.setItem('hsk30.progress.v1', JSON.stringify({ version: 1, onboarded: true, support: { pinyin: true, meaning: true, fontScale: 1 }, attempts: [], selfChecks: {}, sectionDone: {}, lastSectionId: null, speakingDone: {} }));
await import('../src/app.js');
const tick = (ms = 40) => new Promise((r) => setTimeout(r, ms));
const route = async (hash) => { window.location.hash = '#/' + hash; await tick(); };
const $ = (s) => document.querySelector(s);
const $$ = (s) => [...document.querySelectorAll(s)];

test('lesson 4 intro and prep: path renders, groups show 3/10/8 word cards', async () => {
  await route('lesson/hsk1-l04/intro');
  assert.equal($$('.learn-path li').length, 6);
  const cta = $$('#main a.btn').find((a) => a.textContent.includes('Bắt đầu học') || a.textContent.includes('Tiếp tục học'));
  assert.ok(cta && cta.getAttribute('href') === '#/lesson/hsk1-l04/prep', 'intro CTA resumes at prep');
  await route('lesson/hsk1-l04/prep');
  for (let i = 0; i < 50 && !$('.vocab-group-title'); i++) await tick(20);
  assert.equal($$('.vocab-group-title').length, 3);
  assert.deepEqual($$('.vocab-group-title .tag').map((t) => t.textContent.trim()), ['3 từ', '10 từ', '8 từ']);
  assert.equal($$('.word-card').length, 21);
});

test('lesson 4 knowledge: quick check for measure words grades without recording', async () => {
  await route('lesson/hsk1-l04/knowledge');
  const qc = $('[data-quick-check="kp-hsk1-l04-measure"]');
  assert.ok(qc);
  const before = window.localStorage.getItem('hsk30.progress.v1');
  qc.querySelectorAll('[data-quick-opt]')[1].click(); await tick();
  assert.ok(qc.querySelector('.quick-feedback').textContent.includes('Chưa đúng'));
  qc.querySelectorAll('[data-quick-opt]')[0].click(); await tick();
  assert.ok(qc.querySelector('.quick-feedback').textContent.includes('Đúng rồi'));
  assert.equal(JSON.parse(window.localStorage.getItem('hsk30.progress.v1')).attempts.length, JSON.parse(before).attempts.length);
});

test('lesson 4 reader lookup resolves 一飞; exercises carry no lookup tokens; apply has two tasks', async () => {
  await route('lesson/hsk1-l04/reader?passage=l04-dialogue-1');
  const tok = $$('#main [data-tok]').find((b) => b.dataset.tok === '一飞');
  assert.ok(tok, '一飞 token exists');
  tok.click(); await tick();
  assert.ok($('#lookup-pop').hidden === false && $('#lookup-pop').textContent.includes('NHẤT PHI'));
  await route('lesson/hsk1-l04/exercises');
  assert.equal($$('#main [data-tok]').length, 0);
  assert.ok(document.body.textContent.includes('杨同乐有一个'));
  await route('lesson/hsk1-l04/apply');
  assert.equal($$('.speak-task').length, 2);
  assert.ok(document.body.textContent.includes('你家有几口人'));
});
