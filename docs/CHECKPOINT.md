# CHECKPOINT — HSK3.0

- milestone: Bài 1 và Bài 2 hoàn thiện nghe–viết + trải nghiệm hiển thị/loa theo đơn vị; chưa bắt đầu Bài 3
- status: lessons1-2_ux_deployed_pending_human_acceptance
- currentLessonId: hsk1-l02
- lastCompletedTask: Lượt UX (PR #9/#10/#11/#13): thanh hỗ trợ dùng chung áp dụng tại chỗ (hết nhảy trang khi đổi Pinyin/Nghĩa/Cỡ chữ), loa theo đơn vị với đoạn căn bằng máy (asr-draft) cho câu/từ/ví dụ/lựa chọn, nghe–viết accordion + khôi phục kết quả sau refresh + sửa toàn bộ chữ hướng dẫn mâu thuẫn. Chuẩn áp dụng cho bài sau ghi ở UI_SPEC mục 10, CONTENT_STANDARD bổ sung 01/11/2026, quyết định D11.
- nextTask: chờ người dùng nghiệm thu trên bản live. Sau nghiệm thu mới mở Bài 3 (quy trình nguồn chuẩn + chuẩn thanh hỗ trợ/loa ở UI_SPEC mục 10).
- checksRun: npm run check — validator đạt (2 bài, 8 track/bài, kiểm audio refs), 30/30 test đạt (thêm ux.test.mjs); git diff --check sạch. CI GitHub Actions vẫn chưa tạo được qua connector (403); bản bàn giao docs/ci/ci.yml — cần người dùng tạo .github/workflows/ci.yml qua web GitHub hoặc cấp quyền workflow.
- blockers: quyền tái xuất bản vẫn unknown; đoạn loa căn bằng máy chưa nghe kiểm chứng bởi người; 12 đơn vị chưa có loa riêng （大家； 雨/五/一/椅子; 6 âm tiết 八/拔/把/爸/阿/啊; ví dụ 雨）; chưa thử Android thật — checklist: mở Bài 1 trên điện thoại, cuộn giữa trang đọc rồi bật/tắt Pinyin (trang phải đứng yên), bấm loa một từ và một câu, mở bàn phím trong ô nghe–viết và kiểm tra nút Kiểm tra còn bấm được.
- evidence: docs/SOURCE_AUDIT.md (mục Ánh xạ audio theo đơn vị), docs/QA_REPORT.md (mục Lượt UX), docs/DECISIONS.md D10–D11, docs/UI_SPEC.md mục 10
- baselineCommit: 1bb763938435c49ada523a62d7aef812ecf50cba
- branch: main (PR #9/#10/#11/#13)
- deploymentUrl: https://bohoa96tb.github.io/HSK3.0/

- release: PR #9 merge c694f2db (nội dung chính), PR #10 merge 3a8c3a82 (vị trí thanh hỗ trợ), PR #11 merge de93e0ec (chữ hướng dẫn từng bài); contentVersion live 20261101-ux2 (đã đối chiếu content.json trên URL thật; PR #13 tăng ?v= để tránh cache giữ bản ux1 — kiểm tra lại vị trí thanh hỗ trợ trên live đạt).
- liveChecks: nghiệm thu live đạt: không nhảy trang khi đổi Pinyin/Nghĩa/A+ ở giữa trang đọc (đối chiếu vị trí bằng ảnh; test DOM chứng minh không render lại), audio đang phát không bị ngắt khi đổi hiển thị, loa từ/câu/lựa chọn hoạt động đúng phạm vi (loa lựa chọn không chọn đáp án), nghe–viết khôi phục dấu + điểm sau refresh và báo ô đã sửa, iframe 360/390/768/1440 cho 3 route đạt. Không đồng nghĩa đã nghe thẩm định đoạn loa hoặc đã thử Android thật.
