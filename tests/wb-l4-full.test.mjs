import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import { createHash } from "node:crypto";
// Workbook HSK 2 Lesson 4 (D41/D42, release 20261113-hsk2-l4-wb): the full
// 30-question 模拟测练 added alongside the lesson — printed pages 031-040
// (PDF 38-47). Reading/Writing answers follow the print inventory
// (L4_AUDIT); Listening answers and transcripts are read from the book's
// own audio (track 04-1, 567.28 s) — the book prints neither an answer key
// nor scripts, so every answer stays verified-editorial. Every listening
// window was checked by RMS envelope analysis to contain BOTH readings
// (ASR-VAD dropped the second reading of Q4 and Q9; the envelope shows
// both readings inside the chosen windows).
const content = JSON.parse(readFileSync(new URL("../data/content.json", import.meta.url)));
const l4 = content.additionalLessons.find((c) => c.lessonId === "hsk2-l04");

test("wb l4 listening: answers, transcripts and shared-example content (evidence: book audio, envelope-checked)", () => {
  const L = l4.wbListening;
  assert.equal(L.trackId, "trk-wb2-l04-1");
  const answers = {};
  const lines = {};
  const windows = {};
  for (const p of L.parts) for (const it of [p.example, ...p.items]) {
    answers[it.id] = it.answer;
    if (it.lines) lines[it.id] = it.lines.map((x) => x.zh);
    if (it.audio) windows[it.id] = [it.audio.start, it.audio.end];
  }
  assert.deepEqual(answers, {
    "wb2-l4-p1-ex": "A", "wb2-l4-p1-q1": "C", "wb2-l4-p1-q2": "C", "wb2-l4-p1-q3": "B",
    "wb2-l4-p2-ex": "D", "wb2-l4-p2-q4": "C", "wb2-l4-p2-q5": "A", "wb2-l4-p2-q6": "B",
    "wb2-l4-p3-ex": "A", "wb2-l4-p3-q7": "B", "wb2-l4-p3-q8": "A", "wb2-l4-p3-q9": "C", "wb2-l4-p3-q10": "C",
  });
  assert.deepEqual(windows, {
    "wb2-l4-p1-ex": [57.4, 67.6], "wb2-l4-p1-q1": [81.6, 90.5], "wb2-l4-p1-q2": [99.9, 113.2], "wb2-l4-p1-q3": [122.5, 139],
    "wb2-l4-p2-ex": [159.4, 173], "wb2-l4-p2-q4": [192.2, 210.8], "wb2-l4-p2-q5": [224.4, 248.9], "wb2-l4-p2-q6": [262.9, 277.5],
    "wb2-l4-p3-ex": [301.6, 326.3], "wb2-l4-p3-q7": [348.1, 377.7], "wb2-l4-p3-q8": [394.1, 429.8], "wb2-l4-p3-q9": [447, 496.8], "wb2-l4-p3-q10": [513.7, 553.2],
  });
  assert.deepEqual(lines["wb2-l4-p1-q1"], ["我给你拿了点儿吃的喝的。"]);
  assert.deepEqual(lines["wb2-l4-p1-q2"], ["我们没去过北京，这次想去那儿玩玩。"]);
  assert.deepEqual(lines["wb2-l4-p1-q3"], ["因为黑色的裤子都卖完了，所以我就买了一条红色的。"]);
  assert.deepEqual(lines["wb2-l4-p2-q4"], ["你为什么不喜欢哥哥送的新书包？", "因为我不喜欢那个颜色。"]);
  assert.deepEqual(lines["wb2-l4-p2-q5"], ["你喜不喜欢这条白色的裤子？", "喜欢，但我不想每天洗衣服，还是买黑色的吧。"]);
  assert.deepEqual(lines["wb2-l4-p2-q6"], ["你吃了二十多个饺子啊！", "那是因为我没吃午饭。"]);
  assert.deepEqual(lines["wb2-l4-p3-q7"], ["桌子上的苹果都洗过了吧？", "没有，那是我新买的。", "你洗一下再吃。"]);
  assert.deepEqual(lines["wb2-l4-p3-q8"], ["你穿红色的好看，我们过去看看那件红色的。", "这件吗？太贵了吧，3800多呢。"]);
  assert.deepEqual(lines["wb2-l4-p3-q9"], ["这条裤子很不错，但颜色不太好。", "我们还有白色、黑色和绿色的，您要不要再看看？", "给我拿条绿色的试试吧。", "好，我找一下。"]);
  assert.deepEqual(lines["wb2-l4-p3-q10"], ["你来过这家饭店吗？", "没有，我下班后都回家吃饭。", "这儿的包子不错，饺子也很好吃。", "吃包子吧。"]);
});

test("wb l4: all 30 items present, answers verified-editorial, every image file exists", () => {
  const listening = l4.wbListening.parts.flatMap((p) => p.items);
  const reading = l4.wbReading.parts.flatMap((p) => p.items);
  const writing = l4.wbWriting.parts.flatMap((p) => p.items);
  assert.equal(listening.length + reading.length + writing.length, 30);
  for (const sec of [l4.wbListening, l4.wbReading, l4.wbWriting]) {
    assert.equal(sec.answerStatus, "verified-editorial");
    assert.ok(sec.answerNoteVi.includes("không phải đáp án chính thức"), sec.titleZh);
  }
  for (const sec of [l4.wbListening, l4.wbReading, l4.wbWriting]) assert.ok(sec.bookPagesVi && sec.bookPagesVi.includes("trang in"), sec.titleZh);
  const files = new Set();
  const collect = (v) => {
    if (typeof v === "string" && v.startsWith("assets/")) files.add(v);
    else if (Array.isArray(v)) v.forEach(collect);
    else if (v && typeof v === "object") Object.values(v).forEach(collect);
  };
  collect(l4.wbListening); collect(l4.wbReading); collect(l4.wbWriting); collect(l4.intro); collect(l4.prepWords); collect(l4.selfCheckTasks);
  assert.ok(files.size >= 20, `${files.size} assets referenced`);
  for (const f of files) assert.ok(existsSync(new URL("../" + f, import.meta.url)), f);
});

test("wb l4: the two shared images are byte-identical copies of lesson 1's", () => {
  const sha = (p) => createHash("sha256").update(readFileSync(new URL("../" + p, import.meta.url))).digest("hex");
  assert.equal(sha("assets/hsk2-lesson-04/wb-p2-soccer.webp"), sha("assets/hsk2-lesson-01/wb-p2-soccer.webp"));
  assert.equal(sha("assets/hsk2-lesson-04/wb-r1-basketball.webp"), sha("assets/hsk2-lesson-01/wb-r1-basketball.webp"));
});
