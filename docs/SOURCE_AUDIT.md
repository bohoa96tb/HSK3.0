# SOURCE_AUDIT.md — Kiểm kê nguồn Baulchino

Ngày kiểm: **2026-10-31**. Nguồn duy nhất: https://www.baulchino.com/
Tài liệu này chỉ ghi sự thật đã kiểm chứng trực tiếp trong ngày kiểm.
Phần chưa kiểm chứng ghi rõ `unverified` / `blocked`, không suy đoán.

## 1. Trạng thái quyền sử dụng — áp dụng cho mọi tài sản

Trên hai trang Baulchino đã đọc (trang sách và trang audio), **không thấy**
tuyên bố giấy phép / bản quyền cho sách và audio (đã tìm các từ khóa
license / copyright / permission: 0 kết quả).

- `rightsStatus` của **mọi** tài sản dưới đây: **`unknown`**.
- Hệ quả (quyết định D-quyền, xem `docs/DECISIONS.md`): app chỉ liên kết và
phát trực tiếp từ nguồn (link/stream). Không sao chép, không lưu trữ,
không đưa PDF / MP3 / toàn văn sách vào repo công khai.
- Nếu chủ nguồn yêu cầu, chuyển sang link-only thuần (chỉ nút mở nguồn).
- Bản dịch tiếng Việt trong app là chú giải biên tập, ghi rõ vai trò đó;
không phải bản dịch chính thức.

## 2. Bảng tài sản

| # | Tài sản | URL | Loại | Trạng thái kiểm chứng | rightsStatus | Bằng chứng (2026-10-31) |
| --- | --- | --- | --- | --- | --- | --- |
| S01 | Trang sách HSK 3.0 | https://www.baulchino.com/new-hsk-books-2026 | Trang web | Đã đọc trực tiếp | unknown | Trang ghi "new HSK 3.0 books, released in 2026", tải miễn phí không cần tài khoản. Danh mục: HSK1 Textbook/Workbook/Writing + audio; HSK2 tương tự; HSK3 Textbook/Workbook; HSK4A Textbook; HSK4B Textbook |
| S02 | Trang audio HSK 3.0 | https://www.baulchino.com/new-hsk-audios-2026 | Trang web | Đã đọc trực tiếp | unknown | Liệt kê HSK1–3 Textbook+Workbook và HSK4A Textbook ("HSK 3.0 2026 Edition"). Tổng 506 URL MP3 trên CDN trích từ payload trang. Đây là bằng chứng danh mục, chưa chứng minh mọi track phát được |
| S03 | PDF Textbook HSK1 | https://cdn.baulchino.com/new-hsk-books/hsk-course-1.pdf | PDF | **blocked / unverified** — công cụ đọc web báo lỗi rỗng khi mở; chưa đọc được nội dung | unknown | URL lấy từ trang sách S01. Không suy đoán nội dung textbook |
| S04 | PDF Workbook HSK1 | https://cdn.baulchino.com/new-hsk-books/hsk-course-1-workbook.pdf | PDF, 139 trang, 73.963.050 byte | **Đã tải và đọc trực quan** (quét CamScanner, không lớp chữ) | unknown | Bìa: "新HSK教程New HSK Course 1 Workbook", NXB 外语教学与研究出版社 (FLTRP), tổng chủ biên 郭风岚. Lời tựa ký 2025-12 xác nhận bộ sách theo HSK 3.0, 6 cấp. ISBN bìa sau: 978-7-5213-7177-2 |
| S05 | PDF Writing HSK1 | hsk-course-1-writing.pdf (cùng thư mục CDN với S03/S04) | PDF | Chưa kiểm chứng nội dung — chỉ xác nhận có liên kết trên trang sách | unknown | Liệt kê trong danh mục HSK1 của S01 |
| S06 | Audio HSK1 Textbook | Liệt kê trên S02 (CDN Baulchino) | MP3 theo bài/track | Mức danh mục: 15 bài; bài 1–3 mỗi bài 7 track, bài 4–15 mỗi bài 6 track. Chưa kiểm tra phát từng track, chưa nghe | unknown | Đếm từ danh mục trang audio S02 |
| S07 | Audio HSK1 Workbook | Liệt kê trên S02 (CDN Baulchino) | MP3 theo bài/track | Mức danh mục: 15 bài (bài 1–3, 7–15: 2 track/bài; bài 4–6: 3 track/bài) + 1 track `mock-test-hsk1.mp3`. Đã kiểm HEAD bài 1 (xem S08/S09). Chưa nghe kiểm chứng | unknown | Đếm từ danh mục trang audio S02; kiểm HEAD ngày 2026-10-31 |
| S08 | MP3 Workbook Bài 1, track 1-1 | Thư mục workbook lesson-01 trên CDN (theo S02) | MP3, 4.214.744 byte | HEAD 200, `audio/mpeg`, `Accept-Ranges: bytes`. Đã tải về máy kiểm tra (không đưa vào repo): ffprobe 252,2 giây. **Chưa nghe kiểm chứng** nội dung khớp văn bản | unknown | Kiểm HEAD + ffprobe ngày 2026-10-31. Sách in ghi track 1-1 cho phần Pronunciation — đối ứng theo số hiệu track, chưa kiểm chứng bằng tai nghe |
| S09 | MP3 Workbook Bài 1, track 1-2 | Thư mục workbook lesson-01 trên CDN (theo S02) | MP3, 6.121.685 byte | HEAD 200, `audio/mpeg`, `Accept-Ranges: bytes`. Đã tải về máy kiểm tra (không đưa vào repo): ffprobe 371,3 giây. **Chưa nghe kiểm chứng** nội dung khớp văn bản | unknown | Kiểm HEAD + ffprobe ngày 2026-10-31. Sách in ghi track 1-2 cho phần Listen, Read, and Practice — đối ứng theo số hiệu track, chưa kiểm chứng bằng tai nghe |
| S10 | Mock Test HSK1 (trong Workbook) | Trong PDF S04; audio: track `mock-test-hsk1.mp3` trên S02 | Đề thi thử + MP3 | Đã xác nhận tồn tại trong mục lục/cấu trúc Workbook (trang in 121) và 1 track audio ở mức danh mục. Nội dung chi tiết chưa kiểm chứng | unknown | Mục lục Workbook (trang in VI = PDF tr.7); danh mục S02 |
| S11 | Sách/audio HSK2, HSK3, HSK4A, HSK4B | Trang sách S01 và trang audio S02 | PDF / MP3 | **Chỉ ở mức danh mục trang** — chưa tải, chưa đọc, chưa kiểm tra track nào | unknown | Danh mục S01/S02 ngày 2026-10-31 |

## 3. Sự thật đã kiểm chứng về Workbook HSK1 (S04)

- Cấu trúc: Workbook là sách companion của Textbook, gồm
"Study / Practice / Test". Các phần: "小语讲堂 Xiaoyu's Classroom"
(phát âm bài 1–15, chữ Hán bài 7–15), "模拟训练 Simulated Practice"
từ bài 4, "模拟测试 Mock Test" — một đề HSK1 hoàn chỉnh.
- Mục lục đầy đủ 15 bài: xem `docs/CURRICULUM_MAP.md`.
- Nội dung Bài 1 đã đọc trực quan trang in 001–004 (PDF tr.8–11):
xem `docs/CURRICULUM_MAP.md`.
- **Đáp án:** không thấy phần đáp án trong Workbook (đã xem các trang cuối:
chỉ có Mock Test và bìa sau). Đáp án các bài nghe 2–4 của Bài 1
**chưa kiểm chứng** → không chấm tự động (xem quyết định D-exercise).

## 4. Phần chưa kiểm chứng — ghi rõ, không lấp

| Hạng mục | Trạng thái | Hệ quả |
| --- | --- | --- |
| Nội dung Textbook HSK1: mục lục, tên bài, ngữ pháp, hội thoại, bài đọc, đáp án | blocked / unverified (S03 mở lỗi rỗng) | Không dùng nội dung textbook trong app cho tới khi đọc được trực tiếp. Tên bài Textbook **chưa** xác minh trùng với tên bài Workbook |
| HSK2 trở lên (sách, audio, nội dung) | Chỉ ở mức danh mục trang (S11) | Không tạo bài, không suy ra số bài/track ngoài danh mục đã đếm |
| Đáp án Workbook (gồm bài nghe 2–4 Bài 1) | Chưa kiểm chứng — không thấy phần đáp án trong sách | Các bài đó dùng chế độ tự đối chiếu/tự đánh giá, `answerStatus=unverified` |
| Nghe audio bằng tai (khớp văn bản, chất lượng, mốc câu) | Chưa thực hiện — môi trường kiểm không có khả năng nghe | Đối ứng track mới ở mức số hiệu/danh mục. Tắt nghe từng câu; chỉ nghe cả track (xem D-audio) |
| Timestamp theo câu trong audio | Chưa kiểm chứng | Không bật nghe từng câu, không tuyên bố karaoke |
| Quyền tái xuất bản sách/audio | unknown — không thấy tuyên bố giấy phép trên trang đã đọc | Chỉ link/stream từ nguồn; không commit PDF/MP3/toàn văn |
| Đối chiếu đề cương thi HSK 3.0 chính thức (chinesetest.cn) | Chưa thực hiện trong lượt kiểm này | Không tuyên bố app phủ toàn bộ chuẩn; khi hiển thị thì ghi "Theo giáo trình HSK 3.0 — chưa đối chiếu đầy đủ đề cương" |

## 5. Quy tắc cập nhật file này

- Mỗi tài sản mới kiểm chứng phải ghi: URL, loại, ngày kiểm, bằng chứng cụ
thể (đã đọc trang nào / kiểm HEAD ra sao / số byte / thời lượng), và
`rightsStatus` riêng. Chỉ đổi `rightsStatus` khi có bằng chứng tương ứng.
- Không nâng trạng thái kiểm chứng dựa trên suy đoán hoặc trí nhớ.

## Kiểm tra lại 31/10–01/11/2026 — thay thế kết luận chưa đọc Textbook

- Tải trực tiếp Textbook (66.692.625 byte, 144 trang) và Workbook (73.963.050 byte, 139 trang); bản scan không có text layer. Render PyMuPDF và đọc trực quan, không dựa vào OCR.
- Textbook PDF 16–18 / trang in 001–003: đối chiếu ba hội thoại, 12 mục từ, mục tiêu, chú giải 您 và nghĩa 们. PDF 19 / trang 004 là phần đọc nhanh/mở rộng, chưa đưa thành bài mới.
- Workbook PDF 8–11 / trang 001–004: đọc lại bảng âm tiết, vần có ü (bản trước thiếu trong liệt kê), thanh điệu, đề bài 1–5.
- Bài nghe thanh điệu có 12 ô, thứ tự theo hàng: lao, neng, ge, ba / fen, kan, bai, li / gong, mang, gou, hou. Bản cũ ghi 10 âm và có âm không thuộc đề; đã sửa.
- Sáu câu ex-01…ex-06 trước đây là câu biên tập dựa trên sách, không phải đề nguyên bản. Đã rút khỏi nội dung và điểm hiện hành. Không xóa lịch sử lưu trên máy người học.
- Bài 5 chọn hình: giữ ba hình và ba hội thoại gốc. Ghép 1→1, 2→3, 3→2 là kết luận biên tập theo hình/ngữ cảnh, không khẳng định có answer key chính thức.
- Danh mục audio HTML có đúng URL Textbook 01-1, 01-3, 01-5. GET thành công và ffprobe đo lần lượt 6.367256s, 9.651125s, 9.494756s. Không suy ra nội dung đã nghe từ HTTP/duration.
- Transcript 10 lượt là lời thoại bản in; không gồm lời dẫn nếu audio có. Chưa xác minh bằng nghe hoặc mốc từng câu, vì vậy phát toàn track.
- Bốn hình trích nhỏ ghi tại assets/lesson-01/ATTRIBUTION.md theo yêu cầu người dùng. Quyền nguồn vẫn unknown. Không commit PDF hoặc MP3; không dùng ảnh mạng thay đề.
