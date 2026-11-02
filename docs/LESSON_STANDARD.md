# CHUẨN BÀI HỌC THEO BÀI 8 (D27) — áp dụng cho toàn dự án

> Bài mẫu: **HSK 1 · Bài 8 — 我爸爸也在医院工作**, phiên bản người dùng đã duyệt:
> `contentVersion 20261102-lesson8-continue1` (PR #41–#55; gồm chuẩn D19 minh họa,
> D20 loa/text/ảnh, D22 kiểm kê độ phủ, D23 lộ trình trải nghiệm, D24 ẩn chữ dài +
> tra từ, D25 kiểm kê ví dụ + giao diện gọn, D26 nút Tiếp tục không tự liên kết).
> Người dùng xác nhận 02/11/2026: **Bài 8 là chuẩn cho toàn bộ dự án** — áp dụng
> đúng chuẩn này KHÔNG cần xin duyệt lại mẫu. Bài 8 là chuẩn về *chất lượng và
> cách tổ chức*, không phải khuôn số lượng: mỗi bài giữ đúng nội dung/mục tiêu
> của giáo trình, số từ/điểm kiến thức/hội thoại/bài tập theo đúng sách của bài đó.

## 0. Đọc trước khi làm bất kỳ bài nào

1. `AGENTS.md` (phạm vi, quyền, quy trình) và file này.
2. `docs/CHECKPOINT.md` — trạng thái từng bài + `nextTask` duy nhất.
3. `docs/CONTENT_STANDARD.md`, `docs/UI_SPEC.md`, `docs/DECISIONS.md` (D01–D27).
4. Nguồn: hai PDF người dùng cấp (vị trí ở `AGENTS.md` của workspace; chỉ mục
   trang ở bản đồ chương trình của dự án) + audio Baulchino. Quyền tái xuất bản
   vẫn `unknown`: chỉ đối chiếu nội bộ, không commit PDF/MP3/toàn văn vào repo.

## 1. Kiểm kê nguồn của bài (bắt buộc, trước khi biên soạn)

- Mở đúng bài trong Textbook **và** Workbook; ghi trang in + trang PDF.
- Kiểm kê: mục tiêu; từ mới + tên riêng (phân biệt rõ); hội thoại (vai, thứ tự,
  lời dẫn); điểm ngữ pháp/phát âm; **ví dụ và câu đọc mẫu** (gồm ô trợ giúp
  小语助力， câu hỏi mở, hoạt động cặp/lớp); bài tập (thân câu, lựa chọn, đáp án,
  hình); phần chữ Hán của Workbook; audio tương ứng.
- Lập bảng 4 trạng thái: Đã có–đúng / Có nhưng cần sửa / Còn thiếu / Chưa đủ
  nguồn kiểm tra. Không khẳng định "đủ theo sách" khi còn trang chưa đọc.
- Phân biệt nội dung sách với nội dung dự án tự biên soạn (ghi rõ trong dữ liệu
  hoặc tài liệu; không nhận là nguyên văn sách).

## 2. Cấu trúc bài (7 mục giữ nguyên route/ID)

`intro → prep → knowledge → reader → exercises → apply → summary`, cộng:

- **Lộ trình theo tình huống** (`learningPath`, ở mục Bắt đầu): các bước theo
  tình huống của chính bài, trỏ về các mục/hội thoại thật; nút Tiếp tục trong
  trang mục không bao giờ tự liên kết (D26); hiện dòng học dở trung thực.
- **Từ mới** (`prepGroups` khi bài có ≥2 hội thoại/ngữ cảnh): chia nhóm theo
  hội thoại, mỗi nhóm có nút nghe **cả nhóm bằng track gốc của sách**; thẻ từ:
  chữ Hán, Pinyin, nghĩa, Hán–Việt (có căn cứ; chưa chắc thì ghi chưa xác minh,
  không đoán), loa từng từ = giọng máy của thiết bị (ghi rõ là giọng máy).
  Tên riêng tính riêng ("N từ mới + M tên riêng").
- **Kiến thức**: điểm chính có *Khi nào dùng* (`useWhenVi`) + ví dụ ngay dưới
  (tối đa 2 ví dụ hiện, phần còn lại — nếu có — trong "Xem thêm ví dụ của sách") + **Thử ngay**
  (`quickCheck`, không ghi điểm). Mẹo/ô trợ giúp tách khối riêng; kiến thức nền
  (phát âm/chữ Hán) tách khối nền tảng. Giải thích dài vào mục thu gọn.
- **Hội thoại**: đủ câu, đúng vai/thứ tự; nghe cả track + nghe từng câu khi có
  mốc đáng tin (chưa nghe kiểm chứng thì giữ `asr-draft`, không bịa mốc);
  mỗi hội thoại có liên kết kiểm tra ngắn khi bài tập tương ứng tồn tại.
- **Bài tập**: khu A bài chính (chấm tự động chỉ khi đáp án đã kiểm chứng),
  khu B luyện thêm/tự luyện (tự đối chiếu khi không chấm được), khu C đề mô
  phỏng nếu bài có (điểm/session riêng, theo D15 chỉ lấy từ khối mô phỏng của
  Workbook). Bài nghe–viết đáp án phải đối chiếu lời đọc, ghi trạng thái rõ.
- **Tự nói** (`apply.tasks`): nhiệm vụ ngắn theo tình huống, câu mẫu đầy đủ của
  sách (ghi rõ trang), tự đánh dấu đã luyện; không khẳng định chấm phát âm.
- **Tổng kết**: `summaryPoints` (các điều chính + câu ví dụ) + trạng thái chưa
  làm trung thực (không nói "chưa có câu nào sai" khi chưa làm bài).

## 3. Quy tắc trình bày và hỗ trợ (dùng chung, không làm lại từng bài)

- Khối ví dụ 2 dòng `.ex-row/.ex-meta` (D25); chữ Hán ví dụ 1.18rem, câu 1.32rem
  theo thang `--font-scale` của người dùng; thẻ gọn trên điện thoại.
- Thanh hỗ trợ chung (Pinyin/Nghĩa/Hán–Việt/cỡ chữ) áp tại chỗ, không đổi
  route, không mất vị trí/nháp/kết quả/audio; cài đặt lưu trên thiết bị.
- Ghi chú dài (cách làm bài, cách tính điểm, nguồn, kỹ thuật) vào `details`
  thu gọn có nhãn rõ; cảnh báo ảnh hưởng cách chấm và cảnh báo quyền vẫn hiện.
- Bài tập thường **không render Pinyin/nghĩa vào DOM trước khi chấm** (D23);
  ngoại lệ duy nhất: bài luyện phát âm có nhãn "Bài luyện âm". Sau chấm mới mở
  hỗ trợ; dùng hỗ trợ ở bộ chính được ghi nhận (`supportUsed`), không ghi sang
  bộ mô phỏng. Tra từ **không** hoạt động trong bài tập.
- Hình bài tập: tranh phẳng vẽ mới của dự án, đủ ý nghĩa câu hỏi, một đáp án
  đúng rõ ràng, có manifest nguồn/quyền, file WebP riêng (D19).

## 4. Tra từ/cụm (theo Bài 8 đã duyệt)

- Bề mặt đọc (hội thoại, ví dụ kiến thức, câu mẫu tự nói, ví dụ tổng kết): chạm
  từ → thẻ tra (chữ Hán, Pinyin, Hán–Việt, nghĩa, loa giọng máy có nhãn);
  "Tra cụm" chọn từ đầu→cuối ngay dưới câu.
- Tách từ bằng từ điển đã kiểm duyệt của dự án (`segmentZh`, longest-match)
  trên từ vựng các bài + mục bổ sung riêng của bài (`lookup.extras/phrases`).
  Hán–Việt chưa có căn cứ → để trống và báo "Chưa có dữ liệu đã kiểm chứng".
- Mỗi bài công bố độ phủ tách từ đã đo trên các bề mặt đích của chính bài;
  không khẳng định 100% khi chưa đo. Từ đa âm/ngữ cảnh đặc biệt xử lý bằng
  mục bổ sung của bài.

## 5. Audio

- Audio sách: stream từ Baulchino, đúng bài/đúng track; mốc đoạn câu/từ giữ
  `asr-draft` cho tới khi nghe kiểm chứng bởi người; loa đơn vị ngắn dùng
  giọng máy thiết bị (zh-CN) và ghi nhãn giọng máy (D20); hai nguồn loại trừ
  nhau trên cùng một nút. Audio lỗi/không có → báo rõ, bài học vẫn hoạt động.

## 6. Điều kiện hoàn thành một bài (QA theo D17)

1. Đã kiểm kê + đối chiếu các trang nguồn truy cập được; giới hạn ghi rõ.
2. Từ mới/tên riêng đủ theo sách; Hán–Việt và đa âm đã kiểm.
3. Hội thoại/ví dụ/câu mẫu/bài tập khớp bản in (chữ, dấu câu, thứ tự, đáp án).
4. Audio đúng track; nhãn nguồn đúng (sách/giọng máy); mốc chưa nghe = draft.
5. Bài tập chấm đúng, không lộ đáp án/Pinyin trước khi chấm.
6. Tra từ/cụm hoạt động trong phạm vi độ phủ đã công bố của bài.
7. Giao diện điện thoại đạt chuẩn mục 3; tiến độ/cài đặt/dữ liệu cũ an toàn.
8. Test tự động đạt + QA nội dung độc lập đạt (báo cáo đầy đủ, khép trong
   nhánh) + nghiệm thu live sau merge (byte khớp + tương tác chính).

## 7. Phát hành và tiếp tục

- Nhánh riêng → PR → merge → Pages → nghiệm thu live → PR sổ sách (checkpoint
  + QA_REPORT). CI Actions chưa tạo được (403): không gọi kiểm tra local là CI.
- Sau mỗi bài/lô: cập nhật bảng trạng thái trong `docs/CHECKPOINT.md`.
- "Tiếp tục" = làm tiếp đúng `nextTask` trong checkpoint, theo thứ tự chuẩn
  hoá Bài 1→8 rồi bài mới theo giáo trình; không hỏi lại việc áp dụng chuẩn.
