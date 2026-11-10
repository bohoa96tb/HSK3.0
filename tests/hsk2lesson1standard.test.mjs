import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { JSDOM } from 'jsdom';
const content = JSON.parse(readFileSync(new URL('../data/content.json', import.meta.url)));
const l1 = content.additionalLessons.find((c) => c.lessonId === 'hsk2-l01');
const dom = new JSDOM(readFileSync(new URL('../index.html', import.meta.url), 'utf8'), { url: 'https://example.test/HSK3.0/' });
for (const k of ['window', 'document', 'location', 'localStorage', 'FormData']) globalThis[k] = dom.window[k];
Object.defineProperty(globalThis, 'navigator', { value: dom.window.navigator, configurable: true });
window.scrollTo = () => {}; window.scrollBy = () => {}; dom.window.Element.prototype.scrollIntoView = () => {};
globalThis.requestAnimationFrame = (fn) => { fn(); return 0; };
globalThis.speechSynthesis = { getVoices: () => [{ lang: 'zh-CN', name: 'Test' }], cancel() {}, speak() {}, addEventListener() {} };
class TestAudio extends EventTarget {
  constructor() { super(); this.paused = true; this.ended = false; this.duration = 10; this.currentTime = 0; this.readyState = 1; }
  async play() { this.paused = false; this.dispatchEvent(new Event('play')); }
  pause() { this.paused = true; this.dispatchEvent(new Event('pause')); }
}
globalThis.Audio = TestAudio;
globalThis.fetch = async () => ({ ok: true, json: async () => structuredClone(content) });
await import('../src/app.js');
const tick = () => new Promise((r) => setTimeout(r, 20));
await tick();
async function route(path) { location.hash = '#/' + path; await tick(); }
const $ = (s) => document.querySelector(s);
const $$ = (s) => [...document.querySelectorAll(s)];

test('hsk2 catalogue: 15 lessons from the printed TOC, only lesson 1 open', () => {
  const stubs = content.lessons.filter((l) => l.level === 'HSK 2');
  assert.equal(stubs.length, 15);
  assert.deepEqual(stubs.map((l) => l.titleZh), ['她请我们吃了北京烤鸭', '还是打车去北大吧', '我想去西安旅游', '你穿红色的很好看', '第一次去中国朋友家', '小雪，生日快乐！', '他篮球打得很好', '虽然你忘了，但是我记得', '我去买杯奶茶', '就要考试了', '我最喜欢吃中国菜', '这里比北京冷多了', '我们爱上中文课', '一个人过年多没意思啊', '我想再去一次中国']);
  assert.equal(stubs[0].publicationStatus, 'pilot-ready');
  assert.equal(stubs[1].publicationStatus, 'pilot-ready'); // lesson 2 opened in the next round
  assert.equal(stubs[2].publicationStatus, 'pilot-ready'); // lesson 3 opened in the round after
  assert.ok(stubs.slice(3).every((l) => l.publicationStatus !== 'pilot-ready'));
  assert.equal(content.lessons.filter((l) => l.level === 'HSK 1').length, 15);
});

test('hsk2 lesson 1 build: 22 sentences, 15 words in 4 groups, 8 textbook tracks + 1 workbook track (D39)', () => {
  assert.equal(l1.reader.sentences.length, 22);
  assert.deepEqual(l1.reader.passages.map((g) => g.sentenceIds.length), [6, 6, 7, 3]);
  assert.deepEqual(l1.prepWords.map((w) => w.dialogueGroup), [1, 1, 1, 1, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 4]);
  assert.deepEqual(l1.prepGroups.map((g) => g.trackId), ['trk-tb2-l01-2', 'trk-tb2-l01-4', 'trk-tb2-l01-6', 'trk-tb2-l01-8']);
  for (const w of l1.prepWords) assert.ok(w.audio && w.audio.status === 'asr-draft', w.id);
  const tracks = l1.reader.audioTracks.filter((t) => t.id.startsWith('trk-tb2-'));
  assert.equal(tracks.length, 8);
  for (const [i, t] of tracks.entries()) {
    assert.equal(t.url, `https://cdn.baulchino.com/new-hsk-books-audios/hsk-2-textbook/lesson-01/1-${i + 1}.mp3`, t.id);
  }
  const wbTrack = l1.reader.audioTracks.find((t) => t.id === 'trk-wb2-l01-1');
  assert.ok(wbTrack, 'workbook listening track registered (D39)');
  assert.equal(wbTrack.url, 'https://cdn.baulchino.com/new-hsk-books-audios/hsk-2-workbook/lesson-01/01-1.mp3');
  for (const s of l1.reader.sentences) {
    const t = tracks.find((x) => x.id === s.audio.trackId);
    assert.ok(t && s.audio.end <= t.durationSec && s.audio.start < s.audio.end, s.id);
    assert.equal(s.transcriptStatus, 'print-verified', s.id);
  }
});

test('hsk2 lesson 1 build: 3 grammar points + character foundation, path and summary', () => {
  const main = l1.knowledgePoints.filter((k) => k.kind === 'grammar');
  assert.equal(main.length, 3);
  for (const k of main) {
    assert.ok(k.useWhenVi && k.useWhenVi.length > 10, k.id);
    assert.ok(k.quickCheck && ['1', '2'].includes(k.quickCheck.answer), k.id);
    assert.equal(k.examples.length, 3, k.id);
  }
  assert.ok(l1.knowledgePoints.some((k) => k.kind.startsWith('foundation')));
  assert.deepEqual(l1.learningPath.map((s) => s.sectionId), ['intro', 'prep', 'knowledge', 'reader', 'exercises', 'apply']);
  assert.equal(l1.summaryPoints.length, 5);
  for (const pt of l1.summaryPoints) assert.ok(pt.exampleZh && pt.exampleVi, pt.titleVi);
  assert.equal(l1.apply.tasks.length, 2);
});

test('hsk2 lesson 1: 12 set items and 10 dialogue checks with verified answers (D28)', () => {
  assert.equal(l1.exerciseSet.items.length, 12);
  const answers = Object.fromEntries([...l1.exerciseSet.items, ...l1.reader.passages.flatMap((g) => g.checkItems || [])].map((i) => [i.id, i.answer]));
  assert.deepEqual(answers, {
    'tb2-warm-1': '2', 'tb2-warm-2': '1', 'tb2-warm-3': '3', 'tb2-warm-4': '2',
    'tb2-fill-1': '5', 'tb2-fill-2': '3', 'tb2-fill-3': '2', 'tb2-fill-4': '4', 'tb2-fill-5': '1',
    'wb2-ext-1': '1', 'wb2-ext-2': '3', 'wb2-ext-3': '2',
    'tb2-text1-1': '2', 'tb2-text1-2': '3', 'tb2-text2-1': '1', 'tb2-text2-2': '1',
    'tb2-text3-1': '1', 'tb2-text3-2': '3', 'tb2-text4-1': '2', 'tb2-text4-2': '2', 'tb2-text4-3': '3', 'tb2-text4-4': '2',
  });
  const checks = l1.reader.passages.flatMap((g) => g.checkItems || []);
  assert.equal(checks.length, 10);
  const listening = checks.filter((i) => i.audioSegment);
  assert.equal(listening.length, 8); // 2 reading questions of text 4 carry no segment
  for (const i of listening) {
    const t = l1.reader.audioTracks.find((x) => x.id === i.audioSegment.trackId);
    assert.ok(t && i.audioSegment.end <= t.durationSec, i.id);
  }
  for (const i of [...l1.exerciseSet.items, ...checks]) assert.ok(i.answerEvidence && i.answerEvidence.length > 20, i.id);
  // Fill-in stems are the printed Comprehensive Exercises sentences (TB p.008),
  // verified character-by-character against the page image after QA round 1.
  const stems = Object.fromEntries(l1.exerciseSet.items.map((i) => [i.id, i.promptZh]));
  assert.equal(stems['tb2-fill-1'], '我（）去电影院看个电影。');
  assert.equal(stems['tb2-fill-2'], '上课要多听、多说，你懂我的（）吗？');
  assert.equal(stems['tb2-fill-3'], '我很喜欢北京，这（）是我第三次来北京了。');
  assert.equal(stems['tb2-fill-4'], 'A：安妮，我给你（）一下，这是我的中国朋友李文。B：你好，李文。认识你很高兴。');
  assert.equal(stems['tb2-fill-5'], 'A：今天的工作太多了！B：那你找个人来（）吧。');
  // No Pinyin shown in exercise prompts by default is a rendering rule (D23);
  // data-level: warm-up options carry images from the lesson asset folder.
  for (const i of l1.exerciseSet.items.slice(0, 4)) for (const o of i.options) assert.ok(o.image && o.image.startsWith('assets/hsk2-lesson-01/'), i.id);
});

test('hsk2 course page lists 15 lessons; HSK 1 page unchanged', async () => {
  await route('course/HSK%202');
  assert.equal($$('.lesson-list .row-card').length, 15);
  assert.ok(document.body.textContent.includes('HSK 2'));
  await route('course/HSK%201');
  assert.equal($$('.lesson-list .row-card').length, 15);
});

test('hsk2 lesson 1 intro shows the writing entry; writing pages render', async () => {
  await route('lesson/hsk2-l01');
  const entry = $('.writing-entry');
  assert.ok(entry, 'writing entry card on lesson intro');
  assert.ok(entry.textContent.includes('打'));
  assert.ok(entry.querySelector('a[href="#/writing/hsk2-l01"]'));
  await route('writing');
  assert.ok(document.body.textContent.includes('Luyện viết chữ Hán'));
  assert.ok(document.body.textContent.includes('Phần viết đang biên soạn')); // lessons 2-15 honest state
  await route('writing/hsk2-l01');
  assert.equal($$('.char-card').length, 4);
  await route('writing/hsk2-l01/w-h2l1-jie');
  assert.ok(document.body.textContent.includes('BƯỚC 1'));
  assert.ok(document.body.textContent.includes('BƯỚC 6'));
  assert.ok($('#hw-view'), 'stroke view box');
  assert.ok($('#hw-quiz'), 'guided quiz box');
  assert.ok($('#hw-self'), 'self writing box');
  assert.ok($('#paper-btn'), 'paper practice button');
  assert.ok($('#review-toggle'), 'needs-review toggle');
  // Static fallback content is present even before/without the stroke library.
  assert.ok($('.static-char').textContent.includes('接'));
});
