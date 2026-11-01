# CHECKPOINT — HSK3.0

- milestone: Bài 1–3 đã phát hành theo chuẩn ux3 (Bài 3: PR #18); quy tắc tiếp tục theo D13 — mỗi lượt "Tiếp tục" hoàn thành trọn một bài, không chờ nghiệm thu từng bài
- status: lessons1-3_completed_with_documented_limits
- currentLessonId: hsk1-l03
- lastCompletedTask: Bài 3 我是中国人 (PR #17 sửa liên kết ôn tập Bài 2 + D13, merge 22992407; PR #18 Bài 3 merge 6355ea4e, contentVersion 20261101-lesson3-2 (bản chữ bằng chứng rà soát; nội dung học không đổi)): 18 từ mới + Hán–Việt 18/18, 5 điểm kiến thức, 15 câu/3 hội thoại print-verified, 8 track, 4 câu chọn hình (③④①② khớp tài liệu đáp án đăng lại), 3 bài nghe–viết 42 ô verified-editorial (tổng 120 ô cả 3 bài). QA độc lập PASS, bắt 1 lỗi liên kết ôn tập wb3-picture-4 (đúng mẫu D13) — đã sửa + test hồi quy.
- nextTask: Bài 4 我有两个孩子 — Hoa đã lệnh tiếp tục kèm khép QA Bài 3 (xem mục bổ sung QA trong QA_REPORT: responsive đạt toàn bộ; hai ô zū/shéi đã rà theo D14).
- checksRun: npm run check — validator đạt (3 bài; Hán–Việt 45/45; lựa chọn 41/41 có pinyin/vi; 120 ô nghe–viết), 41/41 test đạt; git diff --check sạch. CI GitHub Actions vẫn chưa tạo được qua connector (403); bản bàn giao docs/ci/ci.yml — cần Hoa tạo .github/workflows/ci.yml qua web GitHub hoặc cấp quyền workflow.
- blockers: quyền tái xuất bản vẫn unknown; mọi đoạn loa vẫn asr-draft, chưa nghe kiểm chứng bởi người; đơn vị chưa có loa riêng: 大家 (Bài 1), 雨/五/一/椅子 (Bài 2), 吗/嘴 (Bài 3) cùng các âm tiết/ví dụ đã ghi ở các lượt trước; trang Tiến độ chỉ dẫn tới điểm nghe–viết ở Tổng kết/Luyện tập chứ không in điểm trực tiếp (quan sát nghiệm thu live Bài 3, cùng cơ chế Bài 1–2); chưa thử Android thật.
- evidence: docs/SOURCE_AUDIT.md (mục Bài 3), docs/QA_REPORT.md (mục Bài 3), docs/DECISIONS.md D13, docs/UI_SPEC.md mục 11
- baselineCommit: 6355ea4e524d1398eee76d92dcf6aebd09829f84
- branch: main (PR #17, #18)
- deploymentUrl: https://bohoa96tb.github.io/HSK3.0/

- release: PR #18 merge 6355ea4e; contentVersion live 20261101-lesson3-1 (đã đối chiếu content.json trên URL thật); 5 ảnh assets/lesson-03 tải lên qua web GitHub (commit 8479d230) và đối chiếu sha256 khớp bản local; file văn bản đẩy qua connector, blob đối chiếu khớp.
- liveChecks: nghiệm thu live đạt các luồng chính Bài 3 (lộ trình mở Bài 3; Từ cần biết 18 thẻ, thanh hỗ trợ đủ 5 nút, thẻ 吗 "Chưa có audio"; Nghe & đọc 3 đoạn, loa câu mở đúng track; Luyện tập: chọn hình chấm đúng, liên kết ôn tập trỏ kp-hsk1-l03-ma; nghe–viết bài 1 chấm 12/12 và khôi phục nguyên trạng sau reload; hồi quy liên kết Bài 2 trỏ kp-hsk1-l02-word-order). Hán–Việt trong hồ sơ kiểm tra đã bật sẵn từ lượt trước nên không kết luận về mặc định trên hồ sơ mới (mặc định tắt đã khóa bằng test DOM). Iframe responsive cho tuyến Bài 3 ĐÃ chạy ở lượt rà soát sau phát hành (PR bookkeeping bổ sung tuyến): cả 3 tuyến đạt ở 360/390/768/1440, gồm trạng thái cỡ chữ tối đa và mini player mở ở 390 — xem docs/QA_REPORT.md mục bổ sung QA Bài 3. Không đồng nghĩa đã nghe thẩm định đoạn loa hoặc đã thử Android thật.
