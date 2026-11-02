// D24 (Hoa 2026-11-02): Part A — long system/meta text is folded, not shown by
// default; point-of-use hints stay short. Part B — tap-to-lookup pilot on
// Lesson 8 reading surfaces only, driven by the project's curated lexicon.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { JSDOM } from 'jsdom';
import { segmentZh } from '../src/lib.js';
const content = JSON.parse(readFileSync(new URL('../data/content.json', import.meta.url), 'utf8'));
const l8 = content.additionalLessons.find((c) => c.lessonId === 'hsk1-l08');

test('segmentZh: longest match wins, punctuation grouped, unknown stays single', () => {
  const dict = new Map([['医生', 1], ['胡医生', 1], ['这只', 1], ['小猫', 1], ['在', 1], ['医院', 1], ['工作', 1]]);
  assert.deepEqual(segmentZh('胡医生', dict).map((t) => t.text), ['胡医生']);
  assert.deepEqual(segmentZh('这只小猫。', dict).map((t) => t.text), ['这只', '小猫', '。']);
  assert.deepEqual(segmentZh('在医院工作', dict).map((t) => t.text), ['在', '医院', '工作']);
  const unk = segmentZh('龘', dict);
  assert.equal(unk[0].entry, null);
});

test('lookup data: required pilot cases resolve from project-curated data', () => {
  const prep = new Map();
  for (const c of content.additionalLessons) for (const w of c.prepWords) if (!prep.has(w.zh)) prep.set(w.zh, w);
  const extras = new Map(l8.lookup.extras.map((e) => [e.zh, e]));
  const get = (zh) => extras.get(zh) || prep.get(zh);
  assert.equal(get('医院').pinyin, 'yīyuàn'); assert.equal(get('医院').hanViet, 'Y VIỆN'); assert.match(get('医院').vi, /bệnh viện/);
  assert.equal(get('医生').pinyin, 'yīshēng'); assert.match(get('医生').vi, /bác sĩ/);
  assert.equal(get('只').pinyin, 'zhī'); assert.match(get('只').hanVietNoteVi, /zhǐ/);
  assert.equal(get('漂亮').pinyin, 'piàoliang'); assert.equal(get('漂亮').hanViet, 'PHIẾU LƯỢNG');
  assert.equal(get('胡医生').pinyin, 'Hú yīshēng');
  assert.ok(l8.lookup.phrases.some((x) => x.zh === '在医院工作'));
  assert.equal(extras.get('两').hanViet, null); // honest unverified state, not a guess
  for (const e of [...l8.lookup.extras, ...l8.lookup.phrases]) assert.equal(e.status, 'verified-editorial');
});

// ---- DOM flow ---------------------------------------------------------------
const dom = new JSDOM(readFileSync(new URL('../index.html', import.meta.url), 'utf8'), { url: 'https://example.test/HSK3.0/' });
for (const k of ['window', 'document', 'location', 'localStorage', 'FormData']) globalThis[k] = dom.window[k];
Object.defineProperty(globalThis, 'navigator', { value: dom.window.navigator, configurable: true });
window.scrollTo = () => {};
window.scrollBy = () => {};
window.HTMLElement.prototype.scrollIntoView = () => {};
globalThis.requestAnimationFrame = (fn) => { fn(); return 0; };
class TestAudio extends EventTarget {
  constructor() { super(); this.paused = true; this.ended = false; this.duration = 500; this.currentTime = 0; this.readyState = 1; }
  async play() { this.paused = false; this.dispatchEvent(new Event('play')); }
  pause() { this.paused = true; this.dispatchEvent(new Event('pause')); }
}
globalThis.Audio = TestAudio;
globalThis.fetch = async () => ({ ok: true, json: async () => structuredClone(content) });
await import('../src/app.js');
const tick = () => new Promise((r) => setTimeout(r, 10));
const route = async (h) => { location.hash = '#/' + h; await tick(); await tick(); };
const $ = (s) => document.querySelector(s);
const $$ = (s) => [...document.querySelectorAll(s)];
const tokBtn = (zh) => $$(`[data-tok="${zh}"]`)[0];

test('Part A: the long self-check system note is folded under "Cách làm bài", peek hint sits at the button', async () => {
  await route('lesson/hsk1-l08/exercises');
  const fold = $('#extra-practice details.info-fold');
  assert.ok(fold, 'info fold exists');
  assert.equal(fold.open, false, 'fold is closed by default');
  assert.match(fold.querySelector('summary').textContent, /Cách làm bài/);
  assert.match(fold.textContent, /không làm lộ đáp án trước khi chấm/);
  assert.equal($('#extra-practice > p.support-note'), null, 'no open yellow note paragraph');
  assert.match(document.body.textContent, /Xem trước sẽ được ghi nhận/);
});

test('lookup: dialogue tokens open the popover with verified data (医院, 只, 胡医生 components)', async () => {
  await route('lesson/hsk1-l08/reader?passage=l08-dialogue-3');
  tokBtn('医院').click(); await tick();
  const pop = $('#lookup-pop');
  assert.equal(pop.hidden, false);
  assert.match(pop.textContent, /yīyuàn/);
  assert.match(pop.textContent, /Y VIỆN/);
  assert.match(pop.textContent, /bệnh viện/);
  assert.match(pop.textContent, /giọng máy/);
  pop.querySelector('[data-lk-close]').click(); await tick();
  assert.equal(pop.hidden, true);
  await route('lesson/hsk1-l08/knowledge');
  const hu = tokBtn('胡医生');
  assert.ok(hu, '胡医生 is a single token (tip example)');
  hu.click(); await tick();
  assert.match(pop.textContent, /Hú yīshēng/);
  const chip = [...pop.querySelectorAll('[data-tok]')].find((b) => b.dataset.tok === '医生');
  assert.ok(chip, 'component chip for 医生 exists');
  chip.click(); await tick();
  assert.match(pop.textContent, /yīshēng/);
  assert.match(pop.textContent, /bác sĩ/);
  document.dispatchEvent(new window.KeyboardEvent('keydown', { key: 'Escape', bubbles: true })); await tick();
  assert.equal($('#lookup-pop').hidden, true);
});

test('lookup: 只 shows the measure-word reading of this lesson; 两 honestly lacks a verified Hán–Việt', async () => {
  await route('lesson/hsk1-l08/reader?passage=l08-dialogue-1');
  tokBtn('只').click(); await tick();
  const pop = $('#lookup-pop');
  assert.match(pop.textContent, /zhī/);
  assert.match(pop.textContent, /lượng từ/);
  pop.querySelector('[data-lk-close]').click();
  await route('lesson/hsk1-l08/reader?passage=l08-dialogue-2');
  tokBtn('两').click(); await tick();
  assert.match(pop.textContent, /liǎng/);
  assert.match(pop.textContent, /Chưa có dữ liệu đã kiểm chứng/);
  pop.querySelector('[data-lk-close]').click();
});

test('lookup: knowledge example tokens work （小猫） and quick-check stems stay untokenized', async () => {
  await route('lesson/hsk1-l08/knowledge');
  const cat = $$('[data-tok="小猫"]')[0];
  assert.ok(cat, '小猫 token in a knowledge example');
  cat.click(); await tick();
  assert.match($('#lookup-pop').textContent, /TIỂU MIÊU/);
  $('#lookup-pop [data-lk-close]').click();
  assert.equal($$('[data-quick-check] [data-tok]').length, 0, 'no lookup inside the try-it quiz');
});

test('lookup: phrase mode — curated phrase resolves whole, unknown span lists components', async () => {
  await route('lesson/hsk1-l08/reader?passage=l08-dialogue-3');
  const s12 = $('#l08-s12');
  const phraseBtn = s12.querySelector('[data-phrase-btn]');
  assert.ok(phraseBtn);
  phraseBtn.click(); await tick();
  const wrap = s12.querySelector('[data-tok-wrap]');
  const pick = (zh) => [...wrap.querySelectorAll('[data-tok]')].find((b) => b.dataset.tok === zh);
  pick('在').click(); await tick();
  pick('工作').click(); await tick();
  $('.phrase-bar [data-phrase-confirm]').click(); await tick();
  const pop = $('#lookup-pop');
  assert.match(pop.textContent, /làm việc ở bệnh viện/);
  pop.querySelector('[data-lk-close]').click();
  // span without a curated entry: 我爸爸
  phraseBtn.click(); await tick();
  pick('我').click(); await tick();
  pick('爸爸').click(); await tick();
  $('.phrase-bar [data-phrase-confirm]').click(); await tick();
  assert.match(pop.textContent, /Chưa có giải thích cho cả cụm/);
  pop.querySelector('[data-lk-close]').click();
});

test('lookup: never wired into exercises; lessons not yet standardized stay untouched', async () => {
  await route('lesson/hsk1-l08/exercises');
  assert.equal($$('#main [data-tok]').length, 0);
  await route('lesson/hsk1-l02/reader');
  assert.equal($$('#main [data-tok]').length, 0); // lessons not yet standardized keep plain text
  await route('lesson/hsk1-l08/apply');
  assert.ok($$('#main [data-tok]').length > 0, 'speaking samples are tokenized');
});
