// HSK 3.0 · Ngữ pháp tiếng Trung — pilot app (static, no build step).
// All learning content comes from data/content.json, whose items carry
// sourceRefs back to Baulchino / the printed Workbook. Nothing is invented.
import { gradeChoice, matchesQuery, nextReviewState, isDue, summarizeAttempts, REVIEW_INTERVALS_DAYS } from "./lib.js";
import { loadProgress, saveProgress, update, exportProgressJson, importProgressJson, summarizeForPreview } from "./store.js";
import * as player from "./player.js";

const main = document.getElementById("main");
const mini = document.getElementById("miniplayer");
let CONTENT = null;
let loadError = null;

const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

function sourceById(id) { return CONTENT.sources.find((s) => s.id === id); }
function lessonById(id) { return CONTENT.lessons.find((l) => l.id === id); }
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
  if (!refs || !refs.length) return "";
  return `<p class="refs">Nguồn: ${refs.map(refText).join(" · ")}</p>`;
}
function settings() { return loadProgress().settings; }

function markSectionDone(lessonId, sectionId) {
  update((p) => {
    const l = (p.lessons[lessonId] ||= { completedSections: [], lastSectionId: null, updatedAt: null });
    if (!l.completedSections.includes(sectionId)) l.completedSections.push(sectionId);
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

function render() {
  if (loadError) {
    main.innerHTML = `<section class="card error-card"><h1>Không tải được dữ liệu</h1>
      <p>${esc(loadError)}</p><button class="btn primary" id="retry">Thử lại</button></section>`;
    $("#retry").onclick = () => location.reload();
    return;
  }
  if (!CONTENT) { main.innerHTML = `<p class="loading">Đang tải dữ liệu bài học…</p>`; return; }
  const { seg, query } = parseRoute();
  const page = seg[0] || "today";
  window.scrollTo(0, 0);
  if (page === "today") return viewToday();
  if (page === "course") return viewCourse(seg[1]);
  if (page === "lesson") return viewLesson(seg[1], seg[2], query);
  if (page === "grammar") return viewGrammar(seg[1]);
  if (page === "reader") { const l = CONTENT.pilot.lessonId; return go(`#/lesson/${l}/reader`); }
  if (page === "exercise") { const l = CONTENT.pilot.lessonId; return go(`#/lesson/${l}/exercises`); }
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
  $$("[data-nav]").forEach((a) => a.classList.toggle("active", a.dataset.nav === page));
}

// ---------- Today ----------
function viewToday() {
  navActive();
  const p = loadProgress();
  const pilot = lessonById(CONTENT.pilot.lessonId);
  const st = lessonState(pilot.id);
  const due = Object.values(p.reviewItems).filter((i) => isDue(i, Date.now()));
  const wrongCount = Object.values(p.reviewItems).filter((i) => i.lastResult === "wrong").length;
  const weekStart = Date.now() - 7 * 86400000;
  const weekSessions = p.sessions.filter((s) => new Date(s.date).getTime() >= weekStart);
  const weekMinutes = weekSessions.reduce((a, s) => a + s.minutes, 0);
  const nextSection = CONTENT.pilot.intro.sections.find((s) => !st.completedSections.includes(s.id));
  const continueLabel = st.completedSections.length === 0 ? "Bắt đầu HSK 1 · Bài 1" :
    nextSection ? `Tiếp tục: ${nextSection.titleVi}` : "Xem lại Bài 1";
  const targetSection = nextSection ? nextSection.id : "intro";
  main.innerHTML = `
  ${header("Hôm nay", "Học ngữ pháp tiếng Trung theo giáo trình HSK 3.0 (nguồn: Baulchino)")}
  <section class="card hero">
    <p class="kicker">Tiếp tục học</p>
    <h2>${esc(pilot.level)} · Bài ${pilot.lessonNumber}: ${esc(pilot.titleZh)}</h2>
    <p>${esc(pilot.titleVi)} — ${esc(pilot.publicationNote)}</p>
    <p class="muted">Đã hoàn thành ${st.completedSections.length}/${CONTENT.pilot.intro.sections.length} mục của bài pilot.</p>
    <a class="btn primary big" href="#/lesson/${pilot.id}/${targetSection}">${esc(continueLabel)}</a>
  </section>
  <section class="card">
    <h2>Ôn tập</h2>
    ${due.length || wrongCount ? `<p>Có <strong>${due.length}</strong> mục đến hạn ôn và <strong>${wrongCount}</strong> mục từng làm sai.</p><a class="btn" href="#/review">Vào ôn tập</a>`
      : `<p class="muted">Chưa có mục nào đến hạn. Khi bạn làm sai một câu hoặc tự đánh giá “chưa nhớ”, mục đó sẽ xuất hiện ở đây theo lịch 1–3–7–14–30 ngày.</p>`}
  </section>
  <section class="card">
    <h2>Tiến độ tuần này</h2>
    <p><strong>${weekSessions.length}</strong> phiên học · khoảng <strong>${weekMinutes}</strong> phút học tích cực (ước tính từ các mục đã hoàn thành, không tính thời gian mở tab).</p>
    <a class="btn" href="#/progress">Xem tiến độ chi tiết</a>
  </section>
  <section class="card">
    <h2>Tra một cấu trúc</h2>
    <form id="qform"><label class="sr" for="q">Tìm cấu trúc, từ khóa hoặc Pinyin</label>
    <input id="q" type="search" placeholder="Ví dụ: thanh điệu, er, 你好…" autocomplete="off">
    <button class="btn" type="submit">Tra cứu</button></form>
  </section>
  <section class="card warn">
    <h2>Phạm vi bản pilot</h2>
    <p>Bản này là <strong>pilot nội dung sách bài tập + liên kết nguồn</strong>: mới có Bài 1 HSK 1 (sách bài tập) được kiểm chứng trực quan từ bản in. Nội dung sách giáo khoa (Textbook) chưa đọc được trong lượt kiểm chứng đầu, nên chưa đưa vào app. Quyền tái xuất bản sách/audio chưa có bằng chứng — app chỉ liên kết và phát trực tiếp từ nguồn, không sao chép sách/MP3.</p>
    <a class="btn" href="#/sources">Xem nguồn và trạng thái kiểm chứng</a>
  </section>`;
  $("#qform").onsubmit = (e) => { e.preventDefault(); go(`#/grammar?q=${encodeURIComponent($("#q").value)}`); };
}

// ---------- Course ----------
function viewCourse(level) {
  navActive();
  if (!level) {
    main.innerHTML = `${header("Lộ trình", "Chọn cấp theo danh mục sách HSK 3.0 trên Baulchino")}
    ${CONTENT.books.map((b) => `
      <article class="row-card">
        <div><h2>${esc(b.level)} · ${esc(b.kind)}</h2><p>${esc(b.titleEn)}</p><p class="muted">${esc(b.noteVi)}</p></div>
        ${b.level === "HSK 1" && b.kind === "Workbook" ? `<a class="btn" href="#/course/HSK%201">Xem 15 bài</a>` : `<a class="btn ghost" href="#/sources/${esc(b.sourceId)}">Nguồn</a>`}
      </article>`).join("")}
    <p class="muted">Các cấp HSK 2–4 hiện mới kiểm chứng ở mức danh mục (tên quyển + liên kết), chưa đọc mục lục từng bài nên chưa hiển thị danh sách bài.</p>`;
    return;
  }
  main.innerHTML = `${header("HSK 1 · Sách bài tập (Workbook)", "15 bài theo mục lục in của sách bài tập. Tên bài của sách giáo khoa chưa được đọc trực tiếp nên chưa khẳng định trùng khớp.")}
  ${CONTENT.lessons.map((l) => {
    const st = lessonState(l.id);
    const learnStatus = st.completedSections.length >= 7 ? "Đã học" : st.completedSections.length ? "Đang học" : "Chưa học";
    return `<article class="row-card">
      <div class="lesson-num">${l.lessonNumber}</div>
      <div class="grow"><h2>${esc(l.titleZh)}</h2><p>${esc(l.titleVi)}</p>
      <p class="muted">Trang in ${String(l.sourceRefs[0].printedPage).padStart(3, "0")} · Audio: ${l.textbookAudioTrackCount} track sách giáo khoa, ${l.workbookAudioTrackCount} track sách bài tập</p>
      <p class="tags"><span class="tag">Xuất bản: ${l.publicationStatus === "pilot-ready" ? "Sẵn sàng (pilot)" : "Đang kiểm tra"}</span><span class="tag">Học: ${learnStatus}</span></p></div>
      ${l.publicationStatus === "pilot-ready" ? `<a class="btn primary" href="#/lesson/${l.id}">Học</a>` : `<span class="muted small">Chưa đủ nguồn đã kiểm chứng để mở bài học</span>`}
    </article>`;
  }).join("")}`;
}

// ---------- Lesson ----------
function viewLesson(lessonId, sectionId, query) {
  navActive();
  const lesson = lessonById(lessonId);
  if (!lesson) { main.innerHTML = `<section class="card"><h1>Không tìm thấy bài</h1><a class="btn" href="#/course/HSK%201">Về lộ trình</a></section>`; return; }
  if (lesson.publicationStatus !== "pilot-ready") {
    main.innerHTML = `${header(`Bài ${lesson.lessonNumber}: ${lesson.titleZh}`, lesson.titleVi)}
    <section class="card warn"><h2>Bài đang kiểm tra nguồn</h2><p>${esc(lesson.publicationNote)}</p>${refsHtml(lesson.sourceRefs)}
    <p><a class="btn" href="#/sources/src-baul-books">Mở trang sách Baulchino</a> <a class="btn ghost" href="#/course/HSK%201">Quay lại lộ trình</a></p></section>`;
    return;
  }
  if (!sectionId) return viewLessonIntro(lesson);
  const sections = CONTENT.pilot.intro.sections;
  const idx = sections.findIndex((s) => s.id === sectionId);
  if (idx === -1) return viewLessonIntro(lesson);
  const prev = sections[idx - 1]; const next = sections[idx + 1];
  let body = "";
  if (sectionId === "intro") body = sectionIntroHtml(lesson, true);
  if (sectionId === "prep") body = sectionPrepHtml();
  if (sectionId === "knowledge") body = sectionKnowledgeHtml(query);
  if (sectionId === "reader") body = sectionReaderHtml();
  if (sectionId === "exercises") body = sectionExercisesHtml();
  if (sectionId === "apply") body = sectionApplyHtml();
  if (sectionId === "summary") body = sectionSummaryHtml(lesson);
  main.innerHTML = `
  <div class="lesson-top"><a class="btn ghost" href="#/lesson/${lesson.id}">← Thoát về bài</a>
  <span class="muted">Mục ${idx + 1}/${sections.length}: ${esc(sections[idx].titleVi)}</span></div>
  ${body}
  <div class="lesson-nav">
    ${prev ? `<a class="btn" href="#/lesson/${lesson.id}/${prev.id}">← Trước</a>` : "<span></span>"}
    <button class="btn" id="done-btn">Đánh dấu đã xong mục này</button>
    ${next ? `<a class="btn primary" href="#/lesson/${lesson.id}/${next.id}">Tiếp tục →</a>` : `<a class="btn primary" href="#/today">Về Hôm nay</a>`}
  </div>`;
  $("#done-btn").onclick = () => { markSectionDone(lesson.id, sectionId); render(); };
  bindSection(sectionId);
}

function viewLessonIntro(lesson) {
  const st = lessonState(lesson.id);
  main.innerHTML = `${header(`HSK 1 · Bài ${lesson.lessonNumber}`, lesson.titleVi)}
  ${sectionIntroHtml(lesson, false)}
  <section class="card"><h2>Các mục cần học</h2>
  ${CONTENT.pilot.intro.sections.map((s) => `<p class="row-line"><a href="#/lesson/${lesson.id}/${s.id}">${esc(s.titleVi)}</a><span class="tag">${st.completedSections.includes(s.id) ? "Đã xong" : "Chưa học"}</span></p>`).join("")}
  <a class="btn primary big" href="#/lesson/${lesson.id}/${st.lastSectionId || "intro"}">${st.completedSections.length ? "Tiếp tục học" : "Bắt đầu"}</a></section>`;
  bindSection("intro");
}

function sectionIntroHtml(lesson, inSection) {
  const pilot = CONTENT.pilot;
  return `<section class="card">
    ${inSection ? "" : ""}
    <h2>${esc(lesson.titleZh)} <span class="muted">${esc(lesson.titleEn)}</span></h2>
    <p><strong>Mục tiêu:</strong> ${esc(pilot.intro.goalVi)}</p>
    <p class="muted">Thời lượng ước tính: khoảng ${pilot.intro.estimatedMinutes} phút (sẽ hiệu chỉnh sau khi bạn học thử). Bài nguồn: sách bài tập HSK 1, Bài 1 — phần “Xiaoyu's Classroom” tập trung vào phát âm nền tảng, chưa phải bài ngữ pháp câu của sách giáo khoa.</p>
    ${refsHtml(lesson.sourceRefs)}
    <p class="muted">${esc(lesson.titleProvenance)}</p>
    <p><a class="btn" href="#/sources/src-hsk1-workbook-pdf">Xem nguồn của bài</a></p>
  </section>`;
}

// ---------- Lesson sections ----------
function togglesHtml(scope) {
  const s = settings();
  const pinyinKey = scope === "prep" ? "showPinyinPrep" : "showPinyinSentences";
  return `<div class="toggles" role="group" aria-label="Tùy chọn hiển thị">
    <label><input type="checkbox" data-setting="${pinyinKey}" ${s[pinyinKey] ? "checked" : ""}> Pinyin</label>
    ${scope === "sentences" ? `<label><input type="checkbox" data-setting="showViSentences" ${s.showViSentences ? "checked" : ""}> Nghĩa Việt</label>` : ""}
    <label>Cỡ chữ <select data-setting-select="fontScale">
      ${[1, 1.15, 1.3].map((v) => `<option value="${v}" ${String(s.fontScale) === String(v) ? "selected" : ""}>${v === 1 ? "Thường" : v === 1.15 ? "Lớn" : "Rất lớn"}</option>`).join("")}
    </select></label>
  </div>`;
}
function bindToggles() {
  $$("[data-setting]").forEach((el) => el.addEventListener("change", () => {
    update((p) => { p.settings[el.dataset.setting] = el.checked; }); render();
  }));
  $$("[data-setting-select]").forEach((el) => el.addEventListener("change", () => {
    update((p) => { p.settings[el.dataset.settingSelect] = Number(el.value); }); applyFontScale(); render();
  }));
}
function applyFontScale() { document.documentElement.style.setProperty("--font-scale", String(settings().fontScale || 1)); }

function sectionPrepHtml() {
  const s = settings();
  return `<section class="card"><h2>Chuẩn bị: thẻ từ của bài</h2>
  <p class="muted">Tám thẻ từ kèm hình in ở trang 001–002 của sách bài tập (phần nghe và đọc lại theo audio track 1-1). Nghĩa Việt là chú giải biên tập. Chạm nút phát ở mục Đọc/nghe để nghe cả track — sách không gắn audio riêng cho từng thẻ từ nên app không gán.</p>
  ${togglesHtml("prep")}
  <div class="word-grid">
  ${CONTENT.pilot.prepWords.map((w) => `<article class="word-card">
    ${s.showPinyinPrep ? `<div class="pinyin">${esc(w.pinyin)}</div>` : ""}
    <div class="zh">${esc(w.zh)}</div><div class="vi">${esc(w.vi)}</div>
  </article>`).join("")}
  </div>${refsHtml(CONTENT.pilot.prepWords[0].sourceRefs)}</section>`;
}

function knowledgeCardHtml(kp, { linkBack = null } = {}) {
  return `<article class="card grammar-card" id="${esc(kp.id)}">
    <p class="kicker">${esc(kp.kindLabel)}</p>
    <h2>${esc(kp.title)}</h2>
    <h3>Dùng để làm gì?</h3><p>${esc(kp.explanationVi)}</p>
    <h3>Mẫu</h3><p class="pattern">${esc(kp.pattern)}</p>
    <h3>Ví dụ trong sách</h3>
    ${kp.examples.map((e) => `<p class="example"><span class="zh-inline">${esc(e.zh)}</span> <span class="pinyin">${esc(e.pinyin)}</span><br><span class="muted">${esc(e.noteVi)}</span></p>`).join("")}
    <h3>Đặt ở đâu / xem ở đâu?</h3><p>${esc(kp.positionVi)}</p>
    ${refsHtml(kp.sourceRefs)}
    <p class="row-actions">
      <a class="btn" href="#/lesson/${CONTENT.pilot.lessonId}/reader">Dùng trong bài này: Đọc/nghe</a>
      <a class="btn" href="#/lesson/${CONTENT.pilot.lessonId}/exercises">Luyện tập</a>
      ${linkBack ? `<a class="btn primary" href="${esc(linkBack)}">Quay lại câu đang làm</a>` : ""}
    </p></article>`;
}
function sectionKnowledgeHtml() {
  return `${CONTENT.pilot.knowledgePoints.map((kp) => knowledgeCardHtml(kp)).join("")}
  <section class="card warn"><h2>Về “ngữ pháp” của bài này</h2>
  <p>Bài 1 của sách bài tập là bài nền phát âm (âm tiết, thanh mẫu/vận mẫu, thanh điệu) — các điểm ở trên được ghi đúng vai trò đó, không gọi là ngữ pháp câu. Điểm ngữ pháp câu của sách giáo khoa Bài 1 chưa được kiểm chứng vì chưa đọc được Textbook; khi đọc được, điểm ngữ pháp sẽ được gắn vào đúng câu nguồn tại đây.</p></section>`;
}

function trackRowHtml(track) {
  const st = player.getState();
  const isCurrent = st.trackId === track.id;
  return `<article class="track-row" data-track="${esc(track.id)}">
    <button class="play-btn" data-play="${esc(track.id)}" aria-label="${isCurrent && st.playing ? "Tạm dừng" : "Phát"} ${esc(track.label)}">${isCurrent && st.playing ? "⏸" : "▶"}</button>
    <div class="grow"><strong>${esc(track.label)}</strong>
    <p class="muted small">${esc(track.bookRef)} · Thời lượng ${player.fmtTime(track.durationSec)} (đo từ file nguồn)</p>
    <p class="muted small">${esc(track.playbackVerified)}</p>
    ${isCurrent ? `<div class="seekrow"><span data-cur>${player.fmtTime(st.currentTime)}</span>
      <input type="range" min="0" max="${Math.floor(st.duration || track.durationSec)}" step="1" value="${Math.floor(st.currentTime)}" data-seek aria-label="Tua audio">
      <span>${player.fmtTime(st.duration || track.durationSec)}</span></div>
    <div class="row-actions"><label>Tốc độ <select data-rate>
      ${[0.75, 1, 1.25].map((r) => `<option value="${r}" ${String(settings().playbackRate) === String(r) ? "selected" : ""}>${r}×</option>`).join("")}</select></label>
      <button class="btn ghost" data-repeat>Nghe lại từ đầu</button></div>` : ""}
    </div></article>`;
}
function sectionReaderHtml() {
  const s = settings();
  const r = CONTENT.pilot.reader;
  return `<section class="card"><h2>Đọc và nghe</h2><p class="muted">${esc(r.noteVi)}</p>
  ${togglesHtml("sentences")}
  <h3>Audio của bài (phát trực tiếp từ nguồn Baulchino)</h3>
  <div id="tracks">${r.audioTracks.map(trackRowHtml).join("")}</div>
  <p class="muted small">Nghe từng câu đang <strong>tắt</strong>: chưa có mốc thời gian theo câu đã kiểm chứng cho hai track này. Nếu audio lỗi, hãy thử lại hoặc <a href="https://www.baulchino.com/new-hsk-audios-2026" target="_blank" rel="noopener">mở trang audio nguồn</a>.</p>
  <h3>Hội thoại của bài</h3>
  ${r.sentences.map((sen) => `<div class="sentence" data-sentence="${esc(sen.id)}">
    <span class="speaker">${esc(sen.speaker)}</span>
    <div>${s.showPinyinSentences ? `<div class="pinyin">${esc(sen.pinyin)}</div>` : ""}
    <div class="zh-sentence">${esc(sen.zh)}</div>
    ${s.showViSentences ? `<div class="vi">${esc(sen.vi)}</div>` : `<button class="btn ghost small" data-reveal="${esc(sen.id)}">Xem nghĩa</button><div class="vi hidden" id="vi-${esc(sen.id)}">${esc(sen.vi)}</div>`}
    </div></div>`).join("")}
  ${refsHtml(r.sentences[0].sourceRefs)}
  <h3>Thẻ từ trang in 003</h3>
  <div class="word-grid">${r.vocab.map((w) => `<article class="word-card">${s.showPinyinSentences ? `<div class="pinyin">${esc(w.pinyin)}</div>` : ""}<div class="zh">${esc(w.zh)}</div><div class="vi">${esc(w.vi)}</div></article>`).join("")}</div>
  ${refsHtml(r.vocab[0].sourceRefs)}</section>`;
}
let readerEpoch = 0;
function bindReader() {
  bindToggles();
  const r = CONTENT.pilot.reader;
  const epoch = ++readerEpoch;
  let lastKey = "";
  const rerenderTracks = () => {
    if (epoch !== readerEpoch) return; // a newer reader render owns the UI now
    const st = player.getState();
    const el = $("#tracks"); if (!el) { renderMini(); return; }
    const key = `${st.trackId}|${st.playing}|${st.error ? "err" : ""}`;
    if (key === lastKey) {
      // Same track/state: update time in place so controls are not rebuilt
      // mid-click (rebuilding on every timeupdate broke the pause button).
      const cur = el.querySelector("[data-cur]"); if (cur) cur.textContent = player.fmtTime(st.currentTime);
      const range = el.querySelector("[data-seek]"); if (range && document.activeElement !== range) range.value = Math.floor(st.currentTime);
      renderMini();
      return;
    }
    lastKey = key;
    el.innerHTML = r.audioTracks.map(trackRowHtml).join(""); bindTrackControls();
    renderMini();
  };
  player.subscribe(rerenderTracks);
  bindTrackControls();
  $$("[data-reveal]").forEach((b) => b.addEventListener("click", () => {
    const el = document.getElementById(`vi-${b.dataset.reveal}`); if (el) el.classList.remove("hidden"); b.remove();
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
function ensureSession() {
  const p = loadProgress();
  if (!p.exerciseSession || p.exerciseSession.setId !== CONTENT.pilot.exerciseSet.id) {
    update((pp) => { pp.exerciseSession = { setId: CONTENT.pilot.exerciseSet.id, index: 0, answers: {}, checked: {}, hintUsed: {} }; });
  }
  return loadProgress().exerciseSession;
}
function recordAttempt(item, optionId, correct, hintUsed) {
  update((p) => {
    const prior = p.attempts.filter((a) => a.exerciseId === item.id);
    p.attempts.push({ id: `att-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, exerciseId: item.id, lessonId: CONTENT.pilot.lessonId, optionId, correct, firstAttempt: prior.length === 0, hintUsed: !!hintUsed, at: new Date().toISOString() });
    if (!correct) {
      const key = `ex-${item.id}`;
      const existing = p.reviewItems[key];
      p.reviewItems[key] = { sourceItemId: item.id, kind: "exercise", intervalStep: 0, dueAt: new Date(Date.now() + REVIEW_INTERVALS_DAYS[0] * 86400000).toISOString(), lastResult: "wrong", attempts: (existing?.attempts || 0) + 1 };
    }
  });
}
function sectionExercisesHtml() {
  const set = CONTENT.pilot.exerciseSet;
  const ses = ensureSession();
  const item = set.items[ses.index];
  const attempts = loadProgress().attempts;
  const sum = summarizeAttempts(attempts, set.items.map((i) => i.id));
  if (!item) {
    return `<section class="card"><h2>Đã làm hết câu hỏi chấm tự động</h2>
    <p>Điểm lần đầu: <strong>${sum.firstCorrect}/${sum.firstTotal}</strong> · Đã làm lại: ${sum.retried} câu · Đã dùng gợi ý: ${sum.hintUsedCount} câu.</p>
    <button class="btn" id="restart-set">Làm lại từ đầu (điểm lần đầu đã ghi sẽ không đổi)</button>
    ${selfCheckHtml()}</section>`;
  }
  const checked = ses.checked[item.id];
  const chosen = ses.answers[item.id];
  const result = checked ? gradeChoice(item, chosen) : null;
  return `<section class="card"><h2>Luyện tập</h2>
  <p class="muted">${esc(set.noteVi)}</p>
  <div class="progress-bar" aria-hidden="true"><div style="width:${Math.round((ses.index / set.items.length) * 100)}%"></div></div>
  <p class="muted">Câu ${ses.index + 1}/${set.items.length} · Điểm lần đầu hiện tại: ${sum.firstCorrect}/${sum.firstTotal || 0}</p>
  <h3>${esc(item.promptVi)}</h3>
  <form id="ex-form">
  ${item.options.map((o) => `<label class="option ${checked && chosen === o.id ? (result.correct ? "right" : "wrong") : ""} ${checked && item.answer === o.id ? "right-outline" : ""}">
    <input type="radio" name="opt" value="${esc(o.id)}" ${chosen === o.id ? "checked" : ""} ${checked ? "disabled" : ""}>
    <span>${o.zh ? `<span class="zh-inline">${esc(o.zh)}</span> <span class="pinyin">${esc(o.pinyin || "")}</span>` : esc(o.labelVi || "")}</span></label>`).join("")}
  ${!checked ? `<div class="row-actions"><button class="btn primary" type="submit">Kiểm tra</button>
    <button class="btn ghost" type="button" id="hint-btn">Gợi ý</button></div>
    ${ses.hintUsed[item.id] ? `<p class="hint">Gợi ý: ${esc(item.hintVi)} <span class="muted">(đã ghi nhận dùng gợi ý)</span></p>` : ""}`
  : `<div class="feedback ${result.correct ? "ok" : "bad"}" role="status">
      <p><strong>${result.correct ? "Đúng." : "Chưa đúng."}</strong> ${esc(item.explanationVi)}</p>
      ${item.grammarIds.length ? `<a class="btn" href="#/grammar/${esc(item.grammarIds[0])}?return=exercises">Ôn lại cách dùng</a>` : ""}
      ${ses.index + 1 < set.items.length ? `<button class="btn primary" type="button" id="next-q">Câu tiếp theo</button>` : `<button class="btn primary" type="button" id="finish-q">Xem tổng kết bài tập</button>`}
    </div>`}
  </form>
  ${refsHtml(item.sourceRefs)}
  </section>
  ${selfCheckHtml()}`;
}
function selfCheckHtml() {
  const p = loadProgress();
  return `<section class="card"><h2>Bài tập trong sách — tự đối chiếu (không chấm tự động)</h2>
  <p class="muted">Các bài nghe–viết dưới đây có đáp án chưa được kiểm chứng (sách bài tập không in đáp án), nên app không chấm đúng/sai. Làm bài, nghe track kèm theo, rồi tự đánh giá trung thực; đánh giá “Chưa nhớ” sẽ đưa bài vào hàng đợi ôn.</p>
  ${CONTENT.pilot.selfCheckTasks.map((t) => {
    const mine = p.selfChecks[t.id];
    return `<article class="selftask"><h3>${esc(t.titleVi)}</h3><p>${esc(t.instructionVi)}</p>
    ${t.audioTrackId ? `<button class="btn" data-play-task="${esc(t.audioTrackId)}">▶ Phát track 1-2</button>` : ""}
    <a class="btn ghost" href="#/sources/src-hsk1-workbook-pdf">Mở nguồn sách</a>
    <div class="row-actions" role="group" aria-label="Tự đánh giá ${esc(t.titleVi)}">
      ${[["forgot", "Chưa nhớ"], ["slow", "Còn chậm"], ["known", "Nhớ"]].map(([k, label]) => `<button class="btn small ${mine?.rating === k ? "primary" : ""}" data-selfrate="${esc(t.id)}:${k}">${label}</button>`).join("")}
    </div>${mine ? `<p class="muted small">Lần tự đánh giá gần nhất: ${esc({ forgot: "Chưa nhớ", slow: "Còn chậm", known: "Nhớ" }[mine.rating] || mine.rating)} · ${esc(new Date(mine.at).toLocaleString("vi-VN"))}</p>` : ""}
    ${refsHtml(t.sourceRefs)}</article>`;
  }).join("")}</section>`;
}
function bindExercises() {
  const set = CONTENT.pilot.exerciseSet;
  const ses = ensureSession();
  const item = set.items[ses.index];
  const form = $("#ex-form");
  if (form && item) {
    form.onsubmit = (e) => {
      e.preventDefault();
      const chosen = new FormData(form).get("opt");
      if (!chosen) return;
      const res = gradeChoice(item, String(chosen));
      update((p) => { p.exerciseSession.answers[item.id] = String(chosen); p.exerciseSession.checked[item.id] = true; });
      recordAttempt(item, String(chosen), res.correct, loadProgress().exerciseSession.hintUsed[item.id]);
      render();
    };
    const hint = $("#hint-btn");
    if (hint) hint.onclick = () => { update((p) => { p.exerciseSession.hintUsed[item.id] = true; }); render(); };
    const next = $("#next-q"); if (next) next.onclick = () => { update((p) => { p.exerciseSession.index += 1; }); render(); };
    const fin = $("#finish-q"); if (fin) fin.onclick = () => { update((p) => { p.exerciseSession.index = set.items.length; }); render(); };
  }
  const restart = $("#restart-set");
  if (restart) restart.onclick = () => { update((p) => { p.exerciseSession = { setId: set.id, index: 0, answers: {}, checked: {}, hintUsed: {} }; }); render(); };
  $$("[data-play-task]").forEach((b) => b.onclick = () => {
    const track = CONTENT.pilot.reader.audioTracks.find((t) => t.id === b.dataset.playTask);
    if (track) player.playTrack(track, { rate: settings().playbackRate });
  });
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

function sectionApplyHtml() {
  const a = CONTENT.pilot.apply;
  const track = CONTENT.pilot.reader.audioTracks.find((t) => t.id === a.audioTrackId);
  return `<section class="card"><h2>Vận dụng: ${esc(a.titleVi)}</h2><p>${esc(a.instructionVi)}</p>
  ${trackRowHtml(track)}
  <p class="muted">Đây là nhiệm vụ có thật trong sách (nghe và đọc lại). Không có đánh giá tự động hay AI chấm nói trong phạm vi pilot.</p>
  ${refsHtml(a.sourceRefs)}</section>`;
}
function sectionSummaryHtml(lesson) {
  const set = CONTENT.pilot.exerciseSet;
  const p = loadProgress();
  const sum = summarizeAttempts(p.attempts, set.items.map((i) => i.id));
  const wrongIds = [...new Set(p.attempts.filter((a) => !a.correct).map((a) => a.exerciseId))];
  const st = lessonState(lesson.id);
  return `<section class="card"><h2>Tổng kết bài</h2>
  <p>Đã hoàn thành <strong>${st.completedSections.length}/${CONTENT.pilot.intro.sections.length}</strong> mục.</p>
  <p>Bài tập chấm tự động: điểm lần đầu <strong>${sum.firstCorrect}/${sum.firstTotal}</strong>; số câu đã làm lại: ${sum.retried}; số câu đã dùng gợi ý: ${sum.hintUsedCount}. Điểm làm lại và gợi ý được ghi riêng, không gộp vào điểm lần đầu.</p>
  ${wrongIds.length ? `<h3>Câu từng làm sai — ôn lại cách dùng</h3>${wrongIds.map((id) => { const it = set.items.find((i) => i.id === id); return `<p class="row-line"><span>${esc(it.promptVi)}</span>${it.grammarIds.length ? `<a class="btn small" href="#/grammar/${esc(it.grammarIds[0])}?return=summary">Ôn lại</a>` : ""}</p>`; }).join("")}` : `<p class="muted">Chưa có câu nào làm sai.</p>`}
  <p class="muted">Mức “đã học” ở đây chỉ nghĩa là đã xem/làm các mục. App không coi một mục là “đã nắm vững” nếu thiếu bài tập kiểm chứng — với bài này, phần nghe–viết vẫn là tự đánh giá.</p>
  <p class="row-actions"><a class="btn" href="#/review">Tới Ôn tập</a><a class="btn primary" href="#/course/HSK%201">Về lộ trình</a></p></section>`;
}

// ---------- Grammar ----------
function allKnowledge() { return CONTENT.pilot.knowledgePoints; }
function viewGrammar(id, queryOverride) {
  navActive();
  const { query } = parseRoute();
  if (id) {
    const kp = allKnowledge().find((k) => k.id === id);
    if (!kp) { main.innerHTML = `<section class="card"><h1>Không tìm thấy điểm kiến thức</h1><a class="btn" href="#/grammar">Về tra cứu</a></section>`; return; }
    const ret = query.return ? `#/lesson/${CONTENT.pilot.lessonId}/${esc(query.return)}` : null;
    main.innerHTML = `${knowledgeCardHtml(kp, { linkBack: ret })}
    <section class="card"><h2>Bài có dùng điểm này</h2><p class="row-line"><a href="#/lesson/${CONTENT.pilot.lessonId}">HSK 1 · Bài 1: ${esc(lessonById(CONTENT.pilot.lessonId).titleZh)}</a><span class="tag">Sách bài tập</span></p></section>`;
    return;
  }
  const q = queryOverride ?? query.q ?? "";
  const list = allKnowledge().filter((kp) => matchesQuery([kp.title, kp.explanationVi, kp.pattern, kp.examples.map((e) => `${e.zh} ${e.pinyin}`).join(" ")], q));
  main.innerHTML = `${header("Tra cứu ngữ pháp", "Tìm theo chữ Hán, Pinyin (có/không dấu) hoặc từ khóa tiếng Việt")}
  <form id="gform" class="card"><label class="sr" for="gq">Từ khóa</label>
  <input id="gq" type="search" value="${esc(q)}" placeholder="Ví dụ: thanh điệu, er, bā, ni hao…" autocomplete="off">
  <button class="btn" type="submit">Tìm</button></form>
  ${list.length ? list.map((kp) => `<article class="row-card"><div class="grow"><h2>${esc(kp.title)}</h2>
    <p>${esc(kp.explanationVi.slice(0, 140))}…</p><p class="muted small">${esc(kp.kindLabel)} · Có trong 1 bài (Bài 1 HSK 1, sách bài tập)</p></div>
    <a class="btn" href="#/grammar/${esc(kp.id)}">Xem</a></article>`).join("")
    : `<section class="card"><h2>Chưa có kết quả</h2><p class="muted">Danh mục hiện chỉ gồm các điểm kiến thức đã kiểm chứng của Bài 1 HSK 1 (sách bài tập, nền phát âm). Điểm ngữ pháp câu của sách giáo khoa sẽ xuất hiện khi nội dung Textbook được đọc và kiểm chứng — app không tạo mục tra cứu từ dữ liệu chưa có nguồn.</p></section>`}`;
  $("#gform").onsubmit = (e) => { e.preventDefault(); go(`#/grammar?q=${encodeURIComponent($("#gq").value)}`); };
}

// ---------- Review / Progress / Settings / Sources ----------
function describeReviewItem(item) {
  const ex = CONTENT.pilot.exerciseSet.items.find((i) => i.id === item.sourceItemId);
  if (ex) return { title: ex.promptVi, href: `#/lesson/${CONTENT.pilot.lessonId}/exercises`, grammarId: ex.grammarIds[0] };
  const task = CONTENT.pilot.selfCheckTasks.find((t) => t.id === item.sourceItemId);
  if (task) return { title: task.titleVi, href: `#/lesson/${CONTENT.pilot.lessonId}/exercises`, grammarId: null };
  return { title: item.sourceItemId, href: "#/review", grammarId: null };
}
function viewReview() {
  navActive();
  const p = loadProgress();
  const items = Object.entries(p.reviewItems).map(([key, v]) => ({ key, ...v }));
  const due = items.filter((i) => isDue(i, Date.now()));
  const upcoming = items.filter((i) => !isDue(i, Date.now())).sort((a, b) => new Date(a.dueAt) - new Date(b.dueAt));
  main.innerHTML = `${header("Ôn tập", "Ôn bằng chính câu/bài đã làm sai hoặc tự đánh giá chưa nhớ — app không tự tạo câu mới")}
  ${due.length ? `<section class="card"><h2>Đến hạn ôn (${due.length})</h2>
    ${due.map((i) => { const d = describeReviewItem(i); return `<article class="row-line-col"><p><strong>${esc(d.title)}</strong><br><span class="muted small">Nguồn: ${i.kind === "exercise" ? "câu làm sai" : "tự đánh giá"} · đã ôn/làm ${i.attempts} lần · hạn ôn: ${esc(new Date(i.dueAt).toLocaleDateString("vi-VN"))}</span></p>
    <span class="row-actions"><a class="btn" href="${esc(d.href)}">Làm lại tại bài</a>
    ${d.grammarId ? `<a class="btn ghost" href="#/grammar/${esc(d.grammarId)}?return=exercises">Xem giải thích</a>` : ""}
    ${[["forgot", "Chưa nhớ"], ["slow", "Còn chậm"], ["known", "Nhớ"]].map(([k, label]) => `<button class="btn small" data-review-rate="${esc(i.key)}:${k}">${label}</button>`).join("")}</span></article>`; }).join("")}
    <p class="muted small">Lịch ôn đề xuất của sản phẩm: 1, 3, 7, 14, 30 ngày; trả lời sai quay về 1 ngày.</p></section>`
  : `<section class="card"><h2>Chưa có mục đến hạn</h2><p class="muted">Làm bài tập hoặc tự đánh giá một bài nghe–viết để tạo mục ôn. Lịch ôn chỉ tính từ thao tác học thật, không tạo dữ liệu mẫu.</p></section>`}
  ${upcoming.length ? `<section class="card"><h2>Sắp đến hạn</h2>${upcoming.map((i) => { const d = describeReviewItem(i); return `<p class="row-line"><span>${esc(d.title)}</span><span class="tag">${esc(new Date(i.dueAt).toLocaleDateString("vi-VN"))}</span></p>`; }).join("")}</section>` : ""}`;
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
  const pilot = lessonById(CONTENT.pilot.lessonId);
  const st = lessonState(pilot.id);
  const set = CONTENT.pilot.exerciseSet;
  const sum = summarizeAttempts(p.attempts, set.items.map((i) => i.id));
  main.innerHTML = `${header("Tiến độ", "“Đã học” và “đã nắm vững” là hai việc khác nhau")}
  <section class="card"><h2>${esc(pilot.level)} · Bài 1 (pilot)</h2>
  <p>Mục đã hoàn thành: <strong>${st.completedSections.length}/${CONTENT.pilot.intro.sections.length}</strong> — đây là mức “đã học/đã xem”.</p>
  <p>Bài tập chấm tự động: đã trả lời ${sum.answered}/${set.items.length} câu; điểm lần đầu <strong>${sum.firstCorrect}/${sum.firstTotal}</strong>; làm lại ${sum.retried} câu; dùng gợi ý ${sum.hintUsedCount} câu.</p>
  <p>Bài nghe–viết tự đánh giá: ${Object.keys(p.selfChecks).length}/${CONTENT.pilot.selfCheckTasks.length} bài đã tự đánh giá. Các bài này <strong>không</strong> được tính là “đã nắm vững” vì chưa có đáp án kiểm chứng để chấm.</p>
  <p>Mục ôn đang theo dõi: ${Object.keys(p.reviewItems).length}.</p></section>
  <section class="card"><h2>Các bài còn lại của HSK 1</h2>
  <p class="muted">Bài 2–15 mới ở mức mục lục đã kiểm chứng; chưa có tiến độ vì chưa mở bài học.</p>
  <a class="btn" href="#/course/HSK%201">Xem lộ trình</a></section>`;
}

function viewSettings() {
  navActive();
  const s = settings();
  main.innerHTML = `${header("Cài đặt", "Cài đặt được lưu trên thiết bị này, không cần tài khoản")}
  <section class="card"><h2>Hiển thị</h2>
  <label class="switch-row"><input type="checkbox" data-setting="showPinyinPrep" ${s.showPinyinPrep ? "checked" : ""}> Hiện Pinyin ở phần Chuẩn bị (thẻ từ)</label>
  <label class="switch-row"><input type="checkbox" data-setting="showPinyinSentences" ${s.showPinyinSentences ? "checked" : ""}> Hiện Pinyin ở câu trong bài đọc</label>
  <label class="switch-row"><input type="checkbox" data-setting="showViSentences" ${s.showViSentences ? "checked" : ""}> Hiện nghĩa Việt ở câu trong bài đọc</label>
  <label class="switch-row">Cỡ chữ <select data-setting-select="fontScale">
    ${[1, 1.15, 1.3].map((v) => `<option value="${v}" ${String(s.fontScale) === String(v) ? "selected" : ""}>${v === 1 ? "Thường" : v === 1.15 ? "Lớn" : "Rất lớn"}</option>`).join("")}</select></label>
  <label class="switch-row">Tốc độ phát mặc định <select id="rate-setting">
    ${[0.75, 1, 1.25].map((v) => `<option value="${v}" ${String(s.playbackRate) === String(v) ? "selected" : ""}>${v}×</option>`).join("")}</select></label>
  <p class="muted small">Hai công tắc Pinyin/nghĩa hoạt động độc lập và được nhớ cho lần học sau.</p></section>
  <section class="card"><h2>Sao lưu tiến độ</h2>
  <p class="muted">Xuất bản sao lưu JSON (có schemaVersion) để chuyển máy hoặc khôi phục. Khi nhập, app kiểm tra dữ liệu, cho xem tóm tắt trước, và tự giữ một bản sao của tiến độ hiện tại trước khi ghi đè.</p>
  <p class="row-actions"><button class="btn" id="export-btn">Xuất bản sao lưu</button>
  <label class="btn ghost" for="import-file">Nhập bản sao lưu…</label>
  <input id="import-file" type="file" accept="application/json" class="hidden"></p>
  <div id="import-preview"></div>
  <div id="export-out"></div></section>
  <section class="card"><h2>Giới thiệu</h2>
  <p>HSK 3.0 · Ngữ pháp tiếng Trung — ứng dụng học theo giáo trình HSK 3.0 với nguồn học liệu duy nhất từ Baulchino. Tiếng Việt trong app là bản dịch/chú giải biên tập, không phải bản dịch chính thức. Phiên bản dữ liệu: ${esc(CONTENT.contentVersion)}.</p>
  <a class="btn" href="#/sources">Nguồn và trạng thái kiểm chứng</a></section>`;
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
      <p class="muted small">App không lưu bản sao của tài sản này trong repo; liên kết trỏ thẳng tới nguồn.</p>
    </section>`;
    return;
  }
  main.innerHTML = `${header("Nguồn học liệu", "Mọi nội dung trong app truy về các nguồn này")}
  ${CONTENT.sources.map((s) => `<article class="row-card"><div class="grow"><h2>${esc(s.title)}</h2>
    <p class="muted">${esc(s.kind)} · quyền: ${esc(s.rightsStatus)} · kiểm chứng: ${esc(s.retrievedAt)}</p>
    <p>${esc(s.verification)}</p></div><a class="btn" href="#/sources/${esc(s.id)}">Chi tiết</a></article>`).join("")}`;
}

// ---------- Section binding, mini player, boot ----------
function bindSection(sectionId) {
  if (sectionId === "prep" || sectionId === "knowledge") bindToggles();
  if (sectionId === "reader") bindReader();
  if (sectionId === "exercises") bindExercises();
  if (sectionId === "apply") {
    $$("[data-play]").forEach((b) => b.onclick = () => {
      const track = CONTENT.pilot.reader.audioTracks.find((t) => t.id === b.dataset.play);
      if (track) player.playTrack(track, { rate: settings().playbackRate });
    });
    $$("[data-seek]").forEach((el) => el.onchange = () => player.seek(Number(el.value)));
    $$("[data-rate]").forEach((el) => el.onchange = () => { update((p) => { p.settings.playbackRate = Number(el.value); }); player.setRate(Number(el.value)); });
    $$("[data-repeat]").forEach((b) => b.onclick = () => player.seek(0));
    player.subscribe(() => { /* mini player reflects state */ renderMini(); });
  }
}
function renderMini() {
  const st = player.getState();
  if (!st.trackId) { mini.innerHTML = ""; mini.classList.add("hidden"); return; }
  mini.classList.remove("hidden");
  mini.innerHTML = `<span class="mini-label">🔊 ${esc(st.label || "Audio")}</span>
    <span class="muted small">${player.fmtTime(st.currentTime)} / ${player.fmtTime(st.duration)}</span>
    ${st.error ? `<span class="mini-error">${esc(st.error)}</span>` : ""}
    <button class="btn small" id="mini-toggle">${st.playing ? "Tạm dừng" : "Phát"}</button>
    <button class="btn small ghost" id="mini-stop">Dừng</button>`;
  $("#mini-toggle").onclick = () => {
    const track = CONTENT.pilot.reader.audioTracks.find((t) => t.id === st.trackId);
    if (track) player.playTrack(track, { rate: settings().playbackRate });
  };
  $("#mini-stop").onclick = () => { player.pause(); player.seek(0); };
}
player.subscribe(renderMini);

async function boot() {
  applyFontScale();
  try {
    const res = await fetch("data/content.json", { cache: "no-cache" });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    CONTENT = await res.json();
  } catch (e) {
    loadError = "Chưa tải được dữ liệu bài học (có thể do mạng). Tiến độ đã lưu của bạn vẫn còn nguyên.";
  }
  render();
}
window.addEventListener("hashchange", render);
boot();
