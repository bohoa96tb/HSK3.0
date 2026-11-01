# CONTENT_STANDARD.md — Chuẩn nội dung và provenance

Theo đặc tả gốc mục 6–8 (`docs/MASTER_PLAN.md`). Mọi nội dung xuất bản
trong app phải tuân thủ tài liệu này. Nguyên tắc bao trùm: **nội dung gốc,
ví dụ, bài đọc, audio, đề bài và đáp án phải truy được về Baulchino**;
phần nào không truy được thì không xuất bản như nội dung nguồn.

## 1. Provenance — `sourceRefs` bắt buộc

- 100% mục xuất bản phải có `sourceRefs` và quyền dùng phù hợp với cách
  hiển thị. Không có `sourceRefs` thì không đánh dấu `ready`.
- `sourceRefs` phải **phân biệt số trang PDF với số trang in**, gồm các
  trường khi áp dụng được: `sourceId`, `pdfPage`, `printedPage`, `unit`
  (bài/phần), `section`, `item` / `track`.
  - Ví dụ đã kiểm chứng: Workbook HSK1 Bài 1, phần Pronunciation —
    trang in 001–003, PDF tr.8–10, track 1-1. Mục lục Workbook —
    trang in VI = PDF tr.7.
- Mỗi `Source` ghi: id, URL trang nguồn, URL tài sản, tên sách, nhà xuất
  bản / ISBN nếu kiểm chứng được, edition, `retrievedAt`, `rightsStatus`,
  `rightsEvidence`. Chỉ gán trạng thái quyền cho phép khi có bằng chứng
  tương ứng; hiện tại mọi tài sản là `rightsStatus=unknown`
  (xem `docs/SOURCE_AUDIT.md`).
- ID của mọi thực thể phải ổn định, không dựa vào tiêu đề Việt hoặc vị trí
  hiện tại trong mảng. Sửa nội dung không làm mất lịch sử học. Cập nhật đáp
  án phải tăng phiên bản nội dung và đánh dấu lần chấm cũ cần xem lại nếu
  bị ảnh hưởng.

## 2. Mô hình liên kết dữ liệu

Quan hệ chuẩn, tạo liên kết từ dữ liệu — không ghép thủ công trong UI:

```
Book → Lesson → Grammar / Passage / Exercise
Passage → Sentence → AudioSegment
Exercise → Grammar + Sentence
```

- Liên kết ngược (ví dụ: điểm ngữ pháp → các bài có dùng) được suy ra từ
  các ID trên, tránh nhập hai lần rồi lệch.
- Mỗi điểm ngữ pháp liên kết đến **đúng** câu, đoạn audio và bài tập liên
  quan — liên kết phải đúng ý nghĩa, không chỉ là ID tồn tại.
- Ngữ pháp có nhiều cách dùng phải có `senseKey` riêng. Việc xuất hiện cùng
  một chữ không đủ để gán cùng một cấu trúc. Tô sáng cấu trúc trong câu
  dùng span đã duyệt, không chỉ tìm chuỗi ký tự để suy nghĩa.
- Không tự đổi cấp (HSK) của một điểm theo trí nhớ; cấp lấy theo nguồn và
  ghi bằng chứng ánh xạ. Chưa đối chiếu đề cương chính thức thì hiển thị
  "Theo giáo trình HSK 3.0 — chưa đối chiếu đầy đủ đề cương".

Các thực thể và trường quan trọng: Source, Course/Book, Lesson,
GrammarPoint, Passage, Sentence, Audio, Exercise, Progress, ReviewItem —
chi tiết ở mục 7 của `docs/MASTER_PLAN.md`.

## 3. Quy tắc dịch tiếng Việt (biên tập)

- Tiếng Việt là **bản dịch / chú giải biên tập** từ nguồn, ghi rõ vai trò
  đó trong app và tài liệu. Không quảng cáo là bản dịch chính thức.
- Dịch phải bám nghĩa trong ngữ cảnh của bài; thuật ngữ giữ tối thiểu và
  nhất quán; diễn đạt đơn giản, dễ hiểu cho người Việt học tiếng Trung.
- Người biên tập tự rà soát độ chính xác của từng câu dịch trước khi xuất
  bản. Bản dịch chưa rà soát không được đánh dấu `ready`.
- Phần "Dễ nhầm" và chú giải bổ sung là nội dung biên tập: phải đánh nhãn
  là chú giải biên tập, chỉ viết khi có căn cứ từ nguồn, và phải được kiểm
  duyệt. Không bổ sung quy tắc ngữ pháp mới chỉ để đủ mục của thẻ giải thích.
- Tên bài tiếng Việt trong `docs/CURRICULUM_MAP.md` là tên biên tập từ tên
  Trung/Anh của mục lục, không phải tên chính thức.

## 4. Quy tắc Pinyin

- Pinyin xuất bản phải **đối chiếu bản in** của nguồn (sách in đã có Pinyin
  cho thẻ từ, bảng âm tiết…). Không xuất bản kết quả thư viện tự chuyển đổi
  mà chưa kiểm tra.
- Pinyin nhiều âm (chữ có nhiều cách đọc) phải duyệt trong ngữ cảnh câu cụ thể.
- Hai công tắc Pinyin và Nghĩa Việt độc lập; mặc định và hành vi nhớ lựa
  chọn theo `docs/UI_SPEC.md` mục 4.9.
- Audio zh-CN và phần dịch không trộn lẫn. Không tự tạo giọng Việt hay
  giọng Trung bằng TTS trong phạm vi dự án hiện tại.

## 5. Audio và timestamp

- Audio phải khớp đúng sách (Textbook khác Workbook), đúng bài, đúng track
  và đúng văn bản. Ghép audio dựa trên kiểm chứng thực tế, không chỉ dựa
  vào tên file. Trạng thái hiện tại của Bài 1 Workbook: đối ứng track 1-1 /
  1-2 đã kiểm chứng ở mức số hiệu và danh mục, **chưa nghe kiểm chứng** —
  phải ghi đúng trạng thái này, không nâng lên "đã khớp".
- Mốc câu (segment) lưu giây thập phân kèm trạng thái `unverified` /
  `verified`. Căn chỉnh tự động chỉ tạo bản nháp.
- **Timestamp `unverified` thì tắt nghe từng câu.** Nghe từng câu chỉ bật
  sau khi đã nghe thực tế câu đầu, câu cuối và ranh giới từng câu của
  pilot; mốc sai phải sửa hoặc tắt nút của câu đó. Đây là lỗi chặn phát
  hành nếu vi phạm, không phải cảnh báo.
- Không tuyên bố karaoke theo từng từ khi chỉ có timestamp theo câu.
- Khi được phép và phù hợp, giữ audio nguyên vẹn tại nguồn và dùng
  timestamp thay vì cắt hàng loạt MP3. Không commit MP3 vào repo.
- Lỗi mạng khi phát: giữ tiến độ, cho Thử lại và Mở nguồn; không thay bằng TTS.

## 6. Bài tập, đáp án và cách ghi điểm

### 6.1. Đáp án và chế độ chấm

- Mỗi bài tập ghi `answerStatus`:
  - `verified` / `verified-from-print`: đáp án lấy trực tiếp từ bản in /
    nguồn đã kiểm chứng → được chấm tự động.
  - `unverified`: đáp án chưa kiểm chứng → **không chấm tự động**; dùng chế
    độ tự đối chiếu / tự đánh giá, không tính vào điểm tự động, và hiển thị
    rõ chế độ này cho người học.
- Không đổi đề gốc thành dạng lựa chọn rồi bịa thêm đáp án nhiễu. Chỉ kích
  hoạt dạng bài khi đã thấy đề tương ứng trong nguồn.
- Câu phụ thuộc hình phải có hình được phép dùng hoặc chuyển sang mở trang
  nguồn; không bỏ hình rồi vẫn chấm.
- Chấm văn bản: chuẩn hóa khoảng trắng và dấu câu theo quy tắc ghi rõ;
  không xóa khác biệt làm đổi nghĩa. Biến thể đáp án (`acceptedVariants`)
  chỉ thêm khi đã được duyệt. Câu hỏi mở không chấm đúng/sai tuyệt đối
  bằng so khớp chuỗi.
- Áp dụng cho pilot Bài 1 (quyết định D-exercise): chấm tự động chỉ gồm
  câu hỏi biên tập tiếng Việt mà mọi lựa chọn và đáp án đều lấy trực tiếp
  từ trang in 001–004 (`verified-from-print`); bài nghe viết 2–4 và bài
  chọn hội thoại theo hình dùng `unverified` (không thấy phần đáp án
  trong Workbook).

### 6.2. Phân biệt điểm

Hệ thống phải ghi và hiển thị **riêng biệt**:

- Điểm / kết quả **lần đầu** làm một câu.
- Kết quả **làm lại** (các lần sau lần đầu).
- Trường hợp **đã xem gợi ý / đã xem đáp án** trước khi trả lời.

Xem gợi ý hoặc đáp án không được tính như trả lời đúng độc lập và không
được làm đẹp điểm tổng. "Đã xem / đã học" tách khỏi "đã nắm vững": mục
thiếu bài tập kiểm chứng không được coi là thành thạo.

### 6.3. Ôn tập

- Hàng đợi ôn dùng lại câu nguồn đã lưu / làm sai; không tự tạo câu mới.
- Tự đánh giá 3 mức: Chưa nhớ / Còn chậm / Nhớ. Lịch đề xuất 1, 3, 7, 14,
  30 ngày; sai quay về 1 ngày.

## 7. Quy trình đưa một bài nguồn vào app

Đi đủ 12 bước ở mục 8 của `docs/MASTER_PLAN.md`: xác nhận sách/ấn bản qua
bìa, trang xuất bản, mục lục → tạo source record và trạng thái quyền →
ghi trang in/PDF và các phần có thật → trích xuất/OCR (bản thô không mặc
định commit) → đối chiếu ảnh trang (chữ Hán, dấu câu, Pinyin, số câu,
bảng, hình; OCR chưa duyệt không vào bài công khai) → biên tập dịch Việt →
gắn điểm kiến thức vào câu cụ thể → ghép audio đúng sách/bài/track và nghe
so khớp → cắt mốc câu nếu xác minh được → nhập bài tập cùng đáp án nguồn
(thiếu thì ghi thiếu và đổi chế độ chấm) → chạy validator + kiểm thử →
chỉ đánh dấu `ready` khi đủ điều kiện công bố và không còn liên kết treo.

Hoàn thành từng bài trọn vòng thay vì tạo nhiều khung rỗng; không đặt mục
tiêu số bài mỗi lần trước khi biết độ phức tạp của bài.

## 8. Điều kiện công bố một mục nội dung (ready)

- Có `sourceRefs` đầy đủ và đúng quyển / ấn bản; không lẫn giáo trình cũ,
  không lẫn audio Workbook với Textbook.
- Bản dịch, Pinyin, đáp án đã duyệt theo các mục trên.
- Mọi liên kết grammar–sentence–audio–exercise resolve đúng ý nghĩa.
- Không có placeholder, không có bài/câu tự sinh, không có ví dụ không nguồn.
- Các mục không áp dụng / thiếu nguồn được ghi rõ trong dữ liệu và hiển
  thị trung thực trong app.

## Bổ sung 01/11/2026 — nguồn câu hỏi và transcript

`sourceRefs` trỏ đến từ/ví dụ không chứng minh đề trắc nghiệm là nguyên bản. Phải kiểm tra cả yêu cầu, lựa chọn và hình của đề. Không tự tạo distractor rồi gọi là câu sách.

`verified-from-visual`: đáp án suy từ hình/ngữ cảnh đã kiểm chứng, cần answerEvidence và hình gốc. Hiển thị rõ không phải đáp án chính thức. `print-verified`: lời thoại đã chép đúng bản in, chưa phải audio-verified. Nghe–viết chưa có đáp án vẫn unverified và không chấm tự động.

Hình trích có ý nghĩa sư phạm, có attribution, giữ nguyên ngữ cảnh. Không thay ảnh bài tập bằng ảnh trang trí.

## Bổ sung 01/11/2026 — quy trình đối chiếu tài liệu lời đọc / đáp án rời (chuẩn cho các bài sau)

Khi Workbook không in đáp án, đi theo thứ tự: (1) đề và lời thoại vẫn chỉ lấy từ bản in qua Baulchino; (2) tìm tài liệu lời đọc （听力材料） và tài liệu đáp án （习题答案） của **đúng ấn bản** — ưu tiên kênh nhà xuất bản; bản đăng lại (Scribd và tương tự) chỉ là đầu mối đối chiếu, và nhiều bản đăng lại của cùng một tài liệu chỉ tính là **một** nguồn; (3) đọc trực quan/lớp chữ định vị của tài liệu, không sửa ký tự lỗi bằng suy đoán; (4) đối chiếu ba chiều: đề bản in ↔ lời đọc ↔ dãy âm tiết trong track (ASR local chỉ làm bản nháp, không tải học liệu lên dịch vụ ngoài, không coi kết quả máy là xác minh cuối).

Ghi **ba thuộc tính riêng** cho mỗi đáp án: xuất xứ tài liệu (chính thức / đăng lại), căn cứ đúng (bản in / lời đọc / nghe đối chiếu), và trạng thái nghe audio (chưa nghe / nháp ASR / đã nghe kiểm chứng). Phân loại trong app:
- `verified` / `verified-from-print`: đáp án từ bản in hoặc kênh chính thức đã kiểm chứng.
- `verified-editorial`: đáp án biên tập đã đối chiếu đủ ba chiều trên nhưng chưa chứng minh là bản đáp án chính thức — **được chấm tự động**, kèm `answerEvidence` và `scriptSyllables`, UI ghi rõ căn cứ.
- `unverified`: không chấm tự động (tự đối chiếu / tự đánh giá), không tính vào mẫu số điểm.

Quy tắc chấm nghe–viết: thanh mẫu chỉ chấm phụ âm đầu (nhập cả âm tiết thì âm tiết phải khớp hoàn toàn); vận mẫu bắt buộc kèm dấu thanh như lời đọc; thanh điệu chấp nhận Pinyin có dấu, số thanh sau âm tiết hoặc chỉ số thanh, thiếu dấu là sai. Không đồng nhất u/ü; riêng sau j/q/x, u viết thay ü được chấp nhận theo quy tắc chính tả của chính bài học. `v` được hiểu là ü khi nhập. Sửa đề/đáp án phải tăng `version` của bài tập và tăng contentVersion; tự đánh giá cũ không bao giờ được chuyển thành điểm chấm tự động. Mốc đoạn audio chỉ lưu khi đã đối chiếu vị trí câu hướng dẫn và dãy âm tiết; không chia đều thời lượng, không suy mốc từng ô khi ranh giới chưa chắc.
