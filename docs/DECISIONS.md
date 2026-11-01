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

