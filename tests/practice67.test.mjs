import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { JSDOM } from 'jsdom';
import { gradeDictation } from '../src/lib.js';
const content = JSON.parse(readFileSync(new URL('../data/content.json', import.meta.url)));
const lessons = [6,7].map(n=>content.additionalLessons.find(l=>l.lessonId===`hsk1-l0${n}`));
test('contrast reading is source-confirmed practice, never a single-answer quiz',()=>{
 const tasks=[lessons[0].selfCheckTasks[1],...lessons[1].selfCheckTasks.slice(0,2)];
 for(const t of tasks){
  assert.equal(t.kind,'listening-comparison');assert.ok(t.practiceEvidence);assert.ok(t.guideVi);
  assert.equal(gradeDictation(t,['anything']).total,0);assert.equal(t.answers,undefined);
  assert.ok(t.audioSegment.end>t.audioSegment.start);assert.equal(t.segment,undefined);assert.equal(t.audioSegmentStatus,'asr-draft');
 }
 assert.equal(lessons[1].selfCheckTasks[1].prompts[14],'bìn / bìng');
 assert.equal(lessons[0].selfCheckTasks[0].sourceRefs.find(r=>r.sourceId==='src-wb-listening-script').printedPage,'016');
});
test('all eight picture-dependent speaking prompts have attributed images and no unrelated track',()=>{
 for(const l of lessons){const t=l.selfCheckTasks[2];assert.equal(t.promptImages.length,4);assert.equal(t.audioTrackId,undefined);assert.doesNotMatch(t.instructionVi,/7 giờ 55|10 giờ/);
  for(const fig of t.promptImages){assert.ok(existsSync(new URL('../'+fig.src,import.meta.url)));assert.ok(fig.sourceRefs.length);assert.ok(fig.alt);}
 }
});
const dom=new JSDOM(readFileSync(new URL('../index.html',import.meta.url),'utf8'),{url:'https://example.test/HSK3.0/'});
for(const k of ['window','document','location','localStorage','FormData'])globalThis[k]=dom.window[k];
Object.defineProperty(globalThis,'navigator',{value:dom.window.navigator,configurable:true});
window.scrollTo=()=>{};window.scrollBy=()=>{};window.HTMLElement.prototype.scrollIntoView=()=>{};
globalThis.requestAnimationFrame=fn=>{fn();return 0;};
const audios=[];
class TestAudio extends EventTarget{constructor(){super();this.paused=true;this.ended=false;this.duration=400;this.currentTime=0;this.readyState=1;audios.push(this);}async play(){this.paused=false;this.dispatchEvent(new Event('play'));}pause(){this.paused=true;this.dispatchEvent(new Event('pause'));}}
globalThis.Audio=TestAudio;globalThis.fetch=async()=>({ok:true,json:async()=>structuredClone(content)});
await import('../src/app.js');const tick=()=>new Promise(r=>setTimeout(r,15));await tick();
async function route(p){location.hash='#/'+p;await tick();}
test('comparison UI preserves old notes, plays the intended block and never offers grading',async()=>{
 await route('lesson/hsk1-l07/exercises?task=st-l07-01');
 const task=document.getElementById('st-l07-01');assert.match(task.textContent,/không có đáp án duy nhất/);assert.equal(task.querySelector('[data-check-dict]'),null);
 const input=task.querySelector('[data-draft="st-l07-01:0"]');input.value='ghi chú đã lưu';input.dispatchEvent(new window.Event('input',{bubbles:true}));
 task.querySelector('[data-play-task]').click();audios[0].onloadedmetadata?.();await tick();assert.equal(audios[0].currentTime,67.6);assert.match(audios[0].src,/07-1.mp3$/);
 audios[0].currentTime=149;audios[0].dispatchEvent(new Event('timeupdate'));assert.equal(audios[0].paused,true);
 await route('lesson/hsk1-l06/exercises?task=st-l06-02');const t6=document.getElementById('st-l06-02');t6.querySelector('[data-play-task]').click();audios[0].onloadedmetadata?.();await tick();assert.equal(audios[0].currentTime,47.8);
 await route('lesson/hsk1-l07/exercises?task=st-l07-01');assert.equal(document.querySelector('[data-draft="st-l07-01:0"]').value,'ghi chú đã lưu');
 assert.equal(document.getElementById('st-l07-03').querySelectorAll('img').length,4);assert.equal(document.getElementById('st-l07-03').querySelector('[data-play-task]'),null);
});

test('lesson intro renders the source caption, not only the image alt',async()=>{
 await route('lesson/hsk1-l07/intro');assert.match(document.querySelector('.context-figure figcaption').textContent,/Textbook, trang 046/);
 await route('lesson/hsk1-l06/intro');assert.match(document.querySelector('.context-figure figcaption').textContent,/Textbook, trang 036/);
});
