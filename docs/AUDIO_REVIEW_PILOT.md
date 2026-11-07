# HSK 2 Bài 1 — nghe ôn tại mục 7 (nhánh thử, 2026-11-07)

## Phạm vi do người dùng yêu cầu

Thử nghiệm trên `hsk2-l01` trước. Chỉ đưa lên nhánh/PR để người dùng duyệt;
**không merge, không phát hành main, không mở rộng sang bài khác trước duyệt**.

- Ôn nhanh: nội dung summaryPoints và câu mẫu/ý nghĩa của Bài 1.
- Ôn chi tiết: 15 mục từ, 3 điểm ngữ pháp (cách dùng, giải thích, vị trí,
  9 ví dụ), 22 câu/4 đoạn hội thoại. Không đọc đáp án bài tập.
- Trung–Việt tách lượt theo ngôn ngữ, không đọc Pinyin hoặc Hán–Việt.
- Phát liên tục, tạm dừng (tiếp tục đọc lại lượt đang dở), trước/sau, dừng,
  tốc độ 0.8/1/1.2, nghỉ 0/1/3 giây, lặp toàn bài ôn; có bản chữ để xem.
- Bài ôn không đánh dấu hoàn thành bài hay thay đổi điểm.

## Nguồn và lựa chọn giọng đọc

Toàn bộ nội dung lấy từ các trường hiện có của data/content.json, không
biên soạn lại hội thoại/ví dụ/đáp án; lời dẫn và kết thúc là biên tập.
Kế thừa truy vết nguồn của Bài 1 trong dữ liệu và hồ sơ phát hành trước;
không tuyên bố đã đối chiếu lại PDF trong lượt này.

Bản thử mở rộng cơ chế giọng máy thiết bị D20 cho luồng ôn song ngữ theo yêu
cầu nghe ôn mới. Đây không phải audio sách hoặc giải pháp lấp học liệu thiếu.
Nhãn giọng máy hiển thị rõ; audio Baulchino vẫn giữ nguyên. Không tạo/tải MP3,
không thêm API trả phí. Cần thiết bị có giọng tiếng Việt và Quan thoại;
không tự dùng giọng Quảng Đông khi thiếu Quan thoại.

## QA độc lập đầy đủ (vòng 2)

1. Đúng phạm vi HSK 2 Bài 1, mục 7. Bài khác không hiện khối thử;
   không sửa dữ liệu sách, đáp án hay tiến độ học.
2. Nội dung kế thừa đủ 15 mục từ, 3 điểm ngữ pháp, 22 câu/4 đoạn;
   không đưa đáp án vào bài ôn. Luyện viết tách riêng có giải thích.
3. Nhãn giọng máy/chú giải biên tập/không phải Baulchino rõ ràng;
   có thông báo thiếu giọng và giới hạn khóa màn hình.
4. Logic chuyển lượt, tạm dừng/tiếp tục, trước/sau, lặp, tốc độ,
   xử lý lỗi và vô hiệu callback cũ đạt. Render lại cùng route giữ trạng thái;
   đổi route dừng; audio sách và loa đơn vị ngắt bài ôn.
5. Đã sửa và kiểm lại: Event đúng realm trong JSDOM; loại giọng Quảng Đông;
   MediaSession Play dừng bài ôn; cache token của player được cập nhật.
6. QA tự chạy 6/6 unit tests đạt, kiểm suite 227/227, diff sạch.
   Sau đó agent chính bổ sung DOM integration: đổi chế độ, phát/tạm dừng,
   render lại giữ trạng thái và sự kiện audio sách; toàn suite cuối 228/228.
7. Chưa nghe âm thanh thật, chưa kiểm chất lượng phát âm, Android, khóa màn
   hình hoặc giao diện tại 360/390/768/1440. Chromium không khởi động do
   socket Operation not permitted; trình duyệt chia sẻ localhost refused.
8. Kết luận: đạt kiểm mã nguồn/nội dung kế thừa, phù hợp đưa PR thử cho người
   dùng duyệt; chưa đủ nghiệm thu giao diện/audio thực tế, không tự merge.

## Kiểm thử và nghiệm thu còn lại

- `npm run check`: validator OK, 228/228 test PASS (221 cũ + 7 mới).
- `node scripts/audit-standard.mjs`: chạy thành công, độ phủ bài giữ nguyên.
- `git diff --check`: sạch. Không gọi các kiểm tra local này là CI.
- Chạy repo bằng `python3 -m http.server 8000`, mở
  `http://localhost:8000/#/lesson/hsk2-l01/summary`.
- Kiểm nghe cả hai chế độ trên điện thoại có vi-VN/zh-CN; tạm dừng,
  tiếp tục, lặp; đổi sang audio sách; kiểm bố cục 4 bề rộng.
- Giữ trang mở: Web Speech không đảm bảo chạy khi khóa màn hình/chuyển app.
  Đây là giới hạn bản thử, không hứa hẹn nghe nền như file MP3.
- Next task của nhánh: nghiệm thu thử + chờ người dùng duyệt; không tự làm Bài 4.
