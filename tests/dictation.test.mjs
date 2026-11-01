import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { JSDOM } from 'jsdom';
import { parsePinyin, gradeDictationCell, gradeDictation, migrateProgress } from '../src/lib.js';
const content = JSON.parse(readFileSync(new URL('../data/content.json', import.meta.url)));
const byId = {};
for (const c of [content.pilot, ...content.additionalLessons]) for (const t of c.selfCheckTasks) byId[t.id] = t;

test('all six dictation tasks carry cross-checked answers consistent with the listening script', () => {
  const ids = ['st-01', 'st-02', 'st-03', 'st-l02-01', 'st-l02-02', 'st-l02-03'];
  let cells = 0;
  for (const id of ids) {
    const t = byId[id];
    assert.equal(t.answerStatus, 'verified-editorial', id);
    assert.equal(t.answers.length, t.prompts.length, id);
    assert.equal(t.scriptSyllables.length, t.prompts.length, id);
    assert.ok(t.audioSegment.start >= 0 && t.audioSegment.end > t.audioSegment.start, id);
    cells += t.prompts.length;
    const r = gradeDictation(t, t.scriptSyllables);
    assert.equal(r.correct, t.prompts.length, `${id}: the read syllables themselves must grade fully correct`);
  }
  assert.equal(cells, 78);
  // The disputed cell: print and script both say ěn / hěn, not ēn.
  assert.equal(byId['st-01'].prompts[9], '__ ěn');
  assert.equal(byId['st-01'].answers[9], 'h');
  assert.equal(byId['st-01'].scriptSyllables[9], 'hěn');
  assert.ok(!JSON.stringify(content).includes('__ ēn'));
  // Picture answers now cite the reposted answer key as corroboration.
  for (const c of [content.pilot, ...content.additionalLessons]) {
    for (const item of c.exerciseSet.items) assert.match(item.answerEvidence, /Scribd/);
  }
});

test('parsePinyin handles tone marks, tone numbers, case and the v convention', () => {
  assert.deepEqual(parsePinyin('Lǎo'), { base: 'lao', tone: 3 });
  assert.deepEqual(parsePinyin('lao3'), { base: 'lao', tone: 3 });
  assert.deepEqual(parsePinyin(' lao '), { base: 'lao', tone: 0 });
  assert.deepEqual(parsePinyin('nǚ'), { base: 'nü', tone: 3 });
  assert.deepEqual(parsePinyin('nv3'), { base: 'nü', tone: 3 });
  assert.deepEqual(parsePinyin('nu:3'), { base: 'nü', tone: 3 });
});

test('initial mode grades only the initial, but a full syllable must be exact', () => {
  const t = byId['st-01']; // cell 10: syllable hěn, answer h
  assert.equal(gradeDictationCell(t, 9, 'h').correct, true);
  assert.equal(gradeDictationCell(t, 9, 'H').correct, true);
  assert.equal(gradeDictationCell(t, 9, 'hěn').correct, true);
  assert.equal(gradeDictationCell(t, 9, 'hen3').correct, true);
  assert.equal(gradeDictationCell(t, 9, 'hēn').correct, false); // right initial, wrong syllable tone
  assert.equal(gradeDictationCell(t, 9, 'g').correct, false);
  assert.equal(gradeDictationCell(t, 9, 'ha').correct, false);
  assert.equal(gradeDictationCell(t, 0, '').graded, false);
  const l2 = byId['st-l02-01']; // j/q/x initials
  assert.equal(gradeDictationCell(l2, 0, 'q').correct, true);
  assert.equal(gradeDictationCell(l2, 0, 'qián').correct, true);
  assert.equal(gradeDictationCell(l2, 0, 'j').correct, false);
});

test('final mode requires the tone and never equates u with ü outside j/q/x', () => {
  const t = byId['st-02']; // cell 2: syllable hěn, answer ěn
  assert.equal(gradeDictationCell(t, 1, 'ěn').correct, true);
  assert.equal(gradeDictationCell(t, 1, 'hěn').correct, true);
  assert.equal(gradeDictationCell(t, 1, 'en3').correct, true);
  assert.equal(gradeDictationCell(t, 1, 'en').correct, false); // tone missing
  assert.equal(gradeDictationCell(t, 1, 'ēn').correct, false); // wrong tone
  assert.equal(gradeDictationCell(t, 1, 'ěn'.replace('ě', 'e')).correct, false);
  const l2 = byId['st-l02-02']; // cell 6: xué, answer ué — after x, u counts as ü
  assert.equal(gradeDictationCell(l2, 5, 'ué').correct, true);
  assert.equal(gradeDictationCell(l2, 5, 'xué').correct, true);
  assert.equal(gradeDictationCell(l2, 5, 'üé').correct, true); // ü spelling with tone is fine after x
  assert.equal(gradeDictationCell(l2, 5, 'ué'.replace('é', 'e')).correct, false);
  // A strict ü case: expected final ǚ under a non-j/q/x initial must reject plain u.
  const fake = { answerStatus: 'verified-editorial', gradingMode: 'final', prompts: ['n __'], scriptSyllables: ['nǚ'], answers: ['ǚ'] };
  assert.equal(gradeDictationCell(fake, 0, 'ǚ').correct, true);
  assert.equal(gradeDictationCell(fake, 0, 'nǚ').correct, true);
  assert.equal(gradeDictationCell(fake, 0, 'ǔ').correct, false);
  assert.equal(gradeDictationCell(fake, 0, 'nǔ').correct, false);
});

test('tone mode accepts marks, numbers or a bare digit, and rejects missing tones', () => {
  const t = byId['st-03']; // cell 1: lao -> 3
  assert.equal(gradeDictationCell(t, 0, 'lǎo').correct, true);
  assert.equal(gradeDictationCell(t, 0, 'lao3').correct, true);
  assert.equal(gradeDictationCell(t, 0, '3').correct, true);
  assert.equal(gradeDictationCell(t, 0, 'lao').correct, false);
  assert.equal(gradeDictationCell(t, 0, 'lao2').correct, false);
  assert.equal(gradeDictationCell(t, 0, 'kan3').correct, false); // wrong syllable
  const unv = { answerStatus: 'unverified', prompts: ['x'], scriptSyllables: ['x'], answers: null };
  assert.equal(gradeDictationCell(unv, 0, 'x').graded, false);
});

test('migration keeps old self-assessment history and adds an empty dictation store', () => {
  const m = migrateProgress({ schemaVersion: 1, selfChecks: { 'st-03': { rating: 'slow', at: '2026-10-31T00:00:00Z' } }, attempts: [{ exerciseId: 'wb-picture-1', correct: true }] });
  assert.equal(m.selfChecks['st-03'].rating, 'slow');
  assert.deepEqual(m.dictation, {});
  assert.equal(m.attempts.length, 1);
});

// ---- DOM flow ---------------------------------------------------------------
const dom = new JSDOM(readFileSync(new URL('../index.html', import.meta.url), 'utf8'), { url: 'https://example.test/HSK3.0/' });
for (const k of ['window', 'document', 'location', 'localStorage', 'FormData']) globalThis[k] = dom.window[k];
Object.defineProperty(globalThis, 'navigator', { value: dom.window.navigator, configurable: true });
window.scrollTo = () => {};
window.HTMLElement.prototype.scrollIntoView = () => {};
const audios = [];
class TestAudio extends EventTarget {
  constructor() { super(); this.paused = true; this.ended = false; this.duration = 400; this.currentTime = 0; this.readyState = 1; audios.push(this); }
  async play() { this.paused = false; this.dispatchEvent(new Event('play')); }
  pause() { this.paused = true; this.dispatchEvent(new Event('pause')); }
}
globalThis.Audio = TestAudio;
globalThis.fetch = async () => ({ ok: true, json: async () => structuredClone(content) });
localStorage.setItem('hsk30.progress.v1', JSON.stringify({ schemaVersion: 1, learningRevision: 'textbook-pilot-v2', contentRevision: 'x', selfChecks: { 'st-03': { rating: 'forgot', at: '2026-10-31T00:00:00Z' } } }));
await import('../src/app.js');
const tick = () => new Promise((r) => setTimeout(r, 10));
await tick();
async function route(path) { location.hash = '#/' + path; await tick(); }
const $ = (s) => document.querySelector(s);
const state = () => JSON.parse(localStorage.getItem('hsk30.progress.v1'));
function setDraft(taskId, i, value) { const el = document.querySelector(`[data-draft="${taskId}:${i}"]`); el.value = value; el.dispatchEvent(new window.Event('input', { bubbles: true })); }

test('dictation UI: peek is recorded, checking locks first score, redo keeps it, review queue gets the wrong cell', async () => {
  await route('lesson/hsk1-l01/exercises');
  assert.equal(state().selfChecks['st-03'].rating, 'forgot'); // old history untouched
  // Peek at the script before answering -> recorded
  document.querySelector('[data-peek-dict="st-03"]').click(); await tick();
  assert.equal(state().dictation['st-03'].peeked, true);
  assert.match($('#st-03').textContent, /Lời đọc của bài/);
  // Fill: cell 0 correct via tone number, cell 1 wrong tone, leave the rest empty
  setDraft('st-03', 0, 'lao3');
  setDraft('st-03', 1, 'neng4');
  document.querySelector('[data-check-dict="st-03"]').click(); await tick();
  let d = state().dictation['st-03'];
  assert.equal(d.first['0'], true);
  assert.equal(d.first['1'], false);
  assert.equal(Object.keys(d.first).length, 2); // empty cells not graded, not counted wrong
  assert.ok(state().reviewItems['dict-st-03:1']);
  assert.match($('#st-03').textContent, /Điểm lần đầu: 1\/2/);
  assert.match($('#st-03').textContent, /Đáp án: neng2/);
  // Redo the wrong cell correctly: first score must not change
  setDraft('st-03', 1, 'néng');
  document.querySelector('[data-redo-dict="st-03"]').click(); await tick();
  d = state().dictation['st-03'];
  assert.equal(d.first['1'], false);
  assert.equal(d.tries['1'], 2);
  assert.equal(state().reviewItems['dict-st-03:1'].lastResult, 'correct');
  // Drafts survive navigation (refresh equivalent)
  await route('lesson/hsk1-l01/summary');
  assert.match($('#main').textContent, /Nghe–viết đã chấm/);
  await route('lesson/hsk1-l01/exercises');
  assert.equal(document.querySelector('[data-draft="st-03:0"]').value, 'lao3');
});

test('segment play seeks to the exercise segment and stops at its end', async () => {
  await route('lesson/hsk1-l01/exercises');
  const btn = document.querySelector('#st-01 [data-play-task]');
  assert.match(btn.textContent, /Nghe đoạn của bài này/);
  btn.click(); await tick();
  const a = audios[0];
  assert.match(a.src, /lesson-01\/01-2\.mp3$/);
  a.onloadedmetadata && a.onloadedmetadata();
  assert.equal(a.currentTime, 106.9);
  assert.equal(a.paused, false);
  a.currentTime = 188; // beyond segment end 187.6
  a.dispatchEvent(new Event('timeupdate')); // Node Event: the mock audio is a Node EventTarget
  assert.equal(a.paused, true);
});
