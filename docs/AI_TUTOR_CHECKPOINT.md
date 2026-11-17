# AI TUTOR — Checkpoint

- **Nhánh:** `feat/ai-tutor` (từ `main` @ `1a07584`, Merge PR #153). **Không merge vào main.**
- **Đã push:** commit từ xa `23b2b7f8d05fd7ce7acf60beaf80a5ec1d2aa653` (17 file; đã đối chiếu SHA-256 từng file giữa bản local và bản trên GitHub — khớp). Chưa mở PR, chưa merge.
- **Trạng thái:** Cả 5 chặng đã dựng xong. Hoa đã triển khai Worker production (bản bàn giao v4) + đặt 2 secret; Muse đã probe live: health/CORS/cổng PIN đều đúng. Vòng 2026-11-17: audit tích hợp frontend↔Worker (contract khớp), sửa 2 lỗi (khóa chống gửi trùng; chuẩn hóa URL Worker) + bump phiên bản — commit bổ sung trên cùng nhánh, chưa PR/merge. Còn thiếu bằng chứng cuối: **một lượt Gemini thật thành công từ app** (chỉ Hoa chạy được bằng PIN của mình) + checklist Android.
- **Phiên bản:** contentVersion `20261117-ai-tutor2` (bump đồng bộ 13 token `?v=` ở vòng sửa lỗi 2026-11-17). Kiểm thử vòng này: repo **367/367**, harness DOM **15/15**, probe live Worker đạt các mục không cần PIN (xem QA report A5/B1).

## Đã xong theo chặng

1. **Audit** → `docs/AI_TUTOR_REPO_MAP.md`. Phát hiện quan trọng: repo dùng `src/` + `data/content.json` (không có `js/`, không có file dữ liệu riêng từng cấp); từ vựng nằm ở `prepWords/foundationWords/lookup` (927 dòng, 543 từ duy nhất), ngữ pháp ở `knowledgePoints` (105 điểm); **chưa có dữ liệu HSK 3**.
2. **Worker** `workers/ai-tutor-proxy/` — CORS allowlist không wildcard, PIN timing-safe, body ≤500 KB, MIME allowlist, rate limit, timeout 25 s, Structured Outputs + trường phát âm (Phụ lục VIII), model mặc định `gemini-4-hydrogen`. LƯU Ý: file trong repo là bản f1cffec (`maxOutputTokens: 600`); bản production đang chạy là bản bàn giao v4 ngoài repo (thinking low/800 token/rate limit IP+PIN/stream body/chuẩn hóa x-wav — chi tiết ở QA report A5). Khi mở PR cần đồng bộ file repo theo v4.
3. **Guardrail + 8 kịch bản** — adapter chỉ đọc, `lookupLocalWord` trả đúng pinyin/nghĩa giáo trình; 64/64 từ gợi ý của 8 kịch bản đều có trong từ điển thật (đã thay các từ gợi ý ban đầu không có trong sách: 多少钱/路/站/同事…).
4. **Voice engine** — `isTypeSupported` trước khi ghi, tự chọn webm/mp4 theo máy, tối đa 20 s tự dừng+gửi, dọn track/Blob URL khi đổi phiên, TTS zh-CN 1.0×/0.75× + nút dừng, lỗi micro bằng tiếng Việt.
5. **View + lưu trữ** — route `#/tutor` lazy-load; sidebar +1 liên kết (thanh dưới giữ nguyên 5 nút); thẻ lối tắt ở `#/today`; thống kê ở `#/progress`; cấu hình ở `#/settings`; duy nhất khóa `hsk3_ai_tutor_state` (schemaVersion 1), không lưu audio.

## Việc còn lại (ngoài nhánh này)

- **nextTask duy nhất:** Hoa mở bản xem trước của nhánh (hoặc bản sau PR), cấu hình Worker URL + PIN trong Cài đặt → Giáo viên AI, gửi lượt văn bản HSK 2 đầu tiên và báo lại kết quả/thông báo lỗi — đó là bằng chứng tích hợp end-to-end còn thiếu (QA report B1). Sau đó chạy checklist Android ở cuối QA report.
- Đồng bộ `workers/ai-tutor-proxy/worker.js` trong repo theo bản v4 khi mở PR chính thức.
- Khi app có dữ liệu HSK 3, guardrail tự mở rộng (adapter đọc theo `level` trong dữ liệu, không cần sửa code).
