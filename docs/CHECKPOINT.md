# CHECKPOINT — HSK3.0

- **milestone:** M6 — QA và phát hành pilot (đang thực hiện)
- **status:** in_progress
- **currentLessonId:** hsk1-l01
- **lastCompletedTask:** M0–M5 xong ở mức code + dữ liệu local: khảo sát nguồn (M1), khung app + schema (M2), pilot Workbook HSK1 Bài 1 trọn vòng (M3–M4), lưu tiến độ/ôn tập/sao lưu (M5). Validator + unit test đạt local (xem QA_REPORT.md).
- **nextTask:** Hoàn tất M6: PR cho nhánh pilot → CI xanh → merge → bật GitHub Pages → nghiệm thu live (hành trình học, audio, 4 bề rộng) → cập nhật checkpoint này bằng SHA/URL thật. Sau đó DỪNG, chờ người dùng nghiệm thu pilot; không nhập hàng loạt HSK 1.
- **blockers:**
  - Nội dung Textbook HSK1 chưa đọc được (công cụ đọc web báo lỗi rỗng khi mở PDF textbook ngày 2026-10-31) → ngữ pháp câu, hội thoại và đáp án của Textbook đều `unverified`; pilot hiện dùng nội dung Workbook đã kiểm chứng.
  - Chưa nghe kiểm chứng audio bằng tai (môi trường không có khả năng nghe) → đối ứng track mới ở mức số hiệu in trong sách + danh mục nguồn; nghe từng câu đang tắt vì chưa có timestamp kiểm chứng.
  - Quyền tái xuất bản sách/audio: `unknown` → app chỉ liên kết/phát trực tiếp từ nguồn, không sao chép.
- **checksRun:** `node scripts/validate.mjs` OK; `node --test tests/*.test.mjs` 6/6 pass; `node --check` cho 4 file src OK; HTTP local 200 cho `/`, `data/content.json`, `src/app.js`, `assets/styles.css`. Chi tiết: `docs/QA_REPORT.md`.
- **evidence:** `docs/SOURCE_AUDIT.md` (bằng chứng nguồn), `docs/CURRICULUM_MAP.md` (map Bài 1 đến từng trang/track).
- **commit:** (cập nhật sau khi push/merge)
- **deploymentUrl:** (cập nhật sau khi Pages hoạt động và nghiệm thu)

## Tóm tắt trạng thái theo chặng

| Chặng | Trạng thái | Ghi chú |
| --- | --- | --- |
| M0 Hiện trạng | done | Repo chỉ có README.md ở HEAD 8e66815, không PR mở (kiểm 2026-10-31) |
| M1 Khảo sát nguồn | done | Trang sách + trang audio đọc trực tiếp; Workbook HSK1 tải về đọc trực quan mục lục + Bài 1 + bìa/ISBN; Textbook chưa đọc được |
| M2 UX + schema | done | App tĩnh, hash routes đủ các màn hình trong đặc tả; schema + validator |
| M3 Pilot nội dung | done (phạm vi Workbook) | Bài 1 Workbook: 3 điểm kiến thức phát âm, 6 câu hội thoại in trong sách, 2 track audio, 6 câu chấm tự động từ bản in, 4 bài tự đối chiếu |
| M4 Player + bài tập | done | Một audio element, phát cả track, tốc độ 0.75/1/1.25, tua; làm sai mở đúng phần giải thích rồi quay lại không mất trạng thái |
| M5 Lưu + ôn | done | localStorage có schemaVersion, lịch ôn 1/3/7/14/30, xuất/nhập sao lưu có validate + xem trước + giữ bản trước khi ghi đè |
| M6 QA + phát hành | in_progress | Xem nextTask |
| M7 Mở rộng HSK1 | not_started | Chỉ bắt đầu sau khi người dùng nghiệm thu pilot |
