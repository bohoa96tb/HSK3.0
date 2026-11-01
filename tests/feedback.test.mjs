// User feedback on a real Android device (2026-11-01) → D20:
// 1. Long non-lesson texts (the exercise-set note, the prep study tip)
//    are collapsed behind a summary instead of filling the screen.
// 2. Short units (prep words, knowledge examples, exercise options)
//    are pronounced by the device's speech synthesis — no segment is
//    cut from a book track (vocab tracks read each word twice, two
//    voices; a cut sounds unnatural and leaked the second reading).
//    Dialogue sentences keep their book-audio segment buttons.
// 3. Picture options form a two-column grid at every width.
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
const audios = [];
class TestAudio extends EventTarget {
  constructor() { super(); this.paused = true; this.ended = false; this.duration = 400; this.currentTime = 0; this.readyState = 1; audios.push(this); }
  async play() { this.paused = false; this.dispatchEvent(new Event('play')); }
  pause() { this.paused = true; this.dispatchEvent(new Event('pause')); }
}
globalThis.Audio = TestAudio;
globalThis.fetch = async () => ({ ok: true, json: async () => structuredClone(content) });
localStorage.setItem('hsk30.progress.v1', JSON.stringify({ schemaVersion: 1, learningRevision: 'textbook-pilot-v2', contentRevision: 'x' }));
await import('../src/app.js');
const tick = () => new Promise((r) => setTimeout(r, 10));
await tick();
async function route(path) { location.hash = '#/' + path; await tick(); }
const $ = (s) => document.querySelector(s);
const $$ = (s) => [...document.querySelectorAll(s)];

test('prep words use device TTS speakers; no segment buttons or missing-audio markers', async () => {
  await route('lesson/hsk1-l08/prep');
  assert.equal($$('.word-grid [data-speak]').length, 0);
  assert.equal($$('.word-grid .no-audio').length, 0);
  const tts = $$('.word-grid [data-tts]');
  assert.equal(tts.length, 24);
  assert.equal(tts[0].dataset.tts, '房间');
  const tip = $('details.study-tip');
  assert.ok(tip && !tip.open, 'study tip collapsed');
  assert.match(tip.textContent, /giọng đọc tiếng Trung có sẵn của trình duyệt\/thiết bị/);
});

test('knowledge examples use TTS; dialogue sentences keep book segments', async () => {
  await route('lesson/hsk1-l08/knowledge');
  assert.ok($$('.example [data-tts]').length > 0);
  assert.equal($$('.example [data-speak]').length, 0);
  await route('lesson/hsk1-l08/reader');
  assert.ok($$('.sentence [data-speak]').length > 0, 'sentences keep segment buttons');
  assert.equal($$('.sentence [data-tts]').length, 0);
});

test('exercise options use TTS; the set note is collapsed', async () => {
  await route('lesson/hsk1-l08/exercises');
  const note = $('details.set-note');
  assert.ok(note && !note.open, 'set note collapsed behind a summary');
  assert.match(note.querySelector('summary').textContent, /Ghi chú về bộ câu hỏi/);
  assert.ok($('.option [data-tts]'), 'hanzi option has a TTS speaker');
  assert.equal($$('.option [data-speak]').length, 0);
  const set = content.additionalLessons.find((l) => l.lessonId === 'hsk1-l08').exerciseSet;
  const redup = set.items.find((i) => i.id.includes('redup'));
  assert.ok(redup.options.every((o) => !/\p{Script=Han}/u.test(o.zh)), 'redup options are pinyin strings (no TTS by design)');
});

test('clicking an option TTS speaker starts no book audio and selects nothing', async () => {
  await route('lesson/hsk1-l08/exercises');
  const before = audios.map((a) => a.src || '');
  $('.option [data-tts]').click(); await tick();
  assert.deepEqual(audios.map((a) => a.src || ''), before);
  assert.equal(document.querySelector('input[name="opt"]:checked'), null);
});

test('picture options and speaking pictures are two-column at phone widths (CSS contract)', async () => {
  const css = readFileSync(new URL('../assets/styles.css', import.meta.url), 'utf8');
  assert.match(css, /#ex-form:has\(\.option-has-pic\) \{ display: grid; grid-template-columns: 1fr 1fr;/);
  assert.doesNotMatch(css, /@media \(min-width: 560px\) \{\s*#ex-form:has\(\.option-has-pic\)/);
  assert.doesNotMatch(css, /\.picture-practice-grid \{ grid-template-columns: 1fr; \}/);
  assert.doesNotMatch(css, /\.option-has-pic \.option-pic img \{[^}]*max-width: 230px/);
});

test('speakText fails soft where speechSynthesis is unavailable', async () => {
  const player = await import('../src/player.js');
  assert.equal(typeof player.speakText, 'function');
  assert.equal(player.speakText('你好'), false);
});

test('knowledge speakers exist only for hanzi examples (L1 tone placeholders, L3 pinyin drills get none)', async () => {
  await route('lesson/hsk1-l01/knowledge');
  const toneCard = [...document.querySelectorAll('.kp-card')].find((c) => c.textContent.includes('thanh điệu') || c.querySelector('.example'));
  const examples = $$('.example');
  const dashExamples = examples.filter((e) => e.querySelector('.zh-sentence')?.textContent.trim() === '—');
  assert.ok(dashExamples.length >= 4, 'L1 tone placeholders render');
  for (const e of dashExamples) assert.equal(e.querySelector('[data-tts]'), null, 'no speaker for a dash placeholder');
  await route('lesson/hsk1-l03/knowledge');
  const drill = $$('.example').filter((e) => /^[a-zāáǎàēéěèīíǐìōóǒòūúǔùǖǘǚǜü ]+$/.test(e.querySelector('.zh-sentence')?.textContent.trim() || ''));
  assert.ok(drill.length >= 4, 'L3 pinyin-drill examples render');
  for (const e of drill) assert.equal(e.querySelector('[data-tts]'), null, 'no TTS for Latin pinyin drills');
  assert.ok($('.example [data-tts]'), 'hanzi examples in L3 keep their speaker');
});

test('speakText positive path: cancels, picks a zh voice, speaks the unit text', async () => {
  const spoken = [];
  let cancelled = 0;
  window.speechSynthesis = {
    cancel() { cancelled += 1; },
    getVoices: () => [{ lang: 'en-US', name: 'en' }, { lang: 'zh-CN', name: 'zh' }],
    speak(u) { spoken.push(u); },
  };
  globalThis.SpeechSynthesisUtterance = class { constructor(text) { this.text = text; } };
  const player = await import('../src/player.js');
  assert.equal(player.speakText('房间'), true);
  assert.equal(cancelled, 1);
  assert.equal(spoken.length, 1);
  assert.equal(spoken[0].text, '房间');
  assert.equal(spoken[0].lang, 'zh-CN');
  assert.equal(spoken[0].voice?.lang, 'zh-CN');
  delete window.speechSynthesis;
});

test('option TTS text strips dialogue labels and slashes', async () => {
  await route('lesson/hsk1-l01/exercises');
  const btns = $$('.option [data-tts]').map((b) => b.dataset.tts);
  assert.ok(btns.length > 0);
  for (const t of btns) { assert.doesNotMatch(t, /[A-D][:：]/); assert.doesNotMatch(t, /\//); }
});
