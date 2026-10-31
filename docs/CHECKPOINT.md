# CHECKPOINT — HSK3.0

- milestone: sửa pilot theo phản hồi người dùng, chưa bắt đầu M7
- status: deployed_live_qa_passed_with_documented_limits
- currentLessonId: hsk1-l01
- lastCompletedTask: thiết kế lại UI toàn app; đọc Textbook Bài 1, sửa học liệu; thay 6 câu tự soạn bằng 3 câu chọn hình đúng đề gốc; thêm 10 lượt thoại/3 track Textbook, 3 bài nghe–viết có lưu nháp; hình trích đúng sách.
- nextTask: nghe đối chiếu 3 track Textbook Bài 1 và xác minh timestamp trước khi bật nghe từng câu; chưa mở Bài 2.
- checksRun: npm run check — validator đạt, 11/11 test đạt gồm DOM routes/luồng bài tập/player giả lập/migration; diff-check sửa khoảng trắng. Chưa coi DOM test là visual/browser/audio QA.
- blockers: transcript đã đối chiếu bản in nhưng chưa nghe xác minh track/ranh giới từng câu; đáp án nghe–viết chưa có; chưa thử Android thật; GitHub workflow chưa cấu hình (lịch sử thiếu quyền).
- evidence: docs/SOURCE_AUDIT.md, docs/QA_REPORT.md, assets/lesson-01/ATTRIBUTION.md
- baselineCommit: 7586cef9ce6dc137cfe92bd5ece005c0b13f7a93
- branch: codex/learning-redesign
- deploymentUrl: https://bohoa96tb.github.io/HSK3.0/

Bản này là hoàn thiện Bài 1. Không tính M0–M6 hoàn thành đầy đủ chỉ vì trang đã chạy. Audio từng câu và kiểm nghe còn chưa nghiệm thu.

- release: PR #3 merged f12d4b9dae8ee245a2e3232dd7746360dfa21675; QA bổ sung trên codex/live-qa.
- liveChecks: giao diện desktop; khung iframe 360/390/768/1440 không tràn ngang body ở các màn đã kiểm; bài chọn hình chấm đúng, transcript mở và Pinyin độc lập, track Textbook 1-1 phát tới 0:06/0:06. Không đồng nghĩa nghe thẩm định nội dung audio.
