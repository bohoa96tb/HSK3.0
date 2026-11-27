// AI Tutor view — lazy-loaded ONLY when the user opens #/tutor.
// Everything the module needs lives under js/ai-tutor/; the host app only
// registers the route and calls mountTutor().

import {
  PRACTICE_MODES, practiceModeInfo, loadLexicon, lookupLocalWord,
  buildSystemInstruction, segmentByLexicon, coverageNote, normalizeLevel,
  compactLevelCode, listLessons, getLessonContext, lessonReplyHints,
  lessonRoleplayOpening, lessonTranslateSeeds, resolveDrillPassed,
} from "./hsk-guardrail.js?v=20261127-ai-tutor8";
import { SCENARIOS, scenarioById } from "./roleplay-scenarios.js?v=20261127-ai-tutor8";
import {
  loadTutorState, updateTutorState, updateTutorPrefs, recordSessionStart,
  recordSpeakingSeconds, recordError, recordVocabUsage, recordTopicProgress,
  saveConversation, clearTutorHistory, normalizeWorkerUrl,
} from "./tutor-storage.js?v=20261127-ai-tutor8";
import {
  VoiceRecorder, blobToBase64, speakZh, stopSpeak,
  isVoiceInputSupported, DEFAULT_TTS_RATE, SLOW_TTS_RATE, MAX_AUDIO_BYTES,
} from "./voice-engine.js?v=20261127-ai-tutor8";

const CSS_HREF = "js/ai-tutor/tutor.css?v=20261127-ai-tutor8";
const CLIENT_TIMEOUT_MS = 45000; // > Worker Gemini timeout (40 s) so the app surfaces the Worker's own error JSON instead of aborting early

let cssLoaded = false;
function ensureCss() {
  if (cssLoaded) return;
  cssLoaded = true;
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = CSS_HREF;
  document.head.appendChild(link);
}

function newSessionId() {
  try { return crypto.randomUUID(); }
  catch { return `s-${Date.now()}-${Math.floor(Math.random() * 1e6)}`; }
}

function splitTranslateReply(translationVi) {
  const raw = String(translationVi || "").trim();
  if (!raw) return { subtitle: "", challenge: "" };
  const match = raw.match(/(?:🎯\s*)?(?:Câu(?:\s+tiếp\s+theo)?\s+cần\s+(?:nói(?:\s+sang\s+tiếng\s+Trung)?|dịch(?:\s+sang\s+tiếng\s+Trung)?))\s*[:：]\s*[“"']?([^”"\n]+)[”"']?/i);
  if (!match) return { subtitle: raw, challenge: "" };
  const challenge = match[1].trim();
  const subtitle = raw.replace(match[0], "").replace(/\n{2,}/g, "\n").trim();
  return { subtitle, challenge };
}

function parseThreeStepExplanation(text) {
  const raw = String(text || "").trim();
  if (!raw) return null;
  const m1 = raw.match(/\(1\)\s*(?:Ghi\s*nhận[^:：]*[:：]\s*)?([\s\S]*?)(?=\(2\)|$)/i);
  const m2 = raw.match(/\(2\)\s*(?:Sửa\s*lỗi[^:：]*|Nhận\s*xét[^:：]*[:：]\s*)?([\s\S]*?)$/i);
  if (!m1 && !m2) return null;
  return {
    step1: m1 ? m1[1].trim().replace(/^[:：\s]+/, "") : "",
    step2: m2 ? m2[1].trim().replace(/^[:：\s]+/, "") : "",
  };
}

function pickInitialLessonId({ queryLessonId, state, recentLessonId, recentLessonUpdatedAt, lexicon }) {
  const all = listLessons(lexicon);
  if (!all.length) return "";
  const has = (id) => id && all.some((l) => l.id === id);
  if (has(queryLessonId)) return queryLessonId;

  const savedId = state.prefs?.lessonId;
  const savedAt = state.prefs?.lessonUpdatedAt || "";
  if (has(recentLessonId) && (!has(savedId) || String(recentLessonUpdatedAt || "") > String(savedAt))) {
    return recentLessonId;
  }
  if (has(savedId)) return savedId;
  if (has(recentLessonId)) return recentLessonId;
  return all[0].id;
}

export async function mountTutor(main, ctx = {}) {
  const { esc, header, navActive, recentLessonId = "", recentLessonUpdatedAt = "", queryLessonId = "" } = ctx;
  ensureCss();
  navActive?.();

  let state = loadTutorState();
  let lexicon = null;
  let lexiconError = "";
  try { lexicon = await loadLexicon(); }
  catch { lexiconError = "Chưa tải được dữ liệu từ vựng của app — giáo viên AI vẫn chạy nhưng phần chọn bài và tra từ tại chỗ tạm tắt."; }
  if (!main.isConnected || !location.hash.startsWith("#/tutor")) return; // user already left

  const initialLessonId = pickInitialLessonId({ queryLessonId, state, recentLessonId, recentLessonUpdatedAt, lexicon });
  const initialCtx = initialLessonId ? getLessonContext(initialLessonId, lexicon) : null;
  const initialLevel = initialCtx?.current ? compactLevelCode(initialCtx.current.level) : "HSK1";
  const initialPracticeMode = PRACTICE_MODES.some((m) => m.id === state.prefs?.practiceMode) ? state.prefs.practiceMode : "teach";

  const session = {
    id: newSessionId(),
    startedAt: new Date().toISOString(),
    level: initialLevel,
    lessonId: initialLessonId,
    practiceMode: initialPracticeMode,
    mode: practiceModeInfo(initialPracticeMode).workerMode,
    scenarioId: "lesson-context", // default roleplay uses the selected lesson's own context
    pendingPromptVi: "",
    drillQueue: [],
    drillIndex: 0,
    drillFailedCurrent: false,
    drillRevealAnswer: false,
    turns: [], // {role, hanzi, pinyin, translation_vi, evaluation?, outOfLevel?, isOpening?, nextChallengeVi?, drillLabel?}
    started: false,
  };

  function initDrillDeck() {
    session.drillQueue = session.lessonId ? lessonTranslateSeeds(session.lessonId, lexicon) : [];
    session.drillIndex = 0;
    session.drillFailedCurrent = false;
    session.drillRevealAnswer = false;
    session.pendingPromptVi = session.practiceMode === "translate" ? (session.drillQueue[0]?.vi || "") : "";
  }
  initDrillDeck();

  const micSupported = isVoiceInputSupported();
  const recorder = new VoiceRecorder({
    onState: (st, extra) => onRecorderState(st, extra),
  });

  // In-flight guard: one tutor turn at a time.
  let sending = false;
  let hintsOpen = false;
  let setupOpen = !state.config.enabled || !state.config.workerUrl;

  const onHash = () => {
    if (!location.hash.startsWith("#/tutor")) {
      recorder.dispose();
      stopSpeak();
      window.removeEventListener("hashchange", onHash);
    }
  };
  window.addEventListener("hashchange", onHash);

  function lessonOptionsHtml(levelCode, selectedId) {
    if (!lexicon) return `<option value="">(Chưa tải được bài học)</option>`;
    const norm = normalizeLevel(levelCode);
    let lessons = listLessons(lexicon, norm);
    let prefixNote = "";
    if (!lessons.length && norm === "HSK 3") {
      lessons = listLessons(lexicon);
      prefixNote = "HSK 3 chưa có bài riêng — chọn tạm bài HSK 1–2";
    }
    const opts = lessons.map((l) => {
      const num = String(l.lessonNumber).padStart(2, "0");
      return `<option value="${esc(l.id)}" ${l.id === selectedId ? "selected" : ""}>${esc(l.level)} · Bài ${num}: ${esc(l.titleZh)} — ${esc(l.titleVi)}</option>`;
    });
    if (prefixNote) opts.unshift(`<option value="" ${!selectedId ? "selected" : ""}>${esc(prefixNote)}</option>`);
    return opts.join("");
  }

  function setupCardHtml(st) {
    return `<section class="card tutor-setup" id="t-setup-card" ${setupOpen ? "" : "hidden"}>
      <div class="tutor-setup-head">
        <h2>Cấu hình Giáo viên AI</h2>
        ${st.config.enabled && st.config.workerUrl ? `<button class="btn ghost small" type="button" id="t-close-setup">Thu gọn</button>` : ""}
      </div>
      <p class="muted small">Cơ chế API/Worker giữ nguyên để chạy ổn định trên GitHub Pages. API Key chỉ lưu ở Cloudflare Worker.</p>
      <label class="switch-row"><input type="checkbox" id="t-enabled" ${st.config.enabled ? "checked" : ""}> Bật module Giáo viên AI</label>
      <label class="tutor-field">Địa chỉ Worker (Worker URL)
        <input id="t-worker" type="url" inputmode="url" placeholder="https://hsk3-ai-tutor-proxy.…workers.dev" value="${esc(st.config.workerUrl)}">
      </label>
      <label class="tutor-field">Mã PIN (nếu Worker có đặt PIN)
        <input id="t-pin" type="password" autocomplete="off" value="${esc(st.config.accessPin)}">
      </label>
      <p class="muted small">Hướng dẫn triển khai Worker xem tại <strong>workers/ai-tutor-proxy/README.md</strong>.</p>
      <p class="row-actions">
        <button class="btn primary" id="t-save-config" type="button">Lưu cấu hình</button>
        <button class="btn ghost" id="t-clear-history" type="button">Xóa lịch sử AI Tutor</button>
      </p>
      <p id="t-config-msg" class="muted small"></p>
    </section>`;
  }

  main.innerHTML = `
  ${header("Giáo viên AI", "Luyện nói sư phạm theo từng bài giáo trình HSK 3.0")}
  <div id="tutor-root" class="${state.prefs.showPinyin ? "" : "hide-pinyin"} ${state.prefs.showVi ? "" : "hide-vi"}">
    ${setupCardHtml(state)}
    <section class="card tutor-controls" aria-label="Chọn bài học và chế độ luyện tập">
      <div class="tutor-selector-grid">
        <label class="tutor-select-level">Cấp độ
          <select id="t-level">
            ${["HSK1", "HSK2", "HSK3"].map((l) => `<option value="${l}" ${session.level === l ? "selected" : ""}>${l.replace("HSK", "HSK ")}</option>`).join("")}
          </select>
        </label>
        <label class="tutor-select-lesson">Bài học
          <select id="t-lesson">${lessonOptionsHtml(session.level, session.lessonId)}</select>
        </label>
      </div>

      <details class="tutor-lesson-brief" id="t-lesson-brief"></details>

      <div class="tutor-mode-wrap">
        <span class="tutor-section-label">Chế độ luyện tập</span>
        <div class="tutor-mode-grid" role="tablist" aria-label="4 chế độ luyện tập">
          ${PRACTICE_MODES.map((m) => `
            <button type="button" role="tab" class="tutor-mode-btn ${session.practiceMode === m.id ? "active" : ""}"
              aria-selected="${session.practiceMode === m.id ? "true" : "false"}" data-pmode="${m.id}">
              <span class="tutor-mode-icon" aria-hidden="true">${m.icon}</span>
              <span class="tutor-mode-name">${esc(m.label)}</span>
            </button>`).join("")}
        </div>
        <p class="muted small tutor-mode-desc" id="t-mode-desc"></p>
      </div>

      <div class="tutor-row" id="t-scenario-row" hidden>
        <label class="grow">Tình huống đóng vai
          <select id="t-scenario">
            <option value="lesson-context">Theo ngữ cảnh bài đang chọn (Mặc định)</option>
            ${SCENARIOS.map((s) => `<option value="${s.id}">${esc(s.titleVi)}</option>`).join("")}
          </select>
        </label>
      </div>
      <div id="t-scenario-info"></div>

      <div class="tutor-toolbar" aria-label="Tùy chọn hiển thị và phiên học">
        <button type="button" class="tutor-pill ${state.prefs.showPinyin ? "on" : ""}" id="t-toggle-global-pinyin" aria-pressed="${state.prefs.showPinyin ? "true" : "false"}">Pinyin</button>
        <button type="button" class="tutor-pill ${state.prefs.showVi ? "on" : ""}" id="t-toggle-global-vi" aria-pressed="${state.prefs.showVi ? "true" : "false"}">Nghĩa Việt</button>
        <button type="button" class="tutor-pill ${state.prefs.autoSpeak ? "on" : ""}" id="t-toggle-autospeak" aria-pressed="${state.prefs.autoSpeak ? "true" : "false"}">🔊 Tự đọc</button>
        <button type="button" class="tutor-pill" id="t-new-session">🔄 Phiên mới</button>
        <button type="button" class="tutor-pill" id="t-open-setup">⚙ Cấu hình</button>
      </div>

      <p class="muted small tutor-coverage" id="t-coverage"></p>
      ${lexiconError ? `<p class="feedback bad">${esc(lexiconError)}</p>` : ""}
    </section>

    <section class="card tutor-drill-card" id="t-drill-card" hidden aria-live="polite" aria-label="Câu phản xạ hiện tại"></section>
    <section class="tutor-chat" id="t-chat" aria-live="polite" aria-label="Hội thoại với giáo viên"></section>

    <div id="t-lookup" class="tutor-lookup" hidden></div>
    <section id="t-hints-panel" class="card tutor-hints-panel" hidden aria-label="Gợi ý câu trả lời"></section>

    <section class="tutor-dock" aria-label="Điều khiển nói và nhập câu">
      <p class="tutor-status" id="t-status" role="status"></p>
      <div class="tutor-dock-row">
        <button class="tutor-mic ${micSupported ? "" : "unsupported"}" id="t-mic" type="button"
          aria-label="${micSupported ? "Bấm để nói, bấm lần nữa để gửi" : "Trình duyệt chưa hỗ trợ ghi âm"}"
          ${micSupported ? "" : "disabled"}>🎙️</button>
        <form id="t-text-form" class="tutor-text-form">
          <input id="t-text" type="text" autocomplete="off" placeholder="Gõ tiếng Trung hoặc câu trả lời…" aria-label="Gõ câu trả lời">
          <button class="btn primary" type="submit">Gửi</button>
        </form>
      </div>
      <div class="tutor-dock-subrow">
        <button class="btn ghost small" id="t-hints-btn" type="button" aria-expanded="false">💡 Gợi ý</button>
        <button class="btn ghost small" id="t-next-drill" type="button" hidden>⏭️ Câu tiếp theo</button>
        <button class="btn ghost small" id="t-stop-tts" type="button" aria-label="Dừng đọc">■ Dừng đọc</button>
        <span class="muted small tutor-mic-note">${micSupported ? "Giọng đọc là giọng máy của thiết bị. Bấm 🎙️ để nói (tối đa 20 giây)." : "Trình duyệt chưa hỗ trợ ghi âm trực tiếp — hãy gõ hoặc dùng mic trên bàn phím."}</span>
      </div>
    </section>
  </div>`;

  const $ = (sel) => main.querySelector(sel);
  const rootEl = $("#tutor-root");
  const chatEl = $("#t-chat");
  const drillCard = $("#t-drill-card");
  const nextDrillBtn = $("#t-next-drill");
  const statusEl = $("#t-status");
  const micBtn = $("#t-mic");
  const hintsPanel = $("#t-hints-panel");
  const hintsBtn = $("#t-hints-btn");
  const setStatus = (t) => { statusEl.textContent = t || ""; };
  const currentDrill = () => session.drillQueue[session.drillIndex] || null;

  function bindSetup() {
    const saveBtn = $("#t-save-config");
    if (saveBtn) {
      saveBtn.onclick = () => {
        const enabled = $("#t-enabled").checked;
        const workerUrl = $("#t-worker").value.trim().replace(/\/+$/, "");
        const accessPin = $("#t-pin").value;
        state = updateTutorState((s) => { s.config = { enabled, workerUrl, accessPin }; });
        $("#t-config-msg").textContent = "Đã lưu cấu hình trên thiết bị này.";
        if (enabled && workerUrl) {
          setStatus("");
          setupOpen = false;
          const card = $("#t-setup-card");
          if (card) card.hidden = true;
        }
      };
    }
    const clearBtn = $("#t-clear-history");
    if (clearBtn) {
      clearBtn.onclick = () => {
        state = clearTutorHistory();
        $("#t-config-msg").textContent = "Đã xóa lịch sử, lỗi thường gặp và tiến độ của AI Tutor. Cấu hình Worker được giữ nguyên.";
      };
    }
    const closeBtn = $("#t-close-setup");
    if (closeBtn) {
      closeBtn.onclick = () => {
        setupOpen = false;
        $("#t-setup-card").hidden = true;
      };
    }
  }
  bindSetup();

  function activeRoleplayScenario() {
    if (session.practiceMode !== "roleplay") return null;
    if (session.scenarioId === "lesson-context") {
      return lessonRoleplayOpening(session.lessonId, lexicon) || SCENARIOS[0];
    }
    return scenarioById(session.scenarioId) || SCENARIOS[0];
  }

  function renderLessonBrief() {
    const el = $("#t-lesson-brief");
    const lctx = session.lessonId ? getLessonContext(session.lessonId, lexicon) : null;
    if (!lctx?.current) {
      el.hidden = true;
      return;
    }
    el.hidden = false;
    const cur = lctx.current;
    const prevText = lctx.prevLessons.length
      ? lctx.prevLessons.map((p) => `Bài ${String(p.lessonNumber).padStart(2, "0")}: ${p.titleZh}`).join(" · ")
      : "Bài mở đầu";
    const nextText = lctx.nextLesson
      ? `Bài ${String(lctx.nextLesson.lessonNumber).padStart(2, "0")}: ${lctx.nextLesson.titleZh} (${lctx.nextLesson.titleVi})`
      : "Chưa có bài tiếp theo";
    const mainKps = cur.knowledgePoints.filter((k) => k.kind !== "foundation" && k.kind !== "foundation-characters");

    el.innerHTML = `
      <summary>
        <span>📚 <strong>${esc(cur.level)} · Bài ${String(cur.lessonNumber).padStart(2, "0")}</strong>: ${esc(cur.titleZh)}</span>
        <span class="muted small">${cur.prepWords.length} từ · ${mainKps.length} ngữ pháp · ${cur.passages.length} hội thoại (chạm xem)</span>
      </summary>
      <div class="tutor-brief-body">
        ${cur.goalVi ? `<p><strong>Mục tiêu:</strong> ${esc(cur.goalVi)}</p>` : ""}
        ${cur.studyTipVi ? `<p class="tutor-trap-note"><strong>⚠ Bẫy cần tránh:</strong> ${esc(cur.studyTipVi)}</p>` : ""}
        <div class="tutor-brief-chips">
          ${cur.prepWords.map((w) => `<button type="button" class="tutor-word-chip" data-speak-word="${esc(w.zh)}" title="${esc(w.pinyin)} — ${esc(w.vi)}">
            <span lang="zh-CN">${esc(w.zh)}</span> <span class="muted small">${esc(w.vi)}</span>
          </button>`).join("")}
        </div>
        ${mainKps.length ? `<ul class="tutor-kp-list">${mainKps.map((k) => `<li><strong>${esc(k.title)}</strong>${k.pattern ? ` — <code>${esc(k.pattern)}</code>` : ""}</li>`).join("")}</ul>` : ""}
        <p class="muted small"><strong>Bài trước liên kết:</strong> ${esc(prevText)}<br><strong>Bài sau (chỉ gợi mở khi hỏi):</strong> ${esc(nextText)}</p>
      </div>`;

    el.querySelectorAll("[data-speak-word]").forEach((btn) => {
      btn.onclick = () => speakZh(btn.dataset.speakWord, { rate: DEFAULT_TTS_RATE, onStatus: setStatus });
    });
  }

  function scenarioInfoHtml() {
    if (session.practiceMode !== "roleplay") return "";
    const sc = activeRoleplayScenario();
    if (!sc) return "";
    const words = lexicon ? (sc.suggestedWords || []).filter((w) => lookupLocalWord(w, lexicon)) : (sc.suggestedWords || []);
    return `<div class="tutor-scenario-info">
      <p><strong>AI đóng vai:</strong> ${esc(sc.aiRoleVi)} · <strong>Bạn đóng vai:</strong> ${esc(sc.learnerRoleVi)}</p>
      ${sc.tasksVi?.length ? `<ol class="small">${sc.tasksVi.map((t) => `<li>${esc(t)}</li>`).join("")}</ol>` : ""}
      ${words.length ? `<p class="muted small">Từ gợi ý: ${words.map((w) => `<span lang="zh-CN">${esc(w)}</span>`).join(" · ")}</p>` : ""}
    </div>`;
  }

  function renderHintsPanel() {
    if (!hintsOpen) {
      hintsPanel.hidden = true;
      hintsBtn.setAttribute("aria-expanded", "false");
      return;
    }
    hintsPanel.hidden = false;
    hintsBtn.setAttribute("aria-expanded", "true");
    const lctx = session.lessonId ? getLessonContext(session.lessonId, lexicon) : null;

    if (session.practiceMode === "translate" && lctx?.current) {
      const drill = currentDrill();
      const canShowAnswer = Boolean(drill && (session.drillFailedCurrent || session.drillRevealAnswer));
      const words = lctx.current.prepWords.slice(0, 8);
      const kps = lctx.current.knowledgePoints.filter((k) => k.kind !== "foundation" && k.kind !== "foundation-characters");
      hintsPanel.innerHTML = `
        <div class="tutor-hints-head">
          <strong>💡 Gợi ý từ vựng & khung câu</strong>
          <button type="button" class="btn ghost small" id="t-close-hints">Đóng</button>
        </div>
        ${drill ? `<div class="tutor-drill-hint-box">
          <p class="muted small">Điểm luyện: <strong>${esc(drill.note)}</strong></p>
          ${canShowAnswer
            ? `<div class="tutor-hint-item">
                <div>
                  <div class="tutor-hint-zh" lang="zh-CN">${esc(drill.refZh)}</div>
                  ${drill.refPinyin ? `<div class="muted small">${esc(drill.refPinyin)}</div>` : ""}
                </div>
                <div class="tutor-hint-actions">
                  <button type="button" class="btn ghost small" data-hint-speak="${esc(drill.refZh)}">🔊</button>
                  <button type="button" class="btn ghost small" data-hint-fill="${esc(drill.refZh)}">↳ Dùng</button>
                </div>
              </div>`
            : `<p class="row-actions"><button type="button" class="btn ghost small" id="t-reveal-drill-answer">👀 Xem đáp án mẫu câu này</button></p>`}
        </div>` : ""}
        <div class="tutor-hints-list">
          ${words.map((w) => `<div class="tutor-hint-item">
            <div><strong lang="zh-CN">${esc(w.zh)}</strong> <span class="muted small">${esc(w.pinyin)} — ${esc(w.vi)}</span></div>
            <div class="tutor-hint-actions">
              <button type="button" class="btn ghost small" data-hint-speak="${esc(w.zh)}">🔊</button>
              <button type="button" class="btn ghost small" data-hint-fill="${esc(w.zh)}">↳ Chèn</button>
            </div>
          </div>`).join("")}
          ${kps.map((k) => k.pattern ? `<p class="muted small">Mẫu: <code>${esc(k.pattern)}</code></p>` : "").join("")}
        </div>`;
      const revealBtn = $("#t-reveal-drill-answer");
      if (revealBtn) {
        revealBtn.onclick = () => {
          session.drillRevealAnswer = true;
          renderHintsPanel();
        };
      }
    } else {
      const hints = lessonReplyHints(session.lessonId, session.practiceMode, lexicon);
      const sc = activeRoleplayScenario();
      const scWords = sc?.suggestedWords?.slice(0, 4).map((zh) => lookupLocalWord(zh, lexicon)).filter(Boolean) || [];
      hintsPanel.innerHTML = `
        <div class="tutor-hints-head">
          <strong>💡 Gợi ý câu trả lời theo bài</strong>
          <button type="button" class="btn ghost small" id="t-close-hints">Đóng</button>
        </div>
        ${hints.length ? `<div class="tutor-hints-list">
          ${hints.map((h) => `<div class="tutor-hint-item">
            <div>
              <div class="tutor-hint-zh" lang="zh-CN">${esc(h.zh)}</div>
              <div class="muted small">${h.pinyin ? `${esc(h.pinyin)} · ` : ""}${esc(h.vi)} <span class="tutor-hint-tag">${esc(h.tag)}</span></div>
            </div>
            <div class="tutor-hint-actions">
              <button type="button" class="btn ghost small" data-hint-speak="${esc(h.zh)}" aria-label="Nghe mẫu">🔊</button>
              <button type="button" class="btn ghost small" data-hint-fill="${esc(h.zh)}">↳ Dùng</button>
            </div>
          </div>`).join("")}
        </div>` : `<p class="muted small">Chưa có mẫu gợi ý cho bài này. Hãy gõ hoặc nói câu ngắn bằng từ đã học.</p>`}
        ${scWords.length ? `<p class="muted small">Từ nhanh: ${scWords.map((w) => `<button type="button" class="tutor-word-chip" data-hint-fill="${esc(w.zh)}"><span lang="zh-CN">${esc(w.zh)}</span> (${esc(w.vi)})</button>`).join(" ")}</p>` : ""}`;
    }

    $("#t-close-hints").onclick = () => { hintsOpen = false; renderHintsPanel(); };
    hintsPanel.querySelectorAll("[data-hint-speak]").forEach((b) => {
      b.onclick = () => speakZh(b.dataset.hintSpeak, { rate: DEFAULT_TTS_RATE, onStatus: setStatus });
    });
    hintsPanel.querySelectorAll("[data-hint-fill]").forEach((b) => {
      b.onclick = () => {
        const input = $("#t-text");
        input.value = input.value ? `${input.value.trim()} ${b.dataset.hintFill}` : b.dataset.hintFill;
        input.focus();
      };
    });
  }

  function renderDrillCard() {
    if (session.practiceMode !== "translate" || !session.drillQueue.length) {
      drillCard.hidden = true;
      nextDrillBtn.hidden = true;
      return;
    }
    drillCard.hidden = false;
    nextDrillBtn.hidden = false;
    const total = session.drillQueue.length;
    const drill = currentDrill();
    if (!drill) {
      drillCard.innerHTML = `
        <div class="tutor-drill-head">
          <span class="tutor-drill-badge">🎉 Hoàn thành ${total}/${total} câu</span>
        </div>
        <p class="tutor-drill-vi">Bạn đã dịch xong toàn bộ câu trọng tâm của bài này!</p>
        <p class="row-actions"><button type="button" class="btn primary small" id="t-restart-drill">🔄 Luyện lại từ câu 1</button></p>`;
      const restartBtn = $("#t-restart-drill");
      if (restartBtn) {
        restartBtn.onclick = () => {
          session.drillIndex = 0;
          session.drillFailedCurrent = false;
          session.drillRevealAnswer = false;
          session.pendingPromptVi = currentDrill()?.vi || "";
          renderDrillCard();
          if (hintsOpen) renderHintsPanel();
        };
      }
      return;
    }
    drillCard.innerHTML = `
      <div class="tutor-drill-head">
        <span class="tutor-drill-badge">⚡ Câu ${session.drillIndex + 1} / ${total}</span>
        <span class="muted small">${esc(drill.note)}</span>
      </div>
      <p class="tutor-drill-vi">${esc(drill.vi)}</p>
      <p class="muted small">${session.drillFailedCurrent ? "Hãy nghe câu sửa bên dưới và nói lại câu này, hoặc bấm ⏭️ Câu tiếp theo." : "Bấm 🎙️ nói hoặc gõ câu tiếng Trung tương ứng bên dưới."}</p>`;
  }

  function advanceDrillManual() {
    if (session.practiceMode !== "translate" || !session.drillQueue.length) return;
    session.drillIndex = (session.drillIndex + 1) % session.drillQueue.length;
    session.drillFailedCurrent = false;
    session.drillRevealAnswer = false;
    session.pendingPromptVi = currentDrill()?.vi || "";
    renderDrillCard();
    if (hintsOpen) renderHintsPanel();
    setStatus(`Đã chuyển sang câu ${session.drillIndex + 1}/${session.drillQueue.length}.`);
  }

  function refreshControls() {
    const info = practiceModeInfo(session.practiceMode);
    session.mode = info.workerMode;
    $("#t-mode-desc").textContent = info.desc;
    main.querySelectorAll("[data-pmode]").forEach((btn) => {
      const active = btn.dataset.pmode === session.practiceMode;
      btn.classList.toggle("active", active);
      btn.setAttribute("aria-selected", active ? "true" : "false");
    });
    $("#t-scenario-row").hidden = session.practiceMode !== "roleplay";
    $("#t-scenario-info").innerHTML = scenarioInfoHtml();
    $("#t-coverage").textContent = lexicon ? coverageNote(session.level, lexicon) : "";
    renderLessonBrief();
    renderDrillCard();
    if (hintsOpen) renderHintsPanel();
  }

  function startSession({ keepTurns = false } = {}) {
    session.id = newSessionId();
    session.startedAt = new Date().toISOString();
    if (!keepTurns) {
      session.turns = [];
      session.pendingPromptVi = "";
    }
    session.started = true;
    state = recordSessionStart();
    if (session.practiceMode === "roleplay" && !keepTurns) {
      const sc = activeRoleplayScenario();
      if (sc?.opening) {
        session.turns.push({
          role: "tutor",
          hanzi: sc.opening.hanzi,
          pinyin: sc.opening.pinyin,
          translation_vi: sc.opening.translation_vi,
          isOpening: true,
        });
      }
    }
    renderChat();
  }

  function endSession(save = true) {
    if (save && session.turns.some((t) => t.role === "user")) {
      saveConversation({
        sessionId: session.id,
        startedAt: session.startedAt,
        level: session.level,
        lessonId: session.lessonId || null,
        mode: session.mode,
        practiceMode: session.practiceMode,
        scenarioId: session.practiceMode === "roleplay" ? session.scenarioId : null,
        turns: session.turns,
      });
      if (session.practiceMode === "roleplay") recordTopicProgress(session.scenarioId, { turns: session.turns.length });
    }
  }

  function tokensHtml(hanzi) {
    if (!lexicon) return esc(hanzi);
    return segmentByLexicon(hanzi, lexicon).map((t) => t.entry
      ? `<button type="button" class="tutor-token" data-word="${esc(t.entry.hanzi)}" lang="zh-CN">${esc(t.text)}</button>`
      : `<span lang="zh-CN">${esc(t.text)}</span>`).join("");
  }

  function correctionHtml(ev, idx) {
    const parsed = parseThreeStepExplanation(ev.explanation_vi);
    const pronHtml = ev.pronunciation_status && ev.pronunciation_status !== "not_assessed" && ev.pronunciation_feedback_vi
      ? `<p>🎧 <strong>Phát âm:</strong> ${esc(ev.pronunciation_feedback_vi)}${ev.pronunciation_status === "uncertain" ? " (chưa đủ rõ để kết luận chắc chắn)" : ""}</p>`
      : "";

    if (parsed) {
      return `<div class="tutor-correction tutor-pedagogy-card ${ev.has_error ? "" : "ok"}" role="note" aria-label="Phản hồi sư phạm">
        ${parsed.step1 ? `<p><strong>(1) Ghi nhận ý đúng:</strong> ${esc(parsed.step1)}</p>` : ""}
        ${ev.has_error && ev.corrected_hanzi ? `<p><strong>Câu của bạn:</strong> <span lang="zh-CN">${esc(ev.original_hanzi || "")}</span>${ev.original_pinyin ? ` <span class="muted">(${esc(ev.original_pinyin)})</span>` : ""}</p>
        <p><strong>Câu chuẩn:</strong> <span lang="zh-CN">${esc(ev.corrected_hanzi)}</span> <span class="muted">(${esc(ev.corrected_pinyin)})</span></p>` : ""}
        ${parsed.step2 ? `<p><strong>(2) ${ev.has_error ? "Lỗi & liên kết bài" : "Nhận xét"}:</strong> ${esc(parsed.step2)}</p>` : ""}
        ${pronHtml}
        ${ev.corrected_hanzi ? `<p class="tutor-bubble-actions">
          <button class="btn small" type="button" data-speak-corrected="${idx}">🔊 Nghe câu chuẩn</button>
          <button class="btn primary small" type="button" data-retry="${idx}">🎙️ Nói lại câu này</button>
        </p>` : ""}
      </div>`;
    }

    if (!ev.has_error) {
      return ev.pronunciation_feedback_vi ? `<p class="tutor-pron-note">🎧 ${esc(ev.pronunciation_feedback_vi)}</p>` : "";
    }

    return `<div class="tutor-correction" role="note" aria-label="Thẻ sửa lỗi">
      <p><strong>Câu của bạn:</strong> <span lang="zh-CN">${esc(ev.original_hanzi || "")}</span>${ev.original_pinyin ? ` <span class="muted">(${esc(ev.original_pinyin)})</span>` : ""}</p>
      <p><strong>Câu sửa đúng:</strong> <span lang="zh-CN">${esc(ev.corrected_hanzi)}</span> <span class="muted">(${esc(ev.corrected_pinyin)})</span></p>
      ${ev.explanation_vi ? `<p>${esc(ev.explanation_vi)}</p>` : ""}
      ${pronHtml}
      <p class="tutor-bubble-actions">
        <button class="btn small" type="button" data-speak-corrected="${idx}">🔊 Nghe câu chuẩn</button>
        <button class="btn primary small" type="button" data-retry="${idx}">🎙️ Nói lại câu này</button>
      </p>
    </div>`;
  }

  function bubbleHtml(turn, idx) {
    const modeLabel = session.practiceMode === "roleplay" ? "Nhân vật" : "Giáo viên AI";
    const who = turn.role === "tutor" ? modeLabel : "Bạn";
    const ev = turn.evaluation;
    const isTranslateTutor = turn.role === "tutor" && session.practiceMode === "translate";
    const parsedTr = isTranslateTutor ? splitTranslateReply(turn.translation_vi) : { subtitle: turn.translation_vi || "", challenge: "" };
    const challengeText = turn.nextChallengeVi ?? parsedTr.challenge;
    const challengeLabel = turn.challengeLabel || "🎯 Câu cần nói sang tiếng Trung:";

    if (turn.role === "user") {
      return `<article class="tutor-bubble user">
        <p class="tutor-who">${who}</p>
        ${turn.hanzi ? `<p class="tutor-hanzi">${tokensHtml(turn.hanzi)}</p>` : ""}
        ${turn.pinyin ? `<p class="tutor-pinyin" data-pinyin>${esc(turn.pinyin)}</p>` : ""}
        ${turn.hanzi ? `<p class="tutor-bubble-actions">
          <button class="btn ghost small" type="button" data-speak="${idx}" data-rate="${DEFAULT_TTS_RATE}">🔊 Nghe</button>
          <button class="btn ghost small" type="button" data-speak="${idx}" data-rate="${SLOW_TTS_RATE}">🐢 Chậm</button>
        </p>` : ""}
        ${ev ? correctionHtml(ev, idx) : ""}
      </article>`;
    }

    const hasViPart = Boolean(parsedTr.subtitle || challengeText || (turn.outOfLevel?.length));
    return `<article class="tutor-bubble tutor">
      <p class="tutor-who">${who}</p>
      ${turn.hanzi ? `<div class="tutor-part-zh">
        <span class="tutor-part-label">a) Câu tiếng Trung để nghe & nói theo</span>
        <p class="tutor-hanzi">${tokensHtml(turn.hanzi)}</p>
        ${turn.pinyin ? `<p class="tutor-pinyin" data-pinyin>${esc(turn.pinyin)}</p>` : ""}
        <p class="tutor-bubble-actions">
          <button class="btn ghost small" type="button" data-speak="${idx}" data-rate="${DEFAULT_TTS_RATE}">🔊 Nghe</button>
          <button class="btn ghost small" type="button" data-speak="${idx}" data-rate="${SLOW_TTS_RATE}">🐢 Chậm</button>
          ${turn.pinyin ? `<button class="btn ghost small" type="button" data-toggle-pinyin="${idx}">Pinyin</button>` : ""}
          ${parsedTr.subtitle ? `<button class="btn ghost small" type="button" data-toggle-vi="${idx}">Nghĩa</button>` : ""}
        </p>
      </div>` : ""}
      ${hasViPart ? `<div class="tutor-part-vi">
        <span class="tutor-part-label">b) Nhận xét & hướng dẫn (tiếng Việt)</span>
        ${parsedTr.subtitle ? `<p class="tutor-vi tutor-vi-subtitle" data-vi>${esc(parsedTr.subtitle)}</p>` : ""}
        ${challengeText ? `<div class="tutor-challenge-box" role="note"><strong>${esc(challengeLabel)}</strong><p>${esc(challengeText)}</p></div>` : ""}
        ${turn.outOfLevel?.length ? `<p class="muted small">Từ vượt cấp đã dùng: ${turn.outOfLevel.map((w) => `${esc(w.hanzi)} (${esc(w.pinyin)} — ${esc(w.meaning_vi)})`).join("; ")}</p>` : ""}
      </div>` : ""}
    </article>`;
  }

  function emptyStateHtml() {
    const lctx = session.lessonId ? getLessonContext(session.lessonId, lexicon) : null;
    const cur = lctx?.current;
    const lessonTag = cur ? `${cur.level} · Bài ${String(cur.lessonNumber).padStart(2, "0")} (${cur.titleZh})` : session.level;

    if (session.practiceMode === "teach") {
      return `<section class="card tutor-empty">
        <p><strong>📖 Ôn & Dạy — ${esc(lessonTag)}</strong></p>
        <p class="muted small">Giáo viên sẽ tóm tắt ngắn gọn trọng tâm bài, liên hệ kiến thức bài trước và đặt câu hỏi để bạn trả lời.</p>
        <p class="row-actions">
          <button type="button" class="btn primary" id="t-start-teach">📖 Bắt đầu giảng bài này</button>
        </p>
      </section>`;
    }
    if (session.practiceMode === "correct") {
      const tasks = cur?.applyTasks || [];
      return `<section class="card tutor-empty">
        <p><strong>🩺 Kiểm tra & Sửa lỗi — ${esc(lessonTag)}</strong></p>
        <p class="muted small">Hãy nói hoặc gõ 1 câu tiếng Trung. Giáo viên luôn phản hồi theo 3 bước: <strong>(1) Ghi nhận ý đúng → (2) Chỉ lỗi & liên hệ bài cũ → (3) Câu tự nhiên hơn & mời lặp lại</strong>.</p>
        ${tasks.length ? `<div class="tutor-starter-chips">
          ${tasks.map((t) => `<button type="button" class="btn ghost small" data-quick-ask="${esc(`Kiểm tra giúp em nhiệm vụ "${t.titleVi}" (${t.promptVi}). Hãy ra đề ngắn bằng tiếng Việt để em đặt câu thử.`)}">📝 Thử: ${esc(t.titleVi)}</button>`).join("")}
        </div>` : `<p class="row-actions"><button type="button" class="btn primary" id="t-start-correct">📝 Ra đề đặt câu theo bài</button></p>`}
      </section>`;
    }
    if (session.practiceMode === "translate") {
      return `<section class="card tutor-empty">
        <p><strong>⚡ Phản xạ dịch nhanh — ${esc(lessonTag)}</strong></p>
        <p class="muted small">Hãy nhìn câu tiếng Việt ở khung phía trên rồi bấm 🎙️ nói hoặc gõ câu tiếng Trung tương ứng. Trả lời đúng hệ thống sẽ tự chuyển sang câu mới; hoặc bấm <strong>⏭️ Câu tiếp theo</strong> bất cứ lúc nào.</p>
      </section>`;
    }
    return `<section class="card tutor-empty"><p>Chọn tình huống rồi bấm micro hoặc gõ câu để bắt đầu nhập vai.</p></section>`;
  }

  function renderChat() {
    if (!session.turns.length) {
      chatEl.innerHTML = emptyStateHtml();
      const startTeach = $("#t-start-teach");
      if (startTeach) startTeach.onclick = () => void sendTextTurn("Em muốn ôn và học trọng tâm bài này. Thầy/cô giảng ngắn gọn, liên hệ bài trước và hỏi kiểm tra em nhé.");
      const startCorrect = $("#t-start-correct");
      if (startCorrect) startCorrect.onclick = () => void sendTextTurn("Hãy cho em một gợi ý ngắn để em đặt câu theo mẫu ngữ pháp bài này rồi thầy/cô sửa giúp em.");
      chatEl.querySelectorAll("[data-quick-ask]").forEach((b) => {
        b.onclick = () => void sendTextTurn(b.dataset.quickAsk);
      });
      return;
    }

    chatEl.innerHTML = session.turns.map((t, i) => bubbleHtml(t, i)).join("");
    bindBubbles();
    chatEl.lastElementChild?.scrollIntoView({ block: "nearest" });
  }

  function bindBubbles() {
    chatEl.querySelectorAll("[data-speak]").forEach((b) => {
      b.onclick = () => {
        const turn = session.turns[Number(b.dataset.speak)];
        if (turn) speakZh(turn.hanzi, { rate: Number(b.dataset.rate), onStatus: setStatus });
      };
    });
    chatEl.querySelectorAll("[data-speak-corrected]").forEach((b) => {
      b.onclick = () => {
        const turn = session.turns[Number(b.dataset.speakCorrected)];
        if (turn?.evaluation?.corrected_hanzi) speakZh(turn.evaluation.corrected_hanzi, { rate: DEFAULT_TTS_RATE, onStatus: setStatus });
      };
    });
    chatEl.querySelectorAll("[data-toggle-pinyin]").forEach((b) => {
      b.onclick = () => {
        const bubble = b.closest(".tutor-bubble");
        const p = bubble?.querySelector("[data-pinyin]");
        if (!p) return;
        if (rootEl.classList.contains("hide-pinyin")) p.classList.toggle("force-show");
        else p.classList.toggle("hidden");
      };
    });
    chatEl.querySelectorAll("[data-toggle-vi]").forEach((b) => {
      b.onclick = () => {
        const bubble = b.closest(".tutor-bubble");
        const v = bubble?.querySelector("[data-vi]");
        if (!v) return;
        if (rootEl.classList.contains("hide-vi")) v.classList.toggle("force-show");
        else v.classList.toggle("hidden");
      };
    });
    chatEl.querySelectorAll("[data-retry]").forEach((b) => {
      b.onclick = () => {
        const turn = session.turns[Number(b.dataset.retry)];
        const target = turn?.evaluation?.corrected_hanzi;
        if (target) setStatus(`Hãy bấm micro và nói lại câu: ${target}`);
        if (micSupported) micBtn.focus();
        else $("#t-text").focus();
      };
    });
    chatEl.querySelectorAll("[data-word]").forEach((b) => {
      b.onclick = () => showLookup(b.dataset.word);
    });
  }

  function showLookup(hanzi) {
    const entry = lookupLocalWord(hanzi, lexicon);
    const box = $("#t-lookup");
    if (!entry) { box.hidden = true; return; }
    box.innerHTML = `<p><strong lang="zh-CN">${esc(entry.hanzi)}</strong> · ${esc(entry.pinyin)}${entry.hanViet ? ` · Hán–Việt: ${esc(entry.hanViet)}` : ""}</p>
      <p>${esc(entry.meaning_vi)} <span class="muted small">(${esc(entry.level)} · theo giáo trình)</span></p>
      <p class="tutor-bubble-actions"><button class="btn ghost small" type="button" id="t-lookup-speak">🔊 Nghe từ này</button>
      <button class="btn ghost small" type="button" id="t-lookup-close">Đóng</button></p>`;
    box.hidden = false;
    $("#t-lookup-speak").onclick = () => speakZh(entry.hanzi, { rate: DEFAULT_TTS_RATE, onStatus: setStatus });
    $("#t-lookup-close").onclick = () => { box.hidden = true; };
  }

  function onRecorderState(st, extra) {
    if (st === "requesting") setStatus("Đang xin quyền micro…");
    else if (st === "recording") { micBtn.classList.add("recording"); micBtn.textContent = "⏺"; setStatus(`Đang nghe… ${extra.seconds || 0}s (tối đa 20s, bấm lần nữa để gửi)`); }
    else if (st === "error") { micBtn.classList.remove("recording"); micBtn.textContent = "🎙️"; setStatus(extra.message || "Có lỗi với micro."); }
    else if (st === "stopped") {
      micBtn.classList.remove("recording"); micBtn.textContent = "🎙️";
      if (extra.blob) {
        state = recordSpeakingSeconds(extra.seconds || 0);
        void sendAudioTurn(extra.blob, extra.blobUrl);
      }
    } else if (st === "idle") { micBtn.classList.remove("recording"); micBtn.textContent = "🎙️"; }
  }

  function ensureReady() {
    state = loadTutorState();
    if (!state.config.enabled) {
      setupOpen = true;
      const card = $("#t-setup-card");
      if (card) card.hidden = false;
      setStatus("Module đang tắt. Bật 'Giáo viên AI' ở phần cấu hình phía trên (hoặc trong Cài đặt) trước nhé.");
      return false;
    }
    if (!state.config.workerUrl) {
      setupOpen = true;
      const card = $("#t-setup-card");
      if (card) card.hidden = false;
      setStatus("Chưa cấu hình Worker URL. Nhập địa chỉ Worker ở phần cấu hình phía trên (hoặc trong Cài đặt) rồi thử lại.");
      return false;
    }
    return true;
  }

  async function callTutor(payload) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), CLIENT_TIMEOUT_MS);
    let res;
    try {
      res = await fetch(`${normalizeWorkerUrl(state.config.workerUrl)}/api/tutor-turn`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(state.config.accessPin ? { "X-Tutor-Pin": state.config.accessPin } : {}),
        },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });
    } catch (e) {
      if (e?.name === "AbortError") throw new Error("AI phản hồi quá chậm. Kiểm tra mạng rồi thử lại nhé.");
      throw new Error("Mất mạng hoặc chưa nối được tới Worker. Kiểm tra kết nối rồi thử lại.");
    } finally { clearTimeout(timer); }
    let data = null;
    try { data = await res.json(); } catch { /* handled below */ }
    if (!res.ok || !data?.ok) {
      throw new Error(data?.error || `Worker trả lỗi (${res.status}). Thử lại sau ít phút.`);
    }
    return data;
  }

  async function handleResult(data, { myBlobUrl = null, fallbackUserText = "" } = {}) {
    const ev = data.evaluation || {};
    const userHanzi = data.user_transcript_hanzi || fallbackUserText || "";
    const userTurn = {
      role: "user",
      hanzi: userHanzi,
      pinyin: data.user_transcript_pinyin || "",
      translation_vi: "",
      evaluation: ev.has_error ? {
        ...ev,
        original_hanzi: userHanzi,
        original_pinyin: data.user_transcript_pinyin || "",
      } : ((ev.pronunciation_feedback_vi || ev.explanation_vi) ? {
        has_error: false,
        explanation_vi: ev.explanation_vi || "",
        pronunciation_status: ev.pronunciation_status || "not_assessed",
        pronunciation_feedback_vi: ev.pronunciation_feedback_vi || "",
      } : null),
      audioUrl: myBlobUrl,
    };
    if (userTurn.hanzi) session.turns.push(userTurn);
    const reply = data.tutor_reply || {};
    let tutorHanzi = reply.hanzi || "";
    let tutorPinyin = reply.pinyin || "";
    let tutorTranslationVi = reply.translation_vi || "";
    let nextChallengeVi = "";
    let challengeLabel = "";

    if (session.practiceMode === "translate") {
      const passed = resolveDrillPassed(data);
      const parsedTr = splitTranslateReply(tutorTranslationVi);
      tutorTranslationVi = parsedTr.subtitle || tutorTranslationVi;

      if (passed) {
        // Learner answered right: advance drillIndex in CODE (never rely on AI to pick next)
        if (session.drillIndex < session.drillQueue.length) {
          session.drillIndex += 1;
        }
        session.drillFailedCurrent = false;
        session.drillRevealAnswer = false;
        const nextDrill = currentDrill();
        session.pendingPromptVi = nextDrill?.vi || "";
        // Anti-leak: when passed, part (a) ONLY praises/confirms the old sentence; never leak next sentence
        if (!tutorHanzi) { tutorHanzi = "对，很好！"; tutorPinyin = "Duì, hěn hǎo!"; }
        if (nextDrill) {
          nextChallengeVi = nextDrill.vi;
          challengeLabel = `🎯 Câu ${session.drillIndex + 1}/${session.drillQueue.length} cần nói sang tiếng Trung:`;
        } else {
          nextChallengeVi = "Bạn đã hoàn thành toàn bộ câu của bài này!";
          challengeLabel = "🎉 Hoàn thành bài phản xạ:";
        }
      } else {
        // Learner made a mistake: stay on current question so they can repeat it
        session.drillFailedCurrent = true;
        const curDrill = currentDrill();
        session.pendingPromptVi = curDrill?.vi || "";
        if (!tutorHanzi && (ev.corrected_hanzi || curDrill?.refZh)) {
          tutorHanzi = ev.corrected_hanzi || curDrill.refZh;
          tutorPinyin = ev.corrected_pinyin || curDrill?.refPinyin || "";
        }
        if (curDrill) {
          nextChallengeVi = curDrill.vi;
          challengeLabel = `🔁 Thử nói lại câu ${session.drillIndex + 1}/${session.drillQueue.length}:`;
        }
      }
      renderDrillCard();
      if (hintsOpen) renderHintsPanel();
    } else {
      session.pendingPromptVi = "";
    }

    session.turns.push({
      role: "tutor",
      hanzi: tutorHanzi,
      pinyin: tutorPinyin,
      translation_vi: tutorTranslationVi,
      nextChallengeVi,
      challengeLabel,
      outOfLevel: Array.isArray(reply.out_of_level_words) ? reply.out_of_level_words : [],
    });
    if (ev.has_error) {
      state = recordError({
        error_type: ev.error_type, original_hanzi: userTurn.hanzi, original_pinyin: userTurn.pinyin,
        corrected_hanzi: ev.corrected_hanzi, corrected_pinyin: ev.corrected_pinyin,
        explanation_vi: ev.explanation_vi, pronunciation_status: ev.pronunciation_status,
        pronunciation_feedback_vi: ev.pronunciation_feedback_vi,
      });
    }
    if (lexicon) {
      const used = new Set();
      for (const t of [userTurn.hanzi, reply.hanzi]) {
        for (const tok of segmentByLexicon(t || "", lexicon)) if (tok.entry) used.add(tok.entry.hanzi);
      }
      if (used.size) state = recordVocabUsage([...used]);
    }
    endSession(true);
    session.started = true;
    renderChat();
    setStatus("");
    if (tutorHanzi && state.prefs.autoSpeak) speakZh(tutorHanzi, { rate: DEFAULT_TTS_RATE, onStatus: setStatus });
  }

  function buildPayload(extra) {
    const scenarioObj = session.practiceMode === "roleplay" ? activeRoleplayScenario() : null;
    const curDrill = session.practiceMode === "translate" ? currentDrill() : null;
    return {
      sessionId: session.id,
      level: session.level,
      mode: session.mode,
      scenarioId: session.practiceMode === "roleplay" ? (session.scenarioId === "lesson-context" ? `lesson-${session.lessonId}` : session.scenarioId) : undefined,
      systemInstruction: buildSystemInstruction({
        level: session.level,
        mode: session.mode,
        practiceMode: session.practiceMode,
        lessonId: session.lessonId,
        scenario: scenarioObj,
        pendingPromptVi: session.practiceMode === "translate" ? (curDrill?.vi || session.pendingPromptVi) : "",
        expectedAnswerZh: session.practiceMode === "translate" ? (curDrill?.refZh || "") : "",
        lexicon,
      }),
      history: session.turns.slice(-10).map((t) => ({ role: t.role, hanzi: t.hanzi })),
      ...extra,
    };
  }

  let waitTimer = null;
  function startWait(kind) {
    const t0 = Date.now();
    const render = () => {
      const s = Math.floor((Date.now() - t0) / 1000);
      if (s < 2) setStatus("Đang kết nối tới máy chủ AI…");
      else if (s < 10) setStatus(`AI đang suy nghĩ… (${s} giây)`);
      else setStatus(`AI vẫn đang xử lý${kind === "audio" ? " giọng nói" : ""} — bạn chờ thêm chút nhé… (${s} giây)`);
    };
    render();
    waitTimer = setInterval(render, 500);
  }
  function stopWait() { if (waitTimer) { clearInterval(waitTimer); waitTimer = null; } }
  function showDuration(data) {
    const ms = data?.timings?.geminiMs;
    if (typeof ms === "number" && ms > 0) setStatus(`Gemini đã xử lý trong ${(ms / 1000).toFixed(1)} giây.`);
  }

  async function sendTextTurn(text) {
    if (sending) return;
    if (!ensureReady()) return;
    if (!session.started) startSession({ keepTurns: true });
    sending = true;
    startWait("text");
    try {
      const data = await callTutor(buildPayload({ userText: text }));
      stopWait();
      await handleResult(data, { fallbackUserText: text });
      showDuration(data);
    } catch (e) { stopWait(); setStatus(e.message || "Có lỗi. Thử lại nhé."); }
    finally { stopWait(); sending = false; }
  }

  async function sendAudioTurn(blob, blobUrl) {
    if (sending) { setStatus("Đang chờ AI trả lời câu trước…"); return; }
    if (!ensureReady()) return;
    if (blob.size > MAX_AUDIO_BYTES) {
      setStatus("Bản ghi quá dài/nặng. Hãy nói câu ngắn hơn (tối đa 20 giây).");
      return;
    }
    if (!session.started) startSession({ keepTurns: true });
    sending = true;
    startWait("audio");
    try {
      const base64 = await blobToBase64(blob);
      const data = await callTutor(buildPayload({
        userAudioBase64: base64,
        audioMimeType: (blob.type || "audio/webm").split(";")[0],
      }));
      stopWait();
      await handleResult(data, { myBlobUrl: blobUrl });
      showDuration(data);
      const lastUser = [...session.turns].reverse().find((t) => t.role === "user");
      if (lastUser && blobUrl) {
        const idx = session.turns.indexOf(lastUser);
        const bubble = chatEl.children[idx];
        if (bubble) {
          const p = document.createElement("p");
          p.className = "tutor-bubble-actions";
          p.innerHTML = `<button class="btn ghost small" type="button">▶ Nghe giọng mình</button>`;
          p.querySelector("button").onclick = () => { const a = new Audio(blobUrl); void a.play().catch(() => setStatus("Chưa phát lại được bản ghi.")); };
          bubble.appendChild(p);
        }
      }
    } catch (e) { stopWait(); setStatus(e.message || "Có lỗi. Thử lại nhé."); }
    finally { stopWait(); sending = false; }
  }

  function hasLearnerTurns() {
    return session.turns.some((t) => t.role === "user");
  }

  function resetCurrentSession({ startOpening = false } = {}) {
    endSession(true);
    session.turns = [];
    session.started = false;
    hintsOpen = false;
    initDrillDeck();
    refreshControls();
    renderHintsPanel();
    if (startOpening || session.practiceMode === "roleplay") startSession();
    else renderChat();
  }

  // ---- controls wiring ----
  $("#t-level").onchange = (e) => {
    const newLevel = e.target.value;
    if (hasLearnerTurns() && !window.confirm("Đổi cấp độ sẽ kết thúc phiên hiện tại và bắt đầu bài mới. Tiếp tục?")) {
      e.target.value = session.level;
      return;
    }
    session.level = newLevel;
    const levelLessons = listLessons(lexicon, normalizeLevel(newLevel));
    const nextLesson = levelLessons.length ? levelLessons[0].id : (listLessons(lexicon)[0]?.id || "");
    session.lessonId = nextLesson;
    $("#t-lesson").innerHTML = lessonOptionsHtml(newLevel, nextLesson);
    state = updateTutorPrefs({ lessonId: nextLesson, lessonUpdatedAt: new Date().toISOString() });
    resetCurrentSession();
  };

  $("#t-lesson").onchange = (e) => {
    const newLessonId = e.target.value;
    if (hasLearnerTurns() && !window.confirm("Đổi bài học sẽ kết thúc phiên hiện tại và nạp ngữ cảnh bài mới. Tiếp tục?")) {
      e.target.value = session.lessonId;
      return;
    }
    session.lessonId = newLessonId;
    const lctx = newLessonId ? getLessonContext(newLessonId, lexicon) : null;
    if (lctx?.current && session.level !== "HSK3") {
      session.level = compactLevelCode(lctx.current.level);
      $("#t-level").value = session.level;
    }
    state = updateTutorPrefs({ lessonId: newLessonId, lessonUpdatedAt: new Date().toISOString() });
    resetCurrentSession();
  };

  main.querySelectorAll("[data-pmode]").forEach((btn) => {
    btn.onclick = () => {
      const nextMode = btn.dataset.pmode;
      if (nextMode === session.practiceMode) return;
      if (hasLearnerTurns() && !window.confirm("Đổi chế độ luyện tập sẽ bắt đầu phiên mới. Tiếp tục?")) return;
      session.practiceMode = nextMode;
      state = updateTutorPrefs({ practiceMode: nextMode });
      resetCurrentSession();
    };
  });

  $("#t-scenario").onchange = (e) => {
    if (hasLearnerTurns() && !window.confirm("Đổi tình huống sẽ bắt đầu ngữ cảnh nhập vai mới. Tiếp tục?")) {
      e.target.value = session.scenarioId;
      return;
    }
    session.scenarioId = e.target.value;
    resetCurrentSession({ startOpening: true });
  };

  $("#t-toggle-global-pinyin").onclick = (e) => {
    const next = !state.prefs.showPinyin;
    state = updateTutorPrefs({ showPinyin: next });
    rootEl.classList.toggle("hide-pinyin", !next);
    e.currentTarget.classList.toggle("on", next);
    e.currentTarget.setAttribute("aria-pressed", next ? "true" : "false");
  };

  $("#t-toggle-global-vi").onclick = (e) => {
    const next = !state.prefs.showVi;
    state = updateTutorPrefs({ showVi: next });
    rootEl.classList.toggle("hide-vi", !next);
    e.currentTarget.classList.toggle("on", next);
    e.currentTarget.setAttribute("aria-pressed", next ? "true" : "false");
  };

  $("#t-toggle-autospeak").onclick = (e) => {
    const next = !state.prefs.autoSpeak;
    state = updateTutorPrefs({ autoSpeak: next });
    e.currentTarget.classList.toggle("on", next);
    e.currentTarget.setAttribute("aria-pressed", next ? "true" : "false");
    if (!next) stopSpeak();
  };

  $("#t-new-session").onclick = () => {
    if (hasLearnerTurns() && !window.confirm("Bắt đầu phiên luyện nói mới?")) return;
    resetCurrentSession();
  };

  $("#t-open-setup").onclick = () => {
    setupOpen = !setupOpen;
    const card = $("#t-setup-card");
    if (card) card.hidden = !setupOpen;
  };

  hintsBtn.onclick = () => {
    hintsOpen = !hintsOpen;
    renderHintsPanel();
  };

  nextDrillBtn.onclick = () => advanceDrillManual();

  micBtn.onclick = async () => {
    if (!micSupported) return;
    if (!ensureReady()) return;
    if (recorder.recording) { recorder.stop(); return; }
    stopSpeak();
    await recorder.start();
  };

  $("#t-stop-tts").onclick = () => { stopSpeak(); setStatus(""); };

  $("#t-text-form").onsubmit = (e) => {
    e.preventDefault();
    const input = $("#t-text");
    const text = input.value.trim();
    if (!text) return;
    input.value = "";
    void sendTextTurn(text);
  };

  refreshControls();
  if (session.practiceMode === "roleplay") startSession();
  else renderChat();
}
