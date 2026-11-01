// One audio element; source media is streamed, never copied into the repo.
import { loadProgress, update } from './store.js?v=20261101-lesson6-3';
const audio = new Audio();
audio.preload = 'none';
const listeners = new Set();
let current = null, lastError = null, generation = 0, savedBucket = -1, stopAt = null, currentSegment = null;
export function getState() {
 return {trackId:current?.id??null,playing:!audio.paused&&!audio.ended,currentTime:audio.currentTime||0,duration:Number.isFinite(audio.duration)?audio.duration:current?.durationSec||0,error:lastError,label:current?.label??null,url:current?.url??null,segment:currentSegment};
}
function emit(){const state=getState();for(const fn of listeners)fn(state);}
function persist(){if(current)update(p=>{p.audioState[current.id]={position:audio.currentTime||0,url:current.url};});}
audio.addEventListener('timeupdate',()=>{if(stopAt!=null&&audio.currentTime>=stopAt){stopAt=null;audio.pause();persist();emit();return;}const bucket=Math.floor(audio.currentTime/5);if(bucket!==savedBucket){savedBucket=bucket;persist();}emit();});
for(const event of ['play','loadedmetadata','ended','ratechange'])audio.addEventListener(event,emit);
audio.addEventListener('ended',()=>{currentSegment=null;});
audio.addEventListener('pause',()=>{persist();emit();});
audio.addEventListener('error',()=>{lastError='Không tải được audio. Chạm Phát để thử lại hoặc mở trang audio nguồn.';emit();});
export function subscribe(fn){listeners.add(fn);fn(getState());return()=>listeners.delete(fn);}
async function start(){try{await audio.play();}catch(e){if(e.name!=='AbortError'){lastError='Chưa phát được audio. Chạm Phát để thử lại.';emit();}}}
export function playTrack(track,{rate=1}={}){
 if(!track)return;
 stopAt=null;currentSegment=null;
 const retry=!!lastError;lastError=null;
 if(current?.id===track.id&&!retry){audio.playbackRate=rate;if(audio.paused){if(audio.ended)audio.currentTime=0;start();}else audio.pause();emit();return;}
 audio.pause();persist();current=track;savedBucket=-1;const version=++generation;
 audio.src=track.url;audio.playbackRate=rate;
 audio.onloadedmetadata=()=>{if(version!==generation)return;const saved=loadProgress().audioState[track.id];if(saved?.position>3&&saved.position<audio.duration-5)audio.currentTime=saved.position;emit();};
 if('mediaSession' in navigator){navigator.mediaSession.metadata=new MediaMetadata({title:track.label,artist:'HSK 3.0 · Baulchino'});navigator.mediaSession.setActionHandler('play',()=>start());navigator.mediaSession.setActionHandler('pause',()=>pause());}
 start();emit();
}
// Play only [start, end] of a track (used for per-exercise dictation
// segments); playback pauses itself at `end` via the timeupdate guard.
export function playSegment(track,{start:segStart=0,end:segEnd=null,rate=1}={}){
 if(!track)return;
 lastError=null;
 stopAt=(segEnd!=null&&segEnd>segStart)?segEnd:null;
 currentSegment={trackId:track.id,start:segStart,end:stopAt};
 audio.playbackRate=rate;
 if(current?.id===track.id&&audio.src){audio.currentTime=segStart;if(audio.paused)start();emit();return;}
 audio.pause();persist();current=track;savedBucket=-1;const version=++generation;
 audio.src=track.url;
 audio.onloadedmetadata=()=>{if(version!==generation)return;audio.currentTime=segStart;emit();};
 start();emit();
}
export function pause(){stopAt=null;audio.pause();emit();}
export function seek(sec){if(Number.isFinite(sec)&&audio.readyState>=1){audio.currentTime=Math.max(0,Math.min(sec,Number.isFinite(audio.duration)?audio.duration:sec));persist();emit();}}
export function setRate(rate){if([.75,1,1.25].includes(rate)){audio.playbackRate=rate;emit();}}
export function fmtTime(sec){if(!Number.isFinite(sec)||sec<0)sec=0;return `${Math.floor(sec/60)}:${String(Math.floor(sec%60)).padStart(2,'0')}`;}
