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

## Kiểm tra 01/11/2026 — Bài 2 我叫李文 (đối chiếu trực quan, không chỉ OCR)

Người dùng cho phép bắt đầu Bài 2 ngày 2026-11-01. Đã đọc trực quan bằng ảnh render:

| Thành phần | Nguồn | Trang in / PDF | Số mục / track | Kiểm chứng | Vị trí trong app |
| --- | --- | --- | --- | --- | --- |
| Tên bài, mục tiêu, bối cảnh hội thoại 1 | Textbook | 005 / PDF 20 | — | Đã đọc trực quan | Mục 1 Bắt đầu; ảnh lớp học trích cùng trang |
| Hội thoại 1 (hỏi tên) + 6 từ mới ①–⑥ | Textbook | 006 / PDF 21 | Track 2-1 (hội thoại), 2-2 (từ) | Lời thoại đối chiếu bản in | Hội thoại 1; Từ cần biết |
| Hội thoại 2 (nhận nhầm, xin lỗi) + 5 từ mới ⑦–⑪ | Textbook | 007 / PDF 22 | Track 2-3, 2-4 | Lời thoại đối chiếu bản in | Hội thoại 2; Từ cần biết |
| Tiểu Ngữ giảng đường: trật tự từ cơ bản + Hội thoại 3 | Textbook | 008 / PDF 23 | Track 2-5 | Đã đọc trực quan | Điểm kiến thức word-order; Hội thoại 3 |
| 4 từ mới ⑫–⑮ + hoạt động cặp | Textbook | 009 / PDF 24 | Track 2-6 | Đã đọc trực quan | Từ cần biết; Mục 6 Tự nói |
| Phát âm: thanh mẫu/vận mẫu (2) j/q/x; thẻ hình; quy tắc viết (1) | Workbook | 005–006 / PDF 12–13 | Track WB 2-1 | Đã đọc trực quan | Điểm kiến thức nền phát âm |
| Quy tắc viết (2)–(4): j/q/x + ü; iou → you / iu | Workbook | 007 / PDF 14 | Track WB 2-1 | Đã đọc trực quan | Điểm kiến thức nền chính tả |
| Nghe–viết thanh mẫu (9 ô), vận mẫu (15 ô), thanh điệu (12 âm tiết) | Workbook | 008 / PDF 15 | Track WB 2-2 | Đề đối chiếu bản in; sách không in đáp án → `unverified`, không chấm tự động | 3 bài tự đối chiếu ở Mục 5 |
| Bài 4: nhìn hình chọn hội thoại (4 hình, 4 hội thoại in sẵn) | Workbook | 008 / PDF 15 | — | Hội thoại in sẵn; ghép hình→hội thoại là **suy luận biên tập** từ hình đã phóng to đối chiếu (không phải đáp án chính thức): hình 1→③, 2→①, 3→④, 4→② (`verified-from-visual`) | 4 câu chấm tự động ở Mục 5 |
| Audio Textbook Bài 2 (7 track) + Workbook Bài 2 (2 track) | Trang audio Baulchino, CDN `new-hsk-books-audios/hsk-1-{textbook,workbook}/lesson-02/` | — | TB 02-1…02-7; WB 02-1, 02-2 | Đã tải file và đo ffprobe (không đưa vào repo): TB 5,377 / 15,281 / 13,222 / 13,587 / 11,814 / 10,459 / 22,969 giây; WB 418,233 / 252,736 giây. Đối ứng theo ký hiệu in trong sách; **chưa nghe kiểm chứng**, chưa có timestamp câu → chỉ phát cả track | Mục 4 và Mục 5/6 |

- Trang mở rộng Textbook 009 (câu líu lưỡi track 2-7, nội dung bonus) **không** đưa vào app — giữ cùng phạm vi như Bài 1.
- Hình trích Bài 2 ghi tại `assets/lesson-02/ATTRIBUTION.md` (1 ảnh lớp học + 4 hình bài tập). Quyền nguồn vẫn `unknown`. Không commit PDF/MP3.

## Kiểm tra 01/11/2026 — tài liệu lời đọc và đáp án Workbook Bài 1–2 (nguồn bổ sung đối chiếu)

Người dùng cho phép tìm nguồn bổ sung để đối chiếu đáp án/transcript của đúng bộ New HSK Course (FLTRP). Ba thuộc tính được ghi riêng: **xuất xứ tài liệu**, **độ đúng của đáp án**, **đã nghe audio** — không gộp thành một cờ "verified".

| Nguồn | URL | Xuất xứ | Đã đọc gì | Kết luận dùng được |
| --- | --- | --- | --- | --- |
| Lời đọc Workbook 1 （新HSK教程1 学练手册 听力材料） | scribd.com/document/1067878415 | Bản đăng lại của người dùng Scribd; **chưa xác nhận kênh chính thức của NXB** | Lớp chữ định vị của tài liệu: Bài 1 trang in 002 (âm tiết đọc bài 2–4), Bài 2 trang in 005–006 (bài 1–3) | Âm tiết đọc cho cả 6 bài nghe–viết; khớp bản in Workbook và khớp thứ tự âm tiết trong track (ASR nháp) |
| Đáp án Workbook 1 （新HSK教程1 学练手册 习题答案） | scribd.com/document/1077395370 | Bản đăng lại; bản 1044886104 là **cùng một tài liệu**, không tính là nguồn độc lập thứ hai | Trang 1 của tài liệu: phần Bài 1–2 | Tài liệu **không in đáp án nghe–viết** (đáp án nằm ở tài liệu lời đọc); đáp án chọn hình Bài 1 = ①③②, Bài 2 = ③①④② — khớp ghép hình biên tập đã có trong app |
| xinhsk — New HSK 1 Workbook downloads | xinhsk.com/download/new-hsk-1-wb | Trang tổng hợp của bên thứ ba | Trang liệt kê gói Audio + Listening Text PDF + Kunci Jawaban PDF | **Bị chặn ở đăng nhập** ("Masuk ke akunmu untuk membuka tautan download"); không vượt giới hạn truy cập, chỉ ghi nhận gói tài liệu tồn tại |
| FLTRP — trang HSK chính thức | fltrp.com/en/hsk/ | **Nguồn nhà xuất bản** | Trang giới thiệu bộ New HSK Course | Xác nhận: bộ sách do CLEC/CTI ủy quyền, FLTRP xuất bản độc quyền; New HSK Course 1 ISBN 978-7-5213-6774-4 (khớp chỉ đạo đối chiếu). Trang không công bố đáp án/lời đọc tải tự do và không có tuyên bố cấp phép tái xuất bản → quyền vẫn `unknown` |

### Đối chiếu đề – lời đọc – đáp án (6 bài nghe–viết, 78 ô)

Đề lấy từ bản in Workbook (đọc trực quan); "âm tiết đọc" lấy từ tài liệu lời đọc; đáp án là phần đề yêu cầu. Thứ tự ô là thứ tự in theo hàng.

| Bài | Trang in Workbook | Âm tiết đọc (theo lời đọc) | Đáp án chấm | Đoạn audio trong track |
| --- | --- | --- | --- | --- |
| Bài 1 · bài 2 viết thanh mẫu (15 ô) | 004 | dà gěi pán bù mǎi lěng fó hǎo tóng hěn bān dōu kè nǐ máng | d g p b m l f h t h b d k n m | WB 1-2: 106,9–187,6s |
| Bài 1 · bài 3 viết vận mẫu (15 ô) | 004 | tā hěn māo dì fáng dōng hàn gǒu péng gē kāi fēi nù lěng bō | ā ěn āo ì áng ōng àn ǒu éng ē āi ēi ù ěng ō (kèm dấu thanh) | WB 1-2: 187,6–274,6s |
| Bài 1 · bài 4 đánh dấu thanh điệu (12 ô) | 004 | lǎo néng gè bā fēn kàn bái lǐ gōng máng gǒu hòu | thanh 3 2 4 1 1 4 2 3 1 2 3 4 | WB 1-2: 274,6–338,7s |
| Bài 2 · bài 1 viết thanh mẫu (9 ô) | 008 | qián jīn xiǎng jiào xiè qǐng jǐ qù xià | q j x j x q j q x | WB 2-2: 3,4–51,3s |
| Bài 2 · bài 2 viết vận mẫu (15 ô) | 008 | jiàn xiě qù jiào qǐng xué jiǎo xīng jiě qián xiàn qǐ jiā xiū quán | iàn iě ù iào ǐng ué iǎo īng iě ián iàn ǐ iā iū uán (kèm dấu thanh) | WB 2-2: 51,3–135,9s |
| Bài 2 · bài 3 đánh dấu thanh điệu (12 ô) | 008 | xué jiào qún jiǔ xīn qǐng xià jiā qù jī xiǎo jiě | thanh 2 4 2 3 1 3 4 1 4 1 3 3 | WB 2-2: 135,9–209,2s |

- **Ô 10 bài 2 Bài 1**: app trước đây ghi đề "__ ēn" — sai. Bản in Workbook (đọc trực quan lại trang in 004) ghi **ěn**, tài liệu lời đọc ghi **hěn**, ASR nháp trên track cũng nhận 很 (hěn). Đã sửa đề thành "__ ěn", đáp án thanh mẫu h.
- **ASR nháp** (faster-whisper base, chạy local trên file tải từ Baulchino, không tải học liệu lên dịch vụ ngoài): dãy âm tiết nhận được trên track WB 1-2 và WB 2-2 khớp thứ tự với lời đọc ở các ô nhận diện được (kể cả hěn ở ô 10); 6 track hội thoại Textbook Bài 1–2 cho nội dung khớp lời thoại bản in về câu và thứ tự. ASR chỉ là bản nháp đối chiếu, **không** thay thế nghe kiểm chứng bởi người; dấu thanh không kết luận từ ASR.
- **Mốc đoạn** lấy từ vị trí câu hướng dẫn + dãy âm tiết trong track (ASR) đối chiếu lời đọc; chỉ bật nghe theo đoạn bài tập, không chia mốc từng ô.
- Các dòng trạng thái cũ trong tài liệu này ghi bài nghe–viết là `unverified` (mục kiểm tra Bài 1 và Bài 2) được thay thế bởi mục này: đáp án nay là **biên tập đã đối chiếu** (`verified-editorial`), vẫn không phải đáp án chính thức của NXB.


## Ánh xạ audio theo đơn vị (01/11/2026)

Phương pháp: tải thêm các track từ mới Textbook (L1: 1-2/1-4/1-6; L2: 2-2/2-4/2-6) và chạy ASR local (faster-whisper, có và không VAD — bản không VAD thu được các từ bị VAD bỏ) trên các track nguồn; căn đoạn theo văn bản đã đối chiếu bản in: câu hội thoại theo ranh giới đoạn ASR (số đoạn khớp số câu ở cả 6 track), từ mới theo đoạn đọc từng từ, từ kèm hình theo khối đọc thẻ hình trong track Workbook, lựa chọn bài tập theo khối hội thoại cuối track nghe–viết (cho phép lệch 1 ký tự đồng âm khi căn, ví dụ 家/嘉). Riêng 鸡/七 ở Bài 2 được gán theo vị trí trong khối thẻ hình vì ASR ghi sai ký tự ("7."/棋); 写 và 雨/五/一/椅子 không có token nhận diện tin cậy nên để thiếu.

Độ phủ: câu hội thoại 20/20; từ mới 26/27 (thiếu 大家 — bị gộp vào token "大家好" khi đọc); từ kèm hình 20/24 (thiếu 雨、五、一、椅子); lựa chọn hội thoại bài tập 25/25; ví dụ trong điểm kiến thức 26/33 đơn vị thật (thiếu 6 âm tiết 八/拔/把/爸/阿/啊 và 雨; không tính 4 dấu "—" và chuỗi gộp "八/拔/把/爸" là đơn vị). Một số ví dụ là mệnh đề cắt trong lượt thoại dài hơn (ví dụ 我是白家月) — vẫn là đoạn trong đúng track hội thoại. Mọi đoạn đều là `asr-draft`: căn bằng máy, **chưa nghe kiểm chứng bởi người**; trạng thái nghe của các track không đổi.

## Âm Hán–Việt và Pinyin/nghĩa Mục 5 (ux3, 01/11/2026)

- **Hán–Việt (trường `hanViet` trên 27 mục từ Mục 2)**: nguồn riêng `src-hanviet-thivien` — Từ điển Hán Nôm Thi Viện (hvdic.thivien.net), tra cứu từng chữ ngày 2026-11-01. Đã đọc trực tiếp các mục chữ có nguy cơ đa âm: 您 (trích dẫn ghi "nâm"), 你 (Hán–Việt: nễ, nhĩ — app thống nhất NHĨ và ghi chú trong dữ liệu), 叫 (khiếu), 什 (trong 什麼 ghi "thậm ma"), 么 (giản thể của 麼 = ma), 没 (như chữ Một 沒）, 很 (ví dụ trích dẫn "ngận hảo"), 们 (Hán–Việt: môn), 兴 trong 高兴 theo âm xìng = HỨNG (khớp ví dụ của Hoa). Độ phủ 27/27 `verified-editorial` (biên tập đã đối chiếu từ điển, không phải âm do NXB công bố). Baulchino vẫn là nguồn bài học; từ điển này chỉ cấp âm Hán–Việt.
- **Pinyin/nghĩa cho lựa chọn Mục 5**: ghép từ chính Pinyin và bản dịch đã đối chiếu bản in của cùng các câu đó trong phần Nghe & đọc (Bài 1: 3 hội thoại; Bài 2: 4 hội thoại), áp dụng đồng đều cho 25/25 lựa chọn. Không có nội dung mới ngoài bài.
- **Audio không đổi ở lượt ux3**: ánh xạ và trạng thái giữ nguyên mục "Ánh xạ audio theo đơn vị" ở trên — mọi đoạn vẫn `asr-draft`, chưa nghe kiểm chứng bởi người; độ phủ loa giữ nguyên (20/20 câu, 26/27 từ mới, 20/24 từ kèm hình, 25/25 lựa chọn).

## Bài 3 — 我是中国人 (01/11/2026)

- **Textbook tr. in 010–015 (PDF 25–30)**, đọc trực quan: mục tiêu bài （是/的/吗）; Hội thoại 1 (track 3-1, quán cà phê), Hội thoại 2 (3-3, xem ảnh điện thoại), Hội thoại 3 (3-5, gọi video); 3 bảng từ mới 3-2/3-4/3-6 (18 từ + 4 tên riêng); 小语讲堂 3 điểm kèm ví dụ nguyên văn (gồm quy tắc lược 的 sau đại từ nhân xưng + danh từ chỉ người thân và lưu ý 谁 đọc shuí). Bài tập tổng hợp tr.015 là hoạt động lớp, không đáp án in — không chuyển thành câu chấm điểm.
- **Workbook tr. in 009–012 (PDF 16–19)**, đọc trực quan: phát âm (track 3-1) thanh/vận mẫu nhóm 3 + 2 bộ từ kèm hình (12 từ); quy tắc viết u→w và uei/uen→ui/un; nghe–viết (track 3-2) 3 bài 12/15/15 ô với phần in sẵn đối ứng; bài chọn hình 4 hội thoại in ở tr.012.
- **Lời đọc đăng lại (Scribd 1067878415)**: phần Bài 3 ở trang in 008 — dãy âm tiết của 3 bài nghe–viết đã đọc và đối chiếu (xem trường `scriptSyllables` trong dữ liệu). **Tài liệu đáp án đăng lại (Scribd 1077395370)**: đáp án chọn hình Bài 3 là ③④①②, khớp ghép hình trực quan; tài liệu này không in đáp án nghe–viết. Cả hai là bản đăng lại, không phải đáp án chính thức NXB đã chứng minh được; quyền vẫn `unknown`.
- **Audio**: 8 track tải từ CDN Baulchino đúng ký hiệu in trong sách (TB 03-1..03-6, WB 03-1/03-2), thời lượng ffprobe ghi trong dữ liệu; căn đoạn loa bằng ASR local (faster-whisper) — mọi đoạn `asr-draft`, chưa nghe kiểm chứng. Thiếu đoạn tin cậy: từ mới 吗, từ kèm hình 嘴.
- **Hán–Việt Bài 3**: tra từng chữ ở Thi Viện 2026-11-01 (nguồn `src-hanviet-thivien`): 人 NHÂN, 的 ĐÍCH, 这 GIÁ, 谁 THUỲ, 女 NHỮ, 朋 BẰNG, 友 HỮU, 哪 NA, 她 THA, 喂 UY, 姐 THƯ, 工 CÔNG, 作 TÁ, 还 HOÀN, 忙 MANG, 吗 MA, 对 ĐỐI, 太 THÁI, 想 TƯỞNG （我/中/国/法/文/泰 tra cùng lượt). Ghi chú gây nhầm đã gắn cho 的/谁/姐姐/还.

## Bài 4 — 我有两个孩子 (01/11/2026)

- **Textbook tr. in 018–025 (PDF 33–40)**, đọc trực quan: mục tiêu bài; 3 hội thoại (track 4-1 ở nhà, 4-3 ở công ty — câu hỏi tr.021/hội thoại tr.022, 4-5 trên phố); 3 bảng từ mới 4-2/4-4/4-6 (21 từ); 4 điểm 小语讲堂 （有 / 数字 / 呢（1) / 量词） kèm ví dụ nguyên văn và quy tắc 二/两， mẹo 几岁/多大. Bài tập tổng hợp tr.025 là hoạt động lớp, không đáp án in — không chuyển thành câu chấm điểm.
- **Workbook tr. in 013–018 (PDF 20–25)**, đọc trực quan: phát âm (track 4-1) biến điệu thanh 3 + thanh nhẹ, 12 từ kèm hình; 听读练 (track 4-2) nhiệm vụ 1 là 8 cặp âm tiết in sẵn (pā/bā, zì/cì, náng/láng, jǔ/qǔ, mén/méng, rù/lù, kè/rè, qīn/qǐng), nhiệm vụ 2–4 luyện đọc có nội dung in đầy đủ. 模拟测练 tr.016–018 không đưa vào bài (D15).
- **Lời đọc đăng lại (Scribd 1067878415)**: phần Bài 4 ở trang in 009–012, riêng 听读练 ở trang in 010 — 8 âm tiết được đọc: pā, zì, láng, jǔ, mén, rù, kè, qǐng. **Tài liệu đáp án đăng lại (Scribd 1077395370)**: in đáp án 听读练 nhiệm vụ 1 của Bài 4, khớp hoàn toàn 8/8 với lời đọc; cũng in đáp án 模拟测练 (nghe 1–10: B C B B B D C B A C; đọc 11–20) — chỉ ghi nhận cho hồ sơ, phần này không vào app theo D15. Cả hai là bản đăng lại, không phải đáp án chính thức NXB đã chứng minh được; quyền vẫn `unknown`.
- **Audio**: 8 track tải từ CDN Baulchino đúng ký hiệu in trong sách (TB 04-1..04-6, WB 04-1/04-2), thời lượng ffprobe ghi trong dữ liệu; căn đoạn loa bằng ASR local (faster-whisper, có và không VAD) — mọi đoạn `asr-draft`, chưa nghe kiểm chứng bởi người. Độ phủ Bài 4: câu 14/14, từ mới 21/21, từ nền 12/12, ví dụ điểm kiến thức 9 đơn vị (ví dụ tương phản 东西 không có đoạn riêng); lựa chọn bài tập không có loa riêng (xem CURRICULUM_MAP).
- **Hán–Việt Bài 4**: tra từng chữ ở Thi Viện 2026-11-01 qua cả hai lối tra (/whv/ và /wpy/); lưu ý lối /whv/ trả nhiều âm ứng viên không theo thứ tự — phải chọn theo pinyin của từ: 有 HỮU, 多少 ĐA THIỂU, 个 CÁ, 哥哥 CA CA, 呢 NI, 没有 MỘT HỮU, 家 GIA, 几 KỶ (âm jǐ; ghi chú CƠ khi đọc jī), 口 KHẨU, 爸爸 BA BA, 妈妈 MA MA, 妹妹 MUỘI MUỘI, 和 HÒA, 儿子 NHI TỬ, 孩子 HÀI TỬ, 女儿 NHỮ NHI, 岁 TUẾ, 他 THA, 今年 KIM NIÊN, 多 ĐA, 大 ĐẠI (âm dà; từ điển còn ghi THÁI cho nghĩa khác). 21/21 `verified-editorial`.

## Bài 5 — 今天我休息 (01/11/2026)

- **Textbook tr. in 027–034 (PDF 42–49)**, đọc trực quan: mục lục (tr. in IX) xác nhận Bài 5 bắt đầu ở tr. in 027 và Bài 6 ở 035 — đính chính số trang ghi nháp trong CHECKPOINT trước đó (028–035). Mục tiêu bài (ngày tháng theo thói quen tiếng Trung, động từ năng nguyện 会， câu vị ngữ danh từ); khởi động ghép từ–hình （年/月、星期一、电脑、做饭、休息、饺子）; 3 hội thoại (track 5-1 ở nhà, 5-3 ở công ty lúc nghỉ — câu hỏi nghe hiểu in ở tr.030, 5-5 ở công ty sau giờ làm — câu hỏi in ở tr.031); 3 bảng từ mới 5-2/5-4/5-6 (22 từ); 3 điểm 小语讲堂 （时间的表达（1) / 名词谓语句 / 能愿动词“会”) kèm ví dụ nguyên văn. Bài tập tổng hợp tr.033 (chọn từ điền trống + mô tả hình) và hoạt động lớp tr.034 không chuyển thành câu chấm điểm trong app kỳ này (ghi nhận để xét sau); video 彩蛋 5-1 không thuộc phạm vi app.
- **Workbook tr. in 022–024 (PDF 29–31)**, đọc trực quan: phát âm (track 5-1) biến điệu của 不 (bảng 不是/不会/不大/不对） và của 一 (hai trường hợp + bảng ví dụ); 听读练 (track 5-2) nhiệm vụ 1 là 8 cặp âm tiết in sẵn (gē/kē, jiǎng/qiǎng, cóng/sóng, nìng/lìng, jiǎ/xiǎ, zuàn/cuàn, tōu/gōu, zhí/shí), nhiệm vụ 2–3 luyện đọc biến điệu 不/一 theo bản in. 模拟测练 tr.025–030 không đưa vào bài (D15).
- **Lời đọc đăng lại (Scribd 1067878415)**: phần Bài 5 ở trang in 013 — 8 âm tiết được đọc của 听读练 nhiệm vụ 1: gē, qiǎng, sóng, nìng, jiā, cuàn, tōu, shí. **ĐIỂM CHƯA CHẮC CÔNG KHAI (D14):** ô 5 — cặp in trong sách là jiǎ/xiǎ nhưng lời đọc ghi jiā (thanh 1), bản nháp ASR local cũng nghe ra jiā; đáp án giữ jiā theo lời đọc và ghi rõ trong `answerEvidence` của bài (người học gõ jiǎ theo cặp in sẽ bị tính sai ô này — mâu thuẫn nằm trong chính tài liệu nguồn). **Tài liệu đáp án đăng lại (Scribd 1077395370)**: mục 听读练 bài 1 của Bài 5 chỉ liệt kê số thứ tự trống — không in đáp án âm tiết; có in đáp án 模拟测练 Bài 5 (nghe 1–10: C A B A B C B D B B; đọc 11–20: D C B C B D A B C B) — chỉ ghi nhận cho hồ sơ, phần này không vào app theo D15. Cả hai là bản đăng lại, không phải đáp án chính thức NXB đã chứng minh được; quyền vẫn `unknown`.
- **Audio**: 8 track tải từ CDN Baulchino đúng ký hiệu in trong sách (TB 05-1..05-6, WB 05-1/05-2), thời lượng ffprobe ghi trong dữ liệu; căn đoạn loa bằng ASR local (faster-whisper, có và không VAD) — mọi đoạn `asr-draft`, chưa nghe kiểm chứng bởi người. Độ phủ Bài 5: câu 14/14, từ mới 22/22, từ nền 10/10, ví dụ điểm kiến thức nền 8/8 đơn vị; lựa chọn bài tập không có loa riêng (như Bài 4).
- **Hán–Việt Bài 5**: tra từng chữ ở Thi Viện 2026-11-01 (lối /whv/); trang từ điển trả nhiều âm ứng viên — chọn theo pinyin của bài: 今 KIM, 天 THIÊN, 号 HÀO (ghi chú: còn âm HIỆU), 月 NGUYỆT, 日 NHẬT, 星 TINH, 期 KỲ (ghi chú: còn CƠ/KI), 休 HƯU, 息 TỨC, 会 HỘI, 做 TỐ (ghi chú âm ít gặp), 饭 PHẠN, 面 DIỆN, 条 ĐIỀU, 儿 NHI, 饺 GIẢO, 子 TỬ, 一 NHẤT, 些 TA (ghi chú âm cổ), 菜 THÁI, 下 HẠ, 班 BAN, 新 TÂN, 电 ĐIỆN, 脑 NÃO, 真 CHÂN, 好 HẢO, 看 KHÁN, 喜 HỶ, 欢 HOAN, 它 THA. 22/22 `verified-editorial`; tổng toàn app 88/88.

### Bổ sung rà soát Bài 5 (01/11/2026, sau phát hành)

- **Ô 5 chọn âm tiết — kiểm lại toàn diện:** (1) đề in lại từ ảnh trang Workbook 023: cặp (5) là jiǎ/xiǎ, không có thành viên thanh 1. (2) Tài liệu lời đọc đăng lại tr. in 013 ghi âm tiết đọc là jiā. (3) Tài liệu đáp án đăng lại không in đáp án bài này. (4) Audio: cắt đoạn âm tiết thứ 5 trong track Workbook 5-2 (khoảng 39,8–40,0 giây; ASR đọc 家） và đo cao độ bằng máy (autocorrelation): sau phần lên tiếng, F0 phẳng ở ~286–296 Hz suốt âm tiết — dáng thanh 1 (ngang cao), không phải dáng thanh 3 (võng xuống–lên). Đây là kiểm bằng máy, không phải nghe thẩm định bởi người. Kết luận: bản thu và lời đọc thống nhất jiā, bản in cặp jiǎ/xiǎ — xung đột nằm trong chính tài liệu nguồn và chưa giải quyết được → ô chuyển `source-conflict` theo D16 (ngừng chấm, giữ luyện nghe; migration loại kết quả cũ khỏi thống kê, giữ nháp/số lần thử).
- **Bài tập tổng hợp Textbook tr. in 033 — bảng kê:** (a) 选词填空 (ngân hàng 5 từ 菜/喜欢/6月22号/新/真， 4 câu, câu 4 có 2 chỗ trống): TRƯỚC ĐÂY CHƯA CÓ — nay bổ sung đủ 5 câu chấm tự động `verified-from-print` (đáp án suy ra duy nhất từ ngân hàng từ in sẵn + hội thoại/điểm kiến thức của bài; câu wb5-comp-1..5). (b) 看图说话 (4 khung câu theo hình): TRƯỚC ĐÂY CHƯA CÓ — nay bổ sung thành bài tự luyện không chấm (st-l05-02, `unverified`) vì sách không in đáp án và phần điền phụ thuộc hình. (c) Sau bổ sung, toàn bộ nội dung tr.033 thuộc phạm vi bài đã có trong app — app mới được gọi là "hoàn thiện theo phạm vi đã công bố" của trang này. (Hoạt động lớp tr.034 và video 彩蛋 vẫn ngoài phạm vi đã công bố.)
- **Ma trận loa lựa chọn Bài 4–5 (sau rà soát):** Bài 4: 10/12 lựa chọn có loa (thiếu 姐姐 — không xuất hiện trong hội thoại; 三个 — không xuất hiện); Bài 5 câu in: 5/12 có loa (thiếu 不、不会、星期三、星期六、上班、名字、工作 — không xuất hiện nguyên từ trong hội thoại của bài; đoạn của 星期日 từng bị gán nhầm sang 星期三 ở bản đầu của lượt rà soát, đã đính chính ở contentVersion 20261101-lesson6-2 sau QA vòng 2); 5 câu tổng hợp tr.033: 20/25 lượt lựa chọn có loa (từ 6月22号 không có đoạn riêng). Mọi đoạn bổ sung đều là token nguyên từ trong track hội thoại của bài, căn bằng ASR (`asr-draft`, chưa nghe kiểm chứng). Tổng toàn app: 76/90 lựa chọn có loa.

## Bài 6 — 你的手机号是多少？ (01/11/2026)

- **Textbook tr. in 035–042 (PDF 50–57)**, đọc trực quan: mục tiêu bài (nghe hiểu số điện thoại và dùng số để gọi điện; dùng hai hoặc nhiều cụm động từ để nói mục đích/cách thức; động từ năng nguyện 想； từ nghi vấn 怎么 hỏi cách thức). Khởi động ghép từ–hình （手机、晚饭、超市、牛奶、出租车、米饭）; 3 hội thoại (track 6-1 ở trường — hai câu đọc số điện thoại từng chữ số, số 1 đọc yāo, đối chiếu phóng to trang in 036; 6-3 ở lớp sau giờ học — câu hỏi nghe hiểu in ở tr.037; 6-5 ở nhà bàn bữa tối cuối tuần — câu hỏi in ở tr.038); 3 bảng từ mới 6-2/6-4/6-6 (22 từ + tên riêng 西安饭店）; 3 điểm 小语讲堂 （能愿动词“想” tr.038 / 连动句（1) tr.040 / 疑问代词“怎么” tr.041) kèm ví dụ nguyên văn. Bài tập tổng hợp tr.041: chọn từ điền trống (ngân hàng 多少/买/米饭/坐/去， 4 câu 5 chỗ trống) chuyển thành 5 câu chấm tự động ngay từ đầu theo tiền lệ lượt rà soát Bài 5; dùng hình để nói （041–042, 4 khung câu) thành bài tự luyện không chấm (st-l06-03). Hoạt động lớp tr.042 (điền bảng bữa sáng) và video không thuộc phạm vi app.
- **Workbook tr. in 031–032 (PDF 38–39)**, đọc trực quan: phát âm (track 6-1) — 儿化 (bảng 6 cặp 这/哪/画/盖/个/眼 + 8 từ kèm hình) và quy tắc viết 隔音符号 (tr.032); 听读练 (track 6-2, tr.032): bài 1 chọn âm tiết đôi nghe được (6 cặp in sẵn), bài 2 phân biệt dạng nhi hóa/không nhi hóa (6 cặp). 模拟测练 từ tr.033 không đưa vào bài (D15).
- **Lời đọc đăng lại (Scribd 1067878415)**: phần Bài 6 ở trang in 016 (báo cáo đối chiếu đầy đủ về sau; ghi nhận trước đó là 014 đã được thay bằng số này) — 6 âm tiết đôi được đọc của 听读练 bài 1: nàbiān, dōngxi, chāoshì, wǎnfàn, shǒujī, diànhuà; tài liệu cũng ghi dãy đọc phát âm （这儿、那儿、面条儿 — trích đoạn được đọc có giới hạn trang xem). Bảng nhi hóa trong tài liệu này ghi 盖儿 gàr / 个儿 gèr, trong khi Workbook in gàir / gèr — app theo bản in của Workbook; đã đối chiếu lại ảnh trang in 031 và dữ liệu app （盖儿 gàir, 个儿 gèr) là đúng bản in, nay có test hồi quy khóa hai dạng này. Tài liệu KHÔNG liệt kê đáp án cho bài 2 (phân biệt nhi hóa) — phần lời đọc của tài liệu kết thúc ở dãy phát âm, và trong Workbook bài 2 là bài đọc theo → bài 2 giữ `unverified`, không chấm tự động. **Tài liệu đáp án đăng lại (Scribd 1077395370)**: mục 听读练 Bài 6 chỉ liệt kê số thứ tự trống — không in đáp án cho cả hai bài; có in đáp án 模拟测练 Bài 6 (nghe 1–10: B A B A A C C D A B; đọc 11–20: A B A D C B C D D B) — chỉ ghi nhận cho hồ sơ, phần này không vào app theo D15. Cả hai là bản đăng lại, không phải đáp án chính thức NXB; quyền vẫn `unknown`.
- **Audio**: 8 track tải từ CDN Baulchino đúng ký hiệu in trong sách (TB 06-1..06-6, WB 06-1/06-2), thời lượng ffprobe ghi trong dữ liệu (track Workbook 06-3 của phần mô phỏng không dùng); căn đoạn bằng ASR local (faster-whisper; riêng track từ mới 06-4 phải chạy thêm bản không-VAD và cắt đoạn cuối track để lấy 些/牛奶） — mọi đoạn `asr-draft`, chưa nghe kiểm chứng bởi người. Độ phủ Bài 6: câu 14/14, từ mới 22/22, từ nền 11/13 （盖儿/个儿 không tách được token tin cậy trong hai lượt ASR), lựa chọn 30/37 (mọi lựa chọn của 5 câu tổng hợp đều có loa vì ngân hàng từ được đọc nguyên từ trong hội thoại; lựa chọn in còn thiếu: 现在/今天/菜/面条儿和牛奶/吃早饭/吃午饭/面条儿 — không xuất hiện nguyên dạng trong hội thoại của bài).
- **Thay đổi mã chấm kèm theo:** chế độ chấm 'syllable' nay so khớp cả dãy thanh điệu theo từng âm tiết (trước đây gộp một thanh duy nhất) vì các cặp Bài 6 khác nhau ở thanh của âm tiết thứ hai (dōngxi ≠ dōngxī; shǒujī ≠ shǒují). Có test hồi quy ở tests/lesson6.test.mjs; các bài 1–5 (âm tiết đơn) không đổi hành vi.
- **Hán–Việt Bài 6**: tra từng chữ ở Thi Viện 2026-11-01 (lối /whv/); chọn theo pinyin của bài: 手 THỦ, 机 CƠ, 电 ĐIỆN, 话 THOẠI, 明 MINH, 去 KHỨ, 哪 NA, 想 TƯỞNG, 超 SIÊU, 市 THỊ, 买 MÃI, 东 ĐÔNG, 西 TÂY, 牛 NGƯU, 奶 NÃI, 吃 CẬT (ghi chú âm ít gặp), 晚 VÃN, 那 NA, 边 BIÊN, 包 BAO, 非 PHI, 常 THƯỜNG, 米 MỄ, 怎 CHẨM (ghi chú âm ít gặp), 坐 TỌA, 出 XUẤT, 租 TÔ, 车 XA; 号/些/儿/天/饭/子 dùng lại âm đã chốt ở Bài 5 （些 TA có ghi chú là cùng chữ trong 一些）. 22/22 `verified-editorial`; tổng toàn app 110/110.
