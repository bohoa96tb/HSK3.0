# CHECKPOINT — HSK3.0

- **milestone:** M6 — QA và phát hành pilot
- **status:** done (pilot đã phát hành, chờ người dùng nghiệm thu)
- **currentLessonId:** hsk1-l01
- **lastCompletedTask:** Phát hành pilot: PR #1 merge vào main (a9e1f24a45566acfa14c921b197bdac04913494e), GitHub Pages live tại https://bohoa96tb.github.io/HSK3.0/ (nguồn: main, thư mục gốc), nghiệm thu live 8/9 bước đạt (QA_REPORT.md mục 4), sửa 2 lỗi nhỏ sau nghiệm thu (nút tạm dừng ở hàng track; nhãn tự đánh giá tiếng Anh) trong PR bookkeeping/sửa lỗi đi kèm checkpoint này.
- **nextTask:** Chờ người dùng nghiệm thu pilot tại https://bohoa96tb.github.io/HSK3.0/. Sau khi được nghiệm thu mới bắt đầu M7 (làm từng bài HSK1 tiếp theo theo pipeline ở MASTER_PLAN). Trong lúc chờ: chỉ sửa lỗi pilot và — nếu có công cụ đọc PDF phù hợp — thử lại việc đọc Textbook HSK1 để mở khóa nội dung ngữ pháp/hội thoại của sách giáo khoa (hiện blocked).
- **blockers:**
  - Nội dung Textbook HSK1 chưa đọc được (công cụ đọc web báo lỗi rỗng khi mở PDF textbook ngày 2026-10-31) → ngữ pháp câu, hội thoại và đáp án của Textbook đều `unverified`; pilot hiện dùng nội dung Workbook đã kiểm chứng.
  - Chưa nghe kiểm chứng audio bằng tai → đối ứng track ở mức số hiệu in trong sách + danh mục nguồn; nghe từng câu đang tắt vì chưa có timestamp kiểm chứng.
  - Workflow CI chưa có trên GitHub: GitHub App tích hợp bị 403 khi ghi `.github/workflows/ci.yml` (thiếu quyền Workflows) và `push_files` (git trees) cũng 403. File ci.yml đã chuẩn bị ở local (bản sao trong PR #1 mô tả). Cần người dùng thêm file qua giao diện web GitHub hoặc cấp thêm quyền cho app thì CI mới chạy được. Kiểm tra hiện tại chạy local + ghi QA_REPORT.
  - Bề rộng 360/390 px chưa kiểm được bằng công cụ trình duyệt (không có thao tác đổi viewport); chưa thử Android thật.
- **checksRun:** Local: `node scripts/validate.mjs` OK; `node --test tests/*.test.mjs` 6/6 pass; `node --check` 4 file src OK. Live: HTTP 200 cho /, data/content.json, src/app.js, assets/styles.css với dung lượng khớp bản merge, content.json khớp byte với bản local; QA trình duyệt live 8/9 bước đạt (QA_REPORT mục 4).
- **evidence:** `docs/SOURCE_AUDIT.md`, `docs/CURRICULUM_MAP.md`, `docs/QA_REPORT.md`.
- **commit:** PR #1 https://github.com/bohoa96tb/HSK3.0/pull/1 — merge commit a9e1f24a45566acfa14c921b197bdac04913494e; PR sửa lỗi/bookkeeping sau nghiệm thu: (ghi số PR ở chính PR đó — xem lịch sử PR của repo).
- **deploymentUrl:** https://bohoa96tb.github.io/HSK3.0/

## Tóm tắt trạng thái theo chặng

| Chặng | Trạng thái | Ghi chú |
| --- | --- | --- |
| M0 Hiện trạng | done | Repo chỉ có README.md ở HEAD 8e66815, không PR mở (kiểm 2026-10-31) |
| M1 Khảo sát nguồn | done | Trang sách + trang audio đọc trực tiếp; Workbook HSK1 tải về đọc trực quan mục lục + Bài 1 + bìa/ISBN; Textbook chưa đọc được |
| M2 UX + schema | done | App tĩnh, hash routes đủ các màn hình trong đặc tả; schema + validator |
| M3 Pilot nội dung | done (phạm vi Workbook) | Bài 1 Workbook: 3 điểm kiến thức phát âm, 6 câu hội thoại in trong sách, 2 track audio, 6 câu chấm tự động từ bản in, 4 bài tự đối chiếu |
| M4 Player + bài tập | done | Một audio element, phát cả track, tốc độ 0.75/1/1.25, tua; làm sai mở đúng phần giải thích rồi quay lại không mất trạng thái (đã nghiệm thu live) |
| M5 Lưu + ôn | done | localStorage có schemaVersion, lịch ôn 1/3/7/14/30, xuất/nhập sao lưu có validate + xem trước + giữ bản trước khi ghi đè |
| M6 QA + phát hành | done | PR #1 merged, Pages live, QA live 8/9 (bước 360/390px không làm được bằng công cụ hiện có — ghi rõ, không tuyên bố đạt) |
| M7 Mở rộng HSK1 | not_started | Chỉ bắt đầu sau khi người dùng nghiệm thu pilot |
