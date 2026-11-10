// D41: Workbook reading + writing DOM behaviour in jsdom — 30 items per
// lesson, per-kind practice flows (incl. typed Hanzi right/wrong), printed
// pinyin visible by design (D41), per-section test-mode submit locking.
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
const rpick = (itemId, opt) => $$(`[data-wbr-pick="${itemId}:${opt}"]`)[0].click();
const wpick = (itemId, opt) => $$(`[data-wbw-pick="${itemId}:${opt}"]`)[0].click();
const type = (itemId, value) => { const el = $$(`[data-wbw-input="${itemId}"]`)[0]; el.value = value; el.dispatchEvent(new window.Event('input', { bubbles: true })); };

await route('lesson/hsk2-l01/exercises');
await tick(); await tick();

test('reading + writing sections render inside the workbook card (D41)', () => {
  const card = document.getElementById('wb-listening-card');
  assert.ok(card, 'wb card present');
  assert.match(card.textContent, /C\. Luyện theo Workbook — 模拟测练 Simulated Practice/);
  assert.match(document.body.textContent, /toàn bộ bộ luyện tập mô phỏng của sách bài tập \(30 câu: nghe 10, đọc 14, viết 6\)/);
  const rd = document.getElementById('wb-sec-reading');
  const wr = document.getElementById('wb-sec-writing');
  assert.ok(rd && wr, 'reading and writing sections present');
  assert.match(rd.textContent, /二、阅读 Reading/);
  assert.match(wr.textContent, /三、书写 Writing/);
  assert.equal($$('.wb-item:not(.wb-example)', rd).length, 14, '14 reading questions');
  assert.equal($$('.wb-item:not(.wb-example)', wr).length, 6, '6 writing questions');
  assert.equal($$('.wb-example', rd).length, 4, '4 reading worked examples');
  assert.equal($$('.wb-example', wr).length, 2, '2 writing worked examples');
  assert.equal($$('.wb-shared-set .wb-pic', rd).length, 4, 'reading part I shared picture set of 4');
  // D41 design decision: reading shows the pinyin printed in the book.
  assert.ok(item('wb2-l1-r1-q11').textContent.includes('lǚyóu'), 'sentence pinyin visible before answering');
  assert.ok(item('wb2-l1-r4-q22').textContent.includes('fàndiàn'), 'option pinyin visible before answering');
});

test('practice flow: one item of each new kind grades (D41)', () => {
  // picture-match via letter chips
  rpick('wb2-l1-r1-q11', 'B');
  $$('[data-wbr-check="wb2-l1-r1-q11"]')[0].click();
  assert.match(item('wb2-l1-r1-q11').textContent, /Đúng\./);
  // word bank
  rpick('wb2-l1-r2-q14', 'C');
  $$('[data-wbr-check="wb2-l1-r2-q14"]')[0].click();
  assert.match(item('wb2-l1-r2-q14').textContent, /Đúng\./);
  // match bank
  rpick('wb2-l1-r3-q18', 'A');
  $$('[data-wbr-check="wb2-l1-r3-q18"]')[0].click();
  assert.match(item('wb2-l1-r3-q18').textContent, /Đúng\./);
  // passage choice: meaning gloss appears only after checking
  assert.ok(!item('wb2-l1-r4-q22').textContent.includes('nhà hàng'), 'option meaning hidden before checking');
  rpick('wb2-l1-r4-q22', 'B');
  $$('[data-wbr-check="wb2-l1-r4-q22"]')[0].click();
  assert.match(item('wb2-l1-r4-q22').textContent, /Đúng\./);
  assert.ok(item('wb2-l1-r4-q22').textContent.includes('nhà hàng'), 'option meaning revealed after checking');
  // component bank: completed word shown after checking
  wpick('wb2-l1-w1-q25', 'C');
  $$('[data-wbw-check="wb2-l1-w1-q25"]')[0].click();
  assert.match(item('wb2-l1-w1-q25').textContent, /Đúng\./);
  assert.ok(item('wb2-l1-w1-q25').textContent.includes('不懂'), 'completed word 不懂 revealed');
});

test('practice flow: typed writing answer — wrong shows the character, redo then right (D41)', () => {
  const checkBtn = () => $$('[data-wbw-check="wb2-l1-w2-q28"]')[0];
  assert.ok(checkBtn().disabled, 'check disabled while the input is empty');
  type('wb2-l1-w2-q28', '网');
  assert.ok(!checkBtn().disabled, 'typing enables the check button');
  checkBtn().click();
  assert.match(item('wb2-l1-w2-q28').textContent, /Chưa đúng — đáp án là 有/);
  $$('[data-wbw-redo="wb2-l1-w2-q28"]')[0].click();
  type('wb2-l1-w2-q28', ' 有 '); // surrounding spaces are trimmed before grading
  checkBtn().click();
  assert.match(item('wb2-l1-w2-q28').textContent, /Đúng\./);
});

test('test mode: submit is per section and locks independently (D41)', () => {
  $$('[data-wb-mode="test"]')[0].click();
  const rSubmit = () => $$('[data-wbr-submit]')[0];
  const wSubmit = () => $$('[data-wbw-submit]')[0];
  assert.ok(rSubmit().disabled, 'reading submit locked until all 14 are answered');
  assert.ok(wSubmit().disabled, 'writing submit locked until all 6 are answered');
  assert.ok($$('[data-wb-submit]')[0].disabled, 'listening submit still independently locked at 0/10');
  // 4 reading picks persist from the practice round; answer the remaining 10.
  for (const [id, opt] of Object.entries({ 'wb2-l1-r1-q12': 'C', 'wb2-l1-r1-q13': 'A', 'wb2-l1-r2-q15': 'A', 'wb2-l1-r2-q16': 'B', 'wb2-l1-r2-q17': 'D', 'wb2-l1-r3-q19': 'C', 'wb2-l1-r3-q20': 'B', 'wb2-l1-r3-q21': 'D', 'wb2-l1-r4-q23': 'A', 'wb2-l1-r4-q24': 'B' })) rpick(id, opt);
  assert.ok(!rSubmit().disabled, 'reading submit unlocks at 14/14');
  rSubmit().click();
  assert.match(document.getElementById('wb-sec-reading').textContent, /Kết quả phần đọc: 14\/14/);
  assert.ok(wSubmit().disabled, 'writing submit still locked after the reading section was submitted');
  // writing: 1 component pick persists (q25); finish the section.
  wpick('wb2-l1-w1-q26', 'B');
  wpick('wb2-l1-w1-q27', 'A');
  type('wb2-l1-w2-q28', '有');
  type('wb2-l1-w2-q29', '已');
  type('wb2-l1-w2-q30', '那');
  assert.ok(!wSubmit().disabled, 'writing submit unlocks at 6/6 (typing updates the bar without a re-render)');
  wSubmit().click();
  assert.match(document.getElementById('wb-sec-writing').textContent, /Kết quả phần viết: 6\/6/);
});

// ---- Lesson 2: same sections, a flow per kind family ----
await route('lesson/hsk2-l02/exercises');
await tick(); await tick();

test('lesson 2 renders 30 items and grades reading/writing picks (D41)', () => {
  const rd = document.getElementById('wb-sec-reading');
  const wr = document.getElementById('wb-sec-writing');
  assert.equal($$('.wb-item:not(.wb-example)', rd).length, 14, '14 reading questions');
  assert.equal($$('.wb-item:not(.wb-example)', wr).length, 6, '6 writing questions');
  rpick('wb2-l2-r1-q12', 'B');
  $$('[data-wbr-check="wb2-l2-r1-q12"]')[0].click();
  assert.match(item('wb2-l2-r1-q12').textContent, /Đúng\./);
  wpick('wb2-l2-w1-q26', 'A');
  $$('[data-wbw-check="wb2-l2-w1-q26"]')[0].click();
  assert.match(item('wb2-l2-w1-q26').textContent, /Đúng\./);
  assert.ok(item('wb2-l2-w1-q26').textContent.includes('教室'), 'completed word 教室 revealed');
  type('wb2-l2-w2-q29', '间');
  $$('[data-wbw-check="wb2-l2-w2-q29"]')[0].click();
  assert.match(item('wb2-l2-w2-q29').textContent, /Đúng\./);
});
