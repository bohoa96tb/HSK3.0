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
- **Kiểm nghe thực tế:** CHƯA thực hiện — mọi đoạn giữ `asr-draft`. Hai bài phân biệt phát âm giữ `unverified`, không chấm tự động: đã thử đọc tài liệu lời đọc đăng lại (Scribd) hai lượt trong ngày để đối chiếu, cả hai lượt trang không tải xong, không có căn cứ nâng trạng thái.
- **Kiểm giao diện:** nghiệm thu live trên URL thật đạt 8/8 bước (lộ trình hiện 7 bài; 27 thẻ từ + Hán–Việt đúng; loa câu Hội thoại 3 phát đúng đoạn; nút Ôn lại của câu 4 mở đúng điểm Cách nói giờ (2) và quay lại đúng câu; hai bài phát âm không có chấm tự động; tiến độ giữ sau reload; hồi quy Bài 6 chấm âm tiết và ô source-conflict Bài 5 còn nguyên). Kiểm responsive bằng iframe tests/responsive.html: 3 tuyến × 360/390/768/1440 đạt 12/12, cộng tuyến Từ cần biết ở 390 với cỡ chữ lớn nhất đạt. Chưa kiểm trên thiết bị Android thật.

Giới hạn đã biết: chưa Android thật; chưa CI GitHub Actions (403 — handoff ở docs/ci/); quyền nguồn unknown.
