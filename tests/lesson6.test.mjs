import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { JSDOM } from 'jsdom';
import { gradeChoice, gradeDictationCell } from '../src/lib.js';
const content = JSON.parse(readFileSync(new URL('../data/content.json', import.meta.url)));
const l6 = content.additionalLessons.find((c) => c.lessonId === 'hsk1-l06');
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

test('lesson 6 content matches the printed books: counts, pages, tracks, han-viet', () => {
  assert.ok(l6, 'additionalLessons must contain hsk1-l06');
  assert.equal(content.contentVersion, '20261101-lesson6-2');
  assert.equal(l6.prepWords.length, 22);
  for (const w of l6.prepWords) {
    assert.equal(w.hanVietStatus, 'verified-editorial', w.id);
    assert.ok(w.hanViet && w.hanViet === w.hanViet.toUpperCase(), w.id);
  }
  assert.equal(l6.prepWords.find((w) => w.zh === '手机').hanViet, 'THỦ CƠ');
  assert.equal(l6.prepWords.find((w) => w.zh === '哪儿').hanViet, 'NA NHI');
  assert.equal(l6.prepWords.find((w) => w.zh === '想').hanViet, 'TƯỞNG');
  assert.equal(l6.prepWords.find((w) => w.zh === '吃').hanViet, 'CẬT');
  assert.equal(l6.prepWords.find((w) => w.zh === '怎么').hanViet, 'CHẨM MA');
  assert.equal(l6.prepWords.find((w) => w.zh === '出租车').hanViet, 'XUẤT TÔ XA');
  assert.equal(l6.knowledgePoints.length, 5);
  assert.equal(l6.knowledgePoints.filter((k) => k.kind === 'grammar').length, 3);
  assert.equal(l6.reader.sentences.length, 14);
  assert.equal(l6.reader.audioTracks.length, 8);
  const tb = Object.fromEntries(l6.reader.audioTracks.filter((t) => t.id.startsWith('trk-tb')).map((t) => [t.id, t.durationSec]));
  assert.deepEqual(tb, {
    'trk-tb-l06-1': 21.197, 'trk-tb-l06-2': 8.14, 'trk-tb-l06-3': 13.43,
    'trk-tb-l06-4': 23.803, 'trk-tb-l06-5': 20.728, 'trk-tb-l06-6': 33.629,
  });
  const s2 = l6.reader.sentences.find((s) => s.id === 'l06-s2');
  assert.ok(s2.zh.includes('601493190'));
  assert.ok(s2.pinyin.includes('yāo sì jiǔ sān yāo jiǔ líng'));
  const lesson = content.lessons.find((l) => l.id === 'hsk1-l06');
  assert.equal(lesson.publicationStatus, 'pilot-ready');
  assert.equal(lesson.bookId, 'book-hsk1-textbook');
  assert.deepEqual(lesson.grammarIds, l6.knowledgePoints.map((k) => k.id));
  assert.ok(existsSync(new URL('../' + l6.intro.contextImage.src, import.meta.url)));
  assert.equal(l6.foundationWords.length, 13);
});

test('lesson 6 exercises: printed answers grade, stems render, comprehensive bank included', async () => {
  assert.equal(l6.exerciseSet.items.length, 9);
  assert.deepEqual(l6.exerciseSet.items.map((i) => i.answer), ['3', '2', '3', '2', '5', '2', '4', '3', '1']);
  const kpIds = new Set(content.additionalLessons.flatMap((c) => c.knowledgePoints.map((k) => k.id))
    .concat(content.pilot.knowledgePoints.map((k) => k.id)));
  for (const item of l6.exerciseSet.items) {
    assert.equal(item.answerStatus, 'verified-from-print');
    assert.ok(item.promptZh && item.promptPinyin, item.id);
    assert.equal(gradeChoice(item, item.answer).correct, true);
    assert.equal(gradeChoice(item, item.answer === '1' ? '2' : '1').correct, false);
    for (const o of item.options) assert.ok(o.pinyin && o.vi, item.id + '/' + o.id);
    for (const g of item.grammarIds) assert.ok(kpIds.has(g), item.id + ' -> ' + g);
  }
  await route('lesson/hsk1-l06/exercises');
  assert.ok($('.exercise-stem')?.textContent.includes('白家月'), 'the printed question stem renders');
  assert.ok(document.body.textContent.includes('Câu 1/9'));
});

test('lesson 6 choose-a-disyllable task: syllable grading grades exactly', () => {
  const task = l6.selfCheckTasks.find((t) => t.id === 'st-l06-01');
  assert.equal(task.answerStatus, 'verified-editorial');
  assert.equal(task.gradingMode, 'syllable');
  assert.equal(task.prompts.length, 6);
  assert.deepEqual(task.scriptSyllables, ['nàbiān', 'dōngxi', 'chāoshì', 'wǎnfàn', 'shǒujī', 'diànhuà']);
  task.scriptSyllables.forEach((syl, i) => {
    assert.equal(gradeDictationCell(task, i, syl).correct, true, `cell ${i + 1} exact`);
    const other = task.prompts[i].split('/').map((x) => x.trim()).find((x) => x !== syl);
    assert.equal(gradeDictationCell(task, i, other).correct, false, `cell ${i + 1} pair-mate rejected`);
  });
  // Task 2 (retroflex distinction) has no script answers: it must stay
  // unverified and never auto-grade.
  const t2 = l6.selfCheckTasks.find((t) => t.id === 'st-l06-02');
  assert.equal(t2.answerStatus, 'unverified');
  assert.equal(t2.answers, undefined);
  assert.equal(gradeDictationCell(t2, 0, 'nàr').graded, false);
});
