// D27: mechanical conformance report against the Lesson-8 standard
// (docs/LESSON_STANDARD.md). This is a checklist aid only — it never
// replaces the independent content QA required by D17.
// Usage: node scripts/audit-standard.mjs
import { readFileSync } from 'node:fs';
import { segmentZh } from '../src/lib.js';

const content = JSON.parse(readFileSync(new URL('../data/content.json', import.meta.url), 'utf8'));
const lessons = [content.pilot, ...(content.additionalLessons || [])];

// Base lexicon mirrors src/app.js baseLexicon(): curated vocab of all lessons.
const base = new Map();
for (const c of lessons) for (const w of c.prepWords || []) {
  if (!base.has(w.zh)) base.set(w.zh, { zh: w.zh, pinyin: w.pinyin, hanViet: w.hanViet || null, vi: w.vi });
}
const HAS_HAN = /\p{Script=Han}/u;
function coverage(c) {
  if (!c.lookup) return null;
  const lex = new Map(base);
  for (const e of c.lookup.extras || []) lex.set(e.zh, e);
  const texts = [];
  for (const s of c.reader?.sentences || []) texts.push(s.zh);
  for (const kp of c.knowledgePoints || []) {
    if (String(kp.kind).startsWith('foundation')) continue;
    for (const e of kp.examples || []) if (e.zh && HAS_HAN.test(e.zh)) texts.push(e.zh);
  }
  for (const pt of c.summaryPoints || []) texts.push(pt.exampleZh);
  for (const t of c.apply?.tasks || []) if (t.sampleZh) texts.push(t.sampleZh);
  let full = 0;
  for (const t of texts) {
    const toks = segmentZh(t, lex);
    if (toks.every((x) => x.punct || x.entry)) full++;
  }
  return texts.length ? `${full}/${texts.length}` : '0/0';
}

console.log('Bài | Lộ trình | Nhóm từ | Từ+tên riêng | KP chính có Khi nào dùng+Thử ngay | Tổng kết | Tra từ (phủ bề mặt đích) | Bài chính | Tự luyện | Mô phỏng');
for (const c of lessons) {
  const main = (c.knowledgePoints || []).filter((k) => !String(k.kind).startsWith('foundation') && !(k.kindLabel || '').startsWith('Mẹo'));
  const ready = main.filter((k) => k.useWhenVi && k.quickCheck).length;
  const proper = (c.prepWords || []).filter((w) => w.isProperName).length;
  const words = (c.prepWords || []).length - proper;
  console.log([
    c.lessonId,
    c.learningPath ? `có (${c.learningPath.length} bước)` : 'THIẾU',
    c.prepGroups ? `có (${c.prepGroups.length} nhóm)` : 'thiếu',
    `${words}+${proper}`,
    `${ready}/${main.length}`,
    c.summaryPoints ? `có (${c.summaryPoints.length})` : 'THIẾU',
    c.lookup ? `có (${coverage(c)})` : 'THIẾU',
    `${c.exerciseSet?.items?.length || 0} câu`,
    `${(c.selfCheckTasks || []).length} bài`,
    c.suppExerciseSet ? `có (${c.suppExerciseSet.items.length})` : '—',
  ].join(' | '));
}
