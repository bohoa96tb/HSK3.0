import test from "node:test";
import assert from "node:assert/strict";
import {
  normalizeTextAnswer, stripTones, matchesQuery, gradeChoice,
  nextReviewState, isDue, validateProgress, migrateProgress, summarizeAttempts,
  checkTranscriptCopy, emptyProgress,
} from "../src/lib.js";

test("normalizeTextAnswer trims, collapses spaces and drops a trailing full stop", () => {
  assert.equal(normalizeTextAnswer("  你好  吗 。"), "你好 吗");
  assert.equal(normalizeTextAnswer(""), "");
});

test("search matches pinyin with or without tones and hanzi", () => {
  assert.ok(matchesQuery(["你好 Nǐ hǎo"], "ni hao"));
  assert.ok(matchesQuery(["你好 Nǐ hǎo"], "nihao"));
  assert.ok(matchesQuery(["你好 Nǐ hǎo"], "你好"));
  assert.ok(!matchesQuery(["你好 Nǐ hǎo"], "zaijian"));
});

test("gradeChoice only grades verified answers", () => {
  const verified = { answerStatus: "verified-from-print", answer: "c" };
  assert.deepEqual(gradeChoice(verified, "c"), { graded: true, correct: true });
  assert.deepEqual(gradeChoice(verified, "a"), { graded: true, correct: false });
  const unverified = { answerStatus: "unverified", answer: null };
  assert.equal(gradeChoice(unverified, "a").graded, false);
});

test("review schedule: wrong restarts at 1 day, known advances, slow keeps step", () => {
  const now = Date.parse("2026-10-31T00:00:00Z");
  const forgot = nextReviewState({ intervalStep: 3 }, "forgot", now);
  assert.equal(forgot.intervalStep, 0);
  assert.equal(forgot.dueAt, "2026-11-01T00:00:00.000Z");
  const known = nextReviewState({ intervalStep: 0 }, "known", now);
  assert.equal(known.intervalStep, 1);
  assert.equal(known.dueAt, "2026-11-03T00:00:00.000Z");
  const slow = nextReviewState({ intervalStep: 2 }, "slow", now);
  assert.equal(slow.intervalStep, 2);
  assert.equal(slow.dueAt, "2026-11-07T00:00:00.000Z");
  assert.ok(isDue({ dueAt: "2026-10-30T00:00:00Z" }, now));
  assert.ok(!isDue({ dueAt: "2026-11-05T00:00:00Z" }, now));
});

test("backup validation rejects wrong schema and migrates valid data", () => {
  assert.equal(validateProgress({ schemaVersion: 99 }).ok, false);
  assert.equal(validateProgress("nope").ok, false);
  assert.equal(migrateProgress({ schemaVersion: 99 }), null);
  const good = migrateProgress({ schemaVersion: 1, lessons: { "hsk1-l01": { completedSections: ["intro"] } }, attempts: [] });
  assert.ok(good);
  assert.equal(good.settings.showPinyinPrep, true);
  assert.deepEqual(good.lessons["hsk1-l01"].completedSections, ["intro"]);
});

test("attempt summary separates first attempt, retries and hint use", () => {
  const attempts = [
    { exerciseId: "e1", correct: false, hintUsed: false, at: "2026-10-31T01:00:00Z" },
    { exerciseId: "e1", correct: true, hintUsed: true, supportUsed: true, at: "2026-10-31T01:05:00Z" },
    { exerciseId: "e2", correct: true, hintUsed: false, at: "2026-10-31T01:02:00Z" },
  ];
  const sum = summarizeAttempts(attempts, ["e1", "e2"]);
  assert.deepEqual(sum, { answered: 2, firstTotal: 2, firstCorrect: 1, retried: 1, hintUsedCount: 1, supportUsedCount: 1 });
});

test("D36 checkTranscriptCopy accepts hanzi or pinyin, ignores punctuation/spacing", () => {
  const sen = { zh: "你今天去医院吗？", pinyin: "Nǐ jīntiān qù yīyuàn ma?" };
  assert.deepEqual(checkTranscriptCopy("你今天去医院吗", sen), { ok: true, mode: "hanzi" });
  assert.deepEqual(checkTranscriptCopy("你今天去医院吗？", sen), { ok: true, mode: "hanzi" });
  assert.deepEqual(checkTranscriptCopy("Nǐ jīntiān qù yīyuàn ma?", sen), { ok: true, mode: "pinyin" });
  assert.deepEqual(checkTranscriptCopy("ni jintian qu yiyuan ma", sen), { ok: true, mode: "pinyin" });
  assert.deepEqual(checkTranscriptCopy("nijintianquyiyuanma", sen), { ok: true, mode: "pinyin" });
  assert.equal(checkTranscriptCopy("你今天去学校吗", sen).ok, false);
  assert.equal(checkTranscriptCopy("ni jintian qu xuexiao ma", sen).ok, false);
  assert.equal(checkTranscriptCopy("你好 ni hao", sen).ok, false);
  assert.deepEqual(checkTranscriptCopy("  ", sen), { ok: false, mode: null, empty: true });
  const latin = { zh: "AI小语，你好！", pinyin: "AI Xiǎoyǔ, nǐ hǎo!" };
  assert.deepEqual(checkTranscriptCopy("AI小语，你好！", latin), { ok: true, mode: "hanzi" });
  const u = { zh: "绿", pinyin: "lǜ" };
  assert.deepEqual(checkTranscriptCopy("lü", u), { ok: true, mode: "pinyin" });
  assert.deepEqual(checkTranscriptCopy("lu", u), { ok: true, mode: "pinyin" });
});

test("D36 progress gains copy defaults without losing existing data", () => {
  const fresh = emptyProgress();
  assert.ok(!("transcriptCopyMode" in fresh.settings), "D38: copy mode is session-only, never a saved setting");
  assert.deepEqual(fresh.copyDrafts, {});
  const old = { schemaVersion: 1, settings: { showPinyinPrep: false }, attempts: [{ id: "a" }] };
  const migrated = migrateProgress(old);
  assert.ok(!("transcriptCopyMode" in migrated.settings) || migrated.settings.transcriptCopyMode === false);
  assert.equal(migrated.settings.showPinyinPrep, false);
  assert.deepEqual(migrated.copyDrafts, {});
  assert.equal(migrated.attempts.length, 1);
});
