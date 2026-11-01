import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { JSDOM } from 'jsdom';
const content = JSON.parse(readFileSync(new URL('../data/content.json', import.meta.url)));
const lessons = [content.pilot, ...content.additionalLessons];

// ---- Data: Han-Viet coverage + context-correct readings --------------------
test('han-viet: all 27 prep words carry a verified, context-checked reading', () => {
  const words = lessons.flatMap((c) => c.prepWords);
  assert.equal(words.length, 27);
  for (const w of words) {
    assert.equal(w.hanVietStatus, 'verified-editorial', w.id);
    assert.ok(w.hanViet && w.hanViet === w.hanViet.toUpperCase(), w.id);
  }
  const byZh = Object.fromEntries(words.map((w) => [w.zh, w.hanViet]));
  assert.equal(byZh['高兴'], 'CAO HỨNG'); // 兴 = hứng here, not hưng
  assert.equal(byZh['什么'], 'THẬM MA'); // 什 = thậm in 什么， not thập
  assert.equal(byZh['很'], 'NGẬN');
  assert.equal(byZh['叫'], 'KHIẾU');
  assert.equal(byZh['您'], 'NÂM');
  assert.equal(byZh['没关系'], 'MỘT QUAN HỆ'); // 没 = một
  assert.equal(byZh['们'], 'MÔN');
  assert.equal(byZh['大家'], 'ĐẠI GIA');
  assert.ok(words.find((w) => w.zh === '大家').hanVietNoteVi, 'misleading HV reading needs a short note');
  // Han-Viet is a prep-word field only: no sentence-level HV is generated.
  for (const c of lessons) for (const sen of c.reader.sentences) assert.equal(sen.hanViet, undefined);
});

test('exercise support data: every Chinese option has pinyin and Vietnamese meaning', () => {
  const options = lessons.flatMap((c) => c.exerciseSet.items.flatMap((i) => i.options.filter((o) => o.zh)));
  assert.equal(options.length, 25);
  for (const o of options) { assert.ok(o.pinyin, o.zh); assert.ok(o.vi, o.zh); }
});

// ---- DOM flow ---------------------------------------------------------------
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
const state = () => JSON.parse(localStorage.getItem('hsk30.progress.v1'));

test('prep bar: Pinyin / Nghĩa / Hán–Việt / A− / A+ each toggle only their own field, in place', async () => {
  await route('lesson/hsk1-l02/prep');
  const bar = $('.support-bar');
  for (const kind of ['pinyin', 'vi', 'hanviet', 'font-down', 'font-up']) assert.ok(bar.querySelector(`[data-support="${kind}"]`), kind);
  assert.equal(bar.textContent.includes('Thường'), false); // font level name is not in the main row
  const hvBtn = bar.querySelector('[data-support="hanviet"]');
  assert.equal(hvBtn.getAttribute('aria-pressed'), 'false'); // Han-Viet defaults OFF
  assert.equal($('#main').classList.contains('off-hv-prep'), true);
  const card = $('#l02w-13');
  assert.equal(card.querySelector('.hanviet').textContent, 'HV: CAO HỨNG');
  assert.ok(card.querySelector('.word-top [data-speak]') || card.querySelector('.word-top .no-audio'), 'speaker sits next to the hanzi');
  hvBtn.click(); await tick();
  assert.equal($('#l02w-13'), card); // same DOM node — nothing was re-rendered
  assert.equal($('#main').classList.contains('off-hv-prep'), false);
  assert.equal(state().settings.showHanVietPrep, true); // choice persists
  const viBtn = bar.querySelector('[data-support="vi"]');
  viBtn.click(); await tick();
  assert.equal($('#main').classList.contains('off-vi-prep'), true);
  assert.equal($('#main').classList.contains('off-hv-prep'), false); // HV unaffected
  assert.equal($('#main').classList.contains('off-pinyin-prep'), false); // pinyin unaffected
  // Guidance text is not a "meaning" field: the intro paragraph stays put.
  assert.ok([...document.querySelectorAll('p.muted')].some((p) => p.textContent.includes('mục từ xuất hiện')));
  viBtn.click(); await tick();
  assert.equal($('#main').classList.contains('off-vi-prep'), false);
});

test('regression (QA round 1): turning support ON from the dictation bar also records supportUsed', async () => {
  await route('lesson/hsk1-l01/exercises');
  assert.equal(state().settings.showPinyinExercises, false);
  const dictBar = $$('.support-bar').find((b) => b.querySelector('[data-scope="dictation"]'));
  dictBar.querySelector('[data-support="pinyin"]').click(); await tick();
  assert.equal(state().settings.showPinyinExercises, true);
  const ses = Object.values(state().exerciseSessions).find((x) => x.setId === content.pilot.exerciseSet.id);
  assert.equal(ses.supportUsed[content.pilot.exerciseSet.items[0].id], true);
  dictBar.querySelector('[data-support="pinyin"]').click(); await tick(); // restore OFF for later tests
  assert.equal(state().settings.showPinyinExercises, false);
});

test('exercises: pinyin/meaning apply uniformly to all options and support use is recorded separately', async () => {
  await route('lesson/hsk1-l02/exercises');
  const card = $('#exercise-card');
  assert.ok(card.querySelector('[data-support="pinyin"]'));
  assert.ok(card.querySelector('[data-support="vi"]'));
  const opts = $$('#exercise-card .option');
  assert.equal(opts.length, 4);
  assert.equal($$('#exercise-card .tog-pinyin-ex').length, 4); // every option, not only the correct one
  assert.equal($$('#exercise-card .tog-vi-ex').length, 4);
  // Speaker inside an option still does not select it.
  const speak = $('#exercise-card .option [data-speak]');
  speak.click(); await tick();
  assert.equal(document.querySelector('input[name="opt"]:checked'), null);
  // Turning pinyin ON records support for the current, unchecked question.
  card.querySelector('[data-support="pinyin"]').click(); await tick();
  assert.equal(state().settings.showPinyinExercises, true);
  const ses = Object.values(state().exerciseSessions).find((x) => x.setId === content.additionalLessons[0].exerciseSet.id);
  const itemId = content.additionalLessons[0].exerciseSet.items[0].id;
  assert.equal(ses.supportUsed[itemId], true);
  // Answer correctly (answer 3 per the print-visual check): the attempt is
  // stored with supportUsed=true, first-attempt history untouched elsewhere.
  document.querySelector('input[name="opt"][value="3"]').click();
  $('#ex-form button[type="submit"], #ex-form .btn.primary').click(); await tick();
  const att = state().attempts.find((a) => a.exerciseId === itemId);
  assert.ok(att); assert.equal(att.correct, true); assert.equal(att.supportUsed, true);
  assert.equal(att.hintUsed, false);
});

test('dictation: pinyin toggle reveals nothing before checking; the read syllable appears after checking', async () => {
  await route('lesson/hsk1-l01/exercises');
  const dictBar = $$('.support-bar').find((b) => b.dataset && b.querySelector('[data-scope="dictation"]'));
  assert.ok(dictBar, 'dictation block has its own support bar');
  assert.match(document.body.textContent, /không hiện trước khi chấm/);
  const taskEl = $('#st-01');
  assert.equal(taskEl.querySelector('.script-box'), null);
  dictBar.querySelector('[data-support="pinyin"]').click(); await tick();
  assert.equal(taskEl.querySelector('.script-box'), null); // still gated
  assert.equal(taskEl.textContent.includes('Đáp án:'), false); // no answer leaked
  const setDraft = (i, value) => { const el = document.querySelector(`[data-draft="st-01:${i}"]`); el.value = value; el.dispatchEvent(new window.Event('input', { bubbles: true })); };
  setDraft(0, 'd'); // dà -> initial d is correct
  document.querySelector('[data-check-dict="st-01"]').click(); await tick();
  const cell = document.querySelector('[data-draft="st-01:0"]').closest('label');
  assert.match(cell.textContent, /Lời đọc: dà/); // pinyin of the script now follows the ON toggle
  assert.equal(state().dictation['st-01'].first['0'], true);
});

test('mini player: compact, collapsible, closable, and measured insets are published', async () => {
  await route('lesson/hsk1-l01/reader?passage=tb-dialogue-1');
  document.querySelector('[data-play]').click(); await tick();
  const mini = $('#miniplayer');
  assert.equal(mini.classList.contains('hidden'), false);
  assert.ok($('#mini-collapse')); assert.ok($('#mini-close'));
  assert.ok(mini.querySelector('.mini-label').title.length > 0);
  assert.ok(document.documentElement.style.getPropertyValue('--chrome-bottom') !== '');
  $('#mini-collapse').click(); await tick();
  assert.equal(mini.classList.contains('mini-collapsed'), true);
  $('#mini-collapse').click(); await tick();
  assert.equal(mini.classList.contains('mini-collapsed'), false);
  $('#mini-close').click(); await tick();
  assert.equal(mini.classList.contains('hidden'), true);
});
