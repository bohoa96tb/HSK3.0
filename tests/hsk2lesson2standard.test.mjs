import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { JSDOM } from 'jsdom';
const content = JSON.parse(readFileSync(new URL('../data/content.json', import.meta.url)));
const l2 = content.additionalLessons.find((c) => c.lessonId === 'hsk2-l02');
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

test('hsk2 lesson 2 build: 21 sentences, 17 words in 4 groups, 8 tracks', () => {
  assert.equal(l2.reader.sentences.length, 21);
  assert.deepEqual(l2.reader.passages.map((g) => g.sentenceIds.length), [6, 6, 6, 3]);
  assert.deepEqual(l2.prepWords.map((w) => w.dialogueGroup), [1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 3, 3, 4]);
  assert.deepEqual(l2.prepGroups.map((g) => g.trackId), ['trk-tb2-l02-2', 'trk-tb2-l02-4', 'trk-tb2-l02-6', 'trk-tb2-l02-8']);
  for (const w of l2.prepWords) assert.ok(w.audio && w.audio.status === 'asr-draft', w.id);
  const tracks = l2.reader.audioTracks.filter((t) => t.id.startsWith('trk-tb2-'));
  assert.equal(tracks.length, 8);
  for (const [i, t] of tracks.entries()) {
    assert.equal(t.url, `https://cdn.baulchino.com/new-hsk-books-audios/hsk-2-textbook/lesson-02/2-${i + 1}.mp3`, t.id);
  }
  const wbTrack = l2.reader.audioTracks.find((t) => t.id === 'trk-wb2-l02-1');
  assert.ok(wbTrack, 'workbook listening track registered (D40)');
  assert.equal(wbTrack.url, 'https://cdn.baulchino.com/new-hsk-books-audios/hsk-2-workbook/lesson-02/02-1.mp3');
  for (const s of l2.reader.sentences) {
    const t = tracks.find((x) => x.id === s.audio.trackId);
    assert.ok(t && s.audio.end <= t.durationSec && s.audio.start < s.audio.end, s.id);
    assert.equal(s.transcriptStatus, 'print-verified', s.id);
  }
  // Text 4 last sentence verified at 300 DPI + ASR: one 看, not 看看.
  assert.equal(l2.reader.sentences[20].zh, '我们有时间还想再过来看个电影。');
});

test('hsk2 lesson 2 build: 3 grammar points with the printed examples + character foundation', () => {
  const main = l2.knowledgePoints.filter((k) => k.kind === 'grammar');
  assert.equal(main.length, 3);
  for (const k of main) {
    assert.ok(k.useWhenVi && k.useWhenVi.length > 10, k.id);
    assert.ok(k.quickCheck && ['1', '2'].includes(k.quickCheck.answer), k.id);
    assert.equal(k.examples.length, 3, k.id);
  }
  const exZh = Object.fromEntries(main.map((k) => [k.id, k.examples.map((e) => e.zh)]));
  assert.deepEqual(exZh['kp-hsk2-l02-haishi'], ['我们还是打车去吧。', '那件衣服很好看，还是买那件吧。', '你第一次去北京，还是找个人接你吧。']);
  assert.deepEqual(exZh['kp-hsk2-l02-duo'], ['北京大学有四万多名学生呢！', '教室里有二十多个学生。', '这两个苹果五块多钱。']);
  assert.deepEqual(exZh['kp-hsk2-l02-attributive'], ['他们卖的电影票也很便宜。', '现在学中文的学生很多。', '这是朋友给我的杯子。']);
  const f = l2.knowledgePoints.find((k) => k.kind === 'foundation-characters');
  assert.ok(f && f.title.includes('门字框') && f.title.includes('走之旁'), 'foundation KP covers both radicals');
  assert.equal(l2.learningPath.length, 6);
  assert.equal(l2.summaryPoints.length, 5);
  for (const sp of l2.summaryPoints) assert.ok(sp.exampleZh && sp.bodyVi, sp.titleVi);
});

test('hsk2 lesson 2: 12 set items and 10 printed dialogue checks (D28)', () => {
  assert.equal(l2.exerciseSet.items.length, 12);
  const answers = Object.fromEntries([...l2.exerciseSet.items, ...l2.reader.passages.flatMap((g) => g.checkItems || [])].map((i) => [i.id, i.answer]));
  assert.deepEqual(answers, {
    'tb2l2-warm-1': '2', 'tb2l2-warm-2': '3', 'tb2l2-warm-3': '2', 'tb2l2-warm-4': '4',
    'tb2l2-fill-1': '4', 'tb2l2-fill-2': '2', 'tb2l2-fill-3': '1', 'tb2l2-fill-4': '3', 'tb2l2-fill-5': '5',
    'wb2l2-ext-1': '3', 'wb2l2-ext-2': '1', 'wb2l2-ext-3': '2',
    'tb2l2-text1-1': '3', 'tb2l2-text1-2': '2', 'tb2l2-text2-1': '2', 'tb2l2-text2-2': '2',
    'tb2l2-text3-1': '2', 'tb2l2-text3-2': '2', 'tb2l2-text4-1': '2', 'tb2l2-text4-2': '2', 'tb2l2-text4-3': '2', 'tb2l2-text4-4': '3',
  });
  const checks = l2.reader.passages.flatMap((g) => g.checkItems || []);
  assert.equal(checks.length, 10);
  const listening = checks.filter((i) => i.audioSegment);
  assert.equal(listening.length, 8); // 2 reading questions of text 4 carry no segment
  for (const i of listening) {
    const t = l2.reader.audioTracks.find((x) => x.id === i.audioSegment.trackId);
    assert.ok(t && i.audioSegment.end <= t.durationSec, i.id);
    assert.ok(i.promptVi.includes('Câu hỏi nghe hiểu'), i.id);
  }
  for (const i of [...l2.exerciseSet.items, ...checks]) assert.ok(i.answerEvidence && i.answerEvidence.length > 20, i.id);
  // The dialogue checks ARE the book's printed questions (TB pp. 011/012/014/016/017).
  const q = Object.fromEntries(checks.map((i) => [i.id, i.promptZh]));
  assert.equal(q['tb2l2-text1-1'], '白家月和安妮想去哪儿？');
  assert.equal(q['tb2l2-text2-1'], '北京大学有多少学生？');
  assert.equal(q['tb2l2-text3-2'], '有的电影票还不到多少钱？');
  assert.equal(q['tb2l2-text4-1'], '北京大学有四万多名外国学生。');
  assert.equal(q['tb2l2-text4-4'], '白家月和安妮有时间还想再来北京大学做什么？');
  // Fill-in stems are the printed sentences (TB p.017 / WB p.012), character-for-character.
  const stems = Object.fromEntries(l2.exerciseSet.items.map((i) => [i.id, i.promptZh]));
  assert.equal(stems['tb2l2-fill-1'], '你家太远了，我们是（）过来的。');
  assert.equal(stems['tb2l2-fill-2'], '那是一（）大教室，我们明天要去那儿上课。');
  assert.equal(stems['tb2l2-fill-3'], '李文让我去接他的朋友，（）我太忙了，没时间。');
  assert.equal(stems['tb2l2-fill-4'], 'A：请问，去北京大学的（）在哪儿？B：就在前边，不远。');
  assert.equal(stems['tb2l2-fill-5'], 'A：家月，我想请你（）帮个忙，你有时间吗？B：不好意思，我在外边旅游呢。');
  assert.equal(stems['wb2l2-ext-1'], '我们还是（）再去饭店吃饭吧。');
  assert.equal(stems['wb2l2-ext-2'], '前边有个（），我们去看一下有没有到学校的车。');
  assert.equal(stems['wb2l2-ext-3'], '我们的火车是十点的，现在九点多了，打车去（）吧。');
  for (const i of l2.exerciseSet.items.slice(0, 4)) for (const o of i.options) assert.ok(o.image && o.image.startsWith('assets/hsk2-lesson-02/'), i.id);
});

test('hsk2 lesson 2 writing set: 4 chars from writing-book page 2, stroke counts match data files', () => {
  const ws = content.writingSets.find((w) => w.id === 'writing-hsk2-l02');
  assert.ok(ws, 'writing set exists');
  assert.equal(ws.lessonId, 'hsk2-l02');
  assert.deepEqual(ws.chars.map((ch) => ch.char), ['间', '问', '过', '远']);
  assert.deepEqual(ws.chars.map((ch) => ch.strokeCount), [7, 6, 6, 7]);
  for (const ch of ws.chars) {
    const data = JSON.parse(readFileSync(new URL(`../data/hanzi/${ch.char}.json`, import.meta.url)));
    assert.equal(data.strokes.length, ch.strokeCount, ch.char);
  }
  const byChar = Object.fromEntries(ws.chars.map((ch) => [ch.char, ch]));
  assert.equal(byChar['间'].word.zh, '二十间');
  assert.equal(byChar['间'].sentence.zh, '这儿有二十多间教室。');
  assert.equal(byChar['问'].word.zh, '问一下');
  assert.equal(byChar['问'].sentence.zh, '你还是问一下老师吧。');
  assert.equal(byChar['过'].word.zh, '过来');
  assert.equal(byChar['过'].sentence.zh, '你还是过来吧。');
  assert.equal(byChar['远'].word.zh, '不远');
  assert.equal(byChar['远'].sentence.zh, '不远，十多分钟就到了。');
});

test('hsk2 lesson 2 UI: intro writing entry, writing set page and char page render', async () => {
  await route('lesson/hsk2-l02');
  const entry = $('.writing-entry');
  assert.ok(entry, 'writing entry card on lesson intro');
  assert.ok(entry.textContent.includes('间'));
  assert.ok(entry.querySelector('a[href="#/writing/hsk2-l02"]'));
  await route('writing/hsk2-l02');
  assert.equal($$('.char-card').length, 4);
  await route('writing/hsk2-l02/w-h2l2-wen');
  assert.ok(document.body.textContent.includes('BƯỚC 1'));
  assert.ok(document.body.textContent.includes('BƯỚC 6'));
  assert.ok($('#hw-view'), 'stroke view box');
  assert.ok($('#hw-quiz'), 'guided quiz box');
  assert.ok($('#hw-self'), 'self writing box');
  assert.ok($('#paper-btn'), 'paper practice button');
  assert.ok($('#review-toggle'), 'needs-review toggle');
  assert.ok($('.static-char').textContent.includes('问'));
  await route('course/HSK%202');
  assert.equal($$('.lesson-list .row-card').length, 15);
});
