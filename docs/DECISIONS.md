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

## D10 — Đáp án nghe–viết Bài 1–2 và chấm theo đoạn, 01/11/2026 JST

- Thêm trạng thái đáp án `verified-editorial`: đáp án biên tập đã đối chiếu ba chiều (đề bản in + tài liệu lời đọc + thứ tự âm tiết trong track qua ASR nháp local), phân biệt với đáp án chính thức của NXB. Cả 6 bài nghe–viết Bài 1–2 (78 ô) dùng trạng thái này và được chấm tự động; mỗi bài lưu `scriptSyllables`, `answers`, `answerEvidence`, `gradingMode`, `version`.
- Nguồn bổ sung (ghi ở `docs/SOURCE_AUDIT.md`): tài liệu lời đọc và tài liệu đáp án đăng lại trên Scribd (xuất xứ chưa xác nhận; hai bản đăng lại của tài liệu đáp án tính là một nguồn), xinhsk bị chặn ở đăng nhập, trang FLTRP chính thức chỉ xác nhận ấn bản/ISBN. Quyền vẫn `unknown`.
- Sửa đề ô 10 bài thanh mẫu Bài 1: "__ ēn" → "__ ěn" (bản in + lời đọc đều là ěn/hěn).
- Chấm theo quy tắc ở CONTENT_STANDARD bổ sung 01/11/2026: thanh mẫu chấm phụ âm đầu; vận mẫu bắt buộc dấu thanh; thanh điệu nhận dấu/số; u≠ü trừ sau j/q/x; điểm lần đầu khóa riêng trong `progress.dictation`, làm lại không ghi đè, xem lời đọc trước khi làm được ghi `peeked`; ô sai lần đầu vào hàng đợi ôn với khóa `dict-<taskId>:<ô>`. Tự đánh giá cũ giữ nguyên, không chuyển thành điểm.
- Audio: thêm `playSegment` và mốc đoạn theo bài nghe–viết (`audioSegment`) từ ASR nháp đối chiếu lời đọc; hội thoại vẫn phát cả track; nghe từng câu vẫn tắt.
- CI: thử tạo `.github/workflows/ci.yml` qua GitHub connector ngày 01/11/2026 vẫn bị **403 "Resource not accessible by integration"**. Bản workflow hoàn chỉnh để tại `docs/ci/ci.yml`; cần người dùng tạo `.github/workflows/ci.yml` từ bản đó qua giao diện web GitHub hoặc cấp quyền workflow cho GitHub App. Kiểm thử tiếp tục chạy local (`npm run check`).

## D11 — Thanh hỗ trợ áp dụng tại chỗ; loa theo đơn vị với đoạn căn bằng máy (01/11/2026)

- Bối cảnh: bản live tái hiện lỗi bật Pinyin ở Nghe & đọc làm trang nhảy về đầu (scrollY 455→0) vì mọi thay đổi hiển thị đều render lại toàn trang; thẻ từ và câu hội thoại chưa có loa riêng; chữ hướng dẫn nghe–viết còn nói "không chấm điểm" sau khi đã chấm tự động.
- Quyết định:
  1. Thanh hỗ trợ dùng chung (Pinyin/Nghĩa/Cỡ chữ) áp dụng bằng class + biến CSS, không render lại; render cùng route khôi phục vị trí theo phần tử neo. Thiết lập vẫn lưu trong `settings` hiện có (không đổi khóa, không mất tương thích).
  2. Loa theo đơn vị dùng một thành phần chung và một audio duy nhất; ánh xạ lưu trên chính đơn vị dữ liệu với trạng thái `asr-draft`. Độ phủ đạt được: câu hội thoại 20/20, từ mới 26/27 （大家 bị gộp khi đọc), từ kèm hình 20/24 （雨/五/一/椅子 không nhận diện tin cậy được token), lựa chọn bài tập 25/25, ví dụ điểm kiến thức 26/33 đơn vị thật (thiếu 6 âm tiết đơn lẻ + 雨）. Không mục nào được nâng lên "đã nghe kiểm chứng".
  3. Kết quả lần kiểm tra gần nhất của nghe–viết lưu bền trong `progress.dictation[].last` (kèm đáp án người học đã nhập) để khôi phục phản hồi sau refresh; ô bị sửa sau chấm chuyển trạng thái "cần kiểm tra lại". Điểm lần đầu không đổi.
  4. Ba bài nghe–viết thành accordion có thanh thao tác sticky theo bài.
- Hệ quả: validator cho phép segment/ref mang trạng thái `asr-draft` (trước đây chặn mọi segment chưa verified) nhưng bắt buộc khai trạng thái; CONTENT_STANDARD bổ sung chính sách căn đoạn bằng máy. Kiểm thử tăng lên 30 (thêm ux.test.mjs).

## D12 — Hán–Việt mặc định tắt; hỗ trợ Mục 5 ghi riêng; mini player đo chiều cao thật (01/11/2026, lượt ux3)

- Bối cảnh: bản ux2 còn thiếu Nghĩa ở Mục 2, Mục 5 chỉ có cỡ chữ (dữ liệu lựa chọn chưa có Pinyin/nghĩa), thẻ từ thừa khoảng trắng, mini player che nội dung cuối trang, tên mức chữ "Thường" chiếm hàng chính.
- Quyết định:
  1. Hán–Việt là trường dữ liệu riêng (`hanViet`/`hanVietStatus`/`hanVietNoteVi`) với nguồn từ điển riêng ghi trong SOURCE_AUDIT, mặc định **tắt**, lưu lựa chọn trên thiết bị. Chữ đa âm chọn theo ngữ cảnh từ, không ghép âm đầu tiên; chưa xác minh thì để `missing` rõ ràng. Bài 1–2 đạt 27/27 đã rà.
  2. Thanh hỗ trợ theo phạm vi: Mục 2 đủ Pinyin/Nghĩa/Hán–Việt/A−/A+; Mục 5 đủ Pinyin/Nghĩa/A−/A+. "Nghĩa" chỉ điều khiển bản dịch, không ẩn hướng dẫn/phản hồi. Tên mức chữ chuyển vào nhãn trợ năng của nút cỡ chữ.
  3. Hỗ trợ Mục 5 được ghi nhận: bật Pinyin/Nghĩa khi câu chưa chấm (hoặc đã bật sẵn khi câu hiện ra) thì `supportUsed` của câu đó = true và đi vào bản ghi attempt; tổng kết/tiến độ báo số câu có hỗ trợ tách riêng. Lịch sử cũ không có trường này được hiểu là không ghi nhận hỗ trợ — không diễn giải lại, không reset.
  4. Nghe–viết dùng chung khóa hỗ trợ với Mục 5 nhưng bị chặn bởi quy tắc lộ đáp án: trước khi chấm không hiện gì thêm; Pinyin lời đọc chỉ hiện ở ô đã kiểm tra; xem trước vẫn qua "Xem lời đọc" và ghi `peeked` như D10.
  5. Mini player: một hàng, tên rút gọn ellipsis, có thu gọn và đóng; JS đo chiều cao thật của các lớp cố định và công bố `--mini-h`/`--mini-bottom`/`--chrome-bottom` để suy ra đệm cuối trang và vị trí thanh điều hướng bài — thay các số bottom cố định chồng nhau trước đây.
- Hệ quả: settings có thêm `showViPrep`, `showHanVietPrep`, `showPinyinExercises`, `showViExercises` (migration cộng mặc định an toàn: Nghĩa thẻ từ bật, còn lại tắt); validator bắt buộc Hán–Việt hợp lệ cho mọi mục từ và Pinyin/nghĩa cho mọi lựa chọn; kiểm thử tăng lên 37 (thêm ux3.test.mjs, gồm test hồi quy vòng QA 1: bật hỗ trợ từ thanh nghe–viết cũng phải ghi supportUsed).

## D13 — Nghiệm thu chuẩn Bài 1–2 ux3; "Tiếp tục" = làm trọn bài kế tiếp (01/11/2026)

- Quyết định: người dùng chấp nhận Bài 1–2 bản ux3 làm mẫu chuẩn và cho phép tiếp tục Bài 3 rồi các bài kế tiếp theo thứ tự khi nhận lệnh "Tiếp tục", không chờ nghiệm thu từng bài. Quyết định này thay thế quy tắc cũ phải dừng chờ duyệt sau Bài 1/Bài 2/mỗi bài (ghi ở AGENTS.md mục 6). Các yêu cầu về nguồn, chất lượng, bảo toàn dữ liệu và kiểm thử giữ nguyên.
- Trạng thái bài đã phát hành + QA live đạt: `completed_with_documented_limits`; giới hạn audio/thiết bị/quyền ghi riêng trong CHECKPOINT và QA_REPORT.
- Sửa liên kết ôn tập (cùng lượt): câu chọn hình làm quen Bài 2 (`wb2-picture-1`, đáp án "很高兴认识你") trước trỏ tới `kp-hsk1-l02-jiao` (điểm 叫 — hỏi/nói tên, là nội dung của câu chọn hình 3 "我叫白家月"). Nay trỏ tới `kp-hsk1-l02-word-order`: hội thoại làm quen là Hội thoại 3 của Bài 2, và điểm Tiểu Ngữ giảng đường đi cùng trang sách (Textbook tr. in 008) là trật tự từ cơ bản — điểm kiến thức chủ nhà của hội thoại đó. Đã rà cùng loại lỗi ở mọi câu chấm điểm Bài 1–2: các liên kết còn lại khớp nội dung đáp án (Bài 1: hình 2 → cảm ơn/tạm biệt, hình 3 → 们； Bài 2: hình 2 → tạm biệt ở Bài 1, hình 3 → 叫， hình 4 → xin lỗi).

## D14 — Thứ tự ưu tiên bằng chứng nghe–viết và công khai điểm chưa chắc (01/11/2026)

- Khi đề bản in, tài liệu lời đọc và ASR lệch nhau: đáp án lấy theo **lời đọc** (tài liệu chép lại chính track nghe) sau khi đã khớp đề bản in; ASR chỉ là bản nháp hỗ trợ thứ tự, không lật đáp án của lời đọc. Tiền lệ: ô hěn Bài 1; ô 1 bài vận mẫu Bài 3 (lời đọc zū, hai lượt ASR base/small đều nghe ra chữ thanh 3 zǔ — ū và ǔ không tương đương vì chấm vận mẫu kèm dấu thanh; đáp án giữ ū theo lời đọc và ghi công khai độ không chắc ngay trong `answerEvidence` của bài).
- Âm có hai cách đọc chuẩn （谁 shéi/shuí): đáp án chấm theo âm in trong lời đọc (shéi → vận mẫu éi); ASR không phân biệt được hai âm này nên không dùng làm bằng chứng chọn âm. Người học viết theo âm còn lại (uí) sẽ bị tính sai ô đó — giới hạn này ghi rõ trong bằng chứng của bài, không âm thầm nới đáp án.
- Không vì các điểm trên mà nâng trạng thái audio: mọi đoạn loa vẫn `asr-draft`, chưa nghe kiểm chứng bởi người.
## D15 — Bài 4: thích ứng hai dạng bài khác mẫu Bài 1–3 (01/11/2026)

- Bài 1 của phần 听读练 Bài 4 là "chọn âm tiết nghe được" (8 cặp âm tiết gần giống), không phải điền khuyết như Bài 1–3. App giữ nguyên yêu cầu nghe–phân biệt bằng một chế độ chấm mới `syllable` trong cùng khối nghe–viết: người học gõ cả âm tiết nghe được (dấu thanh hoặc số thanh), đáp án đối chiếu theo tài liệu lời đọc như chuẩn D10/D14. Đề hiển thị nguyên cặp âm tiết in trong sách.
- Câu chấm điểm của Bài 4 lấy từ chính Textbook: hai câu hỏi hiểu hội thoại in sẵn sau Hội thoại 2 và Hội thoại 3 (chọn A/B/C), đáp án suy ra trực tiếp từ lời thoại đã in trong cùng cuốn sách (`verified-from-print`). Bài 4 không có bài "nhìn hình chọn hội thoại" trong 听读练.
- Phần 模拟测练 ở cuối Workbook Bài 4 (tr. in 016–018, track 4-3) là bài kiểm tra mô phỏng tích lũy nhiều bài, không phải nội dung riêng của Bài 4 — không đưa vào bài này; ghi rõ trong CURRICULUM_MAP/SOURCE_AUDIT để xét làm tính năng riêng sau nếu cần.


## D16 — 01/11/2026: Xung đột nguồn chưa giải quyết → tạm ngừng chấm (source-conflict)

- Khi nguồn mâu thuẫn ở đúng đặc điểm đang kiểm tra, ô/mục đó chuyển sang `source-conflict`: ghi `conflictCells` + `conflictNoteVi` trong dữ liệu; không chấm đúng/sai, không tính vào mẫu số điểm, không vào hàng đợi ôn tập; vẫn hiển thị để luyện tập. Không chấp nhận cả hai đáp án để che xung đột.
- Kết quả cũ của ô bị xung đột: giữ lịch sử thô (số lần thử, nháp), loại khỏi thống kê hiện hành bằng migration theo dữ liệu chạy lúc khởi động app, có test hồi quy (tests/conflict.test.mjs).
- Trường hợp đầu tiên: ô 5 bài chọn âm tiết Bài 5 (đề in jiǎ/xiǎ; lời đọc + bản thu jiā; kiểm cao độ bằng máy cho thấy thanh phẳng cao, không phải thanh 3; tài liệu đáp án đăng lại không in đáp án bài này) — trước đây chấm theo jiā kèm ghi chú (D14), nay ngừng chấm theo D16 cho tới khi có bằng chứng giải quyết xung đột.
- Quy tắc đầy đủ ở docs/CONTENT_STANDARD.md mục "Bổ sung 01/11/2026 — Quy tắc source-conflict".

## D17 — Quy trình QA bắt buộc: báo cáo đầy đủ, kiểm ngữ nghĩa, khép trong nhánh (01/11/2026, Hoa chỉ đạo)

Từ Bài 7: (1) chỉ kết luận đạt/merge sau khi đọc toàn bộ báo cáo QA độc lập đầy đủ — không dùng bản tóm tắt; (2) QA kiểm ngữ nghĩa từng mảng (thân câu/dấu câu/hình khớp bản in; đáp án khớp yêu cầu thật của đề; pinyin/nghĩa khớp; liên kết ôn tập theo đúng kiến thức được kiểm tra, thiếu thì để trống rõ ràng, không gán gần đúng; ánh xạ loa khớp nhãn); test tự-so-dữ-liệu không tính là kiểm chứng độc lập, test ánh xạ audio không tính là kiểm nghe, đoạn chưa kiểm nghe giữ `asr-draft`; (3) vòng QA khép trong nhánh trước phát hành (báo lỗi → sửa → kiểm lại bản cuối → hồi quy → tài liệu → merge), gom vào PR bài học khi có thể; lỗi sau phát hành sửa ngay và báo đúng; (4) báo cáo kiểm thử tách năm loại bằng chứng. Chi tiết ở CONTENT_STANDARD mục D17.

## D18 — Hoàn thiện bài phân biệt và bài phụ thuộc hình Bài 6–7 (01/11/2026)
Người dùng yêu cầu hoàn thiện phần thiếu, không mở bài mới. Đối chiếu nguồn xác nhận ba bài phân biệt không có đáp án duy nhất theo thiết kế. Giữ chúng là tự luyện có nguồn, sửa hướng dẫn sai và sửa lỗi bīn/bìn. Bổ sung đủ tám hình cho tự nói, dùng mốc nghe chuẩn cho bài không chấm, giữ nguyên nháp/điểm lịch sử. Không thêm đáp án hoặc audio chưa có bằng chứng. Hạng mục QA ảnh thiếu chú thích đã là lỗi khớp dấu phẩy, không phải lỗi học liệu.

## D19 — Chuẩn minh họa vẽ mới cho bài tập có hình + kiểm mốc đoạn audio (01/11/2026, Hoa chỉ đạo và nghiệm thu)
Sau thử nghiệm hình Bài 8, Hoa nghiệm thu phong cách tranh minh họa phẳng vẽ mới và chốt làm chuẩn toàn dự án: (1) bài tập có hình dùng minh họa VẼ MỚI mô phỏng nội dung cảnh theo mô tả bằng lời, không dùng ảnh sách khi phát hành công khai; (2) hình phải thể hiện ĐỦ Ý NGHĨA của câu hỏi, không chỉ một từ khóa; (3) mỗi câu chỉ có MỘT đáp án đúng rõ ràng — hình gây nhầm thì vẽ lại; (4) mọi hình lưu nguồn gốc/quy trình tạo + trạng thái quyền (manifest + SOURCE_AUDIT); (5) vẽ lại hình KHÔNG giải quyết quyền đối với câu hỏi, nội dung sách và audio gốc — ba lớp quyền xác minh riêng, vẫn `unknown`; (6) ảnh phát hành là tài nguyên web riêng đã tối ưu (WebP), không nhúng gộp vào một file HTML lớn; (7) mốc đoạn audio phải kiểm điểm bắt đầu/kết thúc từng đoạn (ASR mức từ + khoảng lặng) và thử phát trên trình duyệt thông thường, ưu tiên Chrome Android; chưa thử trên thiết bị thật thì ghi rõ giới hạn. Kèm theo: validator từ Bài 8 chấp nhận bài tập trắc nghiệm ở trạng thái `verified-editorial` khi có `answerEvidence` đối chiếu đầy đủ (trước đây chỉ có ở bài nghe–viết), để các bài có đáp án từ tài liệu đăng lại đã đối chiếu chéo (như bài chọn từ không điệp âm Workbook 048) được chấm minh bạch thay vì phải hạ xuống tự luyện hoặc gán nhãn from-print không đúng bản chất.

## D20 — Loa đơn vị ngắn dùng giọng đọc của thiết bị; text ngoài bài học thu gọn; ảnh hai cột (01/11/2026, Hoa chỉ đạo sau khi thử trên Android thật)
Sau khi nghiệm thu Bài 8 trên điện thoại Android thật, Hoa phản hồi ba điểm và chỉ đạo hướng sửa: (1) Các text không liên quan trực tiếp tới bài học (ghi chú dài về nguồn gốc bộ câu hỏi, ghi chú học tập cuối Mục 2) phải ẨN đi — nay bọc trong `<details>` thu gọn mặc định ("Ghi chú về bộ câu hỏi", "Ghi chú về loa và Hán–Việt"); dòng nguồn từng mục vốn đã ở dạng details thu gọn, giữ nguyên. (2) Loa cho ĐƠN VỊ NGẮN (từ cần biết, ví dụ điểm kiến thức, lựa chọn trắc nghiệm) KHÔNG cắt đoạn từ track sách nữa: track từ mới đọc mỗi từ HAI lượt (nam rồi nữ), cắt đoạn nghe gượng và trên Android còn lọt đầu lượt đọc thứ hai do cơ chế dừng theo mốc thời gian. Nay các loa này dùng GIỌNG ĐỌC CÓ SẴN CỦA TRÌNH DUYỆT/THIẾT BỊ (speechSynthesis, lang zh-CN) đọc đúng chữ của đơn vị — như Hoa đề xuất "phát âm mặc định của trình duyệt hoặc bỏ qua". Lựa chọn không có chữ Hán (dạng pinyin của bài điệp âm) thì BỎ loa (nhánh "bỏ qua"). Audio sách giữ nguyên cho: câu hội thoại (mỗi câu đọc một lượt tự nhiên), toàn track, bài nghe–viết và bài tự kiểm tra có đoạn audio. Giọng thiết bị KHÔNG phải phát âm mẫu của sách và được ghi rõ trong ghi chú Mục 2; khi thiết bị không có speechSynthesis, nút loa không làm gì (không lỗi). Trường `audio` dạng đoạn trong dữ liệu được GIỮ làm hồ sơ căn đoạn/provenance nhưng giao diện không còn dùng cho từ/lựa chọn/ví dụ; số liệu "phủ loa" trong test từ nay hiểu là phủ dữ liệu đoạn, không phải hành vi loa. (3) Lựa chọn hình: lưới HAI CỘT ở mọi bề rộng (trước đây chỉ từ 560px, điện thoại xếp 1 cột ảnh rất lớn); ảnh nói theo hình cũng giữ 2 cột trên điện thoại.

## D21 — Bộ mô phỏng là bộ bài bổ trợ riêng; gradeChoice chấm mọi trạng thái validator cho phép (2026-11-01, Hoa chỉ đạo kiểm audio)

- Hoa yêu cầu kiểm tra Bài 8 đã dùng hết audio ở nguồn (Baulchino) chưa. Đối chiếu CDN: Textbook 08-1..6 (đã dùng đủ), Workbook 08-1 (đã dùng), **Workbook 08-2 (487,09s) chưa dùng** — đó là track của phần 模拟测练 (đề mô phỏng, WB in 051–056), trước đây bị loại theo D15.
- Cách bổ sung: đề mô phỏng vào app thành **bộ bài bổ trợ riêng** (`suppExerciseSet`, tách khỏi bộ chính; session/điểm lần đầu riêng theo setId; ghi chú nói rõ không tính vào điểm bộ chính và là ôn tổng hợp Bài 1–8), KHÔNG gộp vào 19 câu chính — giữ nguyên tắc D15 về phạm vi bài học, đồng thời dùng hết audio nguồn theo yêu cầu của Hoa. Renderer/binder của Mục 5 được tổng quát hóa theo (set, prefix); nút nghe theo đoạn ở cấp câu hỏi dùng lại cơ chế data-play-task.
- 20 câu mô phỏng: đáp án `verified-editorial` kèm answerEvidence từng câu — câu 1–3, 6–8, 11–13 đã xác nhận bằng tài liệu đáp án đăng lại ở thử nghiệm; câu 4, 5, 9, 10 suy từ lời đọc ASR mức từ trên chính track 8-2 (mỗi câu đọc hai lần giống hệt) + khớp duy nhất với lựa chọn in; câu 14–20 suy ra duy nhất từ văn bản in. Hình: 17 tranh vẽ của thử nghiệm Bài 8 (nay mới phát hành), mỗi câu một đáp án rõ ràng.
- **Lỗi tiềm ẩn phát hiện nhờ bộ này**: `gradeChoice` chỉ chấm verified-from-print/visual, KHÔNG chấm verified-editorial — 4 câu trùng điệp của bộ chính Bài 8 bấm Kiểm tra không có tác dụng từ ngày phát hành. Đã sửa: chấm cả verified-editorial (validator vốn bắt buộc answerEvidence cho trạng thái này), và chặn riêng vật thể dạng bài tự kiểm tra (có prompts, không có options) để không lọt vào bộ chấm trắc nghiệm. Có test hồi quy cả hai phía.

## D22 — Rà soát độ phủ Bài 8 theo từng trang PDF; bổ sung mục còn thiếu + liên kết liên bài (2026-11-01, Hoa chỉ đạo)

- Hoa yêu cầu đọc lại từng file PDF, liệt kê các mục lớn của Bài 8, chỉ ra mục nào chưa có trên dự án và vì sao, rồi bổ sung và sắp xếp có liên kết/chuyển tiếp. Đối chiếu TB in 054–060 + WB in 048–050: phần lớn đã có (mục tiêu, khởi động, 3 hội thoại + 24 từ, 3 bài giảng 小语讲堂， bài nghe của Hội thoại 2/3, bài tổng hợp, bài nói theo hình, phát âm 1+2, đề mô phỏng D21, đóng vai tr.057).
- Chưa có và đã bổ sung: (1) hai ô 小语助力 — "đại từ chỉ định + lượng từ （这只）" (tr.055) và "gọi thân mật 小+họ" (tr.059) — thành 2 điểm kiến thức dạng mẹo trong Mục 3, đặt cạnh điểm ngữ pháp chúng đi kèm; (2) hai câu hỏi mở theo Hội thoại 3 (tr.059) — thành bài tự luyện st-l08-03 (không chấm, đối chiếu đáp án ngay trong Hội thoại 3 ở Mục 4); (3) hoạt động cặp tr.055 và Hoạt động lớp tr.060 (mẫu hội thoại của 小语 + ngân hàng từ) — gộp vào khối Vận dụng cùng hoạt động tr.057 theo đúng thứ tự sách; (4) toàn bộ phần 汉字 của Workbook — 汉字书写（一） (tr.049–050) — thành điểm kiến thức nền tảng `foundation-characters` trong khối Nền tảng của Mục 3. Lý do trước đây thiếu: các bài trước chỉ lấy phần nhận biết từ của mục Hán tự; mạch lý thuyết viết chữ chưa từng vào app và app không có ô viết tay — nay đưa phần nhận biết/quy tắc vào, phần chép tay giữ thành hướng dẫn tự chép vào vở.
- Liên kết: câu mô phỏng được gắn liên kết ôn tập HAI CHIỀU tới đúng điểm kiến thức chúng kiểm tra thật （在/方位词/能 — 11 câu; các câu còn lại để trống theo quy tắc D17 không gán gần đúng); mẹo 这只 nối về lượng từ 个 các bài trước, 小胡 nối tới từ chuyên danh 胡医生 của bài; KP chữ Hán nối 二十 về Bài 2 và 工作 về từ trọng tâm của bài, đồng thời ghi rõ mạch 汉字书写 sẽ tiếp tục ở các bài sau.
- Thay đổi code duy nhất: tổng quát điều kiện "foundation" trong app.js (mọi kind bắt đầu bằng `foundation` đều vào khối Nền tảng), để thêm kind `foundation-characters` mà không đổi hành vi cũ.

## D23 — Nâng cấp trải nghiệm Bài 8 làm bài thí điểm + quy tắc Pinyin trong bài tập thay thế ux3 (02/11/2026, Hoa chỉ đạo)

- Phạm vi: Bài 8 là bài THÍ ĐIỂM đã triển khai; các bài khác chỉ coi là đã nâng cấp khi đã thực sự làm và kiểm thử. Giữ nguyên 7 route/mục và mọi ID, đáp án đã kiểm chứng, session và tiến độ cũ — không đổi schema progress (chỉ cộng thêm khóa tùy chọn `speakingDone` cho nút tự đánh dấu đã luyện ở Tự nói; migration giữ nguyên các khóa lạ như trước).
- Lộ trình: thêm `learningPath` theo tình huống ở mục Bắt đầu (Bắt đầu → Con mèo ở đâu? → Hẹn gặp ở đâu? → Làm việc ở bệnh viện → Luyện tổng hợp → Tổng kết), hiện mục đang học dở (`lastSectionId`); liên kết sâu cũ (?passage=/?sentence=/?item=/?task=) giữ nguyên.
- Từ mới: chia 3 nhóm theo hội thoại theo đúng phân trang/track của sách (Hội thoại 1: 10 từ, tr.055, track 8-2; Hội thoại 2: 7 từ, tr.057, track 8-4; Hội thoại 3: 6 từ + 1 tên riêng 胡医生, tr.059, track 8-6; tổng 23 + 1). Mỗi nhóm có nút nghe CẢ NHÓM bằng audio gốc (phát trực tuyến track của sách). Loa từng từ vẫn là giọng máy của thiết bị và ghi rõ là giọng máy (D20 giữ nguyên); không cắt track gốc thành từng từ.
- Ngữ pháp: hiển thị 3 điểm chính bằng lời đơn giản (nói vị trí; 在 + nơi + việc; 能/不能) với cấu trúc Khi nào dùng → Mẫu → 1–2 ví dụ → Thử ngay (quickCheck tự kiểm tra tại chỗ, không ghi điểm/attempt) → Xem thêm. Hai mẹo （这只/那只, 小+họ) rời khỏi nhóm điểm chính sang khối "Mẹo nhỏ" riêng — vì vậy thứ tự trang sách của D22 (mẹo tr.055 trước bài giảng tr.056) không còn áp dụng cho cách trình bày nhóm này. Phần điệp âm + viết chữ Hán ở khối nền/luyện thêm.
- **Quy tắc Pinyin trong bài tập (thay điểm tương ứng của ux3/D12):** ở bài tập thường, Pinyin và nghĩa của đề + lựa chọn KHÔNG được render vào DOM trước khi chấm (không chỉ ẩn bằng CSS) — sau khi chấm mới hiện theo công tắc hỗ trợ. Ngoại lệ duy nhất: bài luyện âm (phân biệt/chọn âm tiết), Pinyin là nội dung bài nên hiện sẵn và phải ghi nhãn "Bài luyện âm"; nghĩa/ví dụ phân loại đáp án của bài luyện âm vẫn ẩn trước khi chấm. Việc bật hỗ trợ khi câu chưa chấm vẫn ghi `supportUsed` như ux3; điểm lần đầu không đổi.
- Bài tập chia 3 khu rõ ràng trong Mục 5: A Luyện sau bài (bộ chính), B Luyện thêm (khối tự luyện theo sách), C Đề mô phỏng (bộ bổ trợ, điểm/session riêng, không tự bắt đầu, không bắt buộc).
- Nghe & đọc: mỗi hội thoại thêm liên kết tới từ của bài, điểm chính liên quan và một câu hỏi ngắn sau khi nghe (deep link ?item= tới câu đã kiểm chứng của chính hội thoại đó); lời thoại vẫn ẩn mặc định.
- Tự nói: khối Vận dụng của Bài 8 tách thành 3 nhiệm vụ riêng (hỏi đồ vật ở đâu / hẹn gặp / nói về bản thân) với tình huống, câu mẫu + loa giọng máy, từ để tự thay và nút tự đánh dấu "Đã luyện" (chỉ ghi đã luyện, không gọi là nắm vững, không chấm nói/phát âm); hướng dẫn đầy đủ của sách giữ trong phần thu gọn.
- Tổng kết: khi chưa làm câu nào hiện "Bạn chưa làm bài tập" (không hiện "Chưa có câu nào làm sai"); có khối 3 điều chính kèm ví dụ, nút tiếp tục mục chưa xong, và số lần làm lại/gợi ý/hỗ trợ chuyển vào "Xem chi tiết". Phân biệt rõ Đã xem / Đã luyện / Cần ôn trong tài liệu chuẩn; không gọi "đã nắm vững" khi chỉ bấm nút/mở trang.
- Thời gian bài: giữ số ước lượng hiện có và ghi rõ trong giao diện là ước lượng của dự án, chưa đo trên người học thật.

## D24 — Ẩn chữ giải thích dài + tra từ trực tiếp trong bài (thí điểm Bài 8; Hoa chỉ đạo 02/11/2026)

**Phần A — chữ giải thích dài.** Chuẩn trình bày: đoạn chữ nói về Cách hệ thống chấm điểm/ghi nhận, cách biên soạn/đối chiếu dữ liệu, ghi chú kỹ thuật lặp lại KHÔNG hiện mặc định trong luồng học; chuyển vào `<details class="info-fold">` với nhãn người học (Cách làm bài / Cách tính lịch ôn / Thông tin thêm / Nguồn). Thông tin ảnh hưởng cách làm bài hoặc điểm số phải vẫn tới được: hoặc ở đúng điểm dùng bằng MỘT câu ngắn (cạnh nút Xem lời đọc: "Xem trước sẽ được ghi nhận."), hoặc trong mục thu gọn ngay tại khu vực đó. Không xóa chức năng/dữ liệu; không đổi ý nghĩa cảnh báo và ghi chú quyền nguồn. Áp dụng ở thành phần dùng chung (khối Luyện thêm của mọi bài, dòng ghi nguồn chấm của từng bài nghe–viết rút còn một dòng giữ nguyên ý "chưa phải đáp án chính thức của NXB", lịch ôn ở trang Ôn tập). Ô vàng đầu khối Luyện thêm là trường hợp điển hình đã xử lý.

**Phần B — tra từ bằng chạm (tap-to-lookup).** Thí điểm ở Bài 8, chỉ trên bề mặt đọc: lời thoại (Mục 4), ví dụ điểm kiến thức (Mục 3 + trang ngữ pháp), câu mẫu Tự nói (Mục 6) và ví dụ ở Tổng kết. TUYỆT ĐỐI không gắn vào đề/lựa chọn bài tập, ô nghe–viết, "Thử ngay" — giữ quy tắc D23 (không lộ Pinyin/nghĩa/đáp án trước khi chấm). Thành phần viết dùng chung, bật theo dữ liệu: bài nào có khối `lookup` mới bật; chưa bài nào khác được tuyên bố hỗ trợ.

*Khảo sát công cụ/nguồn (02/11/2026):*
| Đối tượng | Phiên bản/nguồn | Giấy phép | Dung lượng/đánh giá | Quyết định |
|---|---|---|---|---|
| Bộ tách từ theo từ điển dự án (`segmentZh`, lib.js) | tự viết, khớp dài nhất | mã của dự án | ~0 KB dữ liệu thêm (dùng lại từ vựng đã có); tất định, kiểm thử được trong Node; ranh giới luôn trùng mục đã kiểm duyệt; sửa ranh giới = thêm/sửa mục từ điển | **CHỌN** |
| Intl.Segmenter | API trình duyệt, Baseline 2024; Chrome/Android 87+, Firefox 125+ | chuẩn web | 0 KB nhưng ranh giới tổng quát, không ghi đè theo dự án được, kết quả khác nhau giữa engine → khó kiểm thử tất định | Không chọn làm chính; không cần dự phòng vì bộ tách riêng suy giảm nhẹ nhàng (chữ lạ thành ô đơn, báo chưa có dữ liệu) |
| jieba-wasm (fengkx) | 2.4.0, npm/GitHub | MIT | WASM + từ điển jieba đầy đủ cỡ vài MB; tách từ cho văn bản phổ thông, không theo từ vựng dự án; nặng cho Pages/điện thoại | Không chọn cho thí điểm |
| CVDICT (dữ liệu Trung–Việt lưu hành trong cộng đồng VietPhrase) | không rõ phiên bản chính thức | **không xác định được giấy phép** | không có kênh phân phối chính thức kèm điều khoản | **Không dùng** (đúng quy tắc: giấy phép chưa rõ thì không đưa vào bản phát hành) |
| hanviet-pinyin-words | gói npm chuyển Hán–Việt theo pinyin, 2.1.7 | MIT (gói) | chuyển đổi theo quy tắc từ pinyin — không quyết định được chữ đa âm theo ngữ cảnh, đúng rủi ro dự án đã tránh bằng dữ liệu Thi Viện kiểm chứng từng chữ (D12) | Không dùng cho dữ liệu |
| CC-CEDICT | MDBG, cập nhật liên tục | CC BY-SA 4.0 | ~120k mục, nghĩa tiếng Anh; nghĩa Anh không trình bày thành nghĩa Việt; BY-SA kéo theo nghĩa vụ share-alike cho dữ liệu phái sinh | Không nhập ở vòng thí điểm; chỉ là nguồn đối chiếu ngoài nếu cần |
| xue-hanzi | dự án tham khảo kiến trúc đa nguồn | từng phần khác nhau | — | Chỉ tham khảo ý tưởng tổ chức dữ liệu; không sao chép mã/dữ liệu |
| Web Speech API (speechSynthesis) | API trình duyệt | — | giọng máy của thiết bị; đã là cơ chế loa đơn vị của dự án (D20) | **CHỌN** cho nút nghe trong bảng tra, ghi rõ "giọng máy"; không có giọng zh thì báo ngắn, không thay giọng ngôn ngữ khác |

*Dữ liệu tra cứu:* thứ tự ưu tiên đúng chỉ đạo: (1) từ vựng dự án đã đối chiếu (toàn bộ từ chuẩn bị Bài 1–8, gồm Hán–Việt verified-editorial theo D12); (2) mục bổ sung kiểm duyệt riêng cho Bài 8 trong `lookup.extras` (11 mục: 小猫、这只、一、好、两、胡、小雪、上、听力、十、二十 — chữ nào chưa có căn cứ Hán–Việt đã kiểm chứng thì để `hanViet: null` và giao diện nói rõ, không đoán); (3) cụm kiểm duyệt trong `lookup.phrases` （在医院工作、在学校吃午饭）. Không dùng từ điển ngoài ở vòng này. Độ phủ đo thật: 39/39 văn bản đích của Bài 8 (14 câu thoại + ví dụ các điểm kiến thức + câu mẫu nói + ví dụ tổng kết) tách được 100% thành mục có dữ liệu.

*Tra cụm:* chọn văn bản gốc của trình duyệt không ổn định trên Android nên dùng chế độ chọn theo ô từ: nút "Tra cụm" dưới câu → chạm từ đầu → chạm từ cuối → "Tra cụm đã chọn". Có mục cụm đã kiểm duyệt thì hiện cả cụm; không có thì hiện các từ thành phần + "Chưa có giải thích cho cả cụm", không tự ghép dịch.

*Phát âm trong bảng tra:* audio gốc theo từ không tồn tại ở mức đã kiểm chứng (track từ mới đọc mỗi từ 2 lượt — D20) nên dùng giọng máy của thiết bị qua cơ chế sẵn có (tự dừng audio sách như mọi nút loa máy khác); nhãn "Nghe phát âm (giọng máy)" + dòng trạng thái nói rõ không phải audio gốc.

## D25 — Rà soát đầy đủ ví dụ Bài 8 + giao diện kiến thức gọn hơn (Hoa yêu cầu 02/11/2026)

**Rà soát ví dụ (đọc trực quan đủ 10 trang: Textbook in 054–060, Workbook in 048–050).** Bảng kiểm kê nội bộ: toàn bộ ví dụ giảng dạy của sách đã có trong dữ liệu từ các vòng trước — 9 câu Đại thanh lang đọc của 3 mục Tiểu Ngữ giảng đường chính là 9 ví dụ của 3 điểm kiến thức (mỗi điểm hiện 2, câu thứ ba trong "Xem thêm ví dụ của sách"), 2 ô trợ giúp có đủ ví dụ, 14 lượt thoại đủ. Thiếu thật chỉ có 2 chỗ: (1) danh sách từ chỉ phía thiếu **外边** (sách liệt kê 上、下、里、外、前、后、外边） — đã bổ sung vào pattern + giải thích; (2) mẫu hội thoại của Hoạt động lớp (TB tr.060) mới trích 2 lượt trong câu mẫu nhiệm vụ nói 1 và bản đầy đủ chôn trong đoạn hướng dẫn dài — đã đưa mẫu đầy đủ 4 lượt thành câu mẫu của nhiệm vụ 1. Ngoài ra bỏ hậu tố nguồn lặp ("— câu luyện đọc của sách", "— ví dụ của sách"...) khỏi noteVi của 11 ví dụ: bản dịch đứng một mình, nguồn trang ở sourceRefs như chuẩn. Bài tập/câu hỏi (khởi động 6, nghe hiểu 4, tổng hợp 5, mô phỏng 20, phát âm, chữ Hán) kiểm kê riêng, đều đã có và khớp bản in — không đụng đáp án/thứ tự.

**Giao diện gọn (CSS + bố cục ví dụ, ở thành phần dùng chung).** Khối ví dụ chuyển thành 2 dòng: dòng chữ Hán (token tra từ + loa) và dòng meta (Pinyin · nghĩa · nút Tra cụm nhỏ) — nghĩa của ví dụ nay theo công tắc Nghĩa (thêm tog-vi-sent). Giảm: chữ Hán câu chung 1.5→1.32rem (ví dụ 1.18rem), tiêu đề thẻ ngữ pháp 1.2→1.12rem, lead line-height 1.9→1.55, padding thẻ ví dụ 16/18→9/11px, study-tip 15/18→10/12px, thẻ 20→14px ở ≤768px, thanh hỗ trợ padding 6→4px và nút 44→40px, nút Tra cụm 40→38px. Thang cỡ chữ của người dùng (--font-scale, 3 mức) KHÔNG đổi; không reset cài đặt nào. Bài khác dùng chung thành phần phải hồi quy (Bài 1/7 + một bài giữa).

## D26 — Nút Tiếp tục trong chính trang mục đang mở không được tự liên kết (sửa lỗi thiết bị thật, 02/11/2026)

- Báo cáo thiết bị thật: ở mục Bắt đầu của Bài 8, nút "Tiếp tục học" trong khối Lộ trình không phản ứng khi chạm. Nguyên nhân đã tái hiện: khối lộ trình được render ngay trong trang mục `intro`, mà đích của nút được tính là chính mục đang mở (`lastSectionId = intro` do lần mở trang ghi lại) → liên kết trỏ về đúng route hiện tại, chạm vào không đổi hash nên không có phản ứng nào.
- Quy tắc: nút Tiếp tục/Bắt đầu nằm **bên trong** một trang mục thì đích phải là mục chưa hoàn thành tiếp theo (hoặc mục cuối nếu đã xong hết), không bao giờ là chính route đang hiển thị. Ở trang tổng quan bài (không mở mục nào), giữ nguyên nghĩa "học tiếp ở mục dở dang gần nhất".
- Sửa ở `learningPathHtml` (nhận thêm mục đang chứa nó; kiểm tra `lastSectionId` hợp lệ thuộc danh sách mục). Test hồi quy riêng chạy qua thao tác thật trên giao diện (bấm nút, đánh dấu đã học) thay vì ghi thẳng localStorage — vì kho tiến độ có bộ nhớ đệm, ghi ngoài không có tác dụng.

## D27 — Bài 8 là chuẩn toàn dự án; thứ tự: chuẩn hoá Bài 1→8, rồi mới làm bài mới (Hoa chỉ đạo 02/11/2026)

- Người dùng xác nhận nội dung và giao diện Bài 8 hiện tại (contentVersion 20261102-lesson8-continue1) là CHUẨN cho toàn bộ dự án; áp dụng đúng chuẩn không cần duyệt lại mẫu.
- Chuẩn được lưu tại `docs/LESSON_STANDARD.md` (liên kết từ AGENTS.md và CONTENT_STANDARD.md); kiểm tra cơ giới bằng `scripts/audit-standard.mjs` (báo cáo độ phù hợp từng bài, không thay QA nội dung).
- Thứ tự công việc từ nay: (GĐ1) lưu chuẩn + công cụ; (GĐ2) rà soát/nâng cấp từng bài đã làm theo thứ tự Bài 1 → Bài 8 (Bài 8 chỉ kiểm hồi quy); (GĐ3) sau khi bài cũ đạt chuẩn mới biên soạn bài mới theo thứ tự giáo trình (Bài 9 → …). "Tiếp tục" đi theo nextTask trong checkpoint, không quay lại thứ tự cũ (Bài 9 ngay) nữa.
- Chuẩn là chất lượng/cách tổ chức, không phải khuôn số lượng: mỗi bài giữ nội dung và mục tiêu riêng của giáo trình; không ép số từ/ví dụ/câu hỏi bằng Bài 8, không bỏ nội dung sách chỉ vì Bài 8 không có dạng đó, không xóa nội dung/kết quả/chức năng đang có khi chưa có lý do rõ ràng.

## D28 — Câu hỏi của hội thoại nằm tại hội thoại, không nằm trong bộ Luyện tập (Hoa chỉ đạo 03/11/2026)

- Bối cảnh: Hoa làm Bài 10 trên điện thoại, gặp câu hỏi nghe hiểu của Hội thoại 2 ở mục Luyện tập và hỏi vì sao bài tập của đoạn hội thoại không để ở hội thoại. Trong sách, các câu hỏi này in ngay tại hội thoại (nghe hai lần rồi chọn đáp án); việc gom hết về Luyện tập là lựa chọn cấu trúc cũ của app.
- Quyết định: câu hỏi mà sách in tại một hội thoại thì nằm ngay dưới hội thoại đó trong mục Nghe & đọc (`reader.passages[].checkItems`), trả lời và chấm tại chỗ; XOÁ khỏi bộ bài chính ở mục Luyện tập. Phạm vi áp dụng ngay: Bài 4–10, 36 câu (Bài 4–7 mỗi bài 6 câu: 4 câu của Hội thoại 2/3 + 2 câu in dưới Hội thoại 3; Bài 8–10 mỗi bài 4 câu nghe hiểu). Bài 1–3 không có dạng câu hỏi này. Áp dụng cho mọi bài biên soạn từ nay (từ Bài 11).
- Điểm số KHÔNG đổi bản chất: attempts và session ghi theo mã câu hỏi (dùng chung session của bộ chính) nên kết quả đã làm trước D28 mang sang nguyên vẹn; điểm bài tập của bài ở Tổng kết và Tiến độ tính gồm cả câu tại hội thoại; Ôn tập trỏ về `reader?passage=...` cho các câu này; deep link `exercises?item=<câu đã chuyển>` tự chuyển hướng sang hội thoại chứa câu. Câu nghe hiểu giữ nút nghe đoạn (audioSegment) tại chỗ.
- Hệ quả số lượng bộ chính: Bài 4–7: 17 → 11 câu; Bài 8–9: 19 → 15; Bài 10: 20 → 16. Tổng câu chấm tự động mỗi bài không đổi (validator và audit tính cả hai nơi chứa).

## D29 — Công nghệ luyện viết: Hanzi Writer 3.7.3 vendor + dữ liệu nét Make Me a Hanzi self-host theo chữ (03/11/2026, Hoa yêu cầu triển khai HSK 2 + luyện viết)

- Thư viện: Hanzi Writer **3.7.3**, giấy phép **MIT**; vendor nguyên file min (36.968 byte) tại `assets/vendor/hanzi-writer-3.7.3.min.js` kèm `HANZI-WRITER-LICENSE.txt`. Không dùng CDN lúc chạy để bản live ổn định và kiểm soát phiên bản.
- API v3: factory là `HanziWriter.create(...)` — tên cũ `createWriter` ĐÃ BỊ BỎ ở v3 (đây là nguyên nhân lỗi live sau PR #105, đã sửa ở PR #106 kèm test hồi quy chạy thư viện thật). Mọi nâng cấp phiên bản thư viện về sau phải kiểm tra lại tên factory và chạy test `tests/writing.test.mjs`.
- Dữ liệu nét: gói hanzi-writer-data 2.0.1 (từ Make Me a Hanzi), giấy phép **Arphic Public License** — chỉ self-host JSON của các chữ đã triển khai tại `data/hanzi/<chữ>.json`, luôn kèm `data/hanzi/ARPHICPL.TXT`; ghi công ở trang Nguồn (`src-hanzi-stroke-data`) và trang chủ khu viết.
- Số nét/thứ tự của mỗi chữ phải đối chiếu với dãy ô tô nét trong sách viết (và phần 汉字 của Workbook) trước khi phát hành; không khớp thì ghi nhận chênh lệch, không tự kết luận nguồn nào sai.
- Khi thư viện/dữ liệu không tải được: hiển thị chữ tĩnh trong ô kẻ + thông báo dễ hiểu + lựa chọn luyện trên giấy; tuyệt đối không trang trắng (đã kiểm chứng hành vi fallback trên live).

## D30 — Khu Luyện viết chữ Hán: cấu trúc, dữ liệu và tiến độ (03/11/2026)

- Vị trí: khu riêng `#/writing` (danh sách bài) → `#/writing/<lessonId>` (bộ chữ của bài) → `#/writing/<lessonId>/<charId>` (trang chữ 6 bước). Bài học giữ nguyên cấu trúc 7 mục; lối vào đặt ở thẻ tại trang Bắt đầu của bài + liên kết từ trang chữ về bài/Tổng kết. Không bắt buộc hoàn thành phần viết mới học tiếp.
- Dữ liệu: `content.writingSets[]` keyed theo lessonId; mỗi chữ gồm chữ, Pinyin, Hán–Việt đã kiểm chứng, nghĩa, bộ thủ, số nét, từ chứa chữ và câu mẫu **theo sách viết** (kèm sourceRefs), tipVi chỉ phân tích cấu tạo có căn cứ (không bịa từ nguyên).
- Mạch 6 bước mỗi chữ: (1) Nhìn và hiểu → (2) Xem cách viết (hoạt ảnh nét) → (3) Tập viết theo mẫu (quiz có nét mờ, gợi ý, viết lại, bỏ qua) → (4) Tự viết (ẩn mẫu, có hiện mẫu, có "Tôi luyện trên giấy") → (5) Nhớ từ và câu (câu hỏi nhận diện ngắn, thứ tự lựa chọn xoay theo chỉ số chữ) → (6) Trạng thái và ôn lại.
- Tiến độ: `progress.writing[charId]` = {seen, practiced, self, paper, needsReview, updatedAt, dueAt}; hạn ôn theo nhịp 1/3/7 ngày theo số giai đoạn đã xong, chữ đánh dấu cần ôn thì hạn 1 ngày và luôn tính là đến hạn. **Không dùng nhãn "đã thành thạo"** — hoàn thành một lần, kể cả có gợi ý, chỉ ghi là đã luyện. Nâng cấp kho tiến độ tương thích ngược (migrate thêm trường writing, không mất tiến độ HSK 1 — có test).
- Quy ước HSK 2: mỗi bài có 4 课文 (không phải 3 hội thoại như HSK 1); track Textbook chẵn là audio từ mới của đoạn tương ứng; Workbook HSK 2 mỗi bài có track phần 模拟测练 bị loại theo D15 như HSK 1; sách viết mỗi bài 4 chữ (Bài 13/14 chỉ 3 chữ), tổng 58 chữ/15 bài.

## D31 — Nghe ôn bài ở mục Tổng kết: mẫu đã duyệt, mở rộng từng bài đã QA (08/11/2026, Hoa chỉ đạo)

- Mẫu "Nghe ôn bài" tại HSK 2 Bài 1 (PR #112–#115, merge cuối 05a09877) đã được người dùng duyệt trên điện thoại ngày 08/11/2026: hai chế độ Ôn nhanh / Ôn chi tiết, transcript song ngữ giữ dấu câu, ngắt nghỉ theo dấu câu (phẩy ~300 ms, hai chấm/chấm phẩy ~450 ms, kết câu ~750 ms, chuyển ý ≥900 ms, chuyển cặp Trung–Việt ~550 ms, tốc độ mặc định 0,92×), phát ổn định trên Android (danh sách giọng rỗng không chặn phát; chỉ báo "Đang nghe" sau sự kiện bắt đầu).
- Mở rộng theo từng bài đã phát hành và đã qua QA, mỗi lượt "Tiếp tục" hoàn thành trọn một bài (triển khai → QA độc lập → phát hành → nghiệm thu live). Bài đầu tiên áp dụng: HSK 2 Bài 2. Không bật hàng loạt; danh sách bài bật nằm ở `REVIEW_LESSONS` trong `src/audio-review.js`, chỉ thêm bài sau khi QA của chính bài đó đạt.
- Module dùng chung, không sao chép player theo bài. Số từ (tách từ mới/tên riêng theo `isProperName`), số điểm ngữ pháp và số đoạn luôn tính từ dữ liệu thật của bài; không giữ cứng số của Bài 1. Tính năng nằm trong mục 7 Tổng kết, không thêm mục mới; nghe ôn không đánh dấu đã học và không thay audio Baulchino; nhãn giọng máy của thiết bị giữ nguyên.
- Tách lời hiển thị và lời đọc: transcript giữ nguyên dấu câu, ngoặc, dấu "+" và ký hiệu học tập; lời gửi vào TTS được chia cụm theo dấu câu trước khi loại ký hiệu. Chỉ lọc chú thích nguồn/trang theo quy tắc đã có; không xóa từ có nghĩa, từ phủ định hay nội dung ngữ pháp trong ngoặc.
- Mẫu ngữ pháp (công thức có "+", ngoặc, dấu gạch chéo) chỉ được đọc bằng lời giải thích tiếng Việt biên tập (`REVIEW_PATTERN_SPEECH`, theo mã điểm kiến thức, suy từ chính pattern/vị trí/giải thích đã kiểm chứng của bài); không nối các thành phần sau khi xóa ký hiệu. Điểm chưa có lời giải thích thì không đọc công thức thô — ý nghĩa, cách dùng, vị trí và ví dụ vẫn được đọc từ dữ liệu bài. Phần chữ Hán/phát âm nền không đọc theo khuôn ngữ pháp; luyện nét chữ ở khu Luyện viết.
- Hội thoại trong Ôn chi tiết giữ đúng thứ tự sách và nhãn người nói (hiển thị ở dòng nhãn lượt đọc). Không đọc đáp án bài tập, không đọc Pinyin hay Hán–Việt.

## D32 — Ôn nhanh chỉ gồm ý chính các điểm ngữ pháp (2026-11-08, Hoa chỉ đạo)

- Ôn nhanh đổi cấu trúc: bỏ phần điểm tổng kết (`summaryPoints`) khỏi bản ôn; mỗi điểm ngữ pháp (kind `grammar`) chỉ đọc: tên điểm, ý chính ở trường "dùng khi nào" (`useWhenVi`), mẫu câu qua lời giải thích tiếng Việt (`REVIEW_PATTERN_SPEECH`, công thức vẫn hiện trên transcript) và MỘT câu mẫu (ví dụ đầu tiên của điểm, cặp Trung–Việt).
- Ôn chi tiết giữ nguyên ba mục: từ mới, điểm ngữ pháp đầy đủ (cách dùng/giải thích/vị trí/mọi ví dụ), hội thoại/đoạn văn đúng thứ tự kèm người nói. Không cắt nội dung nào khỏi Ôn chi tiết; điểm tổng kết vẫn hiển thị ở mục Tổng kết như cũ, chỉ không còn nằm trong bản nghe ôn.
- Áp dụng đồng thời cho cả 3 bài HSK 2 đã bật (Bài 1, 2, 3) vì đây là thay đổi cấu trúc của module dùng chung theo chỉ đạo trực tiếp của Hoa; mỗi bài vẫn phải QA ngữ nghĩa riêng trong cùng vòng. Các bài bật sau này dùng ngay cấu trúc này.
- Mọi cơ chế khác của D31 giữ nguyên: module dùng chung, nhịp nghỉ theo dấu câu, tốc độ 0,92×, nhãn giọng máy, không ghi tiến độ, không đọc đáp án/Pinyin/Hán–Việt.

## D33 — Nghe ôn dùng audio sách cho từ và hội thoại, TTS cho phần còn lại (2026-11-08, Hoa chỉ đạo)

- Chỉ đạo của Hoa: các đoạn audio hội thoại có sẵn trong bài phải được dùng trong phần nghe ôn; từ đơn hoặc câu không có audio thì dùng phát âm của trình duyệt (giọng máy của thiết bị).
- Cách áp dụng trong module dùng chung (`src/audio-review.js`): hàng tiếng Trung của từ mới và của từng câu hội thoại/đoạn văn trong Ôn chi tiết mang theo đoạn audio sách đã có trong dữ liệu (`audio: {trackId, start, end}` → URL trong `reader.audioTracks`, phát trực tuyến từ Baulchino như mọi audio sách khác trong app, không sao chép file). Player phát đúng đoạn [start, end] rồi chuyển lượt với cùng quy tắc nghỉ theo dấu câu/chuyển ý như nhánh TTS. Mọi hàng còn lại (nghĩa tiếng Việt, giải thích ngữ pháp, câu mẫu ngữ pháp — vốn không có audio riêng, tiêu đề, mở đầu/kết thúc) đọc bằng giọng máy như trước.
- Đoạn audio hỏng/không tải được/không khởi động được thì tự động chuyển sang giọng máy cho chính hàng đó và đi tiếp; không kẹt cả bài ôn. Tạm dừng rồi Tiếp tục phát lại lượt đang dở (cùng quy tắc cũ). Audio sách của bài (mục Nghe & đọc) bắt đầu thì nghe ôn dừng, và ngược lại, như trước.
- Ranh giới với D20: D20 quy định nút loa từng từ/câu TRONG BÀI dùng giọng máy (vì track từ vựng đọc mỗi từ hai lần, cắt giữa track dễ lọt lần đọc thứ hai). D33 là chỉ đạo mới của Hoa riêng cho NGHE ÔN: đoạn từ lấy lần đọc đầu theo mốc đã căn khi biên soạn bài. Hai quy định cùng tồn tại: trong bài giữ nguyên D20; nghe ôn theo D33. Mọi mốc đoạn vẫn là `asr-draft` (căn máy, chưa nghe kiểm chứng bởi người) — giới hạn này ghi rõ khi báo cáo.
- Ôn nhanh không đổi (câu mẫu ngữ pháp không có audio riêng → giọng máy). Số lượt, transcript và nội dung hai chế độ không đổi; thay đổi duy nhất là nguồn phát của các hàng đã có audio.

## D34 — Đoạn từ trong nghe ôn phải đủ hai lượt đọc nam–nữ (2026-11-08, Hoa phản hồi từ thiết bị thật)

- Hoa nghe thử trên điện thoại và báo: phần ôn từ mới bị cắt âm sớm — track từ vựng đọc mỗi từ HAI lượt (nam rồi nữ) nhưng mốc đoạn trong dữ liệu bài chỉ theo lượt đầu (di sản của căn ASR khi biên soạn bài; ASR bỏ qua lượt lặp nên mốc còn có chỗ cắt vào giữa lượt đầu hoặc lấn từ bên cạnh). Chỉ đạo: đợi hết cả hai lượt đọc rồi mới chuyển.
- Cách sửa (chỉ trong nghe ôn, dữ liệu bài không đổi): `REVIEW_WORD_SEGMENTS` trong `src/audio-review.js` — mốc riêng cho 47 từ của 3 bài HSK 2, suy từ phân tích vùng tiếng nói (RMS) trên chính các track: mỗi từ gồm hai vùng đọc liên tiếp theo thứ tự sách; mốc chạy từ ngay trước lượt đọc đầu tới ngay trước lượt đọc đầu của từ kế tiếp (từ cuối: hết vùng đọc cuối + đệm nhỏ). Đối chiếu chéo bằng cách chép lời TỪNG vùng riêng lẻ (ASR theo đoạn cắt) để xác nhận vùng thuộc từ nào; trường hợp còn mơ hồ về ranh giới hai từ kề nhau (vd 洗/自己 ở Bài 3) thì cách lấy mốc theo từ kế tiếp vẫn bảo đảm không cắt lượt đọc, tối đa nghe thêm một lượt của từ sau trong đoạn của từ trước. Đoạn hội thoại (đọc một lượt) giữ nguyên mốc dữ liệu như D33.
- Giới hạn trung thực: mốc mới là căn bằng phân tích tín hiệu + ASR đoạn cắt, vẫn chưa nghe kiểm chứng bởi người; lần nghe thử tiếp theo của Hoa trên điện thoại là bước xác nhận cuối. Nếu còn từ nào lệch, sửa đúng từ đó trong bảng mốc.
- D20 (loa trong bài dùng giọng máy) và D33 giữ nguyên; D34 chỉ thay mốc đoạn từ mới trong nghe ôn.

## D35 — Nghe ôn hoàn thành cho HSK 1: cả 15 bài (2026-11-08, Hoa chỉ đạo "Hoàn thành HSK 1")

- Phạm vi: bật nghe ôn cho đủ 15 bài HSK 1 qua cùng module dùng chung (D31–D34 giữ nguyên: Ôn nhanh = ý chính ngữ pháp + 1 câu mẫu; Ôn chi tiết = từ mới + ngữ pháp + hội thoại; đoạn sách phát trực tuyến, còn lại giọng máy; mẫu ngữ pháp chỉ đọc qua lời diễn giải tiếng Việt).
- Ba việc kèm theo để HSK 1 đạt cùng chuẩn như HSK 2:
  1. **Mốc từ đủ hai lượt đọc (như D34)** cho cả 330 từ của 15 bài: phân tích vùng tiếng nói (RMS) trên 45 track từ vựng + chép lời từng vùng để gán vùng→từ, đối chiếu thêm ASR toàn track và mốc dữ liệu khi ranh giới mơ hồ (trường hợp khó nhất: track 7-6 — từ 里 đọc 4 vùng, ranh giới 晚上/医院/上班 chốt bằng ASR mô hình small trên đoạn cắt gộp). 13 từ dữ liệu chưa có mốc (tên riêng và vài từ danh sách) được kiểm chứng là CÓ đọc trên track và cũng nhận mốc riêng trong bảng `REVIEW_WORD_SEGMENTS` (mục nào mang theo trackId của nó). Dữ liệu bài không đổi.
  2. **Đoạn hội thoại cho Bài 1–3**: ba bài này dữ liệu chưa có mốc câu (0/35 câu). Đã căn từ ASR mức từ của chính các track hội thoại (cùng quy ước asr-draft như Bài 4–15: bắt đầu = từ đầu, kết thúc = từ cuối + 0,05), gán vào `reader.sentences[].audio` — loa câu trong bài cũng dùng được các đoạn này. Các câu chép lời lệch thấp được soát tay theo ranh giới đoạn ASR (Bài 3 track 5 gộp 4 câu/đoạn).
  3. **Lời diễn giải mẫu** cho 45 điểm ngữ pháp HSK 1 trong `REVIEW_PATTERN_SPEECH`, viết từ pattern/positionVi/explanationVi đã kiểm chứng của từng điểm.
- Đếm lượt luôn từ dữ liệu thật: Ôn chi tiết dao động 76–343 lượt (Bài 4 cao nhất vì điểm số từ có 52 câu mẫu luyện đọc số — giữ nguyên theo dữ liệu, không cắt bớt); Ôn nhanh 10–46 lượt.
- Giới hạn trung thực như cũ: mọi mốc là căn máy (tín hiệu + ASR), trạng thái asr-draft, chưa nghe kiểm chứng bởi người; chờ Hoa nghe thử trên điện thoại.

## D36 — Dòng "Chép lại lời thoại" trong mục Nghe & đọc (2026-11-09, Hoa chỉ đạo)

- Chỉ đạo của Hoa: mỗi câu trong phần "Mở lời thoại để đọc theo" hiện có 3 dòng (chữ Hán, pinyin, nghĩa) — thêm dòng thứ 4 để chép lại câu, bằng chữ Hán (luyện viết) hoặc bằng pinyin (nhớ cách đọc lâu hơn). Khi chép thì tắt cả chữ Hán lẫn pinyin và nghĩa, chỉ để lại loa của câu.
- Cách làm (thành phần dùng chung của mục Nghe & đọc, áp dụng mọi bài):
  - Nút "Chép lại lời thoại" ngay đầu phần lời thoại (cạnh summary), trạng thái lưu trên thiết bị (`settings.transcriptCopyMode`), bật/tắt tại chỗ như thanh hỗ trợ: không render lại, không nhảy trang, không ngắt audio đang phát.
  - Bật: mọi dòng chữ của câu (người nói, pinyin, chữ Hán, nghĩa, nút Xem nghĩa/Tra cụm, liên kết ngữ pháp) ẩn; chỉ còn loa từng câu và dòng chép: ô nhập + "Kiểm tra" + "Xem đáp án" (hiện lại đúng câu đó khi cần so sánh).
  - Kiểm tra bằng `checkTranscriptCopy` (src/lib.js): chấp nhận chép chữ Hán (bỏ qua dấu câu/khoảng trắng) hoặc chép pinyin (có dấu thanh, hoặc không dấu, bỏ qua khoảng trắng). Kết quả chỉ là phản hồi luyện tập tại chỗ — KHÔNG ghi attempt, KHÔNG tính điểm, không đổi tiến độ bài.
  - Nháp chép lưu theo từng câu (`copyDrafts`, sống sót qua refresh và di trú tiến độ cũ); sửa sau khi kiểm tra thì kết quả cũ bị xoá để không hiện verdict sai.
- Ranh giới: chế độ này chỉ tác động trong phần lời thoại của mục Nghe & đọc; câu hỏi dưới hội thoại (D28, có chấm điểm) và các mục khác không đổi; thanh hỗ trợ Pinyin/Nghĩa giữ nguyên hành vi ngoài phần lời thoại.

## Bổ sung D36 — Ô chép hiện luôn, không chờ bật chế độ (2026-11-09, Hoa phản hồi)

- Hoa phản hồi trên điện thoại: "Dòng chép lời thoại chưa thấy hiện. Ấn vào xem đáp án mới hiện. Phải có ô viết sau đó mới xem đáp án chứ." Đúng ý: ô chép là dòng thứ 4 cố định của câu — phải hiện sẵn dưới mỗi câu trong phần lời thoại; nút bật/tắt chỉ lo việc ẩn chữ khi chép. Đã sửa: `.copy-line` hiện luôn trong transcript; nút "Xem đáp án" chỉ hiện trong chế độ chép (ngoài chế độ, đáp án vốn đã hiện). Gợi ý cạnh nút bật/tắt sửa lại cho khớp.

## D37 — Mic thu âm theo câu trong phần lời thoại (2026-11-09, Hoa chỉ đạo)

- Chỉ đạo của Hoa: thêm mic thu âm để nghe lại phát âm của người học; Hoa chọn phương án CHỈ NGHE LẠI TRONG BUỔI HỌC (không lưu lâu dài).
- Cách làm: mỗi câu trong phần lời thoại có hàng thu âm (cạnh ô chép): "🎤 Thu âm" → trình duyệt hỏi quyền mic → đọc câu → "⏹ Dừng thu" (tự dừng ở 30 giây) → "▶ Nghe lại" nghe giọng mình, đối chiếu với loa audio sách của chính câu đó; "Xoá" bỏ bản thu. Bắt đầu thu thì dừng audio sách và bản nghe ôn để không lẫn tiếng.
- Ranh giới: bản thu là blob trong bộ nhớ (Map theo bài:câu), KHÔNG tải lên đâu, KHÔNG ghi vào tiến độ/điểm, mất khi đóng trang — đúng phạm vi "trong buổi học" Hoa chọn. Trình duyệt không hỗ trợ thu âm thì không hiện hàng mic. Lỗi quyền mic hiện lời nhắc tại chỗ, không văng trang.

## D38 — Làm lại chép lời thoại + micro (Hoa không nghiệm thu bản D36-sửa/D37, 2026-11-09)
Hoa kiểm trên điện thoại và KHÔNG nghiệm thu: (1) ô chép hiện sẵn làm giao diện dài/rối — yêu cầu quay về đúng nghĩa chế độ: mặc định KHÔNG có ô nhập/Kiểm tra/Xem đáp án; chỉ khi bấm "Chép lại lời thoại" mới ẩn toàn bộ chữ Hán/pinyin/nghĩa (kể cả thành phần lộ đáp án) và hiện ô chép tại chỗ. (2) Micro bấm không thấy phản ứng rõ ràng.
- Chế độ chép là TRẠNG THÁI PHIÊN (biến trong bộ nhớ), KHÔNG lưu vào settings nữa (bỏ `settings.transcriptCopyMode`): mở trang/bài mới luôn bắt đầu ở chế độ đọc; nháp chép (copyDrafts) vẫn lưu như cũ. Bật chế độ: ẩn thêm tên người nói + liên kết ngữ pháp tại câu như D36; tự focus ô đầu tiên (preventScroll, không nhảy trang); audio đang phát không bị ngắt (chỉ đổi class tại chỗ).
- Micro là chức năng ĐỘC LẬP: hàng `.rec-zone` riêng cho từng câu, KHÔNG nằm trong `.copy-line`, hiện ở cả hai chế độ. Hàng luôn render kể cả khi trình duyệt không hỗ trợ — bấm vào sẽ hiện hướng dẫn mở bằng Chrome/Safari thay vì biến mất lặng lẽ.
- Luồng micro bắt buộc có trạng thái nhìn thấy ở mọi bước: bấm → "Đang xin quyền micro…" (ghi đồng bộ TRƯỚC await); được cấp → nút thành "⏹ Dừng thu", dòng trạng thái chấm đỏ + "Đang thu âm m:ss"; dừng → kiểm tra bản thu có dữ liệu (rỗng thì báo lỗi tại chỗ, không bật nghe lại); có bản thu → hiện "▶ Nghe giọng mình / 🔄 Thu lại / Xóa". Lỗi phân loại theo tên lỗi (từ chối quyền/không có thiết bị/mic bận/HTTPS) kèm cách khắc phục; phát lại báo trạng thái đang phát và lỗi phát (không còn catch rỗng). Định dạng thu chọn qua `MediaRecorder.isTypeSupported` (webm/opus → webm → mp4 → ogg); có `recorder.onerror`. Giữ nguyên các vá đua D37 (claim đồng bộ, số thế hệ) và quy tắc buổi học: blob trong bộ nhớ, không tải lên, không điểm/tiến độ.
- Bằng chứng kiểm: test DOM thật bằng jsdom + micro giả (tests/reader-copy-mic.test.mjs: 8 ca — CSS ẩn/hiện, mặc định không copy-on, mic không nằm trong copy-line, reveal theo câu, bài mới không dính chế độ, xin quyền→thu→dừng→phát, thu lại thay bản cũ, từ chối quyền hiện lỗi, chuyển trang giữa lúc thu dừng recorder + nhả mic; tests/reader-mic-unsupported.test.mjs: trình duyệt không hỗ trợ vẫn hiện nút + hướng dẫn). Kiểm tương tác trình duyệt thật trên bản live sau phát hành; thu âm trên Android thật vẫn ghi rõ CHƯA KIỂM cho tới khi Hoa thử lại trên máy của mình.

- Ghi chú nghiệm thu live D38 (cùng ngày): kiểm tương tác thật trên bản live xác nhận mọi hành vi (mặc định không ô chép; bật → ẩn hết chữ + ô hiện; xem đáp án theo câu; tắt → khôi phục; mic từ chối quyền hiện đúng thông báo phân loại). Hai điểm trình bày đã sửa ngay trong PR nối tiếp: hàng mic thêm đường phân cách đứt nét để đọc rõ là hàng riêng dưới câu; ô chép khóa cứng width 100% + box-sizing; BỎ tự động focus ô đầu tiên khi bật chế độ (điều kiện của Hoa là "chỉ khi không gây nhảy trang" — bản kiểm live cho thấy focus làm ô đầu hiển thị co hẹp ở một số trình duyệt).
- Bổ sung D38 (bố cục hàng điều khiển, Hoa chỉ đạo 2026-11-10): loa và micro của mỗi câu gộp thành MỘT hàng điều khiển duy nhất (`.line-controls`, căn phải) đặt ngay sau dòng chữ Hán — không còn hai hàng riêng (loa ở cuối lưới câu, mic ở hàng riêng bên dưới như bản #132). Các nút nghe lại/thu lại/xóa tham gia cùng hàng khi có bản thu; dòng trạng thái nằm dưới hàng và tự co khi trống. Ở chế độ chép, hàng điều khiển giữ nguyên vị trí ngay tại vị trí câu (chỉ còn loa + mic khi chữ ẩn).
- Vá bố cục sau nghiệm thu live của bổ sung trên (cùng ngày): ở chế độ chép, ô tên người nói ẩn khiến khối nội dung câu tự trượt vào cột 90px của lưới hai cột (màn hình ≥768px), làm hàng điều khiển bị bóp và hai nút xếp dọc căn trái. Đã ghim khối nội dung vào cột chữ (`grid-column:2`, chỉ ≥768px) để hàng loa + mic giữ nguyên vị trí/căn phải như chế độ đọc.

## D39 — 2026-11-10: Tái dựng phần nghe Workbook thành khu luyện nghe tương tác (thí điểm HSK 2 Bài 1)
- Hoa chỉ đạo: tái dựng sách Workbook HSK 2 thành giao diện luyện nghe tương tác (không nhúng scan/PDF), bắt đầu bằng một bài đại diện, QA đối chiếu PDF đạt mới nhân rộng. Kiểm kê toàn sách: docs/HSK2_WORKBOOK_VISUAL_AUDIT.md.
- Vị trí tích hợp: khu D "Nghe theo Workbook" trong mục Luyện tập của bài (giữ chuẩn 7 mục của bài; không thêm mục thứ 8). Điểm tính riêng trong phiên, không gộp điểm bài chính (như cách ly của bộ mô phỏng).
- Nội dung: đúng cấu trúc sách in (3 phần, 10 câu, 3 ví dụ mẫu in sẵn); hình là tranh phẳng vẽ lại theo ảnh gốc (16 hình Bài 1, manifest trong tài liệu kiểm kê); audio là track Workbook duy nhất của bài trên Baulchino (lesson-NN/NN-1.mp3 + mock-test-hsk2.mp3 cho đề cuối sách), phát theo đoạn từng câu.
- Đáp án: sách in không có đáp án/lời đọc; đáp án của khu này là verified-editorial — suy ra từ audio của sách (ASR + rà soát ngữ nghĩa theo lựa chọn in), ghi rõ trong giao diện là không phải đáp án chính thức của NXB. Mốc đoạn giữ asr-draft.
- Hai chế độ: Luyện tập (kiểm tra từng câu, xem lời đọc + giải thích sau khi kiểm tra, làm lại từng câu) và Kiểm tra (không hiện đáp án/lời đọc/Pinyin lựa chọn trước khi nộp; nộp một lần, hiện điểm và bài chữa). Pinyin của lựa chọn Part III chỉ hiện sau khi chấm theo D23 dù sách in có sẵn.
- Bổ sung bố cục (Hoa chỉ đạo 2026-11-10): hình trong khu Nghe Workbook để nhỏ — lưới hình luôn 2 hình mỗi dòng ở mọi bề rộng (bộ 3 hình thành 2 dòng 2+1; bộ 4 hình thành 2 dòng × 2), thay cho xếp chồng full-width trên mobile và 3–4 hình một dòng trên desktop.
- Đính chính bố cục (Hoa sửa lại cùng ngày 2026-11-10): câu trước nói nhầm — bộ 3 hình xếp 1 DÒNG (3 hình cạnh nhau), bộ 4 hình giữ 2 dòng × 2. Dòng "luôn 2 hình mỗi dòng" ở bổ sung ngay trên bị thay bởi dòng này.

## D40 — 2026-11-10: Nhân rộng khu Nghe theo Workbook sang HSK 2 Bài 2 (theo khuôn D39)
- Áp dụng nguyên khuôn D39 cho Bài 2 《还是打车去北大吧》: khu "Nghe theo Workbook" trong mục Luyện tập của bài, đúng cấu trúc sách in tr. 013–015 (3 phần, 10 câu, 3 ví dụ mẫu), track Workbook duy nhất của bài trên Baulchino (lesson-02/02-1.mp3), hai chế độ luyện tập/kiểm tra, điểm tính riêng trong phiên, đáp án verified-editorial (ghi rõ không phải đáp án chính thức của NXB), mốc đoạn asr-draft.
- Ví dụ mẫu của cả 3 phần dùng lại nguyên văn dữ liệu + hình của Bài 1 (sách in dùng cùng ví dụ và cùng ảnh cho cả 15 bài); chỉ cửa sổ audio được căn lại theo track Bài 2. 13 hình mới vẽ lại riêng cho Bài 2 (9 hình Part I + 4 hình bộ chung Part II), manifest ở docs/HSK2_WORKBOOK_VISUAL_AUDIT.md mục 4c.
- Bài học QA của Bài 1 tái xuất hiện và đã xử lý trước khi chốt dữ liệu: ASR có VAD bỏ sót lượt đọc hai của câu 1 (Part I) — envelope tín hiệu cho thấy còn lượt đọc ở ~86–89 giây, ASR lại không VAD khôi phục nguyên văn khớp lượt một; mốc câu 1 (80,3–89,7) gồm cả hai lượt đọc.
- Sửa sau QA (vòng khép trong nhánh, trước phát hành): QA bắt lỗi HIGH-1 — nhãn khu Workbook ghi cứng "D." ở 3 chỗ trong src/app.js trong khi cả Bài 1 lẫn Bài 2 đều không có suppExerciseSet, trang hiện "gồm 3 phần" nhưng dãy chữ chạy A, B, D (lỗi có từ D39 trên trang Bài 1 đã live). Đã sửa: chữ cái khu Workbook suy ra từ suppExerciseSet (có → D, không → C) ở cả 3 vị trí; test DOM khẳng định "C. Nghe theo Workbook" + "gồm 3 phần" cho cả hai bài. Trang Bài 1 live sẽ đổi nhãn D → C theo cùng bản phát hành này. Kèm sửa nhỏ LOW-2: thống nhất dấu câu Hán/Pinyin ở dòng 1 câu 9 Part III Bài 2.
