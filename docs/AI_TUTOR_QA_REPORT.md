# AI TUTOR — Báo cáo QA (nhánh feat/ai-tutor)

Ngày: 2026-11-16, cập nhật vòng tích hợp 2026-11-17 · Base: main @ `1a07584` · Nhánh: `feat/ai-tutor` (gốc `f1cffec` + commit sửa lỗi 2026-11-17) · contentVersion: `20261117-ai-tutor2`.
Báo cáo tách hai nhóm rõ ràng: **A. Automated tests** (đã chạy thật, có bằng chứng) và
**B. Real-world integration tests** (cần Worker thật / thiết bị thật — ghi rõ trạng thái từng mục).

---

## A. AUTOMATED TESTS — đã chạy thực tế

### A1. Bộ test của repo (npm run check)
- `node --check`: đạt cho mọi file JS mới (`js/ai-tutor/*.js`, `workers/ai-tutor-proxy/worker.js`) và `src/app.js`.
- `node scripts/validate.mjs`: đạt.
- `node --test tests/*.test.mjs`: **367/367 đạt** (349 cũ + 18 ở `tests/ai-tutor.test.mjs`; +2 test `normalizeWorkerUrl` ở vòng 2026-11-17).
- Test mới kiểm bằng dữ liệu thật: adapter không sửa `data/content.json` (so JSON trước/sau); `lookupLocalWord("你好")` → `nǐ hǎo / xin chào / HSK 1`; chặn cấp HSK1 không lọt từ HSK2; 8 kịch bản đủ vai/mở đầu/3 nhiệm vụ, **64/64 từ gợi ý có trong từ điển giáo trình**; storage giới hạn 50 lỗi/10 hội thoại và không lưu trường audio; schema Worker có `pronunciation_status` + `pronunciation_feedback_vi`; `pickMimeType` theo `isTypeSupported`.

### A2. Worker — chạy handler thật (Gemini được stub ở tầng fetch)
- Vòng 1 (11/11): preflight origin lạ → 403; origin Pages → 204 đúng ACAO; `/health` 200; PIN sai → 401; thiếu PIN → 401; Content-Length > 500 KB → 413; MIME audio lạ → 400; thiếu `GEMINI_API_KEY` → 503 tiếng Việt; happy path → 200 đúng schema; Gemini 429 → 429; Gemini JSON hỏng → 502.
- Vòng 2 — bảo mật (5/5, chạy 2026-11-16 trong giai đoạn nghiệm thu): **rate limit chạy thật** — 30 request liên tiếp cùng IP+PIN đều 200, request thứ 31 → **429**; **body thực nhận > 500 KB** (không dựa Content-Length) → **413**; upstream 500 → 502; **log kiểm chứng không chứa PIN/API key** (log duy nhất: `gemini_error status=… model=…` và `config_error missing GEMINI_API_KEY`).
- Quét toàn repo tại HEAD: **không có chuỗi khóa API** (mẫu `AIza…`/gán key cứng) ngoài tham chiếu `env.GEMINI_API_KEY` và lệnh `wrangler secret put` trong tài liệu.
- Giới hạn đã biết của rate limit: đếm trong bộ nhớ từng isolate Cloudflare — không phải giới hạn toàn cục; README đã ghi rõ và hướng dẫn bật Cloudflare Rate Limiting rule nếu cần chặn cứng.

### A3. Giao diện — harness DOM của repo (jsdom, mẫu tests/feedback.test.mjs)
- 19/19: `#/today` có thẻ lối tắt; thanh dưới vẫn đúng 5 nút; sidebar 9 liên kết; mở trực tiếp `#/tutor` và quay lại sau khi rời trang đều dựng đúng; form cấu hình hiện khi module tắt; CSS tutor chỉ nạp khi mở `#/tutor`; `#/progress`/`#/settings` hiện phần AI Tutor và giữ nguyên điều khiển cũ; 5 route cũ dựng bình thường; khóa tiến độ chính không đổi dạng.
- 12/12: lượt hội thoại mô phỏng end-to-end (Worker giả lập) — payload có sessionId/cấp/history ≤ 10/systemInstruction chứa vốn từ thật; thẻ sửa lỗi hiện đúng; chỉ khóa `hsk3_ai_tutor_state` bị ghi; hội thoại lưu dạng chữ, không audio; bộ đếm từ vựng và số phiên chạy.
- Lưu ý phương pháp: một bản smoke đầu tiên dùng `JSDOM.fromURL` đã báo FAIL hàng loạt vì jsdom không thực thi `<script type="module">` qua HTTP — đó là giới hạn của phương pháp thử, không phải lỗi app; bản smoke theo đúng harness của repo (import trực tiếp) cho kết quả 19/19 + 12/12 như trên.

### A4. Đối chiếu diff với main (giai đoạn nghiệm thu, 2026-11-16)
Tổng: 17 file (13 mới, 4 sửa). Không có thay đổi nào ngoài phạm vi AI Tutor.
- `data/content.json`: **đúng 1 dòng** — `contentVersion` `20261115-hsk2-l7-wb` → `20261116-ai-tutor1`.
- `tests/wb-reading-writing.test.mjs`: **đúng 2 dòng** — hai chuỗi ghim phiên bản trong cùng một test phát hành; mọi khẳng định hành vi giữ nguyên (lý do: quy ước bump token của repo; giữ token cũ sẽ làm trình duyệt đã mở app chạy app.js cũ từ bộ đệm — sự cố PR #153).
- `index.html`: +1 liên kết sidebar `tutor`; 2 dòng token `?v=` đổi theo phiên bản. Thanh điều hướng dưới không đổi.
- `src/app.js`: 4 dòng cũ bị thay đều là **kéo dài tại chỗ** (token import audio-review; thêm thẻ Today vào cùng dòng quick-grid; gắn `${tutorStatsHtml()}` vào dòng thống kê Progress; thêm `<div id="tutor-settings-slot">` vào cuối template Settings) + phần còn lại là khối hàm mới thuần thêm (`viewTutor`, `tutorStatsHtml`, `mountTutorSettings`, 1 nhánh route). Không dòng logic cũ nào bị viết lại.

### A5. Vòng tích hợp 2026-11-17 — audit frontend ↔ Worker + probe live + 2 sửa lỗi
Đối chiếu trực tiếp mã nguồn hai phía (không dựa vào comment):
- Endpoint: frontend `POST ${workerUrl}/api/tutor-turn` — Worker chỉ nhận đúng path này (GET → 404, đã probe live). Method POST, `Content-Type: application/json` cả hai phía.
- PIN: frontend chỉ gửi header `X-Tutor-Pin` khi đã nhập PIN; Worker chỉ bắt buộc khi secret `TUTOR_ACCESS_PIN` tồn tại. Probe live trên Worker production: thiếu PIN → 401 `PIN_INVALID`; PIN sai → 401 — thông báo tiếng Việt khớp nội dung app hiển thị.
- Request: `sessionId/level/mode/scenarioId?/systemInstruction/history[{role,hanzi}] ≤10` + `userText` hoặc `userAudioBase64+audioMimeType` — Worker `validateTurn`/`buildContents` xử lý đúng các trường này (audio → `inlineData`, tutor→`model`).
- Response: Worker trả `{ok, user_transcript_hanzi, user_transcript_pinyin, evaluation{7 trường}, tutor_reply{hanzi,pinyin,translation_vi,out_of_level_words}}` — frontend đọc đúng các trường này; lỗi trả `{ok:false, code, error}` và frontend hiện nguyên văn `error`. (Ghi chú: phản hồi thành công KHÔNG có trường `model` — comment trong bản Worker bàn giao v3/v4 ghi thừa trường này; không ảnh hưởng chức năng.)
- CORS live: preflight từ `https://bohoa96tb.github.io` → 204 đúng ACAO; origin lạ → 403. Timeout: client 30 s, Worker 25 s — khớp. Retry tự động: không có ở cả hai phía (chủ đích — người dùng bấm gửi lại). Loading: dòng trạng thái tiếng Việt.
- **Lỗi F1 (đã sửa): thiếu khóa chống gửi trùng.** `sendTextTurn`/`sendAudioTurn` trước đây chạy song song được — gửi đúp gây 2 request, trả lời về lệch thứ tự, tốn gấp đôi quota. Đã thêm cờ `sending` dùng chung (gửi văn bản chặn lượt audio và ngược lại). Harness DOM kiểm chứng: submit 2 lần liên tiếp → đúng **1** request.
- **Lỗi F2 (phòng ngừa, có bằng chứng live): URL Worker có dấu `/` ở cuối.** Cả hai form lưu cấu hình đã tự cắt `/` thừa, nhưng cấu hình lưu từ bản cũ thì không; probe live: `POST //api/tutor-turn` → **404 NOT_FOUND**. Đã thêm `normalizeWorkerUrl` (tutor-storage) áp dụng khi nạp cấu hình + khi gọi API. Test đơn vị + harness (state cũ có `/` → request đi đúng `https://worker.test/api/tutor-turn`) đều đạt.
- Harness DOM vòng 2 (jsdom, Worker giả lập ở tầng fetch): **15/15** — 6 route cũ + tiến độ/settings có khối AI Tutor; thanh dưới vẫn 5 nút; khóa gửi trùng; chuẩn hóa URL; bong bóng + thẻ sửa lỗi dựng đúng; lỗi được ghi vào state, không có dữ liệu audio trong storage; khóa tiến độ chính nguyên vẹn.
- Bump `contentVersion` → `20261117-ai-tutor2` đồng bộ 13 token `?v=` (data/content.json, index.html, src/app.js, js/ai-tutor/tutor-view.js, 2 dòng ghim trong tests/wb-reading-writing.test.mjs) — đúng bài học PR #153.
- **Đồng bộ repo ↔ production (đã thực hiện 2026-11-17 theo quyết định của Hoa):** file `workers/ai-tutor-proxy/worker.js` trong repo đã được thay bằng đúng bản production v4 (SHA-256 `939a0ccd…`, đối chiếu byte) + README Worker bổ sung mục 8 ghi phiên bản production và quy tắc đồng bộ. Commit này nằm trên nhánh, thuộc PR #154. Worker production KHÔNG bị đụng vào (không deploy lại, không đổi secret/CORS).

---

## A6. Vòng điều tra độ trễ (2026-11-17, nhánh `fix/ai-tutor-latency` từ main `ca3cd24`, CHƯA merge)

Sự cố thật: Hoa dùng app chính thức trên Android, gửi lượt và nhận đúng thông báo **"Máy chủ AI phản hồi quá chậm. Thử lại sau ít giây nhé."**

- **Định vị tầng lỗi bằng chính chuỗi thông báo:** chuỗi này chỉ tồn tại ở Worker (`GEMINI_TIMEOUT` → 504 TIMEOUT). Thông báo timeout của frontend là câu khác ("AI phản hồi quá chậm. Kiểm tra mạng rồi thử lại nhé."). Kết luận chắc chắn: request đã tới Worker, PIN/CORS hợp lệ, Worker đã gọi Gemini và **AbortController 25 giây của Worker đã ngắt vì Gemini không trả kết quả trong 25 giây**. Không phải lỗi frontend, PIN/CORS/rate limit, hay frontend hủy sớm (hạn frontend 30s).
- **Đo tầng edge (live, không cần PIN):** `/health` 5 lần 0,23–0,54s; POST thiếu PIN → 401 trong 0,29–0,59s. Edge Cloudflare + mã Worker ở các đường nhanh đều dưới 0,6s → điểm nghẽn ở chặng Worker→Gemini.
- **Yếu tố đầu vào đo được:** `systemInstruction` HSK2 dài **13.516 ký tự** mỗi lượt (danh sách ngữ pháp 10.680 ký tự chiếm phần lớn), gửi lặp mọi lượt; model là model suy luận cao cấp dù đã đặt thinking `low`. Tỉ lệ đóng góp của từng yếu tố CHƯA đủ bằng chứng — cần số đo `gemini_ms` từ production.
- **Thay đổi ở vòng này (nhánh riêng, chưa merge/deploy):** (1) Worker ghi log `tutor_timing` mỗi lượt (type/model/instruction_chars/history_turns/audio_kb/status/code/gemini_ms/worker_ms — chỉ số đo, KHÔNG nội dung/PIN/key) và response thành công kèm `timings.geminiMs`; (2) frontend hiện pha chờ (kết nối → đang suy nghĩ → vẫn đang xử lý) kèm số giây đã chờ, và sau trả lời hiện thời gian xử lý (câu chữ ban đầu "AI đã trả lời sau X giây." — đã đổi thành "Gemini đã xử lý trong X giây." ở review fix bên dưới); khóa gửi trùng giữ nguyên; (3) thu gọn prompt: danh sách ngữ pháp giữ pattern, bỏ nhãn tiếng Việt trùng lặp — instruction HSK2 còn **8.574 ký tự (−37%)**, danh sách từ giữ nguyên; (4) timeout giữ nguyên 25s/30s — chờ số đo production mới quyết định (tăng hạn Worker hoặc đổi `GEMINI_MODEL` sang `gemini-3.5-flash-lite` là quyết định của Hoa sau khi có dữ liệu).
- **Review fix (Hoa duyệt diff PR #155, cùng ngày):** telemetry sửa đúng
  nghĩa — `gemini_ms` chỉ đo cửa sổ gọi Gemini + xử lý response;
  `worker_ms` đo từ đầu fetch handler tới lúc tạo response; trường
  `total_ms` gây hiểu nhầm bị bỏ. Log ghi **đúng HTTP status trả về**
  (200/504/429/502/401/403/413/400) nhờ dùng chung một hàm ánh xạ lỗi
  `geminiErrorHttp` cho cả response và log; các lỗi từ chối sớm (PIN,
  origin, quá lớn, rate limit) cũng ghi log và **không có `gemini_ms`**
  vì Gemini chưa được gọi. Thông báo frontend đổi thành "Gemini đã xử
  lý trong X giây." cho khớp số liệu. Test repo tăng lên **370/370**
  (thêm test khóa status log cho success/timeout/rate-limit/truncated/
  PIN + bảo mật log); battery Worker v2 6/6. contentVersion nhánh:
  `20261117-ai-tutor4`.
- **Test vòng này:** repo **369/369** (thêm 2 test: instruction < 10.000 ký tự vẫn chứa pattern + danh sách từ; response Worker có `timings.geminiMs` và dòng log không chứa PIN/nội dung). Battery Worker riêng 7/7 (gồm Gemini treo → 504 đúng ở ~25s; MAX_TOKENS; x-wav). Harness DOM cho UX chờ: KHÔNG chạy lại được trong môi trường này (jsdom không thực thi dynamic import của view — giới hạn môi trường; module đã chạy thật trên Android của Hoa). Latency Gemini production: CHƯA ĐO ĐƯỢC — chỉ có sau khi Hoa deploy Worker của nhánh này và chạy lượt thật.

## B. REAL-WORLD INTEGRATION TESTS — trạng thái thật

### B1. Gemini API thật qua Worker đã triển khai — 🟡 MỘT PHẦN (đã có lượt thật đầu tiên: 504 TIMEOUT — xem A6; lượt thành công vẫn chờ)
Hoa đã triển khai Worker `hsk3-ai-tutor-proxy` (bản bàn giao v4) và đặt cả hai secret. Muse đã probe live từ ngoài (2026-11-16/17): `/health` → 200 `{ok:true, model: gemini-4-hydrogen}`; preflight origin Pages → 204, origin lạ → 403; thiếu/sai PIN → 401 đúng định dạng lỗi của module. **Lượt hội thoại thành công vẫn CHƯA có bằng chứng** — Muse không có PIN (không được xin/giữ PIN) nên không tự gọi được; không dùng stub để thay thế. Sau khi Hoa cấu hình app và gửi câu đầu tiên, cần chạy đúng các mục sau và ghi kết quả vào đây:
- [ ] Lượt văn bản: gửi 1 câu đúng + 1 câu sai ngữ pháp → JSON đúng schema; transcript Hanzi/Pinyin khớp câu đã gửi; `evaluation` sửa đúng 1–2 lỗi; `tutor_reply` đủ hanzi/pinyin/translation_vi.
- [ ] Lượt audio (webm từ Chrome Android hoặc mp4): transcript đúng với câu đã nói; khi nói rõ ràng → `pronunciation_status` hợp lý; khi nói quá nhỏ/ồn → `uncertain` kèm phản hồi tiếng Việt, không kết luận bừa.
- [ ] `out_of_level_words`: ép AI dùng từ vượt cấp (ví dụ hỏi câu cần từ HSK cao) → từ đó phải xuất hiện trong danh sách kèm pinyin/nghĩa.
- [ ] Lịch sử: nói 3 lượt liên tiếp trong một phiên → AI nhớ ngữ cảnh (gọi lại chi tiết lượt 1); đổi tình huống → ngữ cảnh mới, không trộn vai cũ.
- [ ] Lỗi model/giới hạn: tạm đặt `GEMINI_MODEL` sai → app hiện thông báo tiếng Việt, không treo, không tự đổi model; chạm rate limit Gemini → thông báo quá tải.

### B2. Android Chrome trên thiết bị thật — ⛔ CHỜ HOA TỰ THỬ (checklist ở cuối file)
Chưa có thiết bị thật trong môi trường làm việc. Mọi mục micro/TTS mới kiểm ở mức mã + harness, **chưa tuyên bố đạt trên Android**.

### B3. Kiểm tra trực quan 4 bề rộng (360/390/768/1440 px) — ⛔ CHƯA KIỂM
Môi trường hiện tại không có trình duyệt thật kết nối tới được bản nhánh (GitHub Pages chỉ phục vụ `main`; máy chủ local không tới được từ trình duyệt ngoài). Đã kiểm ở mức DOM/harness (mục A3) nhưng **không coi đó là kiểm trực quan**. Cần kiểm sau khi có bản xem trước (deploy Worker + mở PR preview hoặc chạy local trên mạng nội bộ của Hoa).

### B4. HSK 3 — giới hạn dữ liệu đã biết
Repo chưa có dữ liệu HSK 3: chọn cấp HSK 3 dùng vốn từ HSK 1+2, app hiển thị rõ lưu ý. Không tuyên bố phủ HSK 3.

---

## Checklist nghiệm thu Android (cho Hoa tự thử)

Chuẩn bị: đã deploy Worker (mục 8 của README Worker), app đã cấu hình Worker URL + PIN và bật module trong Cài đặt.

1. **Mở module**: vào `#/tutor` → chọn HSK 1, chế độ Giáo viên AI.
2. **Cấp quyền micro**: bấm nút micro tròn → Chrome hỏi quyền → chọn "Cho phép" → trạng thái hiện "Đang nghe…".
3. **Ghi âm & gửi**: nói "你好，我叫…" rồi bấm micro lần nữa để gửi → hiện bong bóng câu của bạn + câu trả lời của AI; đồng hồ giây luyện nói tăng trong `#/progress`.
4. **Nghe lại giọng mình**: bấm "▶ Nghe giọng mình" ở bong bóng vừa nói.
5. **Nghe AI**: bấm 🔊 Nghe ở câu của AI; bấm ■ Dừng để dừng giữa chừng.
6. **Nghe chậm**: bấm 🐢 Nghe chậm → tốc độ rõ ràng chậm hơn (0.75×).
7. **Thẻ sửa lỗi**: cố ý nói sai một câu (ví dụ sai trật tự từ) → thẻ sửa lỗi hiện câu gốc/câu đúng/giải thích; bấm "🔊 Nghe câu chuẩn", rồi "🎙️ Nói lại câu này" và nói lại.
8. **Tra từ tại chỗ**: chạm một từ trong câu của AI → thẻ tra từ hiện đúng Pinyin + nghĩa của giáo trình.
9. **Nhập vai & đổi chủ đề**: chuyển chế độ Hội thoại nhập vai → chọn "Gọi món tại nhà hàng" → AI mở đầu bằng câu chào của phục vụ; nói 2–3 lượt; đổi sang tình huống khác → app hỏi xác nhận kết thúc chủ đề cũ, phiên mới bắt đầu với vai mới, không lẫn vai cũ.
10. **Từ chối quyền micro**: vào Cài đặt Chrome → Quyền trang web → Micro → chặn trang app → quay lại bấm micro → app hiện hướng dẫn cấp quyền bằng tiếng Việt, không treo, không mất nút.
11. **Mất mạng**: bật chế độ máy bay → gửi một câu → app báo mất mạng/chưa nối được Worker bằng tiếng Việt; tắt máy bay → gửi lại bình thường.
12. **PIN sai**: vào Cài đặt của app, sửa PIN sai → gửi câu → báo PIN chưa đúng; sửa lại PIN đúng → hoạt động lại.
13. **Kiểm tra lưu trữ**: sau các bước trên, `#/progress` hiện phút luyện nói + lỗi thường gặp; nút "Xóa lịch sử AI Tutor" trong Cài đặt xóa được các mục đó mà tiến độ học chính (bài đã học) vẫn nguyên.
