# AGENTS.md — Hướng dẫn làm việc trong repo HSK3.0

Tài liệu này là quy tắc làm việc bắt buộc cho mọi phiên làm việc trong repo này.
Đặc tả đầy đủ: `docs/MASTER_PLAN.md`. Trạng thái phiên: `docs/CHECKPOINT.md`.

## 1. Phạm vi — chỉ một repo, một nguồn

- **Repo duy nhất:** `bohoa96tb/HSK3.0` (https://github.com/bohoa96tb/HSK3.0).
  Không sửa, không ghi đè, không commit vào bất kỳ repo nào khác — đặc biệt
  không sửa `hazi-viet` và không sửa `hanngu-grammar`.
- **Nguồn học liệu duy nhất:** Baulchino — https://www.baulchino.com/ và các
  tài sản (PDF, MP3) mà trang này dẫn tới, thuộc mục HSK 3.0 (ấn bản 2026).
- Các website học tiếng Trung khác (Du Chinese, HelloChinese…) chỉ được dùng
  để tham khảo trải nghiệm/UX như đặc tả mục 3.1. Không lấy học liệu của họ
  thay cho Baulchino.
- Nguồn đối chiếu chuẩn HSK (https://www.chinesetest.cn/HSK,
  https://www.chinesetest.cn/syllabus) chỉ dùng để kiểm tra phiên bản và ánh
  xạ ngữ pháp, không thay nguồn bài học Baulchino.

## 2. Quy tắc nội dung — không bịa, không lấp chỗ trống

- Không tự sinh hội thoại, ví dụ, bài tập, đáp án hoặc giọng đọc (TTS) để lấp
  phần còn thiếu. Thiếu dữ liệu thì ghi rõ `unverified` / `blocked` và tiếp
  tục phần độc lập có thể làm.
- Không lấy tên bài, số bài, nội dung từ trí nhớ. Không trộn HSK 2.0 vào
  HSK 3.0. Mọi nội dung phải truy được về nguồn qua `sourceRefs`.
- Tiếng Việt trong app là **bản dịch/chú giải biên tập** từ nguồn, phải tự rà
  soát độ chính xác. Không quảng cáo là bản dịch chính thức.
- Pinyin phải đối chiếu bản in của nguồn; không xuất bản kết quả chuyển đổi
  tự động chưa được kiểm tra.
- Đáp án chưa kiểm chứng (`answerStatus=unverified`) **không** được dùng để
  chấm tự động — chuyển sang chế độ tự đối chiếu / tự đánh giá.
- Nghe từng câu chỉ bật khi đã kiểm chứng mốc bắt đầu/kết thúc. Chưa chắc
  thì dùng nghe cả đoạn/track.
- Không tuyên bố đã nghe audio, đã thử Android thật hoặc đã kiểm tra độc lập
  nếu thực tế chưa thực hiện.

## 3. Quy tắc quyền sử dụng

- Trạng thái quyền mặc định của mọi tài sản Baulchino là
  `rightsStatus=unknown` cho tới khi có bằng chứng ngược lại (xem
  `docs/SOURCE_AUDIT.md`). Nút tải miễn phí trên trang nguồn **không** phải
  là quyền tái xuất bản.
- Khi chưa có căn cứ tái xuất bản: app chỉ **liên kết và phát trực tiếp từ
  nguồn** (link/stream). Không lưu trữ bản sao PDF/MP3. Ngoại lệ do người dùng yêu cầu ở lượt sửa 31/10–01/11/2026: cho phép trích nhỏ hình đúng bài để minh họa và làm bài tập, phải ghi nguồn; không coi đây là giấy phép mở.
- **Không commit PDF, MP3 hoặc toàn văn sách vào repo công khai.**
- Không dùng proxy hoặc giải pháp vượt hạn chế để nhúng nguồn.
- Không tự liên hệ bên thứ ba (kể cả chủ nguồn) khi chưa được người dùng cho phép.

## 4. Chạy local

App pilot là web tĩnh không build (xem quyết định D01 trong
`docs/DECISIONS.md`). Chạy từ thư mục gốc của repo:

```bash
python3 -m http.server 8000
# Mở: http://localhost:8000/  (base path khi triển khai GitHub Pages: /HSK3.0/)
```

Không cần dependency để chạy app. Kiểm thử DOM dùng jsdom (devDependency); chạy npm ci trước npm run check.

## 5. Lệnh kiểm tra

```bash
npm ci                    # dependency chỉ cho kiểm thử DOM
node scripts/validate.mjs   # kiểm schema, ID, liên kết, nguồn, timestamp
node --test tests/*.test.mjs          # unit test (node:test)
```

- Chạy cả hai lệnh trước khi commit/PR. Ghi kết quả thật (số test pass/fail)
  vào `docs/CHECKPOINT.md` và `docs/QA_REPORT.md`.
- CI GitHub Actions chưa được cấu hình do quyền workflow của lần trước. Không tuyên bố CI xanh; chạy npm run check cục bộ. CI xanh **không** phải
  bằng chứng nội dung ngôn ngữ đúng hoặc audio đã nghe — QA nội dung ghi riêng.
- Kiểm giao diện ở 4 bề rộng: 360, 390, 768 và 1440 px.

## 6. Quy trình "Tiếp tục"

Khi người dùng nói "Tiếp tục":

1. Đọc file này và `docs/CHECKPOINT.md`.
2. Kiểm tra trạng thái repo thật: nhánh hiện tại, `git status`, HEAD,
   PR đang mở. Không mặc định repo vẫn trống; giữ nguyên thay đổi hợp lệ
   đã có, không reset, không ghi đè.
3. Thực hiện đúng `nextTask` duy nhất ghi trong checkpoint, trong chặng
   hiện tại (M0 → M6, rồi pilot). Không lập lại kế hoạch từ đầu, không hỏi
   lại quyết định đã chốt trong `docs/DECISIONS.md`.
4. Trước khi pilot được người dùng nghiệm thu: chỉ hoàn thiện pilot và sửa
   lỗi. Không nhập hàng loạt bài HSK 1, không chuyển cấp.

Cuối mỗi phiên, cập nhật `docs/CHECKPOINT.md` với: chặng và bài đang làm,
việc đã hoàn tất cùng bằng chứng, lỗi/phần bị chặn, kiểm thử đã chạy và kết
quả, commit/PR và URL triển khai nếu có, và **một** nhiệm vụ tiếp theo cụ thể.

## 7. Git và phát hành

- Làm việc qua nhánh + PR; không force-push, không xóa lịch sử, không ghi đè
  công việc không thuộc nhiệm vụ.
- Chỉ merge khi kiểm tra đạt. Sau triển khai, mở URL thật để nghiệm thu lại
  các chức năng chính.
- Không bật dịch vụ trả phí, không mua tài nguyên, không gửi tin nhắn/email
  cho bên thứ ba.
- Không bao giờ báo repo đã tạo/đẩy/triển khai trước khi thao tác thực tế
  thành công. Nếu thiếu quyền truy cập, nêu đúng bước người dùng phải làm
  và tiếp tục phần việc độc lập.

## 8. Báo cáo trung thực

Báo cáo cuối lượt gồm 6 mục ngắn gọn:

1. Đã hoàn thành gì.
2. Link xem thử hoặc bản đã triển khai.
3. Nguồn đã kiểm chứng.
4. Kiểm thử đã thực hiện.
5. Phần thiếu / chưa xác minh.
6. Bước tiếp theo.

Phân biệt rõ ba trạng thái: đã rà soát nội dung, đã đẩy code, đã nghiệm thu
trên bản triển khai thật. Nếu chưa thể công bố học liệu đầy đủ, nói chính xác
bản phát hành mới là khung / liên kết nguồn, chưa đạt pilot học liệu hoàn chỉnh.
Không gọi sản phẩm là "đầy đủ HSK 3.0" khi ma trận nguồn và ánh xạ đề cương
chưa chứng minh được điều đó.
