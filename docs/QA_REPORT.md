# QA_REPORT — Báo cáo kiểm thử HSK3.0

## Trạng thái hiện tại (cập nhật 01/11/2026 JST — sau PR #5, #6 và lượt hoàn thiện nghe–viết)

| Hạng mục | Trạng thái hiện tại | Ghi chú |
| --- | --- | --- |
| Bài 1 AI小语，你好！ | Đã xuất bản (PR #1–#4) | Nội dung đối chiếu bản in Textbook + Workbook |
| Bài 2 我叫李文 | Đã xuất bản (PR #5; sửa điều hướng PR #6) | 15 từ, 7 điểm kiến thức, 3 hội thoại, 4 câu hình, 3 bài nghe–viết |
| Transcript Textbook Bài 1–2 | Đã đối chiếu bản in (`print-verified`) | Không còn là mục thiếu như báo cáo pilot cũ ghi |
| Đáp án nghe–viết Bài 1–2 | **Đã có đáp án cho 78/78 ô, chấm tự động** | Đáp án biên tập đã đối chiếu (bản in + tài liệu lời đọc đăng lại + ASR nháp local); không phải đáp án NXB đã chứng minh. Chi tiết ở mục "Hoàn thiện nghe–viết" bên dưới và `docs/SOURCE_AUDIT.md` |
| Đáp án chọn hình Bài 1–2 | Giữ `verified-from-visual`, thêm đối chiếu tài liệu đáp án đăng lại (①③② / ③①④② khớp) | Vẫn không phải đáp án chính thức của NXB |
| Audio | Stream từ Baulchino; có mốc đoạn theo bài nghe–viết (từ ASR nháp + lời đọc); hội thoại vẫn phát cả track | Chưa nghe kiểm chứng bởi người; chưa có timestamp từng câu |
| Kiểm thử tự động | Local `npm run check`: validator OK, 25/25 test | CI GitHub Actions chưa chạy được (mục CI bên dưới) |
| Responsive | Đã kiểm bằng khung iframe 360/390/768/1440 | Không phải thử trên Android/thiết bị thật |
| Quyền tái xuất bản | `unknown` — không đổi | Có trên Scribd/tải miễn phí không suy ra quyền |

Báo cáo pilot M0–M6 ngày 2026-10-31 ở dưới được giữ làm **lịch sử**. Các mục sau trong báo cáo cũ đã bị thay thế bởi trạng thái trên: "Nội dung Textbook CHƯA kiểm chứng (blocked)", "Đáp án bài nghe–viết unverified — không chấm tự động", "6 câu chấm tự động" của pilot cũ, và các giới hạn lịch sử ở mục 6–7 của báo cáo cũ. Không dùng báo cáo cũ để kết luận trạng thái hiện tại.

---

# Lịch sử — QA pilot HSK 1 Bài 1 (Workbook), 2026-10-31

Ngày: 2026-10-31. Phạm vi: bản pilot M0–M6. Đây là QA tự rà soát của lượt triển khai, **không** phải QA độc lập.

## 1. Nội dung

| Hạng mục | Kết quả | Bằng chứng |
| --- | --- | --- |
| Mục lục Workbook HSK1 (15 bài) | Đã kiểm chứng trực quan | Ảnh trang PDF tr.7 (trang in VI) đọc ngày 2026-10-31; ghi trong CURRICULUM_MAP.md |
| Nội dung Bài 1 Workbook (trang in 001–004) | Đã kiểm chứng trực quan | Ảnh trang PDF tr.8–11; mọi mục trong `data/content.json` đều có sourceRefs tới trang in/PDF và mục cụ thể |
| Bìa, NXB, ISBN, phiên bản HSK 3.0 | Đã kiểm chứng trực quan | Bìa trước/sau Workbook: FLTRP, ISBN 978-7-5213-7177-2; lời tựa 2025-12 xác nhận HSK 3.0 |
| Pinyin trong app | Chép theo bản in | Thẻ từ và hội thoại có Pinyin in sẵn trong sách; không dùng chuyển đổi tự động |
| Đáp án chấm tự động (6 câu) | verified-from-print | Mọi lựa chọn + đáp án lấy trực tiếp từ trang in 001/002/004; validator bắt lỗi nếu đáp án không nằm trong lựa chọn |
| Đáp án bài nghe–viết (bài 2–4) và bài chọn hội thoại theo hình (bài 5) | unverified — không chấm tự động | Workbook không in đáp án (đã xem các trang cuối); app để chế độ tự đánh giá |
| Nội dung Textbook HSK1 | CHƯA kiểm chứng (blocked) | Công cụ đọc web báo lỗi rỗng khi mở PDF Textbook 2026-10-31; không suy đoán nội dung |
| Liên kết grammar–sentence–audio–exercise | Validator kiểm ID + ý nghĩa đối chiếu thủ công | Điểm kiến thức ↔ câu ↔ bài tập được map trong content.json và CURRICULUM_MAP.md |

## 2. Audio

| Hạng mục | Kết quả |
| --- | --- |
| Track Workbook Bài 1 tồn tại | HEAD 200, audio/mpeg, Accept-Ranges: bytes — 01-1 = 4.214.744 byte, 01-2 = 6.121.685 byte |
| Thời lượng | Đo bằng ffprobe trên file tải từ chính URL nguồn: 01-1 = 252,2 giây; 01-2 = 371,3 giây (file không đưa vào repo) |
| Đối ứng track ↔ phần trong sách | Theo số hiệu in trong sách (1-1 cho Pronunciation, 1-2 cho Listen/Read/Practice) và thư mục lesson-01 trên trang audio có đúng 2 file tương ứng |
| Nghe kiểm chứng nội dung audio khớp văn bản | CHƯA THỰC HIỆN — môi trường không có khả năng nghe; không tuyên bố đã nghe |
| Nghe từng câu | Tắt — chưa có timestamp theo câu đã kiểm chứng (segments=[], segmentsStatus=unverified; validator chặn segments khi chưa verified) |
| Phát chồng audio | Một phần tử audio duy nhất điều phối toàn app (src/player.js) |

## 3. Chức năng và kiểm thử tự động

| Kiểm tra | Lệnh / cách | Kết quả |
| --- | --- | --- |
| Validator dữ liệu | `node scripts/validate.mjs` | OK — 5 nguồn, 7 quyển, 15 bài, 3 điểm kiến thức, 6 câu, 6 bài tập chấm tự động, 4 bài tự đối chiếu, 2 track; 0 lỗi, 0 cảnh báo |
| Unit test | `node --test tests/*.test.mjs` | 6/6 pass: chuẩn hóa đáp án, tìm kiếm Pinyin không dấu, chấm chỉ với đáp án verified, lịch ôn 1/3/7/14/30 và quay về 1 ngày khi sai, validate/migration sao lưu, tách điểm lần đầu/làm lại/gợi ý |
| Cú pháp JS | `node --check` (app/lib/store/player/validate) | OK |
| Phục vụ local | `python3 -m http.server` + curl | 200 cho `/`, `data/content.json`, `src/app.js`, `assets/styles.css` |
| Hành trình học trên trình duyệt thật (live) | Xem mục 4 | ĐẠT 8/9 bước (bước bề rộng: không làm được bằng công cụ hiện có) |
| Giao diện 360/390/768/1440 px | Xem mục 4 | CHƯA kiểm được 360/390 bằng công cụ trình duyệt (không có thao tác đổi viewport); desktop hiển thị sidebar đúng thiết kế |
| Thiết bị Android thật | — | CHƯA THỰC HIỆN — không tuyên bố đã thử |

## 4. Kiểm tra trình duyệt và live

Thực hiện trên URL thật https://bohoa96tb.github.io/HSK3.0/ tối 2026-10-31 (giờ JST), sau merge PR #1 (commit a9e1f24a) và Pages build từ main. QA local qua localhost không thực hiện được vì trình duyệt kiểm thử không cùng môi trường mạng với máy chạy server — đã chuyển toàn bộ sang live.

| Bước | Kết quả | Bằng chứng tóm tắt |
| --- | --- | --- |
| 1. Hôm nay | ĐẠT (có lưu ý) | Đủ thẻ Tiếp tục học (Bài 1), Ôn tập, Tiến độ tuần, Tra cứu, Phạm vi pilot. Lưu ý: lần tải đầu rất chậm (chờ 30 giây chưa render, tải lại mới hiện đầy đủ) — ghi nhận để theo dõi, chưa tái hiện ở các lần sau trong cùng phiên |
| 2. Chuẩn bị + tắt/bật Pinyin | ĐẠT | Đủ 8 thẻ từ; bỏ chọn Pinyin thì Pinyin biến mất, chọn lại thì hiện lại |
| 3. Điểm kiến thức | ĐẠT | Đủ 3 thẻ + lưu ý "Về 'ngữ pháp' của bài này" |
| 4. Đọc/nghe + audio | ĐẠT (giới hạn bằng chứng) | 2 track hiển thị đúng thời lượng 4:12 / 6:11. Track 1-1 phát thật: bộ đếm chạy 0:06 → 0:13 → dừng ở 0:24/4:12, mini player hiện. Bằng chứng là bộ đếm thời gian chạy — công cụ không xác nhận được tiếng nói trong audio. Lỗi nhỏ đã gặp: lần bấm tạm dừng đầu tiên trên hàng track không dừng được bộ đếm (dừng được bằng mini player) — nguyên nhân: danh sách track bị dựng lại ở mỗi timeupdate; ĐÃ SỬA (cập nhật thời gian tại chỗ, chỉ dựng lại khi đổi track/trạng thái) và ghi ở mục 6 |
| 5. Làm sai → Ôn lại cách dùng → quay lại | ĐẠT | Chọn sai 茶 cho câu "māo": hiện "Chưa đúng" + giải thích + điểm lần đầu 0/1 + khóa lựa chọn; "Ôn lại cách dùng" mở đúng điểm kiến thức; "Quay lại câu đang làm" trở về nguyên trạng thái câu 1; "Câu tiếp theo" sang câu 2 giữ điểm 0/1 |
| 6. Tự đánh giá bài tự đối chiếu | ĐẠT (đã sửa nhãn) | Bấm "Chưa nhớ" ghi ngay thời điểm tự đánh giá. Lỗi nhỏ đã gặp: nhãn hiển thị mã tiếng Anh "forgot" — ĐÃ SỬA thành nhãn tiếng Việt |
| 7. Refresh tại Luyện tập | ĐẠT | Không lỗi; trạng thái câu 1 (đáp án đã chọn, đã chấm, điểm 0/1) và tự đánh giá vẫn còn. Mini player reset theo trang (chấp nhận được) |
| 8. Ôn tập / Tiến độ / Cài đặt | ĐẠT | #/review hiện 2 mục "Sắp đến hạn" (hạn 01/11/2026); #/progress tách đã học/nắm vững đúng số liệu phiên thử; #/settings đủ công tắc, cỡ chữ, tốc độ, nút xuất/nhập sao lưu, phiên bản dữ liệu 2026.10.31-pilot1 |
| 9. Bề rộng 360/390 px | KHÔNG LÀM ĐƯỢC | Công cụ trình duyệt không có thao tác đổi kích thước viewport trong phiên này. Cần kiểm tra bổ sung khi có thiết bị/công cụ phù hợp — không tuyên bố đã đạt |

Trạng thái thử nghiệm còn lại trong profile trình duyệt QA (không ảnh hưởng người dùng thật): câu 1 đã trả lời sai, 1 tự đánh giá "Chưa nhớ", 2 mục ôn hạn 01/11/2026.

## 5. Sửa lỗi sau nghiệm thu live (cùng lượt pilot)

- Hàng track audio bị dựng lại ở mỗi `timeupdate` khiến lần bấm tạm dừng đầu tiên có thể trượt — đã sửa trong `src/app.js`: chỉ cập nhật thời gian/thanh tua tại chỗ, dựng lại danh sách khi đổi track hoặc trạng thái phát.
- Nhãn tự đánh giá hiển thị mã tiếng Anh (`forgot`) — đã sửa thành nhãn tiếng Việt (Chưa nhớ / Còn chậm / Nhớ).
- Sau khi sửa: validator + unit test chạy lại đạt (ghi trong CHECKPOINT), bản live được đối chiếu lại theo byte trước khi đóng M6.

## 6. Giới hạn đã biết

- Pilot mới đạt mức **nội dung sách bài tập + liên kết nguồn** cho Bài 1; chưa đạt pilot học liệu đầy đủ theo nghĩa có ngữ pháp/hội thoại/đáp án của Textbook.
- Điểm kiến thức của Bài 1 là nền phát âm theo đúng sách — không phải ngữ pháp câu; app ghi rõ vai trò này ở mọi nơi hiển thị.
- Bài 2–15 mới ở mức mục lục; HSK 2–4 mới ở mức danh mục trang Baulchino.
- Lưu tiến độ bằng localStorage (quyết định D02); chưa có đồng bộ đa thiết bị, chưa PWA.
- Hiệu năng LCP/CLS/INP: chưa đo bằng dữ liệu thực; app tĩnh nhẹ, không tải PDF/audio khi mở trang (audio chỉ tải khi bấm phát).

## Learning edition — 01/11/2026 JST

### Đã kiểm tra tại local
- `npm run check`: syntax 4 module, validator đạt, 11/11 test đạt.
- 5 test tích hợp DOM (jsdom, không phải trình duyệt): asset và nội dung; migration giữ lịch sử; render tất cả route/mục và completion idempotent; transcript giữ trạng thái/Pinyin/nghĩa và track đúng; bài chọn hình giữ đáp án/quay lại/ghi nháp.
- Audio trong DOM test là giả lập. Ba file Textbook GET và ffprobe thật; chưa nghe bằng tai. Không có timestamp được gắn verified.
- PDF scan render và đọc trực quan, phát hiện/sửa câu tự biên tập và đề nghe thanh điệu sai; xem SOURCE_AUDIT.
- Cloud Browser không truy cập được preview localhost (trả missing bearer token của host khác); không cố vượt giới hạn. Sẽ kiểm trực tiếp bản live sau merge. Chưa ghi visual QA đạt trước khi thực hiện.

### Nghiệm thu trên URL thật sau PR #3
- Pages triển khai bản redesign, quan sát dashboard mới và hình sách hiển thị.
- Khung iframe kiểm responsive: 360 (dashboard/bài tập), 390 (bài tập), 768 (reader), 1440 (reader). Body clientWidth/scrollWidth lần lượt 345/345, 375/375, 768/768, 1425/1425; khác bề rộng khung vì scrollbar. Không tràn ngang toàn trang trên các màn đã đo; dải bước học cuộn ngang có chủ ý trên mobile. Đây không phải kiểm Android thật hoặc toàn bộ route ở mỗi kích thước.
- Track Textbook 1-1: nhấn phát, trạng thái phát xuất hiện, kết thúc 0:06/0:06; không có lỗi audio. Không tuyên bố đã nghe xác minh ngôn ngữ.
- Hội thoại 2: mở transcript thấy đủ 4 lượt; bật Pinyin vẫn giữ transcript mở, nghĩa Việt vẫn tắt.
- Bài tập hình 1: chọn 你好/你好, chấm Đúng, điểm lần đầu 1/1, có giải thích và điều hướng ôn.
- Bổ sung version cho toàn bộ import module để khách quay lại không dùng lib/player/store cũ trong cache. Mọi import dùng cùng version, không tạo hai store khác nhau.
- Các giới hạn lịch sử về Textbook trong mục 6 đã được thay thế bởi learning edition: đã đọc Bài 1 Textbook và đưa 3 hội thoại vào app. Những phần vẫn chưa xác minh: nghe nội dung audio, timestamp, đáp án nghe–viết chính thức, Android thật, quyền tái xuất bản.

## Bài 2 — 我叫李文 (01/11/2026 JST)

### Nguồn và nội dung
- Đối chiếu trực quan bằng ảnh render (không chỉ OCR): Textbook trang in 005–009 (PDF 20–24), Workbook trang in 005–008 (PDF 12–15). Bảng đối chiếu đầy đủ ở `docs/SOURCE_AUDIT.md` mục Bài 2 và `docs/CURRICULUM_MAP.md` mục 4.
- Số lượng thực tế: 15 từ mới, 7 điểm kiến thức (5 chính + 2 nền phát âm), 3 hội thoại / 10 lượt thoại `print-verified`, 4 câu chọn hội thoại theo hình, 3 bài nghe–viết tự đối chiếu (9/15/12 ô), 5 track dùng trong app (3 hội thoại Textbook + 2 Workbook).
- Đáp án 4 câu hình: suy luận biên tập đã phóng to đối chiếu từng hình (`verified-from-visual` + `answerEvidence`), không phải đáp án chính thức. Ba bài nghe–viết: sách không in đáp án → `unverified`, ô nhập lưu nháp + tự đánh giá, không chấm.
- Audio: tải file đo ffprobe (TB 02-1 5,377s; 02-3 13,222s; 02-5 11,814s; WB 02-1 418,233s; 02-2 252,736s); đối ứng theo ký hiệu in. **Chưa nghe kiểm chứng chính thức, chưa có timestamp câu** → segments rỗng, chỉ phát cả track. Trang mở rộng Textbook 009 (líu lưỡi/bonus) không đưa vào app.

### Kiểm thử tự động (local)
- `npm run check`: validator đạt cho cả 2 bài; **17/17 test đạt** — bộ test Bài 2 mới kiểm: số đếm/trang nguồn/đáp án ["3","1","4","2"], chấm chỉ với đáp án được phép, reader Bài 2 dùng đúng track 02-3 và Pinyin/nghĩa độc lập, tách phiên bài tập + nháp theo bài, migration giữ nguyên tiến độ/lần làm Bài 1, hoàn thành mục không cộng trùng. Hồi quy Bài 1 đạt. `git diff --check` sạch.
- Hình trên nhánh đối chiếu sha256 khớp bản local 5/5 (bản text base64 tạo nhầm qua API đã xóa trước merge; hình thật tải qua giao diện web GitHub, commit dd46ffc).

### Nghiệm thu trên URL thật sau PR #5 (merge d64c1516, contentVersion 20261101-lesson2-1)
- Lộ trình: Bài 2 hiện "Sẵn sàng học", mở được từ lộ trình; Bài 3–15 vẫn "Chưa mở". ĐẠT.
- Đủ 7 mục hiển thị nội dung thật, không có "undefined"; ảnh lớp học hiện. Mục Hiểu cách dùng ghi "Năm điều cần nhớ" (5 điểm chính) và 2 điểm phát âm nằm ở phần bổ trợ thu gọn — đúng thiết kế như Bài 1; tổng vẫn đủ 7 điểm kiến thức. ĐẠT.
- Nghe & đọc: transcript hội thoại 2 mở; bật Pinyin rồi bật nghĩa Việt độc lập, transcript không đóng; phát track 2-3 chạy hết 0:13/0:13, tạm dừng giữ 0:06; chuyển hội thoại 3 (track 2-5) bình thường. Tên file 02-3.mp3 không hiển thị trên UI (đã xác minh qua test DOM và dữ liệu). ĐẠT trong giới hạn bằng chứng trình duyệt.
- Luyện tập: chọn sai câu 1 → hiện "Chưa đúng" + giải thích + đáp án đúng được đánh dấu + nút Ôn lại cách dùng; điểm lần đầu cuối 3/4; 4 hình đều tải (hình câu 1 hiện sau khi cuộn — tải lười); 3 bài nghe–viết là ô nhập tự do + tự đánh giá, không chấm tự động. ĐẠT, trừ thiếu sót điều hướng dưới đây.
- Thiếu sót tìm thấy: chưa có nút quay lại câu trước trong bài tập; sau khi làm hết, reload dừng ở màn tổng kết (điểm 3/4 giữ đúng, câu sai "Hình 1" hiện trong Tổng kết để ôn) nhưng muốn xem lại phản hồi câu 1 phải làm lại từ đầu. **Đã sửa sau nghiệm thu**: thêm nút "← Câu trước" ở cả trạng thái chưa chấm/đã chấm và "← Xem lại câu cuối" ở màn tổng kết; trạng thái đã chấm được giữ nguyên khi quay lại (test DOM bổ sung, 17/17 đạt).
- Refresh giữ điểm và hàng đợi ôn; Tiến độ hiện cả Bài 1 và Bài 2; Bài 1 mở/đọc bình thường (hồi quy). ĐẠT.
- Bề rộng: kiểm bằng **khung iframe** của tests/responsive.html trên bản live — 3 route Bài 2 × 360/390/768/1440 px, 12/12 không tràn ngang thân trang; thanh 7 bước cuộn ngang có chủ ý ở 360/390 px. Đây không phải kiểm trên điện thoại thật.

### Giới hạn còn lại của Bài 2
- Chưa nghe kiểm chứng audio bằng quy trình nghe chính thức; chưa có timestamp câu; đáp án nghe–viết chưa có; đáp án hình là suy luận biên tập; chưa thử Android thật; quyền nguồn vẫn unknown; CI GitHub Actions chưa cấu hình nên kiểm tra chạy local.

## Hoàn thiện nghe–viết Bài 1–2 (01/11/2026 JST, PR #7)

### Nguồn đối chiếu
- Đề: bản in Workbook (đọc trực quan lại trang in 004 và 008, gồm ô 10 bài thanh mẫu Bài 1: bản in là ěn).
- Lời đọc: tài liệu 听力材料 đăng lại trên Scribd (doc 1067878415), đọc qua lớp chữ định vị — Bài 1 trang in 002, Bài 2 trang in 005–006. Xuất xứ chưa xác nhận là kênh NXB.
- Đáp án: tài liệu 习题答案 đăng lại (doc 1077395370; bản 1044886104 là cùng tài liệu) không in đáp án nghe–viết; đáp án chọn hình ①③② / ③①④② khớp app.
- xinhsk: bị chặn ở đăng nhập, không truy cập tiếp. FLTRP chính thức: xác nhận ấn bản và ISBN 978-7-5213-6774-4 của Textbook; không có đáp án công khai và không có cấp phép tái xuất bản.
- Phân loại đáp án nghe–viết: **biên tập đã đối chiếu** (`verified-editorial`) — ba thuộc tính xuất xứ / căn cứ / đã nghe được ghi riêng trong SOURCE_AUDIT.

### Kiểm thử tự động (local)
- `npm run check`: validator OK — gồm kiểm nhất quán từng ô giữa đáp án và âm tiết lời đọc; **25/25 test đạt**, trong đó 8 test mới cho nghe–viết: chấm thanh mẫu/vận mẫu/thanh điệu đúng–sai (gồm thiếu dấu là sai, u≠ü ngoài j/q/x, nhập v=ü, số thanh), cổng chưa xác minh không chấm, điểm lần đầu khóa không bị làm lại ghi đè, xem lời đọc được ghi nhận, nháp giữ sau khi chuyển trang, migration giữ tự đánh giá cũ, phát đoạn nhảy đúng mốc và tự dừng ở cuối đoạn.
- `git diff --check` sạch.

### Nghiệm thu trên URL thật sau PR #7 (merge cb193847, contentVersion 20261101-dictation-1)
- 8/8 bước đạt: 3 bài tách rõ với hướng dẫn và nút nghe theo đoạn; ô 10 hiện "__ ěn"; phát đoạn Bài 1 chạy (bộ đếm tăng từ quanh 1:46) và tạm dừng được; chấm tại chỗ cho kết quả đúng/sai + đáp án đúng cho ô sai + điểm lần đầu; Xem lời đọc hiện đúng dãy âm tiết; refresh giữ nháp và điểm; Bài 2 chấm đúng; hồi quy Nghe & đọc và Tiến độ đạt. Phiên kiểm thử ghi nhận có nghe thấy tiếng nói tiếng Trung ở đoạn nghe–viết và hội thoại 1 — đây là quan sát của phiên kiểm thử, không thay thế vòng nghe kiểm chứng chính thức cho toàn bộ track.
- Nhãn mốc đoạn hiển thị theo giây làm tròn xuống (106,9s → "1:46") — khác biệt trình bày, không phải lệch mốc.
- Sau refresh, nhãn đúng/sai chi tiết từng ô không hiển thị lại; điểm lần đầu và danh sách ô sai ở mục Tổng kết vẫn giữ đúng.
- Bề rộng bằng **khung iframe**: 2 route bài tập × 390/768/1440 px không tràn ngang thân trang.

### CI
- Tạo `.github/workflows/ci.yml` qua GitHub connector bị **403 "Resource not accessible by integration"** (thử lại 01/11/2026, cùng lỗi cũ). Bản workflow hoàn chỉnh (npm ci + npm run check, quyền contents: read) để tại `docs/ci/ci.yml`; cần tạo thủ công qua web GitHub tại đường dẫn `.github/workflows/ci.yml` hoặc cấp quyền workflow cho GitHub App. Kiểm thử hiện chạy local; không gọi Pages build là CI.

### Giới hạn còn lại
- Chưa nghe kiểm chứng toàn bộ audio bởi người; chưa có timestamp từng câu (chỉ có mốc đoạn); đáp án nghe–viết là biên tập đã đối chiếu, không phải đáp án NXB đã chứng minh; quyền nguồn vẫn unknown; chưa thử Android thật (checklist ngắn ở CHECKPOINT).

## Lượt UX: thanh hỗ trợ, loa theo đơn vị, nghe–viết khôi phục (01/11/2026 JST, PR #9/#10/#11)

### Đã sửa
- Lỗi nhảy trang khi bật/tắt Pinyin (tái hiện trước đó: scrollY 455→0): nguyên nhân là mọi thay đổi hiển thị đều render lại toàn trang và render() cuộn về 0. Nay thanh hỗ trợ dùng chung áp dụng tại chỗ (class + biến CSS), không render; render cùng route khôi phục vị trí theo phần tử neo.
- Loa theo đơn vị từ các track nguồn (thêm 6 track từ mới vào dữ liệu), căn đoạn bằng ASR (trạng thái `asr-draft`). Độ phủ: câu 20/20; từ mới 26/27; từ kèm hình 20/24; lựa chọn bài tập 25/25; ví dụ 26/33 đơn vị thật. Mục thiếu hiện "Chưa có audio riêng" （大家； 雨、五、一、椅子; 6 âm tiết đơn lẻ).
- Nghe–viết: accordion 3 bài + thanh thao tác sticky theo bài; kết quả lần kiểm tra gần nhất lưu bền (`dictation.last`) và khôi phục sau refresh; ô đã sửa sau chấm hiện "Đã sửa — cần kiểm tra lại"; xóa toàn bộ chữ "không chấm điểm/không tính điểm" (giới thiệu chung, hướng dẫn thanh mẫu, và — sau phát hiện của nghiệm thu live — cả `instructionVi` của từng bài, PR #11).

### Kiểm thử tự động (local)
- Validator OK (gồm kiểm audio refs và trạng thái segment); **30/30 test đạt**, thêm `tests/ux.test.mjs`: thanh hỗ trợ đổi tại chỗ (cùng nút DOM trước/sau, route không đổi, thiết lập lưu bền), loa phát đúng đoạn và chuyển loa thay thế, loa trong lựa chọn không chọn đáp án, nghe–viết khôi phục sau điều hướng + ô sửa báo kiểm tra lại + điểm lần đầu khóa, hồi quy 78 ô giữ nguyên.

### Nghiệm thu trên URL thật (sau PR #9, contentVersion 20261101-ux1; PR #10/#11 là điều chỉnh vị trí + chữ, đã đối chiếu lại trên live)
- Không nhảy trang: cuộn ~400–600 px trong transcript Bài 1, lần lượt bấm Pinyin, Nghĩa Việt, A+ — vị trí khung hình giữ nguyên ở cả ba lần, transcript vẫn mở (đối chiếu bằng ảnh vị trí; công cụ từ xa không xuất được số scrollY dạng số — bằng chứng không render lại nằm ở test DOM nút-phần tử).
- Đang phát audio ở Hội thoại 2 (0,75×) rồi bấm Pinyin: thời gian vẫn tăng 0:03→0:06, không phát lại, không dừng.
- Loa thẻ từ 老师 phát đúng track từ mới; thẻ 大家 hiện "Chưa có audio riêng" (11/12 thẻ có loa). Loa câu chuyển đoạn đúng, bấm lại thì dừng; loa trong lựa chọn bài tập không chọn radio (checked: false) và chấm vẫn đúng sau đó.
- Nghe–viết Bài 2: chấm xue2 đúng / jiao1 sai hiện đáp án jiao4; **refresh giữ nguyên dấu và điểm lần đầu 1/2**; sửa ô thành jiao4 rồi refresh: hiện "Đã sửa — cần kiểm tra lại", điểm lần đầu vẫn 1/2.
- Phiên kiểm thử ghi nhận nghe thấy tiếng nói thật ở hội thoại và đoạn từ mới.
- Bề rộng bằng **khung iframe**: 3 route (Bài 1 Bài tập, Bài 1 Nghe & đọc, Bài 2 Bài tập) × 360/390/768/1440 đều đạt, mini player không che thanh hỗ trợ/điều hướng. Sau vòng này, thanh hỗ trợ ở Nghe & đọc được chuyển ra đầu thẻ đọc (PR #10) và khối nghe–viết có thanh cỡ chữ riêng.

### Giới hạn còn lại
- Mọi đoạn loa là căn bằng máy (ASR), **chưa nghe kiểm chứng bởi người**; một số ví dụ là đoạn cắt trong câu dài hơn. 12 đơn vị chưa có loa riêng (liệt kê ở SOURCE_AUDIT).
- Mini player cố định ở đáy che một dải nội dung cuối trang khi cuộn tới cuối (hành vi cũ, các nút điều hướng vẫn dùng được).
- Chưa thử Android thật; CI vẫn chờ tạo workflow từ docs/ci/ci.yml; quyền nguồn vẫn unknown.

### Bổ sung sau nghiệm thu (PR #13, contentVersion 20261101-ux2)
- Kiểm tra nhanh đầu tiên sau PR #10 báo thanh hỗ trợ vẫn nằm trong transcript: nguyên nhân là hồ sơ trình duyệt kiểm tra giữ app.js bản ux1 trong cache vì PR #10 không đổi tham số `?v=` (file trên Pages đã đúng mã mới — đã đối chiếu trực tiếp). PR #13 tăng `?v=` và contentVersion lên `20261101-ux2`; kiểm tra lại trên cùng hồ sơ: thanh hỗ trợ ở Nghe & đọc hiện ở đầu thẻ đọc (ngoài transcript) và khối nghe–viết có cụm cỡ chữ riêng — đều ĐẠT. Quy tắc rút ra: mọi PR đổi mã phải tăng `?v=` trong cùng PR.

## Lượt ux3: thanh hỗ trợ gọn, thẻ từ Hán–Việt, hỗ trợ Mục 5, mini player (01/11/2026 JST, PR #15)

Phạm vi: chỉ Bài 1–2 và thành phần dùng chung; không mở Bài 3. Đội làm tuần tự theo vai trò (Manager/UX/nội dung/code) + một agent QA độc lập chỉ kiểm không sửa.

- **QA độc lập vòng 1**: 36/36 test đạt ở thời điểm kiểm; đạt trọn 6/10 mục, 1 mục CHƯA ĐẠT và các nghi vấn: (Lỗi 1) bật Pinyin/Nghĩa từ thanh của khối nghe–viết (dùng chung khóa với Mục 5) chưa ghi `supportUsed` — đã sửa ở `bindSupportBar` (ghi nhận cho cả scope `exercises` và `dictation`) và thêm test hồi quy riêng; (Nghi vấn 2) công thức `--mini-bottom` cộng với `bottom` của `.lesson-nav` có thể chồng lớp — đã bỏ dòng đặt `bottom: var(--mini-h)` cho `.lesson-nav` (thanh điều hướng bài giữ `bottom: 0`, mini player nằm trên nó nhờ `--mini-bottom` đo thật); nút loa nâng lên 44×44 px; validator bổ sung yêu cầu nguồn từ điển khi có Hán–Việt verified. Sau sửa: **validator đạt, 37/37 test đạt, git diff --check sạch**.
- **Đối chiếu 10 mục của Hoa**: (1) Mục 2 đủ Pinyin/Nghĩa/Hán–Việt/A−/A+ cả hai bài — đạt (test DOM + live). (2) Mỗi công tắc chỉ đổi đúng trường, hướng dẫn vẫn hiện — đạt (test DOM: cùng node, class chỉ ẩn `.tog-*`). (3) Mục 5 Pinyin/Nghĩa 25/25 lựa chọn, đồng đều, ghi supportUsed — đạt sau sửa Lỗi 1. (4) Giữ vị trí đọc khi đổi tùy chọn — đạt ở mức không-render-lại (test DOM) và quan sát live desktop (cuộn giữa trang, tắt/bật Nghĩa, thẻ đang đọc vẫn trong khung nhìn); không có số scrollY từ công cụ từ xa. (5) Đổi hiển thị khi đang phát — cơ chế không đụng player (test DOM với audio giả lập); chưa nghe kiểm chứng bằng tai người. (6) Loa trong lựa chọn không chọn đáp án — đạt (test + live ở câu chưa trả lời). (7) Chấm/sửa/refresh/làm lại, hồi quy 78 ô — đạt (test hiện có + ux3). (8) Mini player mở/thu gọn/đóng không che cuối trang — đạt trên live desktop và iframe; chiều cao được đo thật qua `--mini-h/--mini-bottom/--chrome-bottom` (jsdom cho offsetHeight=0 nên test DOM chỉ chứng minh biến được công bố). (9) Bề rộng: iframe `tests/responsive.html` trên bản live — 360 và 390 (Từ cần biết: thanh hỗ trợ xuống đúng 2 hàng gọn, không cắt nút, thẻ 2 cột, thẻ cuối 也 nhìn trọn; Bài tập: đủ nút một hàng, bài nghe–viết cuối không bị che), 768 và 1440 (một hàng, thẻ 3 cột, không tràn ngang) — đạt; đây là kiểm iframe, **không phải Android thật**, chưa kiểm bàn phím mở trên thiết bị thật. (10) Hồi quy tiến độ cũ: các test migration giữ tiến độ/attempts/session Bài 1–2 đều đạt; lịch sử không có `supportUsed` được hiểu là chưa ghi nhận hỗ trợ, không diễn giải lại.
- **Nghiệm thu live** (https://bohoa96tb.github.io/HSK3.0/, đã đối chiếu `contentVersion 20261101-ux3` qua content.json và `?v=20261101-ux3` trong index): 6/6 bước đạt trên trình duyệt desktop — Mục 2 Bài 2 đủ 5 nút; bật Hán–Việt hiện đúng "HV: CAO HỨNG" ở thẻ 高兴； tắt/bật Nghĩa giữa trang không nhảy; Mục 5 bật Pinyin hiện ở cả 4 lựa chọn; nghe–viết không lộ đáp án trước khi chấm và cuối trang không bị che; mini player một hàng có thu gọn/đóng, đóng thì ẩn hẳn; thẻ cuối 也 ở Từ cần biết nhìn trọn và loa bấm được (mở đúng track từ mới).
- **Nội dung**: Hán–Việt 27/27 `verified-editorial` từ `src-hanviet-thivien` (đã đọc trực tiếp các mục chữ đa âm: 您/你/叫/什/么/没/很/们； xem SOURCE_AUDIT mục ux3). QA độc lập chỉ đối chiếu định dạng/trạng thái và 7 âm được chỉ định — 20 âm còn lại do đội nội dung rà, QA không khẳng định thay. Audio **không đổi**: mọi đoạn vẫn `asr-draft`, chưa nghe kiểm chứng bởi người; độ phủ loa giữ nguyên 20/20 câu, 26/27 từ mới, 20/24 từ kèm hình, 25/25 lựa chọn.
- **Giới hạn còn lại**: CI GitHub Actions vẫn chưa tạo được qua connector (403) — bản bàn giao `docs/ci/ci.yml` chờ Hoa tạo qua web/cấp quyền; chưa thử Android thật và bàn phím mở trên thiết bị; quyền tái xuất bản vẫn `unknown`.

## Bài 3 — 我是中国人 (01/11/2026 JST, PR #17 + #18)

- **Quy tắc phê duyệt mới (D13)**: Hoa xác nhận Bài 1–2 bản ux3 là chuẩn và cho phép làm tiếp các bài theo thứ tự khi gửi "Tiếp tục", không chờ nghiệm thu từng bài; PR #17 (merge 22992407) sửa liên kết "Ôn lại cách dùng" của wb2-picture-1 sang `kp-hsk1-l02-word-order` và rà cùng loại mọi câu chấm điểm Bài 1–2 (các liên kết còn lại khớp đáp án).
- **Nội dung**: Textbook tr. in 010–015, Workbook 009–012 đọc trực quan: 18 từ mới (3 bảng 3-2/3-4/3-6), 4 tên riêng trong ví dụ （中国/法国/中文/泰国）, 5 điểm kiến thức （是/的/吗 + nền phát âm thanh/vận mẫu 3 + quy tắc viết), 15 câu/3 hội thoại `print-verified`, 12 từ kèm hình, 8 track Baulchino (ffprobe). Bài tập tổng hợp cuối Textbook là hoạt động lớp không đáp án in — không đưa vào chấm điểm (như Bài 2).
- **Nghe–viết**: 3 bài 42 ô `verified-editorial` — đề bản in + lời đọc tài liệu đăng lại (Scribd 1067878415, tr. in 008) + thứ tự ASR local; hai chỗ ASR khác lời đọc (zū/zǔ, shéi/shuí) lấy theo lời đọc. Tổng cả 3 bài: 120 ô đã đối chiếu. Không phải đáp án chính thức NXB.
- **Chọn hình**: đáp án ③④①② — suy luận trực quan khớp tài liệu đáp án đăng lại (Scribd 1077395370), trạng thái `verified-from-visual`.
- **Hán–Việt**: 18/18 `verified-editorial` tra từng chữ ở Thi Viện ngày 2026-11-01 （姐姐 THƯ THƯ, 还 HOÀN kèm chú thích, 的 ĐÍCH kèm cảnh báo nghĩa); tổng 3 bài 45/45.
- **Loa theo đơn vị (asr-draft)**: câu 15/15, từ mới 17/18 (thiếu 吗 — âm trung tính không tách được đoạn tin cậy), từ kèm hình 11/12 (thiếu 嘴）, lựa chọn 16/16; mục thiếu hiện "Chưa có audio", không đoán mốc.
- **Kiểm thử tự động**: validator đạt; 41/41 test đạt (thêm tests/lesson3.test.mjs; nới các test đếm của ux/ux3/dictation cho 3 bài: 45 từ Hán–Việt, 41 lựa chọn, 120 ô).
- **QA độc lập**: PASS — đối chiếu từng chữ 3 hội thoại và 3 bảng từ với bản in, suy luận lại 42 đáp án nghe–viết, chấm kiểm Hán–Việt 6 từ; bắt 1 lỗi: wb3-picture-4 trỏ `kp-hsk1-l02-jiao` (đúng mẫu lỗi D13) → đã sửa sang `kp-hsk1-l03-shi` + test hồi quy, kiểm lại 41/41 đạt.
- **Nghiệm thu live** (contentVersion 20261101-lesson3-1): đạt các luồng chính như ghi ở CHECKPOINT; trang Tiến độ không in trực tiếp điểm nghe–viết (chỉ dẫn tới Tổng kết/Luyện tập) — ghi nhận là giới hạn hiển thị hiện hữu của cả 3 bài, không phải lỗi riêng Bài 3.
- **Giới hạn còn lại**: CI 403 như cũ; chưa Android thật; chưa kiểm iframe responsive cho tuyến Bài 3 (đã thêm tuyến vào tests/responsive.html ở PR bookkeeping); đoạn loa chưa nghe kiểm chứng; quyền unknown.

## Bổ sung QA Bài 3 — responsive + rà soát hai ô nghe–viết (01/11/2026 JST)

- **Responsive iframe (khép phần còn thiếu của lượt Bài 3)**: trang kiểm chính thức `tests/responsive.html` trên bản live — cả 3 tuyến Bài 3 (Từ cần biết, Nghe & đọc, Bài tập) **đều đạt ở 360/390/768/1440**: không tràn ngang nội dung chính; thanh hỗ trợ đủ nút (Từ cần biết xuống 2 hàng gọn ở 360/390, không cắt nút); cuộn tới cuối trang thấy đủ phần tử cuối và điều hướng. Hai trạng thái căng thẳng ở 390 đều đạt: (a) cỡ chữ tối đa ("Rất lớn") — thanh hỗ trợ vẫn đủ nút, cuối trang tới được; (b) mini player mở (không thu gọn/đóng) — nội dung cuối và thanh điều hướng bài nằm trọn phía trên trình phát, không bị che. Dải "Các bước học" ở 360/390 là dải cuộn ngang theo thiết kế, không tính là lỗi tràn. Đây vẫn là kiểm iframe, không phải Android thật.
- **Rà soát ô 1 bài vận mẫu (st-l03-02), âm tiết zū/zǔ**: đề bản in cho sẵn thanh mẫu "z", người học viết vận mẫu kèm dấu thanh. Lời đọc đăng lại (Scribd 1067878415, tr. in 008) chép **zū** (thanh 1). ASR: lượt base nghe ra chữ 祖 (zǔ), lượt kiểm chứng thứ hai bằng model small cũng nghe ra 祖 (zǔ) — cả hai lượt đều nghiêng thanh 3. Đáp án đang dùng: **ū** (theo lời đọc). ū và ǔ **không** tương đương (chế độ vận mẫu chấm cả dấu thanh). Quyết định theo D14: giữ đáp án theo lời đọc — tài liệu chép lại chính track này — và ghi công khai độ không chắc ngay trong `answerEvidence` của bài; ô này là ô còn chưa chắc nhất của bộ bài, chỉ một lượt nghe bởi người mới chốt được. Trạng thái bài vẫn `verified-editorial`; không nâng trạng thái audio.
- **Rà soát ô 15 bài vận mẫu (st-l03-02), âm tiết 谁**: đề cho sẵn "sh", viết vận mẫu. Lời đọc chép **shéi** → đáp án đang dùng **éi**. Nguồn ngôn ngữ: 谁 có hai âm chuẩn shéi/shuí — chính Textbook Bài 3 ghi âm chính shéi và lưu ý "cũng đọc shuí"; ASR chỉ nhận ra chữ 谁, không phân biệt được hai âm, nên phát biểu trước đây "ASR nghe ra shuí" là nói quá — rút lại. Cách chấm hiện tại: theo lời đọc (éi); người học viết uí sẽ bị tính sai ô này. Giới hạn này ghi rõ trong `answerEvidence` của bài và quyết định D14.
- **Thay đổi kèm theo**: `contentVersion` tăng lên `20261101-lesson3-2` chỉ để chống cache cho thay đổi chữ bằng chứng trên; nội dung học không đổi. Kiểm thử local sau thay đổi: validator đạt, 41/41 test đạt.

## Bài 4 — 我有两个孩子 (01/11/2026)

### 1. Nguồn và đối chiếu

Textbook tr. in 018–025, Workbook tr. in 013–018 đọc trực quan; lời đọc đăng lại (Scribd 1067878415) phần Bài 4 tr. in 009–012 (听读练 tr. in 010); tài liệu đáp án đăng lại (Scribd 1077395370) in đáp án 听读练 nhiệm vụ 1 khớp 8/8 với lời đọc; Hán–Việt tra từng chữ ở Thi Viện. Chi tiết ở `docs/SOURCE_AUDIT.md` mục Bài 4 và `docs/CURRICULUM_MAP.md` mục 6. Ba quyết định biên tập ở D15 (chế độ chấm syllable; câu hỏi hiểu hội thoại của Textbook thành câu chấm tự động verified-from-print; không đưa 模拟测练 vào bài).

### 2. Kiểm thử tự động (local)

`npm run check`: validator đạt (4 bài; Hán–Việt 66/66; 128 ô nghe–viết/chọn âm tiết), **44/44 test đạt** — gồm test mới Bài 4 (số lượng, đáp án 1/2/2/2, Hán–Việt điểm kiểm, thời lượng track Textbook, hiển thị thân câu promptZh trong DOM, chấm syllable: nhập đúng/mate của cặp/dấu thanh dạng số) và test hồi quy Bài 1–3. `git diff --check` sạch.

### 3. QA nội dung độc lập

QA độc lập (không tham gia biên soạn) đối chiếu trang in: **PASS**. Đã xác minh: 14/14 câu khớp từng ký tự và người nói; 21/21 từ mới đúng thứ tự/pinyin/nghĩa; 6 điểm kiến thức trung thực (gồm 208/1528 và quy tắc 二/两 theo tr.021); 4 đáp án suy ra độc lập từ hội thoại in đều đúng; liên kết ôn tập của cả 4 câu đều trỏ đúng điểm dạy đáp án (không lặp lỗi mẫu D13); 8 cặp âm tiết và đáp án thuộc đúng cặp; Hán–Việt điểm kiểm 5 mục bảo vệ được trước từ điển （没有 MỘT HỮU, 几 KỶ, 大 ĐẠI, 多少 ĐA THIỂU, 孩子 HÀI TỬ); hồi quy: ô shéi của Bài 3 giữ 'éi' + ghi chú rà soát, wb2-picture-1 giữ kp-hsk1-l02-word-order.

Hai ghi chú nhỏ, không chặn, đã cân nhắc và giữ nguyên có lý do ghi rõ: (1) pinyin của 学生 trong app viết xuésheng (thanh nhẹ) trong khi sách in xuéshēng — đây là quy ước chung của cả dự án từ Bài 1 (dữ liệu Bài 1 cũng viết xuésheng), thay riêng Bài 4 sẽ làm mất nhất quán; ghi nhận là việc toàn cục nếu Hoa muốn đổi. (2) Câu wb4-text-2: bản in để chỗ trống ở "杨同乐家有（）。" với lựa chọn 两口人/四口人/五口人； app tách thành thân câu "…（ ）口人。" với lựa chọn chỉ là số 两/四/五 — nội dung gộp lại tương đương, đáp án không đổi.

### 4. Nghiệm thu live (bản đã merge, contentVersion 20261101-lesson4-1)

Đạt toàn bộ các luồng chính trên bản live: lộ trình hiện 4 bài đã mở; trang Bài 4 đủ 4 mục tiêu + ảnh phòng khách; Từ cần biết 21 thẻ, Hán–Việt bật/tắt hoạt động （没有 → MỘT HỮU; trạng thái bật sẵn trên hồ sơ kiểm tra là tùy chọn đã lưu, mặc định tắt vẫn khóa bằng test); Nghe & đọc 3 đoạn, loa đủ 14/14 câu; Bài tập 4 câu hiển thị thân câu tiếng Trung, chấm 4/4, liên kết ôn tập câu 4 trỏ kp-hsk1-l04-numbers; bài chọn âm tiết: nút nghe ghi đoạn 0:11–0:57 (không phát từ 0:00), nhập đúng 8/8, đổi sang âm còn lại của cặp bị chấm sai và hiện đáp án, tải lại trang khôi phục đúng kết quả lần kiểm tra gần nhất trong khi điểm lần đầu giữ nguyên. Hồi quy: Bài 3 mở bình thường, văn bằng chứng của bài nghe–viết 2 hiển thị đủ; Bài 1 (12 thẻ từ) và Bài 2 (15 thẻ từ) tải bình thường.

### 5. Giới hạn còn lại (ghi thẳng)

- Mọi đoạn loa vẫn `asr-draft`, chưa nghe kiểm chứng bởi người; Bài 4 đủ loa câu/từ nhưng chưa thẩm định bằng tai người.
- CI GitHub Actions chưa tạo được qua connector (403) — kiểm thử trên là local + nghiệm thu live, không gọi là CI.
- Chưa thử Android thật; tuyến responsive Bài 4 đã thêm vào `tests/responsive.html` ở PR bookkeeping nhưng chưa chạy kiểm iframe.
- 模拟测练 của Workbook Bài 4 (nghe 1–10, đọc 11–20, có đáp án đăng lại) không nằm trong bài theo D15.

## Bài 5 — 今天我休息 (01/11/2026, PR #23)

Textbook tr. in 027–034, Workbook tr. in 022–024 đọc trực quan (mục lục in IX đính chính trang bắt đầu của bài: 027); lời đọc đăng lại (Scribd 1067878415) phần Bài 5 tr. in 013; tài liệu đáp án đăng lại (Scribd 1077395370) không in đáp án âm tiết Bài 5 (chỉ liệt kê số thứ tự trống) — đáp án chọn âm tiết đối chiếu lời đọc + ASR theo D10/D14; Hán–Việt tra từng chữ ở Thi Viện. Chi tiết ở `docs/SOURCE_AUDIT.md` mục Bài 5 và `docs/CURRICULUM_MAP.md` mục 7.

### Kiểm tra mã

`npm run check`: validator đạt (5 bài; Hán–Việt 88/88; 136 ô nghe–viết/chọn âm tiết verified-editorial — 128 ô Bài 1–4 + 8 ô Bài 5), **47/47 test đạt** — gồm test mới Bài 5 (số lượng 22 từ/5 điểm/14 câu/8 track, đáp án 1/3/2/3, Hán–Việt điểm kiểm HÀO/TINH KỲ/TỐ/NHẤT TA/THÁI, thời lượng track Textbook, hiển thị thân câu trong DOM, chấm syllable gồm cả trường hợp ô 5 jiā ≠ cả hai thành viên của cặp in) và cập nhật đếm bao phủ ở ux/ux3 (câu 63, từ mới 86/88 có loa, từ nền 53/58, lựa chọn 41/65; Hán–Việt 88) cùng contentVersion ở test Bài 3–4. `git diff --check` sạch.

### QA độc lập (đối chiếu dữ liệu với ảnh trang in)

ĐẠT các mục từ mới 22/22, câu hội thoại 14/14, cặp âm tiết 8/8, từ nền 10/10 và mục lessons[]; hai lỗi đã sửa trước khi mở PR: (1) câu wb5-text-2 liên kết ôn tập trỏ kp-hsk1-l05-hui trong khi đáp án kiểm tra thứ trong tuần — đã đổi sang kp-hsk1-l05-time và đồng bộ `exerciseIds` hai chiều (tiền lệ D13); (2) pinyin ví dụ năm 1992 ở kp-time ghi "yì…" theo biến điệu trong khi bản in tr.029 ghi "yī…" — đã sửa theo bản in. Điểm chưa chắc công khai theo D14: ô 5 bài chọn âm tiết — lời đọc ghi jiā, cặp in là jiǎ/xiǎ, ASR cũng nghe jiā; đáp án giữ jiā và ghi rõ trong `answerEvidence`.

### Nghiệm thu live

Đạt toàn bộ 8 bước trên bản live: lộ trình hiện 5 bài đã mở; trang Bài 5 đủ mục tiêu + ảnh văn phòng (Textbook tr.032); Từ cần biết 22 thẻ, Hán–Việt hiển thị đúng （今天 KIM THIÊN, 号 HÀO, 做 TỐ PHẠN) — trạng thái bật sẵn trên hồ sơ kiểm tra là tùy chọn đã lưu, mặc định tắt vẫn khóa bằng test DOM; Nghe & đọc 3 đoạn, loa câu “今天9月8号。” phát đúng đoạn riêng; Bài tập 4 câu hiển thị thân câu, chấm đúng/sai đúng, liên kết ôn tập của câu 2 trỏ kp-hsk1-l05-time và quay lại không mất trạng thái; bài chọn âm tiết: nút nghe ghi đoạn 0:13–0:58 và phát từ ~0:13, nhập ge1/qiang3 chấm đúng, nhập jia3 ở ô 5 bị chấm sai với đáp án jiā như thiết kế; refresh giữ nguyên kết quả; hồi quy Bài 4 tải bình thường (21 thẻ từ). Iframe responsive (tests/responsive.html) cho 3 tuyến Bài 5 ĐẠT ở 360/390/768/1440, gồm cỡ chữ tối đa và mini player mở ở 390 (thanh bước học tự cuộn ngang trong nội bộ ở 360/390 là hành vi đã biết từ các bài trước, không tràn trang). Không đồng nghĩa đã nghe thẩm định đoạn loa hoặc đã thử Android thật.

## Lượt rà soát Bài 5 — source-conflict, bài tập tổng hợp tr.033, loa lựa chọn Bài 4–5 (01/11/2026)

Theo yêu cầu của Hoa sau phát hành Bài 5:

- **Ô 5 bài chọn âm tiết → `source-conflict` (D16):** kiểm lại đủ bốn phía — đề in (cặp jiǎ/xiǎ, đọc lại từ ảnh trang), tài liệu lời đọc (jiā), tài liệu đáp án (không in đáp án bài này), audio (cắt đoạn âm tiết thứ 5 ở ~39,8–40,0s của track Workbook 5-2: ASR đọc 家； đo cao độ bằng máy cho F0 phẳng ~286–296 Hz, dáng thanh 1 — kiểm bằng máy, không phải nghe thẩm định). Xung đột chưa giải quyết được → ngừng chấm riêng ô này: `conflictCells: [4]` + `conflictNoteVi` hiển thị tại ô; chấm (lib) trả `source-conflict` cho mọi input; migration lúc khởi động (theo dữ liệu `conflictCells`) loại first/last + mục ôn tập `dict-st-l05-01:4` khỏi thống kê hiện hành, giữ nguyên số lần thử và bản nháp. KHÔNG chấp nhận cả jiǎ lẫn jiā. Test mới tests/conflict.test.mjs (3 test: chấm/mẫu số, migration giữ lịch sử, hiển thị ghi chú + "Lần đầu: 0/1 ô" với dữ liệu cũ đã gieo).
- **Bài tập tổng hợp Textbook tr.033:** bảng kê ở SOURCE_AUDIT. Bổ sung 5 câu chọn từ điền trống (wb5-comp-1..5, `verified-from-print`, đáp án 3/4/1/5/2 theo ngân hàng 菜/喜欢/6月22号/新/真） và bài dùng hình để nói thành tự luyện không chấm (st-l05-02, `unverified`). Sau lượt này trang 033 được coi là hoàn thiện theo phạm vi đã công bố.
- **Loa lựa chọn Bài 4–5:** rà từng lựa chọn theo token nguyên từ trong track hội thoại của bài (ASR): bổ sung 15 đoạn cho 8 câu in (Bài 4: 10/12, thiếu 姐姐/三个 vì không xuất hiện; Bài 5: 5/12, thiếu 不/不会/星期三/星期六/上班/名字/工作） + 20/25 lượt lựa chọn của 5 câu tổng hợp （6月22号 không có đoạn). Tổng toàn app 76/90 lựa chọn có loa; ma trận đầy đủ ở SOURCE_AUDIT. Vẫn `asr-draft`, chưa nghe kiểm chứng.
- **QA độc lập:** ĐẠT cả 4 mảng (conflict + migration an toàn dữ liệu khác; đáp án comp 5/5 duy nhất hợp lý; track/đoạn loa khớp hội thoại; đếm độc lập 76/90). Hai ghi chú đã rõ: migration là một chiều theo `conflictCells` hiện hành (đúng thiết kế D16) và answerEvidence của comp không cần ghi giới hạn hình (bài chữ, không phải bài hình).
- **Kiểm tra:** validator đạt; **50/50 test** (47 cũ + 3 conflict); contentVersion 20261101-lesson5-2, tăng ?v= ở index.html và cả các import nội bộ src/.

## Bài 6 — 你的手机号是多少？ (01/11/2026, PR #26)

Textbook tr. in 035–042, Workbook tr. in 031–032 đọc trực quan; lời đọc đăng lại (Scribd 1067878415) phần Bài 6 tr. in 014; tài liệu đáp án đăng lại (Scribd 1077395370) không in đáp án 听读练 Bài 6; Hán–Việt tra từng chữ ở Thi Viện. Chi tiết ở `docs/SOURCE_AUDIT.md` mục Bài 6 và `docs/CURRICULUM_MAP.md` mục 8.

### Kiểm tra mã

`npm run check`: validator đạt (6 bài; Hán–Việt 110/110; 142 ô nghe–viết/chọn âm tiết verified-editorial — 136 ô Bài 1–5 sau khi trừ ô source-conflict + 6 ô Bài 6), **53/53 test đạt** — gồm test mới Bài 6 (22 từ/5 điểm/14 câu/8 track, đáp án 3/2/3/2 + 5/2/4/3/1, Hán–Việt điểm kiểm THỦ CƠ/NA NHI/TƯỞNG/CẬT/CHẨM MA/XUẤT TÔ XA, pinyin đọc số điện thoại, chấm âm tiết đôi gồm cả cặp phân biệt ở âm tiết thứ hai, bài 2 nhi hóa giữ unverified) và cập nhật đếm bao phủ ở ux/ux3 (câu có đoạn 77, từ mới 108/110, từ nền 64/71, lựa chọn 106/127; Hán–Việt 110) cùng contentVersion ở test Bài 3–5. Thay đổi mã chấm: mode 'syllable' so dãy thanh điệu từng âm tiết thay cho một thanh gộp — test Bài 1–5 (âm tiết đơn) vẫn đạt nguyên vẹn. `git diff --check` sạch.

### QA độc lập (đối chiếu dữ liệu với ảnh trang in)

ĐẠT nội dung ở cả 6 mảng: từ mới 22/22 khớp bản in; 14 câu hội thoại khớp từng chữ (gồm pinyin đọc số điện thoại); đáp án 9/9 duy nhất hợp lý. Báo cáo đầy đủ của vòng này (về sau bản tóm tắt) trừ điểm riêng phần LIÊN KẾT ÔN TẬP: wb6-text-1 trỏ kp-xiang là lệch (ô trống kiểm tra từ thời gian 明天， 想 đã cho sẵn), wb6-text-2 trỏ kp-serial chưa sát (đáp án nằm ở mẫu 想+động từ), wb6-text-4 và các câu tổng hợp thiếu liên kết. Đã sửa ở contentVersion 20261101-lesson6-4 theo đúng tiền lệ Bài 5 (ô trống kiểm tra cái gì thì trỏ điểm kiến thức đó): text-1 → KP thời gian Bài 5, text-2/text-4/comp-4 → KP 想, text-3/comp-1/2/3 → KP liên động, comp-5 để trống （多少 không thuộc điểm kiến thức nào); exerciseIds hai chiều đã đồng bộ; có test hồi quy. chấm âm tiết đôi kiểm bằng node — đáp án đúng qua (dấu + số), thành viên còn lại của cặp bị loại, kể cả dōngxi/dōngxī và shǒujī/shǒují; st-l06-02 unverified không answers; 5 điểm kiến thức nhất quán với bản in. Không lỗi.

### Nghiệm thu live

Đạt 8/9 bước ở lượt đầu và đạt trọn ở lượt kiểm lại: lộ trình hiện 6 bài đã mở; trang Bài 6 đủ mục tiêu + ảnh ở trường (Textbook tr.036); Từ cần biết 22 thẻ, Hán–Việt đúng （手机 THỦ CƠ, 吃 CẬT, 怎么 CHẨM MA); Nghe & đọc 3 đoạn, loa câu số điện thoại phát đúng đoạn riêng; Bài tập chấm đúng/sai đúng, liên kết ôn của câu 2 trỏ kp-hsk1-l06-serial và quay lại giữ trạng thái, câu tổng hợp chấm đúng; bài chọn âm tiết đôi: đoạn phát 0:12–0:47, 'nabian' không thanh bị chấm sai, và ở lượt kiểm lại 'dong1xi' ĐÚNG (1/1), 'dong1xi1' SAI với đáp án dōngxi, 'shou3ji1' ĐÚNG — ở lượt đầu trường hợp 'dong1xi' từng bị chấm sai do CDN còn phục vụ lib.js bản cũ ngay sau phát hành (đã xác minh lib.js trên URL thật chứa logic mới và kiểm lại đạt; không phải lỗi dữ liệu hay mã đã merge); bài 2 nhi hóa không có nút Kiểm tra; refresh giữ kết quả; hồi quy Bài 5 bình thường (22 thẻ). Iframe responsive (tests/responsive.html) cho 3 tuyến Bài 6 ĐẠT ở 360/390/768/1440, gồm cỡ chữ tối đa ở 390 và mini player mở ở 390 trên tuyến Nghe & đọc (đệm dưới đo thật 98px, nội dung cuối trang tới được). Không đồng nghĩa đã nghe thẩm định đoạn loa hoặc đã thử Android thật.

### QA độc lập vòng 2 cho lượt rà soát Bài 5 (báo cáo đầy đủ về sau, đã xử lý)

Vòng QA đầy đủ của lượt rà soát (khác lượt tóm tắt trước) bắt thêm 2 lỗi ngữ nghĩa mà test chưa bao phủ, cả hai đã sửa ở contentVersion 20261101-lesson6-2 kèm test hồi quy:
1. `wb5-text-2`: đoạn loa 5.75–7.25 của track 5-1 (đọc 星期日） bị gán nhầm cho lựa chọn 星期三 (id 1); lựa chọn đúng 星期日 (id 3) lại không có loa. Đã chuyển đoạn sang id 3; tổng số lựa chọn có loa không đổi (106/127 toàn app). Thêm test bảo vệ chung: mọi đoạn loa của lựa chọn Bài 4–5 phải đọc đúng nguyên văn lựa chọn trong track đã gán.
2. `wb5-comp-5`: thân câu app ghi thêm 它 ("我也很（ ）它。") trong khi bản in tr.033 là "我也很______。" không có 它. Đã sửa thân câu/pinyin/dịch/bằng chứng theo đúng bản in (đáp án 喜欢 không đổi); nhân tiện sửa dấu câu của wb5-comp-4 thành ！ như bản in.

## Quy trình áp dụng từ Bài 7 (D17)

Mỗi mục QA của một bài từ Bài 7 trở đi phải ghi rõ năm loại bằng chứng riêng biệt: (a) test tự động, (b) đối chiếu trực quan bản in, (c) đối chiếu ASR, (d) kiểm nghe thực tế, (e) kiểm giao diện (trình duyệt/iframe/thiết bị thật). Kết luận đạt chỉ ghi sau khi báo cáo QA độc lập đầy đủ đã về và vòng sửa–kiểm lại đã khép trong nhánh. Test so dữ liệu với chính dữ liệu không được ghi là kiểm chứng độc lập; kiểm ánh xạ audio không được ghi là kiểm nghe.

## Bài 7 — 我晚上六点半下班 (2026-11-01, quy trình D17)

**Kết luận: ĐẠT sau một vòng sửa trong nhánh; đã khép QA trước phát hành.**

QA độc lập (đối chiếu trực quan bản in Textbook PDF 60–67 / Workbook PDF 46–48) kiểm ngữ nghĩa từng mảng:

- Từ mới 27/27, hội thoại 14/14 câu (từng chữ + dấu câu + người nói), đáp án 9/9 (duy nhất; gồm hai câu tổng hợp tách từ câu in hai chỗ trống — thân câu khớp bản in), 6 điểm kiến thức (nội dung + ví dụ nguyên văn, không mâu thuẫn), 28 cặp phát âm của hai bài phân biệt, 4 khung câu dùng hình để nói: đều ĐẠT ở vòng 1.
- **Lỗi vòng 1 (đã sửa và QA kiểm lại đạt ở vòng 2):**
  1. Ánh xạ loa từ mới: 7/27 đoạn ban đầu (lấy theo token ASR) tràn sang từ kề （早上/上午 gối nhau, 分 chứa đầu 课， 见 chứa cuối 下午， 电影 tràn sang 事， 上课 gối 呢， 家 tràn sang 里）. Đã căn lại toàn bộ 27 đoạn theo phân tích khoảng lặng (silence-burst) của ba track từ mới — mỗi từ đọc hai lần, đoạn chỉ phủ lần đọc đầu; hai đoạn ví dụ điểm kiến thức cũng thu hẹp tương ứng. QA vòng 2 quét lại cả 27 đoạn + 2 ví dụ: không còn đoạn nào chứa từ ngoài nhãn.
  2. Liên kết ôn tập: wb7-text-2 trỏ kp-ne là sai (ô trống kiểm tra cụm động từ 上课； 呢 đã cho sẵn trong câu nguồn, không phải thứ được kiểm tra) → gỡ, để trống; wb7-text-3 thiếu liên kết (thân câu của chính câu hỏi là câu trần thuật + 呢 cần hoàn thành) → thêm kp-ne; wb7-comp-4 trỏ kp-adverbial là gán gần đúng (ô trống là chọn từ trong ngân hàng) → gỡ, để trống theo quy tắc D17. exerciseIds đồng bộ hai chiều; QA vòng 2 xác nhận khớp.

Bằng chứng tách theo năm loại theo D17:
- **Test tự động:** validator đạt; 59/59 test (tests/lesson7.test.mjs khóa đáp án, liên kết sau sửa và trạng thái unverified của hai bài phát âm). Đây là kiểm tra tính nhất quán dữ liệu, không thay kiểm chứng độc lập.
- **Đối chiếu trực quan bản in:** toàn bộ mảng nội dung ở trên do QA độc lập đọc trực tiếp PDF đối chiếu dữ liệu.
- **Đối chiếu ASR:** hai lượt faster-whisper (có/không VAD) + phân tích khoảng lặng để căn đoạn; thứ tự và ranh giới đoạn là căn bằng máy.
- **Kiểm nghe thực tế:** CHƯA thực hiện — mọi đoạn giữ `asr-draft`. Hai bài phân biệt phát âm giữ `unverified`, không chấm tự động theo bằng chứng: tài liệu lời đọc đăng lại (trang in 019) in cả hai dạng của mỗi cặp và tài liệu đáp án đăng lại không in đáp án cho hai bài này (chi tiết ở SOURCE_AUDIT, đã đính chính căn cứ sau khi báo cáo đối chiếu đầy đủ về).
- **Kiểm giao diện:** nghiệm thu live trên URL thật đạt 8/8 bước (lộ trình hiện 7 bài; 27 thẻ từ + Hán–Việt đúng; loa câu Hội thoại 3 phát đúng đoạn; nút Ôn lại của câu 4 mở đúng điểm Cách nói giờ (2) và quay lại đúng câu; hai bài phát âm không có chấm tự động; tiến độ giữ sau reload; hồi quy Bài 6 chấm âm tiết và ô source-conflict Bài 5 còn nguyên). Kiểm responsive bằng iframe tests/responsive.html: 3 tuyến × 360/390/768/1440 đạt 12/12, cộng tuyến Từ cần biết ở 390 với cỡ chữ lớn nhất đạt. Chưa kiểm trên thiết bị Android thật.

Giới hạn đã biết: chưa Android thật; chưa CI GitHub Actions (403 — handoff ở docs/ci/); quyền nguồn unknown.

**Bổ sung sau báo cáo QA vòng 2 đầy đủ (contentVersion 20261101-lesson7-2):** báo cáo đầy đủ của vòng 2 (về sau bản tóm tắt) kèm hai ghi chú không chặn merge: (a) đoạn của 吧 và 后 phủ cả hai lần đọc của chính từ thay vì chỉ lần đầu; (b) đoạn ví dụ của điểm 呢 cắt cụt ~0,17s cuối của trợ từ 呢. Đã xử lý cả hai: 吧 → 20.58–20.90, 后 → 26.00–27.20 (chỉ lần đọc đầu), ví dụ 呢 → kéo dài tới 16.15 để trọn trợ từ. Kết luận ĐẠT của vòng 2 không đổi.

## Hoàn thiện Bài 6–7 theo yêu cầu người dùng — 01/11/2026
- Nội dung đã đọc trực quan: Workbook tr.032/039/040; Textbook tr.041/042/052. Tìm lời đọc Scribd tr.016/019 và đối chiếu mục tiêu cả hai dạng. Sửa hướng dẫn và lỗi dấu thanh bìn, trích tám hình, gỡ mô tả giờ suy đoán; nguồn chi tiết ở SOURCE_AUDIT mục cuối.
- Code: renderer phân biệt nghe–so sánh và bài nói theo hình; mốc audio được đọc cả cho bài không chấm; validator chặn trường segment lỗi và kiểm khoảng nghe/ảnh với sourceRefs cho mọi trạng thái.
- Kiểm local: validator đạt, 63/63 test đạt, git diff --check sạch. Bộ mới kiểm mục tiêu nghe cả cặp không chấm, mốc phát/dừng (Audio giả lập), giữ ghi chú sau điều hướng, đủ8 ảnh có nguồn và caption đúng màn intro.
- QA độc lập đầy đủ đã nhận và đọc trước merge: đọc6 trang nguồn + ảnh phóng to dấu thanh, kiểm8 WebP, data/renderer/validator/CSS/tests/docs. Xác nhận sáu cặp nhi hóa,12 cặp đưa hơi,16 cặp mũi (đã sửa bìn),8 khung câu và thứ tự ảnh khớp bản in. Không tạo đáp án duy nhất hoặc đổi điểm cũ. QA bắt thêm hướng dẫn chung còn ám chỉ mọi bài đều có ô trống — đã sửa theo hasGraded, kiểm lại đạt.
- Bổ sung QA độc lập lần cuối cho caption: sectionIntroHtml nay có figure/img/figcaption, dữ liệu escape đúng, Bài6 tr.036 và Bài7 tr.046 hiện đúng; test xác nhận tại intro, không nhầm dashboard. Không có lỗi chặn phát hành trong phạm vi nguồn/code; browser/responsive sẽ nghiệm thu sau triển khai.
- Hai lỗi khi chạy test đầu: mock mới chưa mô phỏng loadedmetadata nên chưa seek, và assertion cũ khớp nguyên văn hướng dẫn cũ. Đã sửa mock và assertion câu mới; giữ nguyên các assertion hành vi không lộ đáp án. Không dùng kết quả mock làm bằng chứng kiểm nghe.
- Giới hạn giữ nguyên: không nghe thẩm định audio bởi người, chưa Android thật, mốc là nháp, một số loa còn thiếu, quyền tái xuất bản unknown. Không mở Bài8.

### Nghiệm thu sau triển khai — lượt hoàn thiện Bài6–7
- PR #39 merge 8d652c31e579cec9c3547061343dfad5795d947f; Pages run41285859946 success, contentVersion20261101-lessons67-practice1. Đối chiếu byte index.html/src/app.js/data/content.json live khớp merge.
- Caption: Bài6 Bắt đầu hiện “Ở trường · Textbook, trang 036”; Bài7 hiện “Đang gọi điện · Textbook, trang 046”. Thiếu caption trước đây là lỗi renderer thực, không thể chỉ kết luận do tìm chuỗi khác dấu phẩy.
- Nghe–so sánh: live Bài6 t2 có hướng dẫn nghe cả hai dạng, ghi chú cá nhân, không nút chấm; bấm phát thấy bộ đếm tiến0:53 trong đoạn0:47–1:52. Bài7 t1 quan sát phát từ1:07. Không gọi kiểm bộ đếm là nghe kiểm chứng ngữ nghĩa.
- Lưu nháp: ghi “So sánh âm r” tại Bài6 t2, “So sánh luồng hơi” tại Bài7 t1; reload/mở lại vẫn nguyên.
- Ảnh:4/4 ảnh Bài6 và4/4 ảnh Bài7 loaded với naturalWidth>0; đúng khung câu, có caption trang in. Quan sát desktop lưới2cột và390px1cột.
- Responsive iframe: hai tuyến exercises Bài6/Bài7 ×360/390/768/1440, body scrollWidth bằng clientWidth (345/375/753/1425 tương ứng); không tràn ngang. Đây là iframe trên desktop, không phải Android thật.
- Kết luận: đạt phạm vi sửa nguồn/mục tiêu bài/ảnh/caption/hành vi nháp và đoạn phát. Chưa kiểm nghe bởi người; chưa xác minh lại ngữ nghĩa toàn bộ đoạn loa cũ; các đơn vị thiếu loa không được thay bằng TTS hoặc timestamp đoán. CI và quyền nguồn vẫn chưa được giải quyết.

## Bài 8 — 我爸爸也在医院工作 (01/11/2026, QA theo D17, khép trong nhánh feat/lesson-8)

**Vòng 1 (QA độc lập, báo cáo đầy đủ):** 0 lỗi nghiêm trọng, 1 trung bình, 3 nhẹ, 3 quan sát. Đã kiểm đạt: từ mới + Hán–Việt 24/24 (tra lại độc lập các trường hợp khó ở Thi Viện: 漂亮 PHIẾU LƯỢNG theo chính dòng “phiếu lượng” của trang 漂， 只 CHÍCH, 医生 Y SINH, 书店 THƯ ĐIẾM); hội thoại 14/14 khớp bản in từng ký tự + dấu câu, nhan đề nằm trong l08-s12; đáp án text C/A/B/B, comp 2/5/1/3/4, warm 4/3/1/5/6/2 (xác minh trực tiếp từ D của sách là 医生）, redup B/C/B/A; nội dung 11/11 hình (gồm cặp hình–khung câu của bài nói và quan hệ mèo TRÊN bàn ở hình 4); st-l08-01 (đề + đáp án + answerEvidence trung thực, không nhận là đáp án chính thức); liên kết ôn tập hai chiều đúng theo chỗ trống; ánh xạ loa theo nhãn (24/24 từ khớp file căn khoảng lặng, 14/14 câu, các lựa chọn có loa); renderer ẩn nhãn hình trước khi chấm.
- Lỗi trung bình: ví dụ 3 của KP “能” ghi “我不能去学校吃饭。” trong khi bản in tr.058 là “我不能去学校吃午饭。” → đã sửa đồng bộ examples + explanationVi (cha tự phóng to bản in gốc xác nhận có 午）.
- Lỗi nhẹ: (a) explanationVi của KP phương vị nói “Hội thoại 1 dùng cả ba ý này” — sai, 书店前 ở Hội thoại 2 → đã sửa diễn đạt; (b) imageAlt hiệu sách nhắc “biển Books” không có trong hình → đổi thành “các kệ sách”; (c) alt hình ngữ cảnh nhắc “ghế và tủ sách” không có trong hình → rút gọn còn mèo dưới bàn. Đã thêm test hồi quy cho cả 4 điểm (71/71 test đạt sau sửa).
- Quan sát được chấp nhận, không sửa: cách tách câu tổng hợp 3 thành hai câu (theo tiền lệ Bài 7) làm thân câu của câu này hiện đáp án của câu anh em — đáp án của chính câu đang làm không lộ; đoạn loa 12 lựa chọn điệp âm gồm cả tiếng đọc ký tự A/B/C theo đúng cách track đọc, đồng đều cả 12; lựa chọn điệp âm hiển thị pinyin ở cả ô chữ Hán và ô pinyin vì sách chỉ in pinyin (trung thành bản in).
**Phân loại kiểm thử:** test tự động 71/71 + validator OK · đối chiếu trực quan bản in: QA đọc trực tiếp PDF gốc TB 69–75/WB 55–57 + cha phóng to tr.058 · đối chiếu ASR: thứ tự âm tiết st-l08-01 và mốc đoạn (asr-draft) · kiểm nghe thực tế: KHÔNG (chưa nghe bằng tai người; riêng đoạn mô phỏng WB 8-2 ngoài bài đã thử phát cơ học trên Chromium) · kiểm giao diện: Chromium 390px cục bộ (khởi động nối hình: nhãn ẩn trước chấm, hiện sau chấm, chấm đúng) — chưa Android thật, chưa kiểm live trước merge.

## Vòng phản hồi thiết bị thật — device-feedback1 (01/11/2026, D20)
Hoa thử Bài 8 trên Android thật, phản hồi: (1) text không liên quan bài học phải ẩn; (2) loa từ mới phát 2 lượt nam/nữ bị cắt gượng, loa lựa chọn cắt từ audio mất tự nhiên — đề xuất giọng mặc định của trình duyệt hoặc bỏ qua; (3) ảnh quá lớn, muốn chia đôi màn hình.
- Đã sửa: loa đơn vị ngắn (từ/ví dụ/lựa chọn có chữ Hán) dùng speechSynthesis của thiết bị; lựa chọn thuần pinyin bỏ loa; câu hội thoại giữ audio sách; ghi chú bộ câu hỏi + ghi chú Mục 2 + ghi chú Mục 1 thu gọn dạng details; lưới hình 2 cột mọi bề rộng (ảnh nối hình ~131px ở khung 390px, nút chọn phủ góc ảnh); test 80/80.
- QA vòng 1: CHƯA ĐẠT — 1 lỗi Trung bình TB1 (loa TTS gắn vô điều kiện cho ví dụ điểm kiến thức: Bài 3 có 5 ví dụ zh là pinyin Latin, Bài 1 có 4 ví dụ zh là "—" → loa đọc sai đơn vị) + 5 lỗi Nhẹ (N1 intro/reader tip còn hiển thị; N2 TTS đọc cả nhãn "A:/B:" và dấu "/"; N3 TTS và audio sách phát chồng; N4 UI_SPEC còn 2 câu cũ; N5 test chưa phủ speakText đường dương và knowledge Bài 1/3).
- Đã sửa trong nhánh: TB1 — ví dụ chỉ có loa khi zh chứa chữ Hán (chung điều kiện HAS_HAN với lựa chọn); N1 — ghi chú Mục 1 bọc details (ghi chú cách nghe 3 lượt ở Mục 4 là hướng dẫn học, giữ hiển thị theo chủ ý); N2 — speakable() bỏ nhãn A:/B: và đổi "/" thành khoảng lặng cho mọi nút TTS; N3 — speakText tạm dừng audio sách, playTrack/playSegment hủy TTS đang đọc; N4 — sửa 2 câu UI_SPEC; N5 — thêm 3 test (knowledge Bài 1/3, speakText mock giọng zh, lựa chọn không còn nhãn/dấu gạch chéo). Chờ QA vòng 2 kiểm lại.
- QA vòng 2: 5/6 điểm đạt (TB1, N1, N2, N3, N5 + hồi quy 80/80); còn N4 — câu cũ về ảnh bài nói ở UI_SPEC dòng 36 chưa sửa ở vòng trước vì regex không khớp (văn bản dính "dưới600px"). Đã sửa đúng câu đó thành "hai cột ở mọi bề rộng (kể cả điện thoại, cập nhật D20)" và kiểm lại bằng grep (không còn "một cột dưới") — đủ điều kiện merge theo kết luận của QA vòng 2.

## Vòng bổ sung Bài 8 — đề mô phỏng + track WB 08-2 (2026-11-01, D21)

**QA nội dung vòng 1: ĐẠT CÓ ĐIỀU KIỆN.** Đáp án tự suy độc lập khớp dữ liệu 20/20; thân câu/lựa chọn/pinyin khớp bản in 20/20; đoạn audio ôm đủ hai lượt đọc 10/10; hình 17/17 khớp mô tả, 9/9 câu hình một đáp án rõ ràng; answerEvidence trung thực 20/20. 4 lỗi Nhẹ đã sửa trong nhánh: (1) đoạn l08m-06 start 241,0 lấn tiếng gọi số câu → 243,0; (2) hintVi 10 câu Đọc dùng động từ "Nghe" → đổi hint đọc; (3) sourceRefs câu 14–16 thiếu trang ngân hàng lựa chọn → bổ sung ref PDF 61/in 054; (4) pinyin "wǒ bù néng" → "wǒ bùnéng" khớp khoảng trắng bản in.

**QA code vòng 1: CHƯA ĐẠT → đã sửa, chờ kiểm lại.** Đạt: tổng quát hóa session hai bộ không rò rỉ; hành vi bộ chính không đổi; vị trí/tiêu đề bộ bổ trợ đúng; nút nghe cấp câu phát đúng đoạn; gradeChoice khớp validator 81/81 câu, bài tự kiểm tra không bị chấm nhầm 0 trường hợp, 4 câu wb8-redup-* chấm được hai chiều; Ôn tập/Tiến độ không vỡ. Lỗi Trung bình TB1: deep link ?item= nhắm lại cùng câu lần hai không mở lại được (reviewTarget không bao giờ được xóa — lỗi cũ ở bộ chính, vòng này kế thừa khi tổng quát hóa). Đã sửa bằng cơ chế edge-trigger (chỉ kích hoạt khi ?item= đổi giá trị; render đặt lại khi rời route; chấm/restart xóa reviewTarget) + test hồi quy đúng kịch bản QA. Ba điểm Nhẹ đã sửa cùng nhánh: N1 Tiến độ/Tổng kết nay báo riêng điểm đề mô phỏng và tra câu sai ở cả hai bộ; N2 tóm tắt validator đếm 39 câu Bài 8; N3 tra exerciseIds và kiểm audioSegment trên cả hai bộ.

**Kiểm lại sau sửa:** QA nội dung xác nhận 4/4 điểm đã sửa đúng (mốc l08m-06 hết tiếng gọi số, ôm đủ hai lượt đọc; hint đọc 10/10; refs ngân hàng đủ 3/3; pinyin bùnéng). QA code vòng 2: **ĐẠT** — TB1 đạt qua kịch bản jsdom độc lập 33/33 assertion (gồm bẫy render sau chấm khi URL còn ?item=, deep link lần hai cho cả hai bộ), N1 số liệu Tiến độ/Tổng kết khớp attempts, N2 validator báo 39 câu, N3 kiểm âm tính đạt. Phát hành PR #44 merge f1ccd648, contentVersion 20261101-mock8-1.

## Vòng rà soát độ phủ Bài 8 (D22 — 2026-11-01)

- QA nội dung (độc lập, tự đọc lại TB in 054–060 + WB in 048–050): **ĐẠT**. Tuyên bố "chỉ thiếu 6 nhóm" được xác nhận đúng và không còn mục nào trong hai sách chưa có trên app; cả 6 phần bổ sung đúng nội dung/đúng trang/không bịa (phần chữ Hán truy xuất 100% về WB in 049–050); 11 liên kết ôn tập của bộ mô phỏng đúng kiến thức từng câu, hai chiều khớp. 4 điểm Nhẹ: thứ tự hai KP đầu lệch trang in (mẹo ở in 055, bài giảng ở in 056) → ĐÃ SỬA: đổi thứ tự KP thành đúng thứ tự sách; nhóm câu mô phỏng để trống liên kết ở vùng biên (07/12/10/13/14) được QA đánh giá là phòng thủ đúng theo D17; khác biệt khoảng trắng pinyin xiǎomāo/xiǎo māo (phong cách chung của app); các dòng đóng vai được bao phủ theo chế độ hoạt động, không tính là mục thiếu.
- QA code (độc lập, kèm bộ kiểm jsdom riêng 9/9): **ĐẠT CÓ ĐIỀU KIỆN** — TB1: phép tổng quát "startsWith('foundation')" làm KP `kp-hsk1-l06-dividing-mark` (kind foundation-writing) của Bài 6 đổi từ nhóm chính sang khối nền tảng, đổi hiển thị một bài đã phát hành. Xử lý: THU HẸP điều kiện thành danh sách rõ ràng hai kind (foundation-pronunciation, foundation-characters) — Bài 6 trở lại nguyên trạng hiển thị cũ; phát hiện lệch nhãn/kind của Bài 6 (kind ghi foundation-writing và nhãn tóm tắt khối nền tảng của chính Bài 6 có nhắc quy tắc viết dấu cách âm, nhưng KP vẫn hiện ở nhóm chính) ghi nhận là tồn tại cũ, báo Hoa xem xét riêng, không tự ý sửa trong vòng này. Sau thu hẹp: npm run check đạt (validator + 89/89).

## Vòng nâng cấp trải nghiệm Bài 8 — D23 (02/11/2026, bài thí điểm theo yêu cầu của Hoa)

**Hiện trạng trước sửa (kiểm chứng thật):** main 06bf54a (sau PR #47), 0 PR mở, local khớp live contentVersion 20261101-lesson8-coverage1, validator + 89/89 test đạt. Khác biệt so với mục tiêu vòng này: Mục 3 hiện "Năm điều cần nhớ" (2 mẹo tính như điểm chính); từ mới là một danh sách phẳng 24 mục; Pinyin/nghĩa của bài tập có trong DOM trước khi chấm (chỉ ẩn bằng CSS theo công tắc); Tự nói là một đoạn dài gộp 3 hoạt động; Tổng kết hiện "Chưa có câu nào làm sai" kể cả khi chưa làm câu nào; chưa có lộ trình theo tình huống.

**Thay đổi:** lộ trình 6 bước theo tình huống ở Bắt đầu (giữ 7 route + liên kết sâu cũ); từ chia 3 nhóm theo hội thoại (10/7/6+1 tên riêng — đối chiếu phân trang/trang in/track trong dữ liệu) với nút nghe cả nhóm bằng track gốc 8-2/8-4/8-6; 3 điểm chính viết lại bằng lời đơn giản + Khi nào dùng/Thử ngay, mẹo sang khối riêng; quy tắc Pinyin D23 (không render trước khi chấm, trừ bài luyện âm có nhãn); bài tập chia 3 khu A/B/C; mỗi hội thoại có liên kết từ/điểm chính/câu hỏi ngắn; Tự nói tách 3 nhiệm vụ + tự đánh dấu đã luyện (khóa progress cộng thêm `speakingDone`); Tổng kết có 3 điều chính, trạng thái chưa làm trung thực, chi tiết gợi ý/hỗ trợ thu vào "Xem chi tiết".

**QA nội dung vòng 1 (độc lập, đọc trực quan TB in 054–060 + WB 048–050):** 0 Nghiêm trọng, 1 Trung bình, 5 Nhẹ. Đạt: outcomes/goal khớp mục tiêu tr.054; phân nhóm từ khớp bản in 1-1 cả 24 mục (thứ tự + pinyin); 9/9 ví dụ của 3 KP là câu luyện đọc in nguyên trong sách; 3 đáp án quickCheck đúng và duy nhất; checkItemId đúng nội dung từng hội thoại (Hội thoại 1 dùng câu điền từ tổng hợp dựng lại đúng lời thoại — sách không có câu hỏi nghe cho Hội thoại 1); summaryPoints trích đúng nguyên văn. Trung bình T1: sourceNoteVi của nhiệm vụ nói 1/3 ghi nguồn sai/không trung thực (câu mẫu điện thoại thuộc ví dụ tr.060, không phải tr.055; nhiệm vụ 3 là biên soạn thêm nhưng ghi như hoạt động sách) → đã sửa đúng trang + ghi rõ "biên soạn thêm", giao diện nói rõ 3 nhiệm vụ là tổ chức lại theo tình huống. Nhẹ đã sửa hết: L1 "mèo trốn"→"nằm"; L2 đảo đáp án quickCheck sang phương án 2 ở 2/3 câu; L3 nhãn câu hỏi Hội thoại 1 → "Câu hỏi ngắn liên quan"; L4 giữ nguyên văn "见呢" và hai chữ 也 ở câu mẫu; L5 bỏ 学习 (từ Bài 9) khỏi khung thay từ.

**QA code vòng 1 (độc lập, script jsdom riêng 74 kiểm):** ĐẠT rò rỉ (quét từng câu 19 chính + 20 mô phỏng + Bài 1: không Pinyin/nghĩa/chú thích hình trong DOM trước chấm; redup hiện Pinyin + nhãn, ẩn nghĩa phân loại), liên kết sâu 25/25, tương thích tiến độ cũ 12/12 (attempts giữ nguyên byte, điểm lần đầu không đổi, thiếu speakingDone vẫn chạy), quickCheck không ghi attempts 12/12, npm run check 99/99. CHƯA ĐẠT vì 2 Trung bình: TB-1 recordExerciseSupport + khối khởi tạo ghi supportUsed sang cả bộ mô phỏng (bộ không có thanh hỗ trợ) → đã giới hạn chỉ ghi cho bộ chính; TB-2 Tổng kết hiện "Bạn chưa làm bài tập" khi người học chỉ làm đề mô phỏng → đã phân biệt trạng thái (chưa làm cả hai / chỉ làm mô phỏng / đã làm chính). 3 Nhẹ đã sửa: Nhẹ-1 nhiệm vụ nói gắn tog-pinyin-sent/tog-vi-sent + thêm samplePinyin (thanh hỗ trợ hết là nút chết); Nhẹ-2 quickCheck ẩn lại giải thích khi lần bấm hiện tại sai; Nhẹ-3 link Điểm chính ở reader mang ?passage= hai chiều. Quan sát: link ?passage= ở bước prep của learningPath là tham số chết → chỉ gắn cho bước reader.

**Phân loại kiểm thử (sau sửa, trước phát hành):** test tự động: validator OK + 102/102 test (thêm lesson8path.test.mjs 13 test gồm hồi quy QA) · đối chiếu trực quan bản in: QA nội dung đọc lại PDF gốc TB 69–75/WB 55–57 · đối chiếu ASR: không thay đổi mốc đoạn ở vòng này (giữ asr-draft) · kiểm nghe thực tế: KHÔNG (chưa nghe bằng tai người; nút nghe cả nhóm phát track gốc nguyên vẹn, không cắt đoạn) · kiểm giao diện: jsdom + harness responsive (360/390/768/1440) trên bản local và nghiệm thu live sau merge; chưa có kiểm thử Android thật ở vòng này (Bài 8 đã từng được Hoa thử Android thật ở vòng D20, các thay đổi vòng này chưa qua thiết bị thật).

**QA vòng 2 (kiểm lại đúng các điểm đã sửa, độc lập):** QA nội dung: 6/6 ĐẠT (T1 + L1–L5), đủ điều kiện merge. QA code (script jsdom độc lập mới): 5/5 ĐẠT — TB-1 cả hai đường ghi chỉ ghi bộ chính (bộ mô phỏng giữ {}), TB-2 Tổng kết chỉ-làm-mô-phỏng hiện câu phân biệt và điểm 1/1 riêng, Nhẹ-1 thanh hỗ trợ ở Tự nói đổi class/settings thật, Nhẹ-2 giải thích "Thử ngay" ẩn lại khi chọn sai, Nhẹ-3 quay lại từ trang ngữ pháp mở đúng Hội thoại 2. Không phát hiện lỗi mới trong phạm vi kiểm lại. Test dự án tại thời điểm merge: validator OK + 102/102.
**Phát hành + nghiệm thu live (02/11/2026):** PR #48 merge 34b5aa24; Pages live contentVersion 20261102-lesson8-path1; 6/6 file runtime trên URL thật khớp byte bản local đã kiểm thử. Kiểm tương tác trên bản live: lộ trình 6 bước + nút tiếp tục ĐẠT; từ 3 nhóm + nút track gốc 8-2/8-4/8-6 ĐẠT; "Ba điều cần nhớ" + Thử ngay phản hồi đúng ĐẠT; đầu mục Luyện tập có đủ 3 khu A/B/C và câu luyện âm hiện nhãn "Bài luyện âm" + Pinyin ĐẠT (lưu ý vị trí: 4 câu chọn dạng lặp thuộc bộ 19 câu chính nên nằm ở khu A — chúng là bài 语音 2 trong trình tự Workbook và thuộc tập điểm lần đầu đã phát hành từ trước; khu B chứa bài chọn âm tiết nghe–viết, viết chữ, nói theo hình và câu hỏi mở); Tổng kết hiện "Ba điều chính đã học" ĐẠT; hồi quy Bài 1 + Bài 7 tải bình thường; iframe live 360px đủ 7 route và 390px ba route chính không tràn ngang. Chưa bấm phát audio trong lượt nghiệm thu này (chỉ xác nhận nút/track đúng nhãn); chưa Android thật.

## Vòng ẩn chữ dài + tra từ Bài 8 — D24 (02/11/2026)

- **Test tự động:** `npm run check` (node --check 4 file nguồn + validator có kiểm khối `lookup` + node --test) = **110/110 đạt**, gồm 8 test mới ở `tests/lesson8lookup.test.mjs` (segmentZh longest-match; tra 医院/医生/只/漂亮/胡医生→医生； 两 báo thiếu Hán–Việt; cụm có/không có dữ liệu; bài tập 0 token; Phần A: không còn đoạn note mở mặc định, có details "Cách làm bài", gợi ý cạnh nút Xem lời đọc).
- **QA nội dung độc lập (2 vòng):** vòng 1 = 0 nghiêm trọng, 1 Trung bình （这只: ghi chú nói sai căn cứ Hán–Việt — đã sửa bằng cách điền GIÁ CHÍCH ghép từ hai âm đã kiểm chứng 这 GIÁ Bài 3 + 只 CHÍCH Bài 8, ghi rõ trong noteVi), 3 Nhẹ （一 thiếu biến điệu; 小雪 ghi chú mơ hồ; selfCheckIntroVi nằm dưới nhãn "Cách làm bài" → nay tách thành mục "Thông tin thêm"). Vòng 2 = 4/5 đạt, còn 1 Nhẹ: noteVi của 一 giải thích ngược quy tắc biến điệu — đã sửa đúng: yì trước thanh 1/2/3, yí trước thanh 4 (khớp bảng biến điệu của Workbook Bài 3). 5/5 trường hợp bắt buộc （医院/医生/只/漂亮/胡医生） và 2/2 cụm khớp nguyên văn câu gốc; 5 mục hanViet=null （两/小雪/听力/十/二十） đã rà toàn bộ dữ liệu: thật sự chưa có căn cứ, để trống là đúng.
- **QA code độc lập (2 vòng):** vòng 1 script jsdom riêng 59/59 đạt, 9/9 mục: bề mặt cấm (3 khu bài tập gồm deep link từng câu + mô phỏng, quick-check, prep) 0 token; tra cụm/đóng/mở/Escape/bấm ngoài/đổi từ đều đúng; giọng máy ghi nhãn; hồi quy Bài 1/7 0 token. 1 quan sát Nhẹ: thẻ 医院 hiện hàng "Từ thành phần" tĩnh không có dữ liệu — đã sửa (chỉ hiện thành phần khi có ít nhất một thành phần có dữ liệu).
- **Đối chiếu bản in:** dữ liệu tra dùng lại từ vựng đã đối chiếu bản in của dự án + ô 小语助力 tr.055 (Textbook) và phần 汉字 Workbook tr.049–050 cho các mục bổ sung; không có dữ liệu mới ngoài các nguồn này.
- **Kiểm nghe thực tế:** không — giọng trong bảng tra là giọng máy của thiết bị (đã ghi nhãn rõ), không phải audio sách; audio sách không thay đổi ở vòng này.
- **Kiểm giao diện:** jsdom + kiểm tra cấu trúc CSS (sheet cố định ≤640px trên mini player; popover cạnh từ ở màn hình rộng). Chưa Android thật cho vòng này.
- **Nghiệm thu live (PR #50 merge 1e38f6c0, contentVersion 20261102-lesson8-lookup1; byte live 5/5 file runtime khớp local):** tương tác trình duyệt thật 5/5 đạt — bấm 医院 hiện yīyuàn/Y VIỆN/bệnh viện + nút giọng máy, đóng bằng ×; tra cụm 在→工作 hiện nghĩa cả cụm "làm việc ở bệnh viện"; 只 hiện zhī/CHÍCH + ghi chú zhǐ; khối Luyện thêm chỉ còn hai mục thu gọn đóng mặc định, bài tập không có nút tra từ; Bài 1 reader không có tra từ. Không phát audio trong lượt này (giọng tra là giọng máy của thiết bị, không phải kiểm nghe).

## Vòng rà soát ví dụ + giao diện gọn Bài 8 — D25 (02/11/2026)

- **Đối chiếu nguồn (tự đọc trực quan):** Textbook PDF tr.69–75 (in 054–060) + Workbook PDF tr.55–57 (in 048–050). Bảng kiểm kê nội bộ: 13 mục ví dụ giảng dạy/mẫu (mục A) — 11 đã có đầy đủ đúng, 2 thiếu một phần, 0 chưa có, 0 sai chữ. Đã bổ sung: 外边 vào danh sách từ chỉ phía (pattern + giải thích của KP vị trí; sách TB 056 liệt kê 上、下、里、外、前、后、外边）; mẫu hội thoại Hoạt động lớp (TB 060) thành câu mẫu đầy đủ 4 lượt của nhiệm vụ nói 1. Cắt hậu tố nguồn lặp khỏi noteVi của 11 ví dụ (nguồn ở sourceRefs). Bài tập/câu hỏi (mục D: khởi động 6, nghe hiểu 4, tổng hợp 5, mô phỏng 20, phát âm, chữ Hán) đối chiếu khớp, không đổi đáp án/thứ tự.
- **QA nội dung độc lập:** ĐẠT — tự đọc lại 10 ảnh trang: 9/9 câu đọc mẫu khớp từng chữ; 外边 và mẫu Hoạt động lớp đúng nguyên văn; quét lại từng trang không bỏ sót ví dụ nào; 11 bản dịch sau cắt vẫn đúng nghĩa. 1 lỗi Nhẹ ở văn bản kiểm kê (đếm 10 thay vì 11) đã sửa.
- **QA code độc lập (2 vòng):** vòng 1 — test 115/115; cấu trúc .ex-row/.ex-meta, tra từ, công tắc Nghĩa/Pinyin (class trên #main), cỡ chữ không reset cài đặt, hồi quy Bài 1/5/7 + trang grammar đều đạt; 1 lỗi Trung bình: Tra cụm chết trên bề mặt .example vì handler tìm wrap trong .ex-meta — đã sửa (lấy wrap từ khối .example chứa nút) + thêm test hồi quy riêng. Vòng 2 ĐẠT 4/4 (script riêng 35/35): tra cụm từ knowledge/apply/summary đều mở được, reader giữ nguyên, Hủy thoát sạch; test 116/116.
- **Nghiệm thu live (PR #52 merge 18dadbac, contentVersion 20261102-lesson8-exui1; byte live 4/4 khớp):** tương tác 5/5 đạt — công thức có 外边； ví dụ đầu bản dịch "Trong phòng có một con mèo nhỏ." không còn hậu tố nguồn; "Xem thêm ví dụ của sách" có 小雪的手机在桌子上呢。; bấm 小猫 hiện TIỂU MIÊU; tra cụm 在→午饭 ngay trong ví dụ hiện nghĩa cả cụm; apply nhiệm vụ 1 hiện mẫu 4 lượt đầy đủ; Bài 1 knowledge bố cục gọn bình thường. Không phát audio trong lượt này.
- **Kiểm nghe thực tế:** không — vòng này không đổi audio; nút nghe ví dụ dùng cơ chế cũ (audio sách/TTS theo D20).
- **Kiểm giao diện:** jsdom + đọc cascade CSS; trang responsive của dự án dùng để đối chiếu trực quan khung 390px. Trình duyệt kiểm tra không đặt được viewport 390px tùy ý và không đọc được offsetHeight nên không có số đo px tuyệt đối; một lượt chụp qua trang responsive cho kết quả không nhất quán với dữ liệu thật (mô tả trang không tồn tại trong dự án) nên bị loại, không dùng làm bằng chứng. Chưa Android thật.

## Bài 9 《我明天上午在学校学习》 — xây mới theo chuẩn Bài 8 (2026-11-02)

- Nội dung: 3 hội thoại (14 câu, track 9-1/9-3/9-5), 23 từ mới theo 3 nhóm hội thoại (5/7/11, track từ 9-2/9-4/9-6), 3 điểm chính （存现句（1); thứ tự thời gian – nơi chốn; “第” chỉ số thứ tự — đủ "Khi nào dùng" + câu "Thử ngay" + nguyên văn các bộ luyện đọc tr.063/065), 1 điểm nền tảng Hán tự (Workbook tr.058–059: 4 nét + 2 quy tắc thứ tự nét + 4 từ chép), 19 câu chính (6 khởi động tr.061; 4 nghe hiểu hội thoại 2–3; 5 điền từ tr.067, câu (1) hai chỗ trống tách đôi; 4 phân biệt thanh điệu Workbook tr.057 theo dấu thanh in sẵn), 3 bài tự luyện không chấm (đánh dấu thanh điệu unverified; nói theo hình tr.067; trả lời câu hỏi tr.064/066), Áp dụng theo hoạt động đóng vai tr.068, Tổng kết 4 điểm, tra từ phủ 30/30 bề mặt đích. Bảng tự đánh giá liên bài 7–9 (tr.068–069) không đưa vào bài theo tiền lệ khối liên bài ở Bài 6. 11 hình minh họa mới do dự án tự tạo.
- Kiểm thử tách loại: test tự động 164/164 (thêm tests/lesson9standard.test.mjs 5 test; cập nhật bộ đếm toàn cục đã kiểm chứng độc lập: câu hội thoại có đoạn 105→119, từ vựng [159,167]→[182,190], lựa chọn [173,455]→[173,540]); đối chiếu trực quan bản in: toàn bộ TB tr.061–069 và WB tr.057–059 đã đọc trực tiếp khi biên soạn; đối chiếu ASR: căn đoạn câu/từ bằng faster-whisper mức từ trên file tải từ CDN (mọi đoạn giữ asr-draft); kiểm nghe thực tế: chưa thực hiện; kiểm giao diện: harness jsdom (trang mở đầu, trang từ, trang luyện tập của Bài 9).
- QA nội dung độc lập: ĐẠT ở cả 7 mục kiểm (hội thoại, từ vựng, điểm kiến thức, 19 đáp án, bài tự luyện, phạm vi, tổng kết/áp dụng) — không có lỗi phải sửa; một góp ý hoàn thiện không chặn （今天/认识 thiếu ở mục ví dụ của điểm Hán tự) đã bổ sung ngay trong nhánh và kiểm lại đạt.
- Phát hành: PR #82 đã gộp; nghiệm thu live 5/5 ĐẠT (mở đầu + lộ trình, 3 nhóm từ + nút Tiếp tục đúng quy tắc D26, tra từ, chấm thử câu khởi động và câu điền từ đều đúng, tổng kết 4 điểm); byte hình trên Pages khớp 11/11. Nghiệm thu cũng phát hiện một lỗi nhãn ở thành phần dùng chung: tiêu đề khối Tổng kết ghi cứng “Ba điều chính đã học” dù nhiều bài có 4 điểm — đã sửa thành “Những điều chính đã học” ở PR #83, test 164/164, live `20261103-summaryheading1`.

## Bài 10 《这儿的苹果真便宜！》 — xây mới theo chuẩn Bài 8 (2026-11-03)

- Nội dung: 3 hội thoại (16 câu, track 10-1/10-3/10-5), 23 từ mới theo 3 nhóm hội thoại (7/6/10, track từ 10-2/10-4/10-6), 3 điểm chính （钱数的表达 kèm bảng luyện đọc 6 số tiền tr.072; 形容词谓语句 kèm 3 câu luyện đọc tr.074; 疑问代词“怎么样” kèm 3 cặp hỏi–đáp tr.076 — đủ "Khi nào dùng" + câu "Thử ngay"), 1 điểm nền tảng Hán tự （汉字书写（3), Workbook tr.067–068: 4 nét 横折/横撇/竖折/竖提 + 2 quy tắc + 4 từ chép), 20 câu chính (6 khởi động tr.070; 4 nghe hiểu hội thoại 2–3 đáp án theo lời thoại in tr.073/075; 5 điền từ tr.076, câu (2) hai chỗ trống tách đôi; 5 phân biệt thanh điệu Workbook tr.066 theo dấu thanh in sẵn), 3 bài tự luyện không chấm (đánh dấu thanh điệu unverified; nói theo hình tr.077; trả lời câu hỏi tr.075), Áp dụng theo hoạt động đóng vai ba người tr.077, Tổng kết 4 điểm, tra từ phủ 34/34 bề mặt đích. Video 彩蛋 “认识人民币” tr.077 ngoài phạm vi app; track Workbook 10-2 thuộc phần đề mô phỏng (D15) không dùng. 11 hình minh họa mới do dự án tự tạo.
- Kiểm thử tách loại: test tự động 169/169 (thêm tests/lesson10standard.test.mjs 5 test; cập nhật bộ đếm toàn cục đã kiểm chứng độc lập: câu hội thoại có đoạn 119→135, từ vựng [182,190]→[205,213], lựa chọn [173,540]→[173,628]); đối chiếu trực quan bản in: toàn bộ TB tr.070–077 và WB tr.066–068 đã đọc trực tiếp khi biên soạn; đối chiếu ASR: căn đoạn câu/từ bằng faster-whisper mức từ trên file tải từ CDN (mọi đoạn giữ asr-draft); kiểm nghe thực tế: chưa thực hiện; kiểm giao diện: harness jsdom (trang mở đầu, trang từ, trang luyện tập của Bài 10).
- QA nội dung độc lập vòng 1: ĐẠT 6/7 mảng (hội thoại 16 câu; 23 từ + Hán–Việt từng chữ; 4 điểm kiến thức; khởi động + nghe hiểu + điền từ; bài tự luyện; áp dụng/tổng kết; ký hiệu track). 1 lỗi NGHIÊM TRỌNG ở câu phân biệt thanh điệu nhóm 2 (wb10-tone-2): biên soạn đọc nhầm dấu thanh trên ảnh kiểm kê 100 DPI — sách in xiě (thanh 3) / chá (thanh 2) / jiě (thanh 3) nên âm khác thanh là chá, dữ liệu ghi xiè/jié và đáp án "1". QA phân xử bằng render 300 DPI từ PDF gốc; biên soạn cũng tự render 300 DPI xác nhận độc lập. Đã sửa prompt/nhãn/đáp án → "2" trong nhánh. QA còn bắt 2 lỗi nhỏ: courseTagsVi của Bài 10 sót nguyên nhãn của Bài 7 (kiểm tra mở rộng phát hiện Bài 9 cũng dính lỗi này từ khi biên soạn — đã sửa cả hai bài) và dấu phẩy toàn giác lẫn trong Tổng kết điểm 2.
- QA vòng 2 kiểm lại: wb10-tone-2 ĐẠT, courseTagsVi ĐẠT; mục dấu câu còn sót 2 dấu phẩy toàn giác → đã sửa nốt và quét lại toàn bài (hai vị trí còn lại là dấu câu trong nguyên văn tiếng Trung của khung câu tự luyện — đúng bản in). QA vòng 3 kiểm lại điểm dấu câu: ĐẠT (U+FF0C = 0 trong chuỗi đích).
- Phát hành: PR #85 (merge a5a8a960); nghiệm thu live 5/5 ĐẠT (mở đầu + lộ trình 6 bước; 3 nhóm từ 7/6/10; nút Tiếp tục Từ cần biết → Hiểu cách dùng → Nghe & đọc, kiểm 2 lần; chấm thử câu wb10-tone-2 trên bản live — chọn chá được chấm Đúng kèm giải thích khớp; tra từ 苹果/水果 hiện đủ pinyin + Hán–Việt + nghĩa); byte dữ liệu trên Pages khớp bản local, hình khớp 11/11; live `20261103-lesson10-standard1`.

## Sửa lỗi nút nghe cho câu nghe hiểu — Bài 5–10 (2026-11-03)

- Người dùng báo trên iOS: câu 7/20 Bài 10 ("Câu hỏi nghe hiểu Hội thoại 2... 这儿的水果（）。") không thấy nút phát audio. Tái hiện từ dữ liệu: cả 24 câu dạng "Câu hỏi nghe hiểu" của Bài 5–10 đều thiếu `audioSegment` — renderer chỉ hiện nút "▶ Nghe đoạn của câu này" khi có trường này. Đây là thiếu sót biên soạn lặp lại từ Bài 5 (các vòng chuẩn hoá D27 và xây Bài 9–10 đều mang theo), không phải lỗi riêng Bài 10.
- Sửa: gắn cho mỗi câu đoạn hội thoại chứa thông tin đáp án trên đúng track của bài (mốc lấy từ đoạn câu đã căn ASR ở mục Nghe & đọc, giữ trạng thái asr-draft). Kiểm chứng độc lập: 24/24 ánh xạ ĐẠT (đoạn chứa đúng câu mang đáp án; 3 ghi chú biên về chạm biên 0.04–0.07 giây ở Bài 6, vô hại). Thêm test hồi quy `tests/listenseg.test.mjs`: mọi câu "Câu hỏi nghe hiểu" phải có audioSegment hợp lệ trong thời lượng track — test toàn bộ 170/170.
- Phát hành: PR #87 (merge 663f9cb7), live `20261103-listenbtn1`; nghiệm thu live tại đúng câu người dùng báo: nút hiện dưới tiêu đề câu, bấm phát đúng đoạn Hội thoại 2 (trình phát mini chạy và dừng ở cuối đoạn).
- Ngoài phạm vi sửa này: các câu phân biệt thanh điệu/phát âm ở Bài 8–10 không gắn đoạn theo từng nhóm vì ASR của track Workbook phát âm không đủ tin cậy để cắt đoạn (âm tiết bị nhận dạng nhiễu nặng); các câu này có đáp án suy ra từ dấu thanh in sẵn như đã ghi ở SOURCE_AUDIT, và track phát âm đầy đủ vẫn nghe được ở bài tự luyện tương ứng.

## Kiểm hồi quy Bài 8 — chốt chặng chuẩn hoá D27 (2026-11-02)

- Audit chuẩn (`scripts/audit-standard.mjs`) trên dữ liệu hiện tại: cả 8 bài đều đạt mọi cột. Riêng Bài 8 (bài mẫu chuẩn): lộ trình 6 bước; từ vựng 3 nhóm hội thoại với 23 từ + 1 tên riêng; 3/3 điểm chính có mục "Khi nào dùng" và câu "Thử ngay"; tổng kết 3 điểm; tra từ phủ 33/33 bề mặt đích; bài chính 19 câu; 3 bài tự luyện; bộ đề mô phỏng 20 câu tách riêng.
- Test tự động toàn bộ: 159/159 đạt trên phiên bản live `20261102-lesson6-images3`.
- Kiểm nhanh live 5/5 ĐẠT: (1) trang mở đầu có hình ngữ cảnh và lộ trình 6 bước; (2) trang Từ cần biết đủ 3 nhóm, mỗi từ có loa riêng; nút Tiếp tục ở trang Từ cần biết chuyển sang mục Hiểu cách dùng, không tự liên kết — kiểm 2 lần (quy tắc D26 giữ nguyên sau mọi vòng phát hành kể từ khi sửa); (3) tra từ trên trang hội thoại: chạm vào một từ hiện pinyin và nghĩa tiếng Việt kèm nút nghe; (4) trang Luyện tập ghi rõ Bài chính 19 câu, bộ mô phỏng 20 câu điểm riêng, mục lỗi cần sửa 9 câu; làm thử một câu và chấm đúng/sai hoạt động; (5) trang Tổng kết hiển thị 3 điểm, không lỗi.
- Không phát hiện lỗi hồi quy nào; không cần vòng sửa. **Chặng chuẩn hoá D27 chính thức hoàn tất: Bài 1–7 đã chuẩn hoá theo chuẩn Bài 8, Bài 8 kiểm hồi quy đạt.** Việc tiếp theo là Bài 9.

## Vòng sửa lỗi nút Tiếp tục ở mục Bắt đầu — D26 (02/11/2026)

- **Báo cáo thiết bị thật (Hoa, Android):** tại mục Bắt đầu của Bài 8, nút "Tiếp tục học" trong khối Lộ trình không phản ứng khi chạm (kèm ảnh chụp: dòng "lần trước bạn ở mục: Bắt đầu").
- **Tái hiện + nguyên nhân:** script jsdom với đúng trạng thái đó cho thấy đích của nút là `#/lesson/hsk1-l08/intro` — chính trang đang mở (mục đang xem được ghi vào `lastSectionId` ngay khi mở trang, và công thức tính đích cũ lấy mục dở dang đó). Bấm vào liên kết cùng hash không đổi route nên không có phản ứng. Không phải lỗi vùng chạm hay lớp phủ.
- **Bản sửa:** khối Lộ trình nhận biết mục đang chứa nó; khi nằm trong trang mục, đích là mục chưa hoàn thành tiếp theo (đã xong hết thì mục cuối), không bao giờ là route hiện tại. Trang tổng quan bài giữ nguyên nghĩa học tiếp theo mục dở dang. Ghi quyết định D26.
- **Kiểm thử:** test hồi quy mới thao tác qua giao diện thật (bấm nút → sang Từ cần biết; đánh dấu đã học 2 mục → đích thành Hiểu cách dùng; trang tổng quan vẫn resume về Nghe & đọc). npm run check 117/117. QA code độc lập ĐẠT 5/5 bằng script jsdom riêng (trạng thái tạo bằng thao tác thật); QA ghi nhận 1 lần test mới của dự án chập chờn do chờ ngắn sau cú bấm — đã đổi khẳng định đếm nhóm từ sang chờ có thăm dò, chạy lại file test 5 lần đều 14/14.
- **Nghiệm thu live (PR #54 merge 28a0e0fa, contentVersion 20261102-lesson8-continue1; byte live 3/3 khớp):** tại trang Bắt đầu bản live, bấm nút "Tiếp tục học" trong khối Lộ trình 2 lần liên tiếp (có quay lại trang Bắt đầu giữa hai lần) — cả hai lần đều chuyển sang Từ cần biết (Mục 2/7) với đủ 3 nhóm từ, không lần nào đứng yên tại Bắt đầu. Chưa kiểm lại trên Android thật — chờ Hoa chạm thử trên máy của mình.
- **Kiểm nghe/đối chiếu bản in:** không áp dụng — vòng này chỉ sửa điều hướng, không đổi nội dung/audio.

## Vòng chuẩn hoá theo Bài 8 (D27) — Giai đoạn 1 + Bài 1 (02/11/2026)

- **Giai đoạn 1 (hệ thống):** khảo sát Bài 8 bản đã duyệt (contentVersion 20261102-lesson8-continue1) và lưu chuẩn vào `docs/LESSON_STANDARD.md` (cấu trúc bài, lộ trình, từ mới, kiến thức, bài tập 3 khu, tra từ, audio, điều kiện hoàn thành, phát hành/tiếp tục); liên kết từ `AGENTS.md` (mục 11) và `docs/CONTENT_STANDARD.md`; ghi quyết định D27 (thứ tự mới: chuẩn hoá Bài 1→8 rồi mới làm bài mới); công cụ cơ giới `scripts/audit-standard.mjs` in độ phù hợp từng bài (trước vòng này: Bài 1–7 đều thiếu lộ trình/nhóm từ/Thử ngay/tổng kết/tra từ; Bài 8 đạt).
- **Đối chiếu Bài 1 (tự đọc trực quan):** Textbook PDF 16–19 (in 001–004) + Workbook PDF 8–11 (in 001–004). Đã có–đúng: 12 từ mới, 10 câu hội thoại (2+4+4), 3 điểm chính + 3 KP nền tảng phát âm （对应 Workbook 小语讲堂）, 3 câu chọn lời thoại theo hình (WB tr.004 bài 5), 3 bài nghe–viết tự luyện st-01..03 có đáp án verified-editorial từ lời đọc (WB tr.004 bài 2–4), hoạt động đóng vai. **Thiếu → đã bổ sung:** tên riêng 王老师 (sách liệt kê ở mục 专有名词 tr.001; app cũ thiếu hẳn) kèm nhóm từ theo hội thoại + prepGroups/prepSummaryVi; learningPath 6 bước; useWhenVi + quickCheck cho 3 điểm chính; summaryPoints; tra từ cho Bài 1 (từ điển nền nay gồm cả từ vựng bài pilot — trước đây chỉ gồm additionalLessons; extras: 小语； độ phủ tách từ trên bề mặt đích 18/18 theo audit script). **Sửa dùng chung:** nhãn đếm nhóm từ tính từ dữ liệu (Bài 8 nhóm 3 trước ghi "7 từ + 1 tên riêng", đúng là "6 từ + 1 tên riêng"). **QA nội dung vòng 1 bắt 2 Trung bình + 1 Nhẹ, đã sửa hết trong nhánh:** (TB-1) mô tả bước 2 của lộ trình gắn 您 vào Hội thoại 1 — sai, 您 ở Hội thoại 2 → đã sửa mô tả; (TB-2) thiếu hẳn bài đọc vè 跟读绕口令 (TB tr.004) → đã bổ sung thành KP nền tảng kèm track gốc 1-7 (thời lượng 17,235s đo từ chính file nguồn; phát cả track, không chia đoạn) + nút nghe track ngay trong thẻ; (Nhẹ) KP thanh điệu thiếu 4/8 nhóm âm tiết của WB tr.004 bài 1 → đã bổ sung đủ 8 nhóm. **Giới hạn còn lại:** video Pinyin 小语的彩蛋 (TB tr.004) là nội dung video ngoài app, không tích hợp (app dạy Pinyin qua các KP nền tảng của Workbook); 王老师 không có mốc audio đáng tin nên để `audio: null` (thẻ từ dùng giọng máy như mọi từ; không đoán mốc).
- **QA code vòng 1 (độc lập, script jsdom riêng 19/20):** đạt các mục Bài 1 (lộ trình/nhóm từ/Thử ngay/tra từ) và hồi quy Bài 8; 1 yêu cầu kiểm tra sai từ phía giao việc （老师 không hề xuất hiện trong hội thoại Bài 8 — bằng chứng thay thế: tra 医生 ở Bài 8 hoạt động, nguồn ghi đúng Bài 8) nên không tính lỗi app. QA bắt 3 điểm ở tài liệu/cơ chế: (5.1) Tự nói Bài 1 còn cấu trúc cũ, câu mẫu không tra từ được → đã chuyển sang `apply.tasks` (2 nhiệm vụ đóng vai, câu mẫu toàn bộ Hội thoại 2/3) + bỏ câu cứng "Ba nhiệm vụ" trong renderer dùng chung; (5.2) công thức độ phủ của audit script hẹp hơn phạm vi §4 công bố → đã mở rộng tính cả ví dụ KP Mẹo và câu mẫu tự nói (Bài 1: 20/20; Bài 8: 33/33); (5.3) wording "2 ví dụ hiện" → "tối đa 2 ví dụ hiện".
- **QA vòng 2 (kiểm lại toàn bộ điểm sửa):** nội dung ĐẠT 4/4 (bước 2 hết gắn sai 您; đọc vè khớp nguyên văn + pinyin + nghĩa; đủ 8/8 nhóm thanh đúng thứ tự/dấu thanh; hai nhiệm vụ đóng vai khớp toàn bộ hội thoại + ghi nguồn đúng trang; 1 ghi chú đồng đều dữ liệu đã sửa). Code ĐẠT 4/4 (script riêng 12/12): tự nói tasks có token + đánh dấu đã luyện lưu đúng; nút nghe track đọc vè phát đúng URL track 1-7 ở cả trang kiến thức và trang grammar riêng; audit in Bài 1 phủ 20/20, Bài 8 phủ 33/33; hồi quy Bài 8 apply + Bài 1 exercises đạt.
- **Kiểm thử:** npm run check 127/127 (test mới cho Bài 1 gồm đọc vè + 8 nhóm thanh + tự nói tasks; cập nhật 4 test cũ mà tiền đề đã thay đổi: đếm loa/Hán–Việt toàn cục 161→162, test tra từ dùng Bài 2 làm bài chưa chuẩn hoá, test "bài không có lộ trình" chuyển sang Bài 2).
### Bài 2 《我叫李文》 — chuẩn hoá theo D27 (`20261102-lesson2-standard1`)

- **Đối chiếu trực quan:** TB in 005–009 (PDF 20–24) + WB in 005–008 (PDF 12–15). Đã có–đúng: 15 từ mới (6/5/4 theo hội thoại); 10 câu hội thoại; 5 điểm chính （叫/是/ xin lỗi/ trật tự từ/ tên người) đã gồm cả 3 ô trợ giúp của sách trong phần giải thích （请问 lịch sự; 没事/没事儿 là biến thể khẩu ngữ của 没关系； họ trước tên sau); 2 điểm nền tảng (thanh/vận mẫu (2) + 4 quy tắc chính tả); 16 thẻ từ kèm hình của Workbook; 4 câu chọn lời thoại theo hình (đáp án in 3/1/4/2); 3 bài nghe–viết (9/15/12 ô, đáp án verified-editorial theo lời đọc).
- **Thiếu/sai đã sửa:** (1) thiếu hẳn bài đọc vè + track 2-7 → bổ sung KP nền tảng + track gốc (22,969s đo từ file nguồn; phát cả track); (2) KP trật tự từ thiếu câu luyện đọc thứ ba của sách 我是学生。→ đã thêm; (3) liên kết ôn tập của câu hình 1 trỏ KP trật tự từ — không khớp nội dung câu （很高兴认识你， hội thoại làm quen) → trỏ lại KP 叫 (giới thiệu), đúng quy tắc liên kết ngữ nghĩa D17.
- **Nâng cấp theo chuẩn:** learningPath 6 bước; prepGroups 3 nhóm + prepSummaryVi; useWhenVi + quickCheck đúng schema dự án (answer là chỉ số đáp án) cho 5 điểm chính; summaryPoints 3 điểm (ví dụ nguyên văn hội thoại); apply.tasks 2 nhiệm vụ đóng vai (mẫu toàn bộ Hội thoại 1 và 3, ghi nguồn tr.006/008–009); tra từ mở cho Bài 2 với extras là 4 tên người trong bài （陈天中/白家月/李文/安妮， Hán–Việt suy theo từng chữ) + 学生 — phủ bề mặt đích 27/27. Bài này sách không liệt kê mục tên riêng riêng và không có câu hỏi đọc hiểu in sẵn sau hội thoại (chỉ đóng vai) — không bịa thêm.
- **Bài học kỹ thuật ghi lại:** ba lỗi schema do tự suy diễn đã bị test bắt và sửa trong nhánh — quickCheck phải theo schema {questionVi, stemZh, options[{zh,vi}], answer = chỉ số dạng chuỗi}; dialogueGroup đánh số từ 1; learningPath là mảng bước {step, titleVi, descVi, sectionId, dialogueId}. Từ Bài 3 trở đi phải đọc schema từ dữ liệu Bài 8/Bài 1 trước khi viết.
- **QA độc lập (một vòng, đạt ngay trên bản cuối):** nội dung ĐẠT 8/8, 0 lỗi (từ/phân nhóm khớp từng trang; 5 Thử ngay chấm đúng theo quy ước chỉ số đã kiểm chứng trong mã; đọc vè nguyên văn; extras tên người đúng từng chữ Hán–Việt; nhiệm vụ tự nói khớp toàn bộ hội thoại; liên kết hình 1 được xác nhận hợp lý hơn liên kết cũ). Code ĐẠT 7/7 (script jsdom riêng 23/23: lộ trình + CTA, nhóm từ 6/5/4 + nút nghe cả nhóm đúng track, "Năm điều cần nhớ", Thử ngay 是 không ghi attempts, nút track đọc vè phát đúng URL, tra 陈天中/学生， bài tập 0 token, hồi quy Bài 1/8/3).
- **Kiểm thử:** npm run check 132/132 (5 test mới cho Bài 2 + cập nhật các test có tiền đề thay đổi: đếm KP/track Bài 2, liên kết hình 1 ở test Bài 3, bài chưa chuẩn hoá chuyển sang Bài 3 ở 2 test, dòng tóm tắt từ vựng ở test thanh hỗ trợ).
## Vẽ lại toàn bộ hình Bài 1–3 theo chuẩn tranh phẳng Bài 8 (chỉ đạo của Hoa, 2026-11-02)

- **Phạm vi:** 14 file hình đang là ảnh trích từ sách ở Bài 1–3 — Bài 1: 3 hình bài chọn hội thoại (Workbook tr.004) + 1 hình ngữ cảnh lớp học; Bài 2: 4 hình (Workbook tr.008) + 1 hình ngữ cảnh; Bài 3: 4 hình (Workbook tr.012) + 1 hình ngữ cảnh. (2 tranh của bài Dùng hình để nói ở Bài 3 đã là tranh vẽ mới từ vòng chuẩn hoá Bài 3.) Bài 4–7 chưa nằm trong chỉ đạo lần này.
- **Cách làm (giống Bài 8):** tạo 4 tờ lưới tranh minh họa phẳng 2×2 theo mô tả cảnh bằng lời, cắt thành hình lẻ 760×760, đối chiếu trực quan từng hình với câu hỏi và đáp án của bài: mỗi hình thể hiện đủ ý của hội thoại đúng và không khớp hội thoại nào khác trong cùng bộ (Bài 1: chào 1–1 / cảm ơn khi được trao sách / chào một nhóm; Bài 2: bắt tay lần đầu gặp / vẫy tay tạm biệt cô giáo / đứng trước lớp tự giới thiệu / cúi đầu xin lỗi–đáp không sao; Bài 3: cô giáo trước bảng / người mặc vest nói điện thoại / đôi nam nữ trên ghế máy bay / giới thiệu bạn gái).
- **Dữ liệu đi kèm:** chú thích và alt của 11 câu hình + 3 hình ngữ cảnh đã đổi từ "Hình gốc" sang ghi rõ tranh vẽ mới theo cảnh nào; ATTRIBUTION.md của 3 bài đã viết lại; kích thước khai báo của hình ngữ cảnh cập nhật 760×760. Đáp án và thứ tự câu hỏi không đổi; test 137/137.
- **QA hình ảnh độc lập: ĐẠT 14/14, 0 hình gây nhầm đáp án** (mở xem từng file, đối chiếu từng đáp án trong bộ). Ba ghi chú nhẹ không cần vẽ lại: hình tạm biệt Bài 2 dựa vào ba lô + cô giáo + cổng trường để phân biệt với chào (trong bộ không có đáp án chào cạnh tranh); nhân vật tự giới thiệu ở Bài 2 có tóc xoăn nâu (khác tạo hình nhân vật trong sách nhưng cảnh đứng trước lớp là duy nhất); hình cô giáo Bài 3 chỉ có một mình cô — đúng bố cục ảnh gốc và đúng trọng tâm câu hỏi. (Nghiệm thu live bổ sung ở PR sổ sách.)

### Bài 7 《我晚上六点半下班》 — chuẩn hoá theo D27 (2026-11-02)

- **Đối chiếu nguồn:** Textbook tr.045–053 (mục tiêu, khởi động nối giờ – đồng hồ, 3 hội thoại, 4 điểm Tiểu Ngữ, bài tổng hợp, hoạt động lớp điền bảng thời gian) + Workbook tr.039–041 (phân biệt thanh mẫu đưa hơi, vận mẫu mũi trước/sau). Đề mô phỏng Workbook từ tr.042 loại theo D15.
- **Bổ sung:** dialogueGroup 9/8/10 cho 27 từ; prepGroups 3 nhóm (track 7-2/7-4/7-6); learningPath 6 bước; useWhen + quickCheck cho cả 4 điểm chính; KP giờ bổ sung đủ bộ luyện đọc tr.047 (bảng 5 giờ + bộ buổi); 2 câu hỏi đọc hiểu in ở tr.051 (wb7-text-5/6); 6 câu khởi động nối giờ – đồng hồ tr.045; bài dùng hình để nói có đáp án gợi ý theo giờ đọc trực tiếp trên ảnh gốc phóng to; apply thêm nhiệm vụ hoạt động lớp tr.053 (mẫu dựng thành câu từ bảng ví dụ của Tiểu Ngữ, đã ghi rõ nguồn); summaryPoints 4; tra từ phủ 38/38 (extras: tên nhân vật + 安妮 + 中午/零/两/午饭 + chữ số 一–十).
- **Phạm vi ghi rõ:** bài đọc giới thiệu chữ Hán （汉字简介） ở Workbook tr.040–041 và video bonus 学汉字 (Textbook tr.053) không tích hợp trong app — quyết định phạm vi có chủ đích, ghi ở SOURCE_AUDIT; bài "hoàn thành đối thoại" trong phần Tiểu Ngữ tr.050 không chuyển thành câu chấm tự động vì đáp án không duy nhất.
- **Hình ảnh:** 11 tranh phẳng vẽ mới: 6 đồng hồ khởi động (kim đặt bằng phép tính góc theo giờ đọc trên bản phóng to trang in), 4 đồng hồ bài nói theo hình, hình ngữ cảnh hai nhân vật gọi điện. Năm file classroom + speaking-1..4 trước đây là ẢNH TRÍCH TRỰC TIẾP từ sách — đã thay toàn bộ bằng tranh vẽ mới, giữ nguyên tên file.
- **QA độc lập:** nội dung ĐẠT toàn bộ 10 mục + mục kiểm thêm (QA tự đọc kim cả 10 đồng hồ ở bản in và đối chiếu đáp án; kiểm từng cặp âm ở hai bài tự luyện Workbook), code ĐẠT 4/4 (test 159/159, audit tra từ 38/38, DOM đúng "gồm 2 phần", probe deep link xác nhận lựa chọn đồng hồ không hiển thị pinyin/chú thích trước khi chấm). QA hình ảnh: 11/11 dùng được (10 đạt hẳn, hình ngữ cảnh lệch nhỏ; giờ trên bản vẽ khớp bản gốc ở cả 10 đồng hồ). Không có lỗi phải sửa — vòng này đạt ngay một vòng QA. Ghi chú của QA: thuộc tính alt của hình đồng hồ có nêu giờ bằng chữ — không phải rò rỉ hiển thị, và là điều kiện để người dùng trình đọc màn hình làm được bài nối giờ.
- **Vẽ lại hình theo yêu cầu của Hoa (2026-11-02, bản images2):** Hoa nhận xét bộ hình bản standard1 "quá sơ sài" và yêu cầu xem lại PDF gốc, mô phỏng đẹp hơn. Đã vẽ lại cả 11 hình: đồng hồ đủ số 1–12 + vạch 60 phút + kim hình thoi + bóng đổ và bóng kính; hình ngữ cảnh có khuôn mặt đầy đủ (mắt/mày/má hồng/miệng cười), tóc và trang phục đúng nhân vật ảnh gốc tr.046, nền hồng chia CHÉO đúng gốc (bản trước chia dọc); các hình bài nói có đủ bối cảnh (tay ấn nóc đồng hồ báo thức + cửa sổ nắng; tường hồng có kim giây đỏ như gốc; cảnh đêm có trăng/sao/ánh đèn thành phố; tường tím). Giờ trên đồng hồ giữ nguyên bằng phép tính góc — đáp án không đổi. QA hình độc lập: 11/11 ĐẠT, tự đọc kim cả 10 đồng hồ khớp kỳ vọng; ghi chú nhỏ duy nhất: ở speaking-1 ngón tay che số 11–12 (trung thực theo ảnh gốc, tay thật cũng che đỉnh đồng hồ; giờ 7:20 vẫn đọc rõ). contentVersion `20261102-lesson7-images2`.
- **Nghiệm thu live (images2):** PR #74 merge 779c9493; bản live đúng contentVersion `20261102-lesson7-images2`; sha256 11/11 file hình trên Pages khớp bản local; kiểm trực quan live 2/2 ĐẠT (hình ngữ cảnh có khuôn mặt + nền chia chéo; 6 đồng hồ lựa chọn đủ số 1–12 và vạch phút, đã phóng to kiểm tra).
- **Nghiệm thu live:** contentVersion `20261102-lesson7-standard1` đúng; sha256 11/11 file hình trên Pages khớp bản local; kiểm trực quan 3/3 ĐẠT (lộ trình 6 bước + tranh ngữ cảnh mới; đầu trang "gồm 2 phần"; câu nối giờ hiển thị lựa chọn là hình đồng hồ A–F không kèm pinyin/đáp án chữ). Lưu ý của lượt kiểm: hồ sơ trình duyệt đã có sẵn trạng thái đã chấm của câu nối giờ nên không tái hiện được trạng thái trước khi chấm trên live — trạng thái đó đã được QA kiểm bằng probe DOM trên bản kiểm thử.

### Bài 6 《你的手机号是多少？》 — chuẩn hoá theo D27 (2026-11-02)

- **Đối chiếu nguồn:** Textbook tr.035–042 (mục tiêu, khởi động nối từ – hình, 3 hội thoại, 3 điểm Tiểu Ngữ, bài tổng hợp, hoạt động lớp điền bảng bữa sáng) + Workbook tr.031–032 (nhi hóa, dấu cách âm, nghe – đọc). Khối tổng kết Bài 4–6 ở Textbook tr.043–044 là bảng tự đánh giá liên bài, không thuộc nội dung riêng của Bài 6 — không đưa vào app vòng này. Từ mô phỏng Workbook từ tr.033 loại theo D15.
- **Bổ sung:** dialogueGroup 3/9/10 cho 22 từ + tên riêng 西安饭店 sách liệt kê ở tr.040 mà dữ liệu cũ thiếu hẳn (prepWords 22 + 1); prepGroups 3 nhóm (track 6-2/6-4/6-6); learningPath 6 bước; useWhen + quickCheck cho 3 điểm chính; KP nhi hóa đủ 7 từ theo bảng in; 2 câu hỏi đọc hiểu in ở tr.039 (wb6-text-5/6); 6 câu khởi động nối từ – hình tr.035; bài dùng hình để nói có đáp án gợi ý; apply thêm nhiệm vụ hoạt động lớp tr.042 (mẫu dựng thành câu từ bảng ví dụ của Tiểu Ngữ, đã ghi rõ nguồn); summaryPoints 4 (gồm cách đọc số điện thoại từng chữ số, số 1 đọc yāo); tra từ phủ 30/30 (extras: 7 tên nhân vật + cách gọi ngắn 家月 + chữ số 一–十).
- **Hình ảnh:** 11 tranh phẳng vẽ mới mô phỏng đúng ảnh gốc PDF (khởi động 6, nói theo hình 4, ngữ cảnh 1). Đáng chú ý: 5 file hình Bài 6 trước đây (classroom + speaking-1..4) là ẢNH TRÍCH TRỰC TIẾP từ sách — đã thay toàn bộ bằng tranh vẽ mới, giữ nguyên tên file.
- **QA độc lập:** nội dung ĐẠT toàn bộ 10 mục (kiểm từng chữ số của hai số điện thoại và cách đọc yāo; bảng ví dụ bữa sáng tr.042 đối chiếu từng ô), code ĐẠT 5/5 (test 154/154, audit tra từ 30/30, DOM đúng "gồm 2 phần", không lộ pinyin/đáp án trước khi chấm, nhóm 3 hiển thị "10 từ + 1 tên riêng"). QA hình ảnh: 11/11 dùng được (8 đạt hẳn; 3 lệch nhỏ không đổi đáp án: bình sữa trừu tượng, mặt cơm tách khỏi bát, hai nhân vật ngữ cảnh đứng thay vì ngồi). Không có lỗi phải sửa — vòng này đạt ngay một vòng QA.
- **Nghiệm thu live ĐẠT** (sau PR #70 merge e79e182f): contentVersion live 20261102-lesson6-standard1; Bài 6 trên live có đủ 17 câu chính, 23 mục từ (22 + tên riêng), 2 nhiệm vụ Tự nói, lookup; sha256 của cả 11 file hình trên GitHub Pages khớp byte với bản local. Kiểm trực quan trang live bổ sung ở PR sổ sách.

### Vẽ lại hình Bài 6 đẹp hơn (2026-11-02)

- Bộ hình Bài 6 cũ (người que và khối trừu tượng ở vòng chuẩn hoá) được vẽ lại toàn bộ theo mức hoàn thiện mới: 11 file. Cảnh dùng minh họa sinh mới đúng phong cách dự án: hai học viên cầm điện thoại ở bàn (theo tr.036), gia đình ăn tối, hai tay cầm điện thoại (tr.041), siêu thị có xe đẩy, taxi cam có hộp đèn nóc (tr.042), đĩa bánh bao, điện thoại màn hình hồng, sữa rót vào ly, bát cơm. Hình siêu thị dùng chung cho speaking-2 và warm-market, hình taxi dùng chung cho speaking-3 và warm-taxi (cùng khái niệm, thuộc hai bộ câu hỏi khác nhau).
- QA hình độc lập: 11/11 ĐẠT — mọi hình đúng một khái niệm, bộ khởi động 6 hình phân biệt rõ, không còn yếu tố sơ sài. contentVersion `20261102-lesson6-images2`.
- Phát hành lần 1 (PR #78, `20261102-lesson6-images2`): nghiệm thu live khớp byte 11/11 nhưng kiểm trực quan phát hiện hình ngữ cảnh chưa đúng bố cục ảnh gốc — hai học viên cùng hướng về phía người xem thay vì ngồi đối diện nhau như tr.036 (trong ảnh gốc, Bạch Gia Nguyệt tóc sáng áo tím nhạt ngồi bên trái, Lý Văn áo khoác denim ngồi bên phải, đối diện qua bàn tròn nhỏ có lọ hoa). Đã sinh lại riêng hình này đúng bố cục đối diện nhìn nghiêng và phát hành bản sửa `20261102-lesson6-images3` (PR #79). **Nghiệm thu live bản sửa:** contentVersion đúng; sha256 hình ngữ cảnh trên Pages khớp bản local; kiểm lại trực quan trang mở đầu ĐẠT — hai học viên ngồi đối diện nhìn nghiêng qua bàn tròn, đúng bố cục tr.036; mục khởi động 6 hình đã đạt ở lần kiểm trước.
- Với vòng này, cả ba bài từng bị chê sơ sài (5, 6, 7) đều đã ở mức hình mới; Bài 1, 2, 3, 4 và 8 đã kiểm kê là đạt mức ngay từ đầu.

### Vẽ lại hình Bài 5 đẹp hơn — yêu cầu của Hoa (2026-11-02)

- Hoa yêu cầu áp dụng mức hoàn thiện của bộ hình Bài 7 images2 cho các bài còn lại. Kiểm kê toàn bộ cho thấy: hình Bài 1, 2, 3, 4 và 8 vốn đã ở mức minh họa chi tiết (nhân vật có khuôn mặt, bối cảnh đầy đủ) — đạt mức mới, không cần vẽ lại; chỉ Bài 5 và Bài 6 còn ở mức hình người que/khối trừu tượng. Bài 6 đã chuẩn bị xong kế hoạch + prompt, làm ở lượt kế tiếp.
- Bài 5: vẽ lại cả 11 hình. Cảnh có người/vật dùng hình minh họa sinh mới đúng phong cách chung của dự án (văn phòng tr.032; nấu ăn thái cà chua tr.033; hai món ăn; xào chảo; nghỉ ngơi; máy tính; sủi cảo). Ba hình dữ liệu chính xác (lịch tháng 9/2025 khoanh ngày 7, lịch tháng 5/2025 khoanh ngày 1 và bản không khoanh, khối gỗ 星期一） vẽ bằng chương trình với lưới ngày tính từ lịch thật.
- QA hình độc lập: 11/11 ĐẠT — hai tờ lịch kiểm từng vị trí bằng lịch thật (1/9 ở cột thứ Hai, 7/9 khoanh ở cột Chủ nhật; 1/5 khoanh ở cột thứ Năm, đủ 31 ngày); sáu hình khởi động phân biệt rõ từng khái niệm, không gây nhầm đáp án. contentVersion `20261102-lesson5-images2`.
- **Nghiệm thu live:** PR #76; contentVersion `20261102-lesson5-images2` đúng; sha256 11/11 file hình trên Pages khớp bản local; kiểm trực quan live 2/2 ĐẠT (hình ngữ cảnh văn phòng có khuôn mặt; lịch tháng 9 khoanh ngày 7 đúng cột Chủ nhật ở bài tự luyện).

### Bài 5 《今天我休息》 — chuẩn hoá theo D27 (2026-11-02)

- **Đối chiếu nguồn:** Textbook tr.027–034 (mục tiêu, khởi động nối từ – hình, 3 hội thoại, 3 điểm Tiểu Ngữ, bài tổng hợp, hoạt động lớp trò chơi nhóm) + Workbook tr.022–024 (biến điệu của 不 và 一, nghe – đọc). Khối Workbook tr.025–030 là đề mô phỏng — theo D15 không đưa vào bài.
- **Bổ sung:** dialogueGroup 8/7/7 cho 22 từ; prepGroups 3 nhóm (track 5-2/5-4/5-6); learningPath 6 bước; useWhen + quickCheck cho 3 điểm chính; toàn bộ bảng tháng 1–12 và bảng thứ của sách làm ví dụ KP Thời gian (+ câu luyện đọc 今天是2025年5月22号。); 2 câu hỏi đọc hiểu in dưới Hội thoại 3 ở tr.032 (wb5-text-5/6); 6 câu khởi động nối từ – hình tr.027 với 6 tranh vẽ mới; 2 bài tự luyện Workbook tr.024 còn thiếu (đọc theo biến điệu 不 8 mục, 一 8 mục); bài dùng hình để nói có 4 tranh vẽ mới + đáp án gợi ý đã kiểm chứng bằng lịch thật (7/9/2025 là Chủ nhật, 1/5/2025 là thứ Năm); apply thêm nhiệm vụ trò chơi nhóm tr.034; summaryPoints 4 (gồm mẹo 号 = 日, 星期日 = 星期天 của sách); tra từ phủ 50/50 (extras: tên nhân vật + cách gọi ngắn 同乐 + 你们 + 明天/年 + chữ số 一–十). Hình ngữ cảnh thay tranh vẽ mới theo ảnh tr.032. Tổng bài chính 9 → 17 câu, tự luyện 2 → 4 bài.
- **QA độc lập:** Vòng 1 — nội dung ĐẠT 12/13 mục, code ĐẠT 5/5 (test 148/148, audit tra từ 50/50, DOM "gồm 2 phần"), nhưng CHƯA ĐẠT do ví dụ 一口 mới bổ sung ghi sai thanh (yí kǒu + ghi chú "trước thanh 4"; đúng phải là yì kǒu vì 口 là thanh 3 — mâu thuẫn với chính giải thích của điểm kiến thức và bảng in). QA hình ảnh: 10/11 đạt (3 lệch nhỏ không đổi đáp án: hai người nấu ăn kiểu tối giản, dao ở hình mô tả 2 chưa rõ, cặp ngữ cảnh nhân vật nam đứng thay vì ngồi), 1 hình KHÔNG ĐẠT: describe-1 lưới lịch tháng 9 lệch một cột (ngày 7 rơi vào cột Thứ Bảy thay vì Chủ nhật theo lịch thật và bản in). Đã sửa cả hai: ví dụ 一口 → yì kǒu + ghi chú đúng (kèm làm rõ 一日 yí rì); vẽ lại describe-1 (ngày 1 ở cột thứ Hai, ngày 7 khoanh đỏ ở cột Chủ nhật), tự phóng to xác nhận. Vòng 2: ĐẠT 3/3 (nội dung nhất quán, hình đo tọa độ khớp cột, test 148/148).
- **Ghi chú nhỏ giữ nguyên có chủ đích:** pinyin của 一些 trong bảng từ giữ yìxiē theo phần biến điệu của chính bài (bảng từ in của sách ghi yíxiē — sách tự không nhất quán); nhãn verified-from-print của 5 câu điền từ Bài 5 giữ theo quyết định đã ghi ở vòng xây Bài 5 trước đây (đáp án duy nhất theo ngân hàng từ và hội thoại).
- **Nghiệm thu live ĐẠT** (sau PR #67 merge 168b33ba + PR sửa phiên bản #68): contentVersion live 20261102-lesson5-standard1; Bài 5 trên live có đủ 17 câu chính, 4 bài tự luyện, lookup và ví dụ 一口 đã sửa; sha256 của cả 11 file hình trên GitHub Pages khớp byte với bản local. Kiểm trực quan trang live bổ sung ở PR sổ sách. Ghi nhận sự cố quy trình: trường contentVersion trong data/content.json ở PR #67 còn giữ giá trị Bài 4 do thứ tự ghi file khi biên soạn (nội dung Bài 5 vẫn đúng) — đã sửa ngay bằng PR #68 và kiểm lại trên live.

### Bài 4 《我有两个孩子》 — chuẩn hoá theo D27 (2026-11-02)

- **Đối chiếu nguồn:** Textbook tr.018–026 (mục tiêu, khởi động nối từ – hình, 3 hội thoại, 4 điểm Tiểu Ngữ, bảng số 0–99 và 100–10.000, cách đọc số 2, bài tổng hợp, mô tả hình, hoạt động lớp) + Workbook tr.013–015 (biến điệu hai thanh 3, thanh nhẹ, 4 bài nghe – đọc). Khối Workbook tr.016–021 là đề mô phỏng — theo D15 không đưa vào bài. Tên bài đúng theo giáo trình là 《我有两个孩子》 (checkpoint cũ ghi 《你今年多大》 là tên của giáo trình khác — đã sửa).
- **Bổ sung:** tên bài + dialogueGroup 3/10/8 cho 21 từ (dữ liệu cũ chưa phân nhóm); prepGroups 3 nhóm (track 4-2/4-4/4-6); learningPath 6 bước; useWhen + quickCheck cho 4 điểm chính; toàn bộ ví dụ đọc số của sách làm ví dụ KP Số (52 ví dụ: bảng 0–99, dãy 100–10.000, bộ 二/两); cụm luyện đọc KP Lượng từ + câu hoàn thành hội thoại; 2 câu hỏi đọc hiểu Hội thoại 3 in ở tr.025 (wb4-text-5/6); 5 câu điền từ tổng hợp tr.025 (khung 呢/二十/没/口/大， câu 3 tách hai chỗ trống; verified-editorial); 6 câu khởi động nối từ – hình tr.018 với 6 tranh vẽ mới; 3 bài tự luyện Workbook tr.015 còn thiếu (đọc theo biến điệu 12 mục, đọc theo thanh nhẹ 8 mục, phân biệt thanh nhẹ 6 cặp); bài Dùng hình để nói tr.025–026 (4 tranh vẽ mới, ảnh gia đình đếm trực tiếp từ ảnh gốc = 6 người); apply 2 nhiệm vụ (đóng vai HT2 tr.022 + hoạt động lớp tr.026, mẫu Tiểu Ngữ đã phóng to xác nhận 你是哪国人？); summaryPoints 4; tra từ (extras: 5 tên nhân vật + 16 mục số/lượng từ + 白家月； phủ 84/84). Hình ngữ cảnh thay bằng tranh vẽ mới theo ảnh tr.019. Tổng bài chính 4 → 17 câu, tự luyện 1 → 5 bài.
- **Sửa lỗi dùng chung (QA vòng 1 bắt được):** đầu trang Luyện tập của MỌI bài in cứng văn bản Bài 8 ("gồm 3 phần… dùng 在 và 能") — đã sửa renderer: số phần và mô tả phần A lấy theo dữ liệu từng bài (Bài 4: 2 phần, mô tả đúng nội dung bài; Bài 8 giữ 3 phần + đề mô phỏng). Kèm 3 sửa nhỏ theo QA: thêm ví dụ 十 vào KP Số, mở rộng nghĩa của 口 theo chú thích sách, tb4-fill-1 trỏ thêm KP Số.
- **QA độc lập:** Vòng 1 — nội dung ĐẠT 13/13 mục (hội thoại/vai/thứ tự, 21 từ + nhóm, ví dụ số toàn bộ, quickCheck, đáp án text/fill/warm, danh sách tự luyện nguyên văn, mẫu apply, extras pinyin + Hán–Việt); code: test 142/142 + audit đạt, nhưng CHƯA ĐẠT do lỗi renderer ở trên. QA hình ảnh độc lập: ĐẠT 11/11 (đếm người ảnh mô tả 1: tranh 6 = gốc 6; các lệch ngoại hình/bố cục đã liệt kê: ông lão mất râu/kính, học sinh 4→3 người, chiều ôm ở 2 hình anh em, cặp ngữ cảnh đổi phía/màu áo — không điểm nào đổi đáp án). Vòng 2 sau sửa: ĐẠT 5/5 (DOM Bài 4 đúng "2 phần" không còn 在/能； hồi quy Bài 8 và Bài 5 đạt; 3 sửa nhỏ đạt; test 142/142).
- **Nghiệm thu live ĐẠT** (sau PR #65 merge 9d77dd42): contentVersion live 20261102-lesson4-standard1; Bài 4 trên live có đủ 17 câu chính, 5 bài tự luyện, lookup; sha256 của cả 11 file hình trên GitHub Pages khớp byte với bản local. Kiểm trực quan trang bài tập live bổ sung ở PR sổ sách.

### Hiệu chỉnh trung thực theo ảnh gốc PDF (2026-11-02, chỉ đạo tiếp của Hoa)

- **Lý do:** vòng vẽ lại đầu tiên dựng cảnh theo suy luận từ đáp án, chưa mở xem ảnh gốc. Hoa yêu cầu xem ảnh trong PDF gốc và mô phỏng lại cho đúng.
- **Đã làm:** mở xem trực tiếp ảnh gốc ở Workbook tr.004/008/012 và Textbook tr.002/005/010; vẽ lại 13/14 hình theo đúng bố cục ảnh gốc (Bài 1: quầy lễ tân / người ngã trên băng–tuyết được đỡ dậy / thầy cầm sách đỏ trước hai học sinh / ba học sinh ngồi bàn vẫy chào; Bài 2: hai người đàn ông vest bắt tay / hai nữ sinh đồng phục đi về phía cô giáo / cô gái tóc vàng áo sọc đen–trắng / cô gái tóc xoăn được an ủi / cô giáo váy trắng trước ba học sinh; Bài 3: cô giáo áo trắng cầm thước trước bảng xanh / người vest nghe điện thoại / hai phụ nữ trò chuyện trong khoang máy bay / bạn gái bắt tay người phụ nữ mặc vest, bạn trai áo kẻ đứng cạnh). Hình ngữ cảnh Bài 3 (bàn cà phê) vốn đã khớp nên giữ nguyên. Alt viết lại theo cảnh thật; đáp án không đổi; test 137/137.
- **QA trung thực độc lập: ĐẠT 14/14** (đối chiếu từng tranh với từng ảnh gốc, gồm cả cắt phóng to). 6 lệch nhỏ không chặn, không đổi đáp án: cảnh băng trong nhà thành tuyết ngoài trời + người giúp đổi giới tính (Bài 1 hình 2); cô lễ tân không vẫy đáp (Bài 1 hình 1); thiếu vẫy tay của học sinh (Bài 2 hình 2); cô giáo Bài 2 chỉ bảng thay vì dang tay; vài lệch màu bảng/độ tuổi; ghế máy bay đối diện trực tiếp thay vì qua lối đi (Bài 3 hình 3 — nhưng đúng cả hai nhân vật là nữ như ảnh gốc).
- **Nghiệm thu live ĐẠT** (sau PR #63 merge fabf4cbf): contentVersion live 20261102-img-faithful-l123; sha256 của cả 13 file hiệu chỉnh trên GitHub Pages khớp byte với bản local.

### Bài 3 《我是中国人》 — chuẩn hoá theo D27 (`20261102-lesson3-standard1`)

- **Đối chiếu trực quan:** TB in 010–016 (PDF 25–31) + WB in 009–012 (PDF 16–19). Đã có–đúng: 18 từ thường; 15 câu hội thoại; 3 điểm chính （是/的/吗） gồm đủ ví dụ luyện đọc của 3 bài giảng； ô trợ giúp 谁 đọc là shuí đã nằm trong dữ liệu từ 谁 (pinyin shéi/shuí); 2 điểm nền tảng (bảng zh/ch/sh/r/z/c/s + 2 quy tắc chính tả, 12 thẻ hình); 4 câu chọn lời thoại theo hình (đáp án in 3/4/1/2 khớp); 3 bài nghe–viết (12/15/15 ô).
- **Thiếu/sai đã bổ sung:** (1) sách liệt kê 4 TÊN RIÊNG theo hội thoại （中国/法国/中文 ở Hội thoại 1, 泰国 ở Hội thoại 2) nhưng dữ liệu cũ không có từ nào — đã thêm đủ 4 (audio null, ghi rõ chưa có audio riêng); (2) bài đọc vè + track 3-7 ở tr.016 bị thiếu hẳn → bổ sung KP nền tảng + track gốc (23,647s; file nguồn cục bộ chỉ có tới 3-6 nên đo trên file tải từ chính URL CDN của sách); (3) KP 的 thiếu 2 cụm luyện đọc lược 的 （我学生/你同学） → đã thêm đủ bộ 4 cụm; (4) cả mục **综合练习 của Textbook tr.015** chưa có trong app → bổ sung 5 câu điền từ chọn từ khung 哪/吗/谁/中国人/想 (tách câu 3 thành hai câu hỏi vì có hai chỗ trống; đáp án verified-editorial suy ra từ mẫu câu của bài, sách không in đáp án) + bài “Dùng hình để nói” dạng tự luyện không chấm tự động với **2 tranh phẳng vẽ mới** theo chuẩn D19 (không dùng ảnh sách; xem SOURCE_AUDIT). Hoạt động lớp học tr.016 (giới thiệu theo nhóm) là hoạt động trên lớp, được bao quát bằng hai nhiệm vụ tự nói theo cặp — ghi rõ ở đây thay vì tạo mục riêng.
- **Nâng cấp theo chuẩn:** learningPath 6 bước; prepGroups 3 nhóm (2+3 tên riêng / 6+1 / 10) + prepSummaryVi; useWhenVi + quickCheck đúng schema + positionVi cho 3 điểm chính; summaryPoints 3 điểm; apply.tasks 2 nhiệm vụ đóng vai (toàn bộ Hội thoại 1 và 3, ghi nguồn); tra từ mở cho Bài 3 với extras 一飞 + 白家月 — phủ bề mặt đích 32/32.
- **QA độc lập (một vòng, đạt ngay trên bản cuối):** nội dung ĐẠT 8/8, 0 lỗi (tên riêng/phân nhóm khớp mục 专有名词 từng trang; 5 đáp án điền từ là đáp án duy nhất hợp lý và việc tách câu 3 được ghi trung thực; đọc vè nguyên văn; khung nói theo hình nguyên văn, gợi ý đáp án đúng mực). Code ĐẠT 7/7 (script jsdom riêng 12/12: lộ trình + CTA, nhóm từ 2+3/6+1/10 với 22 thẻ, "Ba điều cần nhớ", Thử ngay 吗 không ghi attempts, nút track đọc vè phát đúng URL, tra 一飞/白家月， 5 câu điền từ chấm đúng, hình vẽ mới tồn tại, hồi quy Bài 2/4/8).
- **Kiểm thử:** npm run check 137/137 (5 test mới cho Bài 3 + cập nhật tiền đề: đếm từ/KP/track/bài tập Bài 3, tổng số lựa chọn có hỗ trợ 249→274, tổng từ có Hán–Việt 162→166, bài chưa chuẩn hoá ở 2 test chuyển sang Bài 4). Ghi chú quy trình test: render trang Từ cần biết hoàn tất bất đồng bộ sau khi chuyển mục trong cùng bài — test phải thăm dò phần tử đích thay vì chờ cố định.
- **Nghiệm thu live (sau PR #60 merge `a39697cb`, bản `20261102-lesson3-standard1`, byte khớp local — gồm cả 2 file WebP đối chiếu sha256 trên Pages):** 6/6 ĐẠT — lộ trình Bài 3 + nút tiếp tục; nhóm từ 2+3/6+1/10; "Ba điều cần nhớ" + Thử ngay của 吗 + thẻ đọc vè có nút track 3-7; tra 一飞 ở reader; câu điền từ chấm đúng trên live + bài nói theo hình hiển thị đủ 2 tranh vẽ mới; hồi quy Bài 2 còn lộ trình, Bài 4 chưa có (đúng trạng thái). Sự cố quy trình đã xử lý trong nhánh: connector chỉ đẩy được file văn bản — hai WebP ban đầu bị lưu thành văn bản base64 qua API, đã ghi đè bằng tải lên qua giao diện web GitHub và xác minh bằng git blob SHA + sha256 trên bản live (raw.githubusercontent từng phục vụ bản cache cũ). Giới hạn: chưa kiểm nghe thực tế, chưa Android thật cho vòng này, CI vẫn 403.

- **Nghiệm thu live (sau PR #58 merge `2283255f`, bản `20261102-lesson2-standard1`, byte khớp local):** 6/6 ĐẠT — lộ trình Bài 2 + nút Tiếp tục; prep 3 nhóm 6/5/4; "Năm điều cần nhớ" + Thử ngay của 是 + thẻ đọc vè có nút track 2-7; tra 陈天中 ở reader; apply 2 nhiệm vụ; hồi quy Bài 1 (lộ trình còn nguyên), Bài 8 (nhãn nhóm 3 đúng), Bài 3 (chưa có lộ trình — đúng trạng thái chưa chuẩn hoá). Giới hạn: chưa kiểm nghe thực tế (track đọc vè phát cả track), chưa Android thật cho vòng này, CI vẫn 403.

- **Nghiệm thu live (sau PR #56 merge `52ef95a7`, bản `20261102-lesson1-standard1`, byte khớp local):** 6/6 ĐẠT — lộ trình Bài 1 + nút Tiếp tục chuyển trang; prep 3 nhóm, nhãn "1 từ + 1 tên riêng" và thẻ 王老师； tra 小语 ở reader; Thử ngay của 您 + thẻ đọc vè có nút nghe track 1-7; apply 2 nhiệm vụ; hồi quy Bài 8 (nhãn nhóm 3 đúng, apply 3 nhiệm vụ). Giới hạn: chưa kiểm nghe thực tế (track đọc vè phát cả track, chưa chia đoạn), chưa Android thật cho vòng này, CI vẫn chưa tạo được qua connector (403).
- **Kiểm nghe:** không — không đổi mốc audio; nhóm từ phát cả track gốc như chuẩn.

## D28 — Câu hỏi tại hội thoại (2026-11-03, PR #89, live 20261103-dialoguechecks1)

- **QA độc lập trước phát hành: ĐẠT 4/4 mục.** (1) Dữ liệu: đúng 36 câu chuyển đúng hội thoại đích (promptVi/trang in khớp sourceRefs của passage đích), không sót trong exerciseSet, Bài 1–3 không đổi ở mức cấu trúc, đáp án luôn thuộc lựa chọn, không trùng ID; 24 câu nghe hiểu có audioSegment hợp lệ trong thời lượng track; kiểm ngữ nghĩa đáp án mẫu 5 câu đối chiếu lời thoại passage đích đều khớp. (2) Mã: chấm tại chỗ dùng gradeChoice + recordAttempt + session bộ chính; mainGradedItems không tính trùng (hai nhóm ID rời nhau); Ôn tập trỏ reader?passage; chuyển hướng ?item= không lặp; liên kết checkItemId cũ của Bài 8 Hội thoại 1 còn hoạt động. (3) validate OK; npm test 175/175; audit-standard hiển thị đúng cột "N câu + M tại hội thoại". (4) DOM jsdom độc lập 20/20: Bài 10 Hội thoại 2 đủ 2 câu + nút đoạn đúng track/mốc, trả lời tại chỗ ghi attempt firstAttempt đúng, Tổng kết tính gộp 1/1 trên hồ sơ sạch, deep link chuyển hướng ổn định, Bài 4 Hội thoại 3 đủ 4 câu không nút đoạn (đúng thiết kế), Bài 8 Hội thoại 1 giữ liên kết cũ.
- **Nghiệm thu live:** 4/5 ĐẠT + 1 điểm không áp dụng được do hồ sơ trình duyệt dùng chung đã có tiến độ Bài 10 từ trước (chi tiết ở CHECKPOINT mục D28) — không phải lỗi sản phẩm; phép tính gộp đã có bằng chứng jsdom kiểm soát trạng thái.
- **Giới hạn:** mốc audioSegment vẫn asr-draft chưa nghe kiểm chứng; kiểm tra là jsdom + trình duyệt giả lập, chưa thử trên điện thoại thật của Hoa cho thay đổi này.

## Bài 11 — 我读大学呢 (2026-11-03, PR #91, live 20261103-lesson11-standard1)

- **QA độc lập vòng 1:** ĐẠT mọi mảng nội dung khi đối chiếu bản in: hội thoại 14 câu (4/4/6) khớp TB tr.079/081/083; 25 từ (7/6/12) thứ tự/pinyin/nghĩa khớp 3 bảng 生词， Hán–Việt 25/25 đúng âm chuẩn; 3 KP chính （正反问 tr.080, 在/正在 tr.082, 要 tr.084) + nền tảng 汉字书写（四） khớp sách, quickCheck nhất quán; đáp án 20 câu đúng (khởi động 3/6/2/1/4/5; điền từ dùng mỗi từ ngân hàng đúng một lần; thanh điệu 1/3/3/2/2 kiểm ở 300 DPI, nhãn nhóm 1 là mǎi; 4 câu tại hội thoại suy ra đúng từ lời thoại in, audioSegment trỏ đúng track/lượt chứa căn cứ); hình 11/11 đúng cảnh, mỗi câu khởi động một hình khớp duy nhất; grammarIds trỏ đúng KP câu thực sự kiểm tra, câu thuần nội dung để rỗng đúng quy tắc. validate OK, audit đạt mọi cột, test 180/180.
- **Lỗi vòng 1 (1 lỗi, đã sửa + kiểm lại):** pinyin "hòubianr" ở 3 vị trí (câu l11-s2, ví dụ 1 KP 正反问， tra từ 后边） lệch bản in "hòubian" （后边 in không có 儿）. Đã sửa cả 3; QA kiểm lại độc lập ĐẠT: quét toàn bộ content.json còn 0 "hòubianr"/đúng 3 "hòubian", render 300 DPI tr.079 xác nhận bản in, validator OK.
- **Nghiệm thu live 5/5** (chi tiết ở CHECKPOINT mục Bài 11).
- **Giới hạn:** QA không kiểm nghe — mọi mốc là asr-draft căn bằng máy; hai mốc từ （时候， 医） xác định theo vị trí trong danh sách đọc vì ASR chép đồng âm khác chữ; quyền nguồn unknown; kiểm tra giao diện bằng trình duyệt giả lập, không phải thiết bị thật.

## Bài 12 — 昨天下雪了 (2026-11-03, PR #93, live 20261103-lesson12-standard1)

- **QA độc lập vòng 1:** ĐẠT mọi mảng nội dung khi đối chiếu bản in: hội thoại 14 câu (4/4/6) khớp TB tr.087/089/091; 24 từ (9/6/9) khớp 3 bảng 生词， Hán–Việt 24/24 đúng âm chuẩn （这 CHÁ, 喝 HÁT, 些 TA…); 3 KP chính + nền tảng 汉字书写（五） khớp sách, ví dụ luyện đọc nguyên văn 6/3/3, quickCheck nhất quán; đáp án 27/27 đúng (khởi động theo vị trí ảnh tr.086: 6/3/5/2/4/1; điền từ mỗi từ ngân hàng dùng đúng một lần; thanh điệu 2/1/2/3 kiểm ở 300 DPI; 6 ánh xạ nghe – nối âm tiết đúng; 6 câu tại hội thoại đúng, audioSegment trỏ đúng lượt chứa căn cứ); grammarIds đúng kỳ vọng (chỉ fill-1b → 太……了， fill-2 → 了）; hình 11/11 đúng cảnh, mỗi câu khởi động một hình khớp duy nhất; độ phủ đủ (2 ô 小语助力， câu hỏi mở HT2/HT3, hoạt động đôi sau HT1, tổng kết liên bài 10–12 không có trong dữ liệu — đúng tiền lệ). validate OK, audit đạt mọi cột, test 185/185.
- **Lỗi vòng 1 (1 lỗi, đã sửa + kiểm lại):** bodyVi của điểm Tổng kết "Mẫu 太……了" ghi "Cả ba hội thoại của bài đều dùng: 太冷了！" — sai sự thật (mẫu chỉ xuất hiện ở Hội thoại 2 câu l12-s6; Hội thoại 1 chỉ có 不太好）. Đã sửa thành câu mô tả đúng ("Hội thoại 2 dùng đúng mẫu này khi nhận xét thời tiết sau ngày tuyết rơi"); QA kiểm lại độc lập ĐẠT: quét 14 câu xác nhận vị trí duy nhất của mẫu, test lesson12standard 5/5.
- **Nghiệm thu live:** nội dung chính đạt (chi tiết và lưu ý về lỗi quan sát trong bản ghi nghiệm thu ở CHECKPOINT mục Bài 12); content.json live khớp byte bản local.
- **Giới hạn:** QA không kiểm nghe — mọi mốc là asr-draft căn bằng máy (mốc từ 了 chỉ 0,16 giây); ba track từ đọc mỗi từ hai lần, mốc lấy lần đầu theo khoảng lặng; quyền nguồn unknown; kiểm tra giao diện bằng trình duyệt giả lập, không phải thiết bị thật.

## Bài 13 — 请给我一杯茶 (2026-11-03, PR #95, live 20261103-lesson13-standard1)

- **QA độc lập vòng 1: ĐẠT toàn bộ, không có lỗi nội dung.** Đối chiếu bản in: hội thoại 14 câu (4/4/6) khớp TB tr.096/098/100 gồm cả “xiǎo diàn” viết tách hai chữ và các số “40个/20个” in bằng chữ số Ả Rập; 20 từ (6/11/3) khớp 3 bảng 生词， Hán–Việt 20/20 đúng âm chuẩn （给 CẤP, 杯 BÔI, 这个 GIÁ CÁ…); 3 KP chính + nền tảng 汉字书写（六） khớp sách, 9 câu luyện đọc nguyên văn (3/3/3), quickCheck nhất quán; đáp án 27/27 đúng (khởi động theo vị trí ảnh tr.095: 2/4/1/5/6/3; điền từ mỗi từ ngân hàng dùng đúng một lần; thanh điệu 2/1/2/3 tự phân tích độc lập ở 300 DPI; 6 ánh xạ nghe – nối âm tiết đúng; 6 câu tại hội thoại đúng, audioSegment trỏ đúng lượt chứa căn cứ); grammarIds đúng kỳ vọng (chỉ fill-1 → câu hai tân ngữ, fill-3a → 可以， fill-4 → 一下）; hình 11/11 đúng cảnh, mỗi câu khởi động một hình khớp duy nhất; độ phủ đủ (câu hỏi mở sau 3 hội thoại, bài dùng hình để nói, hoạt động lớp tr.102 với mẫu Tiểu Ngữ nguyên văn; video 中国茶 chỉ ghi nhận, không phân phối; mô phỏng WB và track WB 13-2 không có trong dữ liệu — đúng). Soát câu chữ khái quát: intro/outcomesVi/summaryPoints/priorLessonNoteVi đều truy được về đúng hội thoại, courseTagsVi sạch. validate OK, audit đạt mọi cột, test 190/190.
- **Sửa bóng sau QA (không phải lỗi nội dung):** ghi chú nhẹ của QA — KP nền tảng gọi “bộ 言” thay vì dạng bộ thủ 讠 （言字旁）; đã đổi thành “bộ 讠（言字旁）” trong dữ liệu + script biên soạn, test hồi quy 190/190, không đụng câu chấm nào.
- **Nghiệm thu live:** nội dung chính đạt (chi tiết và lưu ý về lỗi quan sát trong bản ghi nghiệm thu ở CHECKPOINT mục Bài 13); content.json live khớp byte bản local.
- **Giới hạn:** QA không kiểm nghe — mọi mốc là asr-draft căn bằng máy (từ 问题 ở track 13-2 ước theo vị trí ASR vì hai lần đọc dính nhau); ba track từ đọc mỗi từ hai lần, mốc lấy lần đầu theo khoảng lặng; quyền nguồn unknown; kiểm tra giao diện bằng trình duyệt giả lập, không phải thiết bị thật.

## Sửa Hán–Việt Bài 12 — 这里 (2026-11-03, PR #97, live 20261103-l12hanviet1)

- **Lỗi:** âm Hán–Việt của 这里 (Bài 12, nhóm Hội thoại 1) ghi “CHÁ LÝ” — sai âm chuẩn và lệch quy ước của chính dự án （这 = GIÁ ở Bài 3/8/10/13). Lỗi do vòng biên soạn Bài 12 ghi nhầm và QA Bài 12 đã chấp nhận; phát hiện khi xây Bài 13, Hoa quyết định sửa trong vòng nhỏ riêng.
- **Sửa:** một giá trị duy nhất → “GIÁ LÝ”; rà soát toàn cục trước sửa xác nhận không còn từ nào khác dùng CHÁ cho 这. Validator OK, audit đạt, test 190/190; nghiệm thu live: dữ liệu khớp byte + giao diện Từ cần biết Bài 12 hiển thị đúng “HV: GIÁ LÝ”.

## Bài 14 — QA độc lập (2026-11-03, PR #99, live 20261103-lesson14-standard1)

- **Phạm vi kiểm**: agent QA độc lập đối chiếu dữ liệu Bài 14 với bản in: hội thoại 15/15, từ 26+2, 3 KP + Hán tự (7), 23 câu chính (mọi đáp án tự suy từ bản in), 6 câu tại hội thoại + audioSegment, 3 bài tự luyện, 11 hình, áp dụng/tổng kết/tra từ 30/30, tính nhất quán (soát sót nội dung Bài 13).
- **Kết quả**: ĐẠT cả 9 mảng, 0 lỗi nghiêm trọng/vừa. QA khen riêng: Pinyin câu s7 chép đúng cách tách "tīng bú jiàn" của bản in; đáp án gợi ý 5/6 câu hỏi mở trích trực tiếp lời thoại; 4 điểm tổng kết dẫn đúng hội thoại thật.
- **3 ghi chú nhẹ**: (1) `kp-hsk1-l14-characters-7` thiếu trích dẫn WB tr.104 — đã bổ sung sourceRef trong nhánh. (2) Hán–Việt 不要 "BẤT YẾU" chưa thống nhất với 要 "YÊU" ở Bài 13 (cả hai đều là âm chuẩn) — đã đổi thành "BẤT YÊU" trong nhánh cho nhất quán toàn app. (3) Đáp án gợi ý cho câu hỏi mở "陈天中为什么没看见王老师？" là suy luận biên soạn (đã ghi unverified) — giữ nguyên. Sau sửa: hồi quy 195/195.
- **Hình**: QA mở xem 11/11 — khớp cảnh gốc, mỗi câu khởi động một đáp án rõ ràng; hình chữ 春 vẽ bằng chương trình đúng tuyệt đối; đã kiểm blob SHA 11/11 trước khi merge.
- **Nghiệm thu live**: nội dung chính đạt (điểm loa mục Từ cần biết chưa xác nhận được trạng thái phát trong môi trường kiểm tra tự động — giới hạn môi trường đã biết; bản ghi có chi tiết quan sát bịa về thân câu/lựa chọn — dữ liệu khớp byte nên không phải lỗi app).

## Bài 15 — QA độc lập (2026-11-03, PR #101, live 20261103-lesson15-standard1)

- **Phạm vi kiểm**: agent QA độc lập đối chiếu dữ liệu Bài 15 với bản in: hội thoại 14/14, từ 17+3, KP chính duy nhất + Hán tự (8), 23 câu chính (mọi đáp án tự suy từ bản in), 6 câu tại hội thoại + audioSegment, 3 bài tự luyện, 11 hình, áp dụng/tổng kết, nhất quán (kiểm chứng việc sách chỉ in MỘT KP chính cho Bài 15 và khối tổng kết liên bài 13–15 không lọt vào dữ liệu).
- **Kết quả vòng 1**: 8/9 mảng ĐẠT. QA khen: Pinyin chép đúng cả chỗ sách dùng 星期天 (s11) khác 星期日 (s12); bốn điểm tổng kết đối chiếu từng hội thoại đều đúng (không lặp lỗi Bài 12); đáp án ngữ điệu cảm thán/cầu khiến suy ra duy nhất.
- **1 lỗi nghiêm trọng**: khoá đáp án sai 5/6 câu nối âm tiết `wb15-match-2..6` — khoá theo số thứ tự âm tiết ở cột trái sách thay vì lựa chọn có Pinyin trùng với âm tiết được đọc; học viên chọn đúng từ sẽ bị chấm sai. Đã sửa trong nhánh: sắp lại 6 câu theo thứ tự cột âm tiết của sách, khoá lại (1/4/5/2/6/3), viết lại answerEvidence.
- **1 lỗi nhẹ**: stub catalogue lệch khuôn Bài 13/14 (bookId là workbook, sectionIds rỗng) — đã sửa trong nhánh.
- **Kiểm lại vòng 2**: QA tự đối chiếu bản in WB tr.111 và dữ liệu đã sửa: ĐẠT 6/6 câu nối âm tiết và stub đúng khuôn; không phát hiện lỗi mới. Sau sửa: hồi quy 200/200.
- **Hình**: QA mở xem 11/11 — khớp cảnh gốc; cặp dễ nhầm 早/早饭 phân biệt rõ (mặt trời mọc trên đồng không có đồ ăn vs khay ăn sáng); blob SHA 11/11 trước khi merge.
- **Nghiệm thu live**: 5/5 điểm đạt (lộ trình 6 bước + hình sân bay Đại Hưng; 3 nhóm từ đúng định dạng "2 từ / 5 từ + 2 tên riêng / 10 từ + 1 tên riêng"; câu hỏi tại Hội thoại 1 có nút nghe riêng 0:00–0:01, không Pinyin trước chấm, chọn 爱 chấm đúng 1/1; bộ chính 23 câu kèm nhóm ngữ điệu bốn loại; tổng kết 4 điểm).
- **Lưu ý hồ sơ**: file báo cáo chi tiết vòng 1 (qa-l15-report.md trong thư mục làm việc) bị cụt ở mục 4b do lỗi ghi file; kết luận và chi tiết hai lỗi còn nguyên ở phần đầu file và trong mục này.

## Rà soát tổng thể cấp 1 — QA độc lập + vòng sửa (2026-11-03, PR #103, live 20261103-l1review1)

- **Phạm vi**: QA độc lập rà (1) điểm tổng kết đối chiếu từng hội thoại ở cả 15 bài; (2) nhãn nền tảng ở trang Bắt đầu đối chiếu điểm kiến thức nền tảng; (3) phán xét các lệch Hán–Việt do quét cơ giới liên bài phát hiện.
- **Kết quả rà**: tổng kết ĐẠT 15/15 (lỗi khái quát sai kiểu Bài 12 đã hết; 6 câu ví dụ lấy từ phần luyện đọc của sách, có căn cứ truy được trong KP của bài). Nhãn nền tảng ĐẠT 14/15 — Bài 6 lệch nhẹ: hai chủ đề đều có KP nhưng nhãn gộp quy tắc viết dấu cách âm (foundation-writing) dưới đầu đề "phát âm nền tảng". Hán–Việt: 1 lỗi thật （工作 Bài 3 "CÔNG TÁ") + các điểm chưa thống nhất: 要 YÊU/YẾU, 哪 NA/NÃ, 女 NHỮ/NỮ, 少 THIẾU/THIỂU cho nghĩa "ít", 面 DIỆN/MIẾN cho từ đồ ăn, 坐 TỌA/TOẠ. Xác nhận đúng: 兴 HƯNG (xīng)/HỨNG (xìng) và cách ghi nghĩa đa nghĩa theo từng bài.
- **Quyết định của Hoa**: sửa toàn bộ theo khuyến nghị QA, gồm chuẩn 要 = YẾU (thay chuẩn YÊU ở vòng Bài 14), 哪 = NÃ, 女 = NỮ, 面 chỉ đồ ăn = DIỆN, 坐 = TỌA, 少 nghĩa "ít" = THIỂU.
- **Kiểm lại sau sửa**: QA độc lập xác nhận 13/13 trường đúng giá trị mới; quét 637 trường hanViet: không còn YÊU/NHỮ/THIẾU/MIẾN/TOẠ/CÔNG TÁ trong các ngữ cảnh phải đổi; các trường hợp giữ nguyên （那 = NA ở Bài 9/15, 兴 theo cách đọc, 多少 = ĐA THIỂU) còn đúng; nhãn Bài 6 đã tách (phát âm)/(cách viết) và khớp hai KP nền tảng.
- **Nghiệm thu live**: nội dung đạt 3/3 điểm kiểm nhanh (Bài 3: CÔNG TÁC + NỮ BẰNG HỮU; Bài 13: YẾU + TỌA + DIỆN BAO; Bài 6: nhãn mới hiển thị ở mục Hiểu cách dùng). Chuỗi phiên bản không nhìn thấy ở chân trang chủ trong môi trường kiểm tra tự động; phiên bản đã xác nhận qua HTML phục vụ và content.json khớp byte.

## HSK 2 Bài 1 + Khu Luyện viết — QA và nghiệm thu (03/11/2026)

- Phát hành: PR #105 merge 790cf0b7 (nội dung) + PR #106 merge a7785f86 (sửa thư viện viết); contentVersion live cuối `20261103-hsk2l1-writing2`; content.json live khớp byte bản local (sha256 a4322c3e…).
- QA độc lập (D17) vòng 1: CHƯA ĐẠT — 8/9 mảng đạt (hội thoại 22 câu khớp bản in từng câu, từ mới, 3 KP, 10 câu hỏi tại đoạn tự chấm lại đạt, nối hình, 3 câu Workbook, khu viết về logic, hồi quy HSK 1); 1 lỗi NGHIÊM TRỌNG: 5 câu điền từ tb2-fill-1…5 dùng thân câu tự biên soạn nhưng ghi nguồn Textbook tr.008 (đáp án vẫn đúng). 5 lỗi nhẹ: refs KP 吧/是……的 lệch trang (đúng: tr.003/tr.004), bài đóng vai ghi sân bay thay vì ga tàu tr.009, alt ảnh bữa sáng sai chi tiết, đáp án Bước 5 khu viết luôn ở nút đầu, caption ảnh đồng hồ khẳng định giờ không chắc.
- Đã sửa toàn bộ trong nhánh; QA vòng 2 kiểm lại độc lập từ ảnh bản in: **ĐẠT 6/6** (thân câu nguyên văn tr.008, khóa 5/3/2/4/1 giữ nguyên; test đã khoá cứng 5 thân câu).
- Kiểm thử: validate OK; audit-standard đạt (tra từ HSK2 L1 38/38; HSK1 L15 giữ 25/25 sau khi thêm extras 有时间 xử lý xung đột phân đoạn với từ mới 有时）; test **211/211** (thêm tests/hsk2lesson1standard.test.mjs + tests/writing.test.mjs; cập nhật bộ đếm toàn cục: 228 câu có đoạn, từ [332/345], lựa chọn bộ chính [143/1094], câu tại hội thoại 74 trong đó 60 câu nghe hiểu).
- Nghiệm thu live: vòng đầu đạt lộ trình HSK 2 (15 bài), thẻ luyện viết ở trang bài, câu hỏi tại 4 đoạn, audio track 1-1 phát thật, tiến độ viết lưu qua tải lại trang; **Bước 2/3 khu viết rơi về chữ tĩnh** — nguyên nhân Hanzi Writer 3.7.3 bỏ `createWriter` (đúng: `create`); QA mã nguồn không bắt được vì không chạy thư viện thật → đã sửa (PR #106) + thêm test hồi quy chạy thư viện vendor thật (vẽ + hoạt ảnh chữ 5 nét và 11 nét). Kiểm lại live lần 1 vẫn lỗi do trình duyệt kiểm tra dùng bản đệm cũ; kiểm lại với URL tránh đệm: **ĐẠT** (SVG hiện, hoạt ảnh chạy khi bấm Xem lại, nét mờ ở Bước 3 hiện; file JSON dữ liệu nét mở trực tiếp bình thường).
- Giới hạn còn lại: mốc đoạn audio vẫn asr-draft, chưa nghe kiểm chứng bởi người (gồm toàn bộ HSK 2 Bài 1); chưa thử cảm ứng thật cho vùng viết và chưa kiểm chứng được bề rộng 360px bằng công cụ trình duyệt (kiểm bằng jsdom/CSS: ô viết 264px + max-width 80vw); CI GitHub Actions vẫn chưa tạo được (403) — kiểm tra local + live như các vòng trước, không gọi là CI.

## HSK 2 Bài 2 — QA và nghiệm thu (04/11/2026)

- Phát hành: PR #108 merge 9decf6cc; contentVersion live `20261104-hsk2l2-writing1`; content.json live khớp byte bản local (sha256 c46c18ca…); 9 hình WebP đối chiếu git blob SHA 9/9 trên nhánh trước merge.
- QA độc lập (D17): **ĐẠT 10/10 mảng, có thể merge** — hội thoại 21 câu khớp bản in từng câu (xác nhận riêng câu cuối Đoạn 4 đúng một 看）, từ mới 17 mục, 9/9 ví dụ KP nguyên văn sách, 10 câu hỏi tại đoạn tự chấm lại khớp khóa 10/10, 5 thân câu điền từ nguyên văn tr.017 (điểm từng lỗi nghiêm trọng ở Bài 1 — lần này đạt ngay), 3 câu Workbook nguyên văn, 9 hình đạt (biển giá 219 đúng nội dung; ghi chú phụ: poster "ABC" trang trí trong tranh desc-study, không phải lỗi), khu viết khớp sách viết tr.2 và số nét dữ liệu, hồi quy Bài 1 HSK 2 + Bài 15 HSK 1 nguyên vẹn, trường bằng chứng trung thực (mọi mốc audio asr-draft).
- 2 lỗi NHẸ, đã sửa trong nhánh trước merge: (1) alt ảnh ngữ cảnh ghi "bảng tên trường" trong khi tranh cố ý không có bảng tên đọc được → đã bỏ cụm này; (2) đáp án quickCheck dồn vị trí 1 (3/4 KP) → hoán đổi lựa chọn KP 还是……吧， phân bổ thành 2/2/1/1, nội dung đáp án không đổi.
- Kiểm thử: validate OK; audit-standard đạt (tra từ HSK2 L2 37/37; HSK2 L1 giữ 38/38, HSK1 L15 giữ 25/25); test **216/216** (thêm tests/hsk2lesson2standard.test.mjs — khóa cứng: 8 thân câu điền từ/mở rộng nguyên văn, đáp án 22 câu, ví dụ KP nguyên văn, số nét 4 chữ khớp file dữ liệu; cập nhật bộ đếm toàn cục: 249 câu có đoạn, từ [349/362], lựa chọn bộ chính [143/1144], câu tại hội thoại 84 trong đó 68 câu nghe hiểu).
- Nghiệm thu live (kiểm bằng URL tránh đệm): 6/6 đạt — lộ trình HSK 2 hiển thị 2 bài đã mở/Bài 3 chưa mở; trang Bài 2 đủ 7 mục + ảnh ngữ cảnh + thẻ luyện viết 间问过远； Nghe & đọc 4 đoạn, câu hỏi in hiện ngay dưới Đoạn 1; track 2-1 phát thật (thời gian chạy 0:00→0:04/0:19); Luyện tập chấm câu nối hình xe buýt ĐÚNG tại chỗ; khu viết Bài 2 đủ 4 thẻ chữ, mở 间 thấy SVG hoạt ảnh nét + đủ 6 bước; trang khóa HSK 1 vẫn 15/15 mở. (Chi tiết phụ trong báo cáo kiểm tra ghi tên Bài 3 chưa mở khác mục lục — dữ liệu live đã khớp byte với bản local nên tên đúng trong app là 《我想去西安旅游》; phần trạng thái "Chưa mở" là điểm được kiểm chứng.)
- Giới hạn còn lại: mốc đoạn audio vẫn asr-draft, chưa nghe kiểm chứng bởi người (toàn bộ HSK 2 Bài 2; span của từ 别 ở track 2-6 là ước lượng ASR yếu nhất bài); chưa thử cảm ứng thật cho vùng viết; CI GitHub Actions vẫn chưa tạo được (403) — kiểm tra local + live như các vòng trước, không gọi là CI.

## HSK 2 Bài 3 — QA và nghiệm thu (05/11/2026)

- Phát hành: PR #110 merge fe5b9a8f; contentVersion live `20261105-hsk2l3-writing1`; content.json live khớp byte bản local; 9 hình WebP đối chiếu git blob SHA 9/9 trên nhánh trước merge.
- QA độc lập (D17): **ĐẠT 10/10 mảng, có thể merge** — hội thoại 18 câu khớp bản in từng câu (kể cả câu dài hai câu con ở Đoạn 3); từ mới 15 mục, Hán–Việt được phán xét đạt từng mục bị nêu tên （这么 GIÁ MA, 自己 TỰ KỶ， 拿 NÃ, 为什么 VỊ THẬP MA, 不错 BẤT THÁC, 每 MỖI, 累 LŨY); 9/9 ví dụ KP nguyên văn, quy tắc sách đúng ở cả ba điểm khó (phủ định bổ ngữ kết quả bỏ “了”, ba dạng nghi vấn, đổi dạng trùng điệp khi việc đã xảy ra); 10 câu hỏi tại đoạn tự chấm lại khớp khóa 10/10 (gồm các bẫy: uống nước ≠ ăn cơm; người mua vé là Lưu Minh; ăn táo ≠ rửa táo; “hôm nay không đi làm” là SAI); 8 thân câu điền từ/mở rộng nguyên văn từng ký tự; 9 hình đạt; khu viết khớp sách viết tr.3 và số nét dữ liệu; hồi quy Bài 1–2 HSK 2 + Bài 15 HSK 1 nguyên vẹn (QA ghi rõ giới hạn: đối chiếu bằng trường chính + khóa đáp án vì connector không trả toàn văn content.json trên main).
- 1 lỗi NHẸ, đã sửa trong nhánh trước merge: mốc 为什么 (kết thúc 11.45) chồng mốc 不错 (bắt đầu 11.0) 0,45 giây ở track 3-6 → cân lại theo ASR word-level （为什么 10.35–11.10, 不错 11.05–14.20); đồng thời nới điểm cuối mốc 回来 ở track 3-2 từ 2.60 lên 2.75 theo ASR. QA cũng ghi nhận (không yêu cầu sửa): chú thích nghĩa tùy chọn cho TỰ KỶ （自己） để tránh liên tưởng nghĩa y khoa.
- Kiểm thử: validate OK; audit-standard đạt (tra từ HSK2 L3 34/34 — bổ sung extras 西安/刘明/王一雪/一/帮； HSK2 L1–L2 giữ nguyên độ phủ); test **221/221** (thêm tests/hsk2lesson3standard.test.mjs — khóa cứng: 22 đáp án, 8 thân câu nguyên văn, 9 ví dụ KP nguyên văn, số nét 4 chữ khớp file dữ liệu; cập nhật bộ đếm toàn cục: 267 câu có đoạn, từ [364/377], lựa chọn bộ chính [143/1194], câu tại hội thoại 94 trong đó 76 câu nghe hiểu).
- Nghiệm thu live (kiểm bằng URL tránh đệm): 6/6 đạt — lộ trình HSK 2 hiển thị 3 bài đã mở/Bài 4 chưa mở; trang Bài 3 đủ 7 mục + ảnh Tháp Chuông Tây An + thẻ luyện viết 汉洗家完； Nghe & đọc 4 đoạn, câu hỏi hiện ngay dưới Đoạn 1; track 3-1 phát thật (thời gian chạy 0:00→0:05/0:17); Luyện tập chấm câu nối hình 不错 ĐÚNG tại chỗ (1/1); khu viết Bài 3 đủ 4 thẻ chữ, mở 汉 thấy SVG hoạt ảnh nét + đủ 6 bước; trang khóa HSK 1 vẫn 15/15 mở. (Phần tường thuật của lượt kiểm có vài chỗ ghi lẫn tên bài và văn câu hỏi — dữ liệu live đã khớp byte với bản local đã khóa bằng test + QA độc lập nên các chi tiết đó không được coi là bằng chứng lỗi app; các điểm chức năng nêu trên là phần được kiểm chứng.)
- Giới hạn còn lại: mốc đoạn audio vẫn asr-draft, chưa nghe kiểm chứng bởi người (toàn bộ HSK 2 Bài 3); chưa thử cảm ứng thật cho vùng viết; CI GitHub Actions vẫn chưa tạo được (403) — kiểm tra local + live như các vòng trước, không gọi là CI.

## Pilot nghe ôn HSK 2 Bài 1 — 2026-11-07, chưa phát hành

QA độc lập vòng 2 đạt phần mã/nội dung kế thừa, đóng 4 lỗi: Event realm,
chọn giọng Quan thoại, MediaSession chống phát chồng, cache token. Sau bổ
sung DOM integration: npm run check 228/228, validator OK, audit-standard
thành công, diff sạch. Hồ sơ QA đầy đủ: docs/AUDIO_REVIEW_PILOT.md.
Không tái kiểm PDF/ASR, không kiểm nghe thực tế, chưa xác minh UI 4 bề rộng:
Chromium socket bị chặn; browser chia sẻ không mở localhost. Đây là nhánh
để người dùng duyệt, KHÔNG phải bản đã nghiệm thu live hoặc được phép merge.

## Sửa lỗi khởi động giọng ôn — 2026-11-07

QA độc lập: đạt mã. Đã kiểm bỏ chặn getVoices rỗng, lang vi-VN/zh-CN,
không ép Quảng Đông; onstart mới báo đang nghe; timeout 10 giây; hủy timer
và callback khi pause/stop/đổi lượt/chế độ; cache mới; thông báo lỗi rõ.
8/8 test ôn, 229/229 toàn bộ, diff sạch. Nội dung sách không đổi nên không
kiểm lại PDF/ASR. Chưa xác minh tiếng phát thực tế trên điện thoại người dùng.

## Transcript nghe ôn — 2026-11-07

- 233/233 test local đạt; bổ sung test lọc ký hiệu/nguồn, giữ chú giải có
  nghĩa, ghép Trung–Việt, nội dung thực gửi vào TTS và giữ trọn dấu trong
  transcript. Không thay dữ liệu sách/đáp án/audio Baulchino.
- QA phát hiện ký hiệu độc lập giữa hai mảnh chữ (ví dụ 让 + 接) bị mất ở
  transcript; đã giữ chúng trong displayText nhưng không đưa vào speechText,
  kiểm hồi quy so toàn bộ đoạn tổng kết với nguyên bản đã lọc nguồn.
- Người dùng xác nhận audio bản trước phát được. Không coi đó là nghiệm
  thu chất lượng giọng đọc hay bố cục mới trên mọi thiết bị.

## Nhịp nghỉ giọng ôn — 2026-11-07

- Test 235/235 đạt, gồm phân đoạn và thời gian nghỉ cho Trung/Việt, kiểm
  player thực sự chờ giữa các vế trong cùng một lượt transcript.
- Nguồn chữ/dữ liệu sách không đổi. Không gửi dấu vào SpeechSynthesis;
  player chờ bằng timer sau khi mỗi vế đọc xong. Tốc độ mặc định 0.92×.
- Chưa kiểm nghe bằng tai bộ nhịp mới trên điện thoại thật; chất giọng phụ
  thuộc thiết bị. Các mốc nghỉ là mặc định biên tập, không phải đo người đọc.
- QA độc lập đã đọc bản cuối: 14/14 test ôn đạt; đối chiếu ghép các mảnh
  của cả hai chế độ giữ đủ lời đọc; pause/stop/chuyển lượt hủy timer và
  callback đúng; khoảng nghỉ thêm chỉ áp giữa ý. Kết luận đạt mã/nhịp thiết
  kế, chưa khẳng định độ tự nhiên như người thật trên máy người dùng.

## Nghe ôn HSK 2 Bài 2 — D31 (2026-11-08)

- QA độc lập (đọc toàn bộ báo cáo): ĐẠT, 0 nghiêm trọng, 0 trung bình, 3 nhẹ. Đối chiếu bằng mã chạy thật: 17/17 mục từ ghép khớp nguyên văn dữ liệu (gồm tên riêng 北京大学), 3/3 paraphrase mẫu đúng pattern/positionVi/explanationVi, 21/21 câu hội thoại đúng thứ tự và nhãn người nói, không lẫn đáp án bài tập, không đọc Pinyin/Hán–Việt, điểm nền chữ Hán không xuất hiện trong bản ôn.
- Display/speech: transcript giữ công thức và dấu câu (4 dòng chứa "+", 15 dòng chứa ngoặc ở Ôn chi tiết); toàn bộ 182 dòng có speechText thuần chữ/số; player thực tế chỉ speak lời giải thích tiếng Việt cho dòng Mẫu câu (ghi được chuỗi speak: không "+", không Hán, lang vi-VN, rate 0,92). Nhịp nghỉ đo trực tiếp: phẩy 300 ms, hai chấm/chấm phẩy 450 ms, kết câu 750 ms, chuyển cặp Trung–Việt 550 ms, chuyển ý 900 ms, tùy chọn 3 giây chỉ nâng chuyển ý.
- Lỗi nhẹ: (1) dòng Mẫu câu nối liền tiêu đề trong transcript → đã sửa trong nhánh (tách paragraph riêng) và kiểm lại 240/240; (2) paraphrase 还是……吧 rút gọn chủ ngữ → đã chỉnh wording, dòng Vị trí đọc ngay sau bổ sung chính xác; (3) thuật ngữ Hán lồng trong câu Việt ở Ôn nhanh bị tách mảnh đọc xen kẽ — cơ chế của mẫu đã duyệt, ghi nhận không chặn.
- Test tự động: audio-review 19/19, toàn bộ npm run check 240/240, validator OK, audit-standard đạt. Phân biệt bằng chứng: đây là kiểm bằng mã + đối chiếu dữ liệu; chưa nghe kiểm chứng bằng tai.
- Nghiệm thu live sau merge PR #116 (8b8708f7): token `20261108-hsk2l2-review1` trên bản thật; khối nghe ôn ở Tổng kết Bài 2 đúng nhãn số lượng, 182 mục; điều khiển Trước/Sau/tốc độ/nghỉ/lặp đạt; hồi quy Bài 1 và Bài 3 (không bật) đạt; audio giáo trình track 2-1 phát thật. Trình duyệt kiểm không có giọng TTS nên phát giọng ôn trên live chưa kiểm chứng được (app báo lỗi đúng); chưa kiểm Android thật và bề rộng 360/390/768/1440 cho vòng này — CSS khối nghe ôn giữ nguyên mẫu đã duyệt, chỉ đổi chú thích.

## Nghe ôn HSK 2 Bài 3 — D31 (2026-11-08)

- QA độc lập (đọc toàn bộ báo cáo): ĐẠT, 0 nghiêm trọng, 0 trung bình, 3 nhẹ (đều là rút gọn paraphrase; đã sửa cả 3 trong nhánh trước merge). Đối chiếu bằng mã chạy thật: 15/15 mục từ khớp nguyên văn; 4 trường của 3 điểm ngữ pháp ghép khớp dữ liệu (độ dài tuyệt đối), 9/9 ví dụ có mặt; paraphrase đúng vị trí của 了 trong A了A, đúng quy tắc AB了一下 và AAB/A了AB; 18/18 câu đúng thứ tự + người nói, Đoạn 4 giữ đúng người kể Vương Nhất Tuyết; điểm nền chữ Hán góp 0 dòng.
- Display/speech: Ôn chi tiết có 7 dòng display chứa "+", toàn bộ 157 + 46 dòng (chi tiết + ôn nhanh) có speechText thuần chữ/số; chuỗi speak() ghi được cho 3 dòng Mẫu câu đều là tiếng Việt thuần, lang vi-VN, rate 0,92. Nhịp nghỉ đo trực tiếp giữ 300/450/750/900/550 ms. Phủ định còn nguyên （没做完, 没吃完, "không nói 没吃完饭了").
- Test tự động: audio-review 21/21, toàn bộ npm run check 242/242, validator OK, audit đạt. Phân biệt bằng chứng: kiểm bằng mã + đối chiếu dữ liệu; chưa nghe kiểm chứng bằng tai.
- Nghiệm thu live sau merge PR #118 (8c099bb5): token `20261108-hsk2l3-review1`; khối nghe ôn ở Tổng kết Bài 3 đúng nhãn, 157 mục, điều khiển đạt; hồi quy Bài 1/Bài 2 đạt; track 3-1 phát thật. Trình duyệt kiểm không có giọng TTS (app báo lỗi đúng), chưa kiểm Android thật và 4 bề rộng cho vòng này — CSS khối nghe ôn không đổi.

## Ôn nhanh theo D32 — QA (2026-11-08)

- QA độc lập (đọc toàn bộ báo cáo): ĐẠT, 0 nghiêm trọng, 0 trung bình, 3 nhẹ (không chặn). Bằng chứng: ý chính 9/9 điểm ghép khớp nguyên văn useWhenVi; câu mẫu đúng ví dụ đầu tiên của từng điểm (zh + nghĩa), ví dụ 2/3 không xuất hiện; chuỗi speak() của 9 paraphrase đều vi-VN, công thức thô không vào TTS; tập source của Ôn nhanh chỉ gồm intro/outro + 3 mã điểm ngữ pháp — không summaryPoints/từ/hội thoại/bài tập/điểm nền.
- Ôn chi tiết so khớp sâu (JSON) với module ở HEAD trước thay đổi: giống hệt từng dòng cho cả 3 bài (174/182/157).
- Test tự động: audio-review 22/22, toàn bộ npm run check 243/243, validator OK, audit đạt. Phân biệt bằng chứng: kiểm bằng mã + đối chiếu dữ liệu; chưa nghe kiểm chứng bằng tai.
- Nghiệm thu live sau merge PR #120 (03cbf4cf): token `20261108-review-quick1`; cả 3 bài đúng số lượt Ôn nhanh mới và nhãn nút; Ôn chi tiết nguyên vẹn; điều khiển đạt. Trình duyệt kiểm không có giọng TTS (app báo lỗi đúng thiết kế).

## Nghe ôn lai audio sách/TTS theo D33 — QA (2026-11-08)

- QA độc lập (đọc toàn bộ báo cáo): ĐẠT, 0 nghiêm trọng, 0 trung bình, 1 nhẹ (câu chữ tài liệu, đã sửa trong nhánh). Bằng chứng: dữ liệu có audio cho 100% đơn vị của 3 bài, mọi mốc start<end<=durationSec; mỗi đơn vị đúng một hàng mang audio khớp tuyệt đối trackId/start/end/URL; 19 kiểm hành vi tự viết đạt 19/19 (phát đúng đoạn, dừng đúng end, nhịp nghỉ sau đoạn 900/3000/550/750 ms như nhánh TTS, fallback cả 3 đường lỗi, dừng/chuyển chế độ ngắt cả hai nguồn, tốc độ áp cho cả playbackRate).
- Hồi quy: so khớp sâu 6 tổ hợp bài × chế độ với HEAD sau khi loại hai trường mới — giống hệt từng hàng; số lượt không đổi.
- Test tự động: audio-review 25/25, toàn bộ npm run check 246/246, validator OK, audit đạt. Phân biệt bằng chứng: kiểm bằng mã + đối chiếu dữ liệu + nghiệm thu live quan sát trạng thái; chất lượng điểm cắt asr-draft chưa nghe kiểm chứng bằng tai.
- Nghiệm thu live sau merge PR #122 (d2c83a03): token `20261108-review-bookaudio1`; bằng chứng loại trừ xác nhận đoạn MP3 sách phát thật trong nghe ôn (xem CHECKPOINT); điều khiển đạt; hồi quy đạt.

## D34 — Đoạn từ mới trong nghe ôn đủ hai lượt đọc (2026-11-08)

- Bằng chứng: báo cáo QA độc lập vòng 1 (phân tích tín hiệu độc lập cả 12 track từ vựng bằng tham số riêng + ASR theo vùng cắt; kết luận CHƯA ĐẠT, 1 lỗi nghiêm trọng 为什么/不错, 45/47 đạt, 1 ghi nhận nhẹ về heuristic độ dài đoạn) và báo cáo QA kiểm lại sau sửa (tín hiệu silencedetect + ASR đoạn cắt hai từ đã sửa: ĐẠT; 47/47 giá trị bảng khớp artifact phân tích; diff chỉ gồm bảng mốc + cách dùng + test + tài liệu + token).
- Kiểm thử bằng mã (local, không phải CI): node --test của vòng — module nghe ôn 26/26; npm run check 247/247. Test tự động chỉ kiểm tính chất cấu trúc của bảng mốc; lỗi ranh giới chỉ lộ khi đối chiếu tín hiệu + ASR (đã thực hiện ở cả hai vòng QA).
- Phần CHƯA kiểm: nghe bằng tai chất lượng điểm cắt và cảm nhận đệm đầu/cuối (chờ Hoa nghe thử trên điện thoại); danh tính nam/nữ từng lượt suy từ thứ tự đọc + ASR, không đo cao độ giọng.
