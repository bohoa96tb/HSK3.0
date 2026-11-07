// Pilot review narration: editorial arrangement of existing lesson text.
// Device TTS only; never presented as publisher recordings or verified audio.
export const REVIEW_LESSON = 'hsk2-l01';
// Only strip presentation/source annotations, never arbitrary lesson vocabulary.
export function cleanReviewText(text) {
 return String(text || '')
  .replace(/[（(][^()（）]*(?:ví dụ trong sách|ví dụ ở sách|Textbook|Workbook|trong Đoạn|trong sách|tr\.\s*\d)[^()（）]*[）)]/giu, '')
  .replace(/\s+[（(]\d+[）)](?=\s*[:：])/gu, '')
  .replace(/\s+/gu, ' ').trim();
}
export function reviewSpeechText(text) {
 // Symbols are never sent to the device: some engines pronounce their names.
 // Boundaries become whitespace so adjacent words are not joined accidentally.
 return cleanReviewText(text).replace(/[^\p{L}\p{M}\p{N}\s]/gu, ' ').replace(/\s+/gu, ' ').trim();
}
// Timing is handled by the player, not by asking the voice to pronounce marks.
export function reviewSpeechChunks(text) {
 const input = cleanReviewText(text), chunks = [];
 let start = 0;
 for (const match of input.matchAll(/[.!?。！？…]+|[,，、;；:：]+/gu)) {
  const at = match.index, mark = match[0];
  // A decimal point is not a sentence boundary.
  if (mark === '.' && /\d/u.test(input[at-1] || '') && /\d/u.test(input[at+1] || '')) continue;
  const spoken = reviewSpeechText(input.slice(start, at));
  const pauseMs = /[.!?。！？…]/u.test(mark) ? 750 : /[;；:：]/u.test(mark) ? 450 : 300;
  if (spoken) chunks.push({text:spoken, pauseMs});
  else if (chunks.length) chunks.at(-1).pauseMs = Math.max(chunks.at(-1).pauseMs,pauseMs);
  start = at + mark.length;
 }
 const tail = reviewSpeechText(input.slice(start));
 if (tail) chunks.push({text:tail,pauseMs:0});
 return chunks;
}
export function buildReview(content, mode = 'quick') {
 if (content.lessonId !== REVIEW_LESSON) return [];
 const rows = [];
 let groupCounter = 0;
 const add = (label, text, source, group = ++groupCounter, paragraph = 0) => {
  const display = cleanReviewText(text);
  // Keep the complete paragraph for the transcript; sanitize speech separately.
  const parts = display.split(/([\p{Script=Han}][\p{Script=Han}，。！？、：“”‘’…]*)/u);
  let prefix = "";
  for (const part of parts) {
   const speechText = reviewSpeechText(part);
   if (!speechText) {
    const previous = rows.at(-1);
    if (previous?.group === group && previous.paragraph === paragraph) previous.displayText += part;
    else prefix += part;
    continue;
   }
   rows.push({label, text: part.trim(), displayText: prefix + part, speechText, group, paragraph,
    lang: /\p{Script=Han}/u.test(part) ? 'zh-CN' : 'vi-VN', source});
   prefix = '';
  }
 };
 const pair = (label, zh, vi, source) => { const group = ++groupCounter; add(label, zh, source, group, 0); add(label, vi, source, group, 1); };
 if (mode === 'detail') {
  add('Từ mới', 'Ôn từ mới. Nghe tiếng Trung, rồi nghe nghĩa tiếng Việt.', 'editorial-intro');
  for (const w of content.prepWords) pair('Từ mới · ' + w.zh, w.zh, w.vi, w.id);
  for (const k of content.knowledgePoints.filter(k => k.kind === 'grammar')) {
   add('Cách dùng', k.title, k.id);
   add('Cách dùng', k.useWhenVi, k.id);
   add('Giải thích', k.explanationVi, k.id);
   add('Vị trí', k.positionVi, k.id);
   for (const e of k.examples) pair('Câu mẫu', e.zh, e.noteVi, k.id);
  }
  for (const p of content.reader.passages) {
   add('Hội thoại', p.title, p.id);
   for (const id of p.sentenceIds) {
    const s = content.reader.sentences.find(s => s.id === id);
    pair(p.title, s.zh, s.vi, s.id);
   }
  }
 } else {
  for (const p of content.summaryPoints) {
   add(p.titleVi, p.bodyVi, 'summaryPoints');
   pair(p.titleVi, p.exampleZh, p.exampleVi, 'summaryPoints');
  }
 }
 add('Kết thúc', 'Đã ôn xong. Bạn có thể nghe lại hoặc trở về bài học.', 'editorial-outro');
 return rows;
}

export function createReviewPlayer({synth, Utterance, beforePlay = () => {}, changed = () => {}, schedule = setTimeout, unschedule = clearTimeout}) {
 let queue = [], index = 0, status = 'idle', error = '', token = 0, timer, watchdog, utterance;
 let rate = 0.92, gap = 0, loop = false;
 const state = () => ({queue, index, status, error});
 const emit = () => changed(state());
 function cancel() { token++; unschedule(timer); unschedule(watchdog); if (utterance) { utterance.onstart = null; utterance.onend = null; utterance.onerror = null; } synth?.cancel(); utterance = null; }
 function stop() { cancel(); status = 'idle'; error = ''; emit(); }
 function play() {
  cancel(); error = '';
  const voices = synth?.getVoices?.() || [];
  const select = lang => voices.find(v => v.lang.replace('_','-').toLowerCase() === lang.toLowerCase()) || voices.find(v => lang === 'zh-CN' ? /^(zh-(cn|sg|tw)|cmn)(-|$)/i.test(v.lang.replace('_','-')) : /^vi(-|$)/i.test(v.lang));
  if (!Utterance || !synth?.speak) {
   status = 'error'; error = 'Trình duyệt này không hỗ trợ đọc văn bản. Hãy mở trang bằng Chrome hoặc Safari để thử lại.'; emit(); return;
  }
  if (!queue.length) return;
  status = 'playing'; beforePlay(); const mine = token; let chunkIndex = 0;
  const next = () => {
   if (mine !== token) return;
   if (index >= queue.length) { if (loop) index = 0; else { status = 'ended'; index = queue.length - 1; emit(); return; } }
   const row = queue[index];
   const chunks = reviewSpeechChunks(row.displayText ?? row.text);
   const chunk = chunks[chunkIndex];
   if (!chunk) { index++; chunkIndex = 0; next(); return; }
   utterance = new Utterance(chunk.text); utterance.lang = row.lang; const voice = select(row.lang); if (voice) utterance.voice = voice; utterance.rate = rate;
   // Android may expose no voices even when lang-based synthesis works.
   // Keep voice unset in that case; never force an unrelated language.
   status = 'starting';
   utterance.onstart = () => { if (mine !== token) return; unschedule(watchdog); status = 'playing'; emit(); };
   utterance.onend = () => {
    if (mine !== token) return;
    unschedule(watchdog);
    let pauseMs = chunk.pauseMs;
    chunkIndex++;
    if (chunkIndex >= chunks.length) {
     const following = queue[index+1];
     const newGroup = !following || following.group !== row.group;
     const newParagraph = following?.paragraph !== row.paragraph;
     // Optional practice gaps apply between ideas, never after every language fragment.
     pauseMs = Math.max(pauseMs, newGroup ? Math.max(900,gap*1000) : newParagraph ? 550 : 120);
     index++; chunkIndex = 0;
    }
    timer = schedule(next, pauseMs);
   };
   const fail = reason => { if (mine !== token) return; cancel(); status = 'error'; error = reason; emit(); };
   utterance.onerror = event => fail(event?.error === 'language-unavailable' || event?.error === 'voice-unavailable'
    ? `Máy chưa đọc được ${row.lang === 'vi-VN' ? 'tiếng Việt' : 'tiếng Trung'}. Hãy tải giọng tương ứng trong cài đặt chuyển văn bản thành giọng nói của điện thoại, rồi bấm Phát.`
    : 'Không phát được giọng đọc. Nếu đang mở trong ứng dụng ChatGPT, hãy mở link bằng Chrome rồi bấm Phát lại.');
   watchdog = schedule(() => fail('Giọng đọc không khởi động. Hãy mở link bằng Chrome và kiểm tra giọng tiếng Việt/tiếng Trung trong cài đặt chuyển văn bản thành giọng nói.'), 10000);
   emit(); try { synth.resume?.(); synth.speak(utterance); } catch { utterance.onerror(); }
  };
  next();
 }
 return {
  state, stop,
  load(rows) { stop(); queue = rows; index = 0; emit(); },
  configure(options) { rate = options.rate ?? rate; gap = options.gap ?? gap; loop = options.loop ?? loop; },
  toggle() { if (['playing','starting'].includes(status)) { cancel(); index = Math.min(index, queue.length - 1); status = 'paused'; emit(); } else { if (status === 'ended') index = 0; play(); } },
  move(delta) { const active = ['playing','starting'].includes(status); cancel(); index = Math.max(0, Math.min(queue.length - 1, index + delta)); status = 'paused'; emit(); if (active) play(); }
 };
}

const escape = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let controller, currentContent, mode = 'quick';
let options = {rate: 0.92, gap: 0, loop: false};
export function reviewHtml(content) {
 if (content.lessonId !== REVIEW_LESSON) return '';
 return `<section class="audio-review" aria-labelledby="review-heading"><p class="kicker">NGHE ÔN BÀI · BẢN THỬ</p><h3 id="review-heading">Rảnh tay, nghe lại bài</h3>
 <p>Giọng máy của thiết bị · Tiếng Trung và tiếng Việt. Bấm một lần để nghe liên tục.</p>
 <div class="review-modes"><button class="btn" data-review-mode="quick">Ôn nhanh<small>Ý chính + câu mẫu</small></button><button class="btn" data-review-mode="detail">Ôn chi tiết<small>15 từ + 3 điểm ngữ pháp + 4 đoạn</small></button></div>
 <div class="review-caption"><span data-review-label></span><span data-review-count></span></div>
 <progress class="review-progress" data-review-progress max="1" value="0" aria-label="Tiến độ nghe"></progress>
 <div class="review-transcript" data-review-text aria-label="Lời đọc và nghĩa"></div>
 <p data-review-status class="review-status" role="status" aria-live="polite"></p>
 <div class="row-actions review-controls"><button class="btn" data-review-action="prev" aria-label="Nghe mục trước">← Trước</button><button class="btn primary" data-review-action="play">▶ Phát</button><button class="btn" data-review-action="next">Sau →</button><button class="btn" data-review-action="stop">Dừng</button></div>
 <div class="row-actions"><label>Tốc độ <select data-review-rate><option value="0.8">0,8×</option><option value="0.92" selected>Vừa phải · 0,92×</option><option value="1">1×</option><option value="1.2">1,2×</option></select></label><label>Nghỉ giữa ý <select data-review-gap><option value="0" selected>Tự nhiên theo dấu câu</option><option value="1">Ít nhất 1 giây</option><option value="3">3 giây · nhắc lại</option></select></label><label><input type="checkbox" data-review-loop> Lặp cả bài ôn</label></div>
 <p class="muted small">Nếu không nghe được trong ứng dụng ChatGPT, hãy mở link bằng Chrome. Giữ trang mở khi nghe. Khóa màn hình hoặc chuyển ứng dụng có thể ngắt giọng đọc. Tiếp tục sẽ đọc lại lượt đang dở.</p>
 <details><summary>Xem nội dung và nguồn bản ôn</summary><p>Sắp xếp từ nội dung đã có trong bài; phần tiếng Việt là chú giải biên tập. Đây không phải audio gốc Baulchino. Người dùng đã xác nhận phát được audio trên điện thoại. Không đọc tên dấu và ký hiệu; nghỉ ngắn sau dấu phẩy, lâu hơn sau dấu chấm và chuyển ý; chú thích nguồn được lọc theo quy tắc, không tự bỏ từ vựng của bài. Ôn chi tiết tập trung từ vựng, ngữ pháp và hội thoại; luyện nét chữ ở khu Luyện viết.</p><ol data-review-script></ol></details></section>`;
}
function refresh(s) {
 const root = document.querySelector('.audio-review'); if (!root) return;
 const row = s.queue[s.index];
 const currentIndex = Math.min(s.index, s.queue.length - 1);
 root.querySelector('[data-review-status]').textContent = s.error || ({idle:'Sẵn sàng nghe',starting:'Đang khởi động giọng đọc…',playing:'Đang nghe · phần tô màu',paused:'Tạm dừng',ended:'Đã nghe xong'})[s.status];
 root.querySelector('[data-review-label]').textContent = row?.label || '';
 root.querySelector('[data-review-count]').textContent = `${Math.max(0,currentIndex+1)} / ${s.queue.length}`;
 const progress = root.querySelector('[data-review-progress]'); progress.max = s.queue.length || 1; progress.value = s.status === 'ended' ? s.queue.length : Math.max(0,currentIndex);
 const groupRows = s.queue.map((r,i) => ({...r,index:i})).filter(r => r.group === row?.group);
 const paragraphs = [...new Set(groupRows.map(r => r.paragraph))];
 root.querySelector('[data-review-text]').innerHTML = paragraphs.map(paragraph => {
  const parts = groupRows.filter(r => r.paragraph === paragraph);
  const chinese = parts.every(r => r.lang === 'zh-CN');
  const mixed = parts.some(r => r.lang === 'zh-CN') && !chinese;
  return `<div class="review-paragraph ${chinese ? 'review-chinese' : 'review-vietnamese'}"><span class="review-language">${chinese ? 'TIẾNG TRUNG' : mixed ? 'GIẢI THÍCH' : 'TIẾNG VIỆT'}</span><p>${parts.map(r => `<span lang="${r.lang}" class="${r.index === currentIndex ? 'review-active' : ''}" ${r.index === currentIndex ? 'aria-current="true"' : ''}>${escape(r.displayText ?? r.text)}</span>`).join('')}</p></div>`;
 }).join('');
 root.querySelector('[data-review-action="play"]').textContent = ['playing','starting'].includes(s.status) ? 'Ⅱ Tạm dừng' : s.status === 'ended' ? '↻ Nghe lại' : '▶ Phát';
 root.querySelectorAll('[data-review-mode]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.reviewMode === mode)));
 root.querySelector('[data-review-action="prev"]').disabled = s.index <= 0;
 root.querySelector('[data-review-action="next"]').disabled = s.index >= s.queue.length-1;
}
export function mountReview(content, pauseBook) {
 const root = document.querySelector('.audio-review'); if (!root) return;
 if (!controller) {
  controller = createReviewPlayer({synth: window.speechSynthesis, Utterance: window.SpeechSynthesisUtterance, beforePlay: pauseBook, changed: refresh});
  window.addEventListener('hsk-audio-start', () => controller.stop());
  window.addEventListener('pagehide', () => controller.stop());
 }
 const sameContent = currentContent === content;
 currentContent = content;
 const load = () => { const rows = buildReview(currentContent, mode); controller.load(rows); root.querySelector('[data-review-script]').innerHTML = rows.map(r => `<li lang="${r.lang}">${escape(r.text)}</li>`).join(''); };
 if (!sameContent || !controller.state().queue.length) load();
 else { refresh(controller.state()); root.querySelector('[data-review-script]').innerHTML = controller.state().queue.map(r => `<li lang="${r.lang}">${escape(r.text)}</li>`).join(''); }
 root.querySelector('[data-review-rate]').value = String(options.rate);
 root.querySelector('[data-review-gap]').value = String(options.gap);
 root.querySelector('[data-review-loop]').checked = options.loop;
 root.querySelectorAll('[data-review-mode]').forEach(b => b.onclick = () => { mode = b.dataset.reviewMode; load(); });
 root.querySelectorAll('[data-review-action]').forEach(b => b.onclick = () => {
  const action = b.dataset.reviewAction;
  if (action === 'play') controller.toggle();
  else if (action === 'stop') load();
  else controller.move(action === 'next' ? 1 : -1);
 });
 const configure = () => { options = {rate: Number(root.querySelector('[data-review-rate]').value), gap: Number(root.querySelector('[data-review-gap]').value), loop: root.querySelector('[data-review-loop]').checked}; controller.configure(options); };
 root.querySelectorAll('select,input').forEach(el => el.onchange = configure);
 configure();
}
export function stopReview() { controller?.stop(); }
