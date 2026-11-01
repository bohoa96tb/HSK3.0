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
- **Loa theo đơn vị (cập nhật D20, 01/11/2026)**: CÂU hội thoại dùng nút loa phát đúng đoạn của câu trong track nguồn (một âm thanh tại một thời điểm, bấm lại thì tạm dừng, có trạng thái tải/phát/lỗi). ĐƠN VỊ NGẮN (từ cần biết, ví dụ, lựa chọn) dùng giọng đọc có sẵn của trình duyệt/thiết bị (speechSynthesis zh-CN) — không cắt đoạn track từ mới vì mỗi từ được đọc hai lượt hai giọng, cắt nghe gượng và lọt lượt đọc sau trên Android; lựa chọn thuần pinyin (bài điệp âm) không có loa. Bấm loa không chọn đáp án, không mở thẻ, không đổi điểm.
- Ánh xạ audio lưu theo ID đơn vị: `{trackId, start, end, status}`. Đoạn căn bằng máy (ASR) mang trạng thái `asr-draft` và không bao giờ được ghi là đã nghe kiểm chứng; nghe từng đơn vị phân biệt với đáp án/timestamp "verified".
- Nghe–viết: ba bài là accordion (mở một bài vẫn thấy tiêu đề + điểm lần đầu của các bài còn lại); mỗi bài có thanh thao tác sticky riêng (nghe đoạn, kiểm tra, làm lại câu sai, xem lời đọc). Kết quả lần kiểm tra gần nhất được **lưu bền** và khôi phục sau refresh; ô đã sửa sau khi chấm hiện "Đã sửa — cần kiểm tra lại", không giữ nhãn Đúng cũ.

## 11. Chuẩn ux3 — thanh hỗ trợ gọn, thẻ từ Hán–Việt, hỗ trợ Mục 5, mini player (bổ sung 01/11/2026, áp dụng cho các bài sau)

- **Thanh hỗ trợ theo phạm vi nội dung thật**: Mục 2 (Từ cần biết) có đủ `[Pinyin] [Nghĩa] [Hán–Việt] [A−] [A+]`; Mục 5 (Luyện tập) có đủ `[Pinyin] [Nghĩa] [A−] [A+]`; các vùng câu dùng `[Pinyin] [Nghĩa] [A−] [A+]`; vùng không có nội dung chữ (Ôn tập) chỉ cỡ chữ. Nút dạng chip (chữ ~13 px, padding gọn) nhưng vùng chạm vẫn tối thiểu 44×44 px, có `aria-pressed`; tên mức chữ (Thường/Lớn/Rất lớn) **không** nằm ở hàng chính — chỉ nằm trong nhãn trợ năng của nút A−/A+. Sticky trong vùng học, cho phép tối đa hai hàng gọn ở 360/390 px, không chồng nhiều thanh sticky.
- **Phạm vi của "Nghĩa"**: chỉ ẩn/hiện bản dịch của từ/câu/lựa chọn. Không bao giờ ẩn hướng dẫn, giải thích thao tác hay phản hồi đúng/sai bằng tiếng Việt. Các công tắc độc lập; đổi một công tắc không đổi các trường khác, không render lại, không nhảy trang, giữ focus/nháp/accordion/lựa chọn/kết quả và audio đang phát; thiết lập lưu qua refresh và đổi bài.
- **Thẻ từ (Mục 2)**: chữ Hán và loa trên cùng một hàng; dưới là Pinyin, dòng `HV: …` và nghĩa — mỗi dòng theo công tắc riêng. Thẻ gọn (padding ~10 px, chiều cao theo nội dung); hai cột trên điện thoại, ba cột khi đủ chỗ; khi cỡ chữ ở mức lớn nhất (1.3) thẻ chuyển ít cột hơn để còn đọc được. Loa thẻ từ dùng giọng đọc của thiết bị (D20) nên mọi thẻ đều có loa; không còn nhãn thiếu audio ở Mục 2. Hán–Việt **mặc định tắt**.
- **Hỗ trợ Mục 5**: mọi lựa chọn có Pinyin và nghĩa, bật/tắt đồng đều cho mọi lựa chọn (không chỉ lựa chọn đúng). Bật Pinyin/Nghĩa khi đang làm một câu chưa chấm = ghi `supportUsed` cho câu đó; kết quả có hỗ trợ được báo cáo tách riêng với kết quả tự làm và gợi ý, không ghi đè hay diễn giải lại điểm lần đầu/lịch sử cũ. Bấm loa trong lựa chọn không chọn đáp án.
- **Nghe–viết**: công tắc vẫn có mặt kèm dòng giải thích ngắn ngay trong giao diện: phần âm/dấu thanh đang để trống là đáp án nên không hiện trước khi chấm; Pinyin của lời đọc chỉ hiện ở ô **đã kiểm tra** (theo công tắc Pinyin) hoặc qua "Xem lời đọc" (ghi nhận đã xem như trước). Ô luyện âm/thanh lẻ không có nghĩa câu riêng.
- **Mini player**: một hàng thấp gọn, tên track rút gọn bằng ellipsis (tên đầy đủ trong title), có nút thu gọn/mở rộng và nút đóng (đóng = tạm dừng + ẩn cho tới khi đổi track hoặc người học chủ động phát lại). Chiều cao thực của các lớp cố định (mini player, thanh điều hướng dưới, thanh Trước/Đánh dấu/Tiếp tục) được JS đo và công bố qua biến CSS `--mini-h`, `--mini-bottom`, `--chrome-bottom`; khoảng đệm cuối trang và vị trí sticky của thanh điều hướng bài học suy từ các biến đó — cập nhật khi player đổi chiều cao, xoay màn hình hoặc đổi cỡ chữ, không dùng số bottom cố định. Icon loa là SVG nhỏ thống nhất, không dùng emoji loa lớn.

### Hoàn thiện tự luyện Bài 6–7
Bài listening-comparison hiện cặp đầy đủ, hướng dẫn nghe–so sánh–đọc theo, ô ghi chú rõ nhãn, tự đánh giá riêng và không nút chấm. Bài speaking có promptImages hiển thị ảnh trước từng khung câu; hai cột ở mọi bề rộng (kể cả điện thoại, cập nhật D20). Không có nút phát track không liên quan. Mốc nghe nháp có nhãn tham khảo.

Bổ sung (D21): bài học có thể có bộ bài bổ trợ riêng (`suppExerciseSet`, ví dụ đề mô phỏng của sách) hiển thị thành thẻ riêng ngay dưới thẻ luyện tập chính trong Mục 5, dùng cùng cơ chế làm bài nhưng session và điểm lần đầu tách theo từng bộ; câu nghe trong bộ bổ trợ có nút “Nghe đoạn của câu này” phát đúng đoạn audio của câu.
