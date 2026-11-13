import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { JSDOM } from 'jsdom';
const content = JSON.parse(readFileSync(new URL('../data/content.json', import.meta.url)));
const l5 = content.additionalLessons.find((c) => c.lessonId === 'hsk2-l05');
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

test('hsk2 lesson 5 build: 25 sentences, 18 word rows in 4 groups, 8 tracks', () => {
  assert.equal(l5.reader.sentences.length, 25);
  assert.deepEqual(l5.reader.passages.map((g) => g.sentenceIds.length), [6, 8, 7, 4]);
  assert.deepEqual(l5.prepWords.map((w) => w.dialogueGroup), [1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 3, 3, 4, 4]);
  assert.deepEqual(l5.prepGroups.map((g) => g.trackId), ['trk-tb2-l05-2', 'trk-tb2-l05-4', 'trk-tb2-l05-6', 'trk-tb2-l05-8']);
  for (const w of l5.prepWords) assert.ok(w.audio && w.audio.status === 'asr-draft', w.id);
  // The book prints 17 numbered words plus the unnumbered 下面 row nested
  // under 上去 (TB p.038): 18 prep rows, 下面 between 上去 and 面.
  assert.equal(l5.prepWords.length, 18);
  assert.deepEqual(l5.prepWords.slice(0, 9).map((w) => w.zh), ['快', '下来', '上来', '上去', '下面', '面', '等', '一会儿', '下去']);
  assert.ok(l5.prepWords[4].noteVi && l5.prepWords[4].noteVi.includes('KHÔNG đánh số'), 'unnumbered row is annotated');
  const tracks = l5.reader.audioTracks.filter((t) => t.id.startsWith('trk-tb2-'));
  assert.equal(tracks.length, 8);
  for (const [i, t] of tracks.entries()) {
    assert.equal(t.url, `https://cdn.baulchino.com/new-hsk-books-audios/hsk-2-textbook/lesson-05/5-${i + 1}.mp3`, t.id);
  }
  const wbTrack = l5.reader.audioTracks.find((t) => t.id === 'trk-wb2-l05-1');
  assert.ok(wbTrack, 'workbook listening track registered');
  assert.equal(wbTrack.url, 'https://cdn.baulchino.com/new-hsk-books-audios/hsk-2-workbook/lesson-05/05-1.mp3');
  assert.equal(wbTrack.durationSec, 557.59);
  for (const s of l5.reader.sentences) {
    const t = tracks.find((x) => x.id === s.audio.trackId);
    assert.ok(t && s.audio.end <= t.durationSec && s.audio.start < s.audio.end, s.id);
    assert.equal(s.transcriptStatus, 'print-verified', s.id);
  }
  // Speakers: An Ni phones Bai Jiayue; text 2 has the joint greeting line
  // and Grandpa Liu; text 4 is Bai Jiayue's message (narrator = Bai Jiayue).
  assert.equal(l5.reader.sentences[0].speaker, 'An Ni');
  assert.equal(l5.reader.sentences[1].speaker, 'Bạch Gia Nguyệt');
  assert.equal(l5.reader.sentences[7].speaker, 'Bạch Gia Nguyệt và An Ni');
  assert.equal(l5.reader.sentences[9].speaker, 'Ông Lưu');
  for (const s of l5.reader.sentences.slice(21)) assert.equal(s.speaker, 'Bạch Gia Nguyệt', s.id);
});

test('hsk2 lesson 5 build: 3 grammar points with the printed examples + character foundation', () => {
  const main = l5.knowledgePoints.filter((k) => k.kind === 'grammar');
  assert.equal(main.length, 3);
  for (const k of main) {
    assert.ok(k.useWhenVi && k.useWhenVi.length > 10, k.id);
    assert.ok(k.quickCheck && ['1', '2'].includes(k.quickCheck.answer), k.id);
    assert.equal(k.examples.length, 3, k.id);
  }
  const exZh = Object.fromEntries(main.map((k) => [k.id, k.examples.map((e) => e.zh)]));
  assert.deepEqual(exZh['kp-hsk2-l05-trend1'], ['我不上去了，就在下面等你。', '家月到下边了，你下去接她吧。', '她拿来一本中文书。']);
  assert.deepEqual(exZh['kp-hsk2-l05-trend2'], ['你们太客气了，还拿这么多礼物来！', '家月给我送来了一本书。', '上课了，你们快进教室来吧。']);
  assert.deepEqual(exZh['kp-hsk2-l05-dou'], ['都12点了，我们吃饭吧。', '都8点半了，你还不起床吗？', '我都去过北京了，不想再去了。']);
  const f = l5.knowledgePoints.find((k) => k.kind === 'foundation-characters');
  assert.ok(f && f.title.includes('草字头') && f.title.includes('广字头'), 'foundation KP covers both radicals');
  assert.equal(l5.learningPath.length, 6);
  assert.equal(l5.summaryPoints.length, 5);
  for (const sp of l5.summaryPoints) assert.ok(sp.exampleZh && sp.bodyVi, sp.titleVi);
});

test('hsk2 lesson 5: 18 set items and 10 printed dialogue checks (D28)', () => {
  assert.equal(l5.exerciseSet.items.length, 18);
  const answers = Object.fromEntries([...l5.exerciseSet.items, ...l5.reader.passages.flatMap((g) => g.checkItems || [])].map((i) => [i.id, i.answer]));
  assert.deepEqual(answers, {
    'tb2l5-warm-1': '1', 'tb2l5-warm-2': '2', 'tb2l5-warm-3': '3', 'tb2l5-warm-4': '4',
    'tb2l5-warm-5': '1', 'tb2l5-warm-6': '2', 'tb2l5-warm-7': '3', 'tb2l5-warm-8': '4', 'tb2l5-warm-9': '5', 'tb2l5-warm-10': '6',
    'tb2l5-fill-1': '1', 'tb2l5-fill-2': '2', 'tb2l5-fill-3': '5', 'tb2l5-fill-4': '4', 'tb2l5-fill-5': '3',
    'wb2l5-ext-1': '2', 'wb2l5-ext-2': '3', 'wb2l5-ext-3': '1',
    'tb2l5-text1-1': '3', 'tb2l5-text1-2': '3', 'tb2l5-text2-1': '3', 'tb2l5-text2-2': '2',
    'tb2l5-text3-1': '3', 'tb2l5-text3-2': '1', 'tb2l5-text4-1': '2', 'tb2l5-text4-2': '2', 'tb2l5-text4-3': '1', 'tb2l5-text4-4': '3',
  });
  const checks = l5.reader.passages.flatMap((g) => g.checkItems || []);
  assert.equal(checks.length, 10);
  const listening = checks.filter((i) => i.audioSegment);
  assert.equal(listening.length, 8); // 2 reading questions of text 4 carry no segment
  for (const i of listening) {
    const t = l5.reader.audioTracks.find((x) => x.id === i.audioSegment.trackId);
    assert.ok(t && i.audioSegment.end <= t.durationSec, i.id);
    assert.ok(i.promptVi.includes('Câu hỏi nghe hiểu'), i.id);
  }
  for (const i of [...l5.exerciseSet.items, ...checks]) assert.ok(i.answerEvidence && i.answerEvidence.length > 20, i.id);
  const q = Object.fromEntries(checks.map((i) => [i.id, i.promptZh]));
  assert.equal(q['tb2l5-text1-1'], '白家月要去哪儿？');
  assert.equal(q['tb2l5-text2-1'], '王一雪给白家月和安妮介绍谁了？');
  assert.equal(q['tb2l5-text4-2'], '因为白家月喜欢喝奶茶，所以爷爷准备了奶茶。');
  assert.equal(q['tb2l5-text4-4'], '白家月和安妮为什么是走回酒店的？');
  // Fill-in stems are the printed sentences (TB p.044 / WB p.042), character-for-character.
  const stems = Object.fromEntries(l5.exerciseSet.items.map((i) => [i.id, i.promptZh]));
  assert.equal(stems['tb2l5-fill-1'], '你喝过（）吗？好不好喝？');
  assert.equal(stems['tb2l5-fill-2'], '桌子（）有一个绿色的书包。');
  assert.equal(stems['tb2l5-fill-3'], '同学们，（）我来。看，这是我们的新教室。');
  assert.equal(stems['tb2l5-fill-4'], 'A：家月，我不想打车，想（）回学校。B：好啊，没问题。');
  assert.equal(stems['tb2l5-fill-5'], 'A：公交车还没来，我们还是打车去吧。B：再（）一下吧。');
  assert.equal(stems['wb2l5-ext-1'], '这就是我的家，（）。');
  assert.equal(stems['wb2l5-ext-2'], '前边有一家（），你去过吗？');
  assert.equal(stems['wb2l5-ext-3'], '我（）呢，公交车还没来。');
  // warm-up items 1-10 are the two printed picture-matching sets; every option carries a redrawn image
  for (const i of l5.exerciseSet.items.slice(0, 10)) for (const o of i.options) assert.ok(o.image && o.image.startsWith('assets/hsk2-lesson-05/'), i.id);
  // warm-up part 2 (six direction words) stays verified-editorial: the mapping
  // is inferred from scene + speaker/camera position, and the evidence says so.
  for (const i of l5.exerciseSet.items.slice(4, 10)) {
    assert.equal(i.answerStatus, 'verified-editorial', i.id);
    assert.ok(i.answerEvidence.includes('vị trí người nói'), i.id);
  }
});

test('hsk2 lesson 5 writing set: 4 chars from writing-book page 5, stroke counts match data files', () => {
  const ws = content.writingSets.find((w) => w.id === 'writing-hsk2-l05');
  assert.ok(ws, 'writing set exists');
  assert.equal(ws.lessonId, 'hsk2-l05');
  assert.deepEqual(ws.chars.map((ch) => ch.char), ['茶', '菜', '店', '床']);
  assert.deepEqual(ws.chars.map((ch) => ch.strokeCount), [9, 11, 8, 7]);
  for (const ch of ws.chars) {
    const data = JSON.parse(readFileSync(new URL(`../data/hanzi/${ch.char}.json`, import.meta.url)));
    assert.equal(data.strokes.length, ch.strokeCount, ch.char);
  }
  const byChar = Object.fromEntries(ws.chars.map((ch) => [ch.char, ch]));
  assert.equal(byChar['茶'].word.zh, '红茶');
  assert.equal(byChar['茶'].sentence.zh, '红茶是朋友送来的。');
  assert.equal(byChar['菜'].word.zh, '中国菜');
  assert.equal(byChar['菜'].sentence.zh, '我喜欢吃中国菜。');
  assert.equal(byChar['店'].word.zh, '酒店');
  assert.equal(byChar['店'].sentence.zh, '我们走回酒店吧。');
  assert.equal(byChar['床'].word.zh, '起床');
  assert.equal(byChar['床'].sentence.zh, '都八点了，起床吧。');
});

test('hsk2 lesson 5 UI: intro writing entry, writing set page and char page render', async () => {
  await route('lesson/hsk2-l05');
  const entry = $('.writing-entry');
  assert.ok(entry, 'writing entry card on lesson intro');
  assert.ok(entry.textContent.includes('茶'));
  assert.ok(entry.querySelector('a[href="#/writing/hsk2-l05"]'));
  await route('writing/hsk2-l05');
  assert.equal($$('.char-card').length, 4);
  await route('writing/hsk2-l05/w-h2l5-cha');
  assert.ok(document.body.textContent.includes('BƯỚC 1'));
  assert.ok(document.body.textContent.includes('BƯỚC 6'));
  assert.ok($('#hw-view'), 'stroke view box');
  assert.ok($('#hw-quiz'), 'guided quiz box');
  assert.ok($('#hw-self'), 'self writing box');
  assert.ok($('#paper-btn'), 'paper practice button');
  assert.ok($('#review-toggle'), 'needs-review toggle');
  assert.ok($('.static-char').textContent.includes('茶'));
  await route('course/HSK%202');
  assert.equal($$('.lesson-list .row-card').length, 15);
});

test('hsk2 lesson 5 review (D31-D34): enabled, detail covers 18 words + 25 lines, word segments span both readings', async () => {
  const { buildReview, reviewHtml, reviewDetailLabel, REVIEW_WORD_SEGMENTS, REVIEW_PATTERN_SPEECH } = await import('../src/audio-review.js');
  const detail = buildReview(l5, 'detail'), quick = buildReview(l5);
  assert.ok(detail.length > quick.length);
  for (const w of l5.prepWords) assert.ok(detail.some((r) => r.source === w.id && r.text === w.zh), w.zh);
  // Lines whose printed text carries Arabic numerals (11点前, 12点) are
  // split by the review builder into fragments around the digit run; the
  // paragraph-0 fragments joined in order must rebuild the printed line.
  const joinedZh = (id) => detail.filter((r) => r.source === id && r.paragraph === 0).map((r) => r.text).join('');
  for (const s of l5.reader.sentences) assert.equal(joinedZh(s.id), s.zh, s.id);
  const positions = l5.reader.sentences.map((s) => detail.findIndex((r) => r.source === s.id));
  assert.deepEqual(positions, [...positions].sort((a, b) => a - b));
  for (const s of l5.reader.sentences) {
    const row = detail.find((r) => r.source === s.id);
    if (s.speaker) assert.ok(row.label.includes(s.speaker), row.label);
  }
  assert.ok(detail.every((r) => !l5.exerciseSet.items.some((i) => i.id === r.source)));
  assert.equal(reviewDetailLabel(l5), '18 từ + 3 điểm ngữ pháp + 4 đoạn');
  assert.ok(reviewHtml(l5).includes('18 từ + 3 điểm ngữ pháp + 4 đoạn'));
  for (const k of l5.knowledgePoints.filter((k) => k.kind === 'grammar')) {
    assert.ok(REVIEW_PATTERN_SPEECH[k.id], k.id);
    assert.ok(!/\p{Script=Han}/u.test(REVIEW_PATTERN_SPEECH[k.id]), k.id);
  }
  const byTrack = new Map();
  for (const w of l5.prepWords) {
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

test('B5 QA fixes: neutral alt on graded warm-2 options, print-faithful names and examples', () => {
  for (const id of ['tb2l5-warm-5','tb2l5-warm-6','tb2l5-warm-7','tb2l5-warm-8','tb2l5-warm-9','tb2l5-warm-10']) {
    const item = l5.exerciseSet.items.find((i) => i.id === id);
    for (const [idx, option] of item.options.entries()) {
      assert.equal(option.imageAlt, `Tranh minh họa lựa chọn ${'ABCDEF'[idx]}`);
    }
  }
  const chars = l5.knowledgePoints.find((item) => item.kind === 'foundation-characters');
  assert.deepEqual(chars.examples.map((item) => item.zh), ['红茶', '中国菜', '酒店', '起床']);
  assert.ok(!JSON.stringify(l5).includes('Yìfēi'));
  assert.ok(JSON.stringify(l5).includes('Yīfēi'));
});
