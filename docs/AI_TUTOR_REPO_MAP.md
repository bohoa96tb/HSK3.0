# AI TUTOR — Bản đồ repo (Chặng 1: Audit)

Ngày khảo sát: 2026-11-16 · Nhánh: `feat/ai-tutor` · Base: `main` @ `1a07584` (Merge PR #153).
Clone làm việc sạch (working tree không có thay đổi chưa commit tại thời điểm tạo nhánh).

## 1. Cấu trúc thật của repo (khác với giả định ban đầu của đặc tả)

| Hạng mục | Thực tế trong repo |
|---|---|
| Mã nguồn app | `src/` (`app.js`, `lib.js`, `store.js`, `player.js`, `writing.js`, `audio-review.js`) — **không có thư mục `js/`**; module mới vẫn đặt ở `js/ai-tutor/` theo đặc tả để cô lập hoàn toàn, app chỉ lazy-load từ đó. |
| Dữ liệu | Một file duy nhất `data/content.json` (+ `data/hanzi/<chữ>.json` cho luyện viết). |
| Router | Hash Router viết tay trong `src/app.js`: `parseRoute()` (dòng ~71), `render()` / `renderInner()` (dòng ~96–142). Các page: `today, course, lesson, grammar, reader→lesson, exercise→lesson, review, writing, progress, settings, sources`. |
| Điều hướng | Sidebar `<aside aria-label="Điều hướng chính">` trong `index.html` (8 liên kết, có `data-nav`); thanh dưới `<nav aria-label="Điều hướng dưới">` có đúng 5 nút — **không sửa**. `navActive()` trong app.js tự khớp `data-nav` với segment đầu của route, nên liên kết sidebar `#/tutor` với `data-nav="tutor"` hoạt động ngay. |
| Trình phát audio | `<div id="miniplayer" role="region" aria-label="Trình phát audio">` trong `index.html`; logic ở `src/player.js`: **một** thẻ `Audio` duy nhất phát track Baulchino theo đoạn [start,end], cộng `speakText()` dùng `speechSynthesis` (zh-CN, rate 0.92) cho loa từng từ/câu (quyết định D20). Module AI Tutor **không dùng lại** miniplayer (tránh tranh chấp audio); TTS của tutor nằm trong `js/ai-tutor/voice-engine.js`, và khi tutor phát tiếng sẽ không đụng tới player chính. |
| Phiên bản tài nguyên | `index.html` nạp `assets/styles.css?v=20261115-hsk2-l7-wb` và `src/app.js?v=20261115-hsk2-l7-wb`; các import nội bộ trong `src/*.js` cũng có token `?v=` riêng — token của file nào đổi thì chỉ đổi khi file đó đổi (bài học PR #153). |

## 2. Dữ liệu từ vựng / ngữ pháp (đọc bởi adapter — KHÔNG sửa)

- `data/content.json` gồm: `lessons[]` (metadata 30 bài: `id, level ("HSK 1"|"HSK 2"), lessonNumber, titleZh/Vi…`), `pilot` (nội dung Bài 1 HSK 1) và `additionalLessons[]` (21 nội dung bài còn lại) — tổng **22 bài có nội dung**: HSK 1 = 15 bài, HSK 2 = 7 bài. **Chưa có nội dung HSK 3 nào** trong repo (HSK 3–4 mới ở mức mục lục nguồn).
- Mỗi nội dung bài (`contentFor(lessonId)` trong app.js) có:
  - `prepWords[]` — từ mới của bài: `{id, zh, pinyin, vi, hanViet, dialogueGroup, sourceRefs, audio{trackId,start,end,status}}`. Tổng **440 từ** (HSK 1: 330, HSK 2: 110).
  - `foundationWords[]` — từ nền tảng (cùng shape, một số bài).
  - `lookup.extras[]` / `lookup.phrases[]` — từ/cụm bổ sung cho tra từ tại chỗ (cùng shape `zh/pinyin/vi`).
  - `knowledgePoints[]` — điểm ngữ pháp: `{id, title, pattern, explanationVi, useWhenVi, examples[{zh,pinyin,noteVi}]}`. Tổng **105 điểm** (HSK 1: 76, HSK 2: 29).
  - `reader.sentences[]` — câu hội thoại `{id, speaker, zh, pinyin, vi, passageId}`.
- Hệ quả cho Guardrail (mục XII của phụ lục): chọn cấp **HSK 3** hiện tại chỉ dùng được dữ liệu HSK 1+2 vì repo chưa có dữ liệu HSK 3 — giao diện và báo cáo QA ghi rõ điều này, không tuyên bố phủ 100% HSK 3.

## 3. Các khóa localStorage đang tồn tại (tránh trùng)

| Khóa | Chủ sở hữu |
|---|---|
| `hsk30.progress.v1` | `src/store.js` — toàn bộ tiến độ học + settings hiển thị (schemaVersion bên trong JSON). |
| `hsk30.progress.backup-before-import` | `src/store.js` — bản sao trước khi nhập backup. |

Module mới dùng **duy nhất** khóa `hsk3_ai_tutor_state` (theo đặc tả) — không trùng hai khóa trên, không đọc/ghi chúng.

## 4. Kiểm thử hiện có

- `package.json`: `npm run check` = `node --check` 4 file src + `scripts/validate.mjs` + `node --test tests/*.test.mjs` (jsdom). Test mới của AI Tutor đặt ở `tests/ai-tutor.test.mjs` (file mới, không sửa test cũ).
- Không có bước build; chạy local: `python3 -m http.server 8000`.

## 5. Điểm tích hợp đã chọn (tối thiểu, zero-breakage)

1. `index.html`: thêm 1 liên kết `data-nav="tutor"` vào **sidebar** (không đụng thanh dưới 5 nút) + đổi token `?v=` của `src/app.js` vì app.js thay đổi.
2. `src/app.js`:
   - `renderInner()`: thêm 1 nhánh `page === "tutor"` → lazy `import("../js/ai-tutor/tutor-view.js")`.
   - `viewToday()`: thêm 1 thẻ lối tắt trong `quick-grid`.
   - `viewProgress()`: thêm 1 section thống kê AI Tutor (chỉ đọc khóa `hsk3_ai_tutor_state`, bọc try/catch; section vẫn hiện khi chưa có dữ liệu với số 0 và lời mời mở module — không lỗi).
   - `viewSettings()`: thêm 1 section "Giáo viên AI" (bật/tắt, Worker URL, PIN, xóa lịch sử) thao tác **chỉ** trên khóa `hsk3_ai_tutor_state` qua import động của `tutor-storage.js` khi người dùng tương tác/mở trang cài đặt — không nạp module tutor ở các trang khác.
3. Mọi thứ còn lại nằm trong `js/ai-tutor/` và `workers/ai-tutor-proxy/`.
