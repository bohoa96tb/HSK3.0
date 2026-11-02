import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
const content = JSON.parse(readFileSync(new URL('../data/content.json', import.meta.url)));
const lessons = [content.pilot, ...content.additionalLessons];

// Regression (2026-11-03, user report on Bài 10): every dialogue listening-
// comprehension item ("Câu hỏi nghe hiểu") must carry a playable audioSegment
// on one of its own lesson's tracks, inside the track's duration. Without it
// the exercise renderer shows no play button and the question is unanswerable
// as a listening task.
test('listening comprehension items all carry a playable audio segment', () => {
  let checked = 0;
  for (const l of lessons) {
    const tracks = new Map((l.reader?.audioTracks || []).map((t) => [t.id, t]));
    for (const it of l.exerciseSet?.items || []) {
      if (!/Câu hỏi nghe hiểu/.test(it.promptVi)) continue;
      checked++;
      const seg = it.audioSegment;
      assert.ok(seg, `${l.lessonId}/${it.id} has no audioSegment`);
      const tr = tracks.get(seg.trackId);
      assert.ok(tr, `${l.lessonId}/${it.id} segment track ${seg.trackId} not in lesson`);
      assert.ok(seg.start >= 0 && seg.end > seg.start && seg.end <= tr.durationSec,
        `${l.lessonId}/${it.id} segment ${seg.start}-${seg.end} outside track duration ${tr.durationSec}`);
      assert.equal(seg.status, 'asr-draft');
    }
  }
  assert.equal(checked, 24); // Lessons 5-10, four items each
});
