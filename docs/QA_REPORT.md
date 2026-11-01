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
