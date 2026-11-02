// D27: Lesson 1 brought up to the Lesson-8 standard (learning path, vocab
// grouped by dialogue incl. the proper noun the book lists separately,
// useWhen + try-it on the main points, summary points, tap-to-lookup).
// Content facts below come from the print audit of TB 001-004 / WB 001-004.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { JSDOM } from 'jsdom';
const content = JSON.parse(readFileSync(new URL('../data/content.json', import.meta.url), 'utf8'));
const l1 = content.pilot;

test('data: 12 new words + 1 proper noun, grouped by dialogue (2 / 7 / 4)', () => {
  assert.equal(l1.prepWords.filter((w) => !w.isProperName).length, 12);
  const proper = l1.prepWords.filter((w) => w.isProperName);
  assert.deepEqual(proper.map((w) => w.zh), ['王老师']);
  assert.equal(proper[0].hanViet, 'VƯƠNG LÃO SƯ');
  assert.deepEqual([1, 2, 3].map((g) => l1.prepWords.filter((w) => w.dialogueGroup === g).length), [2, 7, 4]);
  assert.deepEqual(l1.prepGroups.map((g) => g.trackId), ['trk-tb-l01-2', 'trk-tb-l01-4', 'trk-tb-l01-6']);
  for (const g of l1.prepGroups) assert.ok(l1.reader.audioTracks.some((t) => t.id === g.trackId), g.trackId);
  assert.match(l1.prepSummaryVi, /12 từ mới \+ 1 tên riêng/);
});

test('data: tongue twister from TB p.004 is present with its real track; tone groups complete (8)', () => {
  const tw = l1.knowledgePoints.find((k) => k.id === 'kp-hsk1-l01-twister');
  assert.ok(tw && tw.audioTrackId === 'trk-tb-l01-7');
  assert.deepEqual(tw.examples.map((e) => e.zh), ['妈妈种麻，我放马。', '马吃麻，妈骂马。']);
  assert.ok(l1.reader.audioTracks.some((t) => t.id === 'trk-tb-l01-7' && t.durationSec > 0));
  const tones = l1.knowledgePoints.find((k) => k.id === 'kp-hsk1-l01-tones');
  const groups = tones.examples.filter((e) => /nhóm âm tiết/.test(e.noteVi)).map((e) => e.pinyin.split(' ')[0]);
  assert.deepEqual(groups, ['mō', 'fū', 'dī', 'tāo', 'lōu', 'hān', 'pāng', 'gēn']);
  assert.ok(!/bằng 您/.test(l1.learningPath[1].descVi), 'Dialogue 1 has no 您 — that is Dialogue 2');
});

test('data: path, try-it on the 3 main points, summary points, lookup block', () => {
  assert.equal(l1.learningPath.length, 6);
  const main = l1.knowledgePoints.filter((k) => !String(k.kind).startsWith('foundation'));
  assert.equal(main.length, 3);
  for (const kp of main) {
    assert.ok(kp.useWhenVi, kp.id);
    assert.ok(kp.quickCheck && ['1', '2'].includes(kp.quickCheck.answer), kp.id);
  }
  assert.equal(l1.summaryPoints.length, 3);
  assert.ok(l1.lookup && l1.lookup.extras.some((e) => e.zh === '小语'));
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
localStorage.setItem('hsk30.progress.v1', JSON.stringify({ schemaVersion: 1, learningRevision: 'textbook-pilot-v2', contentRevision: 'x' }));
await import('../src/app.js');
const tick = () => new Promise((r) => setTimeout(r, 10));
await tick();
async function route(path) { location.hash = '#/' + path; await tick(); }
const $ = (s) => document.querySelector(s);
const $$ = (s) => [...document.querySelectorAll(s)];

test('intro shows the scenario path; its CTA never self-links (D26)', async () => {
  await route('lesson/hsk1-l01/intro');
  assert.match($('#main').textContent, /Lộ trình học bài này/);
  assert.match($('#main').textContent, /Chào cả lớp/);
  const cta = [...document.querySelectorAll('section.card')].find((x) => x.textContent.includes('Lộ trình học bài này'))?.querySelector('a.btn.primary.big');
  assert.equal(cta.getAttribute('href'), '#/lesson/hsk1-l01/prep');
});

test('prep renders 3 groups with honest counts and the proper noun card', async () => {
  await route('lesson/hsk1-l01/prep');
  const titles = $$('.vocab-group-title').map((h) => h.textContent.replace(/\s+/g, ' ').trim());
  assert.equal(titles.length, 3);
  assert.match(titles[0], /1 từ \+ 1 tên riêng/);
  assert.match(titles[1], /7 từ/);
  assert.match(titles[2], /4 từ/);
  assert.deepEqual($$('[data-play-vocab-track]').map((b) => b.dataset.playVocabTrack), ['trk-tb-l01-2', 'trk-tb-l01-4', 'trk-tb-l01-6']);
  assert.equal($$('.word-card').length, 13);
  assert.match($('#tbw-13').textContent, /Tên riêng/);
});

test('knowledge: 3 main points with Khi nào dùng and a working try-it', async () => {
  await route('lesson/hsk1-l01/knowledge');
  assert.match($('#main').textContent, /Ba điều cần nhớ/);
  const qc = $('[data-quick-check="kp-hsk1-l01-nin"]');
  assert.ok(qc, 'try-it present for 您');
  qc.querySelectorAll('[data-quick-opt]')[1].click(); await tick();
  assert.match(qc.querySelector('.quick-feedback').textContent, /Chưa đúng/);
  qc.querySelectorAll('[data-quick-opt]')[0].click(); await tick();
  assert.match(qc.querySelector('.quick-feedback').textContent, /Đúng rồi/);
});

test('lookup on Lesson 1 reading surfaces: every reader token resolves; exercises stay clean', async () => {
  await route('lesson/hsk1-l01/reader');
  const toks = $$('#main [data-tok]');
  assert.ok(toks.length >= 4, `tokens rendered (${toks.length})`);
  const xiaoyu = toks.find((b) => b.dataset.tok === '小语');
  xiaoyu.click(); await tick();
  assert.match($('#lookup-pop').textContent, /TIỂU NGỮ/);
  document.querySelector('#lookup-pop [data-lk-close]').click();
  const wang = toks.find((b) => b.dataset.tok === '王老师');
  assert.ok(wang, '王老师 is one token (longest match), not 王 + 老师');
  wang.click(); await tick();
  assert.match($('#lookup-pop').textContent, /VƯƠNG LÃO SƯ/);
  document.querySelector('#lookup-pop [data-lk-close]').click();
  await route('lesson/hsk1-l01/reader?passage=tb-dialogue-3');
  const toks3 = $$('#main [data-tok]').map((b) => b.dataset.tok);
  for (const want of ['同学', '们', '再见', '谢谢', '不客气']) assert.ok(toks3.includes(want), `dialogue 3 token ${want}`);
  await route('lesson/hsk1-l01/exercises');
  assert.equal($$('#main [data-tok]').length, 0);
});

test('summary shows the 3 main points', async () => {
  await route('lesson/hsk1-l01/summary');
  assert.match($('#main').textContent, /Ba điều chính đã học/);
  assert.match($('#main').textContent, /Chào lịch sự bằng 您/);
});

test('regression: Lesson 8 group-3 tag now counts the proper noun honestly', async () => {
  await route('lesson/hsk1-l08/prep');
  const titles = $$('.vocab-group-title').map((h) => h.textContent.replace(/\s+/g, ' ').trim());
  assert.match(titles[2], /6 từ \+ 1 tên riêng/);
});

test('apply: two role-play tasks with full dialogue samples and working lookup', async () => {
  await route('lesson/hsk1-l01/apply');
  assert.equal($$('.speak-task').length, 2);
  assert.match($('#main').textContent, /Đóng vai: chào cả lớp/);
  assert.match($('#speak-l01-2').textContent, /toàn bộ Hội thoại 3/);
  const tok = $$('#speak-l01-1 [data-tok]').find((b) => b.dataset.tok === '您');
  assert.ok(tok, 'samples are tokenized');
  tok.click(); await tick();
  assert.match($('#lookup-pop').textContent, /NÂM/);
  document.querySelector('#lookup-pop [data-lk-close]').click();
  $('[data-speak-done="speak-l01-1"]').click(); await tick();
  assert.equal($('[data-speak-done="speak-l01-1"]').getAttribute('aria-pressed'), 'true');
});
