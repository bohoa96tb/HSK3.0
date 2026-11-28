# Quy luật hình ảnh bắt buộc (Chuẩn Bài 3 HSK 2 — Gold Standard)

Mọi hình ảnh minh họa khi tạo mới hoặc chỉnh sửa bài học trong `HSK3.0` **BẮT BUỘC** tuân thủ tuyệt đối các nguyên tắc dưới đây, lấy **Bài 3 HSK 2** (`assets/hsk2-lesson-03/`) làm chuẩn mực cố định (Gold Standard).

---

## 1. Quy chuẩn gốc rút ra từ Bài 3 HSK 2 (Gold Standard)

- **Thư mục lưu trữ:** `assets/hsk2-lesson-<NN>/` (hoặc `assets/lesson-<NN>/` với HSK 1), kèm `PRACTICE_ATTRIBUTION.md` ghi rõ nguồn mô phỏng và trạng thái quyền.
- **Định dạng file:** **100% ảnh raster `.webp`** (nén VP8/VP8X tối ưu dung lượng, thường 13–77 KB/ảnh), **tuyệt đối không commit ảnh chụp/scan sách gốc** (theo chuẩn D19).
- **Kích thước & Tỷ lệ khung hình chuẩn:**
  - **Ảnh ngữ cảnh trang Bắt đầu (`context-*.webp`):** `1280×853` px (tỷ lệ `3:2`). Render qua `.hero-image` / `.welcome-grid .context-image` (`max-height: 220px; object-fit: cover; border-radius: 18px`).
  - **Ảnh Khởi động (`warm-*.webp`) & Tự luyện mô tả (`desc-*.webp`):** `~800×800` px (tỷ lệ vuông `1:1`). Render qua `.option-has-pic .option-pic img` (`aspect-ratio: 1; object-fit: cover; border-radius: 10px`) và `.picture-practice-grid img`.
  - **Ảnh Workbook (`wb-q*-*.webp`, `wb-p2-*.webp`, `wb-r1-*.webp`):** `880×587` px (tỷ lệ `3:2`). Render trong card trắng bo góc qua `.wb-pic-grid` (3 cột ngang ở Part I) hoặc `.wb-shared-set` (lưới 2×2 ở Listening Part II và Reading Part I), ép `.wb-pic img { width: 100%; height: auto; aspect-ratio: 3/2; object-fit: cover; }`.

---

## 2. Sáu nguyên tắc cứng bắt buộc

1. **CẤM TUYỆT ĐỐI tự code `<svg>` bằng tay cho tranh minh họa bài học**
   - Không vẽ người, đồ vật, động tác, bối cảnh bài nghe/đọc bằng `<svg>` hoặc script xuất SVG rồi raster hóa sang WebP/PNG.
   - `<svg>` chỉ được dùng cho icon UI siêu nhỏ (nút bấm, mũi tên, loa, dấu kiểm).
   - Toàn bộ tranh minh họa bài học phải là ảnh raster chất lượng cao (`.webp` nén tối ưu) sinh bằng công cụ tạo ảnh chuyên dụng (`image-generator`) theo đúng chuẩn của Bài 3.

2. **1 Art Direction duy nhất xuyên suốt toàn bộ app**
   - Phong cách chuẩn Bài 3 HSK 2: **tranh minh họa giáo trình ngôn ngữ hiện đại 2D phẳng ấm áp (modern warm flat storybook / textbook editorial illustration)** — đường nét bo mềm màu nâu than/nâu trầm mảnh sạch sẽ, đổ bóng phẳng nhẹ nhàng (`soft cel-shading`), ánh sáng tự nhiên ấm áp.
   - Bảng màu hài hòa tuyệt đối với giao diện trắng – kem – xanh lá đậm của app HSK 3.0 (`#f7f4ec`, `#ffffff`, `#1b5e46`): tường/nền kem ấm (`warm cream`), gỗ sồi nhạt (`warm oak`), xanh xô thơm (`sage green`), xanh ngọc nhạt (`soft teal`), cam đất dịu (`muted terracotta`), vàng pastel ấm (`warm honey`), xanh trời sáng nhẹ (`soft pastel sky`).

3. **Đồng bộ 100% nền & ánh sáng trong cùng một bộ đáp án**
   - Trong cùng một câu (nhóm 3 hình A/B/C) hoặc một bộ ảnh chung (lưới 2×2 A/B/C/D), **TUYỆT ĐỐI KHÔNG**:
     - Trộn ảnh nền ban đêm tối đen (ví dụ rạp phim tối thui, cửa sổ đêm đen) với ảnh phòng sáng ban ngày nền kem.
     - Trộn ảnh nhân vật/đồ vật cắt rời lơ lửng trên nền trắng trơn (`#ffffff`) với ảnh có bối cảnh phòng ốc/thiên nhiên hoàn chỉnh.
   - Mọi hình trong cùng một bộ phải có **bối cảnh tự nhiên hoàn chỉnh**, ánh sáng đồng đều (ưu tiên ánh sáng ban ngày ấm sáng hoặc ánh đèn ấm dịu sáng rõ), và mật độ chi tiết tương đương nhau.

4. **Dễ nhận diện tức thì trên màn hình điện thoại (~390px)**
   - Chủ thể và hành động chính đặt ở **trung tâm khung hình**, dùng **cận cảnh hoặc trung cảnh (close-up / medium shot)**.
   - Độ tương phản giữa chủ thể và nền rõ ràng; không nhồi quá nhiều nhân vật phụ hoặc vật thể nhỏ li ti làm mất nét hành động chính khi ảnh co xuống kích thước card ~110px (lưới 3 cột `.wb-pic-grid` trên điện thoại 390px) hoặc lưới 2×2 (`.wb-shared-set`).

5. **Ảnh sạch, KHÔNG chứa chữ thừa**
   - Tuyệt đối không có chữ Hán, pinyin, chữ tiếng Anh/tiếng Việt, số giả, nhãn A/B/C/D hoặc watermark ở bất kỳ đâu bên trong hình ảnh. (Nhãn `A/B/C/D` do UI app gắn ở `.wb-pic-letter` / `.option-letter`).

6. **Khóa tỷ lệ & hiển thị chuẩn**
   - Ảnh Workbook và Context luôn xuất đúng tỷ lệ `3:2` (`880×587` hoặc `1280×853`); ảnh Warm-up và Tự luyện xuất đúng tỷ lệ `1:1` (`800×800`).
   - Toàn bộ ảnh nằm gọn với `object-fit: cover` trong khung card, không bị cắt mất chi tiết chính (mặt người, đồ vật cần chọn đáp án), không méo, không viền thừa.

---

## 3. Master Prompt chuẩn (Khóa Art Direction Bài 3)

Khi gọi Art Agent tạo hình cho bài học, **BẮT BUỘC** dùng khung prompt khóa đồng bộ sau và chỉ thay `[MÔ TẢ CẢNH CỤ THỂ]`:

> **Master Prompt Style Anchor:**
> *"Clean modern flat storybook textbook illustration for a Mandarin learning app, matching warm editorial 2D vector style with soft thin warm-dark-brown outlines and gentle cel-shading. Bright, cheerful daytime or warm cozy pastel indoor lighting (matching a warm cream #f7f4ec and sage green #1b5e46 app palette: warm cream walls, light honey oak wood, muted sage green, terracotta, soft sky blue). Complete cohesive background scene — never dark night black voids, never isolated floating objects on sterile pure white. Centered medium-close composition so the main subject and action read clearly even as a small 110px mobile thumbnail. Zero text, zero letters, zero Chinese characters, zero numbers, zero labels anywhere in the image. [MÔ TẢ CẢNH CỤ THỂ]."*
