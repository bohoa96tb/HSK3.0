import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {buildReview, createReviewPlayer} from '../src/audio-review.js';
const data = JSON.parse(readFileSync(new URL('../data/content.json', import.meta.url)));
const content = data.additionalLessons.find(c => c.lessonId === 'hsk2-l01');
function fixture(voices = [{lang:'vi-VN'}, {lang:'zh-CN'}]) {
 const spoken = [], timers = [];
 const synth = {getVoices: () => voices, cancel(){}, speak(u){spoken.push(u);}};
 const p = createReviewPlayer({synth, Utterance: class {constructor(text){this.text=text;}}, schedule: fn => {timers.push(fn);return timers.length;}, unschedule(){}});
 p.load([{text:'你好',lang:'zh-CN'},{text:'Xin chào',lang:'vi-VN'}]);
 return {p,spoken,timers};
}
test('pilot only, detailed review includes all 15 words and 22 dialogue lines, no exercise answers', () => {
 assert.equal(buildReview(data.pilot).length,0);
 const quick=buildReview(content), detail=buildReview(content,'detail');
 assert.ok(detail.length>quick.length);
 for (const w of content.prepWords) assert.ok(detail.some(r=>r.source===w.id && r.text===w.zh));
 for (const s of content.reader.sentences) assert.ok(detail.some(r=>r.source===s.id && r.text===s.zh));
 assert.ok(detail.every(r=> !r.source.startsWith('tb2-')));
 for (const r of [...quick,...detail]) if(r.lang==='vi-VN') assert.ok(!/\p{Script=Han}/u.test(r.text));
});
test('automatic bilingual queue ends, replay starts at beginning',()=>{
 const {p,spoken,timers}=fixture(); p.toggle(); assert.equal(spoken[0].lang,'zh-CN');
 spoken[0].onend();timers.shift()();assert.equal(spoken[1].lang,'vi-VN');
 spoken[1].onend();timers.shift()();assert.equal(p.state().status,'ended');
 p.toggle();assert.equal(spoken.at(-1).text,'你好');
});
test('pause invalidates stale end callback; resume repeats current utterance',()=>{
 const {p,spoken,timers}=fixture();p.toggle();const stale=spoken[0].onend;p.toggle();stale();assert.equal(timers.length,0);
 p.toggle();assert.equal(spoken.at(-1).text,'你好');p.stop();assert.equal(p.state().status,'idle');
});
test('missing language fails visibly without speaking with wrong voice',()=>{
 const {p,spoken}=fixture([{lang:'en-US'},{lang:'zh-CN'}]);p.toggle();assert.equal(p.state().status,'error');assert.equal(spoken.length,0);
});
test('loop, skipping, rate and speech errors are controlled',()=>{
 const {p,spoken,timers}=fixture();p.configure({loop:true,rate:.8,gap:0});p.toggle();assert.equal(spoken[0].rate,.8);
 p.move(1);assert.equal(spoken.at(-1).lang,'vi-VN');spoken.at(-1).onend();timers.shift()();assert.equal(p.state().index,0);
 spoken.at(-1).onerror();assert.equal(p.state().status,'error');
});
test('Cantonese-only voice does not substitute for Mandarin',()=>{
 const {p,spoken}=fixture([{lang:'vi-VN'},{lang:'zh-HK'}]);p.toggle();assert.equal(p.state().status,'error');assert.equal(spoken.length,0);
});
test('summary controls switch scripts, pause, survive remount and stop on book audio', async()=>{
 const {JSDOM}=await import('jsdom');
 const {reviewHtml,mountReview,stopReview}=await import('../src/audio-review.js');
 const dom=new JSDOM('<main></main>');globalThis.window=dom.window;globalThis.document=dom.window.document;
 const spoken=[];Object.defineProperty(window,'speechSynthesis',{value:{getVoices:()=>[{lang:'vi-VN'},{lang:'zh-CN'}],cancel(){},speak(u){spoken.push(u);}}});
 window.SpeechSynthesisUtterance=class {constructor(text){this.text=text;}};
 const main=document.querySelector('main');main.innerHTML=reviewHtml(content);let pauses=0;mountReview(content,()=>pauses++);
 const click=s=>document.querySelector(s).click();
 click('[data-review-mode="detail"]');const count=document.querySelectorAll('[data-review-script] li').length;assert.ok(count>100);
 click('[data-review-action="play"]');assert.equal(pauses,1);assert.match(document.querySelector('[data-review-status]').textContent,/Đang nghe/);
 main.innerHTML=reviewHtml(content);mountReview(content,()=>pauses++);assert.match(document.querySelector('[data-review-status]').textContent,/Đang nghe/);
 click('[data-review-action="play"]');assert.match(document.querySelector('[data-review-status]').textContent,/Tạm dừng/);
 click('[data-review-action="play"]');window.dispatchEvent(new window.Event('hsk-audio-start'));assert.match(document.querySelector('[data-review-status]').textContent,/Sẵn sàng/);
 click('[data-review-mode="quick"]');assert.ok(document.querySelectorAll('[data-review-script] li').length<count);stopReview();dom.window.close();
});
