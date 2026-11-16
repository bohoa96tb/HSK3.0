# AI TUTOR — Checkpoint

- **Nhánh:** `feat/ai-tutor` (từ `main` @ `1a07584`, Merge PR #153). **Không merge vào main.**
- **Đã push:** commit từ xa `23b2b7f8d05fd7ce7acf60beaf80a5ec1d2aa653` (17 file; đã đối chiếu SHA-256 từng file giữa bản local và bản trên GitHub — khớp). Chưa mở PR, chưa merge.
- **Trạng thái:** Cả 5 chặng đã dựng xong trên nhánh; chờ nghiệm thu của Hoa + cấu hình Worker thật (secret Gemini) mới dùng được end-to-end.
- **Phiên bản:** contentVersion `20261116-ai-tutor1` (bump đồng bộ: `data/content.json`, 2 token trong `index.html`, token import audio-review trong `src/app.js` — đúng quy ước phát hành của repo; xem QA report mục "Điểm cần Hoa biết").

## Đã xong theo chặng

1. **Audit** → `docs/AI_TUTOR_REPO_MAP.md`. Phát hiện quan trọng: repo dùng `src/` + `data/content.json` (không có `js/`, không có file dữ liệu riêng từng cấp); từ vựng nằm ở `prepWords/foundationWords/lookup` (927 dòng, 543 từ duy nhất), ngữ pháp ở `knowledgePoints` (105 điểm); **chưa có dữ liệu HSK 3**.
2. **Worker** `workers/ai-tutor-proxy/` — CORS allowlist không wildcard, PIN timing-safe, body ≤500 KB (2 lớp kiểm), MIME allowlist, rate limit 30/10 phút/IP, timeout 25 s, `maxOutputTokens: 600`, Structured Outputs + trường phát âm (Phụ lục VIII), model mặc định `gemini-4-hydrogen` đã xác minh GA 12/11/2026, đổi qua `GEMINI_MODEL`.
3. **Guardrail + 8 kịch bản** — adapter chỉ đọc, `lookupLocalWord` trả đúng pinyin/nghĩa giáo trình; 64/64 từ gợi ý của 8 kịch bản đều có trong từ điển thật (đã thay các từ gợi ý ban đầu không có trong sách: 多少钱/路/站/同事…).
4. **Voice engine** — `isTypeSupported` trước khi ghi, tự chọn webm/mp4 theo máy, tối đa 20 s tự dừng+gửi, dọn track/Blob URL khi đổi phiên, TTS zh-CN 1.0×/0.75× + nút dừng, lỗi micro bằng tiếng Việt.
5. **View + lưu trữ** — route `#/tutor` lazy-load; sidebar +1 liên kết (thanh dưới giữ nguyên 5 nút); thẻ lối tắt ở `#/today`; thống kê ở `#/progress`; cấu hình ở `#/settings`; duy nhất khóa `hsk3_ai_tutor_state` (schemaVersion 1), không lưu audio.

## Việc còn lại (ngoài nhánh này)

- Hoa tạo Worker trên Cloudflare + `wrangler secret put GEMINI_API_KEY` (+ PIN) rồi nhập Worker URL/PIN trong app — hướng dẫn ở `workers/ai-tutor-proxy/README.md`.
- Nghiệm thu trên Android thật (mic/TTS/quyền) — chưa thực hiện, xem QA report.
- Khi app có dữ liệu HSK 3, guardrail tự mở rộng (adapter đọc theo `level` trong dữ liệu, không cần sửa code).
