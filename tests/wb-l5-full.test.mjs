import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import { createHash } from "node:crypto";
// Workbook HSK 2 Lesson 5 (D44, release 20261113-hsk2-l5-wb): the full
// 30-question 模拟测练 added alongside the lesson — printed pages 043-050
// (PDF 50-57). Reading/Writing answers follow the print inventory
// (L5_AUDIT); Listening answers and transcripts are read from the book's
// own audio (track 05-1, 557.59 s) — the book prints neither an answer key
// nor scripts, so every answer stays verified-editorial. Every listening
// window was checked by RMS envelope analysis to contain BOTH readings
// (ASR-VAD dropped the second reading of Q6; the envelope shows both
// readings inside the chosen window).
const content = JSON.parse(readFileSync(new URL("../data/content.json", import.meta.url)));
const l5 = content.additionalLessons.find((c) => c.lessonId === "hsk2-l05");

test("wb l5 listening: answers, transcripts and shared-example content (evidence: book audio, envelope-checked)", () => {
  const L = l5.wbListening;
  assert.equal(L.trackId, "trk-wb2-l05-1");
  const answers = {};
  const lines = {};
  const windows = {};
  for (const p of L.parts) for (const it of [p.example, ...p.items]) {
    answers[it.id] = it.answer;
    if (it.lines) lines[it.id] = it.lines.map((x) => x.zh);
    if (it.audio) windows[it.id] = [it.audio.start, it.audio.end];
  }
  assert.deepEqual(answers, {
    "wb2-l5-p1-ex": "A", "wb2-l5-p1-q1": "C", "wb2-l5-p1-q2": "C", "wb2-l5-p1-q3": "B",
    "wb2-l5-p2-ex": "D", "wb2-l5-p2-q4": "B", "wb2-l5-p2-q5": "C", "wb2-l5-p2-q6": "A",
    "wb2-l5-p3-ex": "A", "wb2-l5-p3-q7": "A", "wb2-l5-p3-q8": "C", "wb2-l5-p3-q9": "C", "wb2-l5-p3-q10": "A",
  });
  assert.deepEqual(windows, {
    "wb2-l5-p1-ex": [57.4, 67.6], "wb2-l5-p1-q1": [79, 91.3], "wb2-l5-p1-q2": [99.3, 110.3], "wb2-l5-p1-q3": [118.4, 132.5],
    "wb2-l5-p2-ex": [153.4, 167.6], "wb2-l5-p2-q4": [184.9, 200.7], "wb2-l5-p2-q5": [213.4, 232.8], "wb2-l5-p2-q6": [245.6, 265.9],
    "wb2-l5-p3-ex": [288.4, 315.5], "wb2-l5-p3-q7": [336.4, 367.2], "wb2-l5-p3-q8": [383.9, 416.8], "wb2-l5-p3-q9": [432, 479.2], "wb2-l5-p3-q10": [495.5, 544.2],
  });
  assert.deepEqual(lines["wb2-l5-p1-q1"], ["我已经准备好送的东西了。"]);
  assert.deepEqual(lines["wb2-l5-p1-q2"], ["你快下来吧。", "我在这儿等你呢。"]);
  assert.deepEqual(lines["wb2-l5-p1-q3"], ["那边有一家奶茶店。", "我们去喝杯奶茶吧。"]);
  assert.deepEqual(lines["wb2-l5-p2-q4"], ["公交车怎么还不来？", "不知道啊。", "我都不想等了。"]);
  assert.deepEqual(lines["wb2-l5-p2-q5"], ["你再等等，我一会儿就下去。", "你快点儿吧，出租车已经到了。"]);
  assert.deepEqual(lines["wb2-l5-p2-q6"], ["今天的菜都是我爱吃的。", "对呀。", "因为这些菜都是给你准备的。"]);
  assert.deepEqual(lines["wb2-l5-p3-q7"], ["都十一点了，别玩手机了，快睡觉吧。", "我没玩手机，我在看书呢。"]);
  assert.deepEqual(lines["wb2-l5-p3-q8"], ["外边冷，这儿有个奶茶店，我们进去等吧。", "别去了，公交车一会儿就来了。"]);
  assert.deepEqual(lines["wb2-l5-p3-q9"], ["这是给谁准备的礼物？", "给小雪的爷爷奶奶准备的。", "有茶，还有牛奶。", "要不要再买点儿水果？", "好，我一会儿就去买。"]);
  assert.deepEqual(lines["wb2-l5-p3-q10"], ["奶奶，您在家吗？", "在家呢。今天天气不好，我没出去。", "那我过去看看您。", "好。你别买东西，我这儿吃的喝的都有。"]);
});

test("wb l5: all 30 items present, answers verified-editorial, every image file exists", () => {
  const listening = l5.wbListening.parts.flatMap((p) => p.items);
  const reading = l5.wbReading.parts.flatMap((p) => p.items);
  const writing = l5.wbWriting.parts.flatMap((p) => p.items);
  assert.equal(listening.length + reading.length + writing.length, 30);
  for (const sec of [l5.wbListening, l5.wbReading, l5.wbWriting]) {
    assert.equal(sec.answerStatus, "verified-editorial");
    assert.ok(sec.answerNoteVi.includes("không phải đáp án chính thức"), sec.titleZh);
  }
  for (const sec of [l5.wbListening, l5.wbReading, l5.wbWriting]) assert.ok(sec.bookPagesVi && sec.bookPagesVi.includes("trang in"), sec.titleZh);
  const files = new Set();
  const collect = (v) => {
    if (typeof v === "string" && v.startsWith("assets/")) files.add(v);
    else if (Array.isArray(v)) v.forEach(collect);
    else if (v && typeof v === "object") Object.values(v).forEach(collect);
  };
  collect(l5.wbListening); collect(l5.wbReading); collect(l5.wbWriting); collect(l5.intro); collect(l5.prepWords); collect(l5.selfCheckTasks);
  assert.ok(files.size >= 20, `${files.size} assets referenced`);
  for (const f of files) assert.ok(existsSync(new URL("../" + f, import.meta.url)), f);
});

test("wb l5: the two shared images are byte-identical copies of lesson 1's", () => {
  const sha = (p) => createHash("sha256").update(readFileSync(new URL("../" + p, import.meta.url))).digest("hex");
  assert.equal(sha("assets/hsk2-lesson-05/wb-p2-soccer.webp"), sha("assets/hsk2-lesson-01/wb-p2-soccer.webp"));
  assert.equal(sha("assets/hsk2-lesson-05/wb-r1-basketball.webp"), sha("assets/hsk2-lesson-01/wb-r1-basketball.webp"));
});
