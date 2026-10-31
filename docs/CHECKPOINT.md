# CHECKPOINT — HSK3.0

- milestone: sửa pilot theo phản hồi người dùng, chưa bắt đầu M7
- status: implementation_complete_local_checks_passed; đang phát hành và QA live
- currentLessonId: hsk1-l01
- lastCompletedTask: thiết kế lại UI toàn app; đọc Textbook Bài 1, sửa học liệu; thay 6 câu tự soạn bằng 3 câu chọn hình đúng đề gốc; thêm 10 lượt thoại/3 track Textbook, 3 bài nghe–viết có lưu nháp; hình trích đúng sách.
- nextTask: nghiệm thu live bản redesign sau merge, sửa lỗi nếu phát hiện; chưa mở Bài 2.
- checksRun: npm run check — validator đạt, 11/11 test đạt gồm DOM routes/luồng bài tập/player giả lập/migration; diff-check sửa khoảng trắng. Chưa coi DOM test là visual/browser/audio QA.
- blockers: transcript đã đối chiếu bản in nhưng chưa nghe xác minh track/ranh giới từng câu; đáp án nghe–viết chưa có; chưa thử Android thật; GitHub workflow chưa cấu hình (lịch sử thiếu quyền).
- evidence: docs/SOURCE_AUDIT.md, docs/QA_REPORT.md, assets/lesson-01/ATTRIBUTION.md
- baselineCommit: 7586cef9ce6dc137cfe92bd5ece005c0b13f7a93
- branch: codex/learning-redesign
- deploymentUrl: https://bohoa96tb.github.io/HSK3.0/

Bản này là hoàn thiện Bài 1. Không tính M0–M6 hoàn thành đầy đủ chỉ vì trang đã chạy. Audio từng câu và kiểm nghe còn chưa nghiệm thu.
