// Pilot review narration: editorial arrangement of existing lesson text.
// Device TTS only; never presented as publisher recordings or verified audio.
export const REVIEW_LESSON = 'hsk2-l01';
export function buildReview(content, mode = 'quick') {
 if (content.lessonId !== REVIEW_LESSON) return [];
 const rows = [];
 const add = (label, text, source) => {
  // Switch languages even inside Vietnamese explanations containing Hanzi.
  for (const part of String(text || '').split(/([\p{Script=Han}][\p{Script=Han}，。！？、：“”‘’…]*)/u)) {
   if (!/[\p{L}\p{N}]/u.test(part)) continue;
   rows.push({label, text: part.trim(), lang: /\p{Script=Han}/u.test(part) ? 'zh-CN' : 'vi-VN', source});
  }
 };
 const pair = (label, zh, vi, source) => { add(label, zh, source); add(label, vi, source); };
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
 let queue = [], index = 0, status = 'idle', error = '', token = 0, timer, utterance;
 let rate = 1, gap = 1, loop = false;
 const state = () => ({queue, index, status, error});
 const emit = () => changed(state());
 function cancel() { token++; unschedule(timer); if (utterance) { utterance.onend = null; utterance.onerror = null; } synth?.cancel(); utterance = null; }
 function stop() { cancel(); status = 'idle'; error = ''; emit(); }
 function play() {
  cancel(); error = '';
  const voices = synth?.getVoices() || [];
  const select = lang => voices.find(v => v.lang.replace('_','-').toLowerCase() === lang.toLowerCase()) || voices.find(v => lang === 'zh-CN' ? /^(zh-(cn|sg|tw)|cmn)(-|$)/i.test(v.lang.replace('_','-')) : /^vi(-|$)/i.test(v.lang));
  if (!Utterance || !select('vi-VN') || !select('zh-CN')) {
   status = 'error'; error = 'Cần giọng tiếng Việt và tiếng Trung trên thiết bị. Hãy bật/cài hai giọng trong cài đặt chuyển văn bản thành giọng nói, rồi bấm Phát lại.'; emit(); return;
  }
  if (!queue.length) return;
  status = 'playing'; beforePlay(); const mine = token;
  const next = () => {
   if (mine !== token) return;
   if (index >= queue.length) { if (loop) index = 0; else { status = 'ended'; index = queue.length - 1; emit(); return; } }
   const row = queue[index]; utterance = new Utterance(row.text); utterance.lang = row.lang; utterance.voice = select(row.lang); utterance.rate = rate;
   utterance.onend = () => { if (mine !== token) return; index++; timer = schedule(next, gap * 1000); };
   utterance.onerror = () => { if (mine !== token) return; cancel(); status = 'error'; error = 'Giọng đọc bị gián đoạn. Bấm Phát để nghe lại câu hiện tại.'; emit(); };
   emit(); try { synth.speak(utterance); } catch { utterance.onerror(); }
  };
  next();
 }
 return {
  state, stop,
  load(rows) { stop(); queue = rows; index = 0; emit(); },
  configure(options) { rate = options.rate ?? rate; gap = options.gap ?? gap; loop = options.loop ?? loop; },
  toggle() { if (status === 'playing') { cancel(); index = Math.min(index, queue.length - 1); status = 'paused'; emit(); } else { if (status === 'ended') index = 0; play(); } },
  move(delta) { const active = status === 'playing'; cancel(); index = Math.max(0, Math.min(queue.length - 1, index + delta)); status = 'paused'; emit(); if (active) play(); }
 };
}

const escape = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let controller, currentContent, mode = 'quick';
let options = {rate: 1, gap: 1, loop: false};
export function reviewHtml(content) {
 if (content.lessonId !== REVIEW_LESSON) return '';
 return `<section class="audio-review" aria-labelledby="review-heading"><p class="kicker">NGHE ÔN BÀI · BẢN THỬ</p><h3 id="review-heading">Rảnh tay, nghe lại bài</h3>
 <p>Giọng máy của thiết bị · Tiếng Trung và tiếng Việt. Bấm một lần để nghe liên tục.</p>
 <div class="review-modes"><button class="btn" data-review-mode="quick">Ôn nhanh<small>Ý chính + câu mẫu</small></button><button class="btn" data-review-mode="detail">Ôn chi tiết<small>15 từ + 3 điểm ngữ pháp + 4 đoạn</small></button></div>
 <p data-review-status role="status" aria-live="polite"></p><p data-review-text class="review-text"></p>
 <div class="row-actions"><button class="btn" data-review-action="prev" aria-label="Nghe mục trước">← Trước</button><button class="btn primary" data-review-action="play">▶ Phát</button><button class="btn" data-review-action="next">Sau →</button><button class="btn" data-review-action="stop">Dừng</button></div>
 <div class="row-actions"><label>Tốc độ <select data-review-rate><option value="0.8">0,8×</option><option value="1" selected>1×</option><option value="1.2">1,2×</option></select></label><label>Nghỉ giữa lượt <select data-review-gap><option value="0">Không nghỉ</option><option value="1" selected>1 giây</option><option value="3">3 giây · nhắc lại</option></select></label><label><input type="checkbox" data-review-loop> Lặp cả bài ôn</label></div>
 <p class="muted small">Giữ trang mở khi nghe. Khóa màn hình hoặc chuyển ứng dụng có thể ngắt giọng đọc. Tiếp tục sẽ đọc lại lượt đang dở.</p>
 <details><summary>Xem nội dung và nguồn bản ôn</summary><p>Sắp xếp từ nội dung đã có trong bài; phần tiếng Việt là chú giải biên tập. Đây không phải audio gốc Baulchino. Chưa kiểm nghe trên điện thoại thật. Ôn chi tiết tập trung từ vựng, ngữ pháp và hội thoại; luyện nét chữ ở khu Luyện viết.</p><ol data-review-script></ol></details></section>`;
}
function refresh(s) {
 const root = document.querySelector('.audio-review'); if (!root) return;
 const row = s.queue[s.index];
 root.querySelector('[data-review-status]').textContent = s.error || `${({idle:'Sẵn sàng',playing:'Đang nghe',paused:'Tạm dừng',ended:'Đã nghe xong'})[s.status]} · ${Math.min(s.index+1,s.queue.length)}/${s.queue.length} lượt · ${row?.label || ''}`;
 root.querySelector('[data-review-text]').textContent = row?.text || '';
 root.querySelector('[data-review-text]').lang = row?.lang || 'vi';
 root.querySelector('[data-review-action="play"]').textContent = s.status === 'playing' ? 'Ⅱ Tạm dừng' : s.status === 'ended' ? '↻ Nghe lại' : '▶ Phát';
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
