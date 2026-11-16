# AI TUTOR — Báo cáo QA (nhánh feat/ai-tutor)

Ngày: 2026-11-16 · Base: main @ `1a07584` · contentVersion: `20261116-ai-tutor1`.
Nguyên tắc báo cáo: tách rõ **test tự động / kiểm thử bằng harness DOM / kiểm thử Worker bằng handler thật / chưa kiểm được**.

## 1. Test tự động (npm run check)

- `node --check`: đạt cho toàn bộ file JS mới (`js/ai-tutor/*.js`, `workers/ai-tutor-proxy/worker.js`) và `src/app.js` đã sửa.
- `node scripts/validate.mjs`: đạt.
- `node --test tests/*.test.mjs`: **365/365 đạt** (349 test cũ + 16 test mới trong `tests/ai-tutor.test.mjs`).
- Test mới kiểm bằng dữ liệu thật: adapter đọc `data/content.json` không làm thay đổi dữ liệu nguồn (so chuỗi JSON trước/sau); `lookupLocalWord("你好")` → `nǐ hǎo / xin chào / HSK 1`; chặn cấp HSK1 không lọt từ chỉ có ở HSK2; 8 kịch bản đủ vai/mở đầu/3 nhiệm vụ và **64/64 từ gợi ý tra được trong từ điển giáo trình**; storage giới hạn 50 lỗi/10 hội thoại, không lưu trường audio; Worker: allowlist origin, PIN, validateTurn, schema có `pronunciation_status` + `pronunciation_feedback_vi`, trần body 500 KB; voice: `pickMimeType` theo `isTypeSupported`.

## 2. Kiểm thử Worker bằng handler thật (fetch stub, chạy ngoài bộ test)

11/11 đạt: preflight origin lạ → 403; origin Pages → 204 đúng ACAO; `/health` 200; PIN sai → 401; thiếu PIN → 401; Content-Length > 500 KB → 413; MIME audio lạ → 400; thiếu `GEMINI_API_KEY` → 503 (thông báo tiếng Việt); happy path với Gemini stub trả Structured JSON → 200 đúng schema; Gemini 429 → 429; Gemini trả JSON hỏng → 502.
Chưa kiểm: timeout 25 s (mã có AbortController, chưa ép được tình huống treo trong môi trường này), rate limit 30/10 phút (logic đếm trong bộ nhớ đã có, chưa chạy đủ 31 request trong bản smoke — kiểm bằng đọc mã + test validate; ghi rõ là giới hạn theo isolate, README đã cảnh báo).

## 3. Kiểm thử giao diện bằng harness DOM của repo (jsdom, cùng mẫu tests/feedback.test.mjs)

19/19 đạt: `#/today` hiện thẻ lối tắt Giáo viên AI; **thanh điều hướng dưới vẫn đúng 5 nút**; sidebar 9 liên kết (thêm `tutor`); mở trực tiếp `#/tutor` hiện module + form cấu hình khi đang tắt; nút micro, chọn cấp/chế độ đều có; CSS của tutor chỉ nạp khi mở `#/tutor`; rời trang rồi quay lại `#/tutor` dựng lại bình thường; `#/progress` hiện section Giáo viên AI; `#/settings` hiện form cấu hình AI và các công tắc cũ nguyên vẹn; 5 route cũ (course/grammar/review/writing/sources) dựng bình thường; khóa tiến độ chính không đổi dạng.

12/12 đạt cho **lượt hội thoại mô phỏng end-to-end** (Worker giả lập): payload gửi đi có `sessionId`, cấp HSK, history ≤ 10 và systemInstruction chứa vốn từ thật; bong bóng người học + **thẻ sửa lỗi** + câu trả lời của AI đều hiện; từ trong câu là nút chạm tra từ; lỗi được lưu vào `recentErrors`, hội thoại lưu dạng chữ (không audio), bộ đếm từ vựng chạy （我/去/学校/学/汉语…), phiên được đếm; khóa `hsk30.progress.v1` không bị đụng.

## 4. Zero-breakage

- 349 test cũ đạt nguyên vẹn (sau khi cập nhật ghim phiên bản — xem mục 6).
- Khi module tắt (mặc định): `#/tutor` chỉ hiện form cấu hình; các trang khác chỉ thêm 1 section đọc-thụ-động (Progress) và 1 slot cấu hình nạp động (Settings), lỗi nạp module con được bắt và hiển thị ghi chú, không làm hỏng trang.
- Khi chưa cấu hình Worker URL: bấm micro/gửi câu chỉ hiện thông báo tiếng Việt, không gọi mạng, không lỗi JS.
- SRS `#/review` và luyện viết `#/writing`: không sửa bất kỳ dòng nào trong logic của chúng (diff chỉ gồm: 1 nhánh route, helper đọc thống kê, section settings, thẻ lối tắt ở Today).

## 5. Chưa kiểm được (ghi rõ, không tuyên bố đạt)

- **Android thật**: cấp quyền micro, ghi âm webm/mp4 trên máy thật, nghe lại giọng mình, TTS zh-CN trên thiết bị — chưa thử; cần Hoa thử trên điện thoại sau khi có Worker thật.
- **Gemini thật**: chưa có API Key/Worker triển khai thật nên chưa gọi được Gemini live; model đã xác minh qua tài liệu Google chính thức (gemini-4-hydrogen GA 12/11/2026, gemini-3.5-flash-lite GA 21/07/2026 — đều hỗ trợ GenerateContent + audio input), nhưng hành vi Structured Outputs thực tế của từng model chỉ chắc chắn khi chạy thử với key thật.
- **Kiểm giao diện ở 4 bề rộng 360/390/768/1440** theo AGENTS.md: mới kiểm ở mức DOM/harness, chưa chụp/kiểm trực quan từng bề rộng cho trang `#/tutor`.
- **HSK 3**: repo chưa có dữ liệu HSK 3 — chọn cấp HSK 3 hiện dùng vốn từ HSK 1+2 và app hiển thị rõ lưu ý này (không tuyên bố phủ HSK 3).

## 6. Điểm cần Hoa biết — cập nhật ghim phiên bản trong 1 test cũ

Khi phát hành, quy ước của repo là bump `contentVersion` đồng bộ (data + 2 token ở index.html + token import). Test cũ `tests/wb-reading-writing.test.mjs` ghim cứng chuỗi phiên bản cũ `20261115-hsk2-l7-wb` ở 2 dòng (khai báo version + đếm token), nên bản bump `20261116-ai-tutor1` phải cập nhật đúng 2 dòng đó sang phiên bản mới — **không thay đổi bất kỳ khẳng định hành vi nào** của test (toàn bộ kiểm tra Workbook giữ nguyên). Nếu giữ nguyên token cũ, trình duyệt đã từng mở app sẽ chạy app.js cũ trong bộ đệm và liên kết Giáo viên AI ở sidebar sẽ dẫn tới trang "Không tìm thấy" — chính lỗi đã từng xảy ra ở PR #153. Mọi test cũ khác không bị sửa.
