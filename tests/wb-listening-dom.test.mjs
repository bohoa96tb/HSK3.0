// D39: Workbook listening zone (HSK 2 Lesson 1) — real DOM behaviour in
// jsdom: book structure, transcript gating, practice check/redo flow and
// test-mode submit flow.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { JSDOM } from 'jsdom';
const content = JSON.parse(readFileSync(new URL('../data/content.json', import.meta.url)));

const dom = new JSDOM(readFileSync(new URL('../index.html', import.meta.url), 'utf8'), { url: 'https://example.test/HSK3.0/' });
for (const k of ['window', 'document', 'location', 'localStorage', 'FormData']) globalThis[k] = dom.window[k];
Object.defineProperty(globalThis, 'navigator', { value: dom.window.navigator, configurable: true });
window.scrollTo = () => {};
window.scrollBy = () => {};
window.HTMLElement.prototype.scrollIntoView = () => {};
globalThis.requestAnimationFrame = (fn) => { fn(); return 0; };
class TestAudio extends EventTarget {
  constructor(url) { super(); this.url = url; this.paused = true; }
  async play() { this.paused = false; }
  pause() { this.paused = true; }
}
globalThis.Audio = TestAudio;
globalThis.fetch = async () => ({ ok: true, json: async () => structuredClone(content) });
localStorage.setItem('hsk30.progress.v1', JSON.stringify({ schemaVersion: 1, learningRevision: 'textbook-pilot-v2', contentRevision: 'x' }));
await import('../src/app.js');
const tick = () => new Promise((r) => setTimeout(r, 10));
await tick();
async function route(path) { location.hash = '#/' + path; await tick(); }
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const item = (id) => document.getElementById(id);
const pick = (itemId, opt) => $$(`[data-wb-pick="${itemId}:${opt}"]`)[0].click();

await route('lesson/hsk2-l01/exercises');
await tick(); await tick();

test('wb zone renders in the exercises section with book structure', () => {
  const card = document.getElementById('wb-listening-card');
  assert.ok(card, 'wb card present');
  // Zone letter is derived (QA HIGH-1, D40): neither hsk2-l01 nor hsk2-l02 has a
  // suppExerciseSet, so the workbook zone is C — and the count line must agree.
  assert.match(document.body.textContent, /Luyện tập gồm 3 phần/);
  assert.match(document.body.textContent, /C\. Luyện theo Workbook/);
  assert.match(card.textContent, /模拟测练/);
  assert.ok(!/D\. Luyện theo Workbook/.test(document.body.textContent), "no phantom zone D when there is no mock set");
  // Listening block keeps its D39 shape: 10 questions, 3 examples, shared set.
  const listenSec = document.getElementById('wb-sec-listening');
  assert.equal($$('.wb-item:not(.wb-example)', listenSec).length, 10, '10 listening questions');
  assert.equal($$('.wb-example', listenSec).length, 3, '3 listening worked examples, one per part');
  assert.equal($$('.wb-shared-set .wb-pic', listenSec).length, 4, 'part II shared picture set of 4');
  // D41: the card now carries the full 30-question set (10 + 14 + 6).
  assert.equal($$('.wb-item:not(.wb-example)', card).length, 30, '30 questions across listening/reading/writing');
  assert.equal($$('.wb-example', card).length, 9, '9 worked examples across all parts');
  // examples show their transcripts and marked answers from the start (printed in the book)
  assert.match(item('wb2-l1-p1-ex').textContent, /我每天坐公交车去上班/);
  assert.match(item('wb2-l1-p1-ex').textContent, /Đáp án mẫu/);
});

test('practice mode: transcript hidden before checking; wrong then right with redo', () => {
  const q1 = item('wb2-l1-p1-q1');
  assert.ok(!q1.textContent.includes('他是坐火车来的'), 'transcript must not leak before checking');
  const checkBtn = $$('[data-wb-check="wb2-l1-p1-q1"]')[0];
  assert.ok(checkBtn.disabled, 'check disabled until an option is chosen');
  pick('wb2-l1-p1-q1', 'B');
  $$('[data-wb-check="wb2-l1-p1-q1"]')[0].click();
  let q1b = item('wb2-l1-p1-q1');
  assert.match(q1b.textContent, /Chưa đúng — đáp án là A/);
  assert.ok(q1b.textContent.includes('他是坐火车来的'), 'transcript revealed after checking');
  $$('[data-wb-redo="wb2-l1-p1-q1"]')[0].click();
  pick('wb2-l1-p1-q1', 'A');
  $$('[data-wb-check="wb2-l1-p1-q1"]')[0].click();
  q1b = item('wb2-l1-p1-q1');
  assert.match(q1b.textContent, /Đúng\./);
});

test('practice mode: part II letter choice and part III choice both grade', () => {
  pick('wb2-l1-p2-q4', 'C');
  $$('[data-wb-check="wb2-l1-p2-q4"]')[0].click();
  assert.match(item('wb2-l1-p2-q4').textContent, /Đúng\./);
  const q7 = item('wb2-l1-p3-q7');
  assert.ok(!q7.textContent.includes('果果饭店'), 'dialogue hidden before checking');
  assert.ok(!q7.textContent.includes('fàndiàn'), 'option pinyin hidden before checking (D23)');
  pick('wb2-l1-p3-q7', 'A');
  $$('[data-wb-check="wb2-l1-p3-q7"]')[0].click();
  const q7b = item('wb2-l1-p3-q7');
  assert.match(q7b.textContent, /Đúng\./);
  assert.ok(q7b.textContent.includes('fàndiàn'), 'pinyin appears after checking');
});

test('test mode: nothing revealed until submit; score counts only correct picks', () => {
  $$('[data-wb-mode="test"]')[0].click();
  const answers = { 'wb2-l1-p1-q1': 'A', 'wb2-l1-p1-q2': 'A', 'wb2-l1-p1-q3': 'B', 'wb2-l1-p2-q4': 'C', 'wb2-l1-p2-q5': 'A', 'wb2-l1-p2-q6': 'B', 'wb2-l1-p3-q7': 'A', 'wb2-l1-p3-q8': 'B', 'wb2-l1-p3-q9': 'A', 'wb2-l1-p3-q10': 'A' };
  // q2 and q10 deliberately wrong -> expect 8/10
  const submit = () => $$('[data-wb-submit]')[0];
  assert.ok(submit().disabled, 'submit locked until all 10 are answered');
  for (const [id, opt] of Object.entries(answers)) {
    assert.ok(!item(id).textContent.includes('Đáp án') || id.includes('ex'), `${id}: no answer leak in test mode`);
    pick(id, opt);
  }
  assert.ok(!item('wb2-l1-p1-q2').textContent.includes('他们是来帮忙的'), 'transcripts stay hidden before submit');
  submit().click();
  const card = document.getElementById('wb-listening-card');
  assert.match(card.textContent, /Kết quả: 8\/10/);
  assert.ok(item('wb2-l1-p1-q2').textContent.includes('他们是来帮忙的'), 'transcript revealed after submit');
  $$('[data-wb-reset]')[0].click();
  assert.ok(!item('wb2-l1-p1-q2').textContent.includes('他们是来帮忙的'), 'reset hides transcripts again');
});

// ---- D40: the same zone on Lesson 2 (no suppExerciseSet on this lesson, so
// assertions stay generic about the zone heading letter). ----
await route('lesson/hsk2-l02/exercises');
await tick(); await tick();

test('wb zone renders on lesson 2 with book structure (D40)', () => {
  const card = document.getElementById('wb-listening-card');
  assert.ok(card, 'wb card present on hsk2-l02');
  assert.match(card.textContent, /Luyện theo Workbook/);
  assert.match(document.body.textContent, /Luyện tập gồm 3 phần/);
  assert.match(document.body.textContent, /C\. Luyện theo Workbook/);
  assert.ok(!/D\. Luyện theo Workbook/.test(document.body.textContent), "lesson 2 also derives zone C (no mock set)");
  const listenSec = document.getElementById('wb-sec-listening');
  assert.equal($$('.wb-item:not(.wb-example)', listenSec).length, 10, '10 listening questions');
  assert.equal($$('.wb-example', listenSec).length, 3, '3 listening worked examples, one per part');
  assert.equal($$('.wb-shared-set .wb-pic', listenSec).length, 4, 'part II shared picture set of 4');
  assert.equal($$('.wb-item:not(.wb-example)', card).length, 30, '30 questions across listening/reading/writing (D41)');
  // shared book example, same text as lesson 1
  assert.match(item('wb2-l2-p1-ex').textContent, /我每天坐公交车去上班/);
  assert.match(item('wb2-l2-p1-ex').textContent, /Đáp án mẫu/);
});

test('lesson 2 practice mode: transcript hidden before checking; wrong then right with redo', () => {
  const q1 = item('wb2-l2-p1-q1');
  assert.ok(!q1.textContent.includes('教室里有十多名学生'), 'transcript must not leak before checking');
  pick('wb2-l2-p1-q1', 'C');
  $$('[data-wb-check="wb2-l2-p1-q1"]')[0].click();
  let q1b = item('wb2-l2-p1-q1');
  assert.match(q1b.textContent, /Chưa đúng — đáp án là A/);
  assert.ok(q1b.textContent.includes('教室里有十多名学生'), 'transcript revealed after checking');
  $$('[data-wb-redo="wb2-l2-p1-q1"]')[0].click();
  pick('wb2-l2-p1-q1', 'A');
  $$('[data-wb-check="wb2-l2-p1-q1"]')[0].click();
  q1b = item('wb2-l2-p1-q1');
  assert.match(q1b.textContent, /Đúng\./);
});

test('lesson 2 part III: dialogue and option pinyin hidden before checking (D23)', () => {
  const q9 = item('wb2-l2-p3-q9');
  assert.ok(!q9.textContent.includes('北京大学'), 'dialogue hidden before checking');
  assert.ok(!q9.textContent.includes('dǎchē'), 'option pinyin hidden before checking (D23)');
  pick('wb2-l2-p3-q9', 'A');
  $$('[data-wb-check="wb2-l2-p3-q9"]')[0].click();
  const q9b = item('wb2-l2-p3-q9');
  assert.match(q9b.textContent, /Đúng\./);
  assert.ok(q9b.textContent.includes('dǎchē'), 'pinyin appears after checking');
});
