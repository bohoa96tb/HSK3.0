import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { gradeDictationCell } from '../src/lib.js';

const content = JSON.parse(readFileSync(new URL('../data/content.json', import.meta.url), 'utf8'));
const l8 = content.additionalLessons.find((c) => c.lessonId === 'hsk1-l08');
const item = (id) => l8.exerciseSet.items.find((x) => x.id === id);

test('lesson 8 content shape matches the printed book', () => {
  assert.equal(l8.prepWords.length, 24); // 23 new words + 1 proper noun
  assert.equal(l8.knowledgePoints.length, 4);
  assert.equal(l8.reader.sentences.length, 14);
  assert.equal(l8.reader.audioTracks.length, 7);
  assert.equal(l8.exerciseSet.items.length, 19);
  assert.equal(l8.foundationWords.length, 0);
  assert.ok(l8.prepWords.every((w) => w.hanViet && w.hanVietStatus === 'verified-editorial'));
  assert.ok(l8.prepWords.every((w) => w.audio && w.audio.status === 'asr-draft'));
  const hv = Object.fromEntries(l8.prepWords.map((w) => [w.zh, w.hanViet]));
  assert.equal(hv['房间'], 'PHÒNG GIAN');
  assert.equal(hv['只'], 'CHÍCH'); // zhī measure word, not the zhǐ adverb reading
  assert.equal(hv['漂亮'], 'PHIẾU LƯỢNG'); // Thivien records 漂亮 as "phiếu lượng"
  assert.equal(hv['书店'], 'THƯ ĐIẾM');
  assert.equal(hv['医生'], 'Y SINH');
  assert.equal(hv['胡医生'], 'HỒ Y SINH');
  const s12 = l8.reader.sentences.find((s) => s.id === 'l08-s12');
  assert.ok(s12.zh.includes('我爸爸也在医院工作')); // the lesson title inside dialogue 3
});

test('lesson 8 printed answers and statuses', () => {
  const answers = Object.fromEntries(l8.exerciseSet.items.map((i) => [i.id, i.answer]));
  assert.deepEqual(answers, {
    'wb8-text-1': '3', 'wb8-text-2': '1', 'wb8-text-3': '2', 'wb8-text-4': '2',
    'wb8-comp-1': '2', 'wb8-comp-2': '5', 'wb8-comp-3': '1', 'wb8-comp-4': '3', 'wb8-comp-5': '4',
    'wb8-warm-1': '4', 'wb8-warm-2': '3', 'wb8-warm-3': '1', 'wb8-warm-4': '5', 'wb8-warm-5': '6', 'wb8-warm-6': '2',
    'wb8-redup-1': '2', 'wb8-redup-2': '3', 'wb8-redup-3': '2', 'wb8-redup-4': '1',
  });
  for (const id of Object.keys(answers)) {
    const expected = id.startsWith('wb8-redup') ? 'verified-editorial' : 'verified-from-print';
    assert.equal(item(id).answerStatus, expected, id);
  }
});

test('lesson 8 review links follow the blank-tested feature only (D17)', () => {
  const g = (id) => item(id).grammarIds;
  assert.deepEqual(g('wb8-text-1'), ['kp-hsk1-l08-positional']); // blank is 书店前 — the 前 positional
  assert.deepEqual(g('wb8-text-2'), ['kp-hsk1-l08-neng']); // blank completes 能到
  assert.deepEqual(g('wb8-text-3'), []);
  assert.deepEqual(g('wb8-text-4'), []);
  assert.deepEqual(g('wb8-comp-1'), ['kp-hsk1-l08-zai']);
  assert.deepEqual(g('wb8-comp-2'), ['kp-hsk1-l08-neng']);
  assert.deepEqual(g('wb8-comp-3'), []); // 哪儿 has no knowledge point — left empty, not near-matched
  assert.deepEqual(g('wb8-comp-4'), ['kp-hsk1-l08-positional']); // 桌子下 — the 下 positional
  assert.deepEqual(g('wb8-comp-5'), []);
  for (const id of ['wb8-warm-1','wb8-warm-2','wb8-warm-3','wb8-warm-4','wb8-warm-5','wb8-warm-6']) assert.deepEqual(g(id), []);
  for (const id of ['wb8-redup-1','wb8-redup-2','wb8-redup-3','wb8-redup-4']) assert.deepEqual(g(id), ['kp-hsk1-l08-reduplication']);
  const allk = Object.fromEntries(content.additionalLessons.flatMap((x) => x.knowledgePoints).map((k) => [k.id, k]));
  assert.deepEqual(allk['kp-hsk1-l08-positional'].exerciseIds, ['wb8-text-1', 'wb8-comp-4']);
  assert.deepEqual(allk['kp-hsk1-l08-zai'].exerciseIds, ['wb8-comp-1']);
  assert.deepEqual(allk['kp-hsk1-l08-neng'].exerciseIds, ['wb8-text-2', 'wb8-comp-2']);
  assert.deepEqual(allk['kp-hsk1-l08-reduplication'].exerciseIds, ['wb8-redup-1', 'wb8-redup-2', 'wb8-redup-3', 'wb8-redup-4']);
});

test('lesson 8 warm-up picture options follow the printed order and use new illustration assets', () => {
  const opts = item('wb8-warm-1').options;
  assert.deepEqual(opts.map((o) => o.zh), ['书店', '房间', '学校', '小猫', '医生', '桌子']); // printed photo order 1-6
  assert.equal(new Set(opts.map((o) => o.image)).size, 6);
  for (const o of opts) {
    assert.ok(o.image.startsWith('assets/lesson-08/'), o.image);
    assert.ok(existsSync(new URL('../' + o.image, import.meta.url)), o.image);
    assert.ok(o.imageAlt.length > 0);
  }
  // Warm-up word D in the printed list is 医生 (doctors), not 医院.
  assert.equal(item('wb8-warm-4').promptZh, '医生');
  // The same six options back every warm-up item.
  for (const id of ['wb8-warm-2','wb8-warm-3','wb8-warm-4','wb8-warm-5','wb8-warm-6']) {
    assert.deepEqual(item(id).options.map((o) => o.id), ['1','2','3','4','5','6']);
  }
});

test('lesson 8 syllable task is graded from the reposted listening script (verified-editorial)', () => {
  const t = l8.selfCheckTasks.find((x) => x.id === 'st-l08-01');
  assert.equal(t.answerStatus, 'verified-editorial');
  assert.equal(t.gradingMode, 'syllable');
  assert.deepEqual(t.prompts, ['lián / nián', 'rěn / shěn', 'diē / tiē', 'chǎn / chǎng', 'liè / lüè', 'hún / fén', 'bīn / bīng', 'gǒng / kòng']);
  assert.deepEqual(t.answers, ['nián', 'rěn', 'tiē', 'chǎn', 'lüè', 'hún', 'bīng', 'kǒng']); // script p.022 prints only the read syllable
  assert.equal(gradeDictationCell(t, 0, 'nián').correct, true);
  assert.equal(gradeDictationCell(t, 0, 'nian2').correct, true);
  assert.equal(gradeDictationCell(t, 0, 'lián').correct, false);
  assert.equal(gradeDictationCell(t, 4, 'lüè').correct, true);
  assert.equal(gradeDictationCell(t, 4, 'liè').correct, false);
  assert.deepEqual(t.audioSegment, { start: 61.4, end: 100.4 });
});

test('lesson 8 describe-pictures pairing follows the corrected print reading', () => {
  const t = l8.selfCheckTasks.find((x) => x.id === 'st-l08-02');
  assert.equal(t.answerStatus, 'unverified');
  assert.deepEqual(t.prompts, ['医生______。', '我们在______见吧。', '你______去______吗？', '桌子上______。']);
  assert.deepEqual(t.promptImages.map((f) => f.src), [
    'assets/lesson-08/speak-doctors.webp', 'assets/lesson-08/speak-bookstore.webp',
    'assets/lesson-08/speak-supermarket.webp', 'assets/lesson-08/speak-cat.webp',
  ]);
  for (const f of t.promptImages) assert.ok(existsSync(new URL('../' + f.src, import.meta.url)), f.src);
});

test('lesson 8 option audio maps to the track that actually speaks the option (D17 regression)', () => {
  const optAudio = (id, oid) => item(id).options.find((o) => o.id === oid).audio;
  assert.equal(optAudio('wb8-text-1', '3').trackId, 'trk-tb-l08-3'); // 书店前 is spoken in dialogue 2
  assert.equal(optAudio('wb8-text-2', '1').trackId, 'trk-tb-l08-3'); // 两点
  assert.equal(optAudio('wb8-text-3', '2').trackId, 'trk-tb-l08-5'); // 病人多
  assert.equal(optAudio('wb8-text-4', '2').trackId, 'trk-tb-l08-5'); // 两个
  const bank = item('wb8-comp-1').options; // shared bank across comp items
  assert.equal(bank.find((o) => o.zh === '哪儿').audio.trackId, 'trk-tb-l08-1');
  assert.equal(bank.find((o) => o.zh === '桌子').audio.trackId, 'trk-tb-l08-1');
  for (const id of ['wb8-redup-1','wb8-redup-2','wb8-redup-3','wb8-redup-4']) {
    for (const o of item(id).options) assert.equal(o.audio.trackId, 'trk-wb-l08-1', `${id}/${o.id}`);
  }
});

test('lesson 8 QA fixes: printed wording kept verbatim and alt text describes only what is drawn', () => {
  const neng = l8.knowledgePoints.find((k) => k.id === 'kp-hsk1-l08-neng');
  assert.equal(neng.examples[2].zh, '我不能去学校吃午饭。'); // printed p.058 reads 吃午饭, not 吃饭
  assert.ok(neng.explanationVi.includes('吃午饭'));
  const pos = l8.knowledgePoints.find((k) => k.id === 'kp-hsk1-l08-positional');
  assert.ok(!pos.explanationVi.includes('cả ba ý này'));
  const warmOpts = item('wb8-warm-3').options;
  assert.ok(!warmOpts.some((o) => (o.imageAlt || '').includes('Books')));
  assert.ok(!l8.intro.contextImage.alt.includes('ghế'));
});
