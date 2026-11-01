import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { JSDOM } from 'jsdom';
import { gradeChoice, gradeDictationCell } from '../src/lib.js';
const content = JSON.parse(readFileSync(new URL('../data/content.json', import.meta.url)));
const l5 = content.additionalLessons.find((c) => c.lessonId === 'hsk1-l05');
const dom = new JSDOM(readFileSync(new URL('../index.html', import.meta.url), 'utf8'), { url: 'https://example.test/HSK3.0/' });
for (const k of ['window', 'document', 'location', 'localStorage', 'FormData']) globalThis[k] = dom.window[k];
Object.defineProperty(globalThis, 'navigator', { value: dom.window.navigator, configurable: true });
window.scrollTo = () => {};
class TestAudio extends EventTarget {
  constructor() { super(); this.paused = true; this.ended = false; this.duration = 10; this.currentTime = 0; this.readyState = 1; }
  async play() { this.paused = false; this.dispatchEvent(new Event('play')); }
  pause() { this.paused = true; this.dispatchEvent(new Event('pause')); }
}
globalThis.Audio = TestAudio;
globalThis.fetch = async () => ({ ok: true, json: async () => structuredClone(content) });
await import('../src/app.js');
const tick = () => new Promise((r) => setTimeout(r, 10));
await tick();
async function route(path) { location.hash = '#/' + path; await tick(); }
const $ = (s) => document.querySelector(s);

test('lesson 5 content matches the printed books: counts, pages, tracks, han-viet', () => {
  assert.ok(l5, 'additionalLessons must contain hsk1-l05');
  assert.equal(content.contentVersion, '20261101-lesson5-2');
  assert.equal(l5.prepWords.length, 22);
  for (const w of l5.prepWords) {
    assert.equal(w.hanVietStatus, 'verified-editorial', w.id);
    assert.ok(w.hanViet && w.hanViet === w.hanViet.toUpperCase(), w.id);
  }
  assert.equal(l5.prepWords.find((w) => w.zh === '号').hanViet, 'HÀO');
  assert.equal(l5.prepWords.find((w) => w.zh === '星期').hanViet, 'TINH KỲ');
  assert.equal(l5.prepWords.find((w) => w.zh === '做').hanViet, 'TỐ');
  assert.equal(l5.prepWords.find((w) => w.zh === '一些').hanViet, 'NHẤT TA');
  assert.equal(l5.prepWords.find((w) => w.zh === '菜').hanViet, 'THÁI');
  assert.equal(l5.knowledgePoints.length, 5);
  assert.equal(l5.knowledgePoints.filter((k) => k.kind !== 'foundation-pronunciation').length, 3);
  assert.equal(l5.reader.sentences.length, 14);
  assert.equal(l5.reader.passages.length, 3);
  assert.equal(l5.reader.audioTracks.length, 8);
  assert.deepEqual(l5.reader.audioTracks.filter((t) => t.id.startsWith('trk-tb')).map((t) => t.durationSec),
    [9.729, 13.143, 12.7, 23.464, 19.398, 18.408]);
  for (const g of l5.reader.passages) {
    const t = l5.reader.audioTracks.find((x) => x.id === g.audioTrackId);
    assert.equal(t.segments.length, g.sentenceIds.length, g.id);
    for (const s of t.segments) assert.equal(s.status, 'asr-draft');
  }
  for (const sen of l5.reader.sentences) {
    assert.equal(sen.transcriptStatus, 'print-verified');
    assert.ok(sen.sourceRefs[0].pdfPage >= 42 && sen.sourceRefs[0].pdfPage <= 49, sen.id);
  }
  // per-unit speakers: every prep and foundation word of lesson 5 has a segment
  assert.equal(l5.prepWords.filter((w) => w.audio).length, 22);
  assert.equal(l5.foundationWords.length, 10);
  assert.equal(l5.foundationWords.filter((w) => w.audio).length, 10);
  const lesson = content.lessons.find((l) => l.id === 'hsk1-l05');
  assert.equal(lesson.publicationStatus, 'pilot-ready');
  assert.deepEqual(lesson.grammarIds, l5.knowledgePoints.map((k) => k.id));
  assert.ok(existsSync(new URL('../' + l5.intro.contextImage.src, import.meta.url)));
});

test('lesson 5 text exercises: printed answers grade, stems render, review links fit', async () => {
  assert.equal(l5.exerciseSet.items.length, 9);
  assert.deepEqual(l5.exerciseSet.items.map((i) => i.answer), ['1', '3', '2', '3', '3', '4', '1', '5', '2']);
  const kpIds = new Set(content.additionalLessons.flatMap((c) => c.knowledgePoints.map((k) => k.id))
    .concat(content.pilot.knowledgePoints.map((k) => k.id)));
  for (const item of l5.exerciseSet.items) {
    assert.equal(item.answerStatus, 'verified-from-print');
    assert.ok(item.promptZh && item.promptPinyin, item.id);
    assert.equal(gradeChoice(item, item.answer).correct, true);
    assert.equal(gradeChoice(item, item.answer === '1' ? '2' : '1').correct, false);
    for (const o of item.options) assert.ok(o.pinyin && o.vi, item.id + '/' + o.id);
    for (const g of item.grammarIds) assert.ok(kpIds.has(g), item.id + ' -> ' + g);
  }
  await route('lesson/hsk1-l05/exercises');
  assert.ok($('.exercise-stem')?.textContent.includes('杨同乐') && $('.exercise-stem')?.textContent.includes('做饭'), 'the printed question stem renders');
  assert.ok(document.body.textContent.includes('Câu 1/9'));
});

test('lesson 5 choose-a-syllable task: syllable grading mode grades exactly', () => {
  const task = l5.selfCheckTasks.find((t) => t.id === 'st-l05-01');
  assert.equal(task.answerStatus, 'verified-editorial');
  assert.equal(task.gradingMode, 'syllable');
  assert.equal(task.prompts.length, 8);
  assert.deepEqual(task.conflictCells, [4]);
  assert.ok(task.conflictNoteVi.includes('jiǎ/xiǎ') && task.conflictNoteVi.includes('jiā'));
  task.scriptSyllables.forEach((syl, i) => {
    if (task.conflictCells.includes(i)) {
      // source-conflict cell: NO input is graded — not the script syllable,
      // not the printed pair member, not a tone number (D16).
      for (const inp of [syl, 'jiǎ', 'xiǎ', 'jia1', 'jia3', '']) {
        const r = gradeDictationCell(task, i, inp);
        assert.equal(r.graded, false, `conflict cell input ${inp}`);
        assert.equal(r.reason, 'source-conflict');
      }
      return;
    }
    assert.equal(gradeDictationCell(task, i, syl).correct, true, `cell ${i + 1} exact`);
    const numbered = syl.normalize('NFD').replace(/[̀-ͯ]/g, '');
    const tone = { ā: 1, á: 2, ǎ: 3, à: 4, ē: 1, é: 2, ě: 3, è: 4, ī: 1, í: 2, ǐ: 3, ì: 4, ō: 1, ó: 2, ǒ: 3, ò: 4, ū: 1, ú: 2, ǔ: 3, ù: 4 }[[...syl].find((ch) => 'āáǎàēéěèīíǐìōóǒòūúǔùǖǘǚǜ'.includes(ch))] || 0;
    assert.equal(gradeDictationCell(task, i, numbered + tone).correct, true, `cell ${i + 1} tone number`);
    // the other member of the printed pair must NOT pass
    const other = task.prompts[i].split('/').map((x) => x.trim()).find((x) => x !== syl);
    assert.equal(gradeDictationCell(task, i, other).correct, false, `cell ${i + 1} pair-mate rejected`);
  });
});
