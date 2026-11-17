# AI TUTOR — Checkpoint

- **Trạng thái hiện tại (2026-11-17): ĐÃ MERGE vào `main` qua PR #154** (merge commit `e4576b6`) theo lệnh của Hoa; nghiệm thu live đạt: Pages chính thức phục vụ contentVersion `20261117-ai-tutor2`, module JS trả 200 đúng MIME, liên kết Giáo viên AI ở sidebar. (Commit tài liệu `ca3cd24` sau merge là commit RỖNG do lỗi neo văn bản khi sửa file — nội dung ghi nhận merge được bổ sung tại nhánh dưới đây.)
- **Sự cố độ trễ:** lượt thật đầu tiên của Hoa trên Android nhận 504 TIMEOUT của Worker (Gemini không trả trong 25s). Vòng điều tra + sửa ở nhánh **`fix/ai-tutor-latency`** (từ main `ca3cd24`): Worker ghi log `tutor_timing` + trả `timings.geminiMs`; frontend hiện pha chờ kèm số giây và thời gian trả lời; prompt thu gọn −37% (13.516 → 8.574 ký tự). Test 369/369 + battery Worker 7/7. Sau review của Hoa: telemetry sửa đúng nghĩa (gemini_ms/worker_ms tách bạch, log đúng HTTP status, bỏ total_ms), PR #155 đã mở; test 370/370 + battery v2 6/6, contentVersion nhánh `20261117-ai-tutor4`. **Chưa merge, chưa deploy Worker của nhánh.**
- **Phiên bản:** main ở `20261117-ai-tutor2`; nhánh độ trễ ở `20261117-ai-tutor4`.

## Đã xong theo chặng

1. **Audit** → `docs/AI_TUTOR_REPO_MAP.md`. Phát hiện quan trọng: repo dùng `src/` + `data/content.json` (không có `js/`, không có file dữ liệu riêng từng cấp); từ vựng nằm ở `prepWords/foundationWords/lookup` (927 dòng, 543 từ duy nhất), ngữ pháp ở `knowledgePoints` (105 điểm); **chưa có dữ liệu HSK 3**.
2. **Worker** `workers/ai-tutor-proxy/` — CORS allowlist không wildcard, PIN timing-safe, body ≤500 KB, MIME allowlist, rate limit, timeout 25 s, Structured Outputs + trường phát âm (Phụ lục VIII), model mặc định `gemini-4-hydrogen`. LƯU Ý: file trong repo ĐÃ đồng bộ theo bản production v4 ngày 2026-11-17 (SHA-256 worker.js `939a0ccd…`; thinking low/800 token/rate limit IP+PIN/stream body/chuẩn hóa x-wav — chi tiết ở QA report A5 và README Worker mục 8). Repo là nguồn sự thật duy nhất cho Worker từ nay.
3. **Guardrail + 8 kịch bản** — adapter chỉ đọc, `lookupLocalWord` trả đúng pinyin/nghĩa giáo trình; 64/64 từ gợi ý của 8 kịch bản đều có trong từ điển thật (đã thay các từ gợi ý ban đầu không có trong sách: 多少钱/路/站/同事…).
4. **Voice engine** — `isTypeSupported` trước khi ghi, tự chọn webm/mp4 theo máy, tối đa 20 s tự dừng+gửi, dọn track/Blob URL khi đổi phiên, TTS zh-CN 1.0×/0.75× + nút dừng, lỗi micro bằng tiếng Việt.
5. **View + lưu trữ** — route `#/tutor` lazy-load; sidebar +1 liên kết (thanh dưới giữ nguyên 5 nút); thẻ lối tắt ở `#/today`; thống kê ở `#/progress`; cấu hình ở `#/settings`; duy nhất khóa `hsk3_ai_tutor_state` (schemaVersion 1), không lưu audio.

## Việc còn lại (ngoài nhánh này)

- **nextTask duy nhất:** Hoa xem báo cáo vòng độ trễ; nếu duyệt: merge nhánh `fix/ai-tutor-latency`, deploy Worker của nhánh lên Cloudflare (dán đè như mọi lần), chạy 5 lượt văn bản HSK 2 trên app chính thức và báo lại các số giây app hiển thị (hoặc dòng `tutor_timing` trong Workers Logs) để chốt quyết định timeout/model bằng dữ liệu. Sau đó tiếp tục checklist B1/Android còn thiếu.
- Khi app có dữ liệu HSK 3, guardrail tự mở rộng (adapter đọc theo `level` trong dữ liệu, không cần sửa code).
