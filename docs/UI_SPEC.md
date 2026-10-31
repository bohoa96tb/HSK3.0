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
