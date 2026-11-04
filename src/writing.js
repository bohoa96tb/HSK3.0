// Khu Luyện viết chữ Hán (D29/D30): Hanzi Writer 3.7.3 vendored (MIT) +
// stroke data from Make Me a Hanzi (Arphic Public License, data/hanzi/).
// Stages tracked per character in progress.writing (see lib.js): seen /
// practiced / self / paper / needsReview. A character is never labelled
// "mastered" — completing a stage once, especially with hints, is practice,
// not mastery.
import { loadProgress, update } from "./store.js?v=20261104-hsk2l2-writing1";
import { markWriting, writingEntryOf, writingStageCount, isWritingDue } from "./lib.js?v=20261104-hsk2l2-writing1";

const VENDOR_SRC = "assets/vendor/hanzi-writer-3.7.3.min.js";
let hwPromise = null;

export function writingSetFor(CONTENT, lessonId) {
  return (CONTENT.writingSets || []).find((w) => w.lessonId === lessonId) || null;
}
export function writingChar(CONTENT, charId) {
  for (const set of CONTENT.writingSets || []) {
    const ch = set.chars.find((x) => x.id === charId);
    if (ch) return { set, ch };
  }
  return null;
}

// Hanzi Writer 3.x renamed the factory: HanziWriter.create(...) (the old
// createWriter name was removed in 3.0). Support both spellings.
function createWriter(HW, el, char, opts) {
  if (typeof HW.createWriter === "function") return HW.createWriter(el, char, opts);
  return HW.create(el, char, opts);
}

function loadHanziWriter() {
  if (window.HanziWriter) return Promise.resolve(window.HanziWriter);
  if (!hwPromise) {
    hwPromise = new Promise((resolve, reject) => {
      const s = document.createElement("script");
      s.src = VENDOR_SRC;
      s.onload = () => (window.HanziWriter ? resolve(window.HanziWriter) : reject(new Error("no-global")));
      s.onerror = () => reject(new Error("load-failed"));
      document.head.appendChild(s);
    });
  }
  return hwPromise;
}
function charDataLoader(char, onComplete, onError) {
  fetch(`data/hanzi/${encodeURIComponent(char)}.json`)
    .then((r) => { if (!r.ok) throw new Error(`http-${r.status}`); return r.json(); })
    .then(onComplete)
    .catch(onError);
}
const reducedMotion = () => typeof window !== "undefined" && window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function stageBadges(entry) {
  const b = [];
  if (entry?.seen) b.push("Đã xem mẫu");
  if (entry?.practiced) b.push("Đã tập theo");
  if (entry?.self) b.push("Đã thử tự viết");
  if (entry?.paper) b.push("Đã luyện trên giấy");
  if (entry?.needsReview) b.push("Cần ôn");
  return b;
}
function fmtDate(iso) {
  if (!iso) return "";
  try { return new Date(iso).toLocaleDateString("vi-VN", { day: "numeric", month: "numeric", year: "numeric" }); } catch { return ""; }
}
function saveMark(charId, patch) {
  update((p) => {
    p.writing = p.writing || {};
    p.writing[charId] = markWriting(p.writing[charId] || null, patch, Date.now());
  });
  return writingEntryOf(loadProgress(), charId);
}

// ---------- Home: #/writing ----------
export function viewWritingHome(ctx) {
  const { CONTENT, main, esc, header, lessonById } = ctx;
  ctx.navActive();
  const p = loadProgress();
  const now = Date.now();
  const sets = CONTENT.writingSets || [];
  const due = [];
  for (const set of sets) for (const ch of set.chars) {
    const e = writingEntryOf(p, ch.id);
    if (isWritingDue(e, now)) due.push({ set, ch, e });
  }
  const hsk2 = CONTENT.lessons.filter((l) => l.level === "HSK 2");
  main.innerHTML = `${header("Luyện viết chữ Hán", "Học viết theo đúng thứ tự nét của sách luyện viết HSK 2: nhìn chữ → xem cách viết → tập theo → tự viết → nhớ từ và câu.")}
  <section class="card"><h2>Cách học ở khu này</h2>
  <p>Mỗi bài HSK 2 có một bộ chữ riêng lấy từ sách luyện viết chữ Hán (mỗi chữ kèm một từ và một câu mẫu của sách). Bạn có thể học vài chữ rồi quay lại sau — tiến độ từng chữ được lưu trên thiết bị. Hoàn thành một lần, kể cả khi đã dùng gợi ý, chỉ được ghi là <strong>đã luyện</strong>, không phải “đã thành thạo”.</p>
  <p class="muted small">Thứ tự nét và hình chữ dùng dữ liệu mở Make Me a Hanzi qua thư viện Hanzi Writer (giấy phép MIT; dữ liệu nét theo Arphic Public License — xem <a href="#/sources/src-hanzi-stroke-data">trang Nguồn</a>). Số nét của từng chữ đã đối chiếu với dãy ô tô nét trong sách. Công cụ kiểm tra theo dữ liệu nét của hệ thống, không thay được giáo viên chấm chữ đẹp và có thể không nhận ra mọi biến thể viết tay hợp lệ.</p></section>
  ${due.length ? `<section class="card"><h2>Chữ cần ôn (${due.length})</h2>${due.map(({ set, ch }) => `<p class="row-line"><a href="#/writing/${set.lessonId}/${ch.id}"><span lang="zh-CN" class="due-char">${esc(ch.char)}</span> ${esc(ch.pinyin)} · ${esc(ch.meaningVi)}</a><span class="tag">${esc(lessonById(set.lessonId)?.titleVi || "")}</span></p>`).join("")}</section>` : ""}
  <div class="section-heading"><h2>Chữ theo bài — HSK 2</h2><span class="muted small">${sets.reduce((n, s) => n + s.chars.length, 0)} chữ đã biên soạn</span></div>
  <div class="lesson-list">${hsk2.map((l) => {
    const set = writingSetFor(CONTENT, l.id);
    if (!set) return `<article class="row-card upcoming"><span class="lesson-num">${String(l.lessonNumber).padStart(2, "0")}</span><div class="grow"><h2 lang="zh-CN">${esc(l.titleZh)}</h2><p>${esc(l.titleVi)}</p><span class="tag">Phần viết đang biên soạn</span></div></article>`;
    const done = set.chars.filter((ch) => writingStageCount(writingEntryOf(p, ch.id)) > 0).length;
    return `<article class="row-card available"><span class="lesson-num">${String(l.lessonNumber).padStart(2, "0")}</span><div class="grow"><h2 lang="zh-CN">${esc(l.titleZh)}</h2><p>${set.chars.length} chữ: ${set.chars.map((ch) => esc(ch.char)).join("、")}</p><span class="tag">${done ? `Đã luyện ${done}/${set.chars.length} chữ` : "Sẵn sàng luyện"}</span></div><a class="btn primary" href="#/writing/${l.id}">Luyện viết →</a></article>`;
  }).join("")}</div>`;
}

// ---------- Set page: #/writing/<lessonId> ----------
export function viewWritingSet(ctx, lessonId, query) {
  const { CONTENT, main, esc, header, lessonById } = ctx;
  ctx.navActive();
  const set = writingSetFor(CONTENT, lessonId);
  const lesson = lessonById(lessonId);
  if (!set || !lesson) {
    main.innerHTML = `${header("Luyện viết chữ Hán")}<section class="card warn"><h2>Phần viết của bài này đang biên soạn</h2><p>Khi bộ chữ của bài được đối chiếu xong với sách viết, nó sẽ xuất hiện ở đây.</p><p><a class="btn" href="#/writing">Về khu Luyện viết</a> <a class="btn ghost" href="#/lesson/${esc(lessonId)}">Về bài học</a></p></section>`;
    return;
  }
  const p = loadProgress();
  const onlyReview = query && query.filter === "review";
  const chars = onlyReview ? set.chars.filter((ch) => isWritingDue(writingEntryOf(p, ch.id), Date.now())) : set.chars;
  main.innerHTML = `${header(set.titleVi, `${lesson.titleVi} · ${set.chars.length} chữ theo thứ tự sách viết`)}
  <p class="row-actions"><a class="btn ghost" href="#/writing">← Khu Luyện viết</a> <a class="btn ghost" href="#/lesson/${lesson.id}/intro">Về Bắt đầu của bài học</a></p>
  <section class="card"><p>${esc(set.introVi)}</p>
  <p class="row-actions"><a class="btn ${onlyReview ? "" : "primary"}" href="#/writing/${lesson.id}">Tất cả chữ</a> <a class="btn ${onlyReview ? "primary" : ""}" href="#/writing/${lesson.id}?filter=review">Chữ cần ôn</a></p></section>
  <div class="char-grid">${chars.map((ch) => {
    const e = writingEntryOf(p, ch.id);
    const badges = stageBadges(e);
    return `<a class="char-card" href="#/writing/${lesson.id}/${ch.id}"><span class="char-big" lang="zh-CN">${esc(ch.char)}</span><span class="char-meta">${esc(ch.pinyin)} · ${esc(ch.hanViet)} · ${ch.strokeCount} nét</span><span class="char-word" lang="zh-CN">${esc(ch.word.zh)}</span><span class="char-badges">${badges.length ? badges.map((b) => `<span class="tag">${esc(b)}</span>`).join(" ") : '<span class="tag">Chưa luyện</span>'}</span></a>`;
  }).join("") || '<p class="muted">Chưa có chữ nào đến hạn ôn. Bạn có thể mở bất kỳ chữ nào để ôn sớm.</p>'}</div>
  ${ctx.refsHtml(set.sourceRefs)}`;
}

// ---------- Char page: #/writing/<lessonId>/<charId> ----------
export function viewWritingChar(ctx, lessonId, charId) {
  const { CONTENT, main, esc, header, lessonById } = ctx;
  ctx.navActive();
  const found = writingChar(CONTENT, charId);
  const lesson = lessonById(lessonId);
  if (!found || found.set.lessonId !== lessonId || !lesson) {
    main.innerHTML = `${header("Luyện viết chữ Hán")}<section class="card warn"><h2>Không tìm thấy chữ này</h2><p><a class="btn" href="#/writing/${esc(lessonId)}">Về danh sách chữ của bài</a></p></section>`;
    return;
  }
  const { set, ch } = found;
  const idx = set.chars.findIndex((x) => x.id === charId);
  const nextCh = set.chars[idx + 1] || null;
  const entry = writingEntryOf(loadProgress(), charId);
  const badges = stageBadges(entry);
  const otherWords = set.chars.filter((x) => x.id !== charId);
  main.innerHTML = `${header(`Luyện viết: ${ch.char}`, `${lesson.titleVi} · Chữ ${idx + 1}/${set.chars.length} của bài`)}
  <p class="row-actions"><a class="btn ghost" href="#/writing/${lesson.id}">← Danh sách chữ</a> <a class="btn ghost" href="#/lesson/${lesson.id}/intro">Về bài học</a></p>

  <section class="card write-step"><p class="kicker">BƯỚC 1 · NHÌN VÀ HIỂU</p>
  <div class="write-look"><div class="grid-box static-char" lang="zh-CN" aria-label="Chữ ${esc(ch.char)}">${esc(ch.char)}</div>
  <div class="write-look-info"><p class="write-pron"><span lang="zh-CN">${esc(ch.char)}</span> · ${esc(ch.pinyin)} · Hán–Việt: ${esc(ch.hanViet)}</p>
  <p><strong>Nghĩa:</strong> ${esc(ch.meaningVi)}</p>
  <p><strong>Bộ thủ:</strong> <span lang="zh-CN">${esc(ch.radical.zh)}</span> (${esc(ch.radical.pinyin)}) · <strong>Số nét:</strong> ${ch.strokeCount}</p>
  <p><strong>Từ chứa chữ:</strong> <span lang="zh-CN">${esc(ch.word.zh)}</span> (${esc(ch.word.pinyin)}) — ${esc(ch.word.vi)}</p>
  <p><strong>Câu mẫu của sách:</strong> <span lang="zh-CN">${esc(ch.sentence.zh)}</span><br><span class="muted">${esc(ch.sentence.pinyin)} — ${esc(ch.sentence.vi)}</span></p>
  <p class="muted small">Mẹo nhớ: ${esc(ch.tipVi)}</p></div></div></section>

  <section class="card write-step"><p class="kicker">BƯỚC 2 · XEM CÁCH VIẾT</p>
  <div class="hw-wrap"><div id="hw-view" class="grid-box hw-box" role="img" aria-label="Khung xem thứ tự nét của chữ ${esc(ch.char)}"></div></div>
  <p class="row-actions writing-actions">
    <button class="btn primary" id="hw-play" type="button">Xem viết</button>
    <button class="btn" id="hw-slow" type="button">Viết chậm</button>
    <button class="btn" id="hw-replay" type="button">Xem lại</button>
  </p>
  <p class="muted small" id="hw-view-note">Thứ tự nét theo dữ liệu Make Me a Hanzi, đã đối chiếu số nét với sách viết (${ch.strokeCount} nét).</p></section>

  <section class="card write-step"><p class="kicker">BƯỚC 3 · TẬP VIẾT THEO MẪU</p>
  <div class="hw-wrap"><div id="hw-quiz" class="grid-box hw-box" role="img" aria-label="Khung tập viết theo mẫu của chữ ${esc(ch.char)}"></div></div>
  <p class="hw-status" id="quiz-status" aria-live="polite">Vẽ từng nét theo thứ tự — nét mờ là gợi ý vị trí.</p>
  <p class="row-actions writing-actions">
    <button class="btn" id="quiz-hint" type="button">Gợi ý nét này</button>
    <button class="btn" id="quiz-reset" type="button">Viết lại</button>
    <button class="btn ghost" id="quiz-skip" type="button">Bỏ qua</button>
  </p></section>

  <section class="card write-step"><p class="kicker">BƯỚC 4 · TỰ VIẾT</p>
  <div class="hw-wrap"><div id="hw-self" class="grid-box hw-box" role="img" aria-label="Khung tự viết của chữ ${esc(ch.char)}"></div></div>
  <p class="hw-status" id="self-status" aria-live="polite">Không có nét mẫu — hãy tự viết. Bạn có thể hiện mẫu bất cứ lúc nào.</p>
  <p class="row-actions writing-actions">
    <button class="btn" id="self-show" type="button">Hiện mẫu</button>
    <button class="btn" id="self-reset" type="button">Viết lại</button>
    <button class="btn" id="paper-btn" type="button">Tôi luyện trên giấy</button>
  </p>
  <p class="muted small">Công cụ kiểm tra nét theo dữ liệu nét và thứ tự của hệ thống; đây không phải giáo viên chấm chữ đẹp và hệ thống có thể không nhận ra mọi biến thể viết tay hợp lệ. Nếu không vẽ được bằng tay, hãy dùng lựa chọn luyện trên giấy và tự đối chiếu với mẫu ở Bước 2.</p></section>

  <section class="card write-step"><p class="kicker">BƯỚC 5 · NHỚ TỪ VÀ CÂU</p>
  <p>Từ chứa chữ <span lang="zh-CN"><strong>${esc(ch.word.zh)}</strong></span> (${esc(ch.word.pinyin)}) — ${esc(ch.word.vi)}</p>
  <p lang="zh-CN">${esc(ch.sentence.zh)}</p>
  <p class="muted">${esc(ch.sentence.pinyin)} — ${esc(ch.sentence.vi)}</p>
  <div class="write-recall"><p><strong>Thử nhớ:</strong> từ nào dưới đây chứa chữ <span lang="zh-CN">${esc(ch.char)}</span>?</p>
  <p class="row-actions writing-actions">${(() => { const opts = [ch.word, ...otherWords.slice(0, 2).map((x) => x.word)]; const rot = opts.length > 1 ? ((idx + 1) % opts.length) : 0; return [...opts.slice(rot), ...opts.slice(0, rot)]; })().map((w) => `<button class="btn" type="button" data-recall="${w.zh === ch.word.zh ? "right" : "wrong"}"><span lang="zh-CN">${esc(w.zh)}</span></button>`).join("")}</p>
  <p class="hw-status" id="recall-status" aria-live="polite"></p></div></section>

  <section class="card write-step"><p class="kicker">BƯỚC 6 · TRẠNG THÁI VÀ ÔN LẠI</p>
  <ul class="stage-list" id="stage-list">${["seen", "practiced", "self", "paper"].map((k) => `<li data-stage="${k}"><span class="stage-mark">${entry?.[k] ? "✓" : "○"}</span> ${{ seen: "Đã xem mẫu", practiced: "Đã tập theo mẫu", self: "Đã thử tự viết", paper: "Đã luyện trên giấy" }[k]}</li>`).join("")}</ul>
  <p class="muted small" id="due-line">${entry?.dueAt ? `Lần ôn gợi ý tiếp theo: ${fmtDate(entry.dueAt)} (nhịp 1–3–7 ngày; bạn vẫn ôn lại bất cứ lúc nào).` : "Khi bạn bắt đầu luyện, hệ thống sẽ gợi ý lần ôn tiếp theo theo nhịp 1–3–7 ngày."}</p>
  <p class="row-actions writing-actions">
    <button class="btn ${entry?.needsReview ? "primary" : ""}" id="review-toggle" type="button" aria-pressed="${entry?.needsReview ? "true" : "false"}">${entry?.needsReview ? "✓ Đã đánh dấu cần ôn" : "Đánh dấu chữ này cần ôn"}</button>
    ${nextCh ? `<a class="btn primary" href="#/writing/${lesson.id}/${nextCh.id}">Chữ tiếp theo: <span lang="zh-CN">${esc(nextCh.char)}</span> →</a>` : `<a class="btn primary" href="#/writing/${lesson.id}">Xong bài — về danh sách chữ</a>`}
  </p>
  <p><a href="#/lesson/${lesson.id}/summary">Hoàn thành phần còn lại của bài học →</a></p></section>
  ${ctx.refsHtml(ch.sourceRefs)}`;

  bindChar(ctx, ch);
}

function refreshStages(ch) {
  const e = writingEntryOf(loadProgress(), ch.id);
  document.querySelectorAll("#stage-list [data-stage]").forEach((li) => {
    const mark = li.querySelector(".stage-mark");
    if (mark) mark.textContent = e?.[li.dataset.stage] ? "✓" : "○";
  });
  const due = document.getElementById("due-line");
  if (due && e?.dueAt) due.textContent = `Lần ôn gợi ý tiếp theo: ${fmtDate(e.dueAt)} (nhịp 1–3–7 ngày; bạn vẫn ôn lại bất cứ lúc nào).`;
  const t = document.getElementById("review-toggle");
  if (t) { t.classList.toggle("primary", !!e?.needsReview); t.setAttribute("aria-pressed", String(!!e?.needsReview)); t.textContent = e?.needsReview ? "✓ Đã đánh dấu cần ôn" : "Đánh dấu chữ này cần ôn"; }
}

function bindChar(ctx, ch) {
  const { esc } = ctx;
  const viewBox = document.getElementById("hw-view");
  const quizBox = document.getElementById("hw-quiz");
  const selfBox = document.getElementById("hw-self");
  const note = document.getElementById("hw-view-note");
  let writers = {};
  let quizStroke = 0;

  const fallback = (box, msg) => {
    if (!box) return;
    box.innerHTML = `<span class="static-char-fallback" lang="zh-CN">${esc(ch.char)}</span>`;
    box.setAttribute("aria-label", msg);
  };

  loadHanziWriter().then((HW) => {
    const opts = (extra) => Object.assign({
      width: 264, height: 264, padding: 14, showOutline: true,
      strokeAnimationSpeed: reducedMotion() ? 0.6 : 1,
      delayBetweenStrokes: 220, strokeColor: "#1f3a5f", outlineColor: "#c9d4e4",
      drawingWidth: 22, charDataLoader,
      onLoadCharDataError: () => {
        fallback(viewBox, "Không tải được dữ liệu nét — dùng chữ tĩnh để luyện trên giấy.");
        fallback(quizBox, "Không tải được dữ liệu nét — dùng chữ tĩnh để luyện trên giấy.");
        fallback(selfBox, "Không tải được dữ liệu nét — dùng chữ tĩnh để luyện trên giấy.");
        if (note) note.textContent = "Không tải được dữ liệu nét của chữ này (có thể do mất mạng). Bạn vẫn xem được chữ tĩnh ở Bước 1 và luyện trên giấy ở Bước 4.";
      },
    }, extra);
    try {
      writers.view = createWriter(HW, viewBox, ch.char, opts());
      writers.view.animateCharacter({
        onComplete: () => { saveMark(ch.id, { seen: true }); refreshStages(ch); },
      });
    } catch { fallback(viewBox, "Không tải được dữ liệu nét — dùng chữ tĩnh để luyện trên giấy."); if (note) note.textContent = "Không tải được dữ liệu nét của chữ này. Bạn vẫn xem được chữ tĩnh ở Bước 1 và luyện trên giấy ở Bước 4."; }

    const startQuiz = () => {
      if (!quizBox) return;
      quizBox.innerHTML = "";
      quizStroke = 0;
      writers.quiz = createWriter(HW, quizBox, ch.char, opts({ showCharacter: false }));
      writers.quiz.quiz({
        onMistake: (d) => { const s = document.getElementById("quiz-status"); if (s) s.textContent = `Nét ${d.strokeNum + 1} chưa đúng vị trí/thứ tự — thử lại, hoặc bấm “Gợi ý nét này”. (Đã sai ${d.mistakesOnStroke} lần ở nét này.)`; },
        onCorrectStroke: (d) => { quizStroke = d.strokeNum + 1; const s = document.getElementById("quiz-status"); if (s) s.textContent = `Đúng nét ${d.strokeNum + 1}/${ch.strokeCount}. ${quizStroke >= ch.strokeCount ? "" : "Tiếp tục nét tiếp theo."}`; },
        onComplete: () => { const s = document.getElementById("quiz-status"); if (s) s.textContent = "Đã viết xong cả chữ theo mẫu. Sang Bước 4 để thử tự viết không nhìn mẫu."; saveMark(ch.id, { practiced: true }); refreshStages(ch); },
      });
    };
    const startSelf = () => {
      if (!selfBox) return;
      selfBox.innerHTML = "";
      writers.self = createWriter(HW, selfBox, ch.char, opts({ showCharacter: false, showOutline: false }));
      writers.self.quiz({
        onComplete: () => { const s = document.getElementById("self-status"); if (s) s.textContent = "Bạn đã tự viết xong cả chữ không nhìn mẫu."; saveMark(ch.id, { self: true }); refreshStages(ch); },
      });
    };
    try { startQuiz(); } catch { fallback(quizBox, "Không tải được bài tập viết theo mẫu."); }
    try { startSelf(); } catch { fallback(selfBox, "Không tải được bài tập tự viết."); }

    const on = (id, fn) => { const el = document.getElementById(id); if (el) el.onclick = fn; };
    on("hw-play", () => writers.view && writers.view.animateCharacter({ onComplete: () => { saveMark(ch.id, { seen: true }); refreshStages(ch); } }));
    on("hw-replay", () => writers.view && writers.view.animateCharacter({ onComplete: () => { saveMark(ch.id, { seen: true }); refreshStages(ch); } }));
    on("hw-slow", () => {
      if (!viewBox) return;
      viewBox.innerHTML = "";
      writers.view = createWriter(HW, viewBox, ch.char, opts({ strokeAnimationSpeed: 0.35, delayBetweenStrokes: 450 }));
      writers.view.animateCharacter({ onComplete: () => { saveMark(ch.id, { seen: true }); refreshStages(ch); } });
    });
    on("quiz-hint", () => { if (writers.quiz) writers.quiz.highlightStroke(quizStroke); });
    on("quiz-reset", () => startQuiz());
    on("quiz-skip", () => { const s = document.getElementById("quiz-status"); if (s) s.textContent = "Đã bỏ qua phần tập theo mẫu. Bạn có thể quay lại bất cứ lúc nào, hoặc thử tự viết ở Bước 4."; });
    on("self-show", () => { if (writers.self) { writers.self.showCharacter(); writers.self.showOutline(); } });
    on("self-reset", () => startSelf());
  }).catch(() => {
    fallback(viewBox, "Không tải được thư viện luyện viết.");
    fallback(quizBox, "Không tải được thư viện luyện viết.");
    fallback(selfBox, "Không tải được thư viện luyện viết.");
    if (note) note.textContent = "Không tải được thư viện/dữ liệu nét (có thể do mất mạng). Bạn vẫn xem được chữ tĩnh ở Bước 1 và dùng nút luyện trên giấy ở Bước 4.";
  });

  const paper = document.getElementById("paper-btn");
  if (paper) paper.onclick = () => {
    saveMark(ch.id, { paper: true });
    refreshStages(ch);
    const s = document.getElementById("self-status");
    if (s) s.textContent = "Đã ghi nhận bạn luyện trên giấy. Hãy tự đối chiếu từng nét với mẫu ở Bước 2 (bấm “Xem viết” để xem lại thứ tự).";
  };
  const toggle = document.getElementById("review-toggle");
  if (toggle) toggle.onclick = () => {
    const cur = writingEntryOf(loadProgress(), ch.id);
    saveMark(ch.id, { needsReview: !(cur && cur.needsReview) });
    refreshStages(ch);
  };
  document.querySelectorAll("[data-recall]").forEach((b) => {
    b.onclick = () => {
      const s = document.getElementById("recall-status");
      if (!s) return;
      s.textContent = b.dataset.recall === "right" ? "Đúng rồi — đó là từ chứa chữ này trong bài." : "Chưa đúng — từ này chứa một chữ khác của bài. Thử lại nhé.";
    };
  });
}
