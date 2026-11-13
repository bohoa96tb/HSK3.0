// D41: Workbook reading + writing data for HSK 2 Lessons 1–2 — the full
// 30-question 模拟测练 set. D42 adds Lesson 3, built full-30 in one round.
// Answers are editorial derivations pinned here from
// the printed pages (the book prints no answer key); bank consumption is
// checked for consistency (in ALL THREE lessons every bank entry is consumed —
// the reading Part III banks have NO unused distractor in these lessons).
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";

const content = JSON.parse(readFileSync(new URL("../data/content.json", import.meta.url), "utf8"));
const appJs = readFileSync(new URL("../src/app.js", import.meta.url), "utf8");
const css = readFileSync(new URL("../assets/styles.css", import.meta.url), "utf8");
const indexHtml = readFileSync(new URL("../index.html", import.meta.url), "utf8");
const lesson = (id) => (content.lessons || []).concat(content.additionalLessons || []).find((l) => l.lessonId === id);

// Editorial answers derived from print (see docs/HSK2_WORKBOOK_VISUAL_AUDIT.md).
const EXPECTED = {
  "hsk2-l01": {
    r1: { ex: "D", q: { "wb2-l1-r1-q11": "B", "wb2-l1-r1-q12": "C", "wb2-l1-r1-q13": "A" } },
    r2: { ex: "E", q: { "wb2-l1-r2-q14": "C", "wb2-l1-r2-q15": "A", "wb2-l1-r2-q16": "B", "wb2-l1-r2-q17": "D" } },
    r3: { ex: "E", q: { "wb2-l1-r3-q18": "A", "wb2-l1-r3-q19": "C", "wb2-l1-r3-q20": "B", "wb2-l1-r3-q21": "D" } },
    r4: { ex: "B", q: { "wb2-l1-r4-q22": "B", "wb2-l1-r4-q23": "A", "wb2-l1-r4-q24": "B" } },
    w1: { ex: "D", q: { "wb2-l1-w1-q25": "C", "wb2-l1-w1-q26": "B", "wb2-l1-w1-q27": "A" } },
    w2: { ex: ["是", "shì"], q: { "wb2-l1-w2-q28": ["有", "yǒu"], "wb2-l1-w2-q29": ["已", "yǐ"], "wb2-l1-w2-q30": ["那", "nà"] } },
  },
  "hsk2-l02": {
    r1: { ex: "D", q: { "wb2-l2-r1-q11": "A", "wb2-l2-r1-q12": "B", "wb2-l2-r1-q13": "C" } },
    r2: { ex: "E", q: { "wb2-l2-r2-q14": "C", "wb2-l2-r2-q15": "D", "wb2-l2-r2-q16": "B", "wb2-l2-r2-q17": "A" } },
    r3: { ex: "E", q: { "wb2-l2-r3-q18": "D", "wb2-l2-r3-q19": "B", "wb2-l2-r3-q20": "C", "wb2-l2-r3-q21": "A" } },
    r4: { ex: "B", q: { "wb2-l2-r4-q22": "B", "wb2-l2-r4-q23": "C", "wb2-l2-r4-q24": "A" } },
    w1: { ex: "D", q: { "wb2-l2-w1-q25": "B", "wb2-l2-w1-q26": "A", "wb2-l2-w1-q27": "C" } },
    w2: { ex: ["是", "shì"], q: { "wb2-l2-w2-q28": ["网", "wǎng"], "wb2-l2-w2-q29": ["间", "jiān"], "wb2-l2-w2-q30": ["来", "lái"] } },
  },
  "hsk2-l03": {
    r1: { ex: "D", q: { "wb2-l3-r1-q11": "B", "wb2-l3-r1-q12": "A", "wb2-l3-r1-q13": "C" } },
    r2: { ex: "E", q: { "wb2-l3-r2-q14": "A", "wb2-l3-r2-q15": "D", "wb2-l3-r2-q16": "C", "wb2-l3-r2-q17": "B" } },
    r3: { ex: "E", q: { "wb2-l3-r3-q18": "D", "wb2-l3-r3-q19": "A", "wb2-l3-r3-q20": "C", "wb2-l3-r3-q21": "B" } },
    r4: { ex: "B", q: { "wb2-l3-r4-q22": "B", "wb2-l3-r4-q23": "B", "wb2-l3-r4-q24": "A" } },
    w1: { ex: "D", q: { "wb2-l3-w1-q25": "A", "wb2-l3-w1-q26": "C", "wb2-l3-w1-q27": "B" } },
    w2: { ex: ["是", "shì"], q: { "wb2-l3-w2-q28": ["为", "wèi"], "wb2-l3-w2-q29": ["这", "zhè"], "wb2-l3-w2-q30": ["不", "bú"] } },
  },
  "hsk2-l04": {
    r1: { ex: "D", q: { "wb2-l4-r1-q11": "A", "wb2-l4-r1-q12": "C", "wb2-l4-r1-q13": "B" } },
    r2: { ex: "E", q: { "wb2-l4-r2-q14": "A", "wb2-l4-r2-q15": "C", "wb2-l4-r2-q16": "D", "wb2-l4-r2-q17": "B" } },
    r3: { ex: "E", q: { "wb2-l4-r3-q18": "B", "wb2-l4-r3-q19": "C", "wb2-l4-r3-q20": "A", "wb2-l4-r3-q21": "D" } },
    r4: { ex: "B", q: { "wb2-l4-r4-q22": "A", "wb2-l4-r4-q23": "C", "wb2-l4-r4-q24": "B" } },
    w1: { ex: "D", q: { "wb2-l4-w1-q25": "C", "wb2-l4-w1-q26": "B", "wb2-l4-w1-q27": "A" } },
    w2: { ex: ["是", "shì"], q: { "wb2-l4-w2-q28": ["过", "guo"], "wb2-l4-w2-q29": ["场", "chǎng"], "wb2-l4-w2-q30": ["以", "yǐ"] } },
  },
  "hsk2-l05": {
    r1: { ex: "D", q: { "wb2-l5-r1-q11": "B", "wb2-l5-r1-q12": "C", "wb2-l5-r1-q13": "A" } },
    r2: { ex: "E", q: { "wb2-l5-r2-q14": "A", "wb2-l5-r2-q15": "D", "wb2-l5-r2-q16": "C", "wb2-l5-r2-q17": "B" } },
    r3: { ex: "E", q: { "wb2-l5-r3-q18": "B", "wb2-l5-r3-q19": "D", "wb2-l5-r3-q20": "A", "wb2-l5-r3-q21": "C" } },
    r4: { ex: "B", q: { "wb2-l5-r4-q22": "B", "wb2-l5-r4-q23": "A", "wb2-l5-r4-q24": "C" } },
    w1: { ex: "D", q: { "wb2-l5-w1-q25": "A", "wb2-l5-w1-q26": "C", "wb2-l5-w1-q27": "B" } },
    w2: { ex: ["是", "shì"], q: { "wb2-l5-w2-q28": ["下", "xià"], "wb2-l5-w2-q29": ["跟", "gēn"], "wb2-l5-w2-q30": ["会", "huì"] } },
  },
};

for (const [lessonId, exp] of Object.entries(EXPECTED)) {
  test(`wb reading+writing data for ${lessonId}: counts, answers, banks, images (D41)`, () => {
    const l = lesson(lessonId);
    assert.ok(l?.wbReading, "wbReading present");
    assert.ok(l?.wbWriting, "wbWriting present");
    assert.equal(l.wbReading.answerStatus, "verified-editorial");
    assert.equal(l.wbWriting.answerStatus, "verified-editorial");
    const rd = l.wbReading.parts, wr = l.wbWriting.parts;
    assert.deepEqual(rd.map((p) => p.items.length), [3, 4, 4, 3], "reading part counts = 14");
    assert.deepEqual(wr.map((p) => p.items.length), [3, 3], "writing part counts = 6");
    assert.deepEqual(rd.map((p) => p.kind), ["picture-match", "word-bank", "match-bank", "passage-choice"]);
    assert.deepEqual(wr.map((p) => p.kind), ["component-bank", "pinyin-write"]);
    // question numbers run 11–24 and 25–30 exactly as printed
    assert.deepEqual(rd.flatMap((p) => p.items.map((i) => i.no)), [11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24]);
    assert.deepEqual(wr.flatMap((p) => p.items.map((i) => i.no)), [25, 26, 27, 28, 29, 30]);
    const allIds = [...rd, ...wr].flatMap((p) => [p.example.id, ...p.items.map((i) => i.id)]);
    assert.equal(new Set(allIds).size, allIds.length, "ids unique within reading+writing");

    // Part I: shared set of 4 redrawn images on disk; printed pinyin shown (D41)
    const p1 = rd[0];
    assert.equal(p1.pictureSet.length, 4);
    for (const o of p1.pictureSet) {
      assert.ok(existsSync(new URL("../" + o.image, import.meta.url)), `image exists: ${o.image}`);
      assert.ok(o.image.includes("wb-r1-"), "reading image naming");
      assert.ok(o.imageAltVi?.length > 10, "alt text present");
    }
    assert.equal(p1.example.answer, exp.r1.ex);
    for (const it of p1.items) {
      assert.equal(it.answer, exp.r1.q[it.id], `${it.id} answer`);
      assert.ok(it.sentenceZh && it.sentencePinyin, "sentence + printed pinyin present");
      assert.ok(it.explainVi?.length > 10, "explainVi present");
    }
    assert.deepEqual([p1.example.answer, ...p1.items.map((i) => i.answer)].sort(), ["A", "B", "C", "D"], "all 4 pictures used across example+items");

    // Part II word bank: 5 entries, example + items consume each exactly once
    const p2 = rd[1];
    assert.equal(p2.bank.length, 5);
    for (const b of p2.bank) assert.ok(b.zh && b.pinyin, "bank entry has word + pinyin");
    assert.equal(p2.example.answer, exp.r2.ex);
    for (const it of p2.items) {
      assert.equal(it.answer, exp.r2.q[it.id], `${it.id} answer`);
      assert.ok(it.lines.every((ln) => ln.zh && ln.pinyin), "lines carry printed pinyin");
      assert.ok(it.explainVi?.length > 10);
    }
    assert.deepEqual([p2.example.answer, ...p2.items.map((i) => i.answer)].sort(), p2.bank.map((b) => b.id).sort(), "word bank fully consumed, each entry once");

    // Part III match bank: answers distinct; in these lessons the example
    // plus the 4 items consume ALL FIVE responses (no unused distractor).
    const p3 = rd[2];
    assert.equal(p3.bank.length, 5);
    assert.equal(p3.example.answer, exp.r3.ex);
    for (const it of p3.items) {
      assert.equal(it.answer, exp.r3.q[it.id], `${it.id} answer`);
      assert.ok(it.zh && it.pinyin && it.explainVi?.length > 10);
    }
    assert.deepEqual([p3.example.answer, ...p3.items.map((i) => i.answer)].sort(), p3.bank.map((b) => b.id).sort(), "match bank fully consumed in this lesson (verified from print + semantics)");

    // Part IV passage choice: 3 options with printed pinyin; example keeps the
    // book's printed English glosses.
    const p4 = rd[3];
    assert.equal(p4.example.answer, exp.r4.ex);
    for (const o of p4.example.options) assert.ok(o.en?.length > 2, "example option keeps printed English gloss");
    for (const it of p4.items) {
      assert.equal(it.options.length, 3);
      assert.ok(it.options.every((o) => o.zh && o.pinyin), "options carry printed pinyin");
      assert.ok(it.options.some((o) => o.id === it.answer), "answer is one of the options");
      assert.equal(it.answer, exp.r4.q[it.id], `${it.id} answer`);
      assert.ok(it.passageZh && it.passagePinyin && it.questionZh && it.explainVi?.length > 10);
    }

    // Writing Part I: component bank of 4; exactly one gapped character per
    // item; example + items consume all four components exactly once.
    const w1 = wr[0];
    assert.equal(w1.bank.length, 4);
    assert.equal(w1.example.answer, exp.w1.ex);
    for (const it of [w1.example, ...w1.items]) {
      const gaps = it.chars.filter((c) => c.gap);
      assert.equal(gaps.length, 1, `${it.id || "example"}: exactly one missing component`);
      assert.notEqual(gaps[0].shown, gaps[0].full, "gapped char shows only its present part");
      assert.ok(w1.bank.some((b) => b.id === it.answer), "answer is a bank component");
    }
    for (const it of w1.items) {
      assert.equal(it.answer, exp.w1.q[it.id], `${it.id} answer`);
      assert.ok(it.explainVi?.length > 10);
    }
    assert.deepEqual([w1.example.answer, ...w1.items.map((i) => i.answer)].sort(), w1.bank.map((b) => b.id).sort(), "component bank fully consumed, each entry once");

    // Writing Part II: the typed answer is the unique Hanzi for the printed
    // syllable in context; example included.
    const w2 = wr[1];
    assert.equal(w2.example.answerZh, exp.w2.ex[0]);
    assert.equal(w2.example.blankPinyin, exp.w2.ex[1]);
    for (const it of w2.items) {
      const [hanzi, syllable] = exp.w2.q[it.id];
      assert.equal(it.answerZh, hanzi, `${it.id} answer character`);
      assert.equal(it.blankPinyin, syllable, `${it.id} printed syllable matches the answer`);
      assert.equal([...it.answerZh].length, 1, "single character answer");
      assert.ok(it.stemZh.includes("（　）"), "stem shows the printed blank");
      assert.ok(it.explainVi?.length > 10);
    }
  });
}

test("wb full-30 release wiring: version, token, renderer hooks (D41/D42)", () => {
  assert.equal(content.contentVersion, "20261113-hsk2-l5-wb");
  assert.equal((indexHtml.match(/20261113-hsk2-l5-wb/g) || []).length, 2, "index token bumped in both places");
  assert.match(appJs, /Luyện theo Workbook — /);
  assert.match(appJs, /30 câu: nghe 10, đọc 14, viết 6/);
  assert.match(appJs, /wbReadingPartHtml/);
  assert.match(appJs, /wbWritingPartHtml/);
  assert.match(appJs, /data-wbr-submit/);
  assert.match(appJs, /data-wbw-submit/);
  assert.match(appJs, /data-wbw-input/);
  // the pinned picture-grid rules stay untouched (Hoa's standing layout rule)
  assert.match(css, /\.wb-pic-grid\{[^}]*grid-template-columns:repeat\(3,1fr\)/);
  assert.match(css, /\.wb-shared-set\{grid-template-columns:repeat\(2,1fr\)\}/);
  assert.match(css, /\.wb-section-head\{/);
  assert.match(css, /\.wb-bank\{/);
  assert.match(css, /\.wb-write-input\{/);
});
