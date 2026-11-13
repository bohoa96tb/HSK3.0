import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { JSDOM } from 'jsdom';
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
  assert.equal(sets.length, 4); // lesson 1 + 2 + 3 + 4 sets (lessons 2-4 checked in their own standard test files)
  const set = sets.find((w) => w.lessonId === 'hsk2-l01');
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

test('vendored Hanzi Writer 3.7.3: factory renders and animates a few-stroke and a many-stroke char', async () => {
  // Regression for the live failure of 2026-11-03: v3 renamed the factory to
  // HanziWriter.create (createWriter no longer exists); src/writing.js must
  // use the v3 name. This test exercises the real vendored library.
  const dom = new JSDOM('<!doctype html><body><div id="v"></div><div id="q"></div></body>', { url: 'https://example.test/HSK3.0/', runScripts: 'dangerously' });
  dom.window.eval(readFileSync(new URL('../assets/vendor/hanzi-writer-3.7.3.min.js', import.meta.url), 'utf8'));
  const HW = dom.window.HanziWriter;
  assert.equal(typeof HW.create, 'function');
  const loader = (char, onComplete, onError) => {
    try { onComplete(JSON.parse(readFileSync(new URL(`../data/hanzi/${char}.json`, import.meta.url)))); } catch (e) { onError(e); }
  };
  const base = { width: 264, height: 264, padding: 14, showOutline: true, delayBetweenStrokes: 1, charDataLoader: loader };
  for (const [id, char] of [['v', '打'], ['q', '接']]) {
    const w = HW.create(dom.window.document.getElementById(id), char, base);
    assert.equal(typeof w.animateCharacter, 'function');
    assert.equal(typeof w.quiz, 'function');
    await new Promise((resolve) => w.animateCharacter({ onComplete: resolve }));
    const svg = dom.window.document.querySelector(`#${id} svg`);
    assert.ok(svg && svg.querySelectorAll('path').length > 10, `${char} rendered`);
  }
});
