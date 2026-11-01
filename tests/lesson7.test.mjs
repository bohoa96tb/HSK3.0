import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { gradeDictationCell, gradeDictation } from '../src/lib.js';

const content = JSON.parse(readFileSync(new URL('../data/content.json', import.meta.url), 'utf8'));
const l7 = content.additionalLessons.find((c) => c.lessonId === 'hsk1-l07');
const item = (id) => l7.exerciseSet.items.find((x) => x.id === id);

test('lesson 7 content shape matches the printed book', () => {
  assert.match(content.contentVersion, /^2026/);
  assert.equal(l7.prepWords.length, 27);
  assert.equal(l7.knowledgePoints.length, 6);
  assert.equal(l7.reader.sentences.length, 14);
  assert.equal(l7.reader.audioTracks.length, 7);
  assert.equal(l7.foundationWords.length, 0); // pronunciation content is syllable pairs, no characters
  assert.ok(l7.prepWords.every((w) => w.hanViet && w.hanVietStatus === 'verified-editorial'));
  const hv = Object.fromEntries(l7.prepWords.map((w) => [w.zh, w.hanViet]));
  assert.equal(hv['现在'], 'HIỆN TẠI');
  assert.equal(hv['电影院'], 'ĐIỆN ẢNH VIỆN');
  assert.equal(hv['见'], 'KIẾN');
  assert.equal(hv['分钟'], 'PHÂN CHUNG');
  assert.equal(hv['后'], 'HẬU');
  assert.equal(hv['里'], 'LÝ');
  const s11 = l7.reader.sentences.find((s) => s.id === 'l07-s11');
  assert.equal(s11.zh, '我晚上六点半下班。'); // the lesson title sentence, printed p.051
});

test('lesson 7 printed answers and review links', () => {
  const answers = Object.fromEntries(l7.exerciseSet.items.map((i) => [i.id, i.answer]));
  assert.deepEqual(answers, {
    'wb7-text-1': '2', 'wb7-text-2': '1', 'wb7-text-3': '3', 'wb7-text-4': '3',
    'wb7-comp-1': '3', 'wb7-comp-2': '2', 'wb7-comp-3': '5', 'wb7-comp-4': '4', 'wb7-comp-5': '1',
  });
  assert.ok(l7.exerciseSet.items.every((i) => i.answerStatus === 'verified-from-print'));
  // Review links follow the blank-tested feature only (2026-11-01 rule);
  // items testing dialogue content or a noun with no knowledge point stay empty.
  const g = (id) => item(id).grammarIds;
  assert.deepEqual(g('wb7-text-1'), []);
  assert.deepEqual(g('wb7-text-2'), []); // blank tests the verb phrase; 呢 is given in the source sentence, not tested
  assert.deepEqual(g('wb7-text-3'), ['kp-hsk1-l07-ne']); // the item's stem itself is a 呢 declarative to complete
  assert.deepEqual(g('wb7-text-4'), ['kp-hsk1-l07-time2']);
  assert.deepEqual(g('wb7-comp-1'), []);
  assert.deepEqual(g('wb7-comp-2'), ['kp-hsk1-l07-time2']);
  assert.deepEqual(g('wb7-comp-3'), ['kp-hsk1-l07-ba']);
  assert.deepEqual(g('wb7-comp-4'), []); // blank is a bank word choice （现在）; no KP teaches it — left empty per D17, not near-matched
  assert.deepEqual(g('wb7-comp-5'), []);
  const allk = Object.fromEntries(content.additionalLessons.flatMap((x) => x.knowledgePoints).map((k) => [k.id, k]));
  assert.deepEqual(allk['kp-hsk1-l07-time2'].exerciseIds, ['wb7-text-4', 'wb7-comp-2']);
  assert.deepEqual(allk['kp-hsk1-l07-ba'].exerciseIds, ['wb7-comp-3']);
  assert.deepEqual(allk['kp-hsk1-l07-adverbial'].exerciseIds, []);
  assert.deepEqual(allk['kp-hsk1-l07-ne'].exerciseIds, ['wb7-text-3']);
});

test('lesson 7 pronunciation tasks ship unverified until the script evidence lands', () => {
  const t1 = l7.selfCheckTasks.find((t) => t.id === 'st-l07-01');
  const t2 = l7.selfCheckTasks.find((t) => t.id === 'st-l07-02');
  assert.equal(t1.prompts.length, 12);
  assert.equal(t2.prompts.length, 16);
  for (const t of [t1, t2]) {
    assert.equal(t.answerStatus, 'unverified');
    assert.equal(t.answers, undefined);
    assert.deepEqual(gradeDictationCell(t, 0, 'gǔ'), { graded: false, reason: 'unverified-answer' });
    assert.equal(gradeDictation(t, ['gǔ']).total, 0);
  }
  const t3 = l7.selfCheckTasks.find((t) => t.id === 'st-l07-03');
  assert.equal(t3.kind, 'speaking');
  assert.equal(t3.prompts.length, 4);
});
