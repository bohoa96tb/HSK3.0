# GEMINI.md — Quy tắc ưu tiên cao nhất cho mọi phiên làm việc trên HSK3.0

Đọc đồng thời [AGENTS.md](file:///c:/HSK3.0/AGENTS.md), [.agent/rules/lesson-images.md](file:///c:/HSK3.0/.agent/rules/lesson-images.md) và [.agent/workflows/lesson-creation-team.md](file:///c:/HSK3.0/.agent/workflows/lesson-creation-team.md) trước khi bắt tay làm bất kỳ thay đổi nào.

## 3 mệnh lệnh ưu tiên tuyệt đối khi thêm hoặc sửa bài học

1. **Nhánh riêng, cấm chạm `main`:** Bắt buộc tạo hoặc làm việc trên nhánh `preview/<ten-bai>` (tách từ `main`). Tuyệt đối không commit, push hay merge lên `main` khi người dùng chưa duyệt.
2. **Đủ bộ quy luật hình ảnh (`lesson-images.md`):** Chuẩn gốc là **Bài 3 HSK 2** (`assets/hsk2-lesson-03/`). Cấm tuyệt đối tự code `<svg>` vẽ tay (hoặc raster từ SVG) cho tranh minh họa; phải dùng raster `.webp` sinh cùng 1 Art Direction sáng ấm, đồng bộ nền & ánh sáng trong từng bộ A/B/C/D, không chữ thừa, đọc rõ trên màn hình `390px`.
3. **Đủ 3 vai Builder → Art → Visual QA (`lesson-creation-team.md`):** Không bỏ qua bước Visual QA độc lập kiểm tra thực tế ở viewport `390×844` (đạt 6/6 tiêu chí) rồi mới gửi link preview cho người dùng.
