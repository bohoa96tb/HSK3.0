# CHECKPOINT — HSK3.0

- milestone: Bài 1 và Bài 2 hoàn thiện ux3 (thanh hỗ trợ gọn theo phạm vi, thẻ từ + âm Hán–Việt, hỗ trợ Mục 5 có ghi nhận, mini player đo chiều cao thật); chưa bắt đầu Bài 3
- status: lessons1-2_ux3_deployed_pending_human_acceptance
- currentLessonId: hsk1-l02
- lastCompletedTask: Lượt ux3 (PR #15 merge 028f24de): Mục 2 đủ Pinyin/Nghĩa/Hán–Việt/A−/A+ với trường hanViet riêng (27/27, nguồn từ điển Hán Nôm Thi Viện, mặc định tắt); Mục 5 có Pinyin/Nghĩa cho 25/25 lựa chọn và ghi supportUsed tách riêng; nghe–viết chặn lộ đáp án trước khi chấm; mini player thu gọn/đóng với insets đo thật; QA độc lập vòng 1 bắt 1 lỗi ghi nhận hỗ trợ + nghi vấn chồng lớp — đã sửa và kiểm lại (xem docs/QA_REPORT.md mục ux3, quyết định D12, UI_SPEC mục 11).
- nextTask: chờ người dùng nghiệm thu trên bản live. Sau nghiệm thu mới mở Bài 3 (quy trình nguồn chuẩn + chuẩn ux3 ở UI_SPEC mục 11).
- checksRun: npm run check — validator đạt (2 bài, Hán–Việt 27/27, lựa chọn 25/25 có pinyin/vi, 78 ô nghe–viết), 37/37 test đạt (thêm ux3.test.mjs); git diff --check sạch. CI GitHub Actions vẫn chưa tạo được qua connector (403); bản bàn giao docs/ci/ci.yml — cần người dùng tạo .github/workflows/ci.yml qua web GitHub hoặc cấp quyền workflow.
- blockers: quyền tái xuất bản vẫn unknown; đoạn loa căn bằng máy chưa nghe kiểm chứng bởi người; 12 đơn vị chưa có loa riêng （大家； 雨/五/一/椅子; 6 âm tiết 八/拔/把/爸/阿/啊; ví dụ 雨）; chưa thử Android thật — checklist: mở Bài 2 trên điện thoại, bật Hán–Việt ở Từ cần biết, bật Pinyin ở Luyện tập rồi trả lời một câu (kết quả phải ghi có hỗ trợ), mở bàn phím trong ô nghe–viết và kiểm tra nút Kiểm tra còn bấm được, phát audio rồi thu gọn/đóng mini player ở cuối trang.
- evidence: docs/SOURCE_AUDIT.md (mục Âm Hán–Việt và Pinyin/nghĩa Mục 5), docs/QA_REPORT.md (mục Lượt ux3), docs/DECISIONS.md D12, docs/UI_SPEC.md mục 11
- baselineCommit: 028f24de39c985bae52473c7b3b11cd817ce49aa
- branch: main (PR #15)
- deploymentUrl: https://bohoa96tb.github.io/HSK3.0/

- release: PR #15 merge 028f24de (nhánh ux/support-hanviet-miniplayer, commit 3378e3c2); contentVersion live 20261101-ux3 (đã đối chiếu content.json và ?v= trên URL thật).
- liveChecks: nghiệm thu live đạt 6/6 bước trên trình duyệt desktop (đủ 5 nút Mục 2, HV: CAO HỨNG đúng thẻ, không nhảy trang khi đổi Nghĩa giữa trang, Pinyin hiện cả 4 lựa chọn, loa không chọn đáp án, nghe–viết không lộ đáp án + cuối trang không bị che, mini player thu gọn/đóng) và đạt các tổ hợp iframe 360/390/768/1440 cho Từ cần biết + Bài tập Bài 2 qua tests/responsive.html. Không đồng nghĩa đã nghe thẩm định đoạn loa hoặc đã thử Android thật.
