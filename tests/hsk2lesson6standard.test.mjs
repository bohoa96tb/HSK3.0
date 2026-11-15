import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { JSDOM } from 'jsdom';
const content = JSON.parse(readFileSync(new URL('../data/content.json', import.meta.url)));
const l6 = content.additionalLessons.find((c) => c.lessonId === 'hsk2-l06');
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

test('hsk2 lesson 6 build: 27 sentences, 14 words in 4 groups, 8 tracks', () => {
  assert.equal(l6.reader.sentences.length, 27);
  assert.deepEqual(l6.reader.passages.map((g) => g.sentenceIds.length), [6, 8, 7, 6]);
  assert.deepEqual(l6.prepWords.map((w) => w.dialogueGroup), [1, 1, 1, 1, 1, 2, 2, 3, 3, 3, 3, 3, 4, 4]);
  assert.deepEqual(l6.prepGroups.map((g) => g.trackId), ['trk-tb2-l06-2', 'trk-tb2-l06-4', 'trk-tb2-l06-6', 'trk-tb2-l06-8']);
  for (const w of l6.prepWords) assert.ok(w.audio && w.audio.status === 'asr-draft', w.id);
  assert.equal(l6.prepWords.length, 14);
  assert.deepEqual(l6.prepWords.map((w) => w.zh), ['生日', '忘', '画', '画笔', '蛋糕', '快乐', '打开', '长', '鱼', '肉', '过', '地', '床', '舒服']);
  const tracks = l6.reader.audioTracks.filter((t) => t.id.startsWith('trk-tb2-'));
  assert.equal(tracks.length, 8);
  for (const [i, t] of tracks.entries()) {
    assert.equal(t.url, `https://cdn.baulchino.com/new-hsk-books-audios/hsk-2-textbook/lesson-06/6-${i + 1}.mp3`, t.id);
  }
  const wbTrack = l6.reader.audioTracks.find((t) => t.id === 'trk-wb2-l06-1');
  assert.ok(wbTrack, 'workbook listening track registered');
  assert.equal(wbTrack.url, 'https://cdn.baulchino.com/new-hsk-books-audios/hsk-2-workbook/lesson-06/06-1.mp3');
  assert.equal(wbTrack.durationSec, 553.81);
  for (const s of l6.reader.sentences) {
    const t = tracks.find((x) => x.id === s.audio.trackId);
    assert.ok(t && s.audio.end <= t.durationSec && s.audio.start < s.audio.end, s.id);
    assert.equal(s.transcriptStatus, 'print-verified', s.id);
  }
  // Speakers: text 1 is the parents' planning talk; text 4 is Wang Yixue's
  // diary (narrator = Wang Yixue for all six lines).
  assert.equal(l6.reader.sentences[0].speaker, 'Vương Nhất Tuyết');
  assert.equal(l6.reader.sentences[1].speaker, 'Lưu Minh');
  assert.equal(l6.reader.sentences[7].speaker, 'Lưu Tiểu Minh');
  assert.equal(l6.reader.sentences[10].speaker, 'Lưu Tiểu Tuyết');
  for (const s of l6.reader.sentences.slice(21)) assert.equal(s.speaker, 'Vương Nhất Tuyết', s.id);
});

test('hsk2 lesson 6 build: 3 grammar points with the printed examples + tip box + character foundation', () => {
  const main = l6.knowledgePoints.filter((k) => k.kind === 'grammar' && !k.id.includes('tip'));
  assert.equal(main.length, 3);
  for (const k of main) {
    assert.ok(k.useWhenVi && k.useWhenVi.length > 10, k.id);
    assert.ok(k.quickCheck && ['1', '2'].includes(k.quickCheck.answer), k.id);
    assert.equal(k.examples.length, 3, k.id);
  }
  const exZh = Object.fromEntries(main.map((k) => [k.id, k.examples.map((e) => e.zh)]));
  assert.deepEqual(exZh['kp-hsk2-l06-reduplication'], ['我再给她买个大大的生日蛋糕。', '这只猫小小的，真让人喜欢。', '一雪的女儿每天都漂漂亮亮的。']);
  assert.deepEqual(exZh['kp-hsk2-l06-shenmede'], ['画我们的家！有爸爸、妈妈、弟弟，还有黑色的狗、白色的猫什么的。', '桌子上有电脑、杯子、书和画笔什么的。', '她拿来了一些水、面包和苹果什么的。']);
  assert.deepEqual(exZh['kp-hsk2-l06-de'], ['过生日就要吃好吃的，还要高高兴兴地玩。', '老师早早地到了教室。', '爸爸很快地吃完早饭，就去上班了。']);
  // The 小语助力 tip box (TB p.051) rides as a grammar-kind KP without a
  // quickCheck, exactly like the HSK 1 Lesson 8 tips.
  const tip = l6.knowledgePoints.find((k) => k.id === 'kp-hsk2-l06-tip-noodle');
  assert.ok(tip && tip.kind === 'grammar' && tip.kindLabel.includes('小语助力'), 'tip KP present');
  assert.ok(!tip.quickCheck, 'tip KP carries no quickCheck');
  assert.deepEqual(tip.examples.map((e) => e.zh), ['中国人过生日的时候一般要吃面条儿。', '因为面条儿长长的，寓意“长寿”。']);
  const f = l6.knowledgePoints.find((k) => k.kind === 'foundation-characters');
  assert.ok(f && f.title.includes('竹字头') && f.title.includes('竖心旁'), 'foundation KP covers both radicals');
  assert.deepEqual(f.examples.map((e) => e.zh), ['笔', '第', '快', '忙']);
  assert.equal(l6.learningPath.length, 6);
  assert.equal(l6.summaryPoints.length, 5);
  for (const sp of l6.summaryPoints) assert.ok(sp.exampleZh && sp.bodyVi, sp.titleVi);
});

test('hsk2 lesson 6: 16 set items and 10 printed dialogue checks (D28)', () => {
  assert.equal(l6.exerciseSet.items.length, 16);
  const answers = Object.fromEntries([...l6.exerciseSet.items, ...l6.reader.passages.flatMap((g) => g.checkItems || [])].map((i) => [i.id, i.answer]));
  assert.deepEqual(answers, {
    'tb2l6-warm-1': '3', 'tb2l6-warm-2': '2', 'tb2l6-warm-3': '4', 'tb2l6-warm-4': '1',
    'tb2l6-warm-5': '2', 'tb2l6-warm-6': '3', 'tb2l6-warm-7': '4', 'tb2l6-warm-8': '1',
    'tb2l6-fill-1': '1', 'tb2l6-fill-2': '5', 'tb2l6-fill-3': '4', 'tb2l6-fill-4': '3', 'tb2l6-fill-5': '2',
    'wb2l6-ext-1': '2', 'wb2l6-ext-2': '3', 'wb2l6-ext-3': '1',
    'tb2l6-text1-1': '3', 'tb2l6-text1-2': '2', 'tb2l6-text2-1': '1', 'tb2l6-text2-2': '3',
    'tb2l6-text3-1': '3', 'tb2l6-text3-2': '3', 'tb2l6-text4-1': '2', 'tb2l6-text4-2': '2', 'tb2l6-text4-3': '1', 'tb2l6-text4-4': '2',
  });
  const checks = l6.reader.passages.flatMap((g) => g.checkItems || []);
  assert.equal(checks.length, 10);
  const listening = checks.filter((i) => i.audioSegment);
  assert.equal(listening.length, 8); // 2 reading questions of text 4 carry no segment
  for (const i of listening) {
    const t = l6.reader.audioTracks.find((x) => x.id === i.audioSegment.trackId);
    assert.ok(t && i.audioSegment.end <= t.durationSec, i.id);
    assert.ok(i.promptVi.includes('Câu hỏi nghe hiểu'), i.id);
  }
  for (const i of [...l6.exerciseSet.items, ...checks]) assert.ok(i.answerEvidence && i.answerEvidence.length > 20, i.id);
  const q = Object.fromEntries(checks.map((i) => [i.id, i.promptZh]));
  assert.equal(q['tb2l6-text1-1'], '王一雪和刘明要准备什么礼物？');
  assert.equal(q['tb2l6-text2-1'], '刘小雪想画什么？');
  assert.equal(q['tb2l6-text4-2'], '王一雪今天高高兴兴地过了个生日。');
  assert.equal(q['tb2l6-text4-4'], '孩子们明天为什么要晚点儿起床？');
  // The contested judgment (text 4, item 2) stays FALSE under the book's
  // strict reading and its evidence flags it for independent QA re-judgment.
  const j2 = checks.find((i) => i.id === 'tb2l6-text4-2');
  assert.equal(j2.answer, '2');
  assert.ok(j2.answerEvidence.includes('QA độc lập'), 'contested judgment is flagged in its evidence');
  // Fill-in stems are the printed sentences (TB p.053 / WB p.052), character-for-character.
  const stems = Object.fromEntries(l6.exerciseSet.items.map((i) => [i.id, i.promptZh]));
  assert.equal(stems['tb2l6-fill-1'], '明天10点去小雪家，你别（）了。');
  assert.equal(stems['tb2l6-fill-2'], '衣服在（）上，你看看想穿哪一件？');
  assert.equal(stems['tb2l6-fill-3'], '看，这是我妹妹（）的，漂亮不漂亮？');
  assert.equal(stems['tb2l6-fill-4'], 'A：这是什么？B：送你的礼物，快（）看看。');
  assert.equal(stems['tb2l6-fill-5'], 'A：今天我过了一个非常（）的生日，谢谢爸爸、妈妈！B：不客气！我们都很爱你！');
  assert.equal(stems['wb2l6-ext-1'], '我很喜欢吃（），你呢？');
  assert.equal(stems['wb2l6-ext-2'], '你有（）吗？我想写几个字。');
  assert.equal(stems['wb2l6-ext-3'], '我的手机不能（）了，你能帮忙看看吗？');
  // warm-up items 1-8 are the two printed picture-matching sets; every option
  // carries a redrawn image AND a neutral alt (B6 rule: alt never names the
  // answer's meaning before grading — applies to all graded picture options).
  for (const i of l6.exerciseSet.items.slice(0, 8)) {
    for (const [idx, o] of i.options.entries()) {
      assert.ok(o.image && o.image.startsWith('assets/hsk2-lesson-06/'), i.id);
      assert.equal(o.imageAlt, `Tranh minh họa lựa chọn ${'ABCD'[idx]}`, `${i.id} option ${idx}`);
    }
  }
});

test('hsk2 lesson 6 writing set: 4 chars from writing-book page 6, stroke counts match data files', () => {
  const ws = content.writingSets.find((w) => w.id === 'writing-hsk2-l06');
  assert.ok(ws, 'writing set exists');
  assert.equal(ws.lessonId, 'hsk2-l06');
  assert.deepEqual(ws.chars.map((ch) => ch.char), ['笔', '第', '快', '忙']);
  assert.deepEqual(ws.chars.map((ch) => ch.strokeCount), [10, 11, 7, 6]);
  for (const ch of ws.chars) {
    const data = JSON.parse(readFileSync(new URL(`../data/hanzi/${ch.char}.json`, import.meta.url)));
    assert.equal(data.strokes.length, ch.strokeCount, ch.char);
  }
  const byChar = Object.fromEntries(ws.chars.map((ch) => [ch.char, ch]));
  assert.equal(byChar['笔'].word.zh, '画笔');
  assert.equal(byChar['笔'].sentence.zh, '桌子上有书、画笔什么的。');
  assert.equal(byChar['第'].word.zh, '第二');
  assert.equal(byChar['第'].sentence.zh, '你再好好地写一下第二个字。');
  assert.equal(byChar['快'].word.zh, '快乐');
  assert.equal(byChar['快'].sentence.zh, '我们每天都要快快乐乐的。');
  assert.equal(byChar['忙'].word.zh, '很忙');
  assert.equal(byChar['忙'].sentence.zh, '他很忙，早早地去工作了。');
});

test('hsk2 lesson 6 UI: intro writing entry, writing set page and char page render', async () => {
  await route('lesson/hsk2-l06');
  const entry = $('.writing-entry');
  assert.ok(entry, 'writing entry card on lesson intro');
  assert.ok(entry.textContent.includes('笔'));
  assert.ok(entry.querySelector('a[href="#/writing/hsk2-l06"]'));
  await route('writing/hsk2-l06');
  assert.equal($$('.char-card').length, 4);
  await route('writing/hsk2-l06/w-h2l6-bi');
  assert.ok(document.body.textContent.includes('BƯỚC 1'));
  assert.ok(document.body.textContent.includes('BƯỚC 6'));
  assert.ok($('#hw-view'), 'stroke view box');
  assert.ok($('#hw-quiz'), 'guided quiz box');
  assert.ok($('#hw-self'), 'self writing box');
  assert.ok($('#paper-btn'), 'paper practice button');
  assert.ok($('#review-toggle'), 'needs-review toggle');
  assert.ok($('.static-char').textContent.includes('笔'));
  await route('course/HSK%202');
  assert.equal($$('.lesson-list .row-card').length, 15);
});

test('hsk2 lesson 6 review (D31-D34): enabled, detail covers 14 words + 27 lines, word segments span both readings', async () => {
  const { buildReview, reviewHtml, reviewDetailLabel, REVIEW_WORD_SEGMENTS, REVIEW_PATTERN_SPEECH } = await import('../src/audio-review.js');
  const detail = buildReview(l6, 'detail'), quick = buildReview(l6);
  assert.ok(detail.length > quick.length);
  for (const w of l6.prepWords) assert.ok(detail.some((r) => r.source === w.id && r.text === w.zh), w.zh);
  const joinedZh = (id) => detail.filter((r) => r.source === id && r.paragraph === 0).map((r) => r.text).join('');
  for (const s of l6.reader.sentences) assert.equal(joinedZh(s.id), s.zh, s.id);
  const positions = l6.reader.sentences.map((s) => detail.findIndex((r) => r.source === s.id));
  assert.deepEqual(positions, [...positions].sort((a, b) => a - b));
  for (const s of l6.reader.sentences) {
    const row = detail.find((r) => r.source === s.id);
    if (s.speaker) assert.ok(row.label.includes(s.speaker), row.label);
  }
  assert.ok(detail.every((r) => !l6.exerciseSet.items.some((i) => i.id === r.source)));
  // The tip box counts as a grammar point in the review label (4 = 3 main + tip).
  assert.equal(reviewDetailLabel(l6), '14 từ + 4 điểm ngữ pháp + 4 đoạn');
  assert.ok(reviewHtml(l6).includes('14 từ + 4 điểm ngữ pháp + 4 đoạn'));
  for (const k of l6.knowledgePoints.filter((k) => k.kind === 'grammar')) {
    assert.ok(REVIEW_PATTERN_SPEECH[k.id], k.id);
    assert.ok(!/\p{Script=Han}/u.test(REVIEW_PATTERN_SPEECH[k.id]), k.id);
  }
  const byTrack = new Map();
  for (const w of l6.prepWords) {
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

test('B6 QA fixes: print-faithful describe prompt, sources, writing pinyin, full completions', () => {
  const t1 = l6.selfCheckTasks.find((t) => t.id === 'st-h2l6-01');
  assert.equal(t1.prompts[2], '爷爷过生日，爸爸给他做了＿＿的面条儿。');
  const t2 = l6.selfCheckTasks.find((t) => t.id === 'st-h2l6-02');
  assert.equal(t2.prompts.length, 9);
  assert.ok(t2.prompts[3].includes('你爱吃什么'));
  assert.ok(t2.prompts[7].includes('睡一觉'));
  const ci = l6.reader.passages.flatMap((p) => p.checkItems ?? []).find((c) => c.id === 'tb2l6-text2-1');
  assert.ok(ci.promptVi.includes('tr.048'));
});
