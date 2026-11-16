// AI Tutor view — lazy-loaded ONLY when the user opens #/tutor.
// Everything the module needs lives under js/ai-tutor/; the host app only
// registers the route and calls mountTutor().

import {
  loadLexicon, lookupLocalWord, buildSystemInstruction, segmentByLexicon, coverageNote, normalizeLevel,
} from "./hsk-guardrail.js?v=20261116-ai-tutor1";
import { SCENARIOS, scenarioById } from "./roleplay-scenarios.js?v=20261116-ai-tutor1";
import {
  loadTutorState, updateTutorState, recordSessionStart, recordSpeakingSeconds,
  recordError, recordVocabUsage, recordTopicProgress, saveConversation, clearTutorHistory,
} from "./tutor-storage.js?v=20261116-ai-tutor1";
import { VoiceRecorder, blobToBase64, speakZh, stopSpeak, MAX_AUDIO_BYTES } from "./voice-engine.js?v=20261116-ai-tutor1";

const CSS_HREF = "js/ai-tutor/tutor.css?v=20261116-ai-tutor1";
const CLIENT_TIMEOUT_MS = 30000;

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

export async function mountTutor(main, ctx) {
  const { esc, header, navActive } = ctx;
  ensureCss();
  navActive?.();

  let state = loadTutorState();
  let lexicon = null;
  let lexiconError = "";
  try { lexicon = await loadLexicon(); }
  catch { lexiconError = "Chưa tải được dữ liệu từ vựng của app — giáo viên AI vẫn chạy nhưng phần tra từ tại chỗ và đếm từ vựng tạm tắt."; }
  if (!main.isConnected || !location.hash.startsWith("#/tutor")) return; // user already left

  const session = {
    id: newSessionId(),
    startedAt: new Date().toISOString(),
    level: "HSK1",
    mode: "tutor",
    scenarioId: SCENARIOS[0].id,
    turns: [], // {role, hanzi, pinyin, translation_vi, evaluation?}
    started: false,
  };

  const recorder = new VoiceRecorder({
    onState: (st, extra) => onRecorderState(st, extra),
  });

  // Leaving the route must release the mic, TTS and blob URLs.
  const onHash = () => {
    if (!location.hash.startsWith("#/tutor")) {
      recorder.dispose();
      stopSpeak();
      window.removeEventListener("hashchange", onHash);
    }
  };
  window.addEventListener("hashchange", onHash);

  main.innerHTML = `
  ${header("Giáo viên AI", "Luyện nói hội thoại theo đúng vốn từ giáo trình HSK 3.0")}
  <div id="tutor-root">
    ${!state.config.enabled ? setupHtml(state, esc, "Module đang tắt. Bật lên và cấu hình Worker để bắt đầu luyện nói.") : ""}
    <section class="card tutor-controls" aria-label="Chọn cấp độ và chế độ">
      <div class="tutor-row">
        <label>Cấp độ
          <select id="t-level">
            ${["HSK1", "HSK2", "HSK3"].map((l) => `<option value="${l}" ${session.level === l ? "selected" : ""}>${l.replace("HSK", "HSK ")}</option>`).join("")}
          </select>
        </label>
        <label>Chế độ
          <select id="t-mode">
            <option value="tutor" selected>Giáo viên AI</option>
            <option value="roleplay">Hội thoại nhập vai</option>
          </select>
        </label>
      </div>
      <div class="tutor-row" id="t-scenario-row" hidden>
        <label class="grow">Tình huống
          <select id="t-scenario">
            ${SCENARIOS.map((s) => `<option value="${s.id}">${esc(s.titleVi)}</option>`).join("")}
          </select>
        </label>
      </div>
      <div id="t-scenario-info"></div>
      <p class="muted small" id="t-coverage"></p>
      ${lexiconError ? `<p class="feedback bad">${esc(lexiconError)}</p>` : ""}
    </section>
    <section class="tutor-chat" id="t-chat" aria-live="polite" aria-label="Hội thoại"></section>
    <div id="t-lookup" class="tutor-lookup" hidden></div>
    <section class="tutor-dock" aria-label="Điều khiển nói">
      <p class="tutor-status" id="t-status" role="status"></p>
      <div class="tutor-dock-row">
        <button class="btn ghost tutor-stop" id="t-stop-tts" type="button" aria-label="Dừng đọc">■ Dừng</button>
        <button class="tutor-mic" id="t-mic" type="button" aria-label="Bấm để nói, bấm lần nữa để gửi">🎙️</button>
        <form id="t-text-form" class="tutor-text-form">
          <input id="t-text" type="text" autocomplete="off" placeholder="Hoặc gõ câu tiếng Trung…" aria-label="Gõ câu tiếng Trung">
          <button class="btn primary" type="submit">Gửi</button>
        </form>
      </div>
      <p class="muted small">Giọng đọc là giọng máy của thiết bị. Âm thanh bạn ghi chỉ gửi tới AI khi bạn bấm gửi và không lưu trên máy.</p>
    </section>
  </div>`;

  const $ = (sel) => main.querySelector(sel);
  const chatEl = $("#t-chat");
  const statusEl = $("#t-status");
  const micBtn = $("#t-mic");
  const setStatus = (t) => { statusEl.textContent = t || ""; };

  function setupHtml(st, escFn, note) {
    return `<section class="card tutor-setup">
      <h2>Cấu hình Giáo viên AI</h2>
      <p class="muted">${escFn(note)}</p>
      <label class="switch-row"><input type="checkbox" id="t-enabled" ${st.config.enabled ? "checked" : ""}> Bật module Giáo viên AI</label>
      <label class="tutor-field">Địa chỉ Worker (Worker URL)
        <input id="t-worker" type="url" inputmode="url" placeholder="https://hsk3-ai-tutor-proxy.…workers.dev" value="${escFn(st.config.workerUrl)}">
      </label>
      <label class="tutor-field">Mã PIN (nếu Worker có đặt PIN)
        <input id="t-pin" type="password" autocomplete="off" value="${escFn(st.config.accessPin)}">
      </label>
      <p class="muted small">PIN lưu trên thiết bị này không phải bí mật tuyệt đối — chỉ là cổng chống lạm dụng chi phí. Chưa có Worker? Xem hướng dẫn trong <strong>workers/ai-tutor-proxy/README.md</strong> của repo.</p>
      <p class="row-actions"><button class="btn primary" id="t-save-config" type="button">Lưu cấu hình</button>
      <button class="btn ghost" id="t-clear-history" type="button">Xóa lịch sử AI Tutor</button></p>
      <p id="t-config-msg" class="muted small"></p>
    </section>`;
  }

  function bindSetup() {
    const saveBtn = $("#t-save-config");
    if (!saveBtn) return;
    saveBtn.onclick = () => {
      const enabled = $("#t-enabled").checked;
      const workerUrl = $("#t-worker").value.trim().replace(/\/+$/, "");
      const accessPin = $("#t-pin").value;
      state = updateTutorState((s) => { s.config = { enabled, workerUrl, accessPin }; });
      $("#t-config-msg").textContent = "Đã lưu cấu hình trên thiết bị này.";
      if (enabled) setStatus("");
    };
    $("#t-clear-history").onclick = () => {
      state = clearTutorHistory();
      $("#t-config-msg").textContent = "Đã xóa lịch sử, lỗi thường gặp và tiến độ của AI Tutor. Cấu hình Worker được giữ nguyên.";
    };
  }
  bindSetup();

  function scenarioInfoHtml() {
    if (session.mode !== "roleplay") return "";
    const sc = scenarioById(session.scenarioId);
    if (!sc) return "";
    const words = lexicon ? sc.suggestedWords.filter((w) => lookupLocalWord(w, lexicon)) : sc.suggestedWords;
    return `<div class="tutor-scenario-info">
      <p><strong>AI đóng vai:</strong> ${esc(sc.aiRoleVi)} · <strong>Bạn đóng vai:</strong> ${esc(sc.learnerRoleVi)}</p>
      <p><strong>3 nhiệm vụ:</strong></p>
      <ol>${sc.tasksVi.map((t) => `<li>${esc(t)}</li>`).join("")}</ol>
      ${words.length ? `<p class="muted small">Từ gợi ý của giáo trình: ${words.map((w) => `<span lang="zh-CN">${esc(w)}</span>`).join(" · ")}</p>` : ""}
    </div>`;
  }

  function refreshControls() {
    $("#t-scenario-row").hidden = session.mode !== "roleplay";
    $("#t-scenario-info").innerHTML = scenarioInfoHtml();
    $("#t-coverage").textContent = lexicon ? coverageNote(session.level, lexicon) : "";
  }

  function startSession({ keepTurns = false } = {}) {
    session.id = newSessionId();
    session.startedAt = new Date().toISOString();
    if (!keepTurns) session.turns = [];
    session.started = true;
    state = recordSessionStart();
    if (session.mode === "roleplay") {
      const sc = scenarioById(session.scenarioId);
      if (sc && !keepTurns) {
        session.turns.push({ role: "tutor", hanzi: sc.opening.hanzi, pinyin: sc.opening.pinyin, translation_vi: sc.opening.translation_vi });
      }
    }
    renderChat();
  }

  function endSession(save = true) {
    if (save && session.turns.length) {
      saveConversation({
        sessionId: session.id, startedAt: session.startedAt,
        level: session.level, mode: session.mode,
        scenarioId: session.mode === "roleplay" ? session.scenarioId : null,
        turns: session.turns,
      });
      if (session.mode === "roleplay") recordTopicProgress(session.scenarioId, { turns: session.turns.length });
    }
  }

  function tokensHtml(hanzi) {
    if (!lexicon) return esc(hanzi);
    return segmentByLexicon(hanzi, lexicon).map((t) => t.entry
      ? `<button type="button" class="tutor-token" data-word="${esc(t.entry.hanzi)}" lang="zh-CN">${esc(t.text)}</button>`
      : `<span lang="zh-CN">${esc(t.text)}</span>`).join("");
  }

  function bubbleHtml(turn, idx) {
    const who = turn.role === "tutor" ? (session.mode === "roleplay" ? "Nhân vật" : "Giáo viên AI") : "Bạn";
    const ev = turn.evaluation;
    return `<article class="tutor-bubble ${turn.role}">
      <p class="tutor-who">${who}</p>
      <p class="tutor-hanzi">${tokensHtml(turn.hanzi)}</p>
      ${turn.pinyin ? `<p class="tutor-pinyin" data-pinyin>${esc(turn.pinyin)}</p>` : ""}
      ${turn.translation_vi ? `<p class="tutor-vi">${esc(turn.translation_vi)}</p>` : ""}
      <p class="tutor-bubble-actions">
        <button class="btn ghost small" type="button" data-speak="${idx}" data-rate="1">🔊 Nghe</button>
        <button class="btn ghost small" type="button" data-speak="${idx}" data-rate="0.75">🐢 Nghe chậm</button>
        ${turn.pinyin ? `<button class="btn ghost small" type="button" data-toggle-pinyin="${idx}">Ẩn/hiện Pinyin</button>` : ""}
      </p>
      ${turn.role === "tutor" && turn.outOfLevel?.length ? `<p class="muted small">Từ vượt cấp đã dùng: ${turn.outOfLevel.map((w) => `${esc(w.hanzi)} (${esc(w.pinyin)} — ${esc(w.meaning_vi)})`).join("; ")}</p>` : ""}
      ${ev?.has_error ? correctionHtml(ev, idx) : ""}
      ${ev && !ev.has_error && ev.pronunciation_feedback_vi ? `<p class="tutor-pron-note">🎧 ${esc(ev.pronunciation_feedback_vi)}</p>` : ""}
    </article>`;
  }

  function correctionHtml(ev, idx) {
    return `<div class="tutor-correction" role="note" aria-label="Thẻ sửa lỗi">
      <p><strong>Câu của bạn:</strong> <span lang="zh-CN">${esc(ev.original_hanzi || "")}</span>${ev.original_pinyin ? ` <span class="muted">(${esc(ev.original_pinyin)})</span>` : ""}</p>
      <p><strong>Câu sửa đúng:</strong> <span lang="zh-CN">${esc(ev.corrected_hanzi)}</span> <span class="muted">(${esc(ev.corrected_pinyin)})</span></p>
      ${ev.explanation_vi ? `<p>${esc(ev.explanation_vi)}</p>` : ""}
      ${ev.pronunciation_status && ev.pronunciation_status !== "not_assessed" && ev.pronunciation_feedback_vi
        ? `<p>🎧 Phát âm: ${esc(ev.pronunciation_feedback_vi)}${ev.pronunciation_status === "uncertain" ? " (chưa đủ rõ để kết luận chắc chắn)" : ""}</p>` : ""}
      <p class="tutor-bubble-actions">
        <button class="btn small" type="button" data-speak-corrected="${idx}">🔊 Nghe câu chuẩn</button>
        <button class="btn primary small" type="button" data-retry="${idx}">🎙️ Nói lại câu này</button>
      </p>
    </div>`;
  }

  function renderChat() {
    if (!session.turns.length) {
      chatEl.innerHTML = `<section class="card tutor-empty"><p>${session.mode === "roleplay"
        ? "Chọn tình huống rồi bấm micro để bắt đầu nhập vai."
        : "Bấm micro và nói một câu tiếng Trung, hoặc gõ câu vào ô bên dưới. Giáo viên AI sẽ sửa lỗi và nói tiếp trong vốn từ cấp bạn chọn."}</p></section>`;
      return;
    }
    chatEl.innerHTML = session.turns.map((t, i) => bubbleHtml(t, i)).join("");
    bindBubbles();
    chatEl.lastElementChild?.scrollIntoView({ block: "nearest" });
  }

  function bindBubbles() {
    chatEl.querySelectorAll("[data-speak]").forEach((b) => b.onclick = () => {
      const turn = session.turns[Number(b.dataset.speak)];
      if (turn) speakZh(turn.hanzi, { rate: Number(b.dataset.rate), onStatus: setStatus });
    });
    chatEl.querySelectorAll("[data-speak-corrected]").forEach((b) => b.onclick = () => {
      const turn = session.turns[Number(b.dataset.speakCorrected)];
      if (turn?.evaluation?.corrected_hanzi) speakZh(turn.evaluation.corrected_hanzi, { rate: 1, onStatus: setStatus });
    });
    chatEl.querySelectorAll("[data-toggle-pinyin]").forEach((b) => b.onclick = () => {
      const bubble = b.closest(".tutor-bubble");
      bubble?.querySelector("[data-pinyin]")?.classList.toggle("hidden");
    });
    chatEl.querySelectorAll("[data-retry]").forEach((b) => b.onclick = () => {
      const turn = session.turns[Number(b.dataset.retry)];
      const target = turn?.evaluation?.corrected_hanzi;
      if (target) setStatus(`Hãy bấm micro và nói lại câu: ${target}`);
      micBtn.focus();
    });
    chatEl.querySelectorAll("[data-word]").forEach((b) => b.onclick = () => showLookup(b.dataset.word));
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
    $("#t-lookup-speak").onclick = () => speakZh(entry.hanzi, { rate: 1, onStatus: setStatus });
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
    if (!state.config.enabled) { setStatus("Module đang tắt. Bật 'Giáo viên AI' ở phần cấu hình phía trên (hoặc trong Cài đặt) trước nhé."); return false; }
    if (!state.config.workerUrl) { setStatus("Chưa cấu hình Worker URL. Nhập địa chỉ Worker ở phần cấu hình phía trên (hoặc trong Cài đặt) rồi thử lại."); return false; }
    return true;
  }

  async function callTutor(payload) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), CLIENT_TIMEOUT_MS);
    let res;
    try {
      res = await fetch(`${state.config.workerUrl}/api/tutor-turn`, {
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

  async function handleResult(data, { myBlobUrl = null } = {}) {
    const ev = data.evaluation || {};
    const userTurn = {
      role: "user",
      hanzi: data.user_transcript_hanzi || "",
      pinyin: data.user_transcript_pinyin || "",
      translation_vi: "",
      evaluation: ev.has_error ? {
        ...ev,
        original_hanzi: data.user_transcript_hanzi || "",
        original_pinyin: data.user_transcript_pinyin || "",
      } : (ev.pronunciation_feedback_vi ? { has_error: false, pronunciation_feedback_vi: ev.pronunciation_feedback_vi } : null),
      audioUrl: myBlobUrl,
    };
    if (userTurn.hanzi) session.turns.push(userTurn);
    const reply = data.tutor_reply || {};
    session.turns.push({
      role: "tutor",
      hanzi: reply.hanzi || "",
      pinyin: reply.pinyin || "",
      translation_vi: reply.translation_vi || "",
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
    if (reply.hanzi) speakZh(reply.hanzi, { rate: 1, onStatus: setStatus });
  }

  function buildPayload(extra) {
    return {
      sessionId: session.id,
      level: session.level,
      mode: session.mode,
      scenarioId: session.mode === "roleplay" ? session.scenarioId : undefined,
      systemInstruction: buildSystemInstruction({
        level: session.level, mode: session.mode,
        scenario: session.mode === "roleplay" ? scenarioById(session.scenarioId) : null,
        lexicon,
      }),
      history: session.turns.slice(-10).map((t) => ({ role: t.role, hanzi: t.hanzi })),
      ...extra,
    };
  }

  async function sendTextTurn(text) {
    if (!ensureReady()) return;
    if (!session.started) startSession({ keepTurns: true });
    setStatus("Đang xử lý…");
    try {
      const data = await callTutor(buildPayload({ userText: text }));
      await handleResult(data);
    } catch (e) { setStatus(e.message || "Có lỗi. Thử lại nhé."); }
  }

  async function sendAudioTurn(blob, blobUrl) {
    if (!ensureReady()) return;
    if (blob.size > MAX_AUDIO_BYTES) {
      setStatus("Bản ghi quá dài/nặng. Hãy nói câu ngắn hơn (tối đa 20 giây).");
      return;
    }
    if (!session.started) startSession({ keepTurns: true });
    setStatus("Đang xử lý giọng nói…");
    try {
      const base64 = await blobToBase64(blob);
      const data = await callTutor(buildPayload({
        userAudioBase64: base64,
        audioMimeType: (blob.type || "audio/webm").split(";")[0],
      }));
      await handleResult(data, { myBlobUrl: blobUrl });
      // Offer playback of the learner's own take on the user bubble.
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
    } catch (e) { setStatus(e.message || "Có lỗi. Thử lại nhé."); }
  }

  // ---- controls wiring ----
  $("#t-level").onchange = (e) => { session.level = e.target.value; refreshControls(); };
  session.level = $("#t-level").value;
  $("#t-mode").onchange = (e) => {
    if (session.turns.length && !window.confirm("Đổi chế độ sẽ kết thúc phiên hiện tại và bắt đầu phiên mới. Tiếp tục?")) {
      e.target.value = session.mode; return;
    }
    endSession(true);
    session.mode = e.target.value;
    session.turns = [];
    session.started = false;
    refreshControls(); renderChat();
  };
  $("#t-scenario").onchange = (e) => {
    if (session.turns.length && !window.confirm("Đổi tình huống sẽ kết thúc chủ đề cũ và bắt đầu ngữ cảnh nhập vai mới. Tiếp tục?")) {
      e.target.value = session.scenarioId; return;
    }
    endSession(true);
    session.scenarioId = e.target.value;
    session.turns = [];
    session.started = false;
    refreshControls();
    startSession();
  };
  micBtn.onclick = async () => {
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
  renderChat();
  if (session.mode === "roleplay") startSession();
}
