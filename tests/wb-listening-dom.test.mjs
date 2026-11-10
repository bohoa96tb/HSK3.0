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
  assert.match(document.body.textContent, /D\. Nghe theo Workbook/);
  assert.equal($$('.wb-item:not(.wb-example)', card).length, 10, '10 questions');
  assert.equal($$('.wb-example', card).length, 3, '3 worked examples, one per part');
  assert.equal($$('.wb-shared-set .wb-pic', card).length, 4, 'part II shared picture set of 4');
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
