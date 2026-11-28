# Quy trình tạo & sửa bài học theo đội 3 vai độc lập

Khi tạo mới hoặc chỉnh sửa bất kỳ bài học nào trong repo `HSK3.0`, **BẮT BUỘC** làm việc trên nhánh riêng `preview/<ten-bai>` (tách từ `main`, tuyệt đối không commit/push/merge lên `main` khi chưa có xác nhận duyệt) và thực hiện đủ **3 vai tách biệt** theo đúng trình tự sau:

---

## Vai 1 — Builder Agent (Nội dung & Code)

**Phạm vi:** Dữ liệu bài học, khung cấu trúc 7 mục, âm thanh, bài tập, kiểm tra schema/logic.

1. Đọc tài liệu nguồn Baulchino được cấp phép đối chiếu (Textbook, Workbook, Writing Book, Audio MP3) — không bịa nội dung, không trộn HSK 2.0 vào HSK 3.0.
2. Biên soạn cấu trúc bài học theo đúng chuẩn Bài 3 / Bài 8 (`docs/LESSON_STANDARD.md`):
   - `intro`, `prep` (4 nhóm từ mới + track), `knowledge` (3 ngữ pháp + mẹo + Hán tự nền tảng), `reader` (4 đoạn + track + câu hỏi tại đoạn), `exercises` (bộ chính + đủ 30 câu Workbook `模拟测练`), `apply`, `summary` (kèm `audio-review.js` + `writingSets`).
3. **Xuất bảng đặc tả ảnh cần vẽ (Art Brief)** cho Vai 2 gồm:
   - ID câu / vị trí dùng ảnh (`context`, `warm-*`, `desc-*`, `wb-q*`, `wb-p2-*`, `wb-r1-*`).
   - Tên file `.webp` đích trong `assets/<lesson-dir>/` và kích thước bắt buộc (`1280×853`, `800×800`, hoặc `880×587`).
   - Mô tả hành động/đồ vật cốt lõi để phân biệt đáp án đúng với đáp án nhiễu, kèm yêu cầu bối cảnh nền sáng/đồng bộ theo nhóm.
4. **Ràng buộc cấm:** Builder Agent **TUYỆT ĐỐI KHÔNG** tự code `<svg>` minh họa hay tạo ảnh placeholder tạm để giao bài.

---

## Vai 2 — Art Agent (Hình ảnh)

**Phạm vi:** Sinh, chuyển đổi, tối ưu toàn bộ hình ảnh `.webp` và ghi `PRACTICE_ATTRIBUTION.md`.

1. Đọc kỹ `.agent/rules/lesson-images.md` và toàn bộ Art Brief từ Vai 1.
2. Áp dụng **1 Master Prompt thống nhất** (bám chặt Art Direction của Bài 3 HSK 2) để sinh trọn bộ ảnh cho bài học trong cùng phiên nhằm khóa đồng bộ tuyệt đối về nét vẽ, ánh sáng, độ bão hòa màu và mật độ chi tiết giữa các đáp án A/B/C/D.
   - *Lưu ý tỷ lệ & ánh sáng theo cụm:*
     - Các ảnh trong cùng 1 câu (A/B/C) hoặc cùng 1 bộ ảnh chung (A/B/C/D) phải dùng cùng tông nền/ánh sáng (ví dụ cả 3 câu đều sáng ấm hoặc ban ngày, không để riêng C tối thui hoặc D nền trắng trơn).
     - Không chấp nhận chữ/số/ký tự A/B/C/D hay chữ Hán lẫn trong tranh; không cắt mất tay/mặt/vật thể chính.
3. Nén và chuẩn hóa kích thước sang `.webp` đúng chuẩn (`1280×853`, `800×800`, `880×587`), lưu đúng thư mục `assets/<lesson-dir>/`, cập nhật `PRACTICE_ATTRIBUTION.md`.

---

## Vai 3 — Visual QA Agent (Kiểm duyệt độc lập — CHỐT CHẶN BẮT BUỘC)

**Phạm vi:** Kiểm tra trực quan bản chạy thật trên màn hình điện thoại và toàn bộ UI. Không tự sửa code nội dung bài học.

1. Khởi động bản preview cục bộ (và kiểm qua `npm run check` + `node scripts/audit-standard.mjs`).
2. Mở trình duyệt headless ở khung nhìn **điện thoại `390×844`** (và kiểm thêm tràn ngang tại `360px`, `768px`, `1440px`), truy cập trực tiếp từng khu có ảnh (`intro`, `exercises`, `apply`, `summary`, `writing`), mở rộng các mục thu gọn và **chụp/soi từng ảnh & từng cụm lưới hiển thị thực tế**.
3. Chấm điểm nghiêm ngặt theo **Checklist 6 tiêu chí bắt buộc**:
   - [ ] **Tiêu chí 1 (Không SVG vẽ tay):** 0 `<svg>` minh họa vẽ tay (kể cả file `.webp` chuyển từ SVG); 100% ảnh minh họa là raster `.webp` sinh bằng công cụ chuyên dụng.
   - [ ] **Tiêu chí 2 (Đồng bộ 100% nền & ánh sáng theo cụm):** Toàn bộ ảnh trong cùng 1 câu (A/B/C) hoặc bộ ảnh chung (A/B/C/D) đều có nền bối cảnh hoàn chỉnh, độ sáng & tông màu tương đồng — không có ảnh tối đen kẹp giữa ảnh sáng, không có ảnh nhân vật lơ lửng trên nền trắng trơn.
   - [ ] **Tiêu chí 3 (Khớp Art Direction Bài 3):** Nét vẽ, bảng màu ấm dịu (kem – gỗ sáng – xanh lá xô thơm), độ chi tiết giữa các phần trong bài và với Bài 3 HSK 2 nhất quán.
   - [ ] **Tiêu chí 4 (Đọc rõ ở 390px):** Ở kích thước lưới 3 cột (`.wb-pic-grid`) hoặc 2×2 (`.wb-shared-set`) trên màn hình 390px, người học nhận ra ngay hành động/đồ vật của câu nghe mà không phải căng mắt đoán.
   - [ ] **Tiêu chí 5 (Sạch lỗi vẽ & sạch chữ):** Không có chữ/ký tự lỗi, không có tay thừa ngón, mặt méo hoặc đồ vật biến dạng.
   - [ ] **Tiêu chí 6 (Kỹ thuật sạch):** `npm run check` pass 100%, 0 lỗi console JS, 0 lỗi mạng/404 ảnh, 0 vỡ layout hoặc tràn ngang (`scrollWidth <= innerWidth`).
4. **Cơ chế trả bài bắt buộc:**
   - Nếu có **bất kỳ 1 hình nào** vi phạm bất kỳ tiêu chí nào trong 6 tiêu chí trên → **lập tức trả về Vai 2 (Art Agent)** kèm mô tả lỗi cụ thể để vẽ lại đúng hình đó, rồi Visual QA Agent kiểm lại từ đầu.
   - Giới hạn **tối đa 2 vòng sửa/kiểm lại**. Nếu sau 2 vòng vẫn còn điểm nghẽn (ví dụ hạn mức công cụ sinh ảnh), phải dừng và báo trung thực lý do cho người dùng, tuyệt đối không tự chèn hình tạm/SVG để lấp chỗ.
   - Chỉ khi đạt **6/6 tiêu chí** mới được phép báo hoàn tất, commit/push lên nhánh `preview/<ten-bai>` và gửi link xem thử cho người dùng duyệt.
