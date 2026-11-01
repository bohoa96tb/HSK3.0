# UI_SPEC — Learning edition, 01/11/2026

Thiết kế sáng, xanh lá dịu và kem; nền nội dung trắng. Desktop có thanh trái, điện thoại có 4 mục điều hướng dưới. Vào bài thay thanh dưới bằng bước học trước/sau. Player nổi không che hàng nút bài học.

- Hôm nay: lời chào, một thẻ tiếp tục học, tiến độ và ôn, ba lối tắt.
- Lộ trình: một danh sách 15 bài, bài 1 mở; bài 2–15 hiện chưa mở và có trang giải thích. Không nhân đôi Textbook/Workbook thành hai khóa học.
- Bài học: 7 bước, có thanh bước nhìn thấy vị trí hiện tại. Từ mới gồm 12 mục Textbook. Kiến thức chính 您 / 们 / cảm ơn; phát âm nằm trong phần mở rộng.
- Nghe: 3 tab tình huống, track đúng sách giáo khoa, lời thoại mở/đóng, Pinyin/nghĩa độc lập, liên kết về điểm kiến thức. Transcript là bản in, chưa phải bản chép âm thanh đã nghe.
- Bài tập: mỗi lần một hình nguyên bản và ba hội thoại nguyên bản; phản hồi nêu suy luận theo ngữ cảnh. Không hiện nghĩa đáp án trước khi nộp. 3 bài nghe–viết gốc có ô nhập, lưu tự động; không chấm khi thiếu answer key đã xác minh.
- Tự nói: đóng vai và thay tên theo nhiệm vụ trong Textbook.
- Tra cứu, ôn, tiến độ, cài đặt, nguồn: dùng chung typography/component và trạng thái. Thông tin provenance trong details, không lấn át bài học.

Breakpoints CSS: dưới 768 px một cột; 768–1023 trung gian; từ 1024 có sidebar. QA bắt buộc 360/390/768/1440, ghi kết quả thật trong QA_REPORT.

Dữ liệu/ảnh động không làm đổi đáp án theo ngẫu nhiên. Kết quả làm bài có lịch sử. Kết quả quiz biên tập cũ không tính vào bài nguồn mới.

## 10. Chuẩn thanh hỗ trợ và loa theo đơn vị (bổ sung 01/11/2026, áp dụng cho các bài sau)

- Mỗi vùng học (Từ cần biết, Hiểu cách dùng, Nghe & đọc, Tra cứu, Tự nói, Ôn tập) có **thanh hỗ trợ dùng chung** ở đầu vùng, sticky khi cuộn: nút Pinyin, nút Nghĩa Việt (nơi có câu), và cỡ chữ A−/A+ qua ba mức Thường/Lớn/Rất lớn. Nút tối thiểu 44×44 px, có `aria-pressed`, nhãn rõ trạng thái.
- Đổi hiển thị áp dụng **tại chỗ** (lật class trên vùng chứa + biến CSS cỡ chữ), **không render lại trang**: không đổi route, không cuộn về đầu, không đóng transcript/accordion đang mở, không mất focus/nháp/kết quả chấm, không dừng hay phát lại audio. Khi một thao tác khác buộc phải render lại cùng route, app khôi phục vị trí theo **phần tử neo** đang đọc (không chỉ theo scrollY).
- Trong bài kiểm tra chỉ hiện hỗ trợ không lộ đáp án (ở Luyện tập: chỉ cỡ chữ). Hỗ trợ có thể lộ đáp án (lời đọc nghe–viết) phải do người học chủ động mở và được ghi nhận.
- **Loa theo đơn vị**: mọi từ/câu tiếng Trung có nút loa chung (`speak-btn`) phát đúng đoạn của đơn vị đó trong track nguồn; một âm thanh tại một thời điểm, bấm loa khác thay thế ngay, bấm lại loa đang phát thì tạm dừng; nút có trạng thái đang tải/đang phát/lỗi. Bấm loa không chọn đáp án, không mở thẻ, không đổi điểm. Đơn vị chưa có đoạn riêng hiện chữ "Chưa có audio riêng" và được ghi vào danh sách thiếu — không phát cả track thay thế một cách lặng lẽ.
- Ánh xạ audio lưu theo ID đơn vị: `{trackId, start, end, status}`. Đoạn căn bằng máy (ASR) mang trạng thái `asr-draft` và không bao giờ được ghi là đã nghe kiểm chứng; nghe từng đơn vị phân biệt với đáp án/timestamp "verified".
- Nghe–viết: ba bài là accordion (mở một bài vẫn thấy tiêu đề + điểm lần đầu của các bài còn lại); mỗi bài có thanh thao tác sticky riêng (nghe đoạn, kiểm tra, làm lại câu sai, xem lời đọc). Kết quả lần kiểm tra gần nhất được **lưu bền** và khôi phục sau refresh; ô đã sửa sau khi chấm hiện "Đã sửa — cần kiểm tra lại", không giữ nhãn Đúng cũ.
