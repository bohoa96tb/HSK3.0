import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
import {JSDOM} from 'jsdom';
import {gradeChoice,nextReviewState} from '../src/lib.js';
const content=JSON.parse(readFileSync(new URL('../data/content.json',import.meta.url)));
const dom=new JSDOM(readFileSync(new URL('../index.html',import.meta.url),'utf8'),{url:'https://example.test/HSK3.0/'});
for(const k of ['window','document','location','localStorage','FormData'])globalThis[k]=dom.window[k];
Object.defineProperty(globalThis,'navigator',{value:dom.window.navigator,configurable:true});
window.scrollTo=()=>{};
const audios=[];
class TestAudio extends EventTarget {
 constructor(){super();this.paused=true;this.ended=false;this.duration=10;this.currentTime=0;this.readyState=1;audios.push(this);}
 async play(){this.paused=false;this.dispatchEvent(new Event('play'));}
 pause(){this.paused=true;this.dispatchEvent(new Event('pause'));}
}
globalThis.Audio=TestAudio;
globalThis.fetch=async()=>({ok:true,json:async()=>structuredClone(content)});
localStorage.setItem('hsk30.progress.v1',JSON.stringify({schemaVersion:1,lessons:{'hsk1-l01':{completedSections:['intro','reader'],lastSectionId:'reader'}},attempts:[{exerciseId:'ex-01',correct:false,at:'2026-10-31'}],reviewItems:{old:{sourceItemId:'ex-01',kind:'exercise'}}}));
await import('../src/app.js');
const tick=()=>new Promise(r=>setTimeout(r,10));
await tick();
async function route(path){location.hash='#/'+path;await tick();}
const $=s=>document.querySelector(s);
const click=s=>$(s).click();
function change(s,value){const e=$(s);if(e.type==='checkbox')e.checked=value;else e.value=value;e.dispatchEvent(new window.Event('change',{bubbles:true}));}
const state=()=>JSON.parse(localStorage.getItem('hsk30.progress.v1'));

test('content uses original picture exercise, printed transcript and valid linked assets',()=>{
 assert.equal(content.pilot.exerciseSet.items.length,3);
 assert.equal(content.pilot.reader.passages.length,3);
 assert.deepEqual(content.pilot.selfCheckTasks[2].prompts,['lao','neng','ge','ba','fen','kan','bai','li','gong','mang','gou','hou']);
 for(const item of content.pilot.exerciseSet.items){assert.ok(existsSync(new URL('../'+item.image,import.meta.url)));assert.equal(gradeChoice(item,item.answer).correct,true);assert.ok(item.answerEvidence);}
 assert.equal(content.pilot.reader.sentences.length,10);
 assert.ok(content.pilot.knowledgePoints.find(x=>x.id.endsWith('initials-finals')).pattern.includes('ü'));
 assert.equal(nextReviewState(undefined,'known',Date.parse('2026-11-01')).intervalStep,0);
});

test('migration preserves old history but removes unsupported quiz from current review',()=>{
 const p=state();assert.equal(p.attempts.length,1);assert.ok(p.archivedReviewItems.old);assert.ok(!p.reviewItems.old);
 assert.deepEqual(p.lessons['hsk1-l01'].completedSections,[]);assert.equal(p.previousContentProgress[0].lesson.completedSections.length,2);
});

test('all pages render and lesson completion is idempotent',async()=>{
 for(const p of ['today','course','course/HSK%201','grammar','review','progress','settings','sources','sources/src-hsk1-textbook-pdf','lesson/hsk1-l02','lesson/hsk1-l01',...content.pilot.intro.sections.map(x=>'lesson/hsk1-l01/'+x.id)]){
  await route(p);assert.ok($('#main').textContent.trim().length>20,p);assert.equal($('#main').textContent.includes('undefined'),false,p);
 }
 await route('lesson/hsk1-l01/intro');click('#done-btn');const minutes=state().sessions[0].minutes;click('#done-btn');assert.equal(state().sessions[0].minutes,minutes);
});

test('reader controls preserve transcript, independently toggle aids and use the matching track',async()=>{
 await route('lesson/hsk1-l01/reader?passage=tb-dialogue-2');$('.transcript').open=true;
 const transcriptEl=$('.transcript');
 document.querySelector('[data-support="pinyin"]').click();
 assert.equal($('.transcript'),transcriptEl); // in-place toggle: same node, no re-render, no scroll reset
 assert.ok($('.transcript').open);assert.equal(document.querySelectorAll('.sentence .pinyin').length,4);
 assert.equal($('#main').classList.contains('off-pinyin-sent'),false);
 assert.equal($('#main').classList.contains('off-vi-sent'),true);
 document.querySelector('[data-support="vi"]').click();assert.equal($('#main').classList.contains('off-vi-sent'),false);
 assert.equal($('.transcript'),transcriptEl);
 click('[data-play]');await tick();assert.match(audios[0].src,/01-3.mp3$/);assert.equal(audios[0].paused,false);
 click('[data-play]');assert.equal(audios[0].paused,true);
 await route('lesson/hsk1-l01/reader?sentence=tb-s9');assert.ok($('#tb-s9').classList.contains('highlighted'));assert.match($('#tracks').textContent,/Hội thoại 3/);
});

test('picture exercise retains selection, records honest score, returns from explanation and saves writing drafts',async()=>{
 await route('lesson/hsk1-l01/exercises');change('input[value="2"]','2');$('input[value="2"]').checked=true;$('input[value="2"]').dispatchEvent(new window.Event('change',{bubbles:true}));
 await route('lesson/hsk1-l01/prep');await route('lesson/hsk1-l01/exercises');assert.equal($('input[value="2"]').checked,true);
 $('#ex-form').dispatchEvent(new window.Event('submit',{bubbles:true,cancelable:true}));assert.ok($('.feedback.bad'));assert.equal(state().attempts.at(-1).correct,false);
 await route('grammar/kp-hsk1-l01-nin?return=exercises');await route('lesson/hsk1-l01/exercises');assert.ok($('.feedback.bad'));
 click('#next-q');assert.match($('#main').textContent,/Hình 2/);
 const input=$('[data-draft="st-03:0"]');input.value='lǎo';input.dispatchEvent(new window.Event('input',{bubbles:true}));
 await route('lesson/hsk1-l01/summary');await route('lesson/hsk1-l01/exercises');assert.equal($('[data-draft="st-03:0"]').value,'lǎo');
 await route('lesson/hsk1-l01/exercises?item=wb-picture-1');assert.ok(!$('.feedback'));assert.match($('#main').textContent,/Hình 1/);
});
