// D38: a browser without recording support must still SHOW the mic and
// explain how to get it — the feature must never silently disappear.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { JSDOM } from 'jsdom';
const content = JSON.parse(readFileSync(new URL('../data/content.json', import.meta.url)));
const dom = new JSDOM(readFileSync(new URL('../index.html', import.meta.url), 'utf8'), { url: 'https://example.test/HSK3.0/' });
for (const k of ['window', 'document', 'location', 'localStorage', 'FormData']) globalThis[k] = dom.window[k];
Object.defineProperty(globalThis, 'navigator', { value: dom.window.navigator, configurable: true });
window.scrollTo = () => {};
window.scrollBy = () => {};
window.HTMLElement.prototype.scrollIntoView = () => {};
globalThis.requestAnimationFrame = (fn) => { fn(); return 0; };
globalThis.Audio = class extends EventTarget { async play() {} pause() {} };
globalThis.fetch = async () => ({ ok: true, json: async () => structuredClone(content) });
localStorage.setItem('hsk30.progress.v1', JSON.stringify({ schemaVersion: 1, learningRevision: 'textbook-pilot-v2', contentRevision: 'x' }));
await import('../src/app.js');
const tick = () => new Promise((r) => setTimeout(r, 10));
await tick();
location.hash = '#/lesson/hsk2-l01/reader';
await tick();
const $$ = (s) => [...document.querySelectorAll(s)];

test('unsupported browser: mic buttons still render; tap shows guidance', async () => {
  const mics = $$('[data-rec]');
  assert.ok(mics.length > 0, 'mic buttons render even without media support');
  const id = mics[0].dataset.rec;
  mics[0].click();
  await tick();
  assert.match(document.querySelector(`[data-rec-status="${id}"]`).textContent, /không hỗ trợ thu âm.*Chrome.*Safari/s, 'guidance names a working browser');
});
