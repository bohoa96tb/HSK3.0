import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import { createHash } from "node:crypto";

const content = JSON.parse(readFileSync(new URL("../data/content.json", import.meta.url)));
const l8 = content.additionalLessons.find((c) => c.lessonId === "hsk2-l08");

test("wb l8 listening: answers, transcripts and envelope-checked timing windows", () => {
  const L = l8.wbListening;
  assert.equal(L.trackId, "trk-wb2-l08-1");
  const answers = {};
  const lines = {};
  const windows = {};
  for (const p of L.parts) for (const it of [p.example, ...p.items]) {
    answers[it.id] = it.answer;
    if (it.lines) lines[it.id] = it.lines.map((x) => x.zh);
    if (it.audio) windows[it.id] = [it.audio.start, it.audio.end];
  }
  assert.deepEqual(answers, {
    "wb2-l8-p1-ex": "A", "wb2-l8-p1-q1": "B", "wb2-l8-p1-q2": "C", "wb2-l8-p1-q3": "C",
    "wb2-l8-p2-ex": "D", "wb2-l8-p2-q4": "A", "wb2-l8-p2-q5": "C", "wb2-l8-p2-q6": "B",
    "wb2-l8-p3-ex": "A", "wb2-l8-p3-q7": "B", "wb2-l8-p3-q8": "B", "wb2-l8-p3-q9": "B", "wb2-l8-p3-q10": "A",
  });
  assert.deepEqual(windows, {
    "wb2-l8-p1-ex": [58.4, 67.8], "wb2-l8-p1-q1": [82.2, 92], "wb2-l8-p1-q2": [100.9, 111.5], "wb2-l8-p1-q3": [120.7, 132.8],
    "wb2-l8-p2-ex": [153.1, 166.5], "wb2-l8-p2-q4": [185.2, 204], "wb2-l8-p2-q5": [217.7, 237.6], "wb2-l8-p2-q6": [251, 272.5],
    "wb2-l8-p3-ex": [296.5, 320.7], "wb2-l8-p3-q7": [342.6, 372.5], "wb2-l8-p3-q8": [388.7, 424.1], "wb2-l8-p3-q9": [440.9, 492.7], "wb2-l8-p3-q10": [509.2, 560.8],
  });
  assert.deepEqual(lines["wb2-l8-p1-ex"], ["我每天坐公交车去上班。"]);
  assert.deepEqual(lines["wb2-l8-p1-q1"], ["我们一到饭馆就开始点菜。"]);
  assert.deepEqual(lines["wb2-l8-p1-q2"], ["我今天看了一个很有意思的电影。"]);
  assert.deepEqual(lines["wb2-l8-p1-q3"], ["丈夫喜欢做菜，妻子也会过来帮忙。"]);
  assert.deepEqual(lines["wb2-l8-p2-ex"], ["你喜欢什么运动？", "我最喜欢踢足球。"]);
  assert.deepEqual(lines["wb2-l8-p2-q4"], ["这两块手表怎么样？", "我喜欢左边这个，颜色好看，还不贵。"]);
  assert.deepEqual(lines["wb2-l8-p2-q5"], ["今天有点晚了，你怎么回去？", "打车吧，出租车比公交车快。"]);
  assert.deepEqual(lines["wb2-l8-p2-q6"], ["这本书很有意思，你想不想看看？", "虽然我很想看，但是没有时间。"]);
  assert.deepEqual(lines["wb2-l8-p3-ex"], ["给您笔，请在这儿写一下您的姓名。", "好的，是这儿吗？"]);
  assert.deepEqual(lines["wb2-l8-p3-q7"], ["我记得你喜欢吃鱼，今天怎么不吃啊？", "这个鱼做得不好吃。"]);
  assert.deepEqual(lines["wb2-l8-p3-q8"], ["奶奶，今天晚上我们去饭馆吃饭吧。", "别去了，还是在家吃吧，你爷爷已经开始做饭了。"]);
  assert.deepEqual(lines["wb2-l8-p3-q9"], ["左边这间教室比右边那间大。", "但是右边那间教室里的桌椅更新。", "那我们去哪间教室学习？", "我们人不多，还是去右边那间吧。"]);
  assert.deepEqual(lines["wb2-l8-p3-q10"], ["我们这次怎么去上海？", "坐火车吧，火车票比飞机票便宜。", "但是坐飞机比坐火车快，两个多小时就到了。", "我们有时间，没关系的。"]);
});

test("wb l8: all 30 items present, answers verified-editorial, every image file exists", () => {
  const listening = l8.wbListening.parts.flatMap((p) => p.items);
  const reading = l8.wbReading.parts.flatMap((p) => p.items);
  const writing = l8.wbWriting.parts.flatMap((p) => p.items);
  assert.equal(listening.length + reading.length + writing.length, 30);
  for (const sec of [l8.wbListening, l8.wbReading, l8.wbWriting]) {
    assert.equal(sec.answerStatus, "verified-editorial");
    assert.ok(sec.answerNoteVi.includes("không phải đáp án chính thức"), sec.titleZh);
    assert.ok(sec.bookPagesVi && sec.bookPagesVi.includes("trang in"), sec.titleZh);
  }
  const files = new Set();
  const collect = (v) => {
    if (typeof v === "string" && v.startsWith("assets/")) files.add(v);
    else if (Array.isArray(v)) v.forEach(collect);
    else if (v && typeof v === "object") Object.values(v).forEach(collect);
  };
  collect(l8.wbListening); collect(l8.wbReading); collect(l8.wbWriting); collect(l8.intro); collect(l8.prepWords); collect(l8.selfCheckTasks); collect(l8.exerciseSet);
  assert.equal(files.size, 29, `${files.size} assets referenced`);
  for (const f of files) assert.ok(existsSync(new URL("../" + f, import.meta.url)), f);
});

test("wb l8: the two shared images are byte-identical copies of lesson 1's", () => {
  const sha = (p) => createHash("sha256").update(readFileSync(new URL("../" + p, import.meta.url))).digest("hex");
  assert.equal(sha("assets/hsk2-lesson-08/wb-p2-soccer.webp"), sha("assets/hsk2-lesson-01/wb-p2-soccer.webp"));
  assert.equal(sha("assets/hsk2-lesson-08/wb-r1-basketball.webp"), sha("assets/hsk2-lesson-01/wb-r1-basketball.webp"));
});

test("wb l8: neutral alt on every graded workbook picture option", () => {
  const picOpts = [];
  for (const p of l8.wbListening.parts) {
    if (p.pictureSet) picOpts.push(...p.pictureSet);
    for (const it of [p.example, ...p.items]) if (it.options) picOpts.push(...it.options.filter((o) => o.image));
  }
  for (const p of l8.wbReading.parts) if (p.pictureSet) picOpts.push(...p.pictureSet);
  assert.ok(picOpts.length >= 17, `${picOpts.length} graded picture options`);
  for (const o of picOpts) assert.equal(o.imageAltVi, `Tranh minh họa lựa chọn ${o.id}`, o.image);
});

test("wb l8 reading & writing answers match printed workbook inventory", () => {
  const rdAnswers = Object.fromEntries(l8.wbReading.parts.flatMap((p) => [p.example, ...p.items]).map((i) => [i.id, i.answer]));
  assert.deepEqual(rdAnswers, {
    "wb2-l8-r1-ex": "D", "wb2-l8-r1-q11": "B", "wb2-l8-r1-q12": "C", "wb2-l8-r1-q13": "A",
    "wb2-l8-r2-ex": "E", "wb2-l8-r2-q14": "D", "wb2-l8-r2-q15": "C", "wb2-l8-r2-q16": "A", "wb2-l8-r2-q17": "B",
    "wb2-l8-r3-ex": "E", "wb2-l8-r3-q18": "B", "wb2-l8-r3-q19": "A", "wb2-l8-r3-q20": "C", "wb2-l8-r3-q21": "D",
    "wb2-l8-r4-ex": "B", "wb2-l8-r4-q22": "B", "wb2-l8-r4-q23": "A", "wb2-l8-r4-q24": "C",
  });
  const w1Answers = Object.fromEntries(l8.wbWriting.parts[0].items.map((i) => [i.id, i.answer]));
  assert.deepEqual(w1Answers, { "wb2-l8-w1-q25": "A", "wb2-l8-w1-q26": "B", "wb2-l8-w1-q27": "C" });
  const w2Answers = Object.fromEntries([l8.wbWriting.parts[1].example, ...l8.wbWriting.parts[1].items].map((i) => [i.id, i.answerZh]));
  assert.deepEqual(w2Answers, { "wb2-l8-w2-ex": "是", "wb2-l8-w2-q28": "边", "wb2-l8-w2-q29": "点", "wb2-l8-w2-q30": "比" });
});

test("app.js imports audio-review.js with the current contentVersion token", () => {
  const app = readFileSync(new URL("../src/app.js", import.meta.url), "utf8");
  const m = app.match(/audio-review\.js\?v=([0-9a-z-]+)/);
  assert.ok(m, "app.js must import audio-review.js with ?v=");
  assert.equal(m[1], content.contentVersion);
});
