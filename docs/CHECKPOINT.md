# CHECKPOINT — HSK3.0

- milestone: Bài 1–8 đã phát hành theo chuẩn ux3 (Bài 8: PR #41, bài đầu tiên áp dụng chuẩn minh họa vẽ mới D19 và quy trình QA D17 khép trong nhánh); quy tắc tiếp tục theo D13 — mỗi lượt "Tiếp tục" hoàn thành trọn một bài, không chờ nghiệm thu từng bài
- status: lesson8_released_live_passed
- currentLessonId: hsk1-l08
- lastCompletedTask: Bài 7 我晚上六点半下班 (PR #34 merge 9273e1eb, contentVersion 20261101-lesson7-2): 27 từ mới + Hán–Việt 27/27 (tổng 137/137), 6 điểm kiến thức (Cách nói giờ (2) / “吧” (1) / vị trí trạng ngữ / “呢” (2) + nền thanh mẫu đưa hơi và vận mẫu mũi), 14 câu/3 hội thoại print-verified, 7 track, 9 câu chấm tự động verified-from-print (4 nghe hiểu 2/1/3/3 + 5 tổng hợp tr.052 đáp án 3/2/5/4/1), 2 bài phân biệt phát âm (12 + 16 cặp) giữ unverified theo bằng chứng (lời đọc đăng lại tr. in 019 in cả hai dạng mỗi cặp; tài liệu đáp án không có mục này — xem SOURCE_AUDIT), 1 bài dùng hình để nói tự luyện; bài này không có từ nền dạng chữ. Loa asr-draft: câu 14/14, từ mới 27/27, lựa chọn 26/37. QA độc lập 2 vòng theo D17 khép trong nhánh: vòng 1 đạt nội dung, bắt 7 đoạn loa từ mới tràn từ kề (đã căn lại theo phân tích khoảng lặng) + 3 liên kết ôn tập sai/thiếu (đã sửa theo quy tắc ô trống kiểm tra gì trỏ điểm đó); vòng 2 kiểm lại đạt. Nghiệm thu live 8/8 + responsive iframe 12/12 + cỡ chữ tối đa đạt. Quy trình D17 đã ghi vào CONTENT_STANDARD/DECISIONS/AGENTS.md/QA_REPORT.
- nextTask: Bài 9 khi người dùng gửi “Tiếp tục”; xác minh tên và trang từ mục lục/sách thật trước khi làm theo D13/D17/D19.
- checksRun: npm run check — validator đạt (8 bài; Hán–Việt 161/161), 71/71 test đạt. CI GitHub Actions vẫn chưa tạo được qua connector (403); bản bàn giao docs/ci/ci.yml — cần Hoa tạo .github/workflows/ci.yml qua web GitHub hoặc cấp quyền workflow.
- blockers: quyền tái xuất bản vẫn unknown; mọi đoạn loa vẫn asr-draft, chưa nghe kiểm chứng bởi người; đơn vị chưa có loa riêng: 大家 (Bài 1), 雨/五/一/椅子 (Bài 2), 吗/嘴 (Bài 3), 盖儿/个儿 (Bài 6) cùng các lựa chọn/ví dụ đã ghi ở từng lượt; ô 5 Bài 5 ở trạng thái source-conflict (D16) chờ bằng chứng giải quyết xung đột; trang Tiến độ chỉ dẫn tới điểm nghe–viết ở Tổng kết/Luyện tập chứ không in điểm trực tiếp; chưa thử Android thật.
- evidence: docs/SOURCE_AUDIT.md (mục Bài 5 + bổ sung rà soát, mục Bài 6), docs/QA_REPORT.md (mục Bài 5, lượt rà soát Bài 5, mục Bài 6), docs/DECISIONS.md D13–D16, docs/CONTENT_STANDARD.md (quy tắc source-conflict), docs/UI_SPEC.md mục 11
- baselineCommit: 905da09bd38609f03598aeeea1d0665952aeeaf1 (PR #37; contentVersion live 20261101-lesson7-2, đã đối chiếu khớp byte)
- branch: main (PR #26)
- deploymentUrl: https://bohoa96tb.github.io/HSK3.0/
- release (Bài 6): PR #26 merge 03d6e27a; contentVersion live 20261101-lesson6-1 (đã đối chiếu content.json trên URL thật khớp byte bản local); ảnh assets/lesson-06/classroom.webp tải lên qua web GitHub và đối chiếu git blob sha khớp bản local (25ec966d…; raw.githubusercontent có lúc trả 404 thoáng qua cho nhánh có dấu /, đã xác minh qua API); file văn bản đẩy qua connector push-files, đối chiếu byte khớp.
- liveChecks: nghiệm thu live Bài 6 đạt các luồng chính (lộ trình 6 bài đã mở; Từ cần biết 22 thẻ + Hán–Việt; Nghe & đọc 3 đoạn, loa câu số điện thoại đúng đoạn; Bài tập chấm đúng/sai + liên kết ôn trỏ kp-hsk1-l06-serial + quay lại giữ trạng thái; bài chọn âm tiết đôi phát đoạn 0:12–0:47, chấm đúng/sai đúng cả ba trường hợp kiểm ở lượt kiểm lại — lượt đầu 'dong1xi' từng bị chấm sai vì CDN còn bản lib.js cũ ngay sau phát hành, đã xác minh bản mới trên URL thật; bài 2 nhi hóa không chấm; refresh giữ kết quả; hồi quy Bài 5). Lượt sửa Bài 5 kiểm live đạt 5/5 trước đó. Iframe responsive 3 tuyến Bài 6 đạt ở 360/390/768/1440 gồm cỡ chữ tối đa + mini player mở ở 390. Không đồng nghĩa đã nghe thẩm định đoạn loa hoặc đã thử Android thật.

## Lượt người dùng yêu cầu hoàn thiện Bài6–7 (01/11/2026)
- branch: fix/lessons-6-7-practice; baseline961531164e15ad377cbb42485cc7e331cb3c946a.
- Đã đọc lại nguồn: Workbook tr.032/039/040, Textbook tr.041/042/052; lời đọc Scribd tr.016/019. Ba bài phân biệt đã đủ căn cứ về mục tiêu nghe cả hai dạng, không phải thiếu đáp án chọn một. UI và ghi chú cá nhân đã sửa đúng.
- Sửa bīn thành bìn theo ảnh in; sourceRefs Bài6 tr.014→016; chuẩn hóa segment→audioSegment cho Bài7 và validator kiểm cả bài không chấm.
- Đủ8 hình cho8 khung câu tự nói; bỏ mô tả giờ suy đoán và nút phát hội thoại không liên quan.
- Phát hiện caption chỉ có ở dữ liệu/dashboard, chưa render tại Bắt đầu; đã bổ sung figure/figcaption chung.
- Không thay đổi điểm cũ, ID nháp hoặc lịch ôn; không mở Bài8.
- Đoạn audio vẫn nháp, chưa kiểm nghe bởi người; loa thiếu, Android thật, CI/quyền nguồn vẫn còn.

- checks bổ sung: validator đạt,63/63 test đạt,diff-check sạch; đã nhận/đọc đầy đủ QA độc lập nguồn+code và bổ sung caption trước merge. Chưa ghi live đạt trước khi kiểm.

### Khép nghiệm thu live lượt hoàn thiện Bài6–7
- Phát hành PR #39, merge 8d652c31e579cec9c3547061343dfad5795d947f; contentVersion 20261101-lessons67-practice1. Pages run 41285859946 thành công. index.html, src/app.js và data/content.json trên URL thật đối chiếu byte khớp bản merge.
- Bắt đầu Bài6/Bài7 hiện caption Textbook trang036/046. Căn nguyên là thiếu figcaption ở renderer, không chỉ lỗi tìm chuỗi dấu phẩy của lần QA cũ.
- Live: Bài6 nghe–so sánh phát từ khoảng0:47 (quan sát bộ đếm0:53 đang chạy), Bài7 bài1 từ khoảng1:07; không coi đây là kiểm nghe ngữ nghĩa. Không có nút chấm trong ba bài so sánh. Ghi chú thử Bài6 và Bài7 còn nguyên sau reload.
- Tám ảnh của hai bài dùng hình để nói đều tải thật; caption/khung câu và ô nháp hiển thị đúng. Iframe hai tuyến exercises ×360/390/768/1440: không tràn ngang; kiểm ảnh và bố cục trực quan390px/desktop. Không thay thế Android thật.
- Đã khép phạm vi sửa nguồn, hướng dẫn, ảnh và renderer. Không mở Bài8 trong lượt này. Những hạn chế audio/thiết bị/quyền/CI ở trên vẫn giữ nguyên.

## Bài 8 — 我爸爸也在医院工作 (01/11/2026)
- branch: feat/lesson-8 → PR #41, merge 76dfe4c5; contentVersion 20261101-lesson8-1.
- Phạm vi: TB in 054–060 / WB in 048–050 (mô phỏng từ 051 loại theo D15). 24 từ (23 + tên riêng 胡医生） + HV 24/24 (tổng 161/161), 4 KP (phương vị từ / giới từ “在” / “能” + nền điệp âm), 14 câu/3 hội thoại, 7 track, 19 câu chấm (text 3/1/2/2 + comp 2/5/1/3/4 verified-from-print; warm nối hình 4/3/1/5/6/2 verified-from-print; redup 2/3/2/1 verified-editorial theo đáp án đăng lại B/C/B/A + phân tích dạng từ), nghe chọn âm tiết 8 ô verified-editorial (lời đọc đăng lại tr.022 chỉ in âm tiết được đọc), bài dùng hình để nói tự luyện (cặp hình–khung câu đối chiếu lại từ bản in).
- Hình: 11 file WebP minh họa phẳng vẽ mới theo D19 ở assets/lesson-08/ (đẩy qua web GitHub, đối chiếu git blob sha khớp bản local từng file); renderer lựa chọn hình ẩn nhãn chữ trước khi chấm. Chuẩn D19 đã ghi vào CONTENT_STANDARD/DECISIONS/AGENTS/SOURCE_AUDIT.
- Loa asr-draft: câu 14/14, từ 24/24 (căn khoảng lặng lần đọc đầu), lựa chọn có loa lũy kế 173/249. Validator mở trạng thái verified-editorial cho trắc nghiệm khi có answerEvidence (D19).
- QA D17 khép trong nhánh: vòng 1 — 0 nghiêm trọng, 1 trung bình (ví dụ KP 能 thiếu 午： in 吃午饭， app ghi 吃饭 → sửa + cha phóng to bản in gốc xác nhận), 3 nhẹ (diễn đạt KP phương vị; 2 alt hình mô tả chi tiết không có trong tranh → sửa); vòng 2 đạt 5/5, quét sạch dư vết. 71/71 test (thêm test hồi quy cho các điểm sửa).
- Live: content.json trên URL thật có contentVersion 20261101-lesson8-1 và đủ 19 câu Bài 8; ảnh WebP trả 200 đúng kích thước; iframe responsive tuyến Từ cần biết + Bài tập Bài 8 ở 360/390/768/1440 không tràn ngang (chạy trên bản local trùng byte với bản merge; harness đã thêm tuyến Bài 8). Vẫn tồn: chưa nghe kiểm chứng bởi người, chưa Android thật, CI chưa tạo được qua connector (403), quyền nguồn unknown.

## Vòng bổ sung Bài 8 — đề mô phỏng + track WB 08-2 (D21, 2026-11-01)

- Hoa yêu cầu kiểm tra audio Bài 8 ở nguồn: CDN Baulchino chỉ có TB 08-1..6 + WB 08-1, 08-2; app trước vòng này thiếu WB 08-2 (track đề mô phỏng 模拟测练， WB in 051–056, 487,09s — bị loại theo D15).
- Đã bổ sung thành bộ bài bổ trợ riêng `set-wb-l08-mock-v1` (20 câu, verified-editorial + answerEvidence; 10 câu nghe có đoạn trên track 8-2; 17 hình vẽ WebP mới phát hành), session/điểm tách riêng, không gộp vào 19 câu chính.
- Phát hiện và sửa lỗi tiềm ẩn: gradeChoice không chấm verified-editorial (4 câu trùng điệp Bài 8 cũng bị ảnh hưởng từ khi phát hành) — đã sửa + test hồi quy.
- contentVersion: 20261101-mock8-1. Kiểm thử local: validator + 87/87 test. QA D17: nội dung vòng 1 ĐẠT CÓ ĐIỀU KIỆN (sửa 4 nhẹ, kiểm lại 4/4); code vòng 1 CHƯA ĐẠT (TB1 deep link + N1–N3) → sửa hết → kiểm lại ĐẠT toàn bộ (QA code chạy kịch bản jsdom độc lập 33/33). Phát hành: PR #44 merge f1ccd648; 17 hình tải qua web GitHub (commit 1a7b2d0) và đối chiếu blob sha 17/17 khớp bản local; bản live đã xác nhận contentVersion + 20 câu mô phỏng + 8 track + ảnh 200 đúng kích thước.

## Vòng rà soát độ phủ Bài 8 (D22, 2026-11-01)

- Theo yêu cầu của Hoa: đọc lại từng trang TB in 054–060 + WB in 048–050, đối chiếu mục lớn với app. Đã có đủ: mục tiêu, khởi động, 3 hội thoại/24 từ, 3 小语讲堂， nghe Hội thoại 2/3, tổng hợp, nói theo hình, phát âm 1+2, mô phỏng (D21), đóng vai tr.057.
- Bổ sung: 2 ô 小语助力 (KP mẹo), câu hỏi mở Hội thoại 3 (bài tự luyện st-l08-03), hoạt động cặp tr.055 + Hoạt động lớp tr.060 (vào khối Vận dụng), KP chữ Hán 汉字书写（一） (kind foundation-characters); gắn liên kết ôn tập hai chiều cho 11 câu mô phỏng đúng điểm kiến thức. contentVersion 20261101-lesson8-coverage1; test local 89/89. QA D17: nội dung ĐẠT (điểm Nhẹ về thứ tự hai KP đầu đã sửa — mẹo tr.055 trước bài giảng tr.056); code ĐẠT CÓ ĐIỀU KIỆN với TB1 (phép tổng quát làm đổi nhóm 1 KP của Bài 6) → đã thu hẹp điều kiện về hai kind rõ ràng, Bài 6 nguyên trạng. Đã phát hành: PR #46 merge 59961e8b, live 20261101-lesson8-coverage1.

## Vòng nâng cấp trải nghiệm Bài 8 — bài thí điểm (D23, 2026-11-02)

- Hoa giao nâng cấp trọn vẹn trải nghiệm học Bài 8 làm bài thí điểm (không mở Bài 9, không sửa hàng loạt bài khác): lộ trình theo tình huống, từ theo hội thoại, 3 điểm chính, quy tắc Pinyin mới, bài tập 3 khu, tự nói tách nhiệm vụ, tổng kết trung thực.
- Phát hành: nhánh feat/lesson-8-experience → PR #48, merge 34b5aa24; contentVersion 20261102-lesson8-path1. File đẩy qua connector theo 3 đợt, đối chiếu byte 14/14 khớp bản local; bản live đối chiếu byte 6/6 file runtime.
- Nội dung: intro viết lại + learningPath 6 bước; từ 23+1 chia 3 nhóm theo hội thoại (10/7/6+1) với nút nghe cả nhóm bằng track gốc 8-2/8-4/8-6 (không cắt đoạn từng từ); 3 KP chính viết lại đơn giản + useWhenVi + quickCheck (không ghi điểm), 2 mẹo sang khối riêng; reader gắn checkItemId theo hội thoại; apply.tasks 3 nhiệm vụ nói + khóa progress cộng thêm speakingDone (tương thích dữ liệu cũ); summaryPoints 3 điều chính.
- Quy tắc D23: bài tập thường không render Pinyin/nghĩa vào DOM trước khi chấm (sau chấm hiện theo công tắc); bài luyện âm là ngoại lệ duy nhất có nhãn, vẫn ẩn nghĩa phân loại; supportUsed chỉ ghi cho bộ bài chính (sửa TB-1 của QA code).
- QA D17 hai vòng khép trong nhánh: nội dung vòng 1 — 0 nghiêm trọng/1 trung bình (ghi nguồn nhiệm vụ nói)/5 nhẹ, sửa hết, vòng 2 đạt 6/6; code vòng 1 — lõi đạt (rò rỉ 0, liên kết sâu 25/25, tương thích tiến độ 12/12), 2 trung bình + 3 nhẹ, sửa hết, vòng 2 đạt 5/5. Test cuối: validator OK + 102/102.
- Nghiệm thu live: tương tác đạt các mục chính (chi tiết ở QA_REPORT mục D23); iframe 360 đủ 7 route + 390 ba route chính không tràn ngang. Lưu ý: 4 câu chọn dạng lặp nằm ở khu A vì thuộc bộ 19 câu chính (trình tự Workbook + tập điểm lần đầu đã phát hành); khu B là các bài tự luyện.
- Tồn tại giữ nguyên: chưa nghe kiểm chứng audio bởi người (mốc asr-draft), chưa Android thật cho các thay đổi vòng này, CI Actions chưa tạo được (403), quyền sách/audio unknown, thời lượng học là ước lượng chưa đo.
- nextTask: Bài 9 khi Hoa nói "Tiếp tục" — áp dụng thêm chuẩn thí điểm D23 (lộ trình, nhóm từ theo hội thoại, quy tắc Pinyin) cùng D17/D19/D20/D22.

## Vòng ẩn chữ dài + tra từ Bài 8 — thí điểm (D24, 2026-11-02)

- Phát hành: nhánh feat/lesson-8-lookup → PR #50, merge 1e38f6c0; contentVersion 20261102-lesson8-lookup1. Đối chiếu byte remote 13/13 file khớp local; live 5/5 file runtime khớp byte.
- Phần A: mẫu details.info-fold dùng chung (Cách làm bài / Thông tin thêm / Cách tính lịch ôn) áp ở thành phần dùng chung; ô vàng khối Luyện thêm thu gọn; gợi ý "Xem trước sẽ được ghi nhận." cạnh nút Xem lời đọc; dòng ghi nguồn chấm rút một dòng giữ cảnh báo NXB; câu báo hỗ trợ rút ngắn.
- Phần B: tra từ chạm thí điểm CHỈ Bài 8 ở bề mặt đọc (lời thoại/ví dụ kiến thức/câu mẫu tự nói/ví dụ tổng kết); tách từ bằng từ điển dự án (segmentZh); lookup.extras 11 mục + phrases 2 cụm, hanViet chưa có căn cứ để null và báo rõ; tra cụm chạm từ đầu→cuối; giọng máy thiết bị ghi nhãn. Độ phủ tách từ 39/39 văn bản đích. Bài tập/Thử ngay/prep: 0 token.
- QA D17 hai vòng cả nội dung và code (chi tiết QA_REPORT mục D24): nội dung v1 1 TB （这只 → GIÁ CHÍCH) + 3 nhẹ → v2 còn 1 nhẹ biến điệu 一 → đã sửa; code v1 59/59 + sửa quan sát nhẹ thành phần → v2 16/16 đạt. Test 110/110.
- Nghiệm thu live tương tác 5/5 đạt (tra 医院 yīyuàn/Y VIỆN; cụm 在医院工作 nghĩa cả cụm; 只 zhī lượng từ + ghi chú zhǐ; Luyện tập chỉ còn mục thu gọn đóng mặc định, bài tập không có nút tra; Bài 1 không có tra từ). Chưa kiểm nghe (giọng tra là giọng máy), chưa Android thật cho vòng này.
- nextTask: Bài 9 khi Hoa nói "Tiếp tục" — áp dụng D17/D19/D20/D22/D23/D24 (kiểm kê độ phủ gồm tra từ + ẩn chữ dài ngay từ đầu nếu Hoa muốn mở rộng thí điểm).

## Vòng rà soát ví dụ + giao diện gọn Bài 8 — D25 (2026-11-02)

- Phát hành: nhánh feat/lesson-8-examples-ui → PR #52, merge 18dadbac; contentVersion 20261102-lesson8-exui1. Đối chiếu byte remote 10/10 + live 4/4 file runtime khớp local.
- Kiểm kê ví dụ (tự đọc trực quan TB in 054–060 + WB in 048–050): 13 mục ví dụ giảng dạy/mẫu — 11 đã có đúng, bổ sung 2 chỗ thiếu một phần: 外边 vào danh sách từ chỉ phía (KP vị trí); mẫu hội thoại Hoạt động lớp (TB 060) thành câu mẫu đầy đủ 4 lượt của nhiệm vụ nói 1. Cắt hậu tố nguồn lặp khỏi noteVi của 11 ví dụ. Bài tập/câu hỏi đối chiếu khớp, không đổi.
- Giao diện: khối ví dụ 2 dòng (.ex-row/.ex-meta) ở thành phần dùng chung (knowledge/apply/summary), nghĩa ví dụ theo công tắc Nghĩa; mật độ CSS gọn (zh-sentence 1.32rem, ví dụ 1.18rem, thẻ 14px mobile...); thang cỡ chữ người dùng giữ nguyên.
- QA D17: nội dung ĐẠT (0 lỗi; 1 nhẹ ở văn bản kiểm kê đã sửa); code v1 bắt 1 TB (Tra cụm chết trên bề mặt .example do handler tìm wrap trong .ex-meta) → sửa + test hồi quy; v2 ĐẠT 35/35. Test 116/116.
- Nghiệm thu live 5/5 đạt （外边 trong công thức; bản dịch không còn hậu tố; "Xem thêm" có câu thứ ba; tra 小猫 + tra cụm 在学校吃午饭 từ khối ví dụ mới; apply hiện mẫu đầy đủ; Bài 1 knowledge bố cục gọn bình thường). Giới hạn đo lường: trình duyệt kiểm tra không đặt được viewport 390px tùy ý/không đọc offsetHeight; một lượt chụp qua trang responsive cho mô tả không khớp dữ liệu thật nên bị loại — so sánh trước/sau dựa trên thông số CSS + quan sát trực tiếp bản live, không có số px tuyệt đối. Chưa Android thật.
- nextTask: Bài 9 khi Hoa nói "Tiếp tục" (áp dụng D17/D19/D20/D22/D23/D24/D25).
