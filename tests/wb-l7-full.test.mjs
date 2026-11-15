import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import { createHash } from "node:crypto";
// Workbook HSK 2 Lesson 7 (full-package round, release 20261115-hsk2-l7-wb):
// the full 30-question 模拟测练 added alongside the lesson — printed pages
// 063-070 (PDF 70-77). Reading/Writing answers follow the print inventory
// (L7_AUDIT); Listening answers and transcripts are read from the book's
// own audio (track 07-1, 541.82 s) — the book prints neither an answer key
// nor scripts, so every answer stays verified-editorial. Every listening
// window was checked by RMS envelope analysis to contain BOTH readings
// (Q10's second reading, garbled in the full-track ASR pass, was
// re-transcribed from a window crop and matches the first reading).
// PRINT CORRECTION found while building: Listening Q2 picture C is a young
// man JOGGING on a bridge by a railing (300-dpi crop of printed p.063),
// not a skateboard as the first inventory read it — hence Q2 = C
// （他的爱好是跑步） and the redrawn panel shows the jogger.
const content = JSON.parse(readFileSync(new URL("../data/content.json", import.meta.url)));
const l7 = content.additionalLessons.find((c) => c.lessonId === "hsk2-l07");

test("wb l7 listening: answers, transcripts and shared-example content (evidence: book audio, envelope-checked)", () => {
  const L = l7.wbListening;
  assert.equal(L.trackId, "trk-wb2-l07-1");
  const answers = {};
  const lines = {};
  const windows = {};
  for (const p of L.parts) for (const it of [p.example, ...p.items]) {
    answers[it.id] = it.answer;
    if (it.lines) lines[it.id] = it.lines.map((x) => x.zh);
    if (it.audio) windows[it.id] = [it.audio.start, it.audio.end];
  }
  assert.deepEqual(answers, {
    "wb2-l7-p1-ex": "A", "wb2-l7-p1-q1": "A", "wb2-l7-p1-q2": "C", "wb2-l7-p1-q3": "C",
    "wb2-l7-p2-ex": "D", "wb2-l7-p2-q4": "C", "wb2-l7-p2-q5": "B", "wb2-l7-p2-q6": "A",
    "wb2-l7-p3-ex": "A", "wb2-l7-p3-q7": "B", "wb2-l7-p3-q8": "A", "wb2-l7-p3-q9": "A", "wb2-l7-p3-q10": "B",
  });
  assert.deepEqual(windows, {
    "wb2-l7-p1-ex": [55.9, 65.3], "wb2-l7-p1-q1": [78.1, 87], "wb2-l7-p1-q2": [95.1, 103.7], "wb2-l7-p1-q3": [111.5, 122.3],
    "wb2-l7-p2-ex": [141.8, 156], "wb2-l7-p2-q4": [173.7, 188], "wb2-l7-p2-q5": [200.9, 214.3], "wb2-l7-p2-q6": [227.7, 248.3],
    "wb2-l7-p3-ex": [271.3, 296.2], "wb2-l7-p3-q7": [316.7, 347.9], "wb2-l7-p3-q8": [363, 395.9], "wb2-l7-p3-q9": [410.9, 455.4], "wb2-l7-p3-q10": [470.6, 527.3],
  });
  assert.deepEqual(lines["wb2-l7-p1-ex"], ["我每天坐公交车去上班。"]);
  assert.deepEqual(lines["wb2-l7-p1-q1"], ["他游泳游得很快。"]);
  assert.deepEqual(lines["wb2-l7-p1-q2"], ["他的爱好是跑步。"]);
  assert.deepEqual(lines["wb2-l7-p1-q3"], ["儿子每天一回家就要吃饭。"]);
  assert.deepEqual(lines["wb2-l7-p2-ex"], ["你喜欢什么运动？", "我最喜欢踢足球。"]);
  assert.deepEqual(lines["wb2-l7-p2-q4"], ["开始下雨了。", "是啊，我们别出去了。"]);
  assert.deepEqual(lines["wb2-l7-p2-q5"], ["你是从哪儿来的？", "我是从法国来的。"]);
  assert.deepEqual(lines["wb2-l7-p2-q6"], ["你是从什么时候开始学画画的？", "小学，那个时候每天都有画画课。"]);
  assert.deepEqual(lines["wb2-l7-p3-q7"], ["你今天怎么回来这么早？", "我没去打球，一下班就回来了。"]);
  assert.deepEqual(lines["wb2-l7-p3-q8"], ["你唱歌唱得怎么样？", "不太好。佳月跟我说你唱得很好。"]);
  assert.deepEqual(lines["wb2-l7-p3-q9"], ["一到星期天你就往外跑。", "我跟同学说好了一起踢球。", "他们踢得怎么样？", "他们踢得很好，我踢得也很好。"]);
  assert.deepEqual(lines["wb2-l7-p3-q10"], ["你一回来就不高兴，有什么事吗？", "明天我想休息，但还有很多工作没做完。", "明天不是星期天，你为什么要休息啊？", "因为我爸妈旅游回来，我想去接他们。"]);
});

test("wb l7: all 30 items present, answers verified-editorial, every image file exists", () => {
  const listening = l7.wbListening.parts.flatMap((p) => p.items);
  const reading = l7.wbReading.parts.flatMap((p) => p.items);
  const writing = l7.wbWriting.parts.flatMap((p) => p.items);
  assert.equal(listening.length + reading.length + writing.length, 30);
  for (const sec of [l7.wbListening, l7.wbReading, l7.wbWriting]) {
    assert.equal(sec.answerStatus, "verified-editorial");
    assert.ok(sec.answerNoteVi.includes("không phải đáp án chính thức"), sec.titleZh);
  }
  for (const sec of [l7.wbListening, l7.wbReading, l7.wbWriting]) assert.ok(sec.bookPagesVi && sec.bookPagesVi.includes("trang in"), sec.titleZh);
  const files = new Set();
  const collect = (v) => {
    if (typeof v === "string" && v.startsWith("assets/")) files.add(v);
    else if (Array.isArray(v)) v.forEach(collect);
    else if (v && typeof v === "object") Object.values(v).forEach(collect);
  };
  collect(l7.wbListening); collect(l7.wbReading); collect(l7.wbWriting); collect(l7.intro); collect(l7.prepWords); collect(l7.selfCheckTasks);
  assert.ok(files.size >= 20, `${files.size} assets referenced`);
  for (const f of files) assert.ok(existsSync(new URL("../" + f, import.meta.url)), f);
});

test("wb l7: the two shared images are byte-identical copies of lesson 1's", () => {
  const sha = (p) => createHash("sha256").update(readFileSync(new URL("../" + p, import.meta.url))).digest("hex");
  assert.equal(sha("assets/hsk2-lesson-07/wb-p2-soccer.webp"), sha("assets/hsk2-lesson-01/wb-p2-soccer.webp"));
  assert.equal(sha("assets/hsk2-lesson-07/wb-r1-basketball.webp"), sha("assets/hsk2-lesson-01/wb-r1-basketball.webp"));
});

test("wb l7: neutral alt on every graded workbook picture option (B6 rule)", () => {
  const picOpts = [];
  for (const p of l7.wbListening.parts) {
    if (p.pictureSet) picOpts.push(...p.pictureSet);
    for (const it of [p.example, ...p.items]) if (it.options) picOpts.push(...it.options.filter((o) => o.image));
  }
  for (const p of l7.wbReading.parts) if (p.pictureSet) picOpts.push(...p.pictureSet);
  assert.ok(picOpts.length >= 17, `${picOpts.length} graded picture options`);
  for (const o of picOpts) assert.equal(o.imageAltVi, `Tranh minh họa lựa chọn ${o.id}`, o.image);
});

test("wb l7 writing part II q29: the answer is only 爱 — 好 is printed after the blank", () => {
  const w2 = l7.wbWriting.parts[1];
  const q29 = w2.items.find((i) => i.no === 29);
  assert.equal(q29.answerZh, "爱");
  assert.equal(q29.blankPinyin, "ài");
  assert.equal(q29.stemZh, "我爸爸的（）好是游泳。");
});
