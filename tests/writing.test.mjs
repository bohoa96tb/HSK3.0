import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { emptyProgress, migrateProgress, validateProgress, markWriting, writingEntryOf, writingStageCount, isWritingDue } from '../src/lib.js';

const content = JSON.parse(readFileSync(new URL('../data/content.json', import.meta.url)));

test('writing progress: schema carries a writing map and migration preserves old data', () => {
  const fresh = emptyProgress();
  assert.deepEqual(fresh.writing, {});
  const old = emptyProgress();
  delete old.writing; // simulate a backup exported before the writing area existed
  old.lessons['hsk1-l01'] = { completedSections: ['intro'], lastSectionId: 'intro', updatedAt: null };
  const migrated = migrateProgress(old);
  assert.deepEqual(migrated.writing, {});
  assert.deepEqual(migrated.lessons['hsk1-l01'].completedSections, ['intro']);
  assert.equal(validateProgress(migrated).ok, true);
  const withWriting = emptyProgress();
  withWriting.writing['w-x'] = { seen: true };
  assert.equal(validateProgress(withWriting).ok, true);
});

test('writing progress: markWriting stages and 1/3/7-day review spacing', () => {
  const t0 = Date.parse('2026-11-03T00:00:00.000Z');
  let e = markWriting(null, { seen: true }, t0);
  assert.equal(writingStageCount(e), 1);
  assert.equal(e.dueAt, '2026-11-04T00:00:00.000Z'); // 1 stage -> +1 day
  e = markWriting(e, { practiced: true }, t0);
  assert.equal(e.dueAt, '2026-11-06T00:00:00.000Z'); // 2 stages -> +3 days
  e = markWriting(e, { self: true }, t0);
  assert.equal(e.dueAt, '2026-11-10T00:00:00.000Z'); // 3 stages -> +7 days
  e = markWriting(e, { paper: true }, t0);
  assert.equal(e.dueAt, '2026-11-10T00:00:00.000Z'); // capped at +7 days
  const flagged = markWriting(e, { needsReview: true }, t0);
  assert.equal(flagged.dueAt, '2026-11-04T00:00:00.000Z'); // needsReview -> due in 1 day
  assert.equal(isWritingDue(flagged, t0), true); // flagged chars always count as due
  assert.equal(isWritingDue(e, t0), false);
  assert.equal(isWritingDue(e, Date.parse('2026-11-11T00:00:00.000Z')), true);
  const p = emptyProgress();
  p.writing['w-x'] = flagged;
  assert.equal(writingEntryOf(p, 'w-x'), flagged);
  assert.equal(writingEntryOf(p, 'w-missing'), null);
});

test('writing data: HSK2 lesson 1 set matches the writing book page 1 inventory', () => {
  const sets = content.writingSets || [];
  assert.equal(sets.length, 1);
  const set = sets[0];
  assert.equal(set.lessonId, 'hsk2-l01');
  // Book order from the writing book page 1 (read directly from page image):
  assert.deepEqual(set.chars.map((c) => c.char), ['打', '接', '冷', '次']);
  const expected = {
    '打': { strokes: 5, word: '打电话', sentence: '请你给她打个电话。' },
    '接': { strokes: 11, word: '接人', sentence: '他让我去接一个人。' },
    '冷': { strokes: 7, word: '很冷', sentence: '北京现在很冷吧？' },
    '次': { strokes: 6, word: '这次', sentence: '我这次是一个人来的。' },
  };
  for (const ch of set.chars) {
    const exp = expected[ch.char];
    assert.equal(ch.strokeCount, exp.strokes, ch.char);
    assert.equal(ch.word.zh, exp.word, ch.char);
    assert.equal(ch.sentence.zh, exp.sentence, ch.char);
    assert.ok(ch.sourceRefs.length >= 1, ch.char);
    // Self-hosted stroke data exists and its stroke count matches the book.
    const dataPath = new URL(`../data/hanzi/${ch.char}.json`, import.meta.url);
    assert.ok(existsSync(dataPath), `missing stroke data for ${ch.char}`);
    const data = JSON.parse(readFileSync(dataPath));
    assert.equal(data.strokes.length, ch.strokeCount, `${ch.char} stroke data count`);
  }
});

test('writing tech: vendored Hanzi Writer + license files are present', () => {
  assert.ok(existsSync(new URL('../assets/vendor/hanzi-writer-3.7.3.min.js', import.meta.url)));
  assert.ok(existsSync(new URL('../assets/vendor/HANZI-WRITER-LICENSE.txt', import.meta.url)));
  assert.ok(existsSync(new URL('../data/hanzi/ARPHICPL.TXT', import.meta.url)));
  const src = content.sources.find((s) => s.id === 'src-hanzi-stroke-data');
  assert.ok(src && src.rightsStatus === 'licensed');
});
