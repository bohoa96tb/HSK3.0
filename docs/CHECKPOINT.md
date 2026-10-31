# CHECKPOINT — HSK3.0

- milestone: HSK1 Bài 2 hoàn thiện theo mẫu Bài 1; chưa bắt đầu Bài 3
- status: lesson2_deployed_pending_human_acceptance
- currentLessonId: hsk1-l02
- lastCompletedTask: Bài 2 我叫李文 — đối chiếu trực quan Textbook trang in 005–009 và Workbook 005–008; 15 từ mới, 7 điểm kiến thức, 3 hội thoại/10 lượt thoại print-verified, 4 câu chọn hội thoại theo hình (đáp án suy luận biên tập `verified-from-visual`), 3 bài nghe–viết `unverified` có lưu nháp; khái quát hóa app sang nhiều bài (additionalLessons, exerciseSessions theo bộ bài, migration giữ tiến độ Bài 1).
- nextTask: chờ người dùng nghiệm thu Bài 2 trên bản live. Sau nghiệm thu mới mở Bài 3. Việc tồn đọng chung: nghe đối chiếu các track Bài 1 và Bài 2, xác minh timestamp trước khi bật nghe từng câu.
- checksRun: npm run check — validator đạt (2 bài sẵn sàng), 17/17 test đạt gồm bộ test Bài 2 mới và hồi quy Bài 1; git diff --check sạch. Chưa coi DOM test là visual/browser/audio QA. CI GitHub Actions chưa cấu hình (lịch sử thiếu quyền) — kiểm tra chạy local, không tuyên bố CI.
- blockers: transcript Bài 1 và Bài 2 đã đối chiếu bản in nhưng chưa nghe xác minh track/ranh giới từng câu; đáp án nghe–viết của cả hai bài chưa có (sách không in đáp án); chưa thử Android thật; quyền tái xuất bản vẫn unknown.
- evidence: docs/SOURCE_AUDIT.md (mục Bài 2), docs/QA_REPORT.md (mục Bài 2), assets/lesson-02/ATTRIBUTION.md, docs/CURRICULUM_MAP.md mục 4
- baselineCommit: d64c151677bc39a00f9d405da0580d7d60255993
- branch: main (PR #5 từ lesson/hsk1-lesson-2)
- deploymentUrl: https://bohoa96tb.github.io/HSK3.0/

Bài 1 giữ nguyên trạng thái và giới hạn đã ghi ở các lượt trước; việc được phép làm Bài 2 không đổi các mục "chưa xác minh" của Bài 1 thành đã xác minh.

- release: PR #5 merged d64c151677bc39a00f9d405da0580d7d60255993; contentVersion live 20261101-lesson2-1 (đã đối chiếu content.json và hình trên URL thật). Hình nhị phân tải qua giao diện web GitHub (commit dd46ffc) và đối chiếu sha256 khớp bản local; bản thử qua API connector bị lưu thành text base64 đã bị xóa trước khi merge.
- liveChecks: nghiệm thu live sau PR #5 đạt các luồng chính (lộ trình, 7 mục, transcript/Pinyin/nghĩa độc lập, phát track 2-3 hết 0:13, làm sai có giải thích + ôn, refresh giữ điểm 3/4, Tiến độ có cả hai bài, iframe 360/390/768/1440 không tràn ngang). Một thiếu sót điều hướng (chưa có nút quay lại câu trước) đã sửa trong PR bookkeeping kèm test; chi tiết ở docs/QA_REPORT.md mục Bài 2. Không đồng nghĩa nghe thẩm định nội dung audio hoặc đã thử Android thật.
