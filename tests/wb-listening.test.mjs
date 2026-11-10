import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";

const content = JSON.parse(readFileSync("data/content.json", "utf8"));
const les = content.additionalLessons.find((l) => l.lessonId === "hsk2-l01");
const wb = les.wbListening;

test("wb listening data: 3 parts, 10 items, book structure", () => {
  assert.ok(wb, "wbListening exists on hsk2-l01");
  assert.equal(wb.parts.length, 3);
  assert.deepEqual(wb.parts.map((p) => p.items.length), [3, 3, 4]);
  const ids = new Set();
  for (const p of wb.parts) {
    assert.ok(p.example && p.example.answer, `${p.id} has a worked example with an answer`);
    for (const it of p.items) {
      assert.ok(!ids.has(it.id), `unique id ${it.id}`); ids.add(it.id);
      assert.ok(it.answer, `${it.id} has an answer`);
      assert.ok(it.explainVi, `${it.id} has a Vietnamese explanation`);
      assert.ok(it.lines.length >= 1, `${it.id} has a transcript`);
      for (const l of it.lines) { assert.ok(l.zh && l.pinyin, `${it.id} line has zh + pinyin`); }
    }
  }
  assert.equal(ids.size, 10);
});

test("wb listening: answers are inside options; picture files exist", () => {
  for (const p of wb.parts) {
    const pool = p.kind === "picture-match" ? p.pictureSet : null;
    for (const it of [p.example, ...p.items]) {
      const opts = pool || it.options;
      assert.ok(opts.some((o) => o.id === it.answer), `${it.id}: answer is one of the options`);
      for (const o of opts) if (o.image) {
        assert.ok(existsSync(o.image), `image exists: ${o.image}`);
        assert.ok(o.imageAltVi && o.imageAltVi.length > 10, `${o.image}: alt text describes the scene`);
      }
    }
  }
});

test("wb listening: audio segments are ordered, inside the track, non-overlapping per part flow", () => {
  const track = les.reader.audioTracks.find((t) => t.id === wb.trackId);
  assert.ok(track, "workbook track registered");
  assert.match(track.url, /cdn\.baulchino\.com\/new-hsk-books-audios\/hsk-2-workbook\/lesson-01\/01-1\.mp3/);
  let lastEnd = 0;
  for (const p of wb.parts) for (const it of [p.example, ...p.items]) {
    const a = it.audio;
    assert.equal(a.trackId, wb.trackId);
    assert.ok(a.start >= lastEnd - 0.01, `${it.id}: starts after the previous unit (${a.start} >= ${lastEnd})`);
    assert.ok(a.end > a.start && a.end <= track.durationSec, `${it.id}: end inside track`);
    assert.equal(a.status, "asr-draft", `${it.id}: segment stays asr-draft until human listening`);
    lastEnd = a.end;
  }
});

test("wb renderer is wired into the exercises section with both modes", () => {
  const app = readFileSync("src/app.js", "utf8");
  assert.match(app, /wbListeningHtml\(content\)/, "zone rendered from sectionExercisesHtml");
  assert.match(app, /data-wb-mode="test"/, "test mode offered");
  assert.match(app, /data-wb-mode="practice"/, "practice mode offered");
  assert.match(app, /data-wb-submit/, "test mode has a submit action");
  assert.match(app, /Điểm của phần này tính riêng trong phiên/, "session-only scoring is stated in the UI");
  const css = readFileSync("assets/styles.css", "utf8");
  assert.match(css, /\.wb-pic-grid\{display:grid;grid-template-columns:repeat\(2,1fr\);gap:10px\}/, "picture grids are always 2 per row (Hoa 2026-11-10: 3 pictures wrap to 2 rows, 4 pictures are 2 rows of 2)");
  assert.ok(!/\.wb-pic-grid\{grid-template-columns:1fr/.test(css), "the old full-width stacked layout is gone");
  assert.ok(!/wb-shared-set\{grid-template-columns:repeat\(4,1fr\)/.test(css), "the 4-picture set no longer spreads to one row on desktop");
});
