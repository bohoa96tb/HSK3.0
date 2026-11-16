# AI Tutor Proxy — Cloudflare Worker bảo vệ Gemini API Key

Worker này là cổng trung gian duy nhất giữa app HSK3.0 (GitHub Pages) và
Google Gemini. **API Key chỉ tồn tại ở Worker Secret** — không có trong
frontend, HTML, repo, localStorage, URL hay log.

## 1. Model đã xác minh (2026-11-16, tài liệu Google chính thức)

| Model | Trạng thái | GenerateContent | Audio input | Ghi chú |
|---|---|---|---|---|
| `gemini-4-hydrogen` (mặc định) | GA 12/11/2026 (Google Cloud model card, cập nhật 2026-11-13) | Có | Có (input only) | Context 1.048.576 token; output đồng bộ tối đa 65.536 — Worker vẫn khóa cứng `maxOutputTokens: 600`. |
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

- Body tối đa **500 KB** (kiểm tra cả `Content-Length` và byte thực nhận) → 413.
- Chỉ nhận audio MIME: webm/mp4/ogg/wav/mpeg; client ghi tối đa 20 giây và
  kiểm tra kích thước Blob trước khi mã hóa Base64.
- Rate limit cơ bản trong bộ nhớ: **30 lượt / 10 phút / (IP + chế độ PIN)** →
  429. Đây là giới hạn *theo từng isolate* của Cloudflare (không toàn cục).
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

## 7. Kiểm tra nhanh sau deploy

```bash
curl https://<worker-url>/health
curl -X POST https://<worker-url>/api/tutor-turn \
  -H "Content-Type: application/json" -H "X-Tutor-Pin: <pin>" \
  -d '{"sessionId":"test-1","level":"HSK1","mode":"tutor","systemInstruction":"Bạn là giáo viên tiếng Trung cho người Việt, chỉ dùng từ HSK1.","history":[],"userText":"你好"}'
```
