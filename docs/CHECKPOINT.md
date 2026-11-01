# CHECKPOINT — HSK3.0

- milestone: Bài 1 và Bài 2 hoàn thiện phần nghe–viết còn thiếu; chưa bắt đầu Bài 3
- status: lessons1-2_dictation_deployed_pending_human_acceptance
- currentLessonId: hsk1-l02
- lastCompletedTask: Hoàn thiện nghe–viết Bài 1–2 (PR #7): đáp án biên tập đã đối chiếu cho 78/78 ô của 6 bài nghe–viết (bản in + tài liệu lời đọc đăng lại + ASR nháp local), chấm tự động theo quy tắc thanh mẫu/vận mẫu/thanh điệu, nghe theo đoạn bài tập (mốc từ ASR đối chiếu lời đọc), sửa đề ô 10 Bài 1 "__ ēn" → "__ ěn". QA_REPORT có bảng Trạng thái hiện tại ở đầu; quy trình đối chiếu tài liệu rời ghi ở CONTENT_STANDARD; quyết định D10.
- nextTask: chờ người dùng nghiệm thu lượt hoàn thiện này trên bản live. Sau nghiệm thu mới mở Bài 3 (theo quy trình nguồn chuẩn, gồm tìm tài liệu lời đọc/đáp án rời như CONTENT_STANDARD bổ sung 01/11/2026).
- checksRun: npm run check — validator đạt (2 bài; kiểm nhất quán đáp án ↔ lời đọc cho 78 ô), 25/25 test đạt (thêm 8 test nghe–viết); git diff --check sạch. CI GitHub Actions: tạo .github/workflows/ci.yml qua connector ngày 01/11/2026 vẫn bị 403 "Resource not accessible by integration"; bản bàn giao hoàn chỉnh ở docs/ci/ci.yml — cần người dùng tạo file đó qua web GitHub hoặc cấp quyền workflow cho GitHub App. Không coi Pages build là CI.
- blockers: quyền tái xuất bản vẫn unknown; audio chưa được nghe kiểm chứng bởi người (mới có ASR nháp + quan sát nghe của phiên kiểm thử trình duyệt); timestamp từng câu chưa có (chỉ có mốc đoạn bài tập); chưa thử Android thật — checklist thử nhanh cho người dùng: mở Bài 1 → Luyện tập trên điện thoại, nghe một đoạn, nhập vài ô, bấm Kiểm tra, xoay ngang/dọc và kiểm tra bàn phím không che nút Kiểm tra.
- evidence: docs/SOURCE_AUDIT.md (mục đối chiếu lời đọc/đáp án 01/11/2026), docs/QA_REPORT.md (bảng Trạng thái hiện tại + mục Hoàn thiện nghe–viết), docs/DECISIONS.md D10, docs/CONTENT_STANDARD.md (bổ sung 01/11/2026)
- baselineCommit: cb193847c0a66eb33f396b0f4445e968e8992b9b
- branch: main (PR #7 từ fix/l1-l2-dictation)
- deploymentUrl: https://bohoa96tb.github.io/HSK3.0/

- release: PR #7 merged cb193847c0a66eb33f396b0f4445e968e8992b9b; contentVersion live 20261101-dictation-1 (đã đối chiếu qua content.json trên URL thật trước nghiệm thu).
- liveChecks: nghiệm thu live sau PR #7 đạt 8/8 bước: khối nghe–viết tách 3 bài với nút nghe theo đoạn (nhãn hiển thị làm tròn xuống giây, ví dụ đoạn 106,9s hiện 1:46), ô 10 hiện "__ ěn", phát đoạn chạy và tạm dừng đúng, chấm lao3 đúng / neng4 sai hiện "Đáp án: neng2" và điểm lần đầu 1/2, Xem lời đọc hiển thị đúng dãy âm tiết, refresh giữ nháp và điểm lần đầu, Bài 2 chấm xue2 đúng, hồi quy Nghe & đọc + Tiến độ đạt; phiên kiểm thử ghi nhận nghe thấy tiếng Trung ở đoạn nghe–viết và hội thoại 1. Kiểm bề rộng bằng khung iframe: 2 route bài tập × 390/768/1440 không tràn ngang (360 đã đạt ở vòng QA Bài 2 trước đó; không phải thiết bị thật). Ghi nhận: sau refresh, nhãn đúng/sai chi tiết từng ô không hiển thị lại (điểm và danh sách ô sai ở Tổng kết vẫn giữ) — hành vi hiện tại, không phải mất dữ liệu. Không đồng nghĩa đã nghe thẩm định toàn bộ audio hoặc đã thử Android thật.
