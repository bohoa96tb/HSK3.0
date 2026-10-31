# QA_REPORT — Pilot HSK 1 Bài 1 (Workbook)

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
| Hành trình học trên trình duyệt thật (local + live) | Xem mục 4 — cập nhật sau khi chạy trình duyệt | (đang chờ) |
| Giao diện 360/390/768/1440 px | Xem mục 4 | (đang chờ) |
| Thiết bị Android thật | — | CHƯA THỰC HIỆN — không tuyên bố đã thử |

## 4. Kiểm tra trình duyệt và live

(cập nhật sau khi PR merge, Pages bật và nghiệm thu trên URL thật; ghi rõ môi trường, các bước đã bấm, lỗi gặp và ảnh chụp nếu có)

## 5. Giới hạn đã biết

- Pilot mới đạt mức **nội dung sách bài tập + liên kết nguồn** cho Bài 1; chưa đạt pilot học liệu đầy đủ theo nghĩa có ngữ pháp/hội thoại/đáp án của Textbook.
- Điểm kiến thức của Bài 1 là nền phát âm theo đúng sách — không phải ngữ pháp câu; app ghi rõ vai trò này ở mọi nơi hiển thị.
- Bài 2–15 mới ở mức mục lục; HSK 2–4 mới ở mức danh mục trang Baulchino.
- Lưu tiến độ bằng localStorage (quyết định D02); chưa có đồng bộ đa thiết bị, chưa PWA.
- Hiệu năng LCP/CLS/INP: chưa đo bằng dữ liệu thực; app tĩnh nhẹ, không tải PDF/audio khi mở trang (audio chỉ tải khi bấm phát).
