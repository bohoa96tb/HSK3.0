# CHECKPOINT — HSK3.0

- milestone: Bài 1–4 đã phát hành theo chuẩn ux3 (Bài 4: PR #21); quy tắc tiếp tục theo D13 — mỗi lượt "Tiếp tục" hoàn thành trọn một bài, không chờ nghiệm thu từng bài
- status: lessons1-4_completed_with_documented_limits
- currentLessonId: hsk1-l04
- lastCompletedTask: Bài 4 我有两个孩子 (PR #20 khép QA Bài 3 — responsive đạt toàn bộ + rà soát zū/shéi theo D14, merge 7fb43b75, contentVersion 20261101-lesson3-2; PR #21 Bài 4 merge 9973ab0b, contentVersion 20261101-lesson4-1): 21 từ mới + Hán–Việt 21/21 (tổng 66/66), 6 điểm kiến thức (有/ số từ / 呢 / lượng từ + nền biến điệu thanh 3, thanh nhẹ), 14 câu/3 hội thoại print-verified, 8 track, 4 câu hỏi hiểu hội thoại in trong Textbook verified-from-print (đáp án 1/2/2/2), 1 bài chọn âm tiết 8 ô verified-editorial theo chế độ chấm mới "syllable" (D15; lời đọc tr. in 010 + tài liệu đáp án đăng lại khớp hoàn toàn), 12 từ nền — loa theo đơn vị đủ 14/14 câu, 21/21 từ mới, 12/12 từ nền (Bài 4 không thiếu loa nào). QA độc lập PASS, 2 ghi chú nhỏ không chặn (pinyin xuésheng theo quy ước chung; wb4-text-2 tách thân câu/lựa chọn, nội dung tương đương bản in). Phần 模拟测练 của Workbook Bài 4 KHÔNG đưa vào bài theo D15.

- nextTask: Bài 5 今天我休息 (Textbook tr. in 028–035; Workbook 019–022) khi Hoa gửi "Tiếp tục".
- checksRun: npm run check — validator đạt (4 bài; Hán–Việt 66/66; 128 ô nghe–viết/chọn âm tiết verified-editorial — 120 ô Bài 1–3 + 8 ô Bài 4), 44/44 test đạt; git diff --check sạch. CI GitHub Actions vẫn chưa tạo được qua connector (403); bản bàn giao docs/ci/ci.yml — cần Hoa tạo .github/workflows/ci.yml qua web GitHub hoặc cấp quyền workflow.

- blockers: quyền tái xuất bản vẫn unknown; mọi đoạn loa vẫn asr-draft, chưa nghe kiểm chứng bởi người; đơn vị chưa có loa riêng: 大家 (Bài 1), 雨/五/一/椅子 (Bài 2), 吗/嘴 (Bài 3) cùng các âm tiết/ví dụ đã ghi ở các lượt trước; trang Tiến độ chỉ dẫn tới điểm nghe–viết ở Tổng kết/Luyện tập chứ không in điểm trực tiếp (quan sát nghiệm thu live Bài 3, cùng cơ chế Bài 1–2); chưa thử Android thật.
- evidence: docs/SOURCE_AUDIT.md (mục Bài 3), docs/QA_REPORT.md (mục Bài 3), docs/DECISIONS.md D13, docs/UI_SPEC.md mục 11
- baselineCommit: 9973ab0b13ff16e0541e9f7235cd411b60631078
- branch: main (PR #20, #21)
- deploymentUrl: https://bohoa96tb.github.io/HSK3.0/

- release: PR #18 merge 6355ea4e; contentVersion live 20261101-lesson3-1 (đã đối chiếu content.json trên URL thật); 5 ảnh assets/lesson-03 tải lên qua web GitHub (commit 8479d230) và đối chiếu sha256 khớp bản local; file văn bản đẩy qua connector, blob đối chiếu khớp.
- liveChecks: nghiệm thu live đạt các luồng chính Bài 3 (lộ trình mở Bài 3; Từ cần biết 18 thẻ, thanh hỗ trợ đủ 5 nút, thẻ 吗 "Chưa có audio"; Nghe & đọc 3 đoạn, loa câu mở đúng track; Luyện tập: chọn hình chấm đúng, liên kết ôn tập trỏ kp-hsk1-l03-ma; nghe–viết bài 1 chấm 12/12 và khôi phục nguyên trạng sau reload; hồi quy liên kết Bài 2 trỏ kp-hsk1-l02-word-order). Hán–Việt trong hồ sơ kiểm tra đã bật sẵn từ lượt trước nên không kết luận về mặc định trên hồ sơ mới (mặc định tắt đã khóa bằng test DOM). Iframe responsive cho tuyến Bài 3 ĐÃ chạy ở lượt rà soát sau phát hành (PR bookkeeping bổ sung tuyến): cả 3 tuyến đạt ở 360/390/768/1440, gồm trạng thái cỡ chữ tối đa và mini player mở ở 390 — xem docs/QA_REPORT.md mục bổ sung QA Bài 3. Không đồng nghĩa đã nghe thẩm định đoạn loa hoặc đã thử Android thật.

- release (Bài 4): PR #21 merge 9973ab0b; contentVersion live 20261101-lesson4-1 (đã đối chiếu content.json trên URL thật: Bài 4 có mặt, đáp án 1/2/2/2, bài chọn âm tiết verified-editorial/syllable); ảnh assets/lesson-04/classroom.webp tải lên qua web GitHub (commit b085e37) và đối chiếu sha256 khớp bản local (86d8e5be…); file văn bản đẩy qua connector, blob đối chiếu khớp.
