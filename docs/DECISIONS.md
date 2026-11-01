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
