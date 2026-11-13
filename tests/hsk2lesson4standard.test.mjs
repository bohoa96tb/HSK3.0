import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { JSDOM } from 'jsdom';
const content = JSON.parse(readFileSync(new URL('../data/content.json', import.meta.url)));
const l4 = content.additionalLessons.find((c) => c.lessonId === 'hsk2-l04');
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

test('hsk2 lesson 4 build: 22 sentences, 16 words in 4 groups, 8 tracks', () => {
  assert.equal(l4.reader.sentences.length, 22);
  assert.deepEqual(l4.reader.passages.map((g) => g.sentenceIds.length), [6, 6, 6, 4]);
  assert.deepEqual(l4.prepWords.map((w) => w.dialogueGroup), [1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 4]);
  assert.deepEqual(l4.prepGroups.map((g) => g.trackId), ['trk-tb2-l04-2', 'trk-tb2-l04-4', 'trk-tb2-l04-6', 'trk-tb2-l04-8']);
  for (const w of l4.prepWords) assert.ok(w.audio && w.audio.status === 'asr-draft', w.id);
  const tracks = l4.reader.audioTracks.filter((t) => t.id.startsWith('trk-tb2-'));
  assert.equal(tracks.length, 8);
  for (const [i, t] of tracks.entries()) {
    assert.equal(t.url, `https://cdn.baulchino.com/new-hsk-books-audios/hsk-2-textbook/lesson-04/4-${i + 1}.mp3`, t.id);
  }
  const wbTrack = l4.reader.audioTracks.find((t) => t.id === 'trk-wb2-l04-1');
  assert.ok(wbTrack, 'workbook listening track registered');
  assert.equal(wbTrack.url, 'https://cdn.baulchino.com/new-hsk-books-audios/hsk-2-workbook/lesson-04/04-1.mp3');
  assert.equal(wbTrack.durationSec, 567.28);
  for (const s of l4.reader.sentences) {
    const t = tracks.find((x) => x.id === s.audio.trackId);
    assert.ok(t && s.audio.end <= t.durationSec && s.audio.start < s.audio.end, s.id);
    assert.equal(s.transcriptStatus, 'print-verified', s.id);
  }
  // Speakers: mother Wang Yixue, daughter Liu Xiaoxue; text 4 is the diary (narrator = daughter).
  assert.equal(l4.reader.sentences[0].speaker, 'Lưu Tiểu Tuyết');
  assert.equal(l4.reader.sentences[1].speaker, 'Vương Nhất Tuyết');
  for (const s of l4.reader.sentences.slice(18)) assert.equal(s.speaker, 'Lưu Tiểu Tuyết', s.id);
});

test('hsk2 lesson 4 build: 3 grammar points with the printed examples + character foundation', () => {
  const main = l4.knowledgePoints.filter((k) => k.kind === 'grammar');
  assert.equal(main.length, 3);
  for (const k of main) {
    assert.ok(k.useWhenVi && k.useWhenVi.length > 10, k.id);
    assert.ok(k.quickCheck && ['1', '2'].includes(k.quickCheck.answer), k.id);
    assert.equal(k.examples.length, 3, k.id);
  }
  const exZh = Object.fromEntries(main.map((k) => [k.id, k.examples.map((e) => e.zh)]));
  assert.deepEqual(exZh['kp-hsk2-l04-guo'], ['她去过中国。', '我吃过饺子，很好吃。', '你看没看过那个电影？']);
  assert.deepEqual(exZh['kp-hsk2-l04-yinwei'], ['就是因为没穿过，所以要试试啊！', '因为我生病了，今天没去上班。', '我没去过他家，所以让他来车站接我。']);
  assert.deepEqual(exZh['kp-hsk2-l04-de'], ['红色的、绿色的、黑色的，你想买哪个？', '这个面包是爸爸买的，妈妈买的在那儿。', '这件衣服太贵了，还是买那件便宜的吧。']);
  const f = l4.knowledgePoints.find((k) => k.kind === 'foundation-characters');
  assert.ok(f && f.title.includes('绞丝旁') && f.title.includes('提土旁'), 'foundation KP covers both radicals');
  assert.equal(l4.learningPath.length, 6);
  assert.equal(l4.summaryPoints.length, 5);
  for (const sp of l4.summaryPoints) assert.ok(sp.exampleZh && sp.bodyVi, sp.titleVi);
});

test('hsk2 lesson 4: 12 set items and 10 printed dialogue checks (D28)', () => {
  assert.equal(l4.exerciseSet.items.length, 12);
  const answers = Object.fromEntries([...l4.exerciseSet.items, ...l4.reader.passages.flatMap((g) => g.checkItems || [])].map((i) => [i.id, i.answer]));
  assert.deepEqual(answers, {
    'tb2l4-warm-1': '1', 'tb2l4-warm-2': '4', 'tb2l4-warm-3': '2', 'tb2l4-warm-4': '3',
    'tb2l4-fill-1': '1', 'tb2l4-fill-2': '4', 'tb2l4-fill-3': '5', 'tb2l4-fill-4': '2', 'tb2l4-fill-5': '3',
    'wb2l4-ext-1': '1', 'wb2l4-ext-2': '2', 'wb2l4-ext-3': '3',
    'tb2l4-text1-1': '1', 'tb2l4-text1-2': '1', 'tb2l4-text2-1': '3', 'tb2l4-text2-2': '3',
    'tb2l4-text3-1': '2', 'tb2l4-text3-2': '2', 'tb2l4-text4-1': '2', 'tb2l4-text4-2': '1', 'tb2l4-text4-3': '1', 'tb2l4-text4-4': '2',
  });
  const checks = l4.reader.passages.flatMap((g) => g.checkItems || []);
  assert.equal(checks.length, 10);
  const listening = checks.filter((i) => i.audioSegment);
  assert.equal(listening.length, 8); // 2 reading questions of text 4 carry no segment
  for (const i of listening) {
    const t = l4.reader.audioTracks.find((x) => x.id === i.audioSegment.trackId);
    assert.ok(t && i.audioSegment.end <= t.durationSec, i.id);
    assert.ok(i.promptVi.includes('Câu hỏi nghe hiểu'), i.id);
  }
  for (const i of [...l4.exerciseSet.items, ...checks]) assert.ok(i.answerEvidence && i.answerEvidence.length > 20, i.id);
  const q = Object.fromEntries(checks.map((i) => [i.id, i.promptZh]));
  assert.equal(q['tb2l4-text1-1'], '王一雪和刘小雪要去哪儿看看？');
  assert.equal(q['tb2l4-text2-1'], '刘小雪想买什么？');
  assert.equal(q['tb2l4-text4-1'], '商场里的东西不便宜。');
  assert.equal(q['tb2l4-text4-4'], '商场里衣服的颜色怎么样？');
  // Fill-in stems are the printed sentences (TB p.035-036 / WB p.032), character-for-character.
  const stems = Object.fromEntries(l4.exerciseSet.items.map((i) => [i.id, i.promptZh]));
  assert.equal(stems['tb2l4-fill-1'], '我看见老师在教室里，你（）找她吧。');
  assert.equal(stems['tb2l4-fill-2'], '你已经有一（）黑色的裤子了，别买了。');
  assert.equal(stems['tb2l4-fill-3'], '我来过这家（），它是今年一月新开的。');
  assert.equal(stems['tb2l4-fill-4'], 'A：妈妈，你看见我的（）了吗？B：没看见，你再找找吧。');
  assert.equal(stems['tb2l4-fill-5'], 'A：你想买件什么（）的衣服？B：我喜欢绿色，买绿色的吧。');
  assert.equal(stems['wb2l4-ext-1'], '我很喜欢吃你做的（）。');
  assert.equal(stems['wb2l4-ext-2'], '小明家有一只黑猫，我家的那只是（）。');
  assert.equal(stems['wb2l4-ext-3'], '这是一间（），工作累了可以来休息休息。');
  for (const i of l4.exerciseSet.items.slice(0, 4)) for (const o of i.options) assert.ok(o.image && o.image.startsWith('assets/hsk2-lesson-04/'), i.id);
});

test('hsk2 lesson 4 writing set: 4 chars from writing-book page 4, stroke counts match data files', () => {
  const ws = content.writingSets.find((w) => w.id === 'writing-hsk2-l04');
  assert.ok(ws, 'writing set exists');
  assert.equal(ws.lessonId, 'hsk2-l04');
  assert.deepEqual(ws.chars.map((ch) => ch.char), ['红', '绿', '场', '块']);
  assert.deepEqual(ws.chars.map((ch) => ch.strokeCount), [6, 11, 6, 7]);
  for (const ch of ws.chars) {
    const data = JSON.parse(readFileSync(new URL(`../data/hanzi/${ch.char}.json`, import.meta.url)));
    assert.equal(data.strokes.length, ch.strokeCount, ch.char);
  }
  const byChar = Object.fromEntries(ws.chars.map((ch) => [ch.char, ch]));
  assert.equal(byChar['红'].word.zh, '红色');
  assert.equal(byChar['红'].sentence.zh, '我没买过红色的。');
  assert.equal(byChar['绿'].word.zh, '绿色');
  assert.equal(byChar['绿'].sentence.zh, '绿色的书包很好看。');
  assert.equal(byChar['场'].word.zh, '商场');
  assert.equal(byChar['场'].sentence.zh, '你去没去过那家商场？');
  assert.equal(byChar['块'].word.zh, '十块钱');
  assert.equal(byChar['块'].sentence.zh, '还是买那个十块钱的吧。');
});

test('hsk2 lesson 4 UI: intro writing entry, writing set page and char page render', async () => {
  await route('lesson/hsk2-l04');
  const entry = $('.writing-entry');
  assert.ok(entry, 'writing entry card on lesson intro');
  assert.ok(entry.textContent.includes('红'));
  assert.ok(entry.querySelector('a[href="#/writing/hsk2-l04"]'));
  await route('writing/hsk2-l04');
  assert.equal($$('.char-card').length, 4);
  await route('writing/hsk2-l04/w-h2l4-hong');
  assert.ok(document.body.textContent.includes('BƯỚC 1'));
  assert.ok(document.body.textContent.includes('BƯỚC 6'));
  assert.ok($('#hw-view'), 'stroke view box');
  assert.ok($('#hw-quiz'), 'guided quiz box');
  assert.ok($('#hw-self'), 'self writing box');
  assert.ok($('#paper-btn'), 'paper practice button');
  assert.ok($('#review-toggle'), 'needs-review toggle');
  assert.ok($('.static-char').textContent.includes('红'));
  await route('course/HSK%202');
  assert.equal($$('.lesson-list .row-card').length, 15);
});

test('hsk2 lesson 4 review (D31-D34): enabled, detail covers 16 words + 22 lines, word segments span both readings', async () => {
  const { buildReview, reviewHtml, reviewDetailLabel, REVIEW_WORD_SEGMENTS, REVIEW_PATTERN_SPEECH } = await import('../src/audio-review.js');
  const detail = buildReview(l4, 'detail'), quick = buildReview(l4);
  assert.ok(detail.length > quick.length);
  for (const w of l4.prepWords) assert.ok(detail.some((r) => r.source === w.id && r.text === w.zh), w.zh);
  const lineRows = l4.reader.sentences.map((s) => detail.find((r) => r.source === s.id && r.text === s.zh));
  assert.ok(lineRows.every(Boolean));
  const positions = lineRows.map((r) => detail.indexOf(r));
  assert.deepEqual(positions, [...positions].sort((a, b) => a - b));
  for (const s of l4.reader.sentences) {
    const row = detail.find((r) => r.source === s.id && r.text === s.zh);
    if (s.speaker) assert.ok(row.label.includes(s.speaker), row.label);
  }
  assert.ok(detail.every((r) => !l4.exerciseSet.items.some((i) => i.id === r.source)));
  assert.equal(reviewDetailLabel(l4), '16 từ + 3 điểm ngữ pháp + 4 đoạn');
  assert.ok(reviewHtml(l4).includes('16 từ + 3 điểm ngữ pháp + 4 đoạn'));
  for (const k of l4.knowledgePoints.filter((k) => k.kind === 'grammar')) {
    assert.ok(REVIEW_PATTERN_SPEECH[k.id], k.id);
    assert.ok(!/\p{Script=Han}/u.test(REVIEW_PATTERN_SPEECH[k.id]), k.id);
  }
  const byTrack = new Map();
  for (const w of l4.prepWords) {
    const seg = REVIEW_WORD_SEGMENTS[w.id];
    assert.ok(seg, w.id);
    const carrier = detail.find((r) => r.source === w.id && r.audio);
    assert.ok(carrier, w.id);
    assert.equal(carrier.audio.start, seg.start, w.id);
    assert.equal(carrier.audio.end, seg.end, w.id);
    assert.ok(seg.end > w.audio.end, `${w.id}: review span covers both readings`);
    if (!byTrack.has(w.audio.trackId)) byTrack.set(w.audio.trackId, []);
    byTrack.get(w.audio.trackId).push(seg);
  }
  for (const segs of byTrack.values()) {
    segs.sort((a, b) => a.start - b.start);
    for (let i = 1; i < segs.length; i++) assert.ok(segs[i - 1].end < segs[i].start, 'no overlap on a track');
  }
});
