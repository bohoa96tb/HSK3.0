import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {buildReview, createReviewPlayer} from '../src/audio-review.js';
const data = JSON.parse(readFileSync(new URL('../data/content.json', import.meta.url)));
const content = data.additionalLessons.find(c => c.lessonId === 'hsk2-l01');
const content2 = data.additionalLessons.find(c => c.lessonId === 'hsk2-l02');
const content3 = data.additionalLessons.find(c => c.lessonId === 'hsk2-l03');
const notEnabled = data.additionalLessons.find(c => c.lessonId === 'hsk1-l02');
function fixture(voices = [{lang:'vi-VN'}, {lang:'zh-CN'}]) {
 const spoken = [], timers = [], watchdogs = [];
 const synth = {getVoices: () => voices, cancel(){}, speak(u){spoken.push(u);u.onstart?.();}};
 const p = createReviewPlayer({synth, Utterance: class {constructor(text){this.text=text;}}, schedule: (fn,ms) => {if(ms===10000){watchdogs.push(fn);return -1;} timers.push(fn);return timers.length;}, unschedule(){}});
 p.load([{text:'你好',lang:'zh-CN'},{text:'Xin chào',lang:'vi-VN'}]);
 return {p,spoken,timers,watchdogs};
}
test('enabled lessons only, detailed review includes all 15 words and 22 dialogue lines, no exercise answers', () => {
 assert.equal(buildReview(data.pilot).length,0);
 assert.equal(buildReview(notEnabled).length,0);
 const quick=buildReview(content), detail=buildReview(content,'detail');
 assert.ok(detail.length>quick.length);
 for (const w of content.prepWords) assert.ok(detail.some(r=>r.source===w.id && r.text===w.zh));
 for (const s of content.reader.sentences) assert.ok(detail.some(r=>r.source===s.id && r.text===s.zh));
 assert.ok(detail.every(r=> !r.source.startsWith('tb2-')));
 // Pattern rows are the one exception: their text is the on-screen formula,
 // while their spoken content is the separate Vietnamese paraphrase.
 for (const r of [...quick,...detail]) if(r.lang==='vi-VN' && r.label!=='Mẫu câu') assert.ok(!/\p{Script=Han}/u.test(r.text));
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
test('empty Android voice list still attempts language-based speech',()=>{
 const {p,spoken}=fixture([]);p.toggle();assert.equal(p.state().status,'playing');assert.equal(spoken[0].lang,'zh-CN');assert.equal(spoken[0].voice,undefined);
 spoken[0].onerror({error:'language-unavailable'});assert.equal(p.state().status,'error');assert.match(p.state().error,/tiếng Trung/);
});
test('loop, skipping, rate and speech errors are controlled',()=>{
 const {p,spoken,timers}=fixture();p.configure({loop:true,rate:.8,gap:0});p.toggle();assert.equal(spoken[0].rate,.8);
 p.move(1);assert.equal(spoken.at(-1).lang,'vi-VN');spoken.at(-1).onend();timers.shift()();assert.equal(p.state().index,0);
 spoken.at(-1).onerror();assert.equal(p.state().status,'error');
});
test('Cantonese-only voice does not substitute for Mandarin',()=>{
 const {p,spoken}=fixture([{lang:'vi-VN'},{lang:'zh-HK'}]);p.toggle();assert.equal(spoken[0].voice,undefined);assert.equal(spoken[0].lang,'zh-CN');
});
test('summary controls switch scripts, pause, survive remount and stop on book audio', async()=>{
 const {JSDOM}=await import('jsdom');
 const {reviewHtml,mountReview,stopReview}=await import('../src/audio-review.js');
 const dom=new JSDOM('<main></main>');globalThis.window=dom.window;globalThis.document=dom.window.document;
 const spoken=[];Object.defineProperty(window,'speechSynthesis',{value:{getVoices:()=>[{lang:'vi-VN'},{lang:'zh-CN'}],cancel(){},speak(u){spoken.push(u);u.onstart?.();}}});
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

test('silent engine times out rather than claiming playback',()=>{
 let watchdog, pending;
 const p=createReviewPlayer({synth:{cancel(){},getVoices:()=>[],speak(u){pending=u;}},Utterance:class{},schedule:fn=>{watchdog=fn;},unschedule(){}});
 p.load([{text:'Xin chào',lang:'vi-VN'}]);p.toggle();assert.equal(p.state().status,'starting');watchdog();assert.equal(p.state().status,'error');assert.match(p.state().error,/không khởi động/);assert.equal(pending.onstart,null);
});
test('speech filters punctuation and source notes without dropping lesson words', async()=>{
 const {reviewSpeechText,cleanReviewText}=await import('../src/audio-review.js');
 assert.equal(reviewSpeechText('你好，朋友！'), '你好 朋友');
 assert.equal(reviewSpeechText('请 / 让 + người → việc…'), '请 让 người việc');
 assert.equal(reviewSpeechText('Mình muốn nhờ bạn giúp một việc. (ví dụ trong sách; tr.003)'), 'Mình muốn nhờ bạn giúp một việc');
 assert.ok(cleanReviewText('lần đầu (không phải lần hai)').includes('không phải lần hai'));
 assert.equal(reviewSpeechText('dấu phẩy và dấu chấm là dấu câu'), 'dấu phẩy và dấu chấm là dấu câu');
 for(const r of buildReview(content,'detail')) {assert.ok(r.speechText);assert.ok(!/[^\p{L}\p{M}\p{N}\s]/u.test(r.speechText));}
});
test('paired transcript groups keep Chinese and Vietnamese together',()=>{
 const rows=buildReview(content,'detail');
 for(const w of content.prepWords){const group=rows.filter(r=>r.source===w.id);assert.equal(new Set(group.map(r=>r.group)).size,1);assert.deepEqual([...new Set(group.map(r=>r.paragraph))],[0,1]);}
});
test('device receives sanitized speech while transcript retains punctuation',()=>{
 const {p,spoken}=fixture();const rows=buildReview(content,'detail');const row=rows.find(r=>r.text.includes('。'));
 assert.ok(row);p.load([row]);p.toggle();assert.equal(spoken[0].text,row.speechText);assert.ok(!spoken[0].text.includes('。'));assert.ok(p.state().queue[0].text.includes('。'));p.stop();
});
test('non-spoken separators are retained in the displayed paragraph',async()=>{
 const {cleanReviewText}=await import('../src/audio-review.js');const rows=buildReview(content);
 for(const pt of content.summaryPoints){const first=rows.find(r=>r.label===pt.titleVi);const display=rows.filter(r=>r.group===first.group).map(r=>r.displayText).join('');assert.equal(display,cleanReviewText(pt.bodyVi));}
 assert.ok(rows.some(r=>r.displayText.includes(' + ')));
});
test('Vietnamese and Chinese punctuation produces short and long silent pauses',async()=>{
 const {reviewSpeechChunks}=await import('../src/audio-review.js');
 assert.deepEqual(reviewSpeechChunks('Xin chào, bạn khỏe không? Tôi khỏe.'),[
  {text:'Xin chào',pauseMs:300},{text:'bạn khỏe không',pauseMs:750},{text:'Tôi khỏe',pauseMs:750}]);
 assert.deepEqual(reviewSpeechChunks('你好，朋友。再见！'),[{text:'你好',pauseMs:300},{text:'朋友',pauseMs:750},{text:'再见',pauseMs:750}]);
 assert.equal(reviewSpeechChunks('请 + 人 / 做（事）').length,1);
});
test('player waits for comma and full stop within one transcript row',()=>{
 const spoken=[],delays=[],pending=[];
 const p=createReviewPlayer({synth:{getVoices:()=>[],cancel(){},speak(u){spoken.push(u);u.onstart?.();}},Utterance:class{constructor(text){this.text=text;}},schedule:(fn,ms)=>{if(ms!==10000){delays.push(ms);pending.push(fn);}return ms;},unschedule(){}});
 p.load([{text:'Chào bạn, tôi đến rồi. Cùng đi nhé!',lang:'vi-VN',group:1,paragraph:0}]);p.toggle();
 assert.equal(spoken[0].text,'Chào bạn');spoken[0].onend();assert.equal(delays[0],300);assert.equal(p.state().index,0);
 pending.shift()();assert.equal(spoken[1].text,'tôi đến rồi');spoken[1].onend();assert.equal(delays[1],750);
 pending.shift()();assert.equal(spoken[2].text,'Cùng đi nhé');p.stop();
});
test('HSK2 lesson 2 detail includes all 17 word entries, 21 dialogue lines in order, no exercise answers', async () => {
 const {reviewHtml, reviewDetailLabel} = await import('../src/audio-review.js');
 const detail = buildReview(content2, 'detail'), quick = buildReview(content2);
 assert.ok(detail.length > quick.length);
 assert.equal(content2.prepWords.length, 17);
 for (const w of content2.prepWords) assert.ok(detail.some(r => r.source === w.id && r.text === w.zh), w.zh);
 // Dialogue lines keep lesson order and speaker attribution on the pair label.
 const lineRows = content2.reader.sentences.map(s => detail.find(r => r.source === s.id && r.text === s.zh));
 assert.ok(lineRows.every(Boolean));
 const positions = lineRows.map(r => detail.indexOf(r));
 assert.deepEqual(positions, [...positions].sort((a, b) => a - b));
 for (const s of content2.reader.sentences) {
  const row = detail.find(r => r.source === s.id && r.text === s.zh);
  if (s.speaker) assert.ok(row.label.includes(s.speaker), row.label);
 }
 assert.ok(detail.every(r => !String(r.source).startsWith('tb2-')));
 assert.ok(detail.every(r => !content2.exerciseSet.items.some(i => i.id === r.source)));
 // Counts in the mode button come from this lesson's data.
 assert.equal(reviewDetailLabel(content2), '16 từ + 1 tên riêng + 3 điểm ngữ pháp + 4 đoạn');
 assert.ok(reviewHtml(content2).includes('16 từ + 1 tên riêng + 3 điểm ngữ pháp + 4 đoạn'));
 assert.equal(reviewHtml(notEnabled), '');
 // Foundation characters are not read as grammar; writing stays in the writing area.
 assert.ok(detail.every(r => !content2.knowledgePoints.filter(k => k.kind !== 'grammar').some(k => k.id === r.source)));
});
test('HSK2 lesson 2 speech is sanitized, negations and parenthetical meanings survive', () => {
 const detail = buildReview(content2, 'detail');
 for (const r of detail) { assert.ok(r.speechText); assert.ok(!/[^\p{L}\p{M}\p{N}\s]/u.test(r.speechText), r.speechText); }
 const neg = detail.filter(r => r.source === 'h2l2-s18');
 assert.ok(neg.some(r => r.text.includes('别')));
 assert.ok(neg.some(r => r.text.includes('đừng')));
 const particle = detail.filter(r => r.source === 'h2l2-w08');
 assert.ok(particle.some(r => (r.displayText || '').includes('trợ từ cuối câu')));
 const gloss = detail.filter(r => r.source === 'kp-hsk2-l02-attributive');
 assert.ok(gloss.some(r => (r.displayText || '').includes('(họ bán)')));
});
test('grammar patterns stay on screen but are spoken as Vietnamese paraphrases', () => {
 for (const lesson of [content, content2, content3]) {
  const detail = buildReview(lesson, 'detail');
  for (const k of lesson.knowledgePoints.filter(k => k.kind === 'grammar')) {
   const row = detail.find(r => r.source === k.id && r.label === 'Mẫu câu');
   assert.ok(row, k.id);
   assert.equal(row.displayText, k.pattern);
   assert.ok(row.speechSource && row.speechSource.length > 20, k.id);
   assert.ok(!/\+/u.test(row.speechSource), row.speechSource);
   assert.ok(!/\p{Script=Han}/u.test(row.speechSource), row.speechSource);
   assert.equal(row.lang, 'vi-VN');
  }
 }
});
test('player speaks the pattern paraphrase, not the formula fragments', () => {
 const {p, spoken} = fixture();
 const detail = buildReview(content2, 'detail');
 const row = detail.find(r => r.label === 'Mẫu câu' && r.source === 'kp-hsk2-l02-duo');
 p.load([row]); p.toggle();
 assert.ok(spoken.length >= 1);
 assert.ok(!spoken[0].text.includes('+'));
 assert.ok(!/\p{Script=Han}/u.test(spoken[0].text), spoken[0].text);
 assert.equal(spoken[0].lang, 'vi-VN');
 p.stop();
});
test('HSK2 lesson 2 summary controls mount, switch modes and stop on book audio', async () => {
 const {JSDOM} = await import('jsdom');
 const {reviewHtml, mountReview, stopReview} = await import('../src/audio-review.js');
 const dom = new JSDOM('<main></main>'); globalThis.window = dom.window; globalThis.document = dom.window.document;
 const spoken = []; Object.defineProperty(window, 'speechSynthesis', {value: {getVoices: () => [{lang: 'vi-VN'}, {lang: 'zh-CN'}], cancel(){}, speak(u){spoken.push(u); u.onstart?.();}}});
 window.SpeechSynthesisUtterance = class { constructor(text){ this.text = text; } };
 const main = document.querySelector('main'); main.innerHTML = reviewHtml(content2);
 mountReview(content2, () => {});
 const click = s => document.querySelector(s).click();
 click('[data-review-mode="detail"]');
 const detailCount = document.querySelectorAll('[data-review-script] li').length;
 assert.ok(detailCount > 100);
 click('[data-review-action="play"]');
 assert.match(document.querySelector('[data-review-status]').textContent, /Đang nghe/);
 // Book-audio stop is covered by the lesson 1 DOM test (one shared controller).
 click('[data-review-action="stop"]');
 assert.match(document.querySelector('[data-review-status]').textContent, /Sẵn sàng/);
 click('[data-review-mode="quick"]');
 assert.ok(document.querySelectorAll('[data-review-script] li').length < detailCount);
 stopReview(); dom.window.close();
});
test('HSK2 lesson 3 detail includes all 15 words, 18 dialogue lines in order, no exercise answers', async () => {
 const {reviewHtml, reviewDetailLabel} = await import('../src/audio-review.js');
 const detail = buildReview(content3, 'detail'), quick = buildReview(content3);
 assert.ok(detail.length > quick.length);
 assert.equal(content3.prepWords.length, 15);
 for (const w of content3.prepWords) assert.ok(detail.some(r => r.source === w.id && r.text === w.zh), w.zh);
 const lineRows = content3.reader.sentences.map(s => detail.find(r => r.source === s.id && r.text === s.zh));
 assert.ok(lineRows.every(Boolean));
 const positions = lineRows.map(r => detail.indexOf(r));
 assert.deepEqual(positions, [...positions].sort((a, b) => a - b));
 for (const s of content3.reader.sentences) {
  const row = detail.find(r => r.source === s.id && r.text === s.zh);
  if (s.speaker) assert.ok(row.label.includes(s.speaker), row.label);
 }
 assert.ok(detail.every(r => !content3.exerciseSet.items.some(i => i.id === r.source)));
 assert.equal(reviewDetailLabel(content3), '15 từ + 3 điểm ngữ pháp + 4 đoạn');
 assert.ok(reviewHtml(content3).includes('15 từ + 3 điểm ngữ pháp + 4 đoạn'));
 assert.ok(detail.every(r => !content3.knowledgePoints.filter(k => k.kind !== 'grammar').some(k => k.id === r.source)));
 // Negation of the result complement survives: 没 in Chinese, chưa/không in Vietnamese.
 assert.ok(detail.some(r => r.text.includes('没做完')));
 assert.ok(detail.some(r => r.text.includes('没吃完')));
 for (const r of detail) { assert.ok(r.speechText); assert.ok(!/[^\p{L}\p{M}\p{N}\s]/u.test(r.speechText), r.speechText); }
});
test('HSK2 lesson 3 summary controls mount and switch modes', async () => {
 const {JSDOM} = await import('jsdom');
 const {reviewHtml, mountReview, stopReview} = await import('../src/audio-review.js');
 const dom = new JSDOM('<main></main>'); globalThis.window = dom.window; globalThis.document = dom.window.document;
 Object.defineProperty(window, 'speechSynthesis', {value: {getVoices: () => [{lang: 'vi-VN'}, {lang: 'zh-CN'}], cancel(){}, speak(u){u.onstart?.();}}});
 window.SpeechSynthesisUtterance = class { constructor(text){ this.text = text; } };
 const main = document.querySelector('main'); main.innerHTML = reviewHtml(content3);
 mountReview(content3, () => {});
 const click = s => document.querySelector(s).click();
 click('[data-review-mode="detail"]');
 const detailCount = document.querySelectorAll('[data-review-script] li').length;
 assert.ok(detailCount > 100);
 click('[data-review-action="play"]');
 assert.match(document.querySelector('[data-review-status]').textContent, /Đang nghe/);
 click('[data-review-action="stop"]');
 assert.match(document.querySelector('[data-review-status]').textContent, /Sẵn sàng/);
 click('[data-review-mode="quick"]');
 assert.ok(document.querySelectorAll('[data-review-script] li').length < detailCount);
 stopReview(); dom.window.close();
});
