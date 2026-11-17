# AI Tutor Proxy — Cloudflare Worker bảo vệ Gemini API Key

Worker này là cổng trung gian duy nhất giữa app HSK3.0 (GitHub Pages) và
Google Gemini. **API Key chỉ tồn tại ở Worker Secret** — không có trong
frontend, HTML, repo, localStorage, URL hay log.

## 1. Model đã xác minh (2026-11-16, tài liệu Google chính thức)

| Model | Trạng thái | GenerateContent | Audio input | Ghi chú |
|---|---|---|---|---|
| `gemini-2.5-flash` (mặc định từ bản fast-model 2026-11-17) | GA 12/11/2026 (Google Cloud model card, cập nhật 2026-11-13) | Có | Có (input only) | Context 1.048.576 token; output đồng bộ tối đa 65.536 — Worker khóa `maxOutputTokens: 800` kèm `thinkingConfig.thinkingLevel: "low"` (bản production v4, xem mục 8). |
| `gemini-3.5-flash-lite` (tiết kiệm, qua `GEMINI_MODEL`) | GA 21/07/2026 | Có | Có (input only) | Model 3.5 rẻ/nhanh nhất; hợp Structured JSON. |

Cả hai dùng chung cấu hình `responseMimeType: "application/json"` +
`responseSchema` (Structured Outputs) và `maxOutputTokens` trong
`generationConfig`. Worker **không tự đổi model khi lỗi**: lỗi upstream được
ánh xạ thành thông báo tiếng Việt (429/502/504) và log kỹ thuật chỉ gồm
`status` + tên model. Dòng `gemini-2.5-*` đã ngừng hỗ trợ — không dùng.

## 2. Triển khai

```bash
cd workers/ai-tutor-proxy
npm i -g wrangler        # hoặc dùng npx wrangler
npx wrangler login

# Bắt buộc: khóa Gemini (lấy tại Google AI Studio), nhập khi được hỏi — không dán vào file nào
npx wrangler secret put GEMINI_API_KEY

# Khuyến nghị: PIN dùng chung để chặn người lạ đốt quota
npx wrangler secret put TUTOR_ACCESS_PIN

# (Tùy chọn) đổi model tiết kiệm: thêm vào wrangler.toml mục [vars]
# GEMINI_MODEL = "gemini-3.5-flash-lite"

npx wrangler deploy
```

Sau khi deploy, ghi lại URL dạng `https://hsk3-ai-tutor-proxy.<tài-khoản>.workers.dev`.

## 3. Cấu hình trong app

Vào **Cài đặt → Giáo viên AI** (hoặc ngay tại trang `#/tutor`): bật module,
dán **Worker URL** ở trên và nhập **PIN** trùng với `TUTOR_ACCESS_PIN`.

> ⚠️ PIN lưu trong `localStorage` của trình duyệt **không phải bí mật tuyệt
> đối** (ai mở được máy/devtools đều thấy). PIN chỉ là cổng chống lạm dụng
> chi phí cơ bản. CORS cũng **không phải** cơ chế xác thực — nó chỉ chặn
> trình duyệt của trang khác, không chặn curl/script.

## 4. Chính sách khi không đặt TUTOR_ACCESS_PIN

Nếu không cấu hình secret `TUTOR_ACCESS_PIN`, Worker cho phép mọi request
đúng CORS đi qua (chế độ mở). Chế độ này chỉ nên dùng khi tự học cá nhân và
chấp nhận rủi ro người khác biết URL Worker sẽ dùng chung quota. **Khuyến
nghị luôn đặt PIN** trước khi chia sẻ URL app cho người khác.

## 5. Giới hạn chi phí & lạm dụng đã cài

- Body tối đa **500 KB** → 413, khóa 3 lớp: pre-check `Content-Length`, **đọc dạng stream và hủy ngay khi vượt ngưỡng** (không nạp hết body vào bộ nhớ), kiểm lại byte thực nhận.
- Chỉ nhận audio MIME: webm/mp4/ogg/wav/mpeg; client ghi tối đa 20 giây và
  kiểm tra kích thước Blob trước khi mã hóa Base64.
- Rate limit cơ bản trong bộ nhớ: **30 lượt / 10 phút / (IP + PIN)** (PIN được
  băm làm thẻ bucket, không ghi log) → 429. Bucket hết hạn được dọn; khi quá
  5.000 bucket chỉ evict bucket cũ nhất — **không bao giờ xóa sạch toàn bộ**
  (xóa sạch sẽ cho phép vượt giới hạn). Đây là giới hạn *theo từng isolate*
  của Cloudflare (không toàn cục).
  Muốn chặn cứng toàn cục, thêm **Cloudflare Rate Limiting rule** cho route
  của Worker trong dashboard (miễn phí ở mức cơ bản) hoặc Durable Object —
  ngoài phạm vi bản này, ghi rõ để không ngộ nhận.
- Timeout gọi Gemini: 25 giây (AbortController) → 504 tiếng Việt.
- Gemini trả 429 → 429; JSON hỏng/sai schema → 502; không retry vô hạn
  (mỗi lượt đúng 1 lần gọi).

## 6. Endpoint

- `GET /health` → `{ok:true, service, model}` (không lộ key).
- `POST /api/tutor-turn` — body:
  `{sessionId, level: "HSK1|HSK2|HSK3", mode: "tutor|roleplay", scenarioId?, systemInstruction, history: [{role:"user|tutor", hanzi}] (≤10), userText?, userAudioBase64?, audioMimeType?}`
  Header: `X-Tutor-Pin` (khi Worker có PIN).
  Đáp: schema Structured Outputs gồm `user_transcript_*`, `evaluation`
  (kèm `pronunciation_status` + `pronunciation_feedback_vi` theo Phụ lục
  VIII) và `tutor_reply` (kèm `out_of_level_words`).

## 8. Phiên bản production & quy tắc đồng bộ

**Bản đang chạy production: v4 (2026-11-17)** — LƯU Ý: repo đã có bản fast-model (model mặc định `gemini-2.5-flash`, timeout 40s, thinkingConfig theo họ model, lỗi UPSTREAM kèm mã Google) chờ Hoa deploy sau khi merge PR tương ứng; production vẫn chạy v4 cho tới lúc đó — chính là file `worker.js`
trong thư mục này, SHA-256:
`939a0ccdcaf17bb696ff8f6fc78387e10c853effb236b414ea04d8ffc153f718`.
So với bản đầu của nhánh (f1cffec), v4 thay đổi đúng 5 điểm, đã kiểm thử
riêng từng điểm: (1) `thinkingLevel: "low"` + `maxOutputTokens: 800`
(Hydrogen mặc định suy luận ở mức high và token suy luận tính vào trần
output — trần 600 cũ có thể bị cắt JSON); (2) rate limit theo IP+PIN và
không xóa sạch bucket; (3) đọc body dạng stream có hủy sớm; (4) chuẩn hóa
`audio/x-wav` → `audio/wav` trước khi gọi Gemini; (5) lỗi `MAX_TOKENS` có
mã/thông báo riêng (`TRUNCATED`).

Quy tắc đồng bộ (bắt buộc):
- **Repo là nguồn sự thật duy nhất.** File `worker.js` ở đây phải luôn
  trùng byte với bản đang chạy trên Cloudflare.
- Deploy = dán đúng nội dung file này vào Cloudflare Dashboard
  (Edit code) hoặc `wrangler deploy` từ thư mục này. Không sửa code trực
  tiếp trên Dashboard rồi để lệch repo; nếu buộc phải hotfix trên
  Dashboard, chép lại vào repo trong cùng vòng làm việc và ghi vào
  checkpoint.
- Secrets (`GEMINI_API_KEY`, `TUTOR_ACCESS_PIN`) chỉ quản lý trong
  Cloudflare (mục 2) — không đổi khi đồng bộ code, không ghi vào repo.

## 7. Kiểm tra nhanh sau deploy

```bash
curl https://<worker-url>/health
curl -X POST https://<worker-url>/api/tutor-turn \
  -H "Content-Type: application/json" -H "X-Tutor-Pin: <pin>" \
  -d '{"sessionId":"test-1","level":"HSK1","mode":"tutor","systemInstruction":"Bạn là giáo viên tiếng Trung cho người Việt, chỉ dùng từ HSK1.","history":[],"userText":"你好"}'
```
