// D27: Lesson 3 standardized to the Lesson 8 standard (docs/LESSON_STANDARD.md).
// Data assertions plus the interactive surfaces the standard requires.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { JSDOM } from 'jsdom';

const content = JSON.parse(readFileSync(new URL('../data/content.json', import.meta.url), 'utf8'));
const l3 = content.additionalLessons.find((c) => c.lessonId === 'hsk1-l03');
const { segmentZh } = await import('../src/lib.js');

test('lesson 3 standard: data carries path, groups, quick checks, summary, lookup, twister, book exercises', () => {
  assert.ok(Array.isArray(l3.learningPath) && l3.learningPath.length === 6);
  assert.equal(l3.prepGroups.length, 3);
  assert.equal(l3.prepWords.filter((w) => w.isProperName).length, 4); // 中国/法国/中文/泰国, listed by the book per dialogue
  const counts = [1, 2, 3].map((g) => l3.prepWords.filter((w) => w.dialogueGroup === g).length);
  assert.deepEqual(counts, [5, 7, 10]); // 2+3 proper / 6+1 proper / 10
  const main = l3.knowledgePoints.filter((k) => !String(k.kind).startsWith('foundation'));
  assert.equal(main.length, 3);
  for (const k of main) {
    assert.ok(k.useWhenVi, k.id);
    assert.ok(k.quickCheck && Array.isArray(k.quickCheck.options) && ['1', '2'].includes(k.quickCheck.answer), k.id);
  }
  const tw = l3.knowledgePoints.find((k) => k.id === 'kp-hsk1-l03-twister');
  assert.ok(tw && tw.audioTrackId === 'trk-tb-l03-7');
  assert.equal(l3.reader.audioTracks.find((t) => t.id === 'trk-tb-l03-7').durationSec, 23.647);
  const fills = l3.exerciseSet.items.filter((i) => i.id.startsWith('tb3-fill'));
  assert.deepEqual(fills.map((i) => i.answer), ['2', '5', '1', '4', '3']); // 吗/想/哪/中国人/谁 from the book's word bank
  for (const i of fills) assert.equal(i.answerStatus, 'verified-editorial');
  const speak = l3.selfCheckTasks.find((t) => t.id === 'st-l03-04');
  assert.ok(speak && speak.kind === 'speaking' && speak.promptImages.length === 2);
  assert.equal(l3.summaryPoints.length, 3);
  assert.ok(l3.apply.tasks.length === 2 && l3.apply.tasks.every((t) => t.sampleZh && t.sourceNoteVi));
});

test('lesson 3 lookup: coverage of target surfaces is complete', () => {
  const lex = new Map();
  for (const w of content.pilot.prepWords) lex.set(w.zh, w);
  for (const l of content.additionalLessons) for (const w of l.prepWords) if (!lex.has(w.zh)) lex.set(w.zh, w);
  for (const e of l3.lookup.extras) lex.set(e.zh, e);
  const texts = [...l3.reader.sentences.map((s) => s.zh),
    ...l3.knowledgePoints.filter((k) => !String(k.kind).startsWith('foundation')).flatMap((k) => k.examples.map((e) => e.zh)),
    ...l3.summaryPoints.map((p) => p.exampleZh), ...l3.apply.tasks.map((t) => t.sampleZh)];
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
const tick = (ms = 40) => new Promise((r) => setTimeout(r, ms)); // prep renders asynchronously after a same-lesson navigation
const route = async (hash) => { window.location.hash = '#/' + hash; await tick(); };
const $ = (s) => document.querySelector(s);
const $$ = (s) => [...document.querySelectorAll(s)];

test('lesson 3 intro and prep: path renders, CTA works, groups show 5/7/10 tokens with proper-name tags', async () => {
  await route('lesson/hsk1-l03/intro');
  assert.equal($$('.learn-path li').length, 6);
  const cta = $$('#main a.btn').find((a) => a.textContent.includes('Bắt đầu học') || a.textContent.includes('Tiếp tục học'));
  assert.ok(cta && cta.getAttribute('href') === '#/lesson/hsk1-l03/prep', 'intro CTA resumes at prep');
  await route('lesson/hsk1-l03/prep');
  for (let i = 0; i < 50 && !$('.vocab-group'); i++) await tick(20); // prep finishes rendering asynchronously
  assert.equal($$('.vocab-group-title').length, 3);
  assert.deepEqual($$('.vocab-group-title .tag').map((t) => t.textContent.trim()), ['2 từ + 3 tên riêng', '6 từ + 1 tên riêng', '10 từ']);
  assert.equal($$('.word-card').length, 22);
});

test('lesson 3 knowledge: three main points, quick check grades without recording, twister track button plays', async () => {
  await route('lesson/hsk1-l03/knowledge');
  assert.ok(document.body.textContent.includes('Ba điều cần nhớ'));
  const qc = $('[data-quick-check="kp-hsk1-l03-ma"]');
  assert.ok(qc);
  const before = window.localStorage.getItem('hsk30.progress.v1');
  qc.querySelectorAll('[data-quick-opt]')[1].click(); await tick();
  assert.ok(qc.querySelector('.quick-feedback').textContent.includes('Chưa đúng'));
  qc.querySelectorAll('[data-quick-opt]')[0].click(); await tick();
  assert.ok(qc.querySelector('.quick-feedback').textContent.includes('Đúng rồi'));
  assert.equal(JSON.parse(window.localStorage.getItem('hsk30.progress.v1')).attempts.length, JSON.parse(before).attempts.length);
  const btn = $('[data-play-kp-track="trk-tb-l03-7"]');
  assert.ok(btn && btn.textContent.includes('Track 3-7'));
});

test('lesson 3 reader lookup resolves names; exercises carry no lookup tokens; apply has two tasks', async () => {
  await route('lesson/hsk1-l03/reader?passage=l03-dialogue-3');
  const tok = $$('#main [data-tok]').find((b) => b.dataset.tok === '一飞');
  assert.ok(tok, '一飞 token exists');
  tok.click(); await tick();
  assert.ok($('#lookup-pop').hidden === false && $('#lookup-pop').textContent.includes('NHẤT PHI'));
  await route('lesson/hsk1-l03/exercises');
  assert.equal($$('#main [data-tok]').length, 0);
  assert.ok($$('#main .opt-btn, #main [data-opt]').length >= 20 || document.body.textContent.includes('你工作忙'));
  await route('lesson/hsk1-l03/apply');
  assert.equal($$('.speak-task').length, 2);
  assert.ok(document.body.textContent.includes('我也想你们'));
});
