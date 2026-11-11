# Kiểm kê thị giác Workbook HSK 2 — tái dựng 模拟测练 (nghe + đọc + viết) thành giao diện tương tác

Ngày kiểm kê: 2026-11-10. Nguồn: `hsk-course-2-workbook.pdf` (bản scan Hoa tải lên, sha256 `cbf06e6e…`, 227,8 MB) — chỉ đối chiếu nội bộ, không commit PDF vào repo.

## 1. Tổng quan sách

- 《新HSK教程 2 学练手册》 (New HSK Course 2 Workbook), FLTRP, ISBN 978-7-5213-7178-9.
- **176 trang PDF**; trang PDF = trang in + 7. Bản scan chỉ có lớp ảnh (không có lớp chữ) — mọi nội dung phải đọc trực tiếp từ ảnh trang; OCR tự động không đáng tin, các mục đọc bằng mắt trong tài liệu này đều ghi rõ trang đối chiếu.
- Cấu trúc: 15 bài (mỗi bài 10 trang in, bài n bắt đầu ở trang in (n−1)×10+1) + đề mô phỏng cuối sách 模拟测试 HSK（二级） từ trang in 151 đến hết (trang in 169).
- Mỗi bài gồm: 小语讲堂 (một、汉字 — đã có khu vực luyện viết riêng của dự án; hai、字词拓展） và 模拟测练 （一、听力 / 二、阅读 / 三、写作）. **Đúng 30 câu mỗi bài** (nghe 10, đọc 14, viết 6). Phạm vi xử lý: D39/D40 (2026-11-10) chỉ dựng 一、听力 của Bài 1–2; **D41 (2026-11-10, Hoa chỉ đạo) bổ sung 二、阅读 + 三、书写 cho Bài 1–2 để đủ 30 câu** — kiểm kê ở mục 4d/4e dưới đây. Từ Bài 3 trở đi, mỗi bài dựng đủ 30 câu ngay từ đầu — **D42 (2026-11-11): Bài 3 đã dựng đủ 30 câu trong một lượt**, kiểm kê ở mục 4g.

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

## 4c. Kiểm kê chi tiết Bài 2 — tr. in 013–015 (PDF 20–22), track `02-1.mp3`

Track dài 560,8 giây (đo bằng ffprobe; whisper báo 562,1), gồm đúng phần nghe của Bài 2, mỗi câu đọc 2 lần. Mốc là khoảng phát của câu (cả hai lượt đọc), trạng thái asr-draft. Bài học QA của Bài 1 tái xuất hiện: lượt đọc hai của câu 1 bị ASR có VAD bỏ sót — đã khôi phục bằng phân tích envelope tín hiệu + ASR lại không VAD trên cửa sổ hẹp (lượt hai ở 85,7–89,2, nội dung khớp lượt một) trước khi chốt mốc.

### Part I — nghe câu, chọn hình (ví dụ dùng chung cả 15 bài: 我每天坐公交车去上班。→ A; mốc trên track Bài 2: 57,0–66,5)

| Câu | Câu nghe (từ audio) | A | B | C | Đáp án | Mốc (giây) |
|---|---|---|---|---|---|---|
| 1 | 教室里有十多名学生。 | Lớp học đang có giờ học, hơn mười học sinh | Phòng học trống | Học sinh chạy chơi trước cổng trường | A | 80,3–89,7 |
| 2 | 我们还是开车去吧。 | Cô gái vẫy taxi vàng | Xe buýt hai tầng đỏ | Phụ nữ tự lái ô tô | C | 98,0–105,9 |
| 3 | 王老师的儿子六岁多了。 | Ông lão chạy bộ trong công viên | Người đàn ông thuyết trình | Bé trai vẽ tranh ở giá vẽ | C | 113,9–123,4 |

### Part II — nghe hội thoại, chọn hình trong bộ chung (ví dụ dùng chung: 你喜欢什么运动？/我最喜欢踢足球。→ D; mốc trên track Bài 2: 143,7–157,3)

Bộ hình chung của Bài 2: A — hộp bỏng ngô lớn và tay cầm điện thoại thông minh, phía sau là ghế rạp chiếu phim; B — người đàn ông mặc vest bên chiếc taxi vàng đang mở cửa ở bến; C — người đàn ông đeo kính ngồi ở bàn giáo viên trong lớp học đọc giấy tờ, laptop trên bàn; D — cô gái áo đỏ tâng bóng đá bằng đầu gối.

| Câu | Hội thoại (nguyên văn từ audio) | Đáp án | Mốc (giây) |
|---|---|---|---|
| 4 | 我们还是打车去吧？/ 好，打车能早一点到。 | B | 175,7–192,1 |
| 5 | 电影票贵不贵？/ 不太贵，我是在网上买的。 | A | 204,8–219,7 |
| 6 | 老师，您在哪儿？我有事找您。/ 我在教室，你过来吧。 | C | 233,4–253,3 |

### Part III — nghe hội thoại, chọn đáp án chữ (ví dụ dùng chung: hội thoại xin viết 姓名 → A; mốc trên track Bài 2: 277,5–302,2)

| Câu | Câu hỏi nghe được | A | B | C | Đáp án | Mốc (giây) |
|---|---|---|---|---|---|---|
| 7 | 他们现在在哪儿？(chờ hơn 20 phút, xe buýt chưa tới, định chuyển sang taxi) | 公交站 | 出租车里 | 公交车上 | A | 323,3–353,1 |
| 8 | 明天他们吃什么？(hôm nay ăn cơm với món đã mua; ngày mai mới ăn sủi cảo) | 菜 | 米饭 | 饺子 | C | 368,6–401,7 |
| 9 | 男的让女的下次怎么去北京大学？(lần này đi xe buýt; Bắc Đại xa, lần sau nên đi taxi) | 打车 | 坐火车 | 坐公交车 | A | 417,7–475,4 |
| 10 | 谁去接孩子了？(mẹ có việc bận, bố đã đi đón) | 爸爸 | 妈妈 | 老师 | A | 491,9–546,7 |

### Manifest hình Bài 2 (theo chuẩn D19 — 13 hình mới; 3 hình ví dụ Part I và hình ví dụ Part II dùng lại của Bài 1)

Quy trình như mục 4b: mô tả cảnh từ ảnh gốc trong sách → sinh tranh phẳng → xem lại từng hình đối chiếu đối tượng/số lượng/hành động. Cả 13 hình đạt ngay lần sinh đầu, không hình nào phải sinh lại. Kích thước phát hành: WebP 880px, chất lượng 78 (21–52 KB/hình).

| File | Trang sách | Ảnh gốc mô tả | Đáp án liên quan |
|---|---|---|---|
| wb-q1-classroom.webp | tr.013 | Lớp học đang giờ học: giáo viên giảng bài, học sinh ngồi ở bàn | Câu 1 — A (đáp án) |
| wb-q1-empty.webp | tr.013 | Phòng học trống, dãy bàn ghế ngay ngắn | Câu 1 — B |
| wb-q1-schoolyard.webp | tr.013 | Nhóm học sinh chạy chơi trước cổng trường | Câu 1 — C |
| wb-q2-hail.webp | tr.013 | Cô gái giơ tay vẫy chiếc taxi vàng bên đường | Câu 2 — A |
| wb-q2-bus.webp | tr.013 | Xe buýt hai tầng đỏ, sọc xanh bên hông | Câu 2 — B |
| wb-q2-driving.webp | tr.013 | Phụ nữ ngồi trong ô tô, hai tay cầm vô lăng | Câu 2 — C (đáp án) |
| wb-q3-jogging.webp | tr.014 | Ông lão tóc bạc chạy bộ trong công viên lá thu | Câu 3 — A |
| wb-q3-lecture.webp | tr.014 | Người đàn ông mặc vest thuyết trình trước màn hình, người nghe ngồi dưới | Câu 3 — B |
| wb-q3-painting.webp | tr.014 | Bé trai đứng trước giá vẽ ngoài trời, cầm bảng màu | Câu 3 — C (đáp án) |
| wb-p2-cinema.webp | tr.014 | Cận cảnh hộp bỏng ngô và tay cầm điện thoại thông minh | Part II — A (đáp án câu 5) |
| wb-p2-taxi.webp | tr.014 | Người đàn ông mặc vest đứng cạnh cửa taxi vàng đang mở | Part II — B (đáp án câu 4) |
| wb-p2-desk.webp | tr.014 | Người đàn ông đeo kính ngồi ở bàn trong lớp đọc giấy tờ, laptop trên bàn | Part II — C (đáp án câu 6) |
| wb-p2-soccer.webp | tr.014 | Cô gái áo đỏ tâng bóng đá | Part II — D (đáp án ví dụ) |

## 4d. Kiểm kê Đọc + Viết Bài 1 — tr. in 006–010 (PDF 13–17) (D41)

Đọc trực tiếp từng trang; ô 田字格 của phần Viết Part I đọc ở bản phóng 300 dpi để xác định đúng phần chữ đã hiện/thiếu. Đáp án là biên tập (sách không in đáp án), trạng thái `verified-editorial`. KHÁC phần nghe: trang Đọc/Viết **in sẵn pinyin** trên chữ Hán — giao diện hiện pinyin như sách in (quyết định thiết kế D41; quy tắc không-hiện-pinyin-của-D23 chỉ áp cho phần nghe).

### 二、阅读 Reading

**Part I — chọn hình khớp câu (tr. in 006).** Bộ 4 hình chung: A — tay viết chữ Phúc thư pháp trên giấy đỏ （字）; B — gia đình đi trong sân bay （旅游）; C — nhóm người bắt tay giới thiệu （介绍朋友）; D — chàng trai rê bóng rổ. Ví dụ: 每个星期六，我都去打篮球。→ **D**.

| Câu | Câu in | Đáp án | Căn cứ ngắn |
|---|---|---|---|
| 11 | 我们是来旅游的。 | **B** | 来旅游 — gia đình mang hành lí ở sân bay |
| 12 | 我给你介绍几个新朋友。 | **C** | 介绍新朋友 — cảnh bắt tay giới thiệu trong nhóm |
| 13 | 天中，请你说一下这个字的意思。 | **A** | 这个字 — chữ Phúc thư pháp trên giấy đỏ |

**Part II — chọn từ điền trống (tr. in 007).** Khung: A 次 cì · B 懂 dǒng · C 给 gěi · D 不好意思 bù hǎoyìsi · E 完 wán. Ví dụ: 题太多了，所以我没做（　）。→ **E （完）**.

| Câu | Câu in (chỗ trống __) | Đáp án | Căn cứ ngắn |
|---|---|---|---|
| 14 | 我是昨天 __ 妈妈打的电话。 | **C 给** | 是……的： 是昨天给妈妈打的电话 |
| 15 | 这已经是我第三 __ 来西安旅游了。 | **A 次** | 第三 + lượng từ lần 次 |
| 16 | 女：这几个字的意思我都不 __。/ 男：我们去找老师问一下吧。 | **B 懂** | 都不懂 nên đi hỏi thầy |
| 17 | 男：__，我家里有点儿事，今天不能去了。/ 女：好的，那你就明天再来吧。 | **D 不好意思** | lời xin lỗi mở đầu khi không đến được |

→ Cả 5 từ trong khung đều được dùng đúng một lần (ví dụ dùng E, 4 câu dùng A–D) — không có từ thừa.

**Part III — nối câu (tr. in 008).** Khung: A 不是，我是来上学的。· B 不客气，有事就给我打电话。· C 王老师，她说这儿的饺子非常好吃。· D 我爸爸，他是中国人。· E 他出去了，一会儿就回来。Ví dụ: 请问李老师在吗？→ **E**.

| Câu | Câu hỏi in | Đáp án | Căn cứ ngắn |
|---|---|---|---|
| 18 | 你是来旅游的吧？ | **A** | phủ định: 不是，我是来上学的 |
| 19 | 是谁给你介绍的这家饭店？ | **C** | người giới thiệu là 王老师 (khen 饺子 của quán) |
| 20 | 谢谢你这几天都来帮忙。 | **B** | đáp lời cảm ơn bằng 不客气 |
| 21 | 是谁让你学中文的？ | **D** | 我爸爸 (bố bảo học) |

→ Cả 5 câu trong khung đều được dùng (ví dụ dùng E, 4 câu dùng A–D) — **không có câu nhiễu thừa** ở bài này (khác dự đoán ban đầu "một câu thừa"; kết luận theo ngữ nghĩa từng cặp).

**Part IV — đọc đoạn chọn đáp án (tr. in 009; lựa chọn in kèm pinyin, ví dụ in thêm nghĩa tiếng Anh).** Ví dụ: 我爱跳舞，但跳得不太好。★他：→ **B 喜欢跳舞**.

| Câu | Đoạn + câu hỏi | Đáp án | Căn cứ ngắn |
|---|---|---|---|
| 22 | 到了西安，朋友来接我们，还给我们介绍了一家饭店。我们开车去了那里，菜都很好吃。★朋友介绍了什么？ | **B 饭店** | đoạn ghi rõ 介绍了一家饭店 |
| 23 | 我在北京旅游的时候，一雪姐请我吃了烤鸭，还给我介绍了很多东西。现在，我们已经是好朋友了。★他在北京旅游时，一雪： | **A 请他吃饭** | 请我吃了烤鸭 = mời ăn |
| 24 | 我家在北京，我爸爸现在在上海工作，他让我和妈妈这个星期六坐火车去上海看他。爸爸说，他会接我们。★爸爸现在在哪儿工作？ | **B 上海** | 爸爸现在在上海工作 |

### 三、书写 Writing (tr. in 010; mục 汉字 của bài ở tr. in 001 dạy 提手旁 扌 và 两点水 冫）

**Part I — ghép bộ phận thành chữ.** Khung: A 冫 · B 纟 · C 忄 · D 十 (đọc ở 300 dpi). Ví dụ: 什么 — ô 什 hiện 亻， thiếu 十 → **D**.

| Câu | Từ + ô thiếu | Đáp án | Căn cứ ngắn |
|---|---|---|---|
| 25 | 不懂 — ô 懂 hiện 董 | **C 忄** | 懂 = 忄 + 董 |
| 26 | 给他 — ô 给 hiện 合 | **B 纟** | 给 = 纟 + 合 |
| 27 | 两次 — ô 次 hiện 欠 | **A 冫** | 次 = 冫 + 欠 |

→ Cả 4 bộ phận đều được dùng (ví dụ D, câu C/B/A).

**Part II — viết chữ theo pinyin.** Ví dụ: 你想喝茶还（是）喝咖啡？— **是** shì.

| Câu | Câu in (pinyin trên chỗ trống) | Chữ viết | Căn cứ ngắn |
|---|---|---|---|
| 28 | 他（　）时候不吃晚饭。(yǒu) | **有** | 有时候 = thỉnh thoảng |
| 29 | 我现在（　）经到北京了。(yǐ) | **已** | 已经 = đã |
| 30 | 这个不太贵，（　）我们买这个吧。(nà) | **那** | 那……吧 = vậy thì… |

## 4e. Kiểm kê Đọc + Viết Bài 2 — tr. in 016–020 (PDF 23–27) (D41)

Cùng quy trình đọc như 4d. Ví dụ mẫu của cả 6 phần (Đọc 4 + Viết 2) giống hệt Bài 1 (sách in dùng chung), gồm cả ảnh bóng rổ D của Part I Đọc.

### 二、阅读 Reading

**Part I — chọn hình khớp câu (tr. in 016).** Bộ 4 hình chung: A — cô gái cầm bỏng ngô + vé ở rạp phim; B — phòng học dài trống, cửa sổ bên phải; C — mẹ và bé ăn ở nhà hàng; D — bóng rổ (cùng ảnh Bài 1). Ví dụ → **D**.

| Câu | Câu in | Đáp án | Căn cứ ngắn |
|---|---|---|---|
| 11 | 我和朋友去看电影了，是她买的票。 | **A** | 看电影/买票 — rạp phim |
| 12 | 这是我们的教室，但学生们都去外边玩了。 | **B** | 教室 nhưng học sinh ra ngoài — lớp trống |
| 13 | 这家饭店的菜都不贵，一个菜十多块钱，还很好吃。 | **C** | món của 饭店 — bàn ăn nhà hàng |

**Part II — chọn từ điền trống (tr. in 017).** Khung: A 万 wàn · B 远 yuǎn · C 教室 jiàoshì · D 车站 chēzhàn · E 完 wán. Ví dụ (giống Bài 1) → **E**.

| Câu | Câu in (chỗ trống __) | Đáp án | Căn cứ ngắn |
|---|---|---|---|
| 14 | 下课了，但外边下雨了，我还是在 __ 里看书吧。 | **C 教室** | ở lại trong lớp đọc sách |
| 15 | 那个 __ 没有到北京大学的公交车。 | **D 车站** | bến xe |
| 16 | 女：我让一雪来接我们吧。/ 男：一雪家有点儿 __，别让她来接我们了。 | **B 远** | nhà hơi xa |
| 17 | 男：你们学校有多少学生？/ 女：有一 __ 多名中国学生，还有两千多名外国学生。 | **A 万** | 一万多名 = hơn mười nghìn |

→ Cả 5 từ đều được dùng đúng một lần.

**Part III — nối câu (tr. in 018).** Khung: A 我去找几个人过来帮忙。· B 他五岁多了。· C 天气不好，我们还是在家看电视吧。· D 我没事，你别过来了。· E 他出去了，一会儿就回来。(câu E giống hệt Bài 1). Ví dụ → **E**.

| Câu | Câu hỏi in | Đáp án | Căn cứ ngắn |
|---|---|---|---|
| 18 | 小王说你生病了，我下班后就去看你。 | **D** | người ốm đáp 我没事，你别过来了 |
| 19 | 王老师，你儿子几岁了？ | **B** | 他五岁多了 |
| 20 | 今天星期天，我们去看电影吧。 | **C** | trời xấu → ở nhà xem TV |
| 21 | 今天工作太多了。 | **A** | tìm người tới giúp |

→ Cả 5 câu đều được dùng — **không có câu nhiễu thừa** ở bài này.

**Part IV — đọc đoạn chọn đáp án (tr. in 019).** Ví dụ giống Bài 1 → **B**.

| Câu | Đoạn + câu hỏi | Đáp án | Căn cứ ngắn |
|---|---|---|---|
| 22 | 我今年要去外国上大学，我妈有个朋友在那儿工作，她让我有事就给她的朋友打电话。★他要到外国做什么？ | **B 上大学** | 要去外国上大学 |
| 23 | 我在网上认识了一个外国朋友。他九月要来北京学中文，他说到时候来西安找我玩。★外国朋友来北京做什么？ | **C 学中文** | 来北京学中文 (đi Tây An tìm bạn là việc khác) |
| 24 | 下雪天不好打车，但坐公交车太冷。爸爸说："你还是去学开车吧，开车上下班就不会冷了。"★爸爸让他： | **A 开车上班** | mục đích nêu trong đoạn: 开车上下班 |

### 三、书写 Writing (tr. in 020; mục 汉字 của bài ở tr. in 011–012 dạy 门字框 và 走之旁 辶）

**Part I — ghép bộ phận thành chữ.** Khung: A **攵** · B 辶 · C 刂 · D 十 (chữ A đọc ở 300 dpi: là 反文旁 攵， không phải 彳）. Ví dụ: 什么 — thiếu 十 → **D**.

| Câu | Từ + ô thiếu | Đáp án | Căn cứ ngắn |
|---|---|---|---|
| 25 | 很远 — ô 远 hiện 元 | **B 辶** | 远 = 元 + 辶 |
| 26 | 教室 — ô 教 hiện 孝 | **A 攵** | 教 = 孝 + 攵 |
| 27 | 别去 — ô 别 hiện 另 | **C 刂** | 别 = 另 + 刂 |

→ Cả 4 bộ phận đều được dùng.

**Part II — viết chữ theo pinyin.** Ví dụ giống Bài 1 → **是**.

| Câu | Câu in (pinyin trên chỗ trống) | Chữ viết | Căn cứ ngắn |
|---|---|---|---|
| 28 | 我是在（　）上买的电影票。(wǎng) | **网** | 在网上买 = mua trên mạng |
| 29 | 王老师在那（　）教室上课。(jiān) | **间** | lượng từ phòng 间 |
| 30 | 我们下次再过（　）看电影吧。(lái) | **来** | 过来 = qua đây |

## 4f. Manifest 8 hình Đọc Part I (D41, theo chuẩn D19)

Quy trình như mục 4b: mô tả cảnh từ bản scan → sinh tranh phẳng mới (công cụ tạo hình của Muse) → người biên soạn xem từng hình đối chiếu ảnh gốc trong sách → xuất WebP 880×587 q78 thành file riêng trong `assets/`. Cả 7 lượt sinh đều đạt ngay lần đầu (không phải sinh lại); chữ 福 trên hình thư pháp rõ và đúng nét ở mọi tờ giấy hiện đủ. Ảnh D của hai bài là **cùng một file tranh** (sách in dùng cùng một ảnh bóng rổ cho cả hai bài).

| File | Bài/vị trí | Cảnh theo ảnh gốc trong sách | Đối chiếu | Quyền |
|---|---|---|---|---|
| `wb-r1-calligraphy.webp` | Bài 1 · A | tay cầm bút lông viết chữ Phúc trên giấy đỏ, nhiều tờ Phúc xung quanh | khớp: chữ 福 rõ, đúng; nghiên mực + đèn lồng | tranh vẽ mới của dự án; ảnh gốc sách không dùng lại |
| `wb-r1-airport.webp` | Bài 1 · B | gia đình 4 người đi trong sảnh sân bay, bé kéo vali | khớp | như trên |
| `wb-r1-introduce.webp` | Bài 1 · C | nhóm người lớn trong phòng, một người bắt tay giới thiệu | khớp | như trên |
| `wb-r1-basketball.webp` | Bài 1 · D | chàng trai áo ba lỗ đen quần đỏ rê bóng rổ | khớp; dùng chung Bài 2 | như trên |
| `wb-r1-cinema.webp` | Bài 2 · A | cô gái ở sảnh rạp phim cầm bỏng ngô, ly nước, vé; sàn ô đen trắng | khớp: vé để trống không chữ | như trên |
| `wb-r1-classroom.webp` | Bài 2 · B | phòng học dài trống, cửa sổ dọc tường phải | khớp; bố cục khác hình lớp trống của phần nghe | như trên |
| `wb-r1-restaurant.webp` | Bài 2 · C | mẹ và bé ăn ở bàn nhà hàng nhiều món | khớp | như trên |
| `wb-r1-basketball.webp` | Bài 2 · D | cùng ảnh bóng rổ như Bài 1 (sách in dùng cùng ảnh) | cùng file với Bài 1 · D | như trên |

Hình phần Viết: không cần hình — bộ phận và ô chữ là ký tự chữ, dựng bằng văn bản.

## 4g. Kiểm kê chi tiết Bài 3 《我想去西安旅游》 — đủ 30 câu ngay từ đầu (D42, 2026-11-11)

Bài 3 chiếm tr. in 021–030 (PDF 28–37): mục 汉字 tr. in 021–022 dạy 三点水 氵 (ví dụ 汉、洗） và 宝盖头 宀 (ví dụ 家、完）; phần nghe tr. in 023–025, phần đọc tr. in 026–029, phần viết tr. in 030. Cả 9 ví dụ mẫu (nghe 3 + đọc 4 + viết 2) đều giống hệt Bài 1–2 như sách in dùng chung: dữ liệu ví dụ dùng lại nguyên văn của Bài 1–2, riêng cửa sổ audio của 3 ví dụ nghe được căn lại trên track Bài 3. Hai ảnh dùng chung có bản sao byte-identical trong thư mục bài: `wb-p2-soccer.webp` (Part II nghe · D — sách in dùng cùng ảnh bóng đá ở mọi bài; Bài 3 dùng bản sao của tranh Bài 1) và `wb-r1-basketball.webp` (Part I đọc · D — cùng file với Bài 1–2).

### 一、听力 — tr. in 023–025 (PDF 30–32), track `03-1.mp3`

Track dài 548,8 giây (đo bằng ffprobe), gồm đúng phần nghe của Bài 3, mỗi câu đọc 2 lần. Mốc là khoảng phát của câu (cả hai lượt đọc), trạng thái asr-draft. Kiểm tra đầy đủ bằng envelope tín hiệu (RMS trên bản WAV 16 kHz): cả 13 đơn vị (3 ví dụ + 10 câu) đều có đủ hai lượt đọc trong cửa sổ đã chốt; khác hai bài trước, ASR có VAD lần này không bỏ sót lượt đọc nào. Lưu ý biên Part III (đã hiệu chỉnh theo đo tín hiệu của QA độc lập): lượt hỏi hai của câu 7 kết thúc hẳn ở 377,1 và sau đó là im lặng tuyệt đối; dấu vết "八" ở ~376,9–378,0 trong ASR là lỗi biên của ASR — tiếng báo số câu 8 thực tế nằm ở ~391–393 giây, ngay trước cửa sổ câu 8. Cửa sổ câu 7 kết thúc 377,4 không chứa chút âm thanh báo số nào.

#### Part I — nghe câu, chọn hình (ví dụ dùng chung cả 15 bài: 我每天坐公交车去上班。→ A; mốc trên track Bài 3: 57,4–67,6)

| Câu | Câu nghe (từ audio) | A | B | C | Đáp án | Mốc (giây) |
|---|---|---|---|---|---|---|
| 1 | 爸爸回来后，和儿子一起看电视。 | Hai bố con chơi xếp gỗ trên sàn | Hai người đàn ông nấu ăn trong bếp | Hai bố con ngồi xem tivi | C | 81,2–94,4 |
| 2 | 苹果都洗好了，你想吃就自己拿。 | Người đàn ông bên xe tải chở thùng táo | Bát táo đã rửa sạch trên bàn | Đôi nam nữ chọn táo ở siêu thị | B | 102,1–115,7 |
| 3 | 他今天不想出去，想在家休息休息。 | Người đàn ông nằm nghỉ trên sofa ở nhà | Phụ nữ ngủ ở ghế phụ trong ô tô | Người vươn vai tập thể dục giữa núi | A | 122,5–137,5 |

#### Part II — nghe hội thoại, chọn hình trong bộ chung (ví dụ dùng chung: 你喜欢什么运动？/我最喜欢踢足球。→ D; mốc trên track Bài 3: 156,8–171,5)

Bộ hình chung của Bài 3: A — gian bếp gia đình: người phụ nữ ngồi ở bàn ăn nói điện thoại, em bé ngồi cạnh, người đàn ông đứng nấu ăn bên quầy bếp; B — cô gái cầm micro hát trên sân khấu rèm đỏ, một tay giơ cao; C — người đàn ông mặc vest xách cặp công tác đi bộ cùng bé gái đeo cặp sách ngoài trời; D — cô gái áo đỏ tâng bóng đá bằng đầu gối (cùng ảnh mọi bài).

| Câu | Hội thoại (nguyên văn từ audio) | Đáp án | Mốc (giây) |
|---|---|---|---|
| 4 | 饭做好了，你过来吃饭吧。/ 好，我去洗洗手。 | A | 188,8–206,5 |
| 5 | 星期天你出去玩了吗？/ 出去了，我和朋友一起去唱歌了。 | B | 218,5–237,5 |
| 6 | 每天都是您送我上学，为什么不让妈妈送我？/ 她工作太忙，没时间。 | C | 249,5–272,5 |

#### Part III — nghe hội thoại, chọn đáp án chữ (ví dụ dùng chung: hội thoại xin viết 姓名 → A; mốc trên track Bài 3: 294,9–322,3)

| Câu | Câu hỏi nghe được | A | B | C | Đáp án | Mốc (giây) |
|---|---|---|---|---|---|---|
| 7 | 他们现在在哪儿？(người bệnh viết xong mấy chữ sẽ về phòng mình nghỉ) | 书店 | 教室 | 家里 | C | 343,3–377,4 |
| 8 | 他们做什么了？(khen phim tiếng Trung hay, hỏi có nghe hiểu không) | 上课了 | 听歌了 | 看电影了 | C | 393,5–420,3 |
| 9 | 男的想吃什么？(bữa sáng có trứng, bánh mì, sữa; anh ấy hỏi còn bánh bao hôm qua không) | 鸡蛋 | 包子 | 面包 | B | 435,7–478,0 |
| 10 | 手机在哪儿？(tìm trên bàn, trên ghế đều không có; điện thoại ở ngay trong tay) | 手里 | 椅子上 | 桌子上 | A | 493,2–535,5 |

### 二、阅读 Reading — tr. in 026–029 (PDF 33–36)

**Part I — chọn hình khớp câu (tr. in 026).** Bộ 4 hình chung: A — cô gái ở bàn làm việc văn phòng trước máy tính, vươn hai tay lên cao mỉm cười; B — đôi bàn tay đầy bọt xà phòng rửa dưới vòi nước ở bồn rửa; C — đôi nam nữ ở bàn nhà hàng cùng xem thực đơn lớn; D — bóng rổ (cùng ảnh Bài 1–2). Ví dụ → **D**.

| Câu | Câu in | Đáp án | Căn cứ |
|---|---|---|---|
| 11 | 去洗洗手吧，洗完手来吃饭。 | B | 洗手 — rửa tay dưới vòi nước |
| 12 | 不到五点，她就做完工作了。 | A | Làm xong việc ở bàn văn phòng, vươn vai nhẹ nhõm |
| 13 | 这家饭店的菜很不错，你看看想吃什么。 | C | 饭店 — xem thực đơn ở nhà hàng |

**Part II — chọn từ điền trống (tr. in 027).** Khung: A 每 měi · B 自己 zìjǐ · C 这么 zhème · D 出去 chūqù · E 完 wán. Ví dụ (giống Bài 1–2) → **E**. Khung dùng hết 5/5.

| Câu | Chỗ trống | Đáp án | Căn cứ |
|---|---|---|---|
| 14 | 学校里（　）间教室都有学生在上课。 | A 每 | 每＋lượng từ 间： phòng nào cũng có học sinh |
| 15 | 我都是早上七点多（　），晚上八点多回来的。 | D 出去 | Sáng ra ngoài / tối trở về |
| 16 | 学校电影院的电影票（　）便宜啊！ | C 这么 | 这么＋tính từ: rẻ đến thế (vé chỉ hơn 20 tệ) |
| 17 | 今天下班后我（　）回去，你别来接我了。 | B 自己 | Tự mình về, đừng đến đón |

**Part III — nối câu (tr. in 028).** Khung: A 她去医院看病了。· B 我这个星期工作太多了。· C 给我吧，我去洗一洗。· D 是的，今天的菜非常好吃。· E 他出去了，一会儿就回来。(câu E giống hệt Bài 1–2). Ví dụ → **E**. Khung dùng hết 5/5 — không có câu nhiễu thừa, như Bài 1–2.

| Câu | Câu hỏi in | Đáp án | Căn cứ |
|---|---|---|---|
| 18 | 你们都吃好了吗？ | D | Đáp khẳng định: món hôm nay rất ngon |
| 19 | 家月为什么没有来上课？ | A | Cô ấy đi bệnh viện khám bệnh |
| 20 | 你看，我今天买了这么多苹果。 | C | Đưa táo đây, tôi đi rửa |
| 21 | 你为什么每天都这么晚回来啊？ | B | Tuần này quá nhiều việc |

**Part IV — đọc đoạn chọn đáp án (tr. in 029).** Ví dụ giống Bài 1–2 → **B**.

| Câu | Đoạn in (tóm tắt) | Câu hỏi | A | B | C | Đáp án |
|---|---|---|---|---|---|---|
| 22 | Đọc xong một cuốn sách hay mấy ngày nay, muốn giới thiệu cho học sinh của mình cùng đọc | 他想让谁看看那本书？ | 朋友 | 学生 | 老师 | B |
| 23 | Mua vé phim thứ Bảy định đi với bạn gái; cô ấy bận việc công ty nên đi với bạn học | 他是和谁一起看的电影？ | 自己 | 同学 | 女朋友 | B |
| 24 | Cùng bạn đến Bắc Kinh du lịch, ghé thăm Bắc Kinh Đại học; trên mạng nói có hơn 3.000 sinh viên nước ngoài học ở đó | 他到北京大学做什么？ | 旅游 | 学习 | 看朋友 | A |

### 三、书写 Writing — tr. in 030 (PDF 37); mục 汉字 của bài ở tr. in 021–022 dạy 三点水 氵 và 宝盖头 宀

**Part I — ghép bộ phận (đọc phóng 300 dpi của PDF 37).** Khung: A 辶 · B 宀 · C 氵 · D 十. Ví dụ （什么 — 什 thiếu 十） → **D**. Khung dùng hết 4/4.

| Câu | Từ | Ô thiếu | Hiện có | Đáp án | Căn cứ |
|---|---|---|---|---|---|
| 25 | 送你 | 送 | 关 | A 辶 | 送 = 辶＋关 |
| 26 | 洗手 | 洗 | 先 | C 氵 | 洗 = 氵＋先； 氵 là bộ bài này dạy (ví dụ chữ 汉、洗） |
| 27 | 写完 | 完 | 元 | B 宀 | 完 = 宀＋元； 宀 là bộ bài này dạy (ví dụ chữ 家、完）; ô 写 in đầy đủ |

**Part II — viết chữ theo pinyin.** Ví dụ giống Bài 1–2 → **是** (shì).

| Câu | Câu in | Pinyin trên trống | Chữ | Căn cứ |
|---|---|---|---|---|
| 28 | 你今天（　）什么来晚了？ | wèi | 为 | 为什么 — vì sao đến muộn |
| 29 | 外边（　）么热，我们还是回去吧。 | zhè | 这 | 这么热 — nóng thế này |
| 30 | 这个电影很（　）错，你也可以看看。 | bú | 不 | 很不错 — rất hay |

### Manifest hình Bài 3 (theo chuẩn D19 — 15 hình mới + 2 bản sao dùng chung)

Quy trình như mục 4b/4c: mô tả cảnh từ ảnh gốc trong sách → sinh tranh phẳng → người biên soạn xem từng hình đối chiếu đối tượng/số lượng/hành động/quan hệ. Cả 15 hình đạt ngay lần sinh đầu, không hình nào phải sinh lại. Kích thước phát hành: WebP 880×587 q78 (19–76 KB/hình), thư mục `assets/hsk2-lesson-03/`.

| File | Trang sách | Ảnh gốc mô tả | Đáp án liên quan |
|---|---|---|---|
| wb-q1-blocks.webp | tr.023 | Hai bố con ngồi sàn phòng khách chơi xếp gỗ | Câu 1 — A |
| wb-q1-cooking.webp | tr.023 | Hai người đàn ông nấu ăn trong bếp, một người đổ nguyên liệu từ túi | Câu 1 — B |
| wb-q1-tv.webp | tr.023 | Hai bố con ngồi sàn xem tivi, bố cầm điều khiển | Câu 1 — C (đáp án) |
| wb-q2-van.webp | tr.023 | Người đàn ông bên xe tải nhỏ chở đầy thùng táo đỏ | Câu 2 — A |
| wb-q2-bowl.webp | tr.023 | Bát táo đỏ và vàng đã rửa sạch trên bàn | Câu 2 — B (đáp án) |
| wb-q2-market.webp | tr.023 | Đôi nam nữ chọn táo ở quầy trái cây siêu thị | Câu 2 — C |
| wb-q3-sofa.webp | tr.024 | Người đàn ông nằm dài trên sofa ở nhà, tay gác sau đầu | Câu 3 — A (đáp án) |
| wb-q3-car.webp | tr.024 | Phụ nữ ngủ ở ghế phụ trong ô tô, đàn ông lái xe | Câu 3 — B |
| wb-q3-mountain.webp | tr.024 | Người vươn vai tập thể dục giữa núi lúc bình minh, bàn cắm trại bên cạnh | Câu 3 — C |
| wb-p2-kitchen.webp | tr.024 | Bếp gia đình: phụ nữ ngồi bàn ăn nói điện thoại, bé ngồi cạnh, đàn ông nấu ăn | Part II — A (đáp án câu 4) |
| wb-p2-singing.webp | tr.024 | Cô gái cầm micro hát trên sân khấu rèm đỏ | Part II — B (đáp án câu 5) |
| wb-p2-school.webp | tr.024 | Đàn ông mặc vest xách cặp đi cùng bé gái đeo cặp sách | Part II — C (đáp án câu 6) |
| wb-p2-soccer.webp | tr.024 | Cô gái áo đỏ tâng bóng đá (cùng ảnh mọi bài) | Part II — D (đáp án ví dụ); bản sao byte-identical của tranh Bài 1 |
| wb-r1-office.webp | tr.026 | Cô gái ở bàn văn phòng vươn hai tay lên cao mỉm cười | Đọc Part I — A (đáp án câu 12) |
| wb-r1-handwash.webp | tr.026 | Đôi bàn tay đầy bọt xà phòng rửa dưới vòi nước | Đọc Part I — B (đáp án câu 11) |
| wb-r1-menu.webp | tr.026 | Đôi nam nữ ở bàn nhà hàng xem thực đơn lớn | Đọc Part I — C (đáp án câu 13) |
| wb-r1-basketball.webp | tr.026 | Chàng trai áo ba lỗ đen quần đỏ rê bóng rổ (cùng ảnh Bài 1–2) | Đọc Part I — D (đáp án ví dụ); cùng file với Bài 1 · D |

Hình phần Viết: không cần hình — bộ phận và ô chữ là ký tự chữ, dựng bằng văn bản.

## 5. Danh sách trang đã phân tích trực tiếp

- Toàn sách ở mức cấu trúc: bìa, 使用说明 (PDF 5–6), trang đầu/cuối.
- Bài 1: PDF 8, 10, 11, 12 (tr. in 001, 003, 004, 005) — kiểm kê từng câu ở mục 4.
- Bài 1 Đọc + Viết (D41): PDF 13–17 (tr. in 006–010) — kiểm kê từng câu ở mục 4d; ô 田字格 đọc thêm ở bản phóng 300 dpi của PDF 17.
- Bài 2: PDF 20, 21, 22 (tr. in 013, 014, 015) — kiểm kê từng câu ở mục 4c; Bài 15: PDF 150 (tr. in 143) — xác nhận khuôn Part I và ví dụ dùng chung.
- Bài 2 Đọc + Viết + 汉字 (D41): PDF 18, 19 (tr. in 011–012, mục Hán tự) và PDF 23–27 (tr. in 016–020) — kiểm kê từng câu ở mục 4e; ô 田字格 và khung bộ phận đọc thêm ở bản phóng 300 dpi của PDF 27.
- Bài 3 đủ 30 câu (D42): PDF 28–37 (tr. in 021–030) — kiểm kê từng câu ở mục 4g; ô 田字格 và khung bộ phận đọc thêm ở bản phóng 300 dpi của PDF 37.
- Đề mô phỏng cuối sách: PDF 160, 168, 174 (tr. in 153, 161, 167) — xác nhận đề có phần nghe chọn hình riêng và phần viết; kiểm kê chi tiết để sau.
- Các trang còn lại của từng bài sẽ được đọc trực tiếp khi biên soạn bài đó (mỗi bài một lượt theo quy trình biên soạn → QA độc lập → phát hành), không kiểm kê suy đoán hàng loạt.

## 6. Quyền sử dụng

Quyền tái xuất bản nội dung sách và audio vẫn là `unknown` như toàn dự án: PDF/MP3 không commit vào repo; audio phát trực tuyến từ Baulchino; hình là tranh vẽ lại mới kèm manifest nguồn gốc. Việc vẽ lại hình không thay đổi trạng thái quyền của câu hỏi/nội dung/audio — ba lớp này vẫn phải ghi rõ khi phát hành.
