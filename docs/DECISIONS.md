# DECISIONS.md — Nhật ký quyết định

Mỗi quyết định ghi: nội dung, lý do, ảnh hưởng và điều kiện xem lại.
Quyết định đã chốt ở đây không hỏi lại khi "Tiếp tục" (xem `AGENTS.md`).
Ngày chốt các quyết định dưới đây: **2026-10-31**, trừ khi ghi khác.

## D01 — Stack pilot: web tĩnh không build

- **Quyết định:** Pilot dùng HTML + ES modules + CSS thuần, hash router,
  base path `/HSK3.0/`; dữ liệu JSON tách riêng kèm JSON Schema, validator
  bằng Node, test bằng `node:test`; CI GitHub Actions chạy validator + test.
  Không dùng framework/bundler trong pilot.
- **Lý do:** Triển khai thẳng lên GitHub Pages, loại bỏ rủi ro toolchain,
  trong khi vẫn giữ đúng mô hình dữ liệu và hành vi thành phần mà đặc tả
  yêu cầu. Đặc tả mục 9 ghi stack React + TypeScript + Vite là phương án
  "đề xuất" và cho phép quyết định khác có lý do.
- **Ảnh hưởng:** Không có bước build; chạy local bằng
  `python3 -m http.server`. Cấu trúc thư mục bám đặc tả mục 9
  (`src/`, `schemas/`, `scripts/`, `tests/`, `docs/`) để việc chuyển đổi
  sau này không đổi mô hình dữ liệu.
- **Xem lại khi:** Pilot được nghiệm thu và phát sinh nhu cầu mà web tĩnh
  thuần không đáp ứng tốt (quy mô component/state lớn) — khi đó cân nhắc
  chuyển React + TypeScript + Vite.

## D02 — Lưu trữ pilot: localStorage, hoãn IndexedDB

- **Quyết định:** Pilot lưu tiến độ và cài đặt bằng `localStorage`, có
  `schemaVersion` trong dữ liệu và xuất/nhập JSON (validate trước khi ghi,
  sao lưu trước khi ghi đè). Chưa dùng IndexedDB.
- **Lý do:** Giảm độ phức tạp của pilot; khối lượng dữ liệu tiến độ/cài đặt
  nhỏ, nằm trong giới hạn localStorage. `schemaVersion` đã chừa đường
  migration nên chuyển đổi sau không mất lịch sử học.
- **Ảnh hưởng:** Đặc tả mục 9 đề xuất IndexedDB cho tiến độ — pilot chủ
  động hoãn, không bỏ. Mọi thay đổi cấu trúc dữ liệu lưu phải tăng
  `schemaVersion` và có migration.
- **Xem lại khi:** Dữ liệu tiến độ/lần làm bài lớn lên sau pilot, hoặc cần
  truy vấn lịch sử phức tạp — khi đó chuyển sang IndexedDB theo đặc tả.

## D03 — Phạm vi pilot: Workbook HSK1 Bài 1

- **Quyết định:** Bài pilot là **Workbook HSK1 Bài 1 — AI小语，你好！**
  (trang in 001–004, track workbook 1-1 và 1-2).
- **Lý do:** Đây là bài đầu của HSK1 có đủ văn bản + bài tập + audio **đã
  kiểm chứng từ chính sách in** (đã đọc trực quan) và danh mục audio
  (đối ứng số hiệu track, kiểm HEAD thành công). Không phải bỏ qua bài nào
  trước nó — đây là bài 1.
- **Giới hạn phải ghi rõ:** Điểm kiến thức của bài là **nền phát âm**
  (âm tiết / thanh mẫu / vận mẫu / thanh điệu) theo đúng sách — đây
  **không** phải điểm ngữ pháp câu. Nội dung Textbook Bài 1 **chưa kiểm
  chứng** (PDF textbook mở lỗi), nên pilot là "pilot nội dung sách bài
  tập + liên kết nguồn", **chưa** phải pilot học liệu đầy đủ theo nghĩa
  có ngữ pháp/hội thoại của textbook. Không ép nguồn vào khuôn bằng nội
  dung tự tạo để che giới hạn này.
- **Xem lại khi:** Đọc được Textbook HSK1 trực tiếp — khi đó bổ sung phần
  textbook của Bài 1 (ngữ pháp, hội thoại) theo đúng quy trình nội dung.

## D04 — Chấm bài tập pilot: chỉ chấm phần đã kiểm chứng từ bản in

- **Quyết định:**
  - Chấm tự động **chỉ** gồm câu hỏi biên tập tiếng Việt về nội dung đã in:
    mọi lựa chọn và đáp án đều lấy trực tiếp từ trang in 001–004 của
    Workbook Bài 1, `answerStatus=verified-from-print`.
  - Bài nghe viết 2–4 (viết thanh mẫu, viết vận mẫu, đánh dấu thanh điệu)
    và bài 5 (nhìn hình chọn hội thoại) để chế độ **tự đối chiếu / tự
    đánh giá**, `answerStatus=unverified`, không tính điểm tự động.
- **Lý do:** Không thấy phần đáp án trong Workbook (đã xem các trang cuối:
  chỉ có Mock Test và bìa sau) → đáp án các bài đó chưa kiểm chứng. Nguyên
  tắc của dự án: đáp án chưa kiểm chứng không được dùng để chấm tự động.
  Bài 5 còn phụ thuộc hình, không bỏ hình rồi chấm.
- **Ảnh hưởng:** Điểm tự động của pilot chỉ phản ánh phần `verified-from-print`;
  giao diện và báo cáo điểm phải phân biệt rõ hai chế độ, cùng điểm lần
  đầu / làm lại / đã dùng gợi ý (xem `docs/CONTENT_STANDARD.md` mục 6.2).
- **Xem lại khi:** Tìm được đáp án chính thức đã kiểm chứng cho các bài
  trên (ví dụ từ ấn bản/tài liệu nguồn khác của Baulchino) — khi đó nâng
  `answerStatus` kèm bằng chứng ghi trong `docs/SOURCE_AUDIT.md`.

## D05 — Audio pilot: một player, nghe cả track, tắt nghe từng câu

- **Quyết định:** Toàn app dùng **một** phần tử audio duy nhất. Pilot phát
  cả track từ URL nguồn Baulchino; tốc độ 0,75 / 1 / 1,25. **Không** bật
  nghe từng câu. Lỗi mạng khi phát: hiện Thử lại + Mở nguồn, không thay
  bằng TTS.
- **Lý do:** Chưa có timestamp theo câu nào được kiểm chứng (chưa nghe
  kiểm chứng audio — môi trường kiểm không có khả năng nghe; mới kiểm
  được thời lượng bằng ffprobe và đối ứng số hiệu track). Bật nghe từng
  câu khi chưa chắc mốc bắt đầu/kết thúc là lỗi chặn phát hành theo đặc tả.
- **Ảnh hưởng:** Track Workbook Bài 1 đã kiểm HEAD (200, `audio/mpeg`,
  hỗ trợ range) và đo thời lượng (1-1: 252,2 giây; 1-2: 371,3 giây) nhưng
  trạng thái khớp văn bản vẫn là "chưa nghe kiểm chứng" trong mọi báo cáo.
- **Xem lại khi:** Có vòng nghe kiểm chứng thật (người nghe hoặc công cụ
  được phép) xác nhận nội dung track và mốc từng câu — khi đó mới tạo
  segment `verified` và bật nghe từng câu.

## D06 — Nguồn và quyền: chỉ liên kết / phát trực tiếp, không sao chép

- **Quyết định:** Khi `rightsStatus=unknown`, app chỉ liên kết về nguồn và
  phát trực tiếp (stream) từ URL nguồn. Không sao chép, không lưu trữ,
  không đưa PDF / MP3 / toàn văn sách vào repo công khai. Nếu chủ nguồn
  yêu cầu, chuyển sang link-only thuần.
- **Lý do:** Trên hai trang Baulchino đã đọc ngày 2026-10-31 không thấy
  tuyên bố giấy phép/bản quyền cho sách/audio. Nút tải miễn phí và giấy
  phép mã nguồn website không phải quyền tái xuất bản sách của bên thứ ba.
- **Ảnh hưởng:** Mọi tài sản giữ `rightsStatus=unknown` trong
  `docs/SOURCE_AUDIT.md` cho tới khi có bằng chứng khác. Bản dịch tiếng
  Việt là chú giải biên tập, ghi rõ vai trò, xét riêng trong phạm vi cho phép.
- **Xem lại khi:** Có bằng chứng quyền rõ ràng cho từng loại tài sản —
  ghi bằng chứng vào `rightsEvidence` của Source tương ứng rồi mới đổi
  cách hiển thị tương ứng.

## D07 — Hai quyết định hoãn có điều kiện (tổng hợp)

- **Chưa dùng IndexedDB** (D02) và **chưa dùng React/TypeScript/Vite**
  (D01) trong pilot. Cả hai đều là hoãn có lý do, không phải loại bỏ:
  đặc tả vẫn là chuẩn đích. Điều kiện xem lại ghi ở từng quyết định;
  khi xem lại phải ghi quyết định mới vào file này, không sửa ngược lịch sử.

## Mẫu ghi quyết định mới

```
## D<nn> — <Tên quyết định>
- **Quyết định:** …
- **Lý do:** …
- **Ảnh hưởng:** …
- **Xem lại khi:** …
```


## D08 — Bản học liệu và UX mới, 01/11/2026 JST

Người dùng yêu cầu trực tiếp sửa toàn bộ UI và rà nguồn, gồm hình trích từ sách. Giữ app tĩnh và GitHub Pages, không chuyển hosting. Mở khóa Textbook bằng tải PDF và render PyMuPDF; trang 16–19 là Bài 1.

Thay 6 câu trắc nghiệm tự soạn gắn nhãn nguồn sai bằng bài chọn hình nguyên bản Workbook bài 5. 3 đáp án hình là suy luận biên tập đã đối chiếu trực quan (`verified-from-visual`), không phải đáp án chính thức. Không sinh câu hỏi mới.

10 lượt thoại được đối chiếu bản in, ghép 3 track sách giáo khoa theo ký hiệu in. `print-verified` không đồng nghĩa audio-verified; chưa bật timestamp hay nghe từng câu. Phát âm Workbook tách thành phần bổ trợ.

4 hình trích nhỏ theo yêu cầu người dùng, có attribution; không PDF/MP3 trong repo. Quyền nguồn vẫn unknown, không gán giấy phép mở. Không dùng ảnh web khác thay hình có vai trò quyết định đáp án.

Lịch sử điểm cũ được giữ, loại câu tự soạn khỏi hàng đợi ôn hiện tại. Tiến độ nội dung cũ được lưu snapshot một lần khi nâng sang textbook-pilot-v2; lộ trình mới bắt đầu lại vì nội dung đã đổi đáng kể. Các bản sửa nhỏ sau không reset.

## D09 — Bài 2 và khái quát hóa nhiều bài, 01/11/2026 JST

Người dùng cho phép bắt đầu HSK1 Bài 2 （我叫李文） ngày 2026-11-01, dùng Bài 1 hiện hành làm mẫu; chỉ làm Bài 2, không làm Bài 3, không nhập hàng loạt.

Nội dung bài thứ hai trở đi nằm ở `additionalLessons` trong `data/content.json`, cùng shape với `pilot` (Bài 1 giữ nguyên vị trí để không đổi dữ liệu đã phát hành). Renderer dùng chung qua `contentFor(lessonId)`; mọi bài `pilot-ready` phải có content entry và ngược lại (validator bắt buộc).

Phiên làm bài tập tách theo bộ bài tập: `progress.exerciseSessions[setId]`, đồng thời giữ `exerciseSession` làm bản sao của phiên gần nhất để tương thích ngược. Migration gieo `exerciseSessions` từ `exerciseSession` cũ; tiến độ, lần làm bài, nháp và hàng đợi ôn của Bài 1 không đổi khi thêm Bài 2. Nháp tự đối chiếu lưu theo `progress.drafts[taskId:index]`.

Đáp án bài chọn hội thoại theo hình của Workbook Bài 2 là suy luận biên tập đã đối chiếu trực quan từng hình (`verified-from-visual` kèm `answerEvidence`), không phải đáp án chính thức — cùng quy ước với Bài 1. Ba bài nghe–viết Bài 2 không có đáp án trong sách nên giữ `unverified`, chỉ lưu nháp và tự đánh giá.

Phiên bản tài nguyên đổi sang `?v=20261101-lesson2` đồng bộ ở index.html và các module để tránh cache cũ sau khi thêm bài.
