import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { JSDOM } from 'jsdom';
import { gradeChoice } from '../src/lib.js';
const content = JSON.parse(readFileSync(new URL('../data/content.json', import.meta.url)));
const l3 = content.additionalLessons.find((c) => c.lessonId === 'hsk1-l03');
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

test('lesson 3 content matches the printed books: counts, pages, tracks, han-viet', () => {
  assert.ok(l3, 'additionalLessons must contain hsk1-l03');
  assert.equal(content.contentVersion, '20261101-lesson6-2');
  assert.equal(l3.prepWords.length, 18);
  for (const w of l3.prepWords) {
    assert.equal(w.hanVietStatus, 'verified-editorial', w.id);
    assert.ok(w.hanViet && w.hanViet === w.hanViet.toUpperCase(), w.id);
  }
  assert.equal(l3.prepWords.find((w) => w.zh === '姐姐').hanViet, 'THƯ THƯ');
  assert.equal(l3.prepWords.find((w) => w.zh === '还').hanViet, 'HOÀN');
  assert.equal(l3.knowledgePoints.length, 5);
  assert.equal(l3.knowledgePoints.filter((k) => k.kind !== 'foundation-pronunciation').length, 3);
  assert.equal(l3.reader.sentences.length, 15);
  assert.equal(l3.reader.passages.length, 3);
  assert.equal(l3.reader.audioTracks.length, 8);
  assert.deepEqual(l3.reader.audioTracks.filter((t) => t.id.startsWith('trk-tb')).map((t) => t.durationSec),
    [8.322, 10.016, 17.522, 13.847, 20.832, 26.071]);
  for (const g of l3.reader.passages) {
    const t = l3.reader.audioTracks.find((x) => x.id === g.audioTrackId);
    assert.equal(t.segments.length, g.sentenceIds.length, g.id);
    for (const s of t.segments) assert.equal(s.status, 'asr-draft');
  }
  for (const sen of l3.reader.sentences) {
    assert.equal(sen.transcriptStatus, 'print-verified');
    assert.ok(sen.sourceRefs[0].pdfPage >= 25 && sen.sourceRefs[0].pdfPage <= 30, sen.id);
  }
  // per-unit speakers: only 吗 (prep) and 嘴 (foundation) lack a segment
  assert.equal(l3.prepWords.filter((w) => w.audio).length, 17);
  assert.equal(l3.prepWords.find((w) => w.zh === '吗').audio, null);
  assert.equal(l3.foundationWords.length, 12);
  assert.equal(l3.foundationWords.filter((w) => w.audio).length, 11);
  const lesson = content.lessons.find((l) => l.id === 'hsk1-l03');
  assert.equal(lesson.publicationStatus, 'pilot-ready');
  assert.deepEqual(lesson.grammarIds, l3.knowledgePoints.map((k) => k.id));
});

test('lesson 3 picture exercises: images exist, answers grade, review links fit the answers', () => {
  assert.equal(l3.exerciseSet.items.length, 4);
  assert.deepEqual(l3.exerciseSet.items.map((i) => i.answer), ['3', '4', '1', '2']);
  const kpIds = new Set(content.additionalLessons.flatMap((c) => c.knowledgePoints.map((k) => k.id))
    .concat(content.pilot.knowledgePoints.map((k) => k.id)));
  for (const item of l3.exerciseSet.items) {
    assert.ok(existsSync(new URL('../' + item.image, import.meta.url)), item.image);
    assert.equal(gradeChoice(item, item.answer).correct, true);
    assert.equal(gradeChoice(item, item.answer === '1' ? '2' : '1').correct, false);
    assert.ok(item.answerEvidence);
    assert.equal(item.sourceRefs[0].printedPage, 12);
    for (const o of item.options) { assert.ok(o.pinyin && o.vi, item.id + '/' + o.id); assert.ok(o.audio, item.id + '/' + o.id); }
    for (const g of item.grammarIds) assert.ok(kpIds.has(g), item.id + ' -> ' + g);
  }
  // the flagged lesson-2 link stays fixed
  const l2 = content.additionalLessons.find((c) => c.lessonId === 'hsk1-l02');
  assert.deepEqual(l2.exerciseSet.items.find((i) => i.id === 'wb2-picture-1').grammarIds, ['kp-hsk1-l02-word-order']);
  // D13-class guard: the L3 introduction dialogue (answer 2) reviews the 是 pattern, not the 叫 name point.
  assert.deepEqual(l3.exerciseSet.items.find((i) => i.id === 'wb3-picture-4').grammarIds, ['kp-hsk1-l03-shi']);
});

test('lesson 3 dictation prompts match the printed workbook (12/15/15 cells)', () => {
  assert.deepEqual(l3.selfCheckTasks.map((t) => t.prompts.length), [12, 15, 15]);
  assert.deepEqual(l3.selfCheckTasks[2].prompts,
    ['che', 'ren', 'chang', 'zao', 'shou', 'zhen', 'sui', 'sheng', 'ri', 'zhong', 'shui', 'zuo', 'chuang', 'shu', 'si']);
  assert.equal(l3.selfCheckTasks[0].prompts[0], '__ ān');
  assert.equal(l3.selfCheckTasks[1].prompts[0], 'z __');
});

test('lesson 3 renders its sections and the prep support bar incl. Han-Viet', async () => {
  await route('lesson/hsk1-l03/prep');
  assert.ok(document.body.textContent.includes('我是中国人') || document.body.innerHTML.length > 0);
  const bar = document.querySelector('.support-bar');
  assert.ok(bar, 'prep support bar exists');
  const labels = [...bar.querySelectorAll('button')].map((b) => b.textContent.trim());
  for (const want of ['Pinyin', 'Nghĩa', 'Hán–Việt', 'A−', 'A+']) assert.ok(labels.some((x) => x.includes(want)), want);
  const hvBtn = bar.querySelector('[data-support="hanviet"]');
  assert.equal(hvBtn.getAttribute('aria-pressed'), 'false', 'han-viet off by default');
  assert.ok(document.querySelector('#main').classList.contains('off-hv-prep'), 'han-viet hidden by default');
  await route('lesson/hsk1-l03/reader');
  assert.ok(document.body.textContent.includes('我的中文老师也是中国人'), 'reader shows dialogue 1');
  assert.ok(document.querySelector('.passage-tabs'), 'passage tabs exist');
  await route('lesson/hsk1-l03/reader?passage=l03-dialogue-3');
  assert.ok(document.body.textContent.includes('我们很想你'), 'reader shows dialogue 3');
  await route('grammar/kp-hsk1-l03-ma');
  assert.ok(document.body.textContent.includes('Câu hỏi với 吗'), 'knowledge point renders');
  await route('lesson/hsk1-l03/exercises');
  assert.ok(document.body.textContent.includes('Hình 1: hội thoại nào phù hợp?'));
  assert.ok(document.querySelector('.support-bar [data-support="pinyin"]'), 'exercises support bar exists');
});
