import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import { createHash } from "node:crypto";
// Workbook HSK 2 Lesson 6 (full-package round, release 20261115-hsk2-l6-wb):
// the full 30-question 模拟测练 added alongside the lesson — printed pages
// 053-060 (PDF 60-67). Reading/Writing answers follow the print inventory
// (L6_AUDIT); Listening answers and transcripts are read from the book's
// own audio (track 06-1, 553.81 s) — the book prints neither an answer key
// nor scripts, so every answer stays verified-editorial. Every listening
// window was checked by RMS envelope analysis to contain BOTH readings:
// the ASR pass merged Q3's two readings into one segment and dropped Q7's
// second reading entirely; the envelope region patterns confirm both
// readings inside every chosen window (Q8's garbled ASR was re-transcribed
// from window crops to fix the transcript).
const content = JSON.parse(readFileSync(new URL("../data/content.json", import.meta.url)));
const l6 = content.additionalLessons.find((c) => c.lessonId === "hsk2-l06");

test("wb l6 listening: answers, transcripts and shared-example content (evidence: book audio, envelope-checked)", () => {
  const L = l6.wbListening;
  assert.equal(L.trackId, "trk-wb2-l06-1");
  const answers = {};
  const lines = {};
  const windows = {};
  for (const p of L.parts) for (const it of [p.example, ...p.items]) {
    answers[it.id] = it.answer;
    if (it.lines) lines[it.id] = it.lines.map((x) => x.zh);
    if (it.audio) windows[it.id] = [it.audio.start, it.audio.end];
  }
  assert.deepEqual(answers, {
    "wb2-l6-p1-ex": "A", "wb2-l6-p1-q1": "B", "wb2-l6-p1-q2": "B", "wb2-l6-p1-q3": "A",
    "wb2-l6-p2-ex": "D", "wb2-l6-p2-q4": "C", "wb2-l6-p2-q5": "B", "wb2-l6-p2-q6": "A",
    "wb2-l6-p3-ex": "A", "wb2-l6-p3-q7": "B", "wb2-l6-p3-q8": "A", "wb2-l6-p3-q9": "A", "wb2-l6-p3-q10": "C",
  });
  assert.deepEqual(windows, {
    "wb2-l6-p1-ex": [56.8, 67], "wb2-l6-p1-q1": [79.8, 89.3], "wb2-l6-p1-q2": [97.3, 106.8], "wb2-l6-p1-q3": [113.8, 120.3],
    "wb2-l6-p2-ex": [145.4, 159.7], "wb2-l6-p2-q4": [176.6, 199.3], "wb2-l6-p2-q5": [211.8, 228.2], "wb2-l6-p2-q6": [239.3, 265.6],
    "wb2-l6-p3-ex": [288.7, 313.7], "wb2-l6-p3-q7": [333.5, 367], "wb2-l6-p3-q8": [380.9, 413.8], "wb2-l6-p3-q9": [428.6, 473.9], "wb2-l6-p3-q10": [488.3, 539.8],
  });
  assert.deepEqual(lines["wb2-l6-p1-q1"], ["这是我女儿画的画。"]);
  assert.deepEqual(lines["wb2-l6-p1-q2"], ["她高兴地打开生日礼物。"]);
  assert.deepEqual(lines["wb2-l6-p1-q3"], ["都九点了，她还在床上睡觉呢。"]);
  assert.deepEqual(lines["wb2-l6-p2-q4"], ["小明，你有哪些颜色的画笔呀？", "红色的、绿色的，还有黑色的。"]);
  assert.deepEqual(lines["wb2-l6-p2-q5"], ["你看，这条裤子是不是有点儿长？", "我觉得不长。"]);
  assert.deepEqual(lines["wb2-l6-p2-q6"], ["外边太冷了，你看，孩子的手红红的。", "是。", "下次别等公交车了，打车回来吧。"]);
  assert.deepEqual(lines["wb2-l6-p3-q7"], ["这些肉啊、菜啊什么的，你多吃点儿。", "我到家您就开始做菜，别再做了，快来吃吧。"]);
  assert.deepEqual(lines["wb2-l6-p3-q8"], ["忙完这些工作，我要舒舒服服地睡一觉。", "你的工作有忙完的时候吗？"]);
  assert.deepEqual(lines["wb2-l6-p3-q9"], ["你看，长长的生日面做好了。", "真不错，我要多吃点儿。", "生日快乐！", "谢谢，跟你在一起，我每天都很快乐。"]);
  assert.deepEqual(lines["wb2-l6-p3-q10"], ["你过来坐坐，这张床很舒服。", "是很舒服，但儿子的房间小小的，这张床有点儿大。", "那边还有几张床，我们过去看看。", "好的。"]);
});

test("wb l6: all 30 items present, answers verified-editorial, every image file exists", () => {
  const listening = l6.wbListening.parts.flatMap((p) => p.items);
  const reading = l6.wbReading.parts.flatMap((p) => p.items);
  const writing = l6.wbWriting.parts.flatMap((p) => p.items);
  assert.equal(listening.length + reading.length + writing.length, 30);
  for (const sec of [l6.wbListening, l6.wbReading, l6.wbWriting]) {
    assert.equal(sec.answerStatus, "verified-editorial");
    assert.ok(sec.answerNoteVi.includes("không phải đáp án chính thức"), sec.titleZh);
  }
  for (const sec of [l6.wbListening, l6.wbReading, l6.wbWriting]) assert.ok(sec.bookPagesVi && sec.bookPagesVi.includes("trang in"), sec.titleZh);
  const files = new Set();
  const collect = (v) => {
    if (typeof v === "string" && v.startsWith("assets/")) files.add(v);
    else if (Array.isArray(v)) v.forEach(collect);
    else if (v && typeof v === "object") Object.values(v).forEach(collect);
  };
  collect(l6.wbListening); collect(l6.wbReading); collect(l6.wbWriting); collect(l6.intro); collect(l6.prepWords); collect(l6.selfCheckTasks);
  assert.ok(files.size >= 20, `${files.size} assets referenced`);
  for (const f of files) assert.ok(existsSync(new URL("../" + f, import.meta.url)), f);
});

test("wb l6: the two shared images are byte-identical copies of lesson 1's", () => {
  const sha = (p) => createHash("sha256").update(readFileSync(new URL("../" + p, import.meta.url))).digest("hex");
  assert.equal(sha("assets/hsk2-lesson-06/wb-p2-soccer.webp"), sha("assets/hsk2-lesson-01/wb-p2-soccer.webp"));
  assert.equal(sha("assets/hsk2-lesson-06/wb-r1-basketball.webp"), sha("assets/hsk2-lesson-01/wb-r1-basketball.webp"));
});

test("wb l6: neutral alt on every graded workbook picture option (B6 rule)", () => {
  const picOpts = [];
  for (const p of l6.wbListening.parts) {
    if (p.pictureSet) picOpts.push(...p.pictureSet);
    for (const it of [p.example, ...p.items]) if (it.options) picOpts.push(...it.options.filter((o) => o.image));
  }
  for (const p of l6.wbReading.parts) if (p.pictureSet) picOpts.push(...p.pictureSet);
  assert.ok(picOpts.length >= 17, `${picOpts.length} graded picture options`);
  for (const o of picOpts) assert.equal(o.imageAltVi, `Tranh minh họa lựa chọn ${o.id}`, o.image);
});
