// HSK 3.0 · Ngữ pháp tiếng Trung — pilot app (static, no build step).
// All learning content comes from data/content.json, whose items carry
// sourceRefs back to Baulchino / the printed Workbook. Nothing is invented.
import { gradeChoice, gradeDictationCell, dictationExpected, isConflictCell, matchesQuery, nextReviewState, isDue, summarizeAttempts, REVIEW_INTERVALS_DAYS, segmentZh } from "./lib.js?v=20261102-lesson1-standard1";
import { loadProgress, saveProgress, update, exportProgressJson, importProgressJson, summarizeForPreview } from "./store.js?v=20261102-lesson1-standard1";
import * as player from "./player.js?v=20261102-lesson1-standard1";

const main = document.getElementById("main");
const mini = document.getElementById("miniplayer");
let CONTENT = null;
let loadError = null;
let sectionUnsubscribe = null;
let readerOpen = false;

const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

function sourceById(id) { return CONTENT.sources.find((s) => s.id === id); }
function lessonById(id) { return CONTENT.lessons.find((l) => l.id === id); }
function contentFor(lessonId) {
  if (!lessonId || lessonId === CONTENT.pilot.lessonId) return CONTENT.pilot;
  return (CONTENT.additionalLessons || []).find((c) => c.lessonId === lessonId) || null;
}
function allContents() { return [CONTENT.pilot, ...(CONTENT.additionalLessons || [])]; }
function allTracks() { return allContents().flatMap((c) => c.reader.audioTracks); }
function readyLessons() { return CONTENT.lessons.filter((l) => l.publicationStatus === "pilot-ready" && contentFor(l.id)); }
function kpLessonId(kpId) { const c = allContents().find((c) => c.knowledgePoints.some((k) => k.id === kpId)); return c ? c.lessonId : CONTENT.pilot.lessonId; }
function continueLesson() {
  const rs = readyLessons();
  if (!rs.length) return lessonById(CONTENT.pilot.lessonId);
  const p = loadProgress();
  const started = rs.filter((l) => p.lessons[l.id]?.lastSectionId && contentFor(l.id).intro.sections.some((x) => !lessonState(l.id).completedSections.includes(x.id)));
  started.sort((a, b) => String(p.lessons[b.id].updatedAt || "").localeCompare(String(p.lessons[a.id].updatedAt || "")));
  if (started[0]) return started[0];
  return rs.find((l) => contentFor(l.id).intro.sections.some((x) => !lessonState(l.id).completedSections.includes(x.id))) || rs[0];
}
function refText(r) {
  const src = sourceById(r.sourceId);
  const parts = [];
  if (r.printedPage != null) parts.push(`trang in ${String(r.printedPage).padStart(3, "0")}`);
  if (r.pdfPage != null) parts.push(`PDF tr.${r.pdfPage}`);
  if (r.section) parts.push(esc(r.section));
  if (r.item) parts.push(esc(r.item));
  return `${esc(src ? src.title : r.sourceId)} — ${parts.join(", ")}`;
}
function refsHtml(refs) {
  if (!refs?.length) return "";
  return `<details class="refs"><summary>Nguồn bài học</summary>${refs.map(r => {const src=sourceById(r.sourceId); return `<p>${refText(r)} <a href="${esc(src.url)}${r.pdfPage ? `#page=${r.pdfPage}` : ''}" target="_blank" rel="noopener">Mở trang nguồn ↗</a></p>`;}).join('')}</details>`;
}

function settings() { return loadProgress().settings; }

function markSectionDone(lessonId, sectionId) {
  update((p) => {
    const l = (p.lessons[lessonId] ||= { completedSections: [], lastSectionId: null, updatedAt: null });
    if (l.completedSections.includes(sectionId)) return;
    l.completedSections.push(sectionId);
    l.lastSectionId = sectionId;
    l.updatedAt = new Date().toISOString();
    const today = new Date().toISOString().slice(0, 10);
    const s = p.sessions.find((x) => x.date === today);
    if (s) s.minutes += 2; else p.sessions.push({ date: today, minutes: 2 });
  });
}
function lessonState(lessonId) { return loadProgress().lessons[lessonId] || { completedSections: [], lastSectionId: null }; }

// ---------- Router ----------
function parseRoute() {
  const raw = location.hash.replace(/^#\/?/, "");
  const [pathPart, queryPart] = raw.split("?");
  const seg = pathPart.split("/").filter(Boolean).map(decodeURIComponent);
  const query = Object.fromEntries(new URLSearchParams(queryPart || ""));
  return { seg, query };
}
function go(hash) { if (location.hash === hash) render(); else location.hash = hash; }

let lastRenderedHash = null;
function captureScrollAnchor() {
  if (location.hash !== lastRenderedHash) return null;
  let best = null;
  for (const el of document.querySelectorAll("[data-anchor]")) {
    const r = el.getBoundingClientRect();
    if (r.bottom > 60 && r.top < window.innerHeight && (!best || Math.abs(r.top) < Math.abs(best.top))) best = { id: el.id, top: r.top };
  }
  return { anchor: best, y: window.scrollY };
}
function restoreScrollAnchor(saved) {
  if (!saved) return;
  const el = saved.anchor?.id ? document.getElementById(saved.anchor.id) : null;
  if (el) { const d = el.getBoundingClientRect().top - saved.anchor.top; if (d) window.scrollBy(0, d); }
  else if (Math.abs(window.scrollY - saved.y) > 1) window.scrollTo(0, saved.y);
}
function render() {
  closeLookup(); clearPhraseSelection();
  if (!parseRoute().query.item) lastDeepLinkItem = null;
  const savedAnchor = captureScrollAnchor();
  renderInner();
  applyDisplaySettings();
  restoreScrollAnchor(savedAnchor);
  lastRenderedHash = location.hash;
  syncChromeInsets();
}
function renderInner() {
  const transcript = document.querySelector(".transcript");
  if (transcript) readerOpen=transcript.open;
  if (sectionUnsubscribe) { sectionUnsubscribe(); sectionUnsubscribe = null; }
  if (loadError) {
    main.innerHTML = `<section class="card error-card"><h1>Không tải được dữ liệu</h1>
      <p>${esc(loadError)}</p><button class="btn primary" id="retry">Thử lại</button></section>`;
    $("#retry").onclick = () => location.reload();
    return;
  }
  if (!CONTENT) { main.innerHTML = `<p class="loading">Đang tải dữ liệu bài học…</p>`; return; }
  const { seg, query } = parseRoute();
  const page = seg[0] || "today";
  document.body.classList.toggle("studying", page === "lesson" && !!seg[2]);
  main.dataset.page = page;
  if (location.hash !== lastRenderedHash) window.scrollTo(0, 0);
  if (page === "today") return viewToday();
  if (page === "course") return viewCourse(seg[1]);
  if (page === "lesson") return viewLesson(seg[1], seg[2], query);
  if (page === "grammar") return viewGrammar(seg[1]);
  if (page === "reader") { const l = continueLesson().id; return go(`#/lesson/${l}/reader`); }
  if (page === "exercise") { const l = continueLesson().id; return go(`#/lesson/${l}/exercises`); }
  if (page === "review") return viewReview();
  if (page === "progress") return viewProgress();
  if (page === "settings") return viewSettings();
  if (page === "sources") return viewSources(seg[1]);
  main.innerHTML = `<section class="card"><h1>Không tìm thấy trang</h1><p>Đường dẫn không đúng hoặc nội dung chưa có.</p><a class="btn primary" href="#/today">Về Hôm nay</a></section>`;
}

function header(title, sub) {
  return `<div class="page-head"><div><h1>${esc(title)}</h1>${sub ? `<p class="sub">${esc(sub)}</p>` : ""}</div>
  <a class="icon-btn" href="#/settings" aria-label="Cài đặt">⚙</a></div>`;
}
function navActive() {
  const { seg } = parseRoute();
  const page = seg[0] || "today";
  $$("[data-nav]").forEach((a) => (a.classList.toggle("active", a.dataset.nav === page), a.setAttribute("aria-current", a.dataset.nav === page ? "page" : "false")));
}

// ---------- Today ----------
function viewToday() {
  navActive(); const p=loadProgress(), l=continueLesson(), c=contentFor(l.id), st=lessonState(l.id);
  const sections=c.intro.sections;
  const next=sections.find(x=>!st.completedSections.includes(x.id));
  const due=Object.values(p.reviewItems).filter(x=>isDue(x,Date.now())).length;
  const done=st.completedSections.filter(x=>sections.some(y=>y.id===x)).length;
  const img=c.intro.contextImage;
  main.innerHTML=`${header("Mỗi ngày, một chút tiếng Trung.","Học để hiểu. Nghe để nhớ. Dùng ngay trong cuộc sống.")}
    <div class="dashboard"><section class="hero card">
      <div class="hero-copy"><p class="kicker">KHÓA HỌC CỦA BẠN · HSK 1 · BÀI ${l.lessonNumber}</p><h2>${esc(l.titleVi)}<span class="hero-hanzi" lang="zh-CN">${esc(l.titleZh)}</span></h2>
      <p>${esc(c.intro.goalVi)}</p>
      <div class="hero-meta"><span>◷ Khoảng ${c.intro.estimatedMinutes} phút</span><span>♫ ${c.reader.passages.length} hội thoại</span></div>
      <a class="btn primary" href="#/lesson/${l.id}/${st.lastSectionId || next?.id || 'intro'}">${done?'Tiếp tục học':'Bắt đầu bài '+l.lessonNumber} <span aria-hidden="true">→</span></a></div>
      ${img?`<figure class="hero-image"><img src="${esc(img.src)}" alt="${esc(img.alt)}" width="${img.width||436}" height="${img.height||239}"><figcaption>${esc(img.caption||'')}</figcaption></figure>`:''}
    </section>
    <div class="dashboard-side"><section class="card"><p class="kicker">BƯỚC NHỎ HÔM NAY</p><h2>${done}<span class="muted"> / ${sections.length} mục</span></h2><div class="progress-bar"><div style="width:${done/sections.length*100}%"></div></div><p class="muted small">${next ? 'Tiếp theo: '+esc(next.titleVi) : 'Bạn đã đi hết các mục của bài.'}</p><a href="#/progress">Xem tiến độ →</a></section>
    <section class="card review-teaser"><span class="eyebrow">ÔN ĐỂ NHỚ LÂU</span><h2>${due ? due+' mục đến hạn' : 'Dành một phút ôn lại'}</h2><p class="muted small">Ôn những phần bạn còn chậm, theo nhịp của bạn.</p><a href="#/review">Mở sổ ôn tập →</a></section></div></div>
    <div class="section-heading"><h2>Học theo cách của bạn</h2><a href="#/course/HSK%201">Xem lộ trình →</a></div>
    <div class="quick-grid"><a class="quick-card" href="#/lesson/${l.id}/reader"><span class="tile-icon">♫</span><h3>Nghe một cuộc trò chuyện</h3><p>Nghe trước, mở lời thoại sau.</p><span>Nghe & đọc →</span></a><a class="quick-card" href="#/grammar"><span class="tile-icon" lang="zh-CN">文</span><h3>Hiểu cách dùng</h3><p>${esc(c.intro.courseTagsVi||'')}</p><span>Tra cứu →</span></a><a class="quick-card" href="#/lesson/${l.id}/exercises"><span class="tile-icon">✓</span><h3>Thử điều vừa học</h3><p>${esc(c.exerciseSet.titleVi)}</p><span>Luyện tập →</span></a></div>
    <p class="source-footer">${readyLessons().map(x=>'Bài '+x.lessonNumber).join(' và ')} đang mở · Học liệu từ Baulchino · <a href="#/sources">Nguồn và phạm vi đã kiểm tra</a></p>`;
}

// ---------- Course ----------
function viewCourse(level) {
 navActive();
 main.innerHTML=`${header('Lộ trình học','Đi từ lời chào đầu tiên đến những cuộc trò chuyện hằng ngày.')}
 <div class="course-banner"><div><p class="kicker">SƠ CẤP · HSK 1</p><h2>Những bước đầu với tiếng Trung</h2><p>${CONTENT.lessons.length} bài trong mục lục · ${readyLessons().length} bài đã mở</p></div><span class="course-mark" lang="zh-CN">学</span></div>
 <div class="section-heading"><h2>Danh sách bài học</h2><span class="muted small">Theo thứ tự giáo trình</span></div>
 <div class="lesson-list">${CONTENT.lessons.map(l=>{
 const ready=l.publicationStatus==='pilot-ready',st=lessonState(l.id);
 return `<article class="row-card ${ready?'available':'upcoming'}"><span class="lesson-num">${String(l.lessonNumber).padStart(2,'0')}</span><div class="grow"><h2 lang="zh-CN">${esc(l.titleZh)}</h2><p>${esc(l.titleVi)}</p><span class="tag">${ready?(st.completedSections.length?'Đang học':'Sẵn sàng học'):'Chưa mở'}</span>${ready?`<span class="small muted"> ${esc(contentFor(l.id)?.intro.courseTagsVi||'')}</span>`:''}</div>${ready?`<a class="btn primary" href="#/lesson/${l.id}">Vào bài →</a>`:`<a class="btn ghost small" href="#/lesson/${l.id}">Chi tiết</a>`}</article>`;}).join('')}</div>
 <details class="card"><summary>Các cấp học tiếp theo</summary><p>HSK 2–4 có trong danh mục nguồn. Nội dung chưa được biên tập và nghiệm thu để mở học.</p><a href="#/sources">Xem sách và audio nguồn →</a></details>`;
}

// ---------- Lesson ----------
function viewLesson(lessonId, sectionId, query) {
  navActive();
  const lesson = lessonById(lessonId);
  if (!lesson) { main.innerHTML = `<section class="card"><h1>Không tìm thấy bài</h1><a class="btn" href="#/course/HSK%201">Về lộ trình</a></section>`; return; }
  if (lesson.publicationStatus !== "pilot-ready" || !contentFor(lesson.id)) {
    main.innerHTML = `${header(`Bài ${lesson.lessonNumber}: ${lesson.titleZh}`, lesson.titleVi)}
    <section class="card warn"><h2>Bài đang kiểm tra nguồn</h2><p>${esc(lesson.publicationNote)}</p>${refsHtml(lesson.sourceRefs)}
    <p><a class="btn" href="#/sources/src-baul-books">Mở trang sách Baulchino</a> <a class="btn ghost" href="#/course/HSK%201">Quay lại lộ trình</a></p></section>`;
    return;
  }
  const content = contentFor(lesson.id);
  if (!sectionId) return viewLessonIntro(lesson, content);
  const sections = content.intro.sections;
  const idx = sections.findIndex((s) => s.id === sectionId);
  if (idx === -1) return viewLessonIntro(lesson);
  const prev = sections[idx - 1]; const next = sections[idx + 1];
  update(p => {const l=(p.lessons[lesson.id] ||= {completedSections:[]}); l.lastSectionId=sectionId;});
  let body = "";
  if (sectionId === "intro") body = sectionIntroHtml(lesson, content, sectionId);
  if (sectionId === "prep") body = sectionPrepHtml(content);
  if (sectionId === "knowledge") body = sectionKnowledgeHtml(content);
  if (sectionId === "reader") body = sectionReaderHtml(content);
  if (sectionId === "exercises") body = sectionExercisesHtml(content);
  if (sectionId === "apply") body = sectionApplyHtml(content);
  if (sectionId === "summary") body = sectionSummaryHtml(lesson, content);
  main.innerHTML = `
  <div class="lesson-top"><a class="btn ghost" href="#/lesson/${lesson.id}">← Thoát về bài</a>
  <span class="muted">Mục ${idx + 1}/${sections.length}: ${esc(sections[idx].titleVi)}</span></div>
  <nav class="lesson-steps" aria-label="Các bước học">${sections.map((x,i)=>`<a href="#/lesson/${lesson.id}/${x.id}" class="${x.id===sectionId?'current':''}" ${x.id===sectionId?'aria-current="step"':''}><span>${lessonState(lesson.id).completedSections.includes(x.id)?'✓':i+1}</span>${esc(x.titleVi)}</a>`).join('')}</nav>
  ${body}
  <div class="lesson-nav">
    ${prev ? `<a class="btn" href="#/lesson/${lesson.id}/${prev.id}">← Trước</a>` : "<span></span>"}
    <button class="btn" id="done-btn">${lessonState(lesson.id).completedSections.includes(sectionId) ? "✓ Đã xong mục này" : "Đánh dấu đã học"}</button>
    ${next ? `<a class="btn primary" href="#/lesson/${lesson.id}/${next.id}">Tiếp tục →</a>` : `<a class="btn primary" href="#/today">Về Hôm nay</a>`}
  </div>`;
  $("#done-btn").onclick = () => { markSectionDone(lesson.id, sectionId); render(); };
  bindSection(sectionId, content);
}

function viewLessonIntro(lesson, content) {
  content = content || contentFor(lesson.id);
  const st = lessonState(lesson.id);
  main.innerHTML = `${header(`HSK 1 · Bài ${lesson.lessonNumber}`, lesson.titleVi)}
  ${sectionIntroHtml(lesson, content)}
  <section class="card"><h2>Các mục cần học</h2>
  ${content.intro.sections.map((s) => `<p class="row-line"><a href="#/lesson/${lesson.id}/${s.id}">${esc(s.titleVi)}</a><span class="tag">${st.completedSections.includes(s.id) ? "Đã xong" : "Chưa học"}</span></p>`).join("")}
  <a class="btn primary big" href="#/lesson/${lesson.id}/${st.lastSectionId || "intro"}">${st.completedSections.length ? "Tiếp tục học" : "Bắt đầu"}</a></section>`;
  bindSection("intro", content);
}

function learningPathHtml(lesson, content, currentSectionId = null) {
  const path = content.learningPath;
  if (!Array.isArray(path) || !path.length) return "";
  const st = lessonState(lesson.id);
  const sections = content.intro.sections;
  const validLast = st.lastSectionId && sections.some((x) => x.id === st.lastSectionId) ? st.lastSectionId : null;
  let resume;
  if (validLast && validLast !== currentSectionId && !st.completedSections.includes(validLast)) resume = validLast;
  else {
    // When this block is rendered inside a section page (the Bắt đầu page
    // itself), that section is already on screen: the button must move
    // onward to the next unfinished section, never link back to the same
    // route (a same-hash link looks completely unresponsive when tapped).
    const pool = currentSectionId ? sections.filter((x) => x.id !== currentSectionId) : sections;
    resume = pool.find((x) => !st.completedSections.includes(x.id))?.id || pool[pool.length - 1]?.id || "summary";
  }
  return `<section class="card"><h2>Lộ trình học bài này</h2>
  <p class="muted">Học theo tình huống, từng bước nhỏ. Bạn có thể dừng bất cứ lúc nào và học tiếp sau — không cần làm hết phần luyện thêm mới được đi tiếp.</p>
  <ol class="learn-path">${path.map((step) => `<li><a href="#/lesson/${lesson.id}/${step.sectionId}${step.dialogueId && step.sectionId === "reader" ? `?passage=${step.dialogueId}` : ""}"><strong>${step.step}. ${esc(step.titleVi)}</strong><span>${esc(step.descVi)}</span></a></li>`).join("")}</ol>
  <p class="row-actions"><a class="btn primary big" href="#/lesson/${lesson.id}/${resume}">${st.completedSections.length || st.lastSectionId ? "Tiếp tục học" : "Bắt đầu học"} →</a></p>
  ${st.lastSectionId ? `<p class="muted small">Bạn đang học dở — lần trước bạn ở mục: ${esc(content.intro.sections.find((x) => x.id === st.lastSectionId)?.titleVi || st.lastSectionId)}.</p>` : ""}</section>`;
}
function sectionIntroHtml(lesson, content, currentSectionId = null) {
 const intro = content.intro; const img = intro.contextImage;
 return `<section class="card lesson-welcome"><p class="kicker">HSK 1 · BÀI ${String(lesson.lessonNumber).padStart(2,'0')}</p><h2 lang="zh-CN">${esc(lesson.titleZh)}</h2><p class="lead">${esc(intro.leadVi || intro.goalVi)}</p>
 <div class="welcome-grid"><div><h3>Sau bài này, bạn có thể</h3><ul class="goal-list">${(intro.outcomesVi||[]).map(o=>`<li>${esc(o)}</li>`).join('')}</ul><p class="muted">Thời gian dự kiến khoảng ${intro.estimatedMinutes} phút nếu học liền một mạch (ước lượng của dự án, chưa đo trên người học thật). Bạn có thể chia thành nhiều phiên ngắn.</p><p class="tag">Textbook + Workbook · Bài ${lesson.lessonNumber}</p></div>${img?`<figure class="context-figure"><img class="context-image" src="${esc(img.src)}" alt="${esc(img.alt)}" width="${img.width||436}" height="${img.height||239}"><figcaption>${esc(img.caption||'')}</figcaption></figure>`:''}</div>
 <details class="study-tip"><summary>Ghi chú về bài học</summary><p>${esc(intro.studyTipVi||'')}</p></details>${intro.priorLessonId?`<p class="row-line"><span>${esc(intro.priorLessonNoteVi||'')}</span><a class="btn ghost small" href="#/lesson/${intro.priorLessonId}">Xem lại Bài ${lessonById(intro.priorLessonId)?.lessonNumber||''}</a></p>`:''}${refsHtml(lesson.sourceRefs)}</section>${learningPathHtml(lesson, content, currentSectionId)}`;
}

// ---------- Lesson sections ----------
const FONT_LEVELS = [1, 1.15, 1.3];
const FONT_LABELS = { 1: "Thường", 1.15: "Lớn", 1.3: "Rất lớn" };
// Shared support bar (ux3): compact chips, applied in place by flipping
// classes on <main> and a CSS variable — never by re-rendering — so toggling
// Pinyin, meaning, Han-Viet or font size cannot move the scroll position,
// close the transcript, drop focus, lose drafts or restart audio.
// Scope -> settings keys. "dictation" shares the exercise keys (both live in
// Mục 5) but reveals nothing by itself: dictation answers stay gated behind
// Kiểm tra / Xem lời đọc (see dictationHtml).
const SUPPORT_KEYS = {
  prep:      { pinyin: "showPinyinPrep", vi: "showViPrep" },
  sentences: { pinyin: "showPinyinSentences", vi: "showViSentences" },
  exercises: { pinyin: "showPinyinExercises", vi: "showViExercises" },
  dictation: { pinyin: "showPinyinExercises", vi: "showViExercises" },
};
function supportBarHtml(scope) {
  const st = settings();
  const keys = SUPPORT_KEYS[scope];
  const fontName = FONT_LABELS[st.fontScale] || "Thường";
  const btn = (kind, label, pressed, extra = "") => `<button type="button" class="support-btn" data-support="${kind}" data-scope="${scope}" aria-pressed="${pressed}" ${extra}>${label}</button>`;
  return `<div class="support-bar" role="group" aria-label="Hỗ trợ hiển thị">
    ${keys ? btn("pinyin", "Pinyin", st[keys.pinyin]) : ""}
    ${keys ? btn("vi", "Nghĩa", st[keys.vi]) : ""}
    ${scope === "prep" ? btn("hanviet", "Hán–Việt", st.showHanVietPrep) : ""}
    <span class="support-font"><button type="button" class="support-btn font-btn" data-support="font-down" data-scope="${scope}" aria-label="Giảm cỡ chữ (mức hiện tại: ${fontName})">A−</button><button type="button" class="support-btn font-btn" data-support="font-up" data-scope="${scope}" aria-label="Tăng cỡ chữ (mức hiện tại: ${fontName})">A+</button></span>
  </div>`;
}
function applyDisplaySettings() {
  const st = settings();
  main.classList.toggle("off-pinyin-prep", !st.showPinyinPrep);
  main.classList.toggle("off-vi-prep", !st.showViPrep);
  main.classList.toggle("off-hv-prep", !st.showHanVietPrep);
  main.classList.toggle("off-pinyin-sent", !st.showPinyinSentences);
  main.classList.toggle("off-vi-sent", !st.showViSentences);
  main.classList.toggle("off-pinyin-ex", !st.showPinyinExercises);
  main.classList.toggle("off-vi-ex", !st.showViExercises);
  applyFontScale();
  $$("[data-support]").forEach((b) => {
    const keys = SUPPORT_KEYS[b.dataset.scope];
    if (b.dataset.support === "pinyin" && keys) b.setAttribute("aria-pressed", String(!!st[keys.pinyin]));
    if (b.dataset.support === "vi" && keys) b.setAttribute("aria-pressed", String(!!st[keys.vi]));
    if (b.dataset.support === "hanviet") b.setAttribute("aria-pressed", String(!!st.showHanVietPrep));
    if (b.dataset.support === "font-down" || b.dataset.support === "font-up") {
      const name = FONT_LABELS[st.fontScale] || "Thường";
      b.setAttribute("aria-label", `${b.dataset.support === "font-up" ? "Tăng" : "Giảm"} cỡ chữ (mức hiện tại: ${name})`);
    }
  });
  $$(".font-level").forEach((el) => { el.textContent = FONT_LABELS[st.fontScale] || "Thường"; });
  $$("[data-setting]").forEach((el) => { if (el.type === "checkbox") el.checked = !!st[el.dataset.setting]; });
  $$("[data-setting-select]").forEach((el) => { el.value = String(st[el.dataset.settingSelect]); });
}
// Turning Pinyin/Nghĩa ON inside Mục 5 choice exercises is recorded as
// support used for the question currently on screen (first-attempt history
// is never rewritten; the flag travels with the next attempt record).
function recordExerciseSupport() {
  const { seg } = parseRoute();
  if (seg[0] !== "lesson" || seg[2] !== "exercises") return;
  const content = contentFor(seg[1]); if (!content) return;
  // D23 QA TB-1: the support bar is rendered only on the main exercise card,
  // so support use is recorded only for the main set's current question.
  // Recording it for the supplementary (mock) set — which has no support
  // bar of its own — would falsely mark mock attempts as support-assisted.
  const set = content.exerciseSet;
  const ses = ensureSession(content, set);
  const item = set.items[ses.index];
  if (item && !ses.checked[item.id]) updateSession(content, (ss) => { (ss.supportUsed ||= {})[item.id] = true; }, set);
}
function bindSupportBar() {
  $$("[data-support]").forEach((b) => { b.onclick = () => {
    const kind = b.dataset.support;
    const keys = SUPPORT_KEYS[b.dataset.scope];
    let turnedOn = false;
    update((p) => {
      if (kind === "pinyin" && keys) { p.settings[keys.pinyin] = !p.settings[keys.pinyin]; turnedOn = !!p.settings[keys.pinyin]; }
      if (kind === "vi" && keys) { p.settings[keys.vi] = !p.settings[keys.vi]; turnedOn = !!p.settings[keys.vi]; }
      if (kind === "hanviet") { p.settings.showHanVietPrep = !p.settings.showHanVietPrep; turnedOn = !!p.settings.showHanVietPrep; }
      if (kind === "font-down" || kind === "font-up") { let i = FONT_LEVELS.indexOf(p.settings.fontScale || 1); if (i < 0) i = 0; i = kind === "font-up" ? Math.min(FONT_LEVELS.length - 1, i + 1) : Math.max(0, i - 1); p.settings.fontScale = FONT_LEVELS[i]; }
    });
    applyDisplaySettings();
    syncChromeInsets();
    if (turnedOn && (kind === "pinyin" || kind === "vi") && (b.dataset.scope === "exercises" || b.dataset.scope === "dictation")) recordExerciseSupport();
  }; });
}
function applyFontScale() { const v = String(settings().fontScale || 1); document.documentElement.style.setProperty("--font-scale", v); document.documentElement.dataset.fontScale = v; }

// One speaker component for every Chinese unit. `audio` is a draft-aligned
// segment ref ({trackId,start,end,status}) or null when the unit has no
// segment of its own yet.
const SPEAK_ICON = `<svg viewBox="0 0 24 24" width="17" height="17" aria-hidden="true" focusable="false"><path fill="currentColor" d="M3 9v6h4l5 4.5v-15L7 9H3z"/><path fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" d="M15.5 9.2a4 4 0 0 1 0 5.6M18 6.8a7.4 7.4 0 0 1 0 10.4"/></svg>`;
function speakBtnHtml(audio, label) {
  if (!audio) return `<span class="no-audio" title="Chưa có audio riêng cho mục này — từ này vẫn có trong track ở bước Nghe & đọc">Chưa có audio</span>`;
  return `<button type="button" class="speak-btn" data-speak data-track="${esc(audio.trackId)}" data-start="${audio.start}" data-end="${audio.end}" aria-label="Nghe: ${esc(label)}" title="Nghe mục này">${SPEAK_ICON}</button>`;
}
// Speaker for short units (words, options, examples): the device's own
// speech synthesis reads the text — no segment is cut from a book track
// (D20). Dialogue sentences keep their book-audio segment buttons.
// What the device voice should actually say: drop dialogue speaker
// labels ("A: … B: …") and turn "/" separators into pauses, so the
// synthesis does not read the labels or the slash aloud.
function speakable(text) {
  return String(text).replace(/\s*[A-D][:：]\s*/g, ' ').replace(/\//g, ' ').replace(/\s+/g, ' ').trim();
}
function ttsBtnHtml(text) {
  const say = speakable(text);
  return `<button type="button" class="speak-btn" data-tts="${esc(say)}" aria-label="Nghe: ${esc(text)}" title="Nghe mục này (giọng đọc của thiết bị)">${SPEAK_ICON}</button>`;
}
const HAS_HAN = /\p{Script=Han}/u;
function sentenceAudio(content, sen) {
  const group = content.reader.passages.find((g) => g.id === sen.passageId);
  const track = group && content.reader.audioTracks.find((t) => t.id === group.audioTrackId);
  const segm = track?.segments?.find((x) => x.sentenceId === sen.id);
  return segm ? { trackId: track.id, start: segm.start, end: segm.end, status: segm.status } : null;
}

function wordCardHtml(w) {
  return `<article class="word-card" id="${w.id}" data-anchor><div class="word-top"><span class="zh" lang="zh-CN">${esc(w.zh)}</span>${ttsBtnHtml(w.zh)}</div><div class="pinyin tog-pinyin-prep" lang="zh-Latn">${esc(w.pinyin)}</div>${w.hanViet ? `<div class="hanviet tog-hv-prep">HV: ${esc(w.hanViet)}</div>` : `<div class="hanviet tog-hv-prep hanviet-missing">HV: chưa xác minh</div>`}<div class="vi tog-vi-prep">${esc(w.vi)}</div>${w.isProperName ? `<p class="hv-note">Tên riêng (người)</p>` : ""}${w.hanVietNoteVi ? `<p class="hv-note tog-hv-prep">${esc(w.hanVietNoteVi)}</p>` : ""}</article>`;
}
function sectionPrepHtml(content) {
 const firstRefs=[]; const seenPages=new Set();
 for(const w of content.prepWords){const r=w.sourceRefs[0]; if(r && !seenPages.has(r.pdfPage)){seenPages.add(r.pdfPage); firstRefs.push(r);} }
 const groups = Array.isArray(content.prepGroups) && content.prepGroups.length ? content.prepGroups : null;
 const summaryLine = content.prepSummaryVi || `${content.prepWords.length} mục từ xuất hiện trong Bài ${lessonById(content.lessonId).lessonNumber}. Đọc một lượt, rồi gặp lại chúng trong hội thoại.`;
 const body = groups ? groups.map((g, gi) => {
   const words = content.prepWords.filter((w) => w.dialogueGroup === gi + 1);
   const track = content.reader.audioTracks.find((t) => t.id === g.trackId);
   const properN = words.filter((w) => w.isProperName).length;
   return `<h3 class="vocab-group-title">${esc(g.titleVi)} <span class="tag">${words.length - properN} từ${properN ? ` + ${properN} tên riêng` : ""}</span></h3>
   ${track ? `<p class="row-actions"><button class="btn" type="button" data-play-vocab-track="${esc(track.id)}">▶ Nghe cả nhóm từ — audio gốc của sách (${esc(g.trackLabelVi)})</button> <a class="btn ghost" href="#/lesson/${content.lessonId}/reader?passage=${esc(g.dialogueId)}">Tới hội thoại này →</a></p>` : ""}
   <div class="word-grid">${words.map(wordCardHtml).join('')}</div>`;
 }).join('') : `<div class="word-grid">${content.prepWords.map(wordCardHtml).join('')}</div>`;
 return `<section class="card"><p class="kicker">TRƯỚC KHI NGHE</p><h2>Từ cần biết</h2><p class="muted">${esc(summaryLine)}</p>${supportBarHtml('prep')}${body}<details class="study-tip"><summary>Ghi chú về loa và Hán–Việt</summary><p>Loa nhỏ trên từng thẻ dùng giọng đọc tiếng Trung có sẵn của trình duyệt/thiết bị để đọc từng từ — đó là giọng máy, không phải audio của sách. Nút “Nghe cả nhóm từ” phát audio gốc của sách theo từng hội thoại (giọng người thật, phát trực tuyến từ nguồn). App không cắt audio gốc thành từng từ vì mỗi từ trong track được đọc hai lượt; cắt đoạn dễ lọt lượt đọc sau và nghe không tự nhiên. Âm Hán–Việt chỉ là cách đọc Hán–Việt của chữ, không thay cho nghĩa hiện đại hay phát âm tiếng Trung.</p></details>${refsHtml(firstRefs)}</section>`;
}
function bindPrep(content) {
  bindSupportBar();
  $$("[data-play-vocab-track]").forEach((b) => b.onclick = () => {
    const track = content.reader.audioTracks.find((t) => t.id === b.dataset.playVocabTrack);
    if (track) player.playTrack(track, { rate: settings().playbackRate });
  });
  sectionUnsubscribe = player.subscribe(() => { renderMini(); });
}

function knowledgeCardHtml(kp,{linkBack=null,lessonId=null}={}) {
 const kpLesson = lessonId || kpLessonId(kp.id);
 const foundation=['foundation-pronunciation','foundation-characters'].includes(kp.kind);
 const kpContent = contentFor(kpLesson);
 const exampleHtml = (e) => `<div class="example"><div class="ex-row"><span class="zh-sentence" lang="zh-CN" data-tok-wrap>${zhTokensHtml(e.zh, kpContent)}</span>${HAS_HAN.test(e.zh) ? ttsBtnHtml(e.zh) : ""}</div><div class="ex-meta"><span class="pinyin ${foundation ? "" : "tog-pinyin-sent"}">${esc(e.pinyin)}</span><span class="ex-note ${foundation ? "" : "tog-vi-sent"}">${esc(e.noteVi)}</span>${phraseBtnHtml(kpContent)}</div></div>`;
 const visibleExamples = kp.useWhenVi ? kp.examples.slice(0, 2) : kp.examples;
 const extraExamples = kp.useWhenVi ? kp.examples.slice(2) : [];
 const qc = kp.quickCheck;
 return `<article class="card grammar-card" id="${esc(kp.id)}" data-anchor><p class="kicker">${esc(kp.kindLabel)}</p><h2>${esc(kp.title)}</h2>
 ${kp.useWhenVi ? `<p class="lead-small"><strong>Khi nào dùng?</strong> ${esc(kp.useWhenVi)}</p>` : `<p class="lead-small">${esc(kp.explanationVi)}</p>`}
 <p class="pattern">${esc(kp.pattern)}</p>
 ${kp.useWhenVi ? `<details class="study-tip"><summary>Giải thích thêm</summary><p>${esc(kp.explanationVi)}</p>${kp.positionVi ? `<p>${esc(kp.positionVi)}</p>` : ""}</details>` : ""}
 ${kp.audioTrackId ? `<p class="row-actions"><button class="btn" type="button" data-play-kp-track="${esc(kp.audioTrackId)}" data-kp-lesson="${esc(kpLesson)}">▶ Nghe bài đọc gốc của sách (${esc(kp.audioTrackLabelVi || "track của bài")})</button></p>` : ""}
 ${visibleExamples.map(exampleHtml).join('')}
 ${extraExamples.length ? `<details class="study-tip"><summary>Xem thêm ví dụ của sách</summary>${extraExamples.map(exampleHtml).join('')}</details>` : ""}
 ${qc ? `<div class="quick-check" data-quick-check="${esc(kp.id)}"><h3>Thử ngay</h3><p>${esc(qc.questionVi)}</p><p class="zh-inline" lang="zh-CN">${esc(qc.stemZh)}</p><div class="row-actions">${qc.options.map((o) => `<button class="btn" type="button" data-quick-opt="${esc(o.zh)}" data-quick-answer="${esc(qc.answer)}"><span lang="zh-CN">${esc(o.zh)}</span>${o.vi ? ` · ${esc(o.vi)}` : ""}</button>`).join("")}</div><p class="quick-feedback" role="status" aria-live="polite" hidden></p><p class="quick-explain" hidden>${esc(qc.explanationVi)}</p></div>` : ""}
 ${kp.sentenceIds?.length?`<div class="row-actions">${kp.sentenceIds.map(id=>{const sen=contentFor(kpLesson).reader.sentences.find(x=>x.id===id);return sen?`<a class="btn ghost small" href="#/lesson/${kpLesson}/reader?sentence=${id}">Ngữ cảnh: ${esc(sen.zh)}</a>`:'';}).join('')}</div>`:''}
 ${refsHtml(kp.sourceRefs)}${linkBack?`<a class="btn primary" href="${esc(linkBack)}">← Quay lại câu đang làm</a>`:''}</article>`;
}
function bindQuickChecks() {
  $$("[data-quick-check]").forEach((box) => {
    const feedback = box.querySelector(".quick-feedback");
    const explain = box.querySelector(".quick-explain");
    box.querySelectorAll("[data-quick-opt]").forEach((b, i) => b.onclick = () => {
      const correct = String(i + 1) === b.dataset.quickAnswer;
      feedback.hidden = false;
      feedback.textContent = correct ? "Đúng rồi." : "Chưa đúng — thử đọc lại giải thích rồi chọn lại.";
      feedback.className = `quick-feedback ${correct ? "ok" : "bad"}`;
      if (explain) explain.hidden = !correct;
    });
  });
}


// ===== D24: tap-to-lookup (pilot: lessons carrying a `lookup` block) =====
// Segmentation is dictionary-driven (lib.segmentZh) over the project's own
// curated vocabulary, so a tap always lands on an entry the project has
// verified — or honestly reports missing data. Lookup is only wired into
// reading surfaces (dialogues, knowledge examples, speaking samples,
// summary examples), never into exercise prompts/options.
let _baseLexicon = null;
function baseLexicon() {
  if (_baseLexicon) return _baseLexicon;
  const map = new Map();
  for (const c of [CONTENT.pilot, ...(CONTENT.additionalLessons || [])]) {
    for (const w of c.prepWords || []) {
      if (!map.has(w.zh)) map.set(w.zh, { zh: w.zh, pinyin: w.pinyin, hanViet: w.hanViet || null, vi: w.vi, hanVietNoteVi: w.hanVietNoteVi || null, originVi: `Từ vựng đã đối chiếu của dự án · Bài ${lessonById(c.lessonId)?.lessonNumber || c.lessonNumber || ""}`.trim() });
    }
  }
  _baseLexicon = map;
  return map;
}
function lessonLexicon(content) {
  const map = new Map(baseLexicon());
  for (const e of content.lookup?.extras || []) map.set(e.zh, { zh: e.zh, pinyin: e.pinyin, hanViet: e.hanViet ?? null, vi: e.vi, noteVi: e.noteVi || null, originVi: "Mục bổ sung đã kiểm duyệt riêng cho bài này" });
  return map;
}
function lookupOn(content) { return !!(content && content.lookup); }
function zhTokensHtml(zh, content) {
  if (!lookupOn(content) || !HAS_HAN.test(zh)) return esc(zh);
  const toks = segmentZh(zh, lessonLexicon(content));
  return toks.map((t, i) => t.punct
    ? `<span class="tok-punct" data-toki="${i}">${esc(t.text)}</span>`
    : `<button type="button" class="tok" data-tok="${esc(t.text)}" data-toki="${i}" data-lesson="${esc(content.lessonId)}" aria-haspopup="dialog">${esc(t.text)}</button>`).join("");
}
function phraseBtnHtml(content) {
  return lookupOn(content) ? `<button type="button" class="btn ghost small" data-phrase-btn>Tra cụm</button>` : "";
}
let lookupPop = null, lookupReturnFocus = null, phraseSel = null;
function ensureLookupPop() {
  if (lookupPop) return lookupPop;
  const el = document.createElement("div");
  el.className = "lookup-pop"; el.id = "lookup-pop";
  el.setAttribute("role", "dialog"); el.setAttribute("aria-label", "Tra từ");
  el.hidden = true;
  document.body.appendChild(el);
  lookupPop = el;
  return el;
}
function closeLookup() {
  if (lookupPop) lookupPop.hidden = true;
  if (lookupReturnFocus && document.contains(lookupReturnFocus)) lookupReturnFocus.focus();
  lookupReturnFocus = null;
}
function lookupSpeak(text, msgEl) {
  try {
    if (!("speechSynthesis" in window)) { msgEl.textContent = "Thiết bị không hỗ trợ giọng đọc."; return; }
    const voices = window.speechSynthesis.getVoices ? window.speechSynthesis.getVoices() : [];
    if (voices.length && !voices.some((v) => /^zh([-_]|$)/i.test(v.lang || ""))) { msgEl.textContent = "Thiết bị chưa có giọng đọc tiếng Trung."; return; }
    if (!player.speakText(text)) msgEl.textContent = "Không phát được âm thanh trên thiết bị này.";
  } catch { msgEl.textContent = "Không phát được âm thanh trên thiết bị này."; }
}
function componentsOf(text, content) {
  const lex = lessonLexicon(content);
  if (!lex.has(text)) return [];
  const sub = new Map(lex); sub.delete(text);
  const toks = segmentZh(text, sub);
  return toks.length > 1 && toks.some((t) => t.entry) ? toks : [];
}
function openLookupCard(html, anchorBtn) {
  const pop = ensureLookupPop();
  pop.innerHTML = html;
  pop.hidden = false;
  lookupReturnFocus = anchorBtn || null;
  if (window.innerWidth > 640 && anchorBtn) {
    const r = anchorBtn.getBoundingClientRect();
    const pw = 320, ph = pop.offsetHeight || 240;
    let left = Math.min(Math.max(8, r.left + window.scrollX), window.scrollX + window.innerWidth - pw - 8);
    let top = r.bottom + window.scrollY + 6;
    if (r.bottom + ph + 12 > window.innerHeight) top = Math.max(window.scrollY + 8, r.top + window.scrollY - ph - 6);
    pop.style.left = `${left}px`; pop.style.top = `${top}px`;
  } else { pop.style.left = ""; pop.style.top = ""; }
  const closeBtn = pop.querySelector("[data-lk-close]");
  if (closeBtn) closeBtn.focus();
}
function entryCardHtml(entry, content) {
  const chips = componentsOf(entry.zh, content);
  return `<div class="lk-head"><span class="lk-zh" lang="zh-CN">${esc(entry.zh)}</span><button type="button" class="btn ghost lk-close" data-lk-close aria-label="Đóng bảng tra">×</button></div>
  <dl>
    <dt>Pinyin</dt><dd lang="zh-Latn">${esc(entry.pinyin)}</dd>
    <dt>Hán–Việt</dt><dd>${entry.hanViet ? esc(entry.hanViet) : "Chưa có dữ liệu đã kiểm chứng"}</dd>
    <dt>Nghĩa</dt><dd>${esc(entry.vi)}</dd>
  </dl>
  <p><button type="button" class="btn small" data-lk-speak="${esc(entry.zh)}">🔊 Nghe phát âm (giọng máy)</button> <span class="lk-note" data-lk-msg role="status"></span></p>
  ${entry.hanVietNoteVi ? `<p class="lk-note">${esc(entry.hanVietNoteVi)}</p>` : ""}
  ${entry.noteVi ? `<p class="lk-note">${esc(entry.noteVi)}</p>` : ""}
  ${chips.length ? `<p class="lk-note">Từ thành phần:</p><div class="lk-chips">${chips.map((t) => t.entry ? `<button type="button" class="btn ghost small" data-tok="${esc(t.text)}" data-lesson="${esc(content.lessonId)}">${esc(t.text)}</button>` : `<span class="tag">${esc(t.text)}</span>`).join("")}</div>` : ""}
  <p class="lk-status">Dữ liệu: ${esc(entry.originVi || "dữ liệu của dự án")} · Phát âm bằng giọng máy của thiết bị, không phải audio gốc của sách.</p>`;
}
function missingCardHtml(text) {
  return `<div class="lk-head"><span class="lk-zh" lang="zh-CN">${esc(text)}</span><button type="button" class="btn ghost lk-close" data-lk-close aria-label="Đóng bảng tra">×</button></div>
  <p>Chưa có dữ liệu cho mục này.</p>
  <p><button type="button" class="btn small" data-lk-speak="${esc(text)}">🔊 Nghe phát âm (giọng máy)</button> <span class="lk-note" data-lk-msg role="status"></span></p>
  <p class="lk-status">Dự án chưa kiểm duyệt được Pinyin, Hán–Việt và nghĩa của mục này nên không hiển thị đoán.</p>`;
}
function openWordLookup(btn) {
  const content = contentFor(btn.dataset.lesson);
  if (!content) return;
  const text = btn.dataset.tok;
  const entry = lessonLexicon(content).get(text);
  openLookupCard(entry ? entryCardHtml(entry, content) : missingCardHtml(text), btn);
}
function clearPhraseSelection() {
  if (phraseSel) {
    phraseSel.wrap.querySelectorAll(".tok").forEach((b) => b.classList.remove("tok-selected", "tok-range"));
    phraseSel.bar?.remove();
  }
  phraseSel = null;
}
function phraseResult(spanText, content, anchorBtn) {
  const phrase = (content.lookup?.phrases || []).find((x) => x.zh === spanText);
  if (phrase) {
    openLookupCard(`<div class="lk-head"><span class="lk-zh" lang="zh-CN">${esc(phrase.zh)}</span><button type="button" class="btn ghost lk-close" data-lk-close aria-label="Đóng bảng tra">×</button></div>
    <dl><dt>Pinyin</dt><dd lang="zh-Latn">${esc(phrase.pinyin)}</dd><dt>Nghĩa của cả cụm</dt><dd>${esc(phrase.vi)}</dd></dl>
    <p><button type="button" class="btn small" data-lk-speak="${esc(phrase.zh)}">🔊 Nghe phát âm (giọng máy)</button> <span class="lk-note" data-lk-msg role="status"></span></p>
    ${phrase.noteVi ? `<p class="lk-note">${esc(phrase.noteVi)}</p>` : ""}
    <p class="lk-status">Dữ liệu: cụm đã kiểm duyệt riêng cho bài này · Phát âm bằng giọng máy của thiết bị.</p>`, anchorBtn);
    return;
  }
  const toks = segmentZh(spanText, lessonLexicon(content));
  openLookupCard(`<div class="lk-head"><span class="lk-zh" lang="zh-CN">${esc(spanText)}</span><button type="button" class="btn ghost lk-close" data-lk-close aria-label="Đóng bảng tra">×</button></div>
  <p>Chưa có giải thích cho cả cụm. Đây là các từ thành phần:</p>
  <div class="lk-chips">${toks.map((t) => t.entry ? `<button type="button" class="btn ghost small" data-tok="${esc(t.text)}" data-lesson="${esc(content.lessonId)}">${esc(t.text)}</button>` : `<span class="tag">${esc(t.text)}</span>`).join("")}</div>
  <p class="lk-status">Nghĩa từng từ đã đối chiếu của dự án; app không tự ghép thành bản dịch của cả cụm.</p>`, anchorBtn);
}
document.addEventListener("click", (e) => {
  const pop = lookupPop;
  if (pop && !pop.hidden && !e.target.closest("#lookup-pop") && !e.target.closest("[data-tok]") && !e.target.closest("[data-phrase-btn]")) closeLookup();
  const closeBtn = e.target.closest("[data-lk-close]");
  if (closeBtn) { closeLookup(); return; }
  const speakBtn = e.target.closest("[data-lk-speak]");
  if (speakBtn) { lookupSpeak(speakBtn.dataset.lkSpeak, speakBtn.parentElement.querySelector("[data-lk-msg]")); return; }
  const kpTrackBtn = e.target.closest("[data-play-kp-track]");
  if (kpTrackBtn) {
    const kc = contentFor(kpTrackBtn.dataset.kpLesson);
    const track = kc?.reader.audioTracks.find((t) => t.id === kpTrackBtn.dataset.playKpTrack);
    if (track) player.playTrack(track, { rate: settings().playbackRate });
    return;
  }
  const phraseBtn = e.target.closest("[data-phrase-btn]");
  if (phraseBtn) {
    clearPhraseSelection(); closeLookup();
    const wrap = (phraseBtn.closest(".example") || phraseBtn.closest("section, article, div"))?.querySelector("[data-tok-wrap]");
    if (!wrap) return;
    const bar = document.createElement("div");
    bar.className = "phrase-bar";
    bar.innerHTML = `<span>Chạm từ đầu rồi chạm từ cuối của cụm.</span><button type="button" class="btn primary small" data-phrase-confirm disabled>Tra cụm đã chọn</button><button type="button" class="btn ghost small" data-phrase-cancel>Hủy</button>`;
    wrap.after(bar);
    phraseSel = { wrap, bar, start: null, end: null, btn: phraseBtn };
    phraseBtn.focus();
    return;
  }
  if (e.target.closest("[data-phrase-cancel]")) { const b = phraseSel?.btn; clearPhraseSelection(); if (b) b.focus(); return; }
  if (e.target.closest("[data-phrase-confirm]")) {
    if (!phraseSel || phraseSel.start === null || phraseSel.end === null) return;
    const { wrap, start, end, btn } = phraseSel;
    const parts = [...wrap.querySelectorAll("[data-toki]")].filter((n) => { const i = Number(n.dataset.toki); return i >= start && i <= end; }).map((n) => n.textContent).join("");
    const lessonId = wrap.querySelector("[data-tok]")?.dataset.lesson;
    const content = contentFor(lessonId);
    clearPhraseSelection();
    if (content && parts) phraseResult(parts, content, btn);
    return;
  }
  const tok = e.target.closest("[data-tok]");
  if (tok) {
    if (phraseSel && tok.closest("[data-tok-wrap]") === phraseSel.wrap) {
      const i = Number(tok.dataset.toki);
      if (phraseSel.start === null || (phraseSel.start !== null && phraseSel.end !== null)) { phraseSel.start = i; phraseSel.end = null; }
      else phraseSel.end = i;
      if (phraseSel.end !== null && phraseSel.end < phraseSel.start) [phraseSel.start, phraseSel.end] = [phraseSel.end, phraseSel.start];
      phraseSel.wrap.querySelectorAll("[data-tok]").forEach((b) => {
        const j = Number(b.dataset.toki);
        b.classList.toggle("tok-selected", j === phraseSel.start || j === phraseSel.end);
        b.classList.toggle("tok-range", phraseSel.end !== null && j > phraseSel.start && j < phraseSel.end);
      });
      phraseSel.bar.querySelector("[data-phrase-confirm]").disabled = phraseSel.end === null;
      return;
    }
    if (tok.closest("#lookup-pop")) { // component chip inside the popover
      const content = contentFor(tok.dataset.lesson);
      if (content) { const entry = lessonLexicon(content).get(tok.dataset.tok); openLookupCard(entry ? entryCardHtml(entry, content) : missingCardHtml(tok.dataset.tok), tok); }
      return;
    }
    openWordLookup(tok);
  }
});
document.addEventListener("keydown", (e) => { if (e.key === "Escape") { if (phraseSel) clearPhraseSelection(); else closeLookup(); } });

function sectionKnowledgeHtml(content) {
 const isFoundation = (x) => ['foundation-pronunciation','foundation-characters'].includes(x.kind);
 const isTip = (x) => String(x.kindLabel || "").startsWith("Mẹo");
 const main=content.knowledgePoints.filter(x=>!isFoundation(x) && !isTip(x));
 const tips=content.knowledgePoints.filter(x=>!isFoundation(x) && isTip(x));
 const foundation=content.knowledgePoints.filter(isFoundation);
 const countWord={1:'Một',2:'Hai',3:'Ba',4:'Bốn',5:'Năm',6:'Sáu',7:'Bảy',8:'Tám'}[main.length]||String(main.length);
 return `<div class="section-heading"><div><p class="kicker">HIỂU ĐỂ TỰ DÙNG</p><h2>${countWord} điều cần nhớ</h2></div></div>${supportBarHtml('sentences')}${lookupOn(content) ? `<p class="muted small">${esc(content.lookup.introVi || "")}</p>` : ""}${main.map(x=>knowledgeCardHtml(x,{lessonId:content.lessonId})).join('')}${tips.length?`<details class="tips-block"><summary>Mẹo nhỏ trong bài — xem khi gặp câu liên quan (không phải điểm chính)</summary>${tips.map(x=>knowledgeCardHtml(x,{lessonId:content.lessonId})).join('')}</details>`:''}${foundation.length?`<details class="foundation"><summary>${esc(content.intro.foundationSummaryVi||'Ôn phát âm nền tảng')}</summary>${foundation.map(x=>knowledgeCardHtml(x,{lessonId:content.lessonId})).join('')}</details>`:''}`;
}
function bindKnowledge() { bindSupportBar(); bindQuickChecks(); }

function trackRowHtml(track) {
  const st = player.getState();
  const isCurrent = st.trackId === track.id;
  return `<article class="track-row" data-track="${esc(track.id)}">
    <button class="play-btn" data-play="${esc(track.id)}" aria-label="${isCurrent && st.playing ? "Tạm dừng" : "Phát"} ${esc(track.label)}">${isCurrent && st.playing ? "⏸" : "▶"}</button>
    <div class="grow"><strong>${esc(track.label)}</strong>
    <p class="muted small">${esc(track.bookRef)} · Thời lượng ${track.durationSec ? player.fmtTime(track.durationSec) : "hiện khi tải audio"}</p>

    ${isCurrent ? `<div class="seekrow"><span data-cur>${player.fmtTime(st.currentTime)}</span>
      <input type="range" min="0" max="${Math.floor(st.duration || track.durationSec)}" step="1" value="${Math.floor(st.currentTime)}" data-seek aria-label="Tua audio">
      <span>${player.fmtTime(st.duration || track.durationSec)}</span></div>
    <div class="row-actions"><label>Tốc độ <select data-rate>
      ${[0.75, 1, 1.25].map((r) => `<option value="${r}" ${String(settings().playbackRate) === String(r) ? "selected" : ""}>${r}×</option>`).join("")}</select></label>
      <button class="btn ghost" data-repeat>Nghe lại từ đầu</button></div>` : ""}
    </div></article>`;
}
function sectionReaderHtml(content) {
 const r=content.reader,s=settings(),query=parseRoute().query;
 const selected=r.sentences.find(x=>x.id===query.sentence);
 const group=r.passages.find(x=>x.id===(selected?.passageId||query.passage))||r.passages[0];
 const track=r.audioTracks.find(x=>x.id===group.audioTrackId);
 return `<section class="card reader-card"><p class="kicker">NGHE TRONG NGỮ CẢNH</p><h2>${esc(r.headingVi||r.titleVi)}</h2>
 <nav class="passage-tabs" aria-label="Chọn hội thoại">${r.passages.map((g,i)=>`<a class="${g.id===group.id?'selected':''}" href="#/lesson/${content.lessonId}/reader?passage=${g.id}" ${g.id===group.id?'aria-current="true"':''}>${i+1}. ${esc(g.title)}</a>`).join('')}</nav>
 <h3>${esc(group.title)}</h3><p class="muted">${esc(group.context)}</p>${lookupOn(content) ? `<p class="muted small">${esc(content.lookup.introVi || "")}</p>` : ""}<div id="tracks">${trackRowHtml(track)}</div>
 ${(() => { const gidx = r.passages.findIndex((g) => g.id === group.id);
   const relKps = content.knowledgePoints.filter((k) => !String(k.kindLabel || "").startsWith("Mẹo") && (k.sentenceIds || []).some((id) => group.sentenceIds.includes(id)));
   return `<div class="row-actions reader-links"><a class="btn ghost small" href="#/lesson/${content.lessonId}/prep">Xem từ của bài này</a>${relKps.map((k) => `<a class="btn ghost small" href="#/grammar/${esc(k.id)}?return=reader&passage=${esc(group.id)}">Điểm chính: ${esc(k.title)}</a>`).join("")}${group.checkItemId ? `<a class="btn small" href="#/lesson/${content.lessonId}/exercises?item=${esc(group.checkItemId)}">${esc(group.checkLabelVi || "Câu hỏi ngắn sau khi nghe")} →</a>` : ""}</div>`; })()}
 ${supportBarHtml('sentences')}<details class="transcript" ${query.sentence||readerOpen?'open':''}><summary>Mở lời thoại để đọc theo <span class="tag">Đã đối chiếu bản in</span></summary>
 ${group.sentenceIds.map(id=>{const sen=r.sentences.find(x=>x.id===id);return `<div class="sentence ${id===query.sentence?'highlighted':''}" data-sentence="${id}" id="${id}" data-anchor><span class="speaker">${esc(sen.speaker)}</span><div><div class="pinyin tog-pinyin-sent">${esc(sen.pinyin)}</div><div class="zh-sentence" lang="zh-CN" data-tok-wrap>${zhTokensHtml(sen.zh, content)}</div><button class="btn ghost small reveal-btn" data-reveal="${id}">Xem nghĩa</button><div class="vi tog-vi-sent" id="vi-${id}">${esc(sen.vi)}</div>${phraseBtnHtml(content)}${content.knowledgePoints.filter(k=>k.sentenceIds?.includes(id)).map(k=>`<a class="inline-grammar" href="#/grammar/${k.id}?return=reader&sentence=${id}">${esc(k.title)} ↗</a>`).join('')}</div>${speakBtnHtml(sentenceAudio(content, sen), sen.zh)}</div>`;}).join('')}
 ${refsHtml(group.sourceRefs)}</details><p class="study-tip">Lượt 1: nghe không nhìn chữ. Lượt 2: mở lời thoại và đọc theo. Lượt 3: thử nói lại.</p>
 <details class="audio-status"><summary>Về lời thoại và audio</summary><p>Lời thoại chép từ đúng phần hội thoại trong sách, ghép track theo số in trên trang (đã đối chiếu bản in, chưa nghe kiểm chứng). Mỗi câu có loa riêng: đoạn câu được căn bằng máy từ audio (ASR) nên là mốc nháp, chưa được người nghe xác nhận; vẫn có thể nghe cả track như trước. Bản in không bao gồm lời dẫn của audio.</p><a href="https://www.baulchino.com/new-hsk-audios-2026" target="_blank" rel="noopener">Mở trang audio nguồn ↗</a></details></section>`;
}

let readerEpoch = 0;
function bindReader(content) {
  bindSupportBar();
  const r = content.reader;
  const epoch = ++readerEpoch;
  let lastKey = "";
  const rerenderTracks = () => {
    if (epoch !== readerEpoch) return; // a newer reader render owns the UI now
    const st = player.getState();
    const el = $("#tracks"); if (!el) { renderMini(); return; }
    const key = `${st.trackId}|${st.playing}|${Math.floor(st.duration)}|${st.error ? "err" : ""}`;
    if (key === lastKey) {
      // Same track/state: update time in place so controls are not rebuilt
      // mid-click (rebuilding on every timeupdate broke the pause button).
      const cur = el.querySelector("[data-cur]"); if (cur) cur.textContent = player.fmtTime(st.currentTime);
      const range = el.querySelector("[data-seek]"); if (range && document.activeElement !== range) range.value = Math.floor(st.currentTime);
      renderMini();
      return;
    }
    lastKey = key;
    const query=parseRoute().query, selected=r.sentences.find(x=>x.id===query.sentence);
    const group=r.passages.find(x=>x.id===(selected?.passageId||query.passage))||r.passages[0];
    el.innerHTML = trackRowHtml(r.audioTracks.find(x=>x.id===group.audioTrackId)); bindTrackControls();
    renderMini();
  };
  sectionUnsubscribe = player.subscribe(rerenderTracks);
  bindTrackControls();
  $$("[data-reveal]").forEach((b) => b.addEventListener("click", () => {
    const el = document.getElementById(`vi-${b.dataset.reveal}`); if (!el) return;
    const on = el.classList.toggle("revealed"); b.textContent = on ? "Ẩn nghĩa" : "Xem nghĩa";
  }));
  function bindTrackControls() {
    $$("[data-play]").forEach((b) => b.onclick = () => {
      const track = r.audioTracks.find((t) => t.id === b.dataset.play);
      player.playTrack(track, { rate: settings().playbackRate });
    });
    $$("[data-seek]").forEach((el) => el.onchange = () => player.seek(Number(el.value)));
    $$("[data-rate]").forEach((el) => el.onchange = () => { update((p) => { p.settings.playbackRate = Number(el.value); }); player.setRate(Number(el.value)); });
    $$("[data-repeat]").forEach((b) => b.onclick = () => player.seek(0));
  }
}

// ---------- Exercises ----------
function ensureSession(content, set = content.exerciseSet) {
  const setId = set.id;
  const p = loadProgress();
  if (!p.exerciseSessions?.[setId]) {
    update((pp) => {
      pp.exerciseSessions ||= {};
      pp.exerciseSessions[setId] = { setId, index: 0, answers: {}, checked: {}, hintUsed: {}, supportUsed: {} };
      pp.exerciseSession = pp.exerciseSessions[setId];
    });
  }
  return loadProgress().exerciseSessions[setId];
}
function updateSession(content, mut, set = content.exerciseSet) {
  const setId = set.id;
  update((pp) => {
    pp.exerciseSessions ||= {};
    if (!pp.exerciseSessions[setId]) pp.exerciseSessions[setId] = { setId, index: 0, answers: {}, checked: {}, hintUsed: {}, supportUsed: {} };
    mut(pp.exerciseSessions[setId]);
    pp.exerciseSession = pp.exerciseSessions[setId];
  });
}
function recordAttempt(item, optionId, correct, hintUsed, lessonId, supportUsed) {
  update((p) => {
    const prior = p.attempts.filter((a) => a.exerciseId === item.id);
    p.attempts.push({ id: `att-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, exerciseId: item.id, lessonId, optionId, correct, firstAttempt: prior.length === 0, hintUsed: !!hintUsed, supportUsed: !!supportUsed, at: new Date().toISOString() });
    if (!correct) {
      const key = `ex-${item.id}`;
      const existing = p.reviewItems[key];
      p.reviewItems[key] = { sourceItemId: item.id, kind: "exercise", intervalStep: 0, dueAt: new Date(Date.now() + REVIEW_INTERVALS_DAYS[0] * 86400000).toISOString(), lastResult: "wrong", attempts: (existing?.attempts || 0) + 1 };
    }
  });
}
function isPronunciationItem(item) {
  // Pronunciation items: Pinyin IS the content being tested, so it stays
  // visible before grading and the item is labelled as a pronunciation drill.
  return /redup|pronunciation/i.test(item.id) || /phân biệt âm|chọn âm tiết/i.test(item.promptVi || "");
}
function exerciseCardHtml(content, set, prefix) {
  let ses = ensureSession(content, set);
  const item = set.items[ses.index];
  const attempts = loadProgress().attempts;
  const sum = summarizeAttempts(attempts, set.items.map((i) => i.id));
  const isMain = prefix === "";
  if (!item) {
    return `<section class="card" ${isMain ? 'id="exercise-card"' : 'id="supp-exercise-card"'} data-anchor><h2>${isMain ? "Đã làm hết câu hỏi chấm tự động" : "Đã làm hết đề mô phỏng"}</h2>
    <p>Điểm lần đầu: <strong>${sum.firstCorrect}/${sum.firstTotal}</strong> · Đã làm lại: ${sum.retried} câu · Đã dùng gợi ý: ${sum.hintUsedCount} câu · Đã dùng Pinyin/Nghĩa hỗ trợ: ${sum.supportUsedCount || 0} câu.</p>
    <div class="row-actions"><button class="btn" type="button" id="${prefix}back-last">← Xem lại câu cuối</button>
    <button class="btn" id="${prefix}restart-set">Làm lại từ đầu (điểm lần đầu đã ghi sẽ không đổi)</button></div></section>`;
  }
  const checked = ses.checked[item.id];
  const chosen = ses.answers[item.id];
  const result = checked ? gradeChoice(item, chosen) : null;
  const supportOn = !!(ses.supportUsed?.[item.id]);
  const seg = item.audioSegment;
  return `<section class="card" ${isMain ? 'id="exercise-card"' : 'id="supp-exercise-card"'} data-anchor><h2>${isMain ? "Luyện tập" : esc(set.titleVi || "Bài tập bổ trợ")}</h2>${isMain ? supportBarHtml('exercises') : ""}
  <details class="set-note"><summary>Ghi chú về bộ câu hỏi</summary><p class="muted">${esc(set.noteVi)}</p></details>${supportOn && !checked ? `<p class="support-note">Câu này đang dùng hỗ trợ — kết quả sẽ ghi là “có hỗ trợ”, tách riêng với kết quả tự làm.</p>` : ""}
  <div class="progress-bar" aria-hidden="true"><div style="width:${Math.round((ses.index / set.items.length) * 100)}%"></div></div>
  <p class="muted">Câu ${ses.index + 1}/${set.items.length} · Điểm lần đầu hiện tại: ${sum.firstCorrect}/${sum.firstTotal || 0}</p>
  ${isPronunciationItem(item) ? `<p class="tag">Bài luyện âm — Pinyin chính là nội dung cần phân biệt nên được hiện sẵn.</p>` : (checked ? "" : `<p class="muted small">Pinyin và nghĩa của câu và các lựa chọn sẽ hiện sau khi bạn kiểm tra, để bạn tự làm trước.</p>`)}
  <h3>${esc(item.promptVi)}</h3>${seg ? `<p><button class="btn" type="button" data-play-task="${esc(seg.trackId)}" data-seg-start="${seg.start}" data-seg-end="${seg.end}">▶ Nghe đoạn của câu này (${fmtClock(seg.start)}–${fmtClock(seg.end)})</button></p>` : ""}${item.promptZh ? `<p class="exercise-stem"><span class="zh-inline" lang="zh-CN">${esc(item.promptZh)}</span>${checked && item.promptPinyin ? `<span class="pinyin tog-pinyin-ex" lang="zh-Latn">${esc(item.promptPinyin)}</span>` : ""}</p>` : ""}${item.image ? `<figure class="exercise-figure"><img src="${esc(item.image)}" alt="${esc(item.imageAlt)}" width="480" height="200"><figcaption>${esc(item.imageCaption||'Hình gốc trong sách bài tập')}</figcaption></figure>` : ""}
  <form id="${prefix}ex-form">
  ${item.options.map((o, oi) => `<label class="option ${o.image ? "option-has-pic" : ""} ${checked && chosen === o.id ? (result.correct ? "right" : "wrong") : ""} ${checked && item.answer === o.id ? "right-outline" : ""}">
    <input type="radio" name="opt" value="${esc(o.id)}" ${chosen === o.id ? "checked" : ""} ${checked ? "disabled" : ""}>
    <span class="option-body">${o.image ? `<span class="option-pic"><img src="${esc(o.image)}" alt="${esc(o.imageAlt || "")}" loading="lazy"><span class="option-letter">${"ABCDEF"[oi] || ""}</span>${checked ? `<span class="option-pic-cap"><span class="zh-inline" lang="zh-CN">${esc(o.zh || "")}</span><span class="pinyin tog-pinyin-ex" lang="zh-Latn">${esc(o.pinyin || "")}</span><span class="option-vi tog-vi-ex">${esc(o.vi || "")}</span></span>` : ""}</span>` : o.zh ? (isPronunciationItem(item) ? `<span class="zh-inline" lang="zh-Latn">${esc(o.zh)}</span>${checked ? `<span class="option-vi tog-vi-ex">${esc(o.vi || "")}</span>` : ""}` : `<span class="zh-inline" lang="zh-CN">${esc(o.zh)}</span>${checked ? `<span class="pinyin tog-pinyin-ex" lang="zh-Latn">${esc(o.pinyin || "")}</span><span class="option-vi tog-vi-ex">${esc(o.vi || "")}</span>` : ""}${HAS_HAN.test(o.zh) ? ttsBtnHtml(o.zh) : ""}`) : esc(o.labelVi || "")}</span></label>`).join("")}
  ${!checked ? `<div class="row-actions"><button class="btn primary" type="submit">Kiểm tra</button>
    <button class="btn ghost" type="button" id="${prefix}hint-btn">Gợi ý</button>
    ${ses.index > 0 ? `<button class="btn ghost" type="button" id="${prefix}prev-q">← Câu trước</button>` : ""}</div>
    ${ses.hintUsed[item.id] ? `<p class="hint">Gợi ý: ${esc(item.hintVi)} <span class="muted">(đã ghi nhận dùng gợi ý)</span></p>` : ""}`
  : `<div class="feedback ${result.correct ? "ok" : "bad"}" role="status">
      <p><strong>${result.correct ? "Đúng." : "Chưa đúng."}</strong> ${esc(item.explanationVi)}</p>
      ${item.grammarIds.length ? `<a class="btn" href="#/grammar/${esc(item.grammarIds[0])}?return=exercises">Ôn lại cách dùng</a>` : ""}
      ${ses.index > 0 ? `<button class="btn" type="button" id="${prefix}prev-q">← Câu trước</button>` : ""}
      ${ses.index + 1 < set.items.length ? `<button class="btn primary" type="button" id="${prefix}next-q">Câu tiếp theo</button>` : `<button class="btn primary" type="button" id="${prefix}finish-q">Xem tổng kết bộ này</button>`}
    </div>`}
  </form>
  ${refsHtml(item.sourceRefs)}
  </section>`;
}
function sectionExercisesHtml(content) {
  // A ?item= deep link may target the main set or the supplementary set.
  const requested = parseRoute().query.item;
  if (requested && requested !== lastDeepLinkItem) {
    lastDeepLinkItem = requested;
    for (const set of [content.exerciseSet, content.suppExerciseSet].filter(Boolean)) {
      const idx = set.items.findIndex((i) => i.id === requested);
      if (idx >= 0) {
        const ses = ensureSession(content, set);
        if (ses.reviewTarget !== requested) { updateSession(content, (ss) => { ss.index = idx; ss.reviewTarget = requested; delete ss.checked[requested]; }, set); }
        break;
      }
    }
  }
  const scrollBtn = (target, label) => `<button class="btn" type="button" data-scroll-to="${target}">${label}</button>`;
  return `<section class="card exercise-zones"><h2>Luyện tập gồm 3 phần</h2>
  <p><strong>A. Luyện sau bài</strong> — ${content.exerciseSet.items.length} câu chính của bài: nghe hiểu, chọn từ, vị trí và trật tự câu, dùng 在 và 能.</p>
  <p><strong>B. Luyện thêm</strong> — phân biệt âm, nói theo hình và câu hỏi tự trả lời. Phần này tự đối chiếu, không bắt buộc.</p>
  ${content.suppExerciseSet ? `<p><strong>C. Đề mô phỏng</strong> — ${content.suppExerciseSet.items.length} câu, điểm ghi riêng, không gộp vào điểm bài chính và không tự bắt đầu.</p>` : ""}
  <div class="row-actions">${scrollBtn("exercise-card", "A. Làm bài chính")}${scrollBtn("extra-practice", "B. Luyện thêm")}${content.suppExerciseSet ? scrollBtn("supp-exercise-card", "C. Đề mô phỏng") : ""}</div></section>
  ${exerciseCardHtml(content, content.exerciseSet, "")}
  ${content.suppExerciseSet ? exerciseCardHtml(content, content.suppExerciseSet, "supp-") : ""}
  <section class="card dictation-block" id="extra-practice"><h2>B. Luyện thêm theo sách</h2>${dictationHtml(content)}</section>`;
}
let lastDeepLinkItem = null; // ?item= deep link fires once per param change (edge-triggered)
const dictRevealed = new Set(); // taskIds whose listening script is currently shown
const dictOpenTasks = new Set(); // dictation tasks currently expanded (first task open by default)
function fmtClock(sec) { return `${Math.floor(sec / 60)}:${String(Math.floor(sec % 60)).padStart(2, "0")}`; }
function dictationHtml(content) {
 const p = loadProgress();
 const focusTask = parseRoute().query.task;
 const hasGraded = content.selfCheckTasks.some(t => t.answerStatus === 'verified-editorial');
 return `${supportBarHtml('dictation')}<details class="info-fold"><summary>Cách làm bài</summary><p>${hasGraded ? 'Ở bài chọn/điền có chấm điểm, Pinyin không làm lộ đáp án trước khi chấm; xem trước lời đọc sẽ được ghi nhận vào kết quả. ' : ''}Các cặp so sánh hiện đầy đủ để nghe và đọc theo. Bài luyện phát âm chỉ có âm tiết, không có nghĩa câu riêng; các khung tự nói giữ nguyên chữ Hán như đề sách.</p></details>${content.selfCheckIntroVi ? `<details class="info-fold"><summary>Thông tin thêm</summary><p>${esc(content.selfCheckIntroVi)}</p></details>` : ""}
 ${content.selfCheckTasks.map((t, ti) => {
  const mine = p.selfChecks[t.id];
  const graded = t.answerStatus === "verified-editorial";
  const comparison = t.kind === "listening-comparison";
  const speaking = t.kind === "speaking" && t.promptImages;
  const entry = p.dictation?.[t.id];
  const firstVals = entry ? Object.values(entry.first || {}) : [];
  const firstCorrect = firstVals.filter(Boolean).length;
  const last = entry?.last || {};
  const lastVals = Object.values(last);
  const seg = t.audioSegment;
  const playLabel = seg ? `▶ Nghe đoạn của bài này (${fmtClock(seg.start)}–${fmtClock(seg.end)})` : esc(content.selfCheckListenVi || "▶ Nghe track");
  const open = ti === 0 || dictOpenTasks.has(t.id) || focusTask === t.id;
  return `<details class="dict-task" id="${t.id}" data-dict-task="${t.id}" data-anchor ${open ? "open" : ""}><summary><span class="dict-task-title">${esc(t.titleVi)}</span><span class="tag">${graded ? (firstVals.length ? `Lần đầu: ${firstCorrect}/${firstVals.length} ô` : "Chưa chấm") : comparison ? "Nghe · so sánh · đọc theo" : "Tự đánh giá"}</span></summary>
  <p>${esc(t.instructionVi)}</p>
  ${t.guideVi ? `<p class="small muted">${esc(t.guideVi)}</p>` : ""}
  ${comparison ? `<p class="practice-purpose">Bài luyện đọc cả hai dạng — không có đáp án duy nhất. Ô dưới mỗi cặp là ghi chú cá nhân, không phải ô trả lời.</p>` : ""}
  ${t.conflictCells?.length ? `<p class="small dict-conflict-note">${esc(t.conflictNoteVi || "")}</p>` : ""}
  <div class="dict-actions">${t.audioTrackId ? `<button class="btn" data-play-task="${esc(t.audioTrackId)}" ${seg ? `data-seg-start="${seg.start}" data-seg-end="${seg.end}"` : ""}>${playLabel}</button>` : ""}
  ${graded ? `<button class="btn primary" data-check-dict="${t.id}">Kiểm tra</button>
  ${lastVals.some((r) => !r.correct) ? `<button class="btn" data-redo-dict="${t.id}">Làm lại câu sai</button>` : ""}
  <button class="btn ghost" data-peek-dict="${t.id}">${dictRevealed.has(t.id) ? "Ẩn lời đọc" : "Xem lời đọc"}</button>${!dictRevealed.has(t.id) ? `<span class="muted small">Xem trước sẽ được ghi nhận.</span>` : ""}` : ""}
  </div>
  ${t.audioSegmentStatus === "asr-draft" ? `<p class="small muted">Mốc nghe tham khảo, chưa được người nghe xác nhận. Có thể mở track gốc ở phần Nguồn bài học để đối chiếu.</p>` : ""}
  ${graded && firstVals.length ? `<p class="dict-score" role="status">Điểm lần đầu: <strong>${firstCorrect}/${firstVals.length}</strong> ô đã kiểm tra${entry.peeked ? ` · đã xem lời đọc trước khi làm lần đầu` : ""}${lastVals.length ? ` · lần kiểm tra gần nhất: ${lastVals.filter((r) => r.correct).length}/${lastVals.length} ô đúng` : ""}</p>` : ""}
  ${graded && entry?.peeked && !firstVals.length ? `<p class="dict-score">Đã xem lời đọc — điểm lần đầu của bài này sẽ được ghi kèm lưu ý đó.</p>` : ""}
  <div class="answer-grid ${speaking ? "picture-practice-grid" : ""}">${t.prompts.map((v, i) => { const conflict = isConflictCell(t, i); const draft = p.drafts?.[t.id + ":" + i] || ""; const r = conflict ? null : last[i]; const edited = r && draft !== r.input; const fig = t.promptImages?.[i]; return `<label>${fig ? `<figure><img src="${esc(fig.src)}" alt="${esc(fig.alt)}" loading="lazy"><figcaption>${esc(fig.captionVi)}</figcaption></figure>` : ""}<span>${i + 1}. <span lang="${speaking ? "zh-CN" : "zh-Latn"}">${esc(v)}</span></span>${comparison || speaking ? `<span class="small muted">${comparison ? "Ghi chú nghe và đọc" : "Câu bạn muốn nói"}</span>` : ""}<input type="text" data-draft="${t.id}:${i}" aria-label="${esc(t.titleVi)} — ${comparison ? "ghi chú cặp" : "câu"} ${i + 1}" value="${esc(draft)}" autocomplete="off" class="${r && !edited ? (r.correct ? "cell-right" : "cell-wrong") : edited ? "cell-edited" : ""}">${conflict ? `<span class="cell-note warn">Tạm không chấm — nguồn đang mâu thuẫn, cứ luyện nghe và gõ thử.</span>` : r && !edited ? (r.correct ? `<span class="cell-note ok">Đúng</span>` : `<span class="cell-note bad">Đáp án: ${esc(dictationExpected(t, i))}</span>`) : edited ? `<span class="cell-note warn">Đã sửa — cần kiểm tra lại</span>` : ""}${r && !edited && t.scriptSyllables?.[i] ? `<span class="cell-script tog-pinyin-ex">Lời đọc: <span lang="zh-Latn">${esc(t.scriptSyllables[i])}</span></span>` : ""}</label>`; }).join("")}</div>
  ${dictRevealed.has(t.id) ? `<div class="script-box"><p class="small muted">Lời đọc của bài (theo tài liệu lời đọc của sách):</p><p lang="zh-Latn">${(t.scriptSyllables || []).map(esc).join(" · ")}</p></div>` : ""}
  <p class="small muted">${graded ? "Chấm tự động · đáp án đã đối chiếu, chưa phải đáp án chính thức của NXB." : "Tự đánh giá mức nhớ, không phải kết quả đúng/sai."}</p>
  <div class="row-actions">${[["forgot", "Chưa nhớ"], ["slow", "Còn chậm"], ["known", "Nhớ"]].map(([k, v]) => `<button class="btn small ${mine?.rating === k ? "primary" : ""}" data-selfrate="${t.id}:${k}">${v}</button>`).join("")}</div>
  ${refsHtml(t.sourceRefs)}</details>`; }).join("")}`;
}

function bindExerciseSet(content, set, prefix) {
  const ses = ensureSession(content, set);
  const item = set.items[ses.index];
  const form = document.getElementById(`${prefix}ex-form`);
  if (form && item) {
    form.onchange = () => { const value = new FormData(form).get('opt'); if (value) updateSession(content, (ss) => { ss.answers[item.id] = String(value); }, set); };
    form.onsubmit = (e) => {
      e.preventDefault();
      const chosen = new FormData(form).get("opt");
      if (!chosen) return;
      const res = gradeChoice(item, String(chosen));
      if (!res.graded) return;
      const curSes = ensureSession(content, set);
      const hintUsed = !!curSes.hintUsed[item.id];
      const supportUsed = !!(curSes.supportUsed?.[item.id]);
      updateSession(content, (ss) => { ss.answers[item.id] = String(chosen); ss.checked[item.id] = true; if (ss.reviewTarget === item.id) delete ss.reviewTarget; }, set);
      recordAttempt(item, String(chosen), res.correct, hintUsed, content.lessonId, supportUsed);
      render();
    };
    const hint = document.getElementById(`${prefix}hint-btn`);
    if (hint) hint.onclick = () => { updateSession(content, (ss) => { ss.hintUsed[item.id] = true; }, set); render(); };
    const next = document.getElementById(`${prefix}next-q`); if (next) next.onclick = () => { updateSession(content, (ss) => { ss.index += 1; }, set); render(); };
    const fin = document.getElementById(`${prefix}finish-q`); if (fin) fin.onclick = () => { updateSession(content, (ss) => { ss.index = set.items.length; }, set); render(); };
    const prev = document.getElementById(`${prefix}prev-q`); if (prev) prev.onclick = () => { updateSession(content, (ss) => { ss.index -= 1; }, set); render(); };
  }
  const backLast = document.getElementById(`${prefix}back-last`);
  if (backLast) backLast.onclick = () => { updateSession(content, (ss) => { ss.index = set.items.length - 1; }, set); render(); };
  const restart = document.getElementById(`${prefix}restart-set`);
  if (restart) restart.onclick = () => { updateSession(content, (ss) => { ss.index = 0; ss.answers = {}; ss.checked = {}; ss.hintUsed = {}; ss.supportUsed = {}; delete ss.reviewTarget; }, set); render(); };
}
function bindExercises(content) {
  bindSupportBar();
  $$("[data-scroll-to]").forEach((b) => b.onclick = () => { document.getElementById(b.dataset.scrollTo)?.scrollIntoView({ block: "start" }); });
  { const st0 = settings();
    // D23 QA TB-1: opening the page with support already on records support
    // only for the main set (see recordExerciseSupport).
    const set0 = content.exerciseSet;
    const ses0 = ensureSession(content, set0); const it0 = set0.items[ses0.index];
    if (it0 && !ses0.checked[it0.id] && (st0.showPinyinExercises || st0.showViExercises)) updateSession(content, (ss) => { (ss.supportUsed ||= {})[it0.id] = true; }, set0); }
  $$("[data-dict-task]").forEach((d) => d.addEventListener("toggle", () => { if (d.open) dictOpenTasks.add(d.dataset.dictTask); else dictOpenTasks.delete(d.dataset.dictTask); }));
  $$("[data-draft]").forEach(el=>el.oninput=()=>update(p=>{(p.drafts ||= {})[el.dataset.draft]=el.value;}));
  bindExerciseSet(content, content.exerciseSet, "");
  if (content.suppExerciseSet) bindExerciseSet(content, content.suppExerciseSet, "supp-");
  $$("[data-play-task]").forEach((b) => b.onclick = () => {
    const track = content.reader.audioTracks.find((t) => t.id === b.dataset.playTask);
    if (!track) return;
    if (b.dataset.segStart != null) player.playSegment(track, { start: Number(b.dataset.segStart), end: Number(b.dataset.segEnd), rate: settings().playbackRate });
    else player.playTrack(track, { rate: settings().playbackRate });
  });
  $$("[data-peek-dict]").forEach((b) => b.onclick = () => {
    const taskId = b.dataset.peekDict;
    if (dictRevealed.has(taskId)) { dictRevealed.delete(taskId); }
    else {
      dictRevealed.add(taskId);
      update((p) => { const e = (p.dictation ||= {})[taskId] ||= { first: {}, tries: {}, peeked: false }; if (!Object.keys(e.first || {}).length) e.peeked = true; });
    }
    render();
  });
  const runDictCheck = (task, onlyWrong) => {
    const entry = loadProgress().dictation?.[task.id];
    const results = {};
    task.prompts.forEach((_, i) => {
      if (onlyWrong) { const prev = entry?.last?.[i]; if (!prev || prev.correct) return; }
      const input = document.querySelector(`[data-draft="${task.id}:${i}"]`);
      const res = gradeDictationCell(task, i, input?.value ?? "");
      if (res.graded) results[i] = { correct: res.correct, input: input?.value ?? "" };
    });
    if (!Object.keys(results).length) return;
    update((p) => {
      const e = (p.dictation ||= {})[task.id] ||= { first: {}, tries: {}, peeked: false };
      e.first ||= {}; e.tries ||= {}; e.last = { ...(e.last || {}), ...results };
      for (const [idx, r] of Object.entries(results)) {
        e.tries[idx] = (e.tries[idx] || 0) + 1;
        if (!(idx in e.first)) {
          e.first[idx] = r.correct;
          const key = `dict-${task.id}:${idx}`;
          if (!r.correct && !p.reviewItems[key]) {
            p.reviewItems[key] = { sourceItemId: `${task.id}:${idx}`, kind: "dictation", intervalStep: 0, dueAt: new Date(Date.now() + REVIEW_INTERVALS_DAYS[0] * 86400000).toISOString(), lastResult: "wrong", attempts: 1 };
          }
        } else if (r.correct) {
          const key = `dict-${task.id}:${idx}`;
          const prevItem = p.reviewItems[key];
          if (prevItem && prevItem.lastResult === "wrong") {
            const sched = nextReviewState(prevItem, "known", Date.now());
            p.reviewItems[key] = { ...prevItem, ...sched, lastResult: "correct", attempts: (prevItem.attempts || 1) + 1 };
          }
        }
      }
      e.updatedAt = new Date().toISOString();
    });
    render();
  };
  $$("[data-check-dict]").forEach((b) => b.onclick = () => { const task = content.selfCheckTasks.find((t) => t.id === b.dataset.checkDict); if (task) runDictCheck(task, false); });
  $$("[data-redo-dict]").forEach((b) => b.onclick = () => { const task = content.selfCheckTasks.find((t) => t.id === b.dataset.redoDict); if (task) runDictCheck(task, true); });
  const taskTarget = parseRoute().query.task;
  if (taskTarget) { const el = document.getElementById(taskTarget); if (el) el.scrollIntoView({ block: "start" }); }
  $$("[data-selfrate]").forEach((b) => b.onclick = () => {
    const [taskId, rating] = b.dataset.selfrate.split(":");
    update((p) => {
      p.selfChecks[taskId] = { rating, at: new Date().toISOString() };
      const key = `st-${taskId}`;
      const prev = p.reviewItems[key];
      const sched = nextReviewState(prev, rating, Date.now());
      p.reviewItems[key] = { sourceItemId: taskId, kind: "self-check", ...sched, lastResult: rating === "known" ? "correct" : "wrong", attempts: (prev?.attempts || 0) + 1 };
    });
    render();
  });
}

function sectionApplyHtml(content) {
  const a = content.apply;
  const track = content.reader.audioTracks.find((t) => t.id === a.audioTrackId);
  const samples = (a.samplePassageIds || []).flatMap((pid) => { const g = content.reader.passages.find((x) => x.id === pid); return g ? g.sentenceIds.map((id) => content.reader.sentences.find((x) => x.id === id)) : []; }).filter(Boolean);
  const done = loadProgress().speakingDone || {};
  if (Array.isArray(a.tasks) && a.tasks.length) {
    return `<section class="card" data-anchor><h2>Tự nói: ${esc(a.titleVi)}</h2>
    <p class="muted">Mỗi nhiệm vụ rất ngắn. Bạn có thể tự luyện một mình hoặc luyện cùng một người khác. App không chấm phát âm và không chấm nói — nút “Đã luyện” chỉ ghi lại bạn đã tập, không có nghĩa là đã nắm vững. Các nhiệm vụ này là cách tổ chức lại các hoạt động của sách theo tình huống; mỗi nhiệm vụ ghi rõ câu mẫu lấy từ đâu.</p>
    ${supportBarHtml('sentences')}
    ${a.tasks.map((t) => `<article class="speak-task" id="${esc(t.id)}" data-anchor><h3>${esc(t.titleVi)}</h3>
      <p>${esc(t.situationVi)}</p>
      <div class="example"><div class="ex-row"><span class="zh-sentence" lang="zh-CN" data-tok-wrap>${zhTokensHtml(t.sampleZh, content)}</span>${ttsBtnHtml(t.sampleZh)}</div><div class="ex-meta">${t.samplePinyin ? `<span class="pinyin tog-pinyin-sent" lang="zh-Latn">${esc(t.samplePinyin)}</span>` : ""}<span class="ex-note tog-vi-sent">${esc(t.sampleVi)}</span>${phraseBtnHtml(content)}</div></div>
      <p class="small">${esc(t.swapVi)}</p>
      <p class="small muted">${esc(t.sourceNoteVi || "")}</p>
      <button class="btn ${done[t.id] ? "primary" : ""}" type="button" data-speak-done="${esc(t.id)}" aria-pressed="${!!done[t.id]}">${done[t.id] ? "✓ Đã luyện nhiệm vụ này" : "Đánh dấu đã luyện"}</button>
    </article>`).join("")}
    <details class="study-tip"><summary>Hướng dẫn đầy đủ của sách (3 hoạt động cặp)</summary><p>${esc(a.instructionVi)}</p><p>${esc(a.noteVi||'')}</p></details>
    ${refsHtml(a.sourceRefs)}</section>`;
  }
  return `<section class="card" data-anchor><h2>Vận dụng: ${esc(a.titleVi)}</h2><p>${esc(a.instructionVi)}</p>
  ${trackRowHtml(track)}${supportBarHtml('sentences')}
  ${samples.length ? `<h3>Câu mẫu để đóng vai</h3>${samples.map((sen) => `<div class="sentence" data-anchor><span class="speaker">${esc(sen.speaker)}</span><div><div class="pinyin tog-pinyin-sent">${esc(sen.pinyin)}</div><div class="zh-sentence" lang="zh-CN">${esc(sen.zh)}</div><div class="vi tog-vi-sent">${esc(sen.vi)}</div></div>${speakBtnHtml(sentenceAudio(content, sen), sen.zh)}</div>`).join("")}` : ""}
  <p class="muted">${esc(a.noteVi||'')}</p>
  ${refsHtml(a.sourceRefs)}</section>`;
}
function sectionSummaryHtml(lesson, content) {
  const set = content.exerciseSet;
  const p = loadProgress();
  const sum = summarizeAttempts(p.attempts, set.items.map((i) => i.id));
  const allItems = [...set.items, ...(content.suppExerciseSet?.items || [])];
  const suppSum = content.suppExerciseSet ? summarizeAttempts(p.attempts, content.suppExerciseSet.items.map((i) => i.id)) : null;
  const wrongIds = [...new Set(p.attempts.filter((a) => !a.correct && allItems.some(i=>i.id===a.exerciseId)).map((a) => a.exerciseId))];
  const st = lessonState(lesson.id);
  const nextSection = content.intro.sections.find((x) => !st.completedSections.includes(x.id));
  const attempted = sum.firstTotal > 0 || (suppSum ? suppSum.firstTotal > 0 : false);
  const mainNotAttempted = sum.firstTotal === 0 && suppSum && suppSum.firstTotal > 0;
  return `<section class="card"><h2>Tổng kết bài</h2>
  ${Array.isArray(content.summaryPoints) && content.summaryPoints.length ? `<h3>Ba điều chính đã học</h3>${content.summaryPoints.map((pt) => `<div class="example"><strong>${esc(pt.titleVi)}</strong><div class="ex-row"><span class="zh-sentence" lang="zh-CN" data-tok-wrap>${zhTokensHtml(pt.exampleZh, content)}</span></div><div class="ex-meta"><span class="ex-note">${esc(pt.exampleVi)}</span>${phraseBtnHtml(content)}</div></div>`).join("")}` : ""}
  <p>Đã hoàn thành <strong>${st.completedSections.length}/${content.intro.sections.length}</strong> mục.</p>
  ${nextSection ? `<p class="row-actions"><a class="btn primary" href="#/lesson/${lesson.id}/${nextSection.id}">Tiếp tục: ${esc(nextSection.titleVi)} →</a></p>` : ""}
  <p>Bài tập chấm tự động: điểm lần đầu <strong>${sum.firstCorrect}/${sum.firstTotal}</strong>.</p>
  ${suppSum ? `<p>Đề mô phỏng của sách: điểm lần đầu <strong>${suppSum.firstCorrect}/${suppSum.firstTotal}</strong>. Điểm của đề mô phỏng ghi riêng, không gộp vào điểm bài tập của bài.</p>` : ""}
  <details class="study-tip"><summary>Xem chi tiết</summary><p>Số câu đã làm lại: ${sum.retried}; số câu đã dùng gợi ý: ${sum.hintUsedCount}; số câu đã dùng Pinyin/Nghĩa hỗ trợ: ${sum.supportUsedCount || 0}. Điểm làm lại, gợi ý và hỗ trợ được ghi riêng, không gộp vào điểm lần đầu và không diễn giải lại lịch sử cũ.${suppSum ? ` Đề mô phỏng — làm lại: ${suppSum.retried} câu; gợi ý: ${suppSum.hintUsedCount} câu; hỗ trợ: ${suppSum.supportUsedCount || 0} câu.` : ""}</p></details>
  ${!attempted ? `<p class="muted">Bạn chưa làm bài tập.</p>` : mainNotAttempted ? `<p class="muted">Bạn chưa làm bài tập chính của bài — bạn mới làm đề mô phỏng.</p>${wrongIds.length ? `<h3>Câu từng làm sai — ôn lại cách dùng</h3>${wrongIds.map((id) => { const it = allItems.find((i) => i.id === id); return `<p class="row-line"><span>${esc(it.promptVi)}</span>${it.grammarIds.length ? `<a class="btn small" href="#/grammar/${esc(it.grammarIds[0])}?return=summary">Ôn lại</a>` : ""}</p>`; }).join("")}` : ""}` : wrongIds.length ? `<h3>Câu từng làm sai — ôn lại cách dùng</h3>${wrongIds.map((id) => { const it = allItems.find((i) => i.id === id); return `<p class="row-line"><span>${esc(it.promptVi)}</span>${it.grammarIds.length ? `<a class="btn small" href="#/grammar/${esc(it.grammarIds[0])}?return=summary">Ôn lại</a>` : ""}</p>`; }).join("")}` : `<p class="muted">Chưa có câu nào làm sai.</p>`}
  <h3>Học lại từng mục</h3>
  ${content.intro.sections.map((x) => `<p class="row-line"><a href="#/lesson/${lesson.id}/${x.id}">${esc(x.titleVi)}</a><span class="tag">${st.completedSections.includes(x.id) ? "Đã xong" : "Chưa học"}</span></p>`).join("")}
  ${(() => { const lines = content.selfCheckTasks.filter((t) => t.answerStatus === "verified-editorial").map((t) => { const e = p.dictation?.[t.id]; if (!e || !Object.keys(e.first || {}).length) return ""; const vals = Object.values(e.first); const wrongIdx = Object.entries(e.first).filter(([, v]) => !v).map(([k]) => Number(k)); return `<p>Nghe–viết “${esc(t.titleVi)}”: điểm lần đầu <strong>${vals.filter(Boolean).length}/${vals.length}</strong> ô${e.peeked ? " (đã xem lời đọc trước)" : ""}.${wrongIdx.length ? ` Ô sai: ${wrongIdx.map((i) => `<a href="#/lesson/${lesson.id}/exercises?task=${t.id}">${i + 1} (${esc(t.scriptSyllables?.[i] || "")})</a>`).join(", ")} — đã đưa vào Ôn tập.` : ""}</p>`; }).join(""); return lines ? `<h3>Nghe–viết đã chấm</h3>${lines}` : ""; })()}
  <p class="muted">Mức “đã học” ở đây chỉ nghĩa là đã xem/làm các mục. App không coi một mục là “đã nắm vững” nếu thiếu bài tập kiểm chứng.</p>
  <p class="row-actions"><a class="btn" href="#/review">Tới Ôn tập</a><a class="btn primary" href="#/course/HSK%201">Về lộ trình</a></p></section>`;
}

// ---------- Grammar ----------
function allKnowledge() { return allContents().flatMap((c) => c.knowledgePoints); }
function viewGrammar(id, queryOverride) {
  navActive();
  const { query } = parseRoute();
  if (id) {
    const kp = allKnowledge().find((k) => k.id === id);
    if (!kp) { main.innerHTML = `<section class="card"><h1>Không tìm thấy điểm kiến thức</h1><a class="btn" href="#/grammar">Về tra cứu</a></section>`; return; }
    const kpLesson = kpLessonId(kp.id); const kpLessonObj = lessonById(kpLesson);
    const ret = query.return && ['exercises','summary','reader','knowledge'].includes(query.return) ? `#/lesson/${kpLesson}/${query.return}${query.sentence?'?sentence='+encodeURIComponent(query.sentence):query.passage?'?passage='+encodeURIComponent(query.passage):''}` : null;
    main.innerHTML = `${supportBarHtml('sentences')}${knowledgeCardHtml(kp, { linkBack: ret, lessonId: kpLesson })}
    <section class="card"><h2>Bài có dùng điểm này</h2><p class="row-line"><a href="#/lesson/${kpLesson}">HSK 1 · Bài ${kpLessonObj.lessonNumber}: ${esc(kpLessonObj.titleZh)}</a><span class="tag">Textbook + Workbook</span></p></section>`;
    bindSupportBar(); bindQuickChecks();
    return;
  }
  const q = queryOverride ?? query.q ?? "";
  const list = allKnowledge().filter((kp) => matchesQuery([kp.title, kp.explanationVi, kp.pattern, kp.examples.map((e) => `${e.zh} ${e.pinyin}`).join(" ")], q));
  main.innerHTML = `${header("Ngữ pháp & cách dùng", "Tìm theo chữ Hán, Pinyin (có/không dấu) hoặc từ khóa tiếng Việt")}
  <form id="gform" class="card"><label class="sr" for="gq">Từ khóa</label>
  <input id="gq" type="search" value="${esc(q)}" placeholder="Ví dụ: thanh điệu, er, bā, ni hao…" autocomplete="off">
  <button class="btn" type="submit">Tìm</button></form>
  ${list.length ? list.map((kp) => `<article class="row-card"><div class="grow"><h2>${esc(kp.title)}</h2>
    <p>${esc(kp.explanationVi.slice(0, 140))}…</p><p class="muted small">${esc(kp.kindLabel)} · Bài ${lessonById(kpLessonId(kp.id)).lessonNumber} · HSK 1</p></div>
    <a class="btn" href="#/grammar/${esc(kp.id)}">Xem</a></article>`).join("")
    : `<section class="card"><h2>Chưa có kết quả</h2><p class="muted">Thử từ khóa khác, chẳng hạn 您, 们, 叫, xin lỗi hoặc thanh điệu. Hiện danh mục gồm các bài đã mở trong lộ trình.</p></section>`}`;
  $("#gform").onsubmit = (e) => { e.preventDefault(); go(`#/grammar?q=${encodeURIComponent($("#gq").value)}`); };
}

// ---------- Review / Progress / Settings / Sources ----------
function describeReviewItem(item) {
  if (item.kind === "dictation" && typeof item.sourceItemId === "string") {
    const cut = item.sourceItemId.lastIndexOf(":");
    const taskId = item.sourceItemId.slice(0, cut), idx = Number(item.sourceItemId.slice(cut + 1));
    for (const c of allContents()) {
      const task = c.selfCheckTasks.find((t) => t.id === taskId);
      if (task) return { title: `Nghe–viết: ${task.scriptSyllables?.[idx] || task.prompts[idx]} — ${task.titleVi}`, href: `#/lesson/${c.lessonId}/exercises?task=${taskId}`, grammarId: null };
    }
  }
  for (const c of allContents()) {
    const ex = c.exerciseSet.items.find((i) => i.id === item.sourceItemId) || c.suppExerciseSet?.items.find((i) => i.id === item.sourceItemId);
    if (ex) return { title: ex.promptVi, href: `#/lesson/${c.lessonId}/exercises?item=${ex.id}`, grammarId: ex.grammarIds[0] };
    const task = c.selfCheckTasks.find((t) => t.id === item.sourceItemId);
    if (task) return { title: task.titleVi, href: `#/lesson/${c.lessonId}/exercises`, grammarId: null };
  }
  return { title: item.sourceItemId, href: "#/review", grammarId: null };
}
function viewReview() {
  navActive();
  const p = loadProgress();
  const items = Object.entries(p.reviewItems).map(([key, v]) => ({ key, ...v }));
  const due = items.filter((i) => isDue(i, Date.now()));
  const upcoming = items.filter((i) => !isDue(i, Date.now())).sort((a, b) => new Date(a.dueAt) - new Date(b.dueAt));
  main.innerHTML = `${header("Ôn tập", "Ôn bằng chính câu/bài đã làm sai hoặc tự đánh giá chưa nhớ — app không tự tạo câu mới")}${supportBarHtml('font')}
  ${due.length ? `<section class="card"><h2>Đến hạn ôn (${due.length})</h2>
    ${due.map((i) => { const d = describeReviewItem(i); return `<article class="row-line-col"><p><strong>${esc(d.title)}</strong><br><span class="muted small">Nguồn: ${i.kind === "exercise" ? "câu làm sai" : i.kind === "dictation" ? "nghe–viết làm sai" : "tự đánh giá"} · đã ôn/làm ${i.attempts} lần · hạn ôn: ${esc(new Date(i.dueAt).toLocaleDateString("vi-VN"))}</span></p>
    <span class="row-actions"><a class="btn" href="${esc(d.href)}">Làm lại tại bài</a>
    ${d.grammarId ? `<a class="btn ghost" href="#/grammar/${esc(d.grammarId)}?return=exercises">Xem giải thích</a>` : ""}
    ${[["forgot", "Chưa nhớ"], ["slow", "Còn chậm"], ["known", "Nhớ"]].map(([k, label]) => `<button class="btn small" data-review-rate="${esc(i.key)}:${k}">${label}</button>`).join("")}</span></article>`; }).join("")}
    <details class="info-fold"><summary>Cách tính lịch ôn</summary><p class="muted small">Lịch ôn đề xuất của sản phẩm: 1, 3, 7, 14, 30 ngày; trả lời sai quay về 1 ngày.</p></details></section>`
  : `<section class="card"><h2>Chưa có mục đến hạn</h2><p class="muted">Làm bài tập hoặc tự đánh giá một bài nghe–viết để tạo mục ôn. Lịch ôn chỉ tính từ thao tác học thật, không tạo dữ liệu mẫu.</p></section>`}
  ${upcoming.length ? `<section class="card"><h2>Sắp đến hạn</h2>${upcoming.map((i) => { const d = describeReviewItem(i); return `<p class="row-line"><span>${esc(d.title)}</span><span class="tag">${esc(new Date(i.dueAt).toLocaleDateString("vi-VN"))}</span></p>`; }).join("")}</section>` : ""}`;
  bindSupportBar();
  $$("[data-review-rate]").forEach((b) => b.onclick = () => {
    const [key, rating] = b.dataset.reviewRate.split(":");
    update((pp) => {
      const prev = pp.reviewItems[key]; if (!prev) return;
      const sched = nextReviewState(prev, rating, Date.now());
      pp.reviewItems[key] = { ...prev, ...sched, lastResult: rating === "known" ? "correct" : "wrong", attempts: prev.attempts + 1 };
    });
    render();
  });
}

function viewProgress() {
  navActive();
  const p = loadProgress();
  const rs = readyLessons();
  main.innerHTML = `${header("Tiến độ", "“Đã học” và “đã nắm vững” là hai việc khác nhau")}
  ${rs.map((lesson) => { const c = contentFor(lesson.id); const st = lessonState(lesson.id); const set = c.exerciseSet;
    const sum = summarizeAttempts(p.attempts, set.items.map((i) => i.id));
    const selfDone = c.selfCheckTasks.filter((t) => p.selfChecks[t.id]).length;
    return `<section class="card"><h2>${esc(lesson.level)} · Bài ${lesson.lessonNumber}: ${esc(lesson.titleZh)}</h2>
  <p>Mục đã hoàn thành: <strong>${st.completedSections.length}/${c.intro.sections.length}</strong> — đây là mức “đã học/đã xem”.</p>
  <p>Bài tập chấm tự động: đã trả lời ${sum.answered}/${set.items.length} câu; điểm lần đầu <strong>${sum.firstCorrect}/${sum.firstTotal}</strong>; làm lại ${sum.retried} câu; dùng gợi ý ${sum.hintUsedCount} câu; dùng Pinyin/Nghĩa hỗ trợ ${sum.supportUsedCount || 0} câu.</p>
  ${c.suppExerciseSet ? (() => { const ss = summarizeAttempts(p.attempts, c.suppExerciseSet.items.map((i) => i.id)); return `<p>Đề mô phỏng của sách: đã trả lời ${ss.answered}/${c.suppExerciseSet.items.length} câu; điểm lần đầu <strong>${ss.firstCorrect}/${ss.firstTotal}</strong>.</p>`; })() : ""}
  <p>Bài nghe–viết: ${selfDone}/${c.selfCheckTasks.length} bài đã tự đánh giá mức nhớ; điểm chấm tự động (đáp án đã đối chiếu) xem ở mục Tổng kết của bài và ngay trong phần Luyện tập.</p>
  <p class="row-actions"><a class="btn" href="#/lesson/${lesson.id}">Mở Bài ${lesson.lessonNumber}</a></p></section>`; }).join("")}
  <section class="card"><h2>Tổng quan</h2>
  <p>Mục ôn đang theo dõi: ${Object.keys(p.reviewItems).length}.</p>
  <p class="muted">Các bài còn lại của HSK 1 mới ở mức mục lục đã kiểm chứng; chưa có tiến độ vì chưa mở bài học.</p>
  <a class="btn" href="#/course/HSK%201">Xem lộ trình</a></section>`;
}

function viewSettings() {
  navActive();
  const s = settings();
  main.innerHTML = `${header("Cài đặt", "Cài đặt được lưu trên thiết bị này, không cần tài khoản")}
  <section class="card"><h2>Hiển thị</h2>
  <label class="switch-row"><input type="checkbox" data-setting="showPinyinPrep" ${s.showPinyinPrep ? "checked" : ""}> Hiện Pinyin ở phần Chuẩn bị (thẻ từ)</label>
  <label class="switch-row"><input type="checkbox" data-setting="showViPrep" ${s.showViPrep ? "checked" : ""}> Hiện nghĩa ở phần Chuẩn bị (thẻ từ)</label>
  <label class="switch-row"><input type="checkbox" data-setting="showHanVietPrep" ${s.showHanVietPrep ? "checked" : ""}> Hiện âm Hán–Việt ở thẻ từ (mặc định tắt)</label>
  <label class="switch-row"><input type="checkbox" data-setting="showPinyinSentences" ${s.showPinyinSentences ? "checked" : ""}> Hiện Pinyin ở câu trong bài đọc</label>
  <label class="switch-row"><input type="checkbox" data-setting="showViSentences" ${s.showViSentences ? "checked" : ""}> Hiện nghĩa Việt ở câu trong bài đọc</label>
  <label class="switch-row"><input type="checkbox" data-setting="showPinyinExercises" ${s.showPinyinExercises ? "checked" : ""}> Hiện Pinyin ở Luyện tập (được ghi là có hỗ trợ khi đang làm bài)</label>
  <label class="switch-row"><input type="checkbox" data-setting="showViExercises" ${s.showViExercises ? "checked" : ""}> Hiện nghĩa ở Luyện tập (được ghi là có hỗ trợ khi đang làm bài)</label>
  <label class="switch-row">Cỡ chữ <select data-setting-select="fontScale">
    ${[1, 1.15, 1.3].map((v) => `<option value="${v}" ${String(s.fontScale) === String(v) ? "selected" : ""}>${v === 1 ? "Thường" : v === 1.15 ? "Lớn" : "Rất lớn"}</option>`).join("")}</select></label>
  <label class="switch-row">Tốc độ phát mặc định <select id="rate-setting">
    ${[0.75, 1, 1.25].map((v) => `<option value="${v}" ${String(s.playbackRate) === String(v) ? "selected" : ""}>${v}×</option>`).join("")}</select></label>
  <p class="muted small">Các công tắc Pinyin/nghĩa/Hán–Việt hoạt động độc lập với nhau và được nhớ cho lần học sau. Nghĩa chỉ ẩn bản dịch của từ/câu, không ẩn hướng dẫn hay phản hồi đúng/sai.</p></section>
  <section class="card"><h2>Sao lưu tiến độ</h2>
  <p class="muted">Xuất bản sao lưu JSON (có schemaVersion) để chuyển máy hoặc khôi phục. Khi nhập, app kiểm tra dữ liệu, cho xem tóm tắt trước, và tự giữ một bản sao của tiến độ hiện tại trước khi ghi đè.</p>
  <p class="row-actions"><button class="btn" id="export-btn">Xuất bản sao lưu</button>
  <label class="btn ghost" for="import-file">Nhập bản sao lưu…</label>
  <input id="import-file" type="file" accept="application/json" class="hidden"></p>
  <div id="import-preview"></div>
  <div id="export-out"></div></section>
  <section class="card"><h2>Giới thiệu</h2>
  <p>HSK 3.0 · Ngữ pháp tiếng Trung — ứng dụng học theo giáo trình HSK 3.0 với nguồn học liệu duy nhất từ Baulchino. Tiếng Việt trong app là bản dịch/chú giải biên tập, không phải bản dịch chính thức. Phiên bản dữ liệu: ${esc(CONTENT.contentVersion)}.</p>
  <p class="row-actions"><a class="btn" href="#/sources">Nguồn và kiểm chứng</a><a class="btn" href="#/progress">Tiến độ học</a></p></section>`;
  $$("[data-setting]").forEach((el) => el.addEventListener("change", () => { update((p) => { p.settings[el.dataset.setting] = el.checked; }); }));
  $$("[data-setting-select]").forEach((el) => el.addEventListener("change", () => { update((p) => { p.settings[el.dataset.settingSelect] = Number(el.value); }); applyFontScale(); }));
  $("#rate-setting").onchange = (e) => { update((p) => { p.settings.playbackRate = Number(e.target.value); }); player.setRate(Number(e.target.value)); };
  $("#export-btn").onclick = () => {
    const blob = new Blob([exportProgressJson()], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob); a.download = "hsk30-backup.json"; a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 2000);
    $("#export-out").innerHTML = `<p class="muted">Đã tạo file hsk30-backup.json.</p>`;
  };
  $("#import-file").onchange = async (e) => {
    const file = e.target.files[0]; if (!file) return;
    const text = await file.text();
    const preview = summarizeForPreview(text);
    const box = $("#import-preview");
    if (!preview) { box.innerHTML = `<p class="feedback bad">File không hợp lệ (sai định dạng hoặc schemaVersion). Chưa có gì bị ghi đè.</p>`; return; }
    box.innerHTML = `<p>Xem trước: ${preview.lessonsTouched} bài có tiến độ · ${preview.attempts} lần làm bài · ${preview.reviewItems} mục ôn · ${preview.selfChecks} bài tự đánh giá.</p>
    <button class="btn primary" id="confirm-import">Ghi đè bằng bản sao lưu này</button>`;
    $("#confirm-import").onclick = () => {
      const res = importProgressJson(text);
      box.innerHTML = res.ok ? `<p class="feedback ok">Đã nhập xong. Tiến độ trước khi nhập đã được giữ lại trong bộ nhớ của trình duyệt.</p>` : `<p class="feedback bad">${esc(res.errors.join(" "))}</p>`;
      saveProgress();
    };
  };
}

function viewSources(id) {
  navActive();
  if (id) {
    const src = sourceById(id);
    if (!src) { main.innerHTML = `<section class="card"><h1>Không tìm thấy nguồn</h1></section>`; return; }
    main.innerHTML = `${header("Nguồn", src.title)}
    <section class="card">
      <p><strong>Loại:</strong> ${esc(src.kind)} · <strong>Ngày kiểm chứng:</strong> ${esc(src.retrievedAt)}</p>
      <p><strong>Quyền sử dụng:</strong> ${esc(src.rightsStatus)}${src.rightsEvidence ? ` — ${esc(src.rightsEvidence)}` : ""}</p>
      <p><strong>Trạng thái kiểm chứng:</strong> ${esc(src.verification)}</p>
      <p class="row-actions"><a class="btn primary" href="${esc(src.url)}" target="_blank" rel="noopener">Mở nguồn</a>
      <a class="btn ghost" href="#/sources">Tất cả nguồn</a></p>
      <p class="muted small">App không lưu PDF/MP3. Một số hình trích nhỏ dùng cho ngữ cảnh và bài tập có ghi nguồn; quyền đối với sách và hình vẫn thuộc chủ sở hữu.</p>
    </section>`;
    return;
  }
  main.innerHTML = `${header("Nguồn học liệu", "Mọi nội dung trong app truy về các nguồn này")}
  ${CONTENT.sources.map((s) => `<article class="row-card"><div class="grow"><h2>${esc(s.title)}</h2>
    <p class="muted">${esc(s.kind)} · quyền: ${esc(s.rightsStatus)} · kiểm chứng: ${esc(s.retrievedAt)}</p>
    <p>${esc(s.verification)}</p></div><a class="btn" href="#/sources/${esc(s.id)}">Chi tiết</a></article>`).join("")}`;
}

// ---------- Section binding, mini player, boot ----------
function bindSection(sectionId, content) {
  content = content || contentFor(continueLesson().id) || CONTENT.pilot;
  if (sectionId === "knowledge") bindKnowledge();
  else if (sectionId === "prep") bindPrep(content);
  else if (sectionId === "apply") bindSupportBar();
  if (sectionId === "reader") bindReader(content);
  if (sectionId === "exercises") bindExercises(content);
  if (sectionId === "apply") {
    $$("[data-speak-done]").forEach((b) => b.onclick = () => {
      update((pp) => { pp.speakingDone ||= {}; if (pp.speakingDone[b.dataset.speakDone]) delete pp.speakingDone[b.dataset.speakDone]; else pp.speakingDone[b.dataset.speakDone] = new Date().toISOString(); });
      render();
    });
    $$("[data-play]").forEach((b) => b.onclick = () => {
      const track = content.reader.audioTracks.find((t) => t.id === b.dataset.play);
      if (track) player.playTrack(track, { rate: settings().playbackRate });
    });
    $$("[data-seek]").forEach((el) => el.onchange = () => player.seek(Number(el.value)));
    $$("[data-rate]").forEach((el) => el.onchange = () => { update((p) => { p.settings.playbackRate = Number(el.value); }); player.setRate(Number(el.value)); });
    $$("[data-repeat]").forEach((b) => b.onclick = () => player.seek(0));
    sectionUnsubscribe = player.subscribe(() => { renderMini(); });
  }
}
let miniKey = '';
let miniCollapsed = false;
let miniDismissedTrack = null;
// Measure the fixed layers (mini player, bottom nav, sticky lesson nav)
// and publish their real heights as CSS variables, so page padding and the
// lesson nav offset always match the actual chrome — on expand/collapse,
// rotation and font-size changes alike. No fixed bottom guesses.
function syncChromeInsets() {
  const run = () => {
    try {
      const root = document.documentElement;
      const miniEl = document.getElementById("miniplayer");
      const miniH = miniEl && !miniEl.classList.contains("hidden") ? miniEl.offsetHeight : 0;
      const bottomNav = document.getElementById("bottomnav");
      const view = document.defaultView;
      const navVisible = bottomNav && view && view.getComputedStyle(bottomNav).display !== "none" && !document.body.classList.contains("studying");
      const navH = navVisible ? bottomNav.offsetHeight : 0;
      const lessonNav = document.querySelector(".lesson-nav");
      const lessonNavH = document.body.classList.contains("studying") && lessonNav ? lessonNav.offsetHeight : 0;
      root.style.setProperty("--mini-h", `${miniH}px`);
      root.style.setProperty("--mini-bottom", `${Math.max(navH, lessonNavH)}px`);
      root.style.setProperty("--chrome-bottom", `${miniH + Math.max(navH, lessonNavH)}px`);
    } catch { /* layout measurement is best-effort; CSS defaults still apply */ }
  };
  if (typeof requestAnimationFrame === "function") requestAnimationFrame(run); else run();
}
function renderMini() {
  const st = player.getState();
  // A dismissal lasts until the track changes or the learner deliberately
  // starts playback again (close pauses first, so playing=true afterwards
  // can only come from a fresh, explicit play action).
  if (miniDismissedTrack === st.trackId && st.playing) miniDismissedTrack = null;
  if (!st.trackId || miniDismissedTrack === st.trackId) {
    if (!st.trackId) { mini.innerHTML = ""; mini.classList.add("hidden"); miniKey = ""; syncChromeInsets(); return; }
    mini.innerHTML = ""; mini.classList.add("hidden"); syncChromeInsets(); return;
  }
  const key=`${st.trackId}|${st.playing}|${st.error}|${Math.floor(st.duration)}|${miniCollapsed}`;
  if (key===miniKey && $("#mini-time")) { const t=$("#mini-time"); if (t) t.textContent=`${player.fmtTime(st.currentTime)} / ${player.fmtTime(st.duration)}`; return; }
  miniKey=key;
  mini.classList.remove("hidden");
  mini.classList.toggle("mini-collapsed", miniCollapsed);
  const label = st.label || "Audio";
  mini.innerHTML = `<button class="btn small" id="mini-toggle" aria-label="${st.playing ? "Tạm dừng" : "Phát"}">${st.playing ? "❚❚" : "▶"}</button>
    <span class="mini-label" title="${esc(label)}">${esc(label)}</span>
    ${miniCollapsed ? "" : `<span class="muted small" id="mini-time">${player.fmtTime(st.currentTime)} / ${player.fmtTime(st.duration)}</span>`}
    ${st.error ? `<span class="mini-error">${esc(st.error)}</span>` : ""}
    <button class="btn small ghost" id="mini-collapse" aria-expanded="${!miniCollapsed}" aria-label="${miniCollapsed ? "Mở rộng trình phát" : "Thu gọn trình phát"}">${miniCollapsed ? "▴" : "▾"}</button>
    <button class="btn small ghost" id="mini-close" aria-label="Đóng trình phát">✕</button>${st.error?`<a href="https://www.baulchino.com/new-hsk-audios-2026" target="_blank" rel="noopener">Mở nguồn ↗</a>`:""}`;
  $("#mini-toggle").onclick = () => {
    const track = allTracks().find((t) => t.id === st.trackId);
    if (track) player.playTrack(track, { rate: settings().playbackRate });
  };
  $("#mini-collapse").onclick = () => { miniCollapsed = !miniCollapsed; miniKey = ""; renderMini(); syncChromeInsets(); };
  $("#mini-close").onclick = () => { miniDismissedTrack = st.trackId; player.pause(); miniKey = ""; renderMini(); syncChromeInsets(); };
  syncChromeInsets();
}
player.subscribe(renderMini);

// Speaker buttons: one delegated handler so every [data-speak] button in
// any view behaves the same. A click never selects an answer, opens a card
// or changes progress — it only plays (or pauses) that unit's own segment.
// Starting another unit replaces the current segment (single audio element).
main.addEventListener("click", (e) => {
  const b = e.target.closest("[data-speak]");
  if (!b) return;
  e.preventDefault(); e.stopPropagation();
  const track = allTracks().find((t) => t.id === b.dataset.track);
  if (!track) return;
  const st = player.getState();
  if (st.playing && st.segment && st.segment.trackId === track.id && Math.abs(st.segment.start - Number(b.dataset.start)) < 0.01) { player.pause(); return; }
  b.classList.add("loading");
  player.playSegment(track, { start: Number(b.dataset.start), end: Number(b.dataset.end), rate: settings().playbackRate });
});
main.addEventListener("click", (e) => {
  const b = e.target.closest("[data-tts]");
  if (!b) return;
  e.preventDefault(); e.stopPropagation();
  player.speakText(b.dataset.tts);
});
player.subscribe((st) => {
  $$("[data-speak]").forEach((b) => {
    const active = st.segment && st.segment.trackId === b.dataset.track && Math.abs(st.segment.start - Number(b.dataset.start)) < 0.01;
    b.classList.toggle("playing", !!(active && st.playing));
    if (!active || st.playing) b.classList.remove("loading");
    b.classList.toggle("load-error", !!(active && st.error));
  });
});

async function boot() {
  applyFontScale();
  try {
    const res = await fetch("data/content.json", { cache: "no-cache" });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    CONTENT = await res.json();
    update(p=>{
      for (const c of [CONTENT.pilot, ...(CONTENT.additionalLessons || [])]) {
        for (const task of c.selfCheckTasks || []) {
          if (!task.conflictCells?.length) continue;
          const e = p.dictation?.[task.id];
          if (e) { for (const idx of task.conflictCells) { if (e.first) delete e.first[idx]; if (e.last) delete e.last[idx]; } }
          for (const idx of task.conflictCells) delete p.reviewItems[`dict-${task.id}:${idx}`];
        }
      }
    });
    update(p=>{if(p.learningRevision !== 'textbook-pilot-v2'){
      const retired=new Set(CONTENT.editorialAudit?.retiredExerciseIds||[]);
      p.archivedReviewItems ||= {};
      for(const [key,item] of Object.entries(p.reviewItems)){if(retired.has(item.sourceItemId)){p.archivedReviewItems[key]=item;delete p.reviewItems[key];}}
      const l=p.lessons[CONTENT.pilot.lessonId];
      if(l){p.previousContentProgress ||= [];p.previousContentProgress.push({version:p.contentRevision||'v1',lesson:JSON.parse(JSON.stringify(l))});l.completedSections=[];l.lastSectionId='intro';}
      p.exerciseSession=null;p.contentRevision=CONTENT.contentVersion;p.learningRevision='textbook-pilot-v2';
    }});
  } catch (e) {
    loadError = "Chưa tải được dữ liệu bài học (có thể do mạng). Tiến độ đã lưu của bạn vẫn còn nguyên.";
  }
  render();
}
window.addEventListener("hashchange", render);
window.addEventListener("resize", syncChromeInsets);
boot();
