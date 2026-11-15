import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { JSDOM } from 'jsdom';
const content = JSON.parse(readFileSync(new URL('../data/content.json', import.meta.url)));
const l7 = content.additionalLessons.find((c) => c.lessonId === 'hsk2-l07');
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

test('hsk2 lesson 7 build: 21 sentences, 15 words in 4 groups, 8 tracks', () => {
  assert.equal(l7.reader.sentences.length, 21);
  assert.deepEqual(l7.reader.passages.map((g) => g.sentenceIds.length), [5, 6, 6, 4]);
  assert.deepEqual(l7.prepWords.map((w) => w.dialogueGroup), [1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 3, 3, 3, 4, 4]);
  assert.deepEqual(l7.prepGroups.map((g) => g.trackId), ['trk-tb2-l07-2', 'trk-tb2-l07-4', 'trk-tb2-l07-6', 'trk-tb2-l07-8']);
  for (const w of l7.prepWords) assert.ok(w.audio && w.audio.status === 'asr-draft', w.id);
  assert.equal(l7.prepWords.length, 15);
  assert.deepEqual(l7.prepWords.map((w) => w.zh), ['从', '往', '跑', '打', '篮球', '运动', '踢', '足球', '球', '得', '跑步', '游泳', '游', '爱好', '开始']);
  const tracks = l7.reader.audioTracks.filter((t) => t.id.startsWith('trk-tb2-'));
  assert.equal(tracks.length, 8);
  for (const [i, t] of tracks.entries()) {
    assert.equal(t.url, `https://cdn.baulchino.com/new-hsk-books-audios/hsk-2-textbook/lesson-07/7-${i + 1}.mp3`, t.id);
  }
  const wbTrack = l7.reader.audioTracks.find((t) => t.id === 'trk-wb2-l07-1');
  assert.ok(wbTrack, 'workbook listening track registered');
  assert.equal(wbTrack.url, 'https://cdn.baulchino.com/new-hsk-books-audios/hsk-2-workbook/lesson-07/07-1.mp3');
  assert.equal(wbTrack.durationSec, 541.82);
  for (const s of l7.reader.sentences) {
    const t = tracks.find((x) => x.id === s.audio.trackId);
    assert.ok(t && s.audio.end <= t.durationSec && s.audio.start < s.audio.end, s.id);
    assert.equal(s.transcriptStatus, 'print-verified', s.id);
  }
  // Speakers: An Ni + Chen Tianzhong; text 4 is Chen Tianzhong's diary
  // (narrator = Chen Tianzhong for all four lines).
  assert.equal(l7.reader.sentences[0].speaker, 'Trần Thiên Trung');
  assert.equal(l7.reader.sentences[1].speaker, 'An Ni');
  assert.equal(l7.reader.sentences[5].speaker, 'An Ni');
  assert.equal(l7.reader.sentences[11].speaker, 'Trần Thiên Trung');
  for (const s of l7.reader.sentences.slice(17)) assert.equal(s.speaker, 'Trần Thiên Trung', s.id);
});

test('hsk2 lesson 7 build: 3 grammar points with the printed examples + character foundation, NO tip box', () => {
  const main = l7.knowledgePoints.filter((k) => k.kind === 'grammar');
  assert.equal(main.length, 3);
  // Lesson 7 has NO 小语助力 tip box in print — none may be invented.
  assert.ok(!l7.knowledgePoints.some((k) => k.id.includes('tip')), 'no tip KP in lesson 7');
  for (const k of main) {
    assert.ok(k.useWhenVi && k.useWhenVi.length > 10, k.id);
    assert.ok(k.quickCheck && ['1', '2'].includes(k.quickCheck.answer), k.id);
    assert.equal(k.examples.length, 3, k.id);
  }
  const exZh = Object.fromEntries(main.map((k) => [k.id, k.examples.map((e) => e.zh)]));
  assert.deepEqual(exZh['kp-hsk2-l07-yi-jiu'], ['你怎么一下课就往外跑？', '我一到家，妈妈就打来电话了。', '一到星期六，陈天中就跟同学去打篮球。']);
  assert.deepEqual(exZh['kp-hsk2-l07-state-complement-1'], ['我踢得还可以。', '他们玩得很高兴。', '白家月跑得不快。']);
  assert.deepEqual(exZh['kp-hsk2-l07-state-complement-2'], ['我游泳游得不快。', '你篮球打得怎么样？', '白家月写汉字写得很好看。']);
  const f = l7.knowledgePoints.find((k) => k.kind === 'foundation-characters');
  assert.ok(f && f.title.includes('足字旁') && f.title.includes('双人旁'), 'foundation KP covers both radicals');
  assert.deepEqual(f.examples.map((e) => e.zh), ['跑', '踢', '往', '很']);
  assert.equal(l7.learningPath.length, 6);
  assert.equal(l7.summaryPoints.length, 5);
  for (const sp of l7.summaryPoints) assert.ok(sp.exampleZh && sp.bodyVi, sp.titleVi);
});

test('hsk2 lesson 7: 12 set items and 10 printed dialogue checks (D28)', () => {
  assert.equal(l7.exerciseSet.items.length, 12);
  const answers = Object.fromEntries([...l7.exerciseSet.items, ...l7.reader.passages.flatMap((g) => g.checkItems || [])].map((i) => [i.id, i.answer]));
  assert.deepEqual(answers, {
    'tb2l7-warm-1': '1', 'tb2l7-warm-2': '2', 'tb2l7-warm-3': '3', 'tb2l7-warm-4': '4',
    'tb2l7-fill-1': '5', 'tb2l7-fill-2': '4', 'tb2l7-fill-3': '1', 'tb2l7-fill-4': '2', 'tb2l7-fill-5': '3',
    'wb2l7-ext-1': '1', 'wb2l7-ext-2': '3', 'wb2l7-ext-3': '2',
    'tb2l7-text1-1': '3', 'tb2l7-text1-2': '2', 'tb2l7-text2-1': '2', 'tb2l7-text2-2': '3',
    'tb2l7-text3-1': '3', 'tb2l7-text3-2': '1', 'tb2l7-text4-1': '1', 'tb2l7-text4-2': '2', 'tb2l7-text4-3': '1', 'tb2l7-text4-4': '1',
  });
  const checks = l7.reader.passages.flatMap((g) => g.checkItems || []);
  assert.equal(checks.length, 10);
  const listening = checks.filter((i) => i.audioSegment);
  assert.equal(listening.length, 8); // 2 reading questions of text 4 carry no segment
  for (const i of listening) {
    const t = l7.reader.audioTracks.find((x) => x.id === i.audioSegment.trackId);
    assert.ok(t && i.audioSegment.end <= t.durationSec, i.id);
    assert.ok(i.promptVi.includes('Câu hỏi nghe hiểu'), i.id);
  }
  for (const i of [...l7.exerciseSet.items, ...checks]) assert.ok(i.answerEvidence && i.answerEvidence.length > 20, i.id);
  const q = Object.fromEntries(checks.map((i) => [i.id, i.promptZh]));
  assert.equal(q['tb2l7-text1-1'], '安妮是什么时候回来的？');
  assert.equal(q['tb2l7-text2-2'], '星期天陈天中跟谁去玩？');
  // Unlike lesson 6, text 4 judgment 1 here is TRUE (the diary opens with
  // 我的爱好是运动); judgment 2 stays FALSE （游泳游得也很快）.
  assert.equal(q['tb2l7-text4-1'], '陈天中非常喜欢运动。');
  assert.equal(checks.find((i) => i.id === 'tb2l7-text4-1').answer, '1');
  assert.equal(q['tb2l7-text4-2'], '陈天中游泳游得不快。');
  assert.equal(checks.find((i) => i.id === 'tb2l7-text4-2').answer, '2');
  assert.equal(q['tb2l7-text4-4'], '陈天中一有时间就做什么？');
  // Fill-in stems are the printed sentences (TB p.062 / WB p.062), character-for-character.
  const stems = Object.fromEntries(l7.exerciseSet.items.map((i) => [i.id, i.promptZh]));
  assert.equal(stems['tb2l7-fill-1'], '你看过她（）吗？游得怎么样？');
  assert.equal(stems['tb2l7-fill-2'], '我们9点（）上课，你别来晚了。');
  assert.equal(stems['tb2l7-fill-3'], '你（）跑得快不快？我想跟你一起去运动。');
  assert.equal(stems['tb2l7-fill-4'], 'A：你喜欢什么（）？B：足球、篮球什么的都喜欢。');
  assert.equal(stems['tb2l7-fill-5'], 'A：你喜欢学中文吗？B：喜欢，我（）8岁就开始学中文了。');
  assert.equal(stems['wb2l7-ext-1'], '今天吃（）饺子，好不好？');
  assert.equal(stems['wb2l7-ext-2'], '我认识那个（）。');
  assert.equal(stems['wb2l7-ext-3'], '这是姐姐新买的（）。');
  // warm-up is ONE printed picture-matching part (4 sports words); every
  // option carries a redrawn image AND a neutral alt (B6 rule).
  for (const i of l7.exerciseSet.items.slice(0, 4)) {
    for (const [idx, o] of i.options.entries()) {
      assert.ok(o.image && o.image.startsWith('assets/hsk2-lesson-07/'), i.id);
      assert.equal(o.imageAlt, `Tranh minh họa lựa chọn ${'ABCD'[idx]}`, `${i.id} option ${idx}`);
    }
  }
});

test('hsk2 lesson 7 writing set: 4 chars from writing-book page 7, stroke counts match data files', () => {
  const ws = content.writingSets.find((w) => w.id === 'writing-hsk2-l07');
  assert.ok(ws, 'writing set exists');
  assert.equal(ws.lessonId, 'hsk2-l07');
  assert.deepEqual(ws.chars.map((ch) => ch.char), ['跑', '踢', '往', '很']);
  assert.deepEqual(ws.chars.map((ch) => ch.strokeCount), [12, 15, 8, 9]);
  for (const ch of ws.chars) {
    const data = JSON.parse(readFileSync(new URL(`../data/hanzi/${ch.char}.json`, import.meta.url)));
    assert.equal(data.strokes.length, ch.strokeCount, ch.char);
  }
  const byChar = Object.fromEntries(ws.chars.map((ch) => [ch.char, ch]));
  assert.equal(byChar['跑'].word.zh, '跑步');
  assert.equal(byChar['跑'].sentence.zh, '他跑步跑得很快。');
  assert.equal(byChar['踢'].word.zh, '踢球');
  assert.equal(byChar['踢'].sentence.zh, '他一到星期天就去踢球。');
  assert.equal(byChar['往'].word.zh, '往外');
  assert.equal(byChar['往'].sentence.zh, '你怎么一下课就往外跑？');
  assert.equal(byChar['很'].word.zh, '很好');
  assert.equal(byChar['很'].sentence.zh, '我写汉字写得很好。');
});

test('hsk2 lesson 7 UI: intro writing entry, writing set page and char page render', async () => {
  await route('lesson/hsk2-l07');
  const entry = $('.writing-entry');
  assert.ok(entry, 'writing entry card on lesson intro');
  assert.ok(entry.textContent.includes('跑'));
  assert.ok(entry.querySelector('a[href="#/writing/hsk2-l07"]'));
  await route('writing/hsk2-l07');
  assert.equal($$('.char-card').length, 4);
  await route('writing/hsk2-l07/w-h2l7-pao');
  assert.ok(document.body.textContent.includes('BƯỚC 1'));
  assert.ok(document.body.textContent.includes('BƯỚC 6'));
  assert.ok($('#hw-view'), 'stroke view box');
  assert.ok($('#hw-quiz'), 'guided quiz box');
  assert.ok($('#hw-self'), 'self writing box');
  assert.ok($('#paper-btn'), 'paper practice button');
  assert.ok($('#review-toggle'), 'needs-review toggle');
  assert.ok($('.static-char').textContent.includes('跑'));
  await route('course/HSK%202');
  assert.equal($$('.lesson-list .row-card').length, 15);
});

test('hsk2 lesson 7 review (D31-D34): enabled, detail covers 15 words + 21 lines, word segments span both readings', async () => {
  const { buildReview, reviewHtml, reviewDetailLabel, REVIEW_WORD_SEGMENTS, REVIEW_PATTERN_SPEECH } = await import('../src/audio-review.js');
  const detail = buildReview(l7, 'detail'), quick = buildReview(l7);
  assert.ok(detail.length > quick.length);
  for (const w of l7.prepWords) assert.ok(detail.some((r) => r.source === w.id && r.text === w.zh), w.zh);
  const joinedZh = (id) => detail.filter((r) => r.source === id && r.paragraph === 0).map((r) => r.text).join('');
  for (const s of l7.reader.sentences) assert.equal(joinedZh(s.id), s.zh, s.id);
  const positions = l7.reader.sentences.map((s) => detail.findIndex((r) => r.source === s.id));
  assert.deepEqual(positions, [...positions].sort((a, b) => a - b));
  for (const s of l7.reader.sentences) {
    const row = detail.find((r) => r.source === s.id);
    if (s.speaker) assert.ok(row.label.includes(s.speaker), row.label);
  }
  assert.ok(detail.every((r) => !l7.exerciseSet.items.some((i) => i.id === r.source)));
  // No tip box in this lesson: the label counts exactly the 3 grammar points.
  assert.equal(reviewDetailLabel(l7), '15 từ + 3 điểm ngữ pháp + 4 đoạn');
  assert.ok(reviewHtml(l7).includes('15 từ + 3 điểm ngữ pháp + 4 đoạn'));
  for (const k of l7.knowledgePoints.filter((k) => k.kind === 'grammar')) {
    assert.ok(REVIEW_PATTERN_SPEECH[k.id], k.id);
    assert.ok(!/\p{Script=Han}/u.test(REVIEW_PATTERN_SPEECH[k.id]), k.id);
  }
  const byTrack = new Map();
  for (const w of l7.prepWords) {
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

test('hsk2 lesson 7 self-checks: print-faithful describe prompts, warm-up 2 speaking table, group survey', () => {
  const desc = l7.selfCheckTasks.find((t) => t.id === 'st-h2l7-01');
  assert.deepEqual(desc.prompts, ['她喜欢画画，＿＿。', '她＿＿有时间就＿＿。', '我的＿＿是唱歌，一有时间我就去唱歌。', '你们＿＿这里＿＿前走，那边更漂亮。']);
  assert.equal(desc.promptImages.length, 4);
  const completions = l7.selfCheckTasks.find((t) => t.id === 'st-h2l7-02');
  assert.equal(completions.prompts.length, 9);
  const warm2 = l7.selfCheckTasks.find((t) => t.id === 'st-h2l7-03');
  assert.deepEqual(warm2.prompts, ['吃完早饭，我＿＿。', '下课，我＿＿。', '回家，我＿＿。']);
  const survey = l7.selfCheckTasks.find((t) => t.id === 'st-h2l7-05');
  assert.ok(survey.prompts[0].includes('你有什么爱好'));
  assert.equal(l7.selfCheckTasks.length, 5);
});
