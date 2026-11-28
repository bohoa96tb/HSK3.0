import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { JSDOM } from 'jsdom';
import { buildReview, REVIEW_WORD_SEGMENTS, REVIEW_PATTERN_SPEECH, reviewQuickLabel } from '../src/audio-review.js';

const content = JSON.parse(readFileSync(new URL('../data/content.json', import.meta.url)));
const l8 = content.additionalLessons.find((c) => c.lessonId === 'hsk2-l08');
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
localStorage.setItem('hsk30.progress.v1', JSON.stringify({ schemaVersion: 1, learningRevision: 'textbook-pilot-v2', contentRevision: content.contentVersion }));
await import('../src/app.js');
const tick = () => new Promise((r) => setTimeout(r, 20));
await tick();
async function route(path) { location.hash = '#/' + path; await tick(); }
const $ = (s) => document.querySelector(s);
const $$ = (s) => [...document.querySelectorAll(s)];

test('hsk2 lesson 8 build: 22 sentences, 16 words in 4 groups, 8 textbook tracks + 1 workbook track', () => {
  assert.ok(l8, 'hsk2-l08 exists in additionalLessons');
  const stub = content.lessons.find((l) => l.id === 'hsk2-l08');
  assert.equal(stub.publicationStatus, 'pilot-ready');
  assert.equal(stub.titleZh, '虽然你忘了，但是我记得');
  assert.equal(l8.reader.sentences.length, 22);
  assert.deepEqual(l8.reader.passages.map((g) => g.sentenceIds.length), [6, 6, 7, 3]);
  assert.deepEqual(l8.prepWords.map((w) => w.dialogueGroup), [1, 1, 1, 1, 1, 1, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4]);
  assert.deepEqual(l8.prepGroups.map((g) => g.trackId), ['trk-tb2-l08-2', 'trk-tb2-l08-4', 'trk-tb2-l08-6', 'trk-tb2-l08-8']);
  for (const w of l8.prepWords) assert.ok(w.audio && w.audio.status === 'asr-draft', w.id);
  const tracks = l8.reader.audioTracks.filter((t) => t.id.startsWith('trk-tb2-'));
  assert.equal(tracks.length, 8);
  for (const [i, t] of tracks.entries()) {
    assert.equal(t.url, `https://cdn.baulchino.com/new-hsk-books-audios/hsk-2-textbook/lesson-08/8-${i + 1}.mp3`, t.id);
  }
  const wbTrack = l8.reader.audioTracks.find((t) => t.id === 'trk-wb2-l08-1');
  assert.ok(wbTrack, 'workbook listening track registered');
  assert.equal(wbTrack.url, 'https://cdn.baulchino.com/new-hsk-books-audios/hsk-2-workbook/lesson-08/08-1.mp3');
  for (const s of l8.reader.sentences) {
    const t = tracks.find((x) => x.id === s.audio.trackId);
    assert.ok(t && s.audio.end <= t.durationSec && s.audio.start < s.audio.end, s.id);
    assert.equal(s.transcriptStatus, 'print-verified', s.id);
  }
});

test('hsk2 lesson 8 build: 3 grammar points + tip + character foundation + D27 summary', () => {
  const grammar = l8.knowledgePoints.filter((k) => k.kind === 'grammar');
  assert.equal(grammar.length, 4); // 3 main grammar + 1 小语助力 tip
  const main = grammar.filter((k) => !(k.kindLabel || '').startsWith('Mẹo'));
  assert.equal(main.length, 3);
  for (const k of main) {
    assert.ok(k.useWhenVi && k.useWhenVi.length > 10, k.id);
    assert.ok(k.quickCheck && ['1', '2'].includes(k.quickCheck.answer), k.id);
    assert.equal(k.examples.length, 3, k.id);
  }
  const exZh = Object.fromEntries(main.map((k) => [k.id, k.examples.map((e) => e.zh)]));
  assert.deepEqual(exZh['kp-hsk2-l08-bi1'], [
    '我也觉得左边的比右边的好看。',
    '今天比昨天冷。',
    '他觉得踢足球比打篮球有意思。',
  ]);
  assert.deepEqual(exZh['kp-hsk2-l08-bi2'], [
    '我看网上说这个电影比那个爱情片更有意思。',
    '今天比昨天更热。',
    '我觉得奶茶比牛奶还好喝。',
  ]);
  assert.deepEqual(exZh['kp-hsk2-l08-suiran-danshi'], [
    '虽然你忘了，但是我记得。',
    '外边下雪了，但是不太冷。',
    '虽然觉得有点儿累，我还是走回家了。',
  ]);
  const f = l8.knowledgePoints.find((k) => k.kind === 'foundation-characters');
  assert.ok(f && f.title.includes('食字旁') && f.title.includes('火字底'), 'foundation KP covers both radicals');
  assert.equal(l8.learningPath.length, 6);
  assert.equal(l8.summaryPoints.length, 5);
  for (const sp of l8.summaryPoints) assert.ok(sp.exampleZh && sp.bodyVi && sp.examplePinyin, sp.titleVi);
});

test('hsk2 lesson 8: 12 set items, 10 printed dialogue checks (D28) and 4 self-check tasks', () => {
  assert.equal(l8.exerciseSet.items.length, 12);
  const answers = Object.fromEntries([...l8.exerciseSet.items, ...l8.reader.passages.flatMap((g) => g.checkItems || [])].map((i) => [i.id, i.answer]));
  assert.deepEqual(answers, {
    'tb2l8-warm-1': '3', 'tb2l8-warm-2': '2', 'tb2l8-warm-3': '4', 'tb2l8-warm-4': '1',
    'tb2l8-fill-1': '3', 'tb2l8-fill-2': '2', 'tb2l8-fill-3': '5', 'tb2l8-fill-4': '4', 'tb2l8-fill-5': '1',
    'wb2l8-ext-1': '3', 'wb2l8-ext-2': '2', 'wb2l8-ext-3': '1',
    'tb2l8-text1-1': '2', 'tb2l8-text1-2': '3', 'tb2l8-text2-1': '2', 'tb2l8-text2-2': '1',
    'tb2l8-text3-1': '3', 'tb2l8-text3-2': '1', 'tb2l8-text4-1': '2', 'tb2l8-text4-2': '2', 'tb2l8-text4-3': '1', 'tb2l8-text4-4': '3',
  });
  const checks = l8.reader.passages.flatMap((g) => g.checkItems || []);
  assert.equal(checks.length, 10);
  const listening = checks.filter((i) => i.audioSegment);
  assert.equal(listening.length, 8);
  for (const i of listening) {
    const t = l8.reader.audioTracks.find((x) => x.id === i.audioSegment.trackId);
    assert.ok(t && i.audioSegment.end <= t.durationSec, i.id);
    assert.ok(i.promptVi.includes('Câu hỏi nghe hiểu'), i.id);
  }
  for (const i of [...l8.exerciseSet.items, ...checks]) assert.ok(i.answerEvidence && i.answerEvidence.length > 20, i.id);
  const q = Object.fromEntries(checks.map((i) => [i.id, i.promptZh]));
  assert.equal(q['tb2l8-text1-1'], '王一雪和刘明在看什么？');
  assert.equal(q['tb2l8-text2-2'], '王一雪要在哪儿买票？');
  assert.equal(q['tb2l8-text4-1'], '丈夫忘了妻子的生日。');
  assert.equal(q['tb2l8-text4-4'], '丈夫没请妻子做什么？');
  const stems = Object.fromEntries(l8.exerciseSet.items.map((i) => [i.id, i.promptZh]));
  assert.equal(stems['tb2l8-fill-1'], '我的（）在哪儿？你看见了吗？');
  assert.equal(stems['tb2l8-fill-2'], '我（）那个超市卖画笔，我们过去看看。');
  assert.equal(stems['tb2l8-fill-3'], '我们在商场买了很多东西，（）了很多钱。');
  assert.equal(stems['tb2l8-fill-4'], 'A：我昨天看的那个电影很（）。B：有时间我也去看看。');
  assert.equal(stems['tb2l8-fill-5'], 'A：（）这个人是你妹妹吗？B：是我姐姐，她比我大。');
  assert.equal(stems['wb2l8-ext-1'], '今天下午我们去（）喝茶吧。');
  assert.equal(stems['wb2l8-ext-2'], '教室里的（）都很新，也很舒服。');
  assert.equal(stems['wb2l8-ext-3'], '他们（）两个每星期都会来这家饭馆吃饭。');
  for (const i of l8.exerciseSet.items.slice(0, 4)) for (const o of i.options) assert.ok(o.image && o.image.startsWith('assets/hsk2-lesson-08/'), i.id);
  assert.equal(l8.apply.tasks.length, 2);
  assert.equal(l8.selfCheckTasks.length, 4);
});

test('hsk2 lesson 8 writing set: 4 chars from writing-book page 8, stroke counts match data files', () => {
  const ws = content.writingSets.find((w) => w.id === 'writing-hsk2-l08');
  assert.ok(ws, 'writing set exists');
  assert.equal(ws.lessonId, 'hsk2-l08');
  assert.deepEqual(ws.chars.map((ch) => ch.char), ['饭', '饺', '点', '热']);
  assert.deepEqual(ws.chars.map((ch) => ch.strokeCount), [7, 9, 9, 10]);
  for (const ch of ws.chars) {
    const data = JSON.parse(readFileSync(new URL(`../data/hanzi/${ch.char}.json`, import.meta.url)));
    assert.equal(data.strokes.length, ch.strokeCount, ch.char);
  }
  const byChar = Object.fromEntries(ws.chars.map((ch) => [ch.char, ch]));
  assert.equal(byChar['饭'].word.zh, '饭馆');
  assert.equal(byChar['饭'].sentence.zh, '这家饭馆的菜很好吃。');
  assert.equal(byChar['饺'].word.zh, '饺子');
  assert.equal(byChar['饺'].sentence.zh, '我觉得饺子比包子好吃。');
  assert.equal(byChar['点'].word.zh, '点菜');
  assert.equal(byChar['点'].sentence.zh, '我点了几个菜。');
  assert.equal(byChar['热'].word.zh, '很热');
  assert.equal(byChar['热'].sentence.zh, '房间里边很热，比外边还热。');
});

test('hsk2 lesson 8 audio review: story-arc quick + full detail follow L3 pattern cleanly', () => {
  assert.equal(reviewQuickLabel(l8), 'Từ vựng theo mạch chuyện + 4 câu xương sống');
  const quick = buildReview(l8, 'quick');
  const detail = buildReview(l8, 'detail');
  assert.ok(quick.length >= 20 && detail.length > quick.length);
  for (const k of l8.knowledgePoints.filter((k) => k.kind === 'grammar')) {
    assert.ok(REVIEW_PATTERN_SPEECH[k.id], `paraphrase for ${k.id}`);
    assert.ok(detail.some((r) => r.source === k.id && r.label === 'Mẫu câu'), `detail pattern row for ${k.id}`);
  }
  const byTrack = new Map();
  for (const w of l8.prepWords) {
    const seg = REVIEW_WORD_SEGMENTS[w.id];
    assert.ok(seg && seg.end > w.audio.end, w.id);
    const carrier = detail.find((r) => r.source === w.id && r.audio);
    assert.ok(carrier && carrier.audio.start === seg.start && carrier.audio.end === seg.end, w.id);
    if (!byTrack.has(w.audio.trackId)) byTrack.set(w.audio.trackId, []);
    byTrack.get(w.audio.trackId).push(seg);
  }
  for (const segs of byTrack.values()) {
    segs.sort((a, b) => a.start - b.start);
    for (let i = 1; i < segs.length; i++) assert.ok(segs[i - 1].end < segs[i].start, `${segs[i - 1].end} < ${segs[i].start}`);
  }
  for (const r of [...quick, ...detail]) {
    assert.ok(r.speechText && r.speechText.length > 0, `${r.label} speechText`);
    if (r.lang === 'vi-VN' && r.label !== 'Mẫu câu') {
      assert.ok(!/\p{Script=Han}/u.test(r.speechText), `No Hanzi in vi-VN row: ${r.label} -> ${r.speechText}`);
    }
  }
});

test('hsk2 lesson 8 UI: intro, knowledge, exercises, summary with dynamic writing reminder, writing view', async () => {
  await route('lesson/hsk2-l08');
  const entry = $('.writing-entry');
  assert.ok(entry, 'writing entry card on lesson intro');
  assert.ok(entry.textContent.includes('饭'));
  assert.ok(entry.querySelector('a[href="#/writing/hsk2-l08"]'));
  await route('lesson/hsk2-l08/summary');
  assert.ok(document.body.textContent.includes('Nhắc nhớ 4 chữ Hán viết tay theo bộ thủ: 饣 và 灬'));
  assert.ok(document.body.textContent.includes('Ôn viết 4 chữ 饭、饺、点、热'));
  await route('writing/hsk2-l08');
  assert.equal($$('.char-card').length, 4);
  await route('writing/hsk2-l08/w-h2l8-fan');
  assert.ok(document.body.textContent.includes('BƯỚC 1'));
  assert.ok(document.body.textContent.includes('BƯỚC 6'));
  assert.ok($('.static-char').textContent.includes('饭'));
  // Ensure Lesson 3 summary still keeps its own dynamic radicals/chars untouched
  await route('lesson/hsk2-l03/summary');
  assert.ok(document.body.textContent.includes('Nhắc nhớ 4 chữ Hán viết tay theo bộ thủ: 氵 và 宀'));
  assert.ok(document.body.textContent.includes('Ôn viết 4 chữ 汉、洗、家、完'));
});
