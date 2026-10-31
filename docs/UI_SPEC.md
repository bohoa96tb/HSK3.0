# UI_SPEC.md — Đặc tả giao diện và hành vi

Theo đặc tả gốc mục 3–5 (`docs/MASTER_PLAN.md`). Mobile-first, ưu tiên
Android; tiếng Việt rõ ràng; chữ Trung giản thể. Tên hiển thị tạm:
**HSK 3.0 · Ngữ pháp tiếng Trung** (không dùng logo HSK chính thức).

Hai đường học dùng chung một dữ liệu: **theo giáo trình** và **tra cứu ngữ
pháp**. Mọi nút hiển thị phải có hành vi thật — không có nút trang trí,
không có nút chết.

## 1. Design token

| Thành phần | Giá trị |
| --- | --- |
| Nền trang | Kem rất nhạt `#F7F8F5` |
| Mặt nội dung | Trắng |
| Màu chính | Xanh ngọc đậm `#0F766E` |
| Văn bản chính | `#172B2A` |
| Văn bản phụ | `#52615E` |
| Nhấn cấu trúc ngữ pháp | Nền `#E3F2ED`, kèm gạch/nhãn — không chỉ dựa vào màu |
| Cảnh báo | Hổ phách, kèm chữ giải thích |
| Lỗi | Đỏ, kèm lời giải thích bằng chữ |
| Bo góc | 12–16 px; đường viền mảnh; ít bóng |
| Chữ Việt | System sans; nội dung từ 16 px; giãn dòng 1,6 |
| Chữ Trung | Phông hệ thống hỗ trợ giản thể; câu học 24–28 px; cho phép tăng cỡ chữ |
| Pinyin | Ruby phía trên chữ Hán; 13–14 px; chừa khoảng dòng đủ cho ruby |
| Vùng chạm | Tối thiểu 44×44 px cho mọi nút (kể cả nút loa nhìn nhỏ) |

Kiểm tra tương phản thực tế trước khi chốt màu. Không dùng quá nhiều thẻ
lồng nhau; danh mục bài dùng hàng gọn; màn hình chủ chỉ có một nút chính
nổi bật.

## 2. Bố cục theo thiết bị

- **Điện thoại:** một cột. Thanh điều hướng dưới: Hôm nay / Lộ trình /
  Tra cứu / Ôn tập. Cài đặt nằm trong nút hồ sơ ở đầu trang.
- **Trong bài học:** ẩn thanh điều hướng toàn cục, thay bằng nút
  Trước / Tiếp tục; phía trên có nút thoát về đúng bài và danh mục mục học.
- **Máy tính:** thanh trái khoảng 220 px; vùng nội dung tối đa khoảng
  760 px; mục lục bên phải khoảng 240 px khi đủ chỗ.
- **Mini player:** nằm trên thanh dưới, tính cả safe area; không che câu,
  đáp án hoặc nút Tiếp tục.
- **Breakpoint kiểm tra bắt buộc:** 360, 390, 768 và 1440 px. Không có cuộn
  ngang toàn trang ở bất kỳ bề rộng nào trong số này.

## 3. Route (hash router, base path `/HSK3.0/`)

| Route | Màn hình |
| --- | --- |
| `#/today` | Hôm nay |
| `#/course/:courseId` | Lộ trình: chọn quyển, danh sách bài |
| `#/lesson/:lessonId` | Giới thiệu bài |
| `#/lesson/:lessonId/:sectionId` | Nội dung một mục học |
| `#/grammar` | Tra cứu ngữ pháp |
| `#/grammar/:grammarId` | Chi tiết một điểm ngữ pháp |
| `#/reader/:passageId?sentence=:id` | Đọc/nghe (câu được chọn qua tham số) |
| `#/exercise/:setId?item=:id` | Bài tập từng câu |
| `#/review` | Ôn tập |
| `#/progress` | Tiến độ |
| `#/settings` | Cài đặt |
| `#/sources/:sourceId` | Nguồn: quyển, phiên bản, trang, link nguồn |

Mỗi chuyển trang phải giữ ngữ cảnh quay lại: route, vị trí cuộn, câu đang
nghe, câu bài tập đang làm. Quay lại từ phần giải thích **không** được xóa
câu trả lời đã nhập và **không** phát lại audio tự động. Deep link vào câu,
quay lại và refresh không được lỗi 404 hoặc mất bài đang làm.

## 4. Hành vi từng màn hình

### 4.1. Hôm nay (`#/today`)

Thứ tự từ trên xuống:

1. Lời chào ngắn và nút Cài đặt.
2. Thẻ "Tiếp tục học": cấp, quyển, bài, mục còn dở, nút tiếp tục — tiếp tục
   đúng bài/mục/câu đang dở. Người mới thấy "Bắt đầu HSK 1".
3. Ôn tập: số mục đến hạn và số câu sai cần xem. Khi chưa có dữ liệu: giải
   thích ngắn, không hiện tiến độ giả.
4. Tiến độ tuần: số phiên đã học, phút học tích cực ước tính (không tính
   thời gian mở tab mà không học).
5. Lối tắt "Tra một cấu trúc". Không đặt lịch sử dài và toàn bộ cấp học lên
   màn hình chủ.

### 4.2. Lộ trình (`#/course/:courseId`)

- Chọn cấp → quyển → danh sách bài. Hàng bài gồm: số bài, tên nguồn, tên
  Việt (biên tập), 1–3 nhãn kiến thức, trạng thái và nút học.
- Chọn bài mở trang giới thiệu bài trước khi vào nội dung.
- Hai nhóm trạng thái tách riêng, hiển thị độc lập:
  - **Xuất bản:** Chưa có nguồn / Đang kiểm tra / Sẵn sàng / Tạm lỗi nguồn.
  - **Học:** Chưa học / Đang học / Đã học / Cần ôn.
- Chỉ bài đã nghiệm thu mới có nút Học. Bài chưa đủ nguồn hiển thị lý do cụ
  thể; không làm nút chết.
- Không khóa người học vào thứ tự bắt buộc; chỉ khuyến nghị bài tiên quyết.

### 4.3. Bài học (`#/lesson/:lessonId` và `/:sectionId`)

- Trang giới thiệu: tên bài, mục tiêu, nguồn, các mục cần học, thời lượng
  ước tính; nút Bắt đầu / Tiếp tục dẫn tới mục học phù hợp.
- Chuỗi mục của một bài (bỏ mục không có trong nguồn, xem mục 5):
  Giới thiệu → Chuẩn bị → Ngữ pháp → Đọc/nghe → Bài tập → Vận dụng (nếu
  nguồn có) → Tổng kết và ôn lỗi.
- Làm sai ở bài tập có thể mở đúng phần giải thích rồi quay lại mà không
  mất câu trả lời.

### 4.4. Tra cứu ngữ pháp (`#/grammar`, `#/grammar/:grammarId`)

- Tìm theo chữ Hán, mẫu có dấu ba chấm, từ khóa Việt, hoặc Pinyin có/không dấu.
- Kết quả gồm: tên điểm, giải thích một dòng, cấp theo nguồn, số bài có sử dụng.
- Lọc theo chức năng (hỏi, phủ định, thời gian, so sánh…) chỉ bật khi dữ
  liệu đã được gán và kiểm tra.
- Chi tiết điểm ngữ pháp theo thứ tự thẻ giải thích (đặc tả mục 6.1): Dùng
  để làm gì → Mẫu câu → Ví dụ nguồn → Đặt ở đâu → Dễ nhầm (chỉ khi có căn
  cứ nguồn; chú giải biên tập phải đánh nhãn) → "Dùng trong bài này".
- Luôn có mục "Học trong ngữ cảnh" dẫn đến đúng câu nguồn, đoạn audio và
  bài tập đã liên kết. Không để trang ngữ pháp thành lý thuyết rời rạc.

### 4.5. Đọc/nghe (`#/reader/:passageId`)

- Trình đọc/nghe dùng chung. Đầu trang: tiêu đề, bài nguồn, lựa chọn
  "Đọc cùng nghe / Chỉ nghe". Thanh công cụ: Pinyin, nghĩa, cỡ chữ, đánh
  dấu cấu trúc.
- Mỗi câu có: người nói (nếu nguồn có), chữ Trung, Pinyin tùy chọn, bản
  dịch tùy chọn, nút phát và nút lưu. Chạm cấu trúc mở bảng nhỏ giải thích;
  nút "Học đầy đủ" mở trang ngữ pháp kèm đường quay lại.
- Player: phát/dừng, thời gian, tốc độ 0,75 / 1 / 1,25, lặp câu 1–3 lần,
  khoảng nghỉ tùy chọn. Điều khiển cả đoạn luôn hoạt động nếu track hợp lệ.
- **Một phần tử audio duy nhất** điều phối toàn app: phát câu/track mới
  phải dừng cái cũ; không để nhiều audio phát chồng nhau.
- Nghe từng câu chỉ bật khi đã có mốc thời gian kiểm chứng
  (`verified`). Pilot hiện tại: nghe cả track, tắt nghe từng câu
  (xem quyết định D-audio).
- Mạng lỗi: giữ tiến độ, hiện Thử lại và Mở nguồn; không thay bằng TTS.

### 4.6. Bài tập (`#/exercise/:setId`)

- Một câu mỗi màn hình; thanh tiến độ của bộ bài tập; tổng kết ở cuối.
- Dạng bài chỉ kích hoạt khi đã thấy đề tương ứng trong nguồn: chọn đáp án,
  đúng/sai, điền từ, sắp xếp, nối, nghe trả lời. Không đổi đề gốc thành lựa
  chọn rồi bịa đáp án nhiễu.
- Câu phụ thuộc hình phải có hình được phép dùng, hoặc chuyển sang mở trang
  nguồn; không bỏ hình rồi vẫn chấm.
- Sau Kiểm tra: hiện kết quả bằng chữ **và** màu, đáp án, giải thích ngắn
  bằng tiếng Việt bám nguồn, nút "Ôn lại cách dùng" mở đúng phần giải thích.
- Dạng nối/sắp xếp phải có cách bấm từng mục cho người không kéo thả được.
- Câu thiếu đáp án tin cậy: chế độ tự đối chiếu / tự đánh giá, không tính
  vào điểm tự động, hiển thị rõ chế độ này cho người học.
- Trong lúc kiểm tra: ẩn gợi ý có thể lộ đáp án; bấm trợ giúp được ghi là
  đã dùng gợi ý (ảnh hưởng cách ghi điểm, xem `docs/CONTENT_STANDARD.md`).

### 4.7. Ôn tập (`#/review`)

- Hàng đợi ôn dùng lại câu nguồn đã lưu / làm sai; không tự tạo câu mới.
- Ba nút tự đánh giá: Chưa nhớ / Còn chậm / Nhớ.
- Lịch đề xuất: 1, 3, 7, 14, 30 ngày; trả lời sai quay về 1 ngày (quy tắc
  sản phẩm đề xuất trong đặc tả, không phải chứng nhận phương pháp tối ưu).

### 4.8. Tiến độ (`#/progress`)

- Tách "đã xem / đã học" khỏi "đã nắm vững". Mục thiếu bài tập kiểm chứng
  không được coi là thành thạo.
- Hiển thị riêng: điểm lần đầu, điểm lần gần nhất, số câu làm lại. Việc xem
  đáp án / dùng gợi ý không được làm đẹp điểm.
- Chọn điểm yếu dẫn tới phần học tương ứng.

### 4.9. Cài đặt (`#/settings`)

- Hai công tắc **độc lập**: Pinyin và Nghĩa Việt; có lựa chọn riêng cho từ
  chuẩn bị và cho câu trong bài. App nhớ lựa chọn của người dùng.
- Mặc định: từ chuẩn bị hiện Pinyin; ví dụ/bài đọc ẩn Pinyin, hiện nghĩa
  khi chạm.
- Cỡ chữ, tốc độ audio mặc định.
- Sao lưu: xuất / nhập JSON tiến độ (có schemaVersion, validate trước khi
  ghi, xem trước hợp nhất, sao lưu trước khi ghi đè). Lưu cài đặt không
  cần tài khoản.

### 4.10. Nguồn (`#/sources/:sourceId`)

- Hiển thị quyển, phiên bản, trang (PDF và in), link nguồn Baulchino và
  trạng thái quyền sử dụng của tài sản.

## 5. Mẫu bài học — quy tắc hiển thị mục

Một bài nguồn là một đơn vị nội dung; mỗi điểm kiến thức có thể là phiên
5–10 phút, thời lượng ghi ước tính và hiệu chỉnh sau pilot. Không ép mọi
bài vào số câu cố định.

| Mục | Người học thấy | Liên kết bắt buộc |
| --- | --- | --- |
| 0. Giới thiệu | Tên bài, mục tiêu, nguồn, mục cần học | Bài trước, nguồn, các điểm kiến thức |
| 1. Chuẩn bị | Từ cần hiểu để đọc câu của bài; bật nghĩa/Pinyin; nghe nếu có track đúng | Từ → câu xuất hiện; không gán audio toàn đoạn làm phát âm riêng của từ |
| 2. Hiểu ngữ pháp | Mỗi điểm: nghĩa, mẫu, vị trí, ví dụ, lưu ý | Điểm → câu/đoạn nguồn và bài tập |
| 3. Đọc và nghe | Hội thoại/bài đọc nguồn, chia câu | Câu → audio + điểm ngữ pháp + nguồn |
| 4. Luyện tập | Bài tập nguồn, một câu mỗi màn | Câu hỏi → điểm ngữ pháp và phần đọc liên quan |
| 5. Vận dụng | Nhiệm vụ nói/viết có trong nguồn, nếu có | Nhiệm vụ → mẫu trong bài; không tạo đánh giá AI giả |
| 6. Tổng kết | Đã học gì, câu sai, mục cần ôn | Câu sai → đúng phần lý thuyết; bài sau |

Nếu nguồn không có một mục: bỏ mục không áp dụng hoặc hiển thị "thiếu
nguồn" đúng ngữ cảnh. Tổng kết không khẳng định bài đủ mọi kỹ năng. Không
tự biến bài đọc thành hội thoại hoặc thêm bài tập mới để đủ khuôn.

Ghi chú pilot: Bài 1 Workbook là bài nền phát âm, không có điểm ngữ pháp
câu và chưa kiểm chứng được hội thoại Textbook — các mục Ngữ pháp / Đọc
theo nghĩa textbook không áp dụng cho pilot này; app hiển thị đúng phạm vi
nguồn Workbook (xem `docs/CURRICULUM_MAP.md` mục 2).

## 6. Trạng thái bắt buộc của mọi màn hình

Mọi màn hình phải xử lý đầy đủ, không để màn hình trắng hoặc nút chết:

| Trạng thái | Hành vi |
| --- | --- |
| Đang tải | Chỉ báo tải rõ ràng; không tải PDF/audio lớn ngay khi mở trang |
| Trống | Giải thích ngắn vì sao chưa có dữ liệu và lối đi tiếp hợp lệ (không hiện số liệu giả) |
| Thiếu nguồn | Nêu lý do cụ thể của bài/mục đó kèm nút Mở nguồn (nếu có URL nguồn) |
| Lỗi mạng / lỗi tải audio | Giữ nguyên tiến độ và câu trả lời; nút Thử lại + Mở nguồn; không thay bằng TTS |
| Route sai / không tìm thấy | Trang báo không tìm thấy kèm đường về Hôm nay / Lộ trình |
| Dữ liệu sao lưu sai | Từ chối nhập, báo lỗi cụ thể, giữ nguyên dữ liệu hiện tại |
| Audio kết thúc đoạn/câu | Dừng đúng mốc hoặc chuyển theo chế độ người dùng đã chọn |

## 7. Khả năng tiếp cận

- Kết quả đúng/sai thông báo bằng chữ kèm màu, không chỉ bằng màu.
- Nhãn nút loa và điều khiển player đọc được bằng trình đọc màn hình;
  điều hướng và làm bài được bằng bàn phím; focus nhìn thấy được.
- Vùng chạm tối thiểu 44×44 px (mục 1).
- Phát nền khi chuyển app / khóa màn hình: **chưa xác minh** trên Android
  thật — không cam kết trong giao diện hay tài liệu phát hành cho tới khi
  đã thử trên thiết bị thật. Media Session chỉ là hỗ trợ, không phải bảo đảm.
