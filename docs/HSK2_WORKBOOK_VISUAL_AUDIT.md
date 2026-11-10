# Kiểm kê thị giác Workbook HSK 2 — tái dựng phần nghe thành giao diện tương tác

Ngày kiểm kê: 2026-11-10. Nguồn: `hsk-course-2-workbook.pdf` (bản scan Hoa tải lên, sha256 `cbf06e6e…`, 227,8 MB) — chỉ đối chiếu nội bộ, không commit PDF vào repo.

## 1. Tổng quan sách

- 《新HSK教程 2 学练手册》 (New HSK Course 2 Workbook), FLTRP, ISBN 978-7-5213-7178-9.
- **176 trang PDF**; trang PDF = trang in + 7. Bản scan chỉ có lớp ảnh (không có lớp chữ) — mọi nội dung phải đọc trực tiếp từ ảnh trang; OCR tự động không đáng tin, các mục đọc bằng mắt trong tài liệu này đều ghi rõ trang đối chiếu.
- Cấu trúc: 15 bài (mỗi bài 10 trang in, bài n bắt đầu ở trang in (n−1)×10+1) + đề mô phỏng cuối sách 模拟测试 HSK（二级） từ trang in 151 đến hết (trang in 169).
- Mỗi bài gồm: 小语讲堂 (một、汉字 — đã có khu vực luyện viết riêng của dự án; hai、字词拓展） và 模拟测练 （一、听力 / 二、阅读 / 三、写作）. Tài liệu này và khu vực "Nghe Workbook" chỉ xử lý **一、听力**.

## 2. Phần nghe mỗi bài — cấu trúc thống nhất (đã kiểm chứng Bài 1, 2, 15; các bài còn lại theo cùng khuôn, kiểm chứng ở mức trang khi biên soạn từng bài)

Phần nghe nằm ở trang in +3 đến +5 của mỗi bài (Bài 1: tr. 003–005), gồm **10 câu hỏi + 3 ví dụ mẫu in sẵn**, chia 3 phần:

| Phần | Dạng | Số câu | Nội dung in trên trang | Chỉ có trong audio |
|---|---|---|---|---|
| 第一部分 Part I | Nghe một câu, chọn hình đúng (3 hình A/B/C cho mỗi câu) | 1–3 | 3 bộ hình + ví dụ mẫu （我每天坐公交车去上班。→ A) | Câu nói của từng câu |
| 第二部分 Part II | Nghe hội thoại, chọn hình khớp nhất trong **một bộ 4 hình A–D dùng chung** cho cả 3 câu | 4–6 | Bộ 4 hình + ví dụ mẫu （你喜欢什么运动？/我最喜欢踢足球。→ D) | 3 hội thoại |
| 第三部分 Part III | Nghe hội thoại, chọn đáp án chữ A/B/C | 7–10 | 3 lựa chọn chữ/câu (kèm Pinyin + nghĩa tiếng Anh trong sách) + ví dụ mẫu đầy đủ | Hội thoại + câu hỏi |

- Ví dụ mẫu của Part I và Part II **giống hệt nhau ở cả 15 bài** (cùng ảnh xe buýt/máy bay/xe đạp; cùng ví dụ bóng đá) — vẽ một lần, dùng chung.
- Hình trong sách là **ảnh chụp** (không phải tranh vẽ): ảnh phương tiện, cảnh sinh hoạt, người thật. Khi tái dựng: vẽ lại thành minh họa phẳng theo chuẩn hình của dự án (quy tắc 2026-11-01) — giữ đúng đối tượng, số lượng, hành động và quan hệ cần thiết cho đáp án; mỗi câu chỉ một đáp án đúng rõ ràng.
- Ước tính số hình cần vẽ cho 15 bài: mỗi bài 9 hình Part I + 4 hình Part II = 13 hình riêng; cộng 3 hình ví dụ dùng chung → **≈198 hình**. Đề mô phỏng cuối sách có bộ hình riêng (kiểm kê riêng khi làm tới).

## 3. Audio và đáp án — nguồn và mức tin cậy

- Sách in **không có** đáp án và **không có** lời đọc （录音原文） ở cuối sách (đã kiểm tra đến trang cuối, tr. in 169 = bìa sau ở PDF 176). Đáp án chính thức nằm ở tài liệu giáo viên/nền tảng số của NXB — dự án không có nguồn này.
- Audio phần nghe có trên Baulchino (trang New HSK Audios 2026, mục "HSK 2 WORKBOOK"): **mỗi bài đúng 1 track** chứa toàn bộ phần nghe của bài (Bài 1: 9:02), phát trực tuyến qua CDN, cộng 1 file đề mô phỏng cuối sách:
  - Bài n: `https://cdn.baulchino.com/new-hsk-books-audios/hsk-2-workbook/lesson-NN/NN-1.mp3` (NN có số 0 đệm; đã kiểm tra HTTP 200 với Bài 1).
  - Đề cuối sách: `https://cdn.baulchino.com/new-hsk-books-audios/hsk-2-workbook/mock-test-hsk2.mp3`.
- Quy trình lấy nội dung câu hỏi: ASR (faster-whisper, bản máy) trên track của bài → đọc hiểu ngữ nghĩa đối chiếu với các lựa chọn in trong sách → suy ra đáp án. Vì vậy:
  - **Đáp án là đáp án suy ra từ audio, không phải đáp án chính thức của NXB** — giao diện và tài liệu phải ghi rõ điều này.
  - Mốc đoạn (start/end) là mốc căn bằng tín hiệu máy, trạng thái `asr-draft`, chưa có người nghe kiểm chứng — theo đúng chuẩn của toàn dự án.
  - Câu nào ASR không rõ hoặc đáp án không suy ra chắc chắn: đánh dấu cần xác minh, không đoán (chưa gặp ở Bài 1).

## 4. Kiểm kê chi tiết Bài 1 (bài thí điểm) — tr. in 003–005 (PDF 10–12), track `01-1.mp3`

Track gồm đúng phần nghe (mở đầu là lời giới thiệu NXB + tiêu đề bài), mỗi câu đọc 2 lần. Mốc dưới đây là khoảng phát của câu (cả hai lượt đọc), trạng thái asr-draft.

### Part I — nghe câu, chọn hình (ví dụ: 我每天坐公交车去上班。→ A xe buýt; hình ví dụ: A xe buýt, B máy bay, C xe đạp)

| Câu | Câu nghe (từ audio) | A | B | C | Đáp án | Mốc (giây) |
|---|---|---|---|---|---|---|
| 1 | 他是坐火车来的。 | Tàu cao tốc | Nhiều taxi | Xe buýt chiều tối | A | 79.0–89.1 |
| 2 | 他们是来帮忙的。 | Bạn bè cụng ly bên bàn ăn | Bánh sinh nhật thổi nến | Hai phụ nữ dọn nhà | C | 97.2–105.3 |
| 3 | 我今天请朋友们来我家玩儿。 | Nhóm đạp xe | Bạn bè quây quần ăn uống tại nhà | Nhảy múa ngoài trời | B | 114.0–124.3 |

### Part II — nghe hội thoại, chọn hình trong bộ chung (ví dụ: 你喜欢什么运动？/我最喜欢踢足球。→ D)

Bộ hình chung: A — nhân viên phục vụ ghi món cho một cặp khách trong nhà hàng; B — người đàn ông chụp ảnh skyline thành phố bên sông; C — hai người bắt tay giới thiệu trong văn phòng; D — cô gái áo đỏ tâng bóng đá.

| Câu | Hội thoại (tóm tắt nguyên văn từ audio) | Đáp án | Mốc (giây) |
|---|---|---|---|
| 4 | 我介绍一下，这是李岳。/ 认识你很高兴。 | C | 176.9–192.3 |
| 5 | 你好，请给我一杯牛奶。/ 对不起，先生，我们店里没有牛奶。 | A | 205.5–224.5 |
| 6 | 王老师，我想请您帮个忙。/ 真不好意思，我不在北京，已经到上海了。 | B | 237.0–258.5 |

### Part III — nghe hội thoại, chọn đáp án chữ (ví dụ in sẵn: hội thoại xin viết 姓名 → câu hỏi 女的要写什么？→ A 姓名）

| Câu | Câu hỏi nghe được | A | B | C | Đáp án | Mốc (giây) |
|---|---|---|---|---|---|---|
| 7 | 女的要去哪儿？(cô ấy hỏi đường tới 果果饭店） | 饭店 | 超市 | 学校 | A | 326.4–362.1 |
| 8 | 他们明年想去哪儿？(đã đi 西安、北京； sang năm muốn đi 上海） | 北京 | 上海 | 西安 | B | 376.9–408.5 |
| 9 | 男的让女的做什么？(bố đã mua rau, bảo con về phòng học) | 学习 | 下班 | 买菜 | A | 423.9–463.4 |
| 10 | 女的想什么时候去看电影？(cô ấy quá bận, hẹn 星期天） | 今天 | 明天 | 星期天 | C | 479.3–528.7 |

## 4b. Manifest hình Bài 1 (theo chuẩn D19: truy vết + quyền từng hình)

Quy trình chung: mô tả cảnh từ ảnh gốc trong sách (đọc trực tiếp trang scan) → sinh tranh phẳng bằng công cụ tạo ảnh của dự án → người biên soạn xem lại từng hình, đối chiếu đối tượng/số lượng/hành động với ảnh gốc (1 hình phải sinh lại: wb-p2-soccer — bản đầu sai tư thế tâng bóng) → tối ưu WebP 880px, chất lượng 78. Trạng thái quyền của từng hình vẽ mới: hình gốc là sáng tạo mới của dự án (không dùng ảnh scan khi phát hành); quyền của câu hỏi/nội dung/audio vẫn `unknown` như mục 6.

| File | Trang sách | Ảnh gốc mô tả | Đáp án liên quan |
|---|---|---|---|
| wb-ex-bus.webp | tr.003 | Xe buýt trắng nhìn ngang (ảnh ví dụ) | VD Part I — A |
| wb-ex-plane.webp | tr.003 | Máy bay chở khách cất cánh (ảnh ví dụ) | VD Part I — B |
| wb-ex-bike.webp | tr.003 | Xe đạp địa hình nhìn ngang (ảnh ví dụ) | VD Part I — C |
| wb-q1-train.webp | tr.003 | Tàu cao tốc tại ga, dây điện trên cao | Câu 1 — A (đáp án) |
| wb-q1-taxis.webp | tr.003 | Bãi nhiều taxi vàng-xanh từ trên cao | Câu 1 — B |
| wb-q1-bus.webp | tr.003 | Xe buýt xanh-trắng trên đường lúc chạng vạng | Câu 1 — C |
| wb-q2-dinner.webp | tr.003 | Nhóm bạn cụng ly quanh bàn ăn | Câu 2 — A |
| wb-q2-birthday.webp | tr.003 | Bánh sinh nhật, cô gái thổi nến | Câu 2 — B |
| wb-q2-cleaning.webp | tr.003 | Hai phụ nữ dọn nhà (lau sàn, lau cửa) | Câu 2 — C (đáp án) |
| wb-q3-cycling.webp | tr.004 | Nhóm người đạp xe thể thao ngoài trời | Câu 3 — A |
| wb-q3-home.webp | tr.004 | Bạn bè ăn uống, cười nói tại nhà | Câu 3 — B (đáp án) |
| wb-q3-dancing.webp | tr.004 | Nhóm người nhảy múa ngoài trời | Câu 3 — C |
| wb-p2-restaurant.webp | tr.004 | Phục vụ ghi món cho cặp khách trong nhà hàng | Part II — A (đáp án câu 5) |
| wb-p2-skyline.webp | tr.004 | Người đàn ông chụp skyline thành phố bên sông | Part II — B (đáp án câu 6) |
| wb-p2-office.webp | tr.004 | Hai người bắt tay giới thiệu trong văn phòng | Part II — C (đáp án câu 4) |
| wb-p2-soccer.webp | tr.004 | Cô gái áo đỏ tâng bóng đá | Part II — D (đáp án ví dụ) |

Ghi chú mốc đoạn (bổ sung sau QA vòng 1): ASR có VAD đã bỏ sót lượt đọc hai của câu 8 và ví dụ Part III; đã khôi phục bằng phân tích năng lượng tín hiệu + ASR lại không VAD trên cửa sổ hẹp — cả hai lượt đọc đều tồn tại và khớp nội dung; mốc đã mở rộng cho trọn (câu 8: tới 408.5 — gồm cả lượt đọc hai của câu hỏi ở 405–408, sau một khoảng lặng ngắn; ví dụ Part III: tới 307.8). Trạng thái vẫn asr-draft.

Tổng hình cần vẽ cho Bài 1: **16 hình** (3 ví dụ Part I + 9 Part I + 4 Part II). Lời thoại đầy đủ kèm Pinyin của 10 câu + 3 ví dụ nằm trong dữ liệu `wbListening` của bài (data/content.json), nguồn ghi `src-hsk2-workbook-pdf` + track Baulchino.

## 5. Danh sách trang đã phân tích trực tiếp

- Toàn sách ở mức cấu trúc: bìa, 使用说明 (PDF 5–6), trang đầu/cuối.
- Bài 1: PDF 8, 10, 11, 12 (tr. in 001, 003, 004, 005) — kiểm kê từng câu ở mục 4.
- Bài 2: PDF 20 (tr. in 013); Bài 15: PDF 150 (tr. in 143) — xác nhận khuôn Part I và ví dụ dùng chung.
- Đề mô phỏng cuối sách: PDF 160, 168, 174 (tr. in 153, 161, 167) — xác nhận đề có phần nghe chọn hình riêng và phần viết; kiểm kê chi tiết để sau.
- Các trang còn lại của từng bài sẽ được đọc trực tiếp khi biên soạn bài đó (mỗi bài một lượt theo quy trình biên soạn → QA độc lập → phát hành), không kiểm kê suy đoán hàng loạt.

## 6. Quyền sử dụng

Quyền tái xuất bản nội dung sách và audio vẫn là `unknown` như toàn dự án: PDF/MP3 không commit vào repo; audio phát trực tuyến từ Baulchino; hình là tranh vẽ lại mới kèm manifest nguồn gốc. Việc vẽ lại hình không thay đổi trạng thái quyền của câu hỏi/nội dung/audio — ba lớp này vẫn phải ghi rõ khi phát hành.
