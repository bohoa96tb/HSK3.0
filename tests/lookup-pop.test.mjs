// Regression: lookup popover clipped on iPad (reported 2026-11-13).
// Root cause: the base .lookup-pop rule is a mobile bottom sheet with
// `bottom: calc(var(--player-inset, 0px) + 8px)`. The >=641px media query
// switched it to position:absolute + JS-set `top` (document coordinates)
// but never reset `bottom`, so the browser stretched the box between a
// document-coordinate top and a viewport-relative bottom — the further
// the page was scrolled, the shorter the box, until only the card head
// showed. The media rule must set bottom:auto so height follows content.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { JSDOM } from 'jsdom';

const css = readFileSync(new URL('../assets/styles.css', import.meta.url), 'utf8');
const content = JSON.parse(readFileSync(new URL('../data/content.json', import.meta.url), 'utf8'));

function mediaBlock(cssText, query) {
  const i = cssText.indexOf(query);
  assert.ok(i >= 0, `media query ${query} present`);
  const start = cssText.indexOf('{', i);
  let depth = 0;
  for (let j = start; j < cssText.length; j++) {
    if (cssText[j] === '{') depth++;
    if (cssText[j] === '}' && --depth === 0) return cssText.slice(start + 1, j);
  }
  throw new Error('unbalanced media block');
}

test('lookup popover: >=641px rule resets bottom so the card is not stretched/clipped', () => {
  const block = mediaBlock(css, '@media (min-width:641px)');
  const rule = block.match(/\.lookup-pop\{([^}]*)\}/);
  assert.ok(rule, '.lookup-pop rule inside the >=641px media query');
  assert.match(rule[1], /position:absolute/, 'wide screens keep the anchored popover');
  assert.match(rule[1], /bottom:auto/, 'bottom must be reset — otherwise top+bottom stretch clips the card (iPad bug)');
  assert.match(rule[1], /width:320px/);
});

test('lookup popover: narrow screens keep the fixed bottom sheet', () => {
  const base = css.match(/\.lookup-pop\{([^}]*)\}/);
  assert.ok(base, 'base .lookup-pop rule present');
  assert.match(base[1], /position:fixed/);
  assert.match(base[1], /bottom:calc\(var\(--player-inset/);
  assert.match(base[1], /overflow:auto/);
});

// ---- DOM: the reported word renders the FULL card --------------------------
const dom = new JSDOM(readFileSync(new URL('../index.html', import.meta.url), 'utf8'), { url: 'https://example.test/HSK3.0/' });
for (const k of ['window', 'document', 'location', 'localStorage', 'FormData']) globalThis[k] = dom.window[k];
Object.defineProperty(globalThis, 'navigator', { value: dom.window.navigator, configurable: true });
window.scrollTo = () => {};
window.scrollBy = () => {};
window.HTMLElement.prototype.scrollIntoView = () => {};
globalThis.requestAnimationFrame = (fn) => { fn(); return 0; };
class TestAudio extends EventTarget {
  constructor() { super(); this.paused = true; this.ended = false; this.duration = 500; this.currentTime = 0; this.readyState = 1; }
  async play() { this.paused = false; this.dispatchEvent(new Event('play')); }
  pause() { this.paused = true; this.dispatchEvent(new Event('pause')); }
}
globalThis.Audio = TestAudio;
globalThis.fetch = async () => ({ ok: true, json: async () => structuredClone(content) });
localStorage.setItem('hsk30.progress.v1', JSON.stringify({ schemaVersion: 1, learningRevision: 'textbook-pilot-v2', contentRevision: 'x' }));
await import('../src/app.js');
const tick = () => new Promise((r) => setTimeout(r, 10));
await tick();
async function route(path) { location.hash = '#/' + path; await tick(); }
const $ = (s) => document.querySelector(s);

test('HSK2 Lesson 2 reader: tapping 北京大学 opens the complete lookup card', async () => {
  await route('lesson/hsk2-l02/reader');
  const tok = [...document.querySelectorAll('[data-tok]')].find((b) => b.dataset.tok === '北京大学');
  assert.ok(tok, '北京大学 token rendered in Dialogue 1');
  tok.click(); await tick();
  const pop = $('#lookup-pop');
  assert.ok(pop && !pop.hidden, 'popover open');
  const text = pop.textContent;
  assert.match(text, /北京大学/, 'card head shows the word');
  assert.match(text, /Běijīng Dàxué/, 'Pinyin row present');
  assert.match(text, /BẮC KINH ĐẠI HỌC/, 'Hán–Việt row present');
  assert.match(text, /Đại học Bắc Kinh/, 'Nghĩa row present');
  assert.ok(pop.querySelector('[data-lk-speak]'), 'pronunciation button present');
  assert.match(text, /Dữ liệu:/, 'data-status line present — the whole card, not just the head');
  document.querySelector('#lookup-pop [data-lk-close]').click(); await tick();
  assert.ok(pop.hidden, 'popover closes');
});
