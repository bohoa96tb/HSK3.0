// Progress + settings persistence for the pilot.
// Pilot decision D02 (docs/DECISIONS.md): localStorage with schemaVersion and
// JSON export/import; IndexedDB is deferred until after the pilot.
import { emptyProgress, migrateProgress, validateProgress } from "./lib.js?v=20261101-lesson6-4";

const KEY = "hsk30.progress.v1";
const BACKUP_KEY = "hsk30.progress.backup-before-import";

let cache = null;

export function loadProgress() {
  if (cache) return cache;
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const parsed = migrateProgress(JSON.parse(raw));
      if (parsed) { cache = parsed; return cache; }
    }
  } catch { /* corrupted storage falls through to a fresh state */ }
  cache = emptyProgress();
  return cache;
}

export function saveProgress() {
  if (!cache) return;
  try { localStorage.setItem(KEY, JSON.stringify(cache)); } catch { /* storage full/blocked: keep in-memory state */ }
}

export function update(mutator) {
  const p = loadProgress();
  mutator(p);
  saveProgress();
  return p;
}

export function exportProgressJson() {
  return JSON.stringify(loadProgress(), null, 2);
}

// Returns {ok, errors}. On success the previous state is kept under
// BACKUP_KEY before the imported state replaces it.
export function importProgressJson(text) {
  let data;
  try { data = JSON.parse(text); }
  catch { return { ok: false, errors: ["File không phải JSON hợp lệ."] }; }
  const check = validateProgress(data);
  if (!check.ok) return { ok: false, errors: check.errors };
  try { localStorage.setItem(BACKUP_KEY, JSON.stringify(loadProgress())); } catch { /* ignore */ }
  cache = migrateProgress(data);
  saveProgress();
  return { ok: true, errors: [] };
}

export function summarizeForPreview(text) {
  let data;
  try { data = JSON.parse(text); } catch { return null; }
  const check = validateProgress(data);
  if (!check.ok) return null;
  return {
    lessonsTouched: Object.keys(data.lessons || {}).length,
    attempts: (data.attempts || []).length,
    reviewItems: Object.keys(data.reviewItems || {}).length,
    selfChecks: Object.keys(data.selfChecks || {}).length,
  };
}
