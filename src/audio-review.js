// Review narration: editorial arrangement of existing lesson text.
// Device TTS only; never presented as publisher recordings or verified audio.
// A lesson is enabled only after its own content QA (user-approved sample:
// HSK 2 Lesson 1, PR #112–#115; rollout one lesson per round, D31).
export const REVIEW_LESSONS = ['hsk2-l01', 'hsk2-l02', 'hsk2-l03'];
export const REVIEW_LESSON = REVIEW_LESSONS[0];
// D34 (Hoa, 2026-11-08): the vocabulary tracks read every word TWICE
// (male, then female), but the word audio refs in the lesson data only
// span the first reading, so the review cut words off after the male
// voice. These review-only spans cover BOTH readings: derived from RMS
// speech-region analysis of the actual tracks (each word's regions in
// book order), cross-checked by transcribing every region separately;
// a span runs from just before the word's first reading to just before
// the next word's first reading. Lesson data itself is unchanged, and
// sentence segments (read once) keep using the data refs as before.
// Analysis artifacts: ~/workspace/hsk3-work/review-word-segments-analysis.py
// and review-word-segments.json in the working area.
export const REVIEW_WORD_SEGMENTS = {
 'h2l1-w01': {start: 0.49, end: 2.75},
 'h2l1-w02': {start: 2.77, end: 5.0},
 'h2l1-w03': {start: 5.02, end: 7.18},
 'h2l1-w04': {start: 7.2, end: 8.96},
 'h2l1-w05': {start: 0.61, end: 2.77},
 'h2l1-w06': {start: 2.79, end: 5.05},
 'h2l1-w07': {start: 0.42, end: 3.64},
 'h2l1-w08': {start: 3.66, end: 7.1},
 'h2l1-w09': {start: 7.12, end: 9.89},
 'h2l1-w10': {start: 9.91, end: 11.57},
 'h2l1-w11': {start: 0.36, end: 2.96},
 'h2l1-w12': {start: 2.98, end: 5.77},
 'h2l1-w13': {start: 5.79, end: 8.1},
 'h2l1-w14': {start: 8.12, end: 10.68},
 'h2l1-w15': {start: 10.7, end: 14.1},
 'h2l2-w01': {start: 0.61, end: 3.81},
 'h2l2-w02': {start: 3.83, end: 5.77},
 'h2l2-w03': {start: 5.79, end: 8.37},
 'h2l2-w04': {start: 8.39, end: 10.72},
 'h2l2-w05': {start: 10.74, end: 13.77},
 'h2l2-w06': {start: 13.79, end: 16.45},
 'h2l2-w07': {start: 16.47, end: 19.76},
 'h2l2-w08': {start: 0.35, end: 2.96},
 'h2l2-w09': {start: 2.98, end: 5.25},
 'h2l2-w10': {start: 5.27, end: 7.62},
 'h2l2-w11': {start: 7.64, end: 10.3},
 'h2l2-w12': {start: 10.32, end: 13.15},
 'h2l2-w13': {start: 13.17, end: 15.26},
 'h2l2-w14': {start: 15.28, end: 17.43},
 'h2l2-w15': {start: 0.89, end: 4.34},
 'h2l2-w16': {start: 4.36, end: 6.19},
 'h2l2-w17': {start: 0.77, end: 3.22},
 'h2l3-w01': {start: 0.79, end: 3.87},
 'h2l3-w02': {start: 3.89, end: 6.41},
 'h2l3-w03': {start: 6.43, end: 8.04},
 'h2l3-w04': {start: 0.58, end: 3.89},
 'h2l3-w05': {start: 3.91, end: 6.51},
 'h2l3-w06': {start: 0.76, end: 3.29},
 'h2l3-w07': {start: 3.31, end: 6.06},
 'h2l3-w08': {start: 6.08, end: 8.16},
 'h2l3-w09': {start: 8.18, end: 10.49},
 'h2l3-w10': {start: 10.51, end: 13.43},
 'h2l3-w11': {start: 13.45, end: 15.66},
 'h2l3-w12': {start: 0.48, end: 2.88},
 'h2l3-w13': {start: 2.9, end: 5.53},
 'h2l3-w14': {start: 5.55, end: 7.85},
 'h2l3-w15': {start: 7.87, end: 9.55},
};

export function reviewSupported(content) {
 return !!content && REVIEW_LESSONS.includes(content.lessonId);
}
// Counts always come from the lesson's own verified data, never hardcoded.
export function reviewCounts(content) {
 const words = content.prepWords || [];
 const grammar = (content.knowledgePoints || []).filter(k => k.kind === 'grammar');
 return {
  words: words.length,
  properNames: words.filter(w => w.isProperName).length,
  grammar: grammar.length,
  passages: content.reader?.passages?.length || 0,
  sentences: content.reader?.sentences?.length || 0,
 };
}
export function reviewDetailLabel(content) {
 const c = reviewCounts(content);
 const wordPart = c.properNames ? `${c.words - c.properNames} từ + ${c.properNames} tên riêng` : `${c.words} từ`;
 return `${wordPart} + ${c.grammar} điểm ngữ pháp + ${c.passages} đoạn`;
}
// Editorial Vietnamese paraphrases of grammar patterns, keyed by knowledge
// point id. A pattern is only spoken through its paraphrase: the raw formula
// (with "+", brackets, slashes) stays on screen but is never sent to TTS as
// joined fragments. Points without a paraphrase are not read as formulas;
// their meaning, use, position and examples are still read from the lesson.
export const REVIEW_PATTERN_SPEECH = {
 'kp-hsk2-l01-ba': 'Mẫu câu: chủ ngữ đứng đầu, tiếp theo là động từ hoặc tính từ, có thể có tân ngữ, cuối câu thêm trợ từ ba để phỏng đoán và chờ người nghe xác nhận.',
 'kp-hsk2-l01-shide': 'Mẫu câu: chủ ngữ đứng đầu, rồi đến chữ thị có nghĩa là là, tiếp theo là chi tiết cần nhấn mạnh như thời gian, địa điểm, cách thức hoặc mục đích, rồi đến động từ, cuối câu là chữ đích.',
 'kp-hsk2-l01-pivotal': 'Mẫu câu kiêm ngữ: chủ ngữ đứng đầu, rồi đến một động từ có nghĩa nhờ, để cho hoặc bảo, tiếp theo là người được nhờ, rồi đến việc người đó làm. Người ở giữa vừa là tân ngữ của phần trước, vừa là chủ ngữ của phần sau.',
 'kp-hsk2-l02-haishi': 'Mẫu câu: ngay trước phương án được chọn, nói cụm có nghĩa là hay là, cuối câu thêm trợ từ ba, để gợi ý phương án tốt hơn sau khi đã cân nhắc.',
 'kp-hsk2-l02-duo': 'Mẫu số gần đúng: nếu con số là bội số của mười, đặt chữ đa có nghĩa là hơn ngay sau con số, rồi mới đến lượng từ và danh từ. Nếu con số không phải bội số của mười, đặt chữ đa sau lượng từ.',
 'kp-hsk2-l02-attributive': 'Mẫu định ngữ: đặt động từ, cụm động từ hoặc cả cụm chủ ngữ và động từ ở trước, tiếp theo là chữ đích, rồi mới đến danh từ được bổ nghĩa. Định ngữ đứng trước danh từ, không đứng sau danh từ như tiếng Việt.',
 'kp-hsk2-l03-result': 'Mẫu câu: động từ đứng trước, ngay sau đó đặt một động từ hoặc tính từ để nói kết quả của hành động, như làm xong xuôi, ăn hết, đến muộn hay nghe hiểu. Cuối câu có thể thêm một trợ từ để nói việc đã hoàn thành. Khi phủ định, đặt một từ có nghĩa là chưa ngay trước động từ và bỏ trợ từ ở cuối câu.',
 'kp-hsk2-l03-redup1': 'Mẫu trùng điệp cho việc sắp làm: với động từ một âm tiết, lặp lại động từ đó, có thể chêm chữ nhất, nghĩa là một, ở giữa. Với động từ hai âm tiết, lặp lại cả cụm hai âm tiết. Với động từ ly hợp, chỉ lặp lại âm tiết đầu rồi mới nói phần còn lại. Cách lặp này có nghĩa làm một chút, thử làm, nghe nhẹ nhàng.',
 'kp-hsk2-l03-redup2': 'Mẫu trùng điệp cho việc đã làm: với động từ một âm tiết, chêm trợ từ chỉ việc đã xảy ra vào giữa hai lần lặp của động từ. Với động từ hai âm tiết, thường không lặp lại, mà dùng nguyên động từ rồi thêm cụm có nghĩa là một chút ở sau. Với động từ ly hợp, chêm trợ từ đã vào sau âm tiết đầu, rồi mới nói phần còn lại.',
};
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
 if (!reviewSupported(content)) return [];
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
  return group;
 };
 // D33 (Hoa, 2026-11-08): units that already have book audio (words and
 // dialogue lines, as {trackId, start, end} refs into reader.audioTracks)
 // play the real streamed segment in the review; everything else keeps
 // device TTS. The first fragment row carries the segment; later fragments
 // of the same unit are marked covered so the segment is never replayed
 // or spoken twice.
 const trackById = new Map((content.reader.audioTracks || []).map(t => [t.id, t]));
 const resolveAudio = ref => {
  const track = ref?.trackId && trackById.get(ref.trackId);
  if (!track?.url || !(ref.end > ref.start)) return null;
  return {trackId: ref.trackId, url: track.url, start: ref.start, end: ref.end};
 };
 const pair = (label, zh, vi, source, audioRef) => {
  const group = ++groupCounter;
  const before = rows.length;
  add(label, zh, source, group, 0);
  const segment = resolveAudio(audioRef);
  if (segment) for (let i = before; i < rows.length; i++) {
   if (i === before) rows[i].audio = segment; else rows[i].coveredByAudio = true;
  }
  add(label, vi, source, group, 1);
 };
 if (mode === 'detail') {
  add('Từ mới', 'Ôn từ mới. Nghe tiếng Trung, rồi nghe nghĩa tiếng Việt.', 'editorial-intro');
  for (const w of content.prepWords) {
   const full = REVIEW_WORD_SEGMENTS[w.id];
   pair('Từ mới · ' + w.zh, w.zh, w.vi, w.id, full ? {...w.audio, ...full} : w.audio);
  }
  for (const k of content.knowledgePoints.filter(k => k.kind === 'grammar')) {
   const titleGroup = add('Cách dùng', k.title, k.id);
   // The printed formula stays visible in full; only its Vietnamese
   // paraphrase is spoken, never the joined formula fragments.
   const paraphrase = REVIEW_PATTERN_SPEECH[k.id];
   if (k.pattern && paraphrase) {
    rows.push({label: 'Mẫu câu', text: k.pattern, displayText: k.pattern, speechText: reviewSpeechText(paraphrase), speechSource: paraphrase, group: titleGroup, paragraph: 1, lang: 'vi-VN', source: k.id});
   }
   add('Cách dùng', k.useWhenVi, k.id);
   add('Giải thích', k.explanationVi, k.id);
   add('Vị trí', k.positionVi, k.id);
   for (const e of k.examples) pair('Câu mẫu', e.zh, e.noteVi, k.id);
  }
  for (const p of content.reader.passages) {
   add('Hội thoại', p.title, p.id);
   for (const id of p.sentenceIds) {
    const s = content.reader.sentences.find(s => s.id === id);
    pair(s.speaker ? `${p.title} · ${s.speaker}` : p.title, s.zh, s.vi, s.id, s.audio);
   }
  }
 } else {
  // D32 (Hoa, 2026-11-08): Ôn nhanh chỉ gồm ý chính của các điểm ngữ pháp —
  // tên điểm, "dùng khi nào", mẫu câu (đọc bằng lời giải thích tiếng Việt)
  // và một câu mẫu. Từ mới, hội thoại và điểm tổng kết chỉ có ở Ôn chi tiết.
  add('Mở đầu', 'Ôn nhanh. Nghe ý chính của từng điểm ngữ pháp: dùng khi nào, mẫu câu và một câu mẫu.', 'editorial-intro');
  for (const k of content.knowledgePoints.filter(k => k.kind === 'grammar')) {
   const titleGroup = add('Điểm ngữ pháp', k.title, k.id);
   add('Ý chính', k.useWhenVi, k.id);
   const paraphrase = REVIEW_PATTERN_SPEECH[k.id];
   if (k.pattern && paraphrase) {
    rows.push({label: 'Mẫu câu', text: k.pattern, displayText: k.pattern, speechText: reviewSpeechText(paraphrase), speechSource: paraphrase, group: titleGroup, paragraph: 1, lang: 'vi-VN', source: k.id});
   }
   const e = k.examples?.[0];
   if (e) pair('Câu mẫu', e.zh, e.noteVi, k.id);
  }
 }
 add('Kết thúc', 'Đã ôn xong. Bạn có thể nghe lại hoặc trở về bài học.', 'editorial-outro');
 return rows;
}

export function createReviewPlayer({synth, Utterance, beforePlay = () => {}, changed = () => {}, schedule = setTimeout, unschedule = clearTimeout, audioFactory = null}) {
 let queue = [], index = 0, status = 'idle', error = '', token = 0, timer, watchdog, utterance;
 let rate = 0.92, gap = 0, loop = false;
 let seg = null, segCleanup = null;
 const state = () => ({queue, index, status, error});
 const emit = () => changed(state());
 function cancel() { token++; unschedule(timer); unschedule(watchdog); if (utterance) { utterance.onstart = null; utterance.onend = null; utterance.onerror = null; } synth?.cancel(); utterance = null; if (segCleanup) { segCleanup(); segCleanup = null; } if (seg) { try { seg.pause(); } catch { /* element gone */ } } }
 function stop() { cancel(); status = 'idle'; error = ''; emit(); }
 function play() {
  cancel(); error = '';
  const voices = synth?.getVoices?.() || [];
  const select = lang => voices.find(v => v.lang.replace('_','-').toLowerCase() === lang.toLowerCase()) || voices.find(v => lang === 'zh-CN' ? /^(zh-(cn|sg|tw)|cmn)(-|$)/i.test(v.lang.replace('_','-')) : /^vi(-|$)/i.test(v.lang));
  if (!queue.length) return;
  status = 'playing'; beforePlay(); const mine = token; let chunkIndex = 0;
  const segmentTried = new Set();
  const rowEndPause = row => {
   const chunks = reviewSpeechChunks(row.speechSource ?? row.displayText ?? row.text);
   let pauseMs = chunks.at(-1)?.pauseMs ?? 750;
   const following = queue[index+1];
   const newGroup = !following || following.group !== row.group;
   const newParagraph = following?.paragraph !== row.paragraph;
   return Math.max(pauseMs, newGroup ? Math.max(900, gap*1000) : newParagraph ? 550 : 120);
  };
  // Play the row's book-audio segment [start, end] of its track, then
  // advance with the same end-of-row pause as the TTS path. Any failure
  // (no element, load error, never starts) falls back to TTS for the row.
  const playSegment = row => {
   if (!seg) { try { seg = audioFactory ? audioFactory() : null; } catch { seg = null; } if (seg) seg.preload = 'auto'; }
   if (!seg) { next(); return; }
   synth?.cancel();
   status = 'starting'; emit();
   let done = false;
   const cleanup = () => { seg.removeEventListener?.('timeupdate', onTime); seg.removeEventListener?.('ended', finish); seg.removeEventListener?.('playing', onPlaying); seg.removeEventListener?.('error', fallback); segCleanup = null; };
   const finish = () => { if (done || mine !== token) return; done = true; cleanup(); try { seg.pause(); } catch { /* ignore */ } unschedule(watchdog); const pauseMs = rowEndPause(row); index++; chunkIndex = 0; timer = schedule(next, pauseMs); };
   const fallback = () => { if (done || mine !== token) return; done = true; cleanup(); try { seg.pause(); } catch { /* ignore */ } unschedule(watchdog); next(); };
   const onTime = () => { if (seg.currentTime >= row.audio.end - 0.03) finish(); };
   const onPlaying = () => { if (done || mine !== token) return; unschedule(watchdog); status = 'playing'; emit(); const remaining = Math.max(0, row.audio.end - Math.max(row.audio.start, seg.currentTime || row.audio.start)); watchdog = schedule(finish, remaining / rate * 1000 + 5000); };
   segCleanup = cleanup;
   seg.addEventListener?.('timeupdate', onTime); seg.addEventListener?.('ended', finish); seg.addEventListener?.('playing', onPlaying); seg.addEventListener?.('error', fallback);
   watchdog = schedule(fallback, 10000);
   try {
    if (seg.src !== row.audio.url) seg.src = row.audio.url;
    seg.playbackRate = rate;
    seg.currentTime = row.audio.start;
    const played = seg.play?.();
    if (played?.catch) played.catch(() => fallback());
   } catch { fallback(); }
  };
  const next = () => {
   if (mine !== token) return;
   if (index >= queue.length) { if (loop) index = 0; else { status = 'ended'; index = queue.length - 1; emit(); return; } }
   const row = queue[index];
   if (chunkIndex === 0 && row.coveredByAudio) { index++; next(); return; }
   if (chunkIndex === 0 && row.audio && !segmentTried.has(index)) { segmentTried.add(index); playSegment(row); return; }
   if (!Utterance || !synth?.speak) {
    status = 'error'; error = 'Trình duyệt này không hỗ trợ đọc văn bản. Hãy mở trang bằng Chrome hoặc Safari để thử lại.'; emit(); return;
   }
   const chunks = reviewSpeechChunks(row.speechSource ?? row.displayText ?? row.text);
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
 if (!reviewSupported(content)) return '';
 return `<section class="audio-review" aria-labelledby="review-heading"><p class="kicker">NGHE ÔN BÀI</p><h3 id="review-heading">Rảnh tay, nghe lại bài</h3>
 <p>Từ mới và hội thoại dùng audio sách (giọng người thật); phần còn lại dùng giọng máy của thiết bị. Bấm một lần để nghe liên tục.</p>
 <div class="review-modes"><button class="btn" data-review-mode="quick">Ôn nhanh<small>Ý chính ngữ pháp + 1 câu mẫu</small></button><button class="btn" data-review-mode="detail">Ôn chi tiết<small>${escape(reviewDetailLabel(content))}</small></button></div>
 <div class="review-caption"><span data-review-label></span><span data-review-count></span></div>
 <progress class="review-progress" data-review-progress max="1" value="0" aria-label="Tiến độ nghe"></progress>
 <div class="review-transcript" data-review-text aria-label="Lời đọc và nghĩa"></div>
 <p data-review-status class="review-status" role="status" aria-live="polite"></p>
 <div class="row-actions review-controls"><button class="btn" data-review-action="prev" aria-label="Nghe mục trước">← Trước</button><button class="btn primary" data-review-action="play">▶ Phát</button><button class="btn" data-review-action="next">Sau →</button><button class="btn" data-review-action="stop">Dừng</button></div>
 <div class="row-actions"><label>Tốc độ <select data-review-rate><option value="0.8">0,8×</option><option value="0.92" selected>Vừa phải · 0,92×</option><option value="1">1×</option><option value="1.2">1,2×</option></select></label><label>Nghỉ giữa ý <select data-review-gap><option value="0" selected>Tự nhiên theo dấu câu</option><option value="1">Ít nhất 1 giây</option><option value="3">3 giây · nhắc lại</option></select></label><label><input type="checkbox" data-review-loop> Lặp cả bài ôn</label></div>
 <p class="muted small">Nếu không nghe được trong ứng dụng ChatGPT, hãy mở link bằng Chrome. Giữ trang mở khi nghe. Khóa màn hình hoặc chuyển ứng dụng có thể ngắt giọng đọc. Tiếp tục sẽ đọc lại lượt đang dở.</p>
 <details><summary>Xem nội dung và nguồn bản ôn</summary><p>Sắp xếp từ nội dung đã có trong bài; phần tiếng Việt là chú giải biên tập. Từ mới và từng câu hội thoại phát đúng đoạn audio sách Baulchino (phát trực tuyến, không tải về máy); nghĩa tiếng Việt, phần giải thích ngữ pháp và các câu mẫu chưa có audio riêng được đọc bằng giọng máy của thiết bị. Nếu một đoạn audio sách không phát được, máy sẽ đọc thay bằng giọng máy. Mẫu câu có dấu cộng và ký hiệu vẫn hiện đầy đủ trên màn hình, nhưng khi đọc sẽ nghe lời giải thích bằng tiếng Việt, không đọc nối các ký hiệu. Không đọc tên dấu và ký hiệu; nghỉ ngắn sau dấu phẩy, lâu hơn sau dấu chấm và chuyển ý; chú thích nguồn được lọc theo quy tắc, không tự bỏ từ vựng của bài. Ôn chi tiết tập trung từ vựng, ngữ pháp và hội thoại; luyện nét chữ ở khu Luyện viết.</p><ol data-review-script></ol></details></section>`;
}
function refresh(s) {
 const root = document.querySelector('.audio-review'); if (!root) return;
 const row = s.queue[s.index];
 const currentIndex = Math.min(s.index, s.queue.length - 1);
 root.querySelector('[data-review-status]').textContent = s.error || ({idle:'Sẵn sàng nghe',starting:'Đang khởi động…',playing:'Đang nghe · phần tô màu',paused:'Tạm dừng',ended:'Đã nghe xong'})[s.status];
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
  controller = createReviewPlayer({synth: window.speechSynthesis, Utterance: window.SpeechSynthesisUtterance, beforePlay: pauseBook, changed: refresh, audioFactory: () => new Audio()});
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
