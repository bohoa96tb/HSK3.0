# HSK3.0 — Kế hoạch sản phẩm và hướng dẫn triển khai cho Muse

Ngày khảo sát: 31/10/2026, giờ Nhật Bản.
Repository duy nhất: https://github.com/bohoa96tb/HSK3.0
Nguồn nội dung học duy nhất: https://www.baulchino.com/
Trạng thái tài liệu: đặc tả đề xuất, chưa triển khai ứng dụng.

## 1. Mục tiêu và quyết định nền

Xây một web app mới học ngữ pháp tiếng Trung cho người Việt. Giải thích dễ hiểu, chữ Trung giản thể, tối ưu Android và học từng phiên ngắn. Ngữ pháp phải gắn với câu thật trong giáo trình, nghe, đọc và bài tập có nguồn.

Hai cửa vào dùng chung nội dung:

1. **Theo giáo trình:** cấp → quyển → bài → các mục học tuần tự.
2. **Theo ngữ pháp:** tìm cấu trúc → hiểu cách dùng → xem các bài có cấu trúc đó → nghe/đọc/luyện tập tại đúng vị trí.

Quyết định mặc định:

- Làm HSK 1 trước, mở rộng khi nguồn và quy trình đã được kiểm chứng. Kiến trúc hỗ trợ cấp cao hơn nhưng không tạo bài giả để lấp đầy danh mục.
- Giữ thứ tự và ranh giới bài của giáo trình. Một bài dài có thể tách thành phiên nhỏ nhưng vẫn thuộc cùng bài nguồn.
- Không nhập dữ liệu HSK 2.0 vào lộ trình HSK 3.0. Tách tên quyển, phiên bản giáo trình và phiên bản đề cương thi.
- Nội dung gốc, ví dụ, bài đọc, audio, đề bài và đáp án phải truy được về Baulchino và tài liệu được trang này dẫn tới.
- Tiếng Việt là bản dịch/chú giải biên tập từ nguồn, ghi rõ vai trò đó. Không quảng cáo là bản dịch chính thức.
- Không tự sinh hội thoại, ví dụ, câu hỏi hoặc TTS thay phần còn thiếu. Nếu muốn bổ sung nội dung tự soạn sau này, cần đổi phạm vi dự án rõ ràng.
- Chưa cần tài khoản, máy chủ chấm AI, thanh toán, bảng xếp hạng hoặc mạng xã hội. Ưu tiên học tốt và lưu tiến độ trên thiết bị.

## 2. Những gì đã kiểm tra và những gì còn phải xác minh

### 2.1 Repository

Ở thời điểm kiểm tra, thư mục gốc nhánh mặc định chỉ có README.md, nội dung `# HSK3.0`. Muse phải kiểm tra lại trước khi tạo file để tránh ghi đè công việc mới.

### 2.2 Baulchino

Trang sách mới: https://www.baulchino.com/new-hsk-books-2026

| Cấp/quyển | Các liên kết được thấy trong danh mục |
| --- | --- |
| HSK 1 | Sách học, bài tập, tập viết |
| HSK 2 | Sách học, bài tập, tập viết |
| HSK 3 | Sách học, bài tập |
| HSK 4A | Sách học |
| HSK 4B | Sách học |

Trang audio mới: https://www.baulchino.com/new-hsk-audios-2026

Trang audio liệt kê sách học và sách bài tập HSK 1–3, cùng sách học HSK 4A. Đây là bằng chứng danh mục, chưa chứng minh mọi track hoạt động hay mọi bài đều có audio. Không suy ra HSK 4B không có audio ở mọi nơi; chỉ ghi chưa thấy trên trang đã khảo sát.

Hai URL PDF HSK 1 được trang sách dẫn tới:

- https://cdn.baulchino.com/new-hsk-books/hsk-course-1.pdf
- https://cdn.baulchino.com/new-hsk-books/hsk-course-1-workbook.pdf

Công cụ đọc web báo kích thước khoảng 66,7 MB và 74,0 MB, vượt giới hạn đọc. Chưa đọc mục lục, chưa xác nhận tiêu đề bài đầu, số bài, nội dung bài hay trang đáp án. Muse phải tải/đọc bằng công cụ phù hợp trong môi trường được phép; không tự đoán từ giáo trình cũ.

### 2.3 Phạm vi sử dụng nguồn

Chưa tìm thấy bằng chứng cho phép tái xuất bản toàn bộ sách/audio trong các trang đã xem. Việc trang có nút tải miễn phí chưa đủ để kết luận có thể đưa toàn bộ bản sao vào repository công khai.

Muse ghi trạng thái theo từng tài sản: `unknown`, `link-only`, `embed-permitted`, `redistribution-permitted`, `restricted`. Chỉ gán trạng thái cho phép khi có bằng chứng tương ứng; quyền mã nguồn của website không tự áp dụng cho sách của bên thứ ba. Bản dịch, bản chép lời và bản chuyển thể cũng cần được xét riêng trong phạm vi cho phép.

Khi chưa rõ: phát triển khung app, mô hình dữ liệu, mục lục đã kiểm chứng và nút mở nguồn. Chưa đẩy PDF, MP3 hay toàn văn bài học vào repo công khai. Không dùng proxy hoặc giải pháp vượt hạn chế để nhúng nguồn. Nếu cần hỏi chủ nguồn, chuẩn bị nội dung hỏi cho người dùng; không tự gửi thư.

### 2.4 Đối chiếu HSK 3.0

Nguồn đối chiếu chuẩn: https://www.chinesetest.cn/HSK và https://www.chinesetest.cn/syllabus

Chỉ dùng để kiểm tra phiên bản và ánh xạ ngữ pháp, không thay nguồn bài học Baulchino. Lưu bằng chứng trang/phiên bản khi ánh xạ; nếu chưa xác minh thì hiển thị “Theo giáo trình HSK 3.0 — chưa đối chiếu đầy đủ đề cương”, không tuyên bố phủ toàn bộ chuẩn.

## 3. Thiết kế trải nghiệm và hệ thống hình ảnh

### 3.1 Tham khảo có chọn lọc

| Tham khảo | Tính năng đã đọc từ nguồn chính | Áp dụng cho app |
| --- | --- | --- |
| Du Chinese | Bật/tắt Pinyin và dịch; đọc cùng audio; liên kết ngữ pháp trong bài đọc | Một trình đọc/nghe dùng chung, chạm cấu trúc để mở giải thích |
| HelloChinese | Bài học nhỏ; học nhiều kỹ năng; ôn cách quãng | Mỗi phiên có mục tiêu rõ, phản hồi ngay và hàng đợi ôn |
| Baulchino | Tổ chức sách/audio theo cấp và loại sách | Giữ quan hệ quyển–bài–track, có nút về nguồn |

Nguồn UX:
- https://duchinese.net/blog/2021/04/14/welcome-to-du-chinese/
- https://www.hellochinese.cc/

Đây là tham khảo cơ chế học từ trang công khai; chưa phải kiểm thử trực tiếp toàn bộ app. Không sao chép thương hiệu, hình minh họa hoặc nguyên bố cục. Chinese Grammar Wiki đã thử truy cập nhưng trả 403, không coi là nguồn đã khảo sát trực tiếp.

### 3.2 Phong cách đề xuất

Tên hiển thị tạm: **HSK 3.0 · Ngữ pháp tiếng Trung**. Logo chữ đơn giản, không dùng logo HSK chính thức.

Giao diện sáng, điềm tĩnh, phù hợp người trưởng thành:

| Thành phần | Đặc tả |
| --- | --- |
| Nền | Kem rất nhạt #F7F8F5; mặt nội dung trắng |
| Màu chính | Xanh ngọc đậm #0F766E |
| Văn bản | #172B2A; chữ phụ #52615E |
| Nhấn cấu trúc | Nền #E3F2ED, có gạch/nhãn để không chỉ dựa vào màu |
| Cảnh báo | Hổ phách; lỗi đỏ kèm lời giải thích |
| Bo góc | 12–16 px, đường viền mảnh, ít bóng |
| Chữ Việt | System sans, nội dung từ 16 px, giãn dòng 1,6 |
| Chữ Trung | Phông hệ thống hỗ trợ giản thể; câu học 24–28 px, cho tăng cỡ |
| Pinyin | Ruby phía trên chữ, từ 13–14 px; chừa khoảng dòng |
| Vùng bấm | Ít nhất 44×44 px; nút loa nhìn nhỏ nhưng vùng chạm đủ lớn |

Không dùng quá nhiều thẻ lồng nhau. Danh mục bài dùng hàng gọn, màn hình chủ chỉ có một nút chính nổi bật. Kiểm tra tương phản thực tế trước chốt màu.

### 3.3 Bố cục theo thiết bị

- Điện thoại: một cột; thanh dưới có Hôm nay / Lộ trình / Tra cứu / Ôn tập. Cài đặt nằm trong nút hồ sơ ở đầu trang.
- Trong bài học: ẩn thanh điều hướng toàn cục, thay bằng nút Trước / Tiếp tục; phía trên có nút thoát về đúng bài và danh mục mục học.
- Máy tính: thanh trái khoảng 220 px; vùng nội dung tối đa khoảng 760 px; mục lục bên phải khoảng 240 px khi đủ chỗ.
- Mini player nằm trên thanh dưới, tính cả safe area; không che câu, đáp án hoặc nút Tiếp tục.
- Kiểm tra 360, 390, 768 và 1440 px; không có cuộn ngang toàn trang.

## 4. Sơ đồ trang và hợp đồng điều hướng

Dùng hash routes cho bản đầu nếu triển khai GitHub Pages. Các route bên dưới là thiết kế đề xuất, không phải URL đã hoạt động.

| Màn hình/route | Nội dung chính | Hành động và nơi đến |
| --- | --- | --- |
| `#/today` | Học tiếp, ôn đến hạn, tiến độ tuần | Tiếp tục đúng bài/mục/câu đang dở |
| `#/course/:courseId` | Chọn quyển; danh sách chương/bài và trạng thái | Bấm bài → trang giới thiệu bài |
| `#/lesson/:lessonId` | Mục tiêu, nguồn, các mục cần học, thời lượng ước tính | Bắt đầu/tiếp tục → mục học phù hợp |
| `#/lesson/:lessonId/:sectionId` | Nội dung một mục | Trước/sau theo danh sách mục thực có |
| `#/grammar` | Tìm cấu trúc, lọc cấp/chủ đề/trạng thái | Chọn điểm → chi tiết ngữ pháp |
| `#/grammar/:grammarId` | Cách dùng, mẫu câu, ví dụ nguồn, bài liên quan | Nhảy đến câu/đoạn/bài tập đã liên kết |
| `#/reader/:passageId?sentence=:id` | Bài đọc/nghe, câu được chọn | Mở ngữ pháp hoặc luyện cùng nội dung |
| `#/exercise/:setId?item=:id` | Bài tập từng câu | Trả lời → phản hồi → câu tiếp |
| `#/review` | Ôn đến hạn, câu sai, mục đã lưu | Vào phiên ôn → quay lại báo cáo |
| `#/progress` | Tiến độ học và độ nắm vững riêng biệt | Chọn điểm yếu → phần học tương ứng |
| `#/settings` | Pinyin, nghĩa, cỡ chữ, tốc độ, sao lưu | Lưu cài đặt không cần tài khoản |
| `#/sources/:sourceId` | Quyển, phiên bản, trang, link nguồn | Mở Baulchino/tài liệu nguồn |

Mỗi chuyển trang phải giữ ngữ cảnh quay lại: route, vị trí cuộn, câu đang nghe, câu bài tập đang làm. Quay lại từ giải thích không được xóa câu trả lời hoặc phát lại audio tự động.

## 5. Chi tiết các màn hình chính

### 5.1 Hôm nay

Thứ tự từ trên xuống:

1. Lời chào ngắn và nút Cài đặt.
2. Thẻ “Tiếp tục học”: cấp, quyển, bài, mục còn dở, nút tiếp tục. Người mới thấy “Bắt đầu HSK 1”.
3. Ôn tập: số mục đến hạn và số câu sai cần xem. Khi chưa có: giải thích ngắn, không hiện tiến độ giả.
4. Tiến độ tuần: số phiên đã học, phút học tích cực ước tính; không tính tab mở mà không học.
5. Lối tắt “Tra một cấu trúc”. Không đặt lịch sử dài và toàn bộ cấp học lên màn hình chủ.

### 5.2 Lộ trình

Chọn cấp → quyển → danh sách bài. Hàng bài gồm số bài, tên nguồn, tên Việt, 1–3 nhãn ngữ pháp, trạng thái và nút học. Chọn bài mở trang giới thiệu trước khi vào nội dung.

Hai nhóm trạng thái tách riêng:
- **Xuất bản:** Chưa có nguồn / Đang kiểm tra / Sẵn sàng / Tạm lỗi nguồn.
- **Học:** Chưa học / Đang học / Đã học / Cần ôn.

Chỉ bài đã nghiệm thu mới có nút Học. Bài chưa đủ nguồn hiển thị lý do cụ thể; không làm nút chết. Không khóa người học vào thứ tự bắt buộc; chỉ khuyến nghị bài tiên quyết.

### 5.3 Tra cứu

Tìm theo chữ Hán, mẫu có dấu ba chấm, từ khóa Việt hoặc Pinyin có/không dấu. Kết quả có tên, giải thích một dòng, cấp theo nguồn và số bài có sử dụng. Lọc theo chức năng: hỏi, phủ định, thời gian, so sánh… chỉ khi dữ liệu đã được gán và kiểm tra.

Chi tiết ngữ pháp luôn có “Học trong ngữ cảnh” dẫn đến câu nguồn. Không để thành một trang lý thuyết không liên quan lộ trình.

### 5.4 Ôn và tiến độ

Ôn sử dụng lại câu nguồn đã lưu/làm sai, không tự tạo câu mới. Ba nút tự đánh giá: Chưa nhớ / Còn chậm / Nhớ. Lịch đề xuất đơn giản: 1, 3, 7, 14, 30 ngày; trả lời sai quay về 1 ngày. Đây là quy tắc sản phẩm đề xuất, không phải chứng nhận phương pháp tối ưu.

Tách “đã xem/đã học” khỏi “đã nắm vững”. Mục thiếu bài tập kiểm chứng không được coi là thành thạo. Hiển thị điểm lần đầu, lần gần nhất và số câu làm lại riêng để việc xem đáp án không làm đẹp điểm giả.

## 6. Mẫu bài học: từng mục và cách nối với nhau

Một bài nguồn là một đơn vị nội dung. Mỗi điểm ngữ pháp trong bài có thể là phiên 5–10 phút; thời lượng phải ghi ước tính và hiệu chỉnh sau pilot. Không ép mọi bài vào số câu cố định.

| Mục | Người học thấy gì | Hành động | Liên kết bắt buộc |
| --- | --- | --- | --- |
| 0. Giới thiệu | Tên bài, mục tiêu, nguồn, mục cần học | Bắt đầu; xem bài nền | Bài trước, nguồn, các điểm ngữ pháp |
| 1. Chuẩn bị | Từ cần hiểu để đọc câu của bài | Bật nghĩa/Pinyin; nghe nếu có track đúng | Từ → câu xuất hiện; không gán audio toàn đoạn làm phát âm riêng |
| 2. Hiểu ngữ pháp | Mỗi điểm có nghĩa, mẫu, vị trí, ví dụ và lưu ý | Chọn điểm; nghe ví dụ; xem ngữ cảnh | Điểm → câu/đoạn nguồn và bài tập |
| 3. Đọc và nghe | Hội thoại/bài đọc nguồn, chia câu | Nghe trước hoặc đọc trước; hiện hỗ trợ | Câu → audio + điểm ngữ pháp + nguồn |
| 4. Luyện tập | Bài tập nguồn theo một câu mỗi màn | Trả lời; kiểm tra; sửa lỗi | Câu hỏi → điểm ngữ pháp và phần đọc liên quan |
| 5. Vận dụng | Nhiệm vụ nói/viết có trong nguồn, nếu có | Làm và tự đối chiếu theo hướng dẫn | Nhiệm vụ → mẫu trong bài; không tạo đánh giá AI giả |
| 6. Tổng kết | Đã học gì, câu sai, mục cần ôn | Ôn lỗi; học tiếp; về lộ trình | Câu sai → đúng phần lý thuyết; bài sau |

Nếu nguồn không có một mục: renderer bỏ mục không áp dụng hoặc hiển thị thiếu nguồn đúng ngữ cảnh; tổng kết không khẳng định bài đủ mọi kỹ năng. Không tự biến bài đọc thành hội thoại hoặc thêm bài tập mới để đủ khuôn.

### 6.1 Thẻ giải thích một điểm ngữ pháp

Hiển thị theo thứ tự:

1. **Dùng để làm gì?** Một hoặc hai câu Việt dễ hiểu, bám đúng phạm vi nguồn.
2. **Mẫu câu.** Một dòng, mỗi thành phần có tên Việt quen thuộc; không chỉ dùng ký hiệu S/V/O.
3. **Ví dụ.** Một ví dụ nguồn ngay dưới giải thích; thêm ví dụ nếu nguồn có và thật sự làm rõ cách dùng khác.
4. **Đặt ở đâu?** Tô phần cấu trúc trong câu, giải thích vị trí bằng lời đơn giản.
5. **Dễ nhầm.** Chỉ xuất hiện khi nguồn có căn cứ; phần chú giải biên tập phải đánh nhãn và được kiểm duyệt.
6. **Dùng trong bài này.** Danh sách câu có cấu trúc, nút Đọc/Nghe/Luyện.

Phần chính ngắn; “Xem thêm” chứa ngoại lệ thực sự cần. Độ khó dễ/trung bình/khó dựa vào số cách dùng và mức dễ nhầm; không suy từ số chữ. Không bổ sung quy tắc mới chỉ để đủ mục.

### 6.2 Quy tắc Pinyin và tiếng Việt

- Hai công tắc độc lập: Pinyin và Nghĩa Việt; có lựa chọn cho từ chuẩn bị và cho câu trong bài.
- Mặc định: từ chuẩn bị hiện Pinyin; ví dụ/bài đọc ẩn Pinyin, hiện nghĩa khi chạm. Người dùng có thể đổi và app nhớ cài đặt.
- Trong kiểm tra: ẩn gợi ý có thể lộ đáp án; bấm trợ giúp được ghi là đã dùng gợi ý.
- Pinyin nhiều âm cần duyệt trong câu; không xuất bản kết quả thư viện tự chuyển mà chưa kiểm tra.
- Audio zh-CN và phần dịch không trộn lẫn. Không tự tạo giọng Việt hay giọng Trung TTS trong phạm vi hiện tại.

### 6.3 Trình đọc/nghe dùng chung

Đầu trang: tiêu đề, bài nguồn, lựa chọn Đọc cùng nghe / Chỉ nghe. Thanh công cụ: Pinyin, nghĩa, cỡ chữ, đánh dấu cấu trúc.

Mỗi câu có: người nói nếu có, chữ Trung, Pinyin tùy chọn, bản dịch tùy chọn, nút phát và nút lưu. Chạm cấu trúc mở bảng nhỏ giải thích; nút “Học đầy đủ” mở trang ngữ pháp với đường quay lại.

Player: phát/dừng; thời gian; tốc độ 0,75 / 1 / 1,25; lặp câu 1–3 lần; khoảng nghỉ tùy chọn. Điều khiển cả đoạn luôn hoạt động nếu track hợp lệ. Nghe từng câu chỉ bật khi đã có mốc thời gian kiểm chứng.

Một audio element chung điều phối toàn app. Phát câu mới phải dừng câu cũ. Không tạo nhiều nguồn âm chồng nhau. Khi kết thúc đoạn câu phải dừng đúng hoặc chuyển theo chế độ người dùng chọn.

Mốc câu: lưu giây thập phân và trạng thái `unverified/verified`. Căn chỉnh tự động chỉ tạo bản nháp. Nghe thực tế câu đầu/cuối và ranh giới từng câu của pilot; nếu sai phải sửa hoặc tắt nút câu đó. Không tuyên bố karaoke theo từng từ khi chỉ có timestamp theo câu.

Khi mạng lỗi: giữ tiến độ, cho Thử lại và Mở nguồn; không thay bằng TTS. Khi chuyển sang app khác/khóa màn hình: kiểm tra trên Android thật nếu có thiết bị; nếu chưa thử, báo chưa xác minh, không cam kết phát nền. Media Session chỉ là hỗ trợ, không phải bảo đảm hệ điều hành không dừng audio.

### 6.4 Bài tập và phản hồi

Renderer hỗ trợ các dạng có thật trong nguồn: chọn đáp án, đúng/sai, điền từ, sắp xếp, nối, nghe trả lời. Chỉ kích hoạt dạng khi đã thấy đề tương ứng. Không đổi đề gốc thành lựa chọn rồi bịa thêm đáp án nhiễu.

Mỗi câu có: prompt, tham chiếu trang/số câu, media nếu có, đáp án đã xác minh, giải thích Việt bám nguồn, các điểm ngữ pháp liên quan. Câu phụ thuộc hình phải có hình được phép dùng hoặc chuyển sang mở trang nguồn; không bỏ hình rồi chấm.

Sau Kiểm tra: hiện kết quả bằng chữ và màu, đáp án, giải thích ngắn và nút “Ôn lại cách dùng”. Với nối/sắp xếp phải có cách bấm từng mục cho người không kéo thả được.

Chấm văn bản chuẩn hóa khoảng trắng và dấu câu theo quy tắc rõ; không xóa khác biệt làm đổi nghĩa. Biến thể đáp án chỉ thêm khi đã được duyệt. Nếu thiếu đáp án tin cậy: chế độ tự đối chiếu, không tính vào điểm tự động. Câu hỏi mở không chấm đúng/sai tuyệt đối bằng so khớp chuỗi.

## 7. Mô hình dữ liệu: tạo liên kết từ dữ liệu, không ghép thủ công trong UI

| Thực thể | Các trường quan trọng |
| --- | --- |
| Source | id, URL trang nguồn, URL tài sản, tên sách, nhà xuất bản/ISBN nếu kiểm chứng được, edition, retrievedAt, rightsStatus, rightsEvidence |
| Course/Book | id, levelLabel, sourceId, edition, unitIds, publicationStatus |
| Lesson | id, bookId, sourceUnit, titleZh, titleVi, sectionIds, grammarIds, prerequisiteIds, sourceRefs, contentVersion |
| GrammarPoint | id, senseKey, title, explanationVi, pattern, exampleSentenceIds, relatedGrammarIds, officialMapping, sourceRefs |
| Passage | id, lessonId, sourceRefs, sentenceIds, audioId |
| Sentence | id, passageId, zh, pinyin, vi, speaker, grammarSpans, sourceRefs, reviewStatus |
| Audio | id, sourceId, URL/path cho phép, sourceTrack, duration, checksum nếu tải hợp lệ, segments, playbackVerifiedAt |
| Exercise | id, setId, type, prompt, options, answer, acceptedVariants, answerStatus, grammarIds, sentenceIds, sourceRefs |
| Progress | schemaVersion, lessonId, sectionId, lastSentenceId, audioPosition, attempts, completedSections, updatedAt |
| ReviewItem | id, sourceItemId, lastResult, dueAt, intervalStep, attempts |

`sourceRefs` phải phân biệt số trang PDF với số trang in; gồm sourceId, pdfPage, printedPage, unit, section, item/track khi phù hợp.

Quan hệ chuẩn: Book → Lesson → Grammar/Passage/Exercise; Passage → Sentence → AudioSegment; Exercise → Grammar + Sentence. Liên kết ngược được tạo từ các ID này, tránh nhập hai lần rồi lệch.

Ngữ pháp có nhiều cách dùng phải có senseKey riêng; việc xuất hiện cùng một chữ không đủ để gán cùng cấu trúc. Tô ngữ pháp dùng span đã duyệt, không chỉ tìm chuỗi ký tự để suy nghĩa.

ID ổn định, không dựa vào tiêu đề Việt hoặc vị trí hiện tại trong mảng. Sửa nội dung không làm mất lịch sử học. Cập nhật đáp án phải tăng phiên bản và đánh dấu lần chấm cũ cần xem lại nếu bị ảnh hưởng.

## 8. Quy trình đưa một bài nguồn vào ứng dụng

1. Xác nhận sách/ấn bản qua bìa, trang xuất bản, mục lục; ghi bằng chứng.
2. Tạo source record và trạng thái quyền sử dụng từng loại tài sản.
3. Ghi bài nguồn, trang in/PDF và danh sách phần có thật.
4. Trích xuất text hoặc OCR; giữ bản thô trong khu vực làm việc phù hợp, không mặc định commit bản nguồn.
5. Đối chiếu ảnh trang: chữ Hán, dấu câu, Pinyin, số câu, bảng và hình. Không đưa OCR chưa duyệt vào bài công khai.
6. Biên tập bản dịch Việt; rà nghĩa trong ngữ cảnh, thuật ngữ tối thiểu.
7. Liệt kê điểm ngữ pháp và gắn vào câu cụ thể; không tự đổi cấp theo trí nhớ.
8. Ghép audio đúng sách học/bài tập, bài và track. Nghe so khớp với văn bản, không chỉ dựa vào tên file.
9. Cắt mốc phát theo câu nếu có thể xác minh; giữ audio nguyên vẹn nếu được phép và dùng timestamps thay vì tạo hàng loạt MP3.
10. Nhập bài tập cùng đáp án nguồn; nếu đáp án thiếu thì ghi thiếu và đổi chế độ chấm.
11. Chạy validator dữ liệu và kiểm thử trình duyệt; kiểm nội dung từng mục.
12. Chỉ đánh dấu ready khi đáp ứng điều kiện công bố và không có liên kết treo; ghi các mục không áp dụng/thiếu.

Không đặt mục tiêu “bao nhiêu bài mỗi lần” trước khi biết độ phức tạp. Hoàn thành từng bài trọn vòng thay vì tạo nhiều khung rỗng.

## 9. Kiến trúc kỹ thuật đề xuất

Đây là lựa chọn thiết kế, Muse cần kiểm tra tài liệu phiên bản trước khi cài:

- React + TypeScript + Vite; CSS variables và component dùng lại; không cần thư viện UI lớn chỉ để có vài nút.
- Dữ liệu nội dung JSON kiểm tra bằng schema; tách khỏi component.
- Hash router và base path `/HSK3.0/` nếu dùng GitHub Pages, giữ đúng chữ hoa/thường. URL phát hành chỉ công bố sau khi kiểm tra hoạt động.
- IndexedDB lưu tiến độ/lần làm bài; localStorage cho cài đặt nhỏ. Có xuất/nhập JSON với version, validate, xem trước hợp nhất và sao lưu trước khi ghi đè.
- PWA giai đoạn sau pilot: cache app shell và dữ liệu được phép. Không tự cache toàn bộ PDF/audio bên thứ ba.
- Media phục vụ từ nơi được phép và phù hợp dung lượng; không commit sách/MP3 lớn vào git. Kiểm tra MIME, seek/range, CORS theo cách dùng thực tế. Nếu không phát được, quay về mở nguồn, không dựng proxy vượt hạn chế.
- Không có API key trong frontend. Đồng bộ đa thiết bị, chấm nói và AI chỉ là phần mở rộng sau, ngoài MVP.

Thư mục dự kiến:

| Đường dẫn | Mục đích |
| --- | --- |
| `src/pages/` | Các màn hình trong sơ đồ trang |
| `src/components/` | LessonRow, GrammarCard, SentenceRow, SettingsPanel |
| `src/features/player/` | Player chung và điều khiển phân đoạn |
| `src/features/exercises/` | Renderer/chấm theo dạng |
| `src/features/progress/` | Lưu, migration, backup và review |
| `src/data/` | Dữ liệu đã duyệt, manifest theo sách/bài |
| `schemas/` | Schema cùng trạng thái nguồn/kiểm duyệt |
| `scripts/` | Validator, kiểm liên kết, thống kê tiến độ |
| `tests/` | Kiểm thử dữ liệu, chấm điểm và hành trình |
| `docs/` | Kế hoạch, nguồn, ánh xạ, checkpoint, báo cáo QA |

## 10. Các chặng triển khai và điều kiện hoàn thành

| Chặng | Phụ thuộc | Việc Muse thực hiện | Sản phẩm và tiêu chí nghiệm thu |
| --- | --- | --- | --- |
| M0 — Hiện trạng | Không | Đọc repo/AGENTS nếu có; xác nhận nhánh và thay đổi đang dở | Báo cáo baseline; không ghi đè dữ liệu mới |
| M1 — Khảo sát nguồn | M0 | Kiểm kê HSK 3.0, đọc mục lục HSK1, rà quyền, thử ghép một bài với audio/bài tập | Source audit và ma trận; phân biệt verified/unverified/blocked; không bịa tổng số bài |
| M2 — UX và schema | M1 về cấu trúc nguồn | Dựng các màn chính, trạng thái trống/lỗi, route và schema | Prototype 360/390/768/1440 px; mọi nút có hành vi; fixture kỹ thuật gắn nhãn không phải bài nguồn |
| M3 — Pilot nội dung | M1 đủ điều kiện dùng tài sản, M2 | Chọn bài đầu HSK1 có ngữ pháp, văn bản, audio và bài tập kiểm chứng được; ghi bài bỏ qua và lý do | Một bài học trọn vòng, nguồn đến từng câu/câu hỏi; nếu chưa đủ quyền thì chỉ pilot liên kết nguồn và nêu rõ hạn chế |
| M4 — Player và bài tập | M3 | Nghe toàn đoạn/từng câu, ẩn hiện hỗ trợ, phản hồi, quay lại lý thuyết | Không chồng audio; không mất trạng thái; đáp án và mốc nghe đã kiểm tra |
| M5 — Lưu và ôn | M4 | Lưu tiến độ, ôn câu sai, backup/restore, resume | Refresh/đóng mở vẫn tiếp tục đúng; restore hợp lệ; điểm và mastery không bị thổi phồng |
| M6 — QA và phát hành pilot | M5 | Kiểm nội dung, UX, CI, preview rồi phát hành theo quyền được cấp | Build đạt, đường dẫn thật hoạt động, release/checkpoint có SHA và giới hạn đã biết |
| M7 — Mở rộng HSK1 | Pilot được người dùng nghiệm thu | Làm từng bài theo mục lục và pipeline | Các bài ready có đầy đủ bằng chứng; phần thiếu hiển thị trung thực |
| M8 — HSK2 trở lên | HSK1 ổn định và nguồn cấp kế tiếp kiểm chứng | Rà nguồn lại, mở rộng không đổi schema tùy tiện | Báo cáo phủ theo bài và theo ngữ pháp, regression đạt |

Ưu tiên sửa lỗi pilot trước mở rộng. Không coi CI xanh là bằng chứng nội dung ngôn ngữ đúng hoặc audio đã nghe. Tách rõ QA tự rà soát và QA độc lập nếu thực sự có người/vòng kiểm độc lập; không gắn nhãn độc lập cho chính lượt soạn.

## 11. Checklist nghiệm thu bắt buộc

### Nội dung

- 100% mục xuất bản có sourceRefs và quyền dùng phù hợp cách hiển thị.
- Đúng quyển/ấn bản; không lẫn giáo trình cũ hoặc audio workbook với textbook.
- Mọi bản dịch, Pinyin và đáp án đã duyệt; thiếu đáp án không chấm tự động.
- Không có placeholder, bài sinh tự động hoặc câu ví dụ không có nguồn trong nội dung phát hành.
- Các liên kết grammar–sentence–audio–exercise resolve đúng, không chỉ có ID tồn tại mà còn đúng ý nghĩa.

### UX và chức năng

- Đường học hoàn chỉnh: Trang chủ → bài → giải thích → đọc/nghe → bài tập → sửa lỗi → tổng kết → ôn.
- Deep link vào câu, quay lại và refresh không lỗi 404 hoặc mất bài đang làm.
- Pinyin/nghĩa có tác dụng ở đúng vùng và được nhớ; không lộ đáp án khi chưa nộp.
- Audio lỗi có thông báo, retry và mở nguồn; seek/lặp/tốc độ/dừng cuối câu đúng.
- Nếu phát câu chưa xác minh thì đó là lỗi chặn phát hành, không chỉ cảnh báo.
- Tab, focus, nhãn nút loa, vùng chạm và thông báo kết quả dùng được bằng bàn phím/trình đọc màn hình.
- Loading, dữ liệu trống, lỗi mạng, nguồn mất, route sai và dữ liệu backup sai đều có xử lý.
- Không tải PDF/audio lớn khi vừa mở trang. Đo hiệu năng bản production; mục tiêu p75 LCP ≤2,5s, CLS ≤0,1, INP ≤200ms khi có dữ liệu thực, chưa có thì báo kết quả lab riêng.

### Các kiểm thử đáng làm

- Validator schema, ID trùng, tham chiếu thiếu, thiếu chứng cứ nguồn/quyền, timestamp vượt duration.
- Unit test chấm bài với biến thể hợp lệ và gần đúng nhưng sai nghĩa; review schedule và migration tiến độ.
- E2E một hành trình học hoàn chỉnh, một câu làm sai quay lại lý thuyết, refresh/resume và backup/restore.
- Kiểm audio thật và kiểm trực quan trên mobile; ghi môi trường kiểm tra, không báo đã thử thiết bị nếu chỉ giả lập kích thước.

## 12. Tài liệu để Muse tiếp tục qua nhiều phiên

Muse tạo/cập nhật trong repo:

| File | Nội dung |
| --- | --- |
| `AGENTS.md` | Phạm vi repo, nguồn duy nhất, quy tắc không bịa, quy trình chạy và kiểm tra |
| `docs/MASTER_PLAN.md` | Bản kế hoạch này và các thay đổi được chốt |
| `docs/SOURCE_AUDIT.md` | Tài sản, nguồn, phiên bản, quyền, trạng thái kiểm chứng |
| `docs/CURRICULUM_MAP.md` | Quyển–bài–ngữ pháp–trang–audio–bài tập |
| `docs/UI_SPEC.md` | Route, component, token, trạng thái và hành vi |
| `docs/CONTENT_STANDARD.md` | Dịch, chú giải, Pinyin, timestamp, đáp án, provenance |
| `docs/DECISIONS.md` | Quyết định cùng lý do và ảnh hưởng |
| `docs/CHECKPOINT.md` | Việc vừa xong, việc tiếp theo duy nhất, blocker, lệnh kiểm thử, SHA/PR/release |
| `docs/QA_REPORT.md` | Mục đã kiểm, bằng chứng, lỗi và giới hạn chưa xác minh |

Checkpoint có các trường: milestone, status, currentLessonId, lastCompletedTask, nextTask, blockers, checksRun, evidence, commit, deploymentUrl. Chỉ dùng trạng thái done khi có bằng chứng. Việc đang làm phải đủ chi tiết để phiên sau không phải đọc lại toàn bộ chat.

Khi người dùng nói “Tiếp tục”: đọc AGENTS và checkpoint, kiểm trạng thái repo, làm nextTask trong chặng hiện tại. Không mặc định nhảy cấp hoặc nhập hàng loạt bài. Trước pilot được nghiệm thu, chỉ hoàn thiện pilot và sửa lỗi.

## 13. Prompt khởi động có thể gửi nguyên văn cho Muse

Bạn là kỹ sư sản phẩm web, thiết kế UX và biên tập học liệu tiếng Trung cho người Việt. Hãy triển khai dự án mới tại https://github.com/bohoa96tb/HSK3.0 theo tài liệu này. Không sửa hazi-viet hoặc hanngu-grammar.

Đọc toàn bộ kế hoạch, kiểm tra repository hiện tại rồi lưu đặc tả vào docs/MASTER_PLAN.md và lập AGENTS.md cùng CHECKPOINT.md. Nếu repo đã thay đổi, hợp nhất với công việc hiện có, không reset hoặc ghi đè.

Nội dung bài học, ví dụ, bài đọc, audio và bài tập chỉ lấy từ Baulchino và tài sản được trang nguồn dẫn tới, đúng mục HSK 3.0. Các website học tiếng Trung khác chỉ dùng tham khảo UX. Tiếng Việt là bản dịch/chú giải biên tập từ nguồn; không tự tạo câu và TTS để lấp thiếu.

Thực hiện M0 → M1 → M2 trước. Phải kiểm chứng mục lục, phiên bản sách và khả năng ghép audio/bài tập của ít nhất một bài. Ghi quyền sử dụng theo tài sản; khi chưa đủ căn cứ tái xuất bản, làm khung app và liên kết về nguồn, không đưa bản sao toàn văn/PDF/MP3 lên repo công khai. Không tự liên hệ bên thứ ba.

Thiết kế mobile-first, tiếng Việt đơn giản, có hai đường học theo giáo trình và tra cứu ngữ pháp; dùng chung dữ liệu để nối từng cấu trúc với câu, audio, bài tập và ôn lỗi. Hiện thực các route và hành vi trong kế hoạch, không tạo nút trang trí không hoạt động.

Sau đó làm một bài pilot đủ vòng khi nguồn cho phép. Không đoán tên bài, số bài hoặc lấy dữ liệu HSK cũ. Nghe từng câu chỉ bật sau xác minh timestamp; đáp án chưa kiểm chứng không chấm tự động. Không báo hoàn tất khi mới có giao diện hoặc CI xanh.

Tự giải quyết lựa chọn kỹ thuật thông thường trong phạm vi kế hoạch. Ghi blocker chính xác và tiếp tục công việc độc lập không bị blocker. Hoàn thiện, chạy kiểm tra, tạo thay đổi reviewable/PR theo quyền hiện có; chỉ phát hành khi đã được cho phép. Sau pilot, báo link xem thử, nguồn từng mục, những gì đã kiểm tra và phần còn thiếu; chờ người dùng nghiệm thu trước nhập hàng loạt HSK1.

Cuối mỗi phiên cập nhật checkpoint với đúng một bước tiếp theo. Khi tôi nói “Tiếp tục”, tiếp tục từ checkpoint, không lập lại kế hoạch từ đầu.

## 14. Phạm vi bàn giao lượt đầu cho người dùng

Một pilot tốt phải chứng minh được: có thể đọc dễ trên điện thoại, hiểu một điểm ngữ pháp, nghe đúng câu, làm bài tập nguồn, xem lỗi và quay lại đúng giải thích, đóng mở vẫn tiếp tục được. Nếu chưa thể hiển thị nội dung đầy đủ do nguồn/quyền, phải ghi rõ pilot mới chứng minh khung và điều hướng, chưa đạt pilot học liệu.

Không gọi sản phẩm là “đầy đủ HSK 3.0” trước khi ma trận nguồn và ánh xạ đề cương chứng minh được điều đó.

## Điều chỉnh thực hiện — 01/11/2026

Người dùng yêu cầu sửa trực tiếp toàn bộ giao diện và rà lại học liệu, bổ sung hình từ sách khi cần. Phạm vi hiện tại là hoàn thiện Bài 1, chưa mở M7. Textbook đã đọc được; dùng 3 hội thoại/10 lượt cùng các track tương ứng, tách nền phát âm Workbook. Chi tiết thay đổi, nguồn và giới hạn tại DECISIONS D08 và SOURCE_AUDIT cập nhật.
