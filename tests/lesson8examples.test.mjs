// D25 (Hoa 2026-11-02): full example audit of Lesson 8 against the printed
// books + compact knowledge UI. Data: the three Xiaoyu Classroom read-aloud
// sets stay verbatim; the positional list gains 外边; example notes no longer
// repeat a source suffix (provenance lives in sourceRefs); the pair-work
// sample dialogue is a full example block. UI: examples use the compact
// ex-row/ex-meta layout and the meaning follows the Nghĩa toggle.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { JSDOM } from 'jsdom';
const content = JSON.parse(readFileSync(new URL('../data/content.json', import.meta.url), 'utf8'));
const l8 = content.additionalLessons.find((c) => c.lessonId === 'hsk1-l08');
const kp = (id) => l8.knowledgePoints.find((k) => k.id === id);

test('audit data: classroom read-aloud sets are verbatim and the positional list is complete', () => {
  assert.deepEqual(kp('kp-hsk1-l08-positional').examples.map((e) => e.zh), ['房间里有一只小猫。', '我们去书店外吧。', '小雪的手机在桌子上呢。']);
  assert.deepEqual(kp('kp-hsk1-l08-zai').examples.map((e) => e.zh), ['我在学校吃午饭。', '他爸爸在医院工作。', '你在哪儿买菜？']);
  assert.deepEqual(kp('kp-hsk1-l08-neng').examples.map((e) => e.zh), ['下午两点你能到吗？', '爸爸能去。', '我不能去学校吃午饭。']);
  assert.match(kp('kp-hsk1-l08-positional').pattern, /外边/);
  assert.match(kp('kp-hsk1-l08-positional').explanationVi, /上、下、里、外（外边）、前、后/);
});

test('audit data: example notes carry the translation only, no repeated source suffix', () => {
  for (const k of l8.knowledgePoints) for (const e of k.examples || []) {
    assert.doesNotMatch(e.noteVi, /câu luyện đọc của sách|ví dụ của sách|câu cuối Hội thoại|câu mở đầu Hội thoại/, `${k.id} ${e.zh}`);
  }
  assert.equal(kp('kp-hsk1-l08-positional').examples[0].noteVi, 'Trong phòng có một con mèo nhỏ.');
});

test('audit data: pair-work sample is the full book example dialogue', () => {
  const t1 = l8.apply.tasks.find((t) => t.id === 'speak-l08-1');
  assert.equal(t1.sampleZh, '你的手机在哪儿？ — 我的手机在桌子上。你的手机呢？ — 我的手机在家里。');
  assert.match(t1.sourceNoteVi, /trang 060/);
});

// ---- DOM --------------------------------------------------------------------
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

test('compact UI: knowledge examples use ex-row/ex-meta and the meaning follows the toggle class', async () => {
  await route('lesson/hsk1-l08/knowledge');
  const ex = $('.grammar-card .example');
  assert.ok(ex.querySelector('.ex-row [data-tok-wrap]'), 'zh row with lookup tokens');
  assert.ok(ex.querySelector('.ex-meta .pinyin.tog-pinyin-sent'));
  assert.ok(ex.querySelector('.ex-meta .ex-note.tog-vi-sent'), 'meaning carries the sentence toggle class');
  assert.ok(ex.querySelector('.ex-meta [data-phrase-btn]'), 'phrase button sits in the meta row');
  // lookup still works from the compact layout
  ex.querySelector('[data-tok="小猫"]').click(); await tick();
  assert.match($('#lookup-pop').textContent, /TIỂU MIÊU/);
  $('#lookup-pop [data-lk-close]').click();
});

test('compact UI: the folded third example is labelled as book examples', async () => {
  await route('lesson/hsk1-l08/knowledge');
  const folds = $$('.grammar-card details.study-tip summary').map((x) => x.textContent);
  assert.ok(folds.some((t) => /Xem thêm ví dụ của sách/.test(t)));
});

test('regression D25: phrase mode also starts from an example meta row', async () => {
  await route('lesson/hsk1-l08/knowledge');
  const zaiCard = document.querySelector('#kp-hsk1-l08-zai');
  const ex = [...zaiCard.querySelectorAll('.example')].find((x) => x.textContent.includes('我在学校吃午饭'));
  ex.querySelector('[data-phrase-btn]').click(); await tick();
  const wrap = ex.querySelector('[data-tok-wrap]');
  const pick = (zh) => [...wrap.querySelectorAll('[data-tok]')].find((b) => b.dataset.tok === zh);
  pick('在').click(); await tick();
  pick('午饭').click(); await tick();
  document.querySelector('.phrase-bar [data-phrase-confirm]').click(); await tick();
  assert.match(document.querySelector('#lookup-pop').textContent, /ăn cơm trưa ở trường/);
  document.querySelector('#lookup-pop [data-lk-close]').click();
});
