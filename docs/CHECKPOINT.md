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

## Vòng sửa lỗi nút Tiếp tục ở mục Bắt đầu — D26 (2026-11-02)

- Báo cáo thiết bị thật của Hoa (Android, kèm ảnh): nút "Tiếp tục học" trong khối Lộ trình ở mục Bắt đầu Bài 8 không phản ứng. Đã tái hiện đúng trạng thái: đích của nút là chính route intro đang mở (mở trang ghi lastSectionId=intro, công thức đích cũ lấy đúng mục đó) → liên kết cùng hash, không đổi trang.
- Sửa (quy tắc D26): khối Lộ trình nhận biết mục đang chứa nó; trong trang mục, đích là mục chưa hoàn thành tiếp theo (xong hết → mục cuối), không bao giờ tự liên kết; trang tổng quan giữ nghĩa resume theo lastSectionId. Test hồi quy thao tác qua giao diện thật (kho tiến độ có cache nên không ghi thẳng localStorage được).
- QA code độc lập ĐẠT 5/5 (script jsdom riêng); lưu ý 1 lần test mới chập chờn vì chờ ngắn sau cú bấm → đã đổi sang chờ có thăm dò, chạy lại file test 5 lần đều 14/14, toàn bộ 117/117.
- Phát hành: PR #54 merge 28a0e0fa; contentVersion 20261102-lesson8-continue1; byte remote 8/8 + live 3/3 khớp. Nghiệm thu live: bấm nút 2 lần từ trang Bắt đầu đều chuyển sang Từ cần biết (Mục 2/7), không kẹt.
- nextTask: Bài 9 khi Hoa nói "Tiếp tục" (áp dụng D17/D19/D20/D22/D23/D24/D25/D26).

## Vòng đưa chuẩn Bài 8 vào hệ thống + chuẩn hoá Bài 1 — D27 (2026-11-02)

- Chỉ đạo của Hoa: Bài 8 là chuẩn cho toàn dự án (không cần duyệt lại mẫu). Thứ tự mới: (GĐ1) lưu chuẩn vào hệ thống → (GĐ2) chuẩn hoá Bài 1→Bài 8 theo thứ tự → (GĐ3) sau khi bài cũ đạt chuẩn mới làm bài mới. Quyết định D27 trong DECISIONS.
- Giai đoạn 1: docs/LESSON_STANDARD.md (chuẩn đầy đủ + điều kiện hoàn thành + cơ chế phát hành/tiếp tục), liên kết từ AGENTS.md mục 11 và CONTENT_STANDARD; scripts/audit-standard.mjs in bảng phù hợp cơ giới từng bài (lộ trình, nhóm từ, Thử ngay, tổng kết, độ phủ tra từ, 3 khu bài tập).
- Bài 1 nâng cấp theo chuẩn: thêm tên riêng 王老师 (thiếu hẳn) → 12 từ + 1 tên riêng; prepGroups 3 nhóm + prepSummaryVi; learningPath 6 bước; useWhenVi + quickCheck cho 3 điểm chính; summaryPoints; tra từ mở cho Bài 1 (baseLexicon gồm từ vựng pilot; extras 小语; phủ 20/20); bổ sung bài đọc vè 跟读绕口令 còn thiếu (KP nền tảng + nút nghe track gốc 1-7, thời lượng đo từ file thật) và 4 nhóm thanh điệu còn thiếu (đủ 8/8); apply chuyển sang 2 nhiệm vụ đóng vai (câu mẫu toàn bộ Hội thoại 2/3, có tra từ). Sửa dùng chung: nhãn đếm nhóm từ tính từ dữ liệu (Bài 8 nhóm 3 sửa thành "6 từ + 1 tên riêng"), bỏ câu cứng "Ba nhiệm vụ" của khối Tự nói, nút nghe track ở cấp điểm kiến thức.
- QA D17 hai vòng khép trong nhánh: nội dung v1 — 2 TB (gắn sai 您 vào Hội thoại 1; thiếu đọc vè) + 1 Nhẹ (thiếu 4 nhóm thanh) → sửa hết → v2 ĐẠT 4/4; code v1 — Tự nói Bài 1 lệch cấu trúc tra từ + công thức độ phủ của audit hẹp hơn phạm vi công bố → sửa hết → v2 ĐẠT 4/4 (12/12). Test 127/127, validator OK.
- Phát hành: PR #56 merge 52ef95a7; contentVersion 20261102-lesson1-standard1; byte remote 16/16 + live khớp; nghiệm thu live bổ sung ở QA_REPORT.
- Trạng thái chuẩn hoá từng bài: Bài 1 = ĐẠT CHUẨN D27; Bài 2–7 = CHƯA chuẩn hoá; Bài 8 = bài chuẩn mẫu (đạt, chỉ kiểm hồi quy khi có thay đổi dùng chung).
- nextTask: "Tiếp tục" → chuẩn hoá Bài 2 《你是哪国人》 theo LESSON_STANDARD (kiểm kê PDF TB in 005–008 + WB in 005–008 gồm ô trợ giúp/câu hỏi mở/hoạt động/汉字； QA D17; PR riêng). Lần lượt Bài 3→7; khi Bài 1–8 đều đạt chuẩn mới làm Bài 9.

## Chuẩn hoá Bài 2 — D27 (2026-11-02)

- Bài 2 《我叫李文》 ĐẠT CHUẨN D27: PR #58 merge 2283255f; contentVersion 20261102-lesson2-standard1; byte remote khớp local; test 132/132.
- Đối chiếu TB in 005–009 + WB in 005–008: nội dung cũ phần lớn đã đúng (15 từ, 10 câu, 5 điểm chính gồm cả 3 ô trợ giúp trong giải thích, 16 thẻ hình, đáp án hình 3/1/4/2, 3 bài nghe–viết). Sửa 3 điểm: bổ sung bài đọc vè + track 2-7 còn thiếu hẳn (22,969s); thêm câu luyện đọc 我是学生。vào KP trật tự từ; sửa liên kết ôn tập câu hình 1 (trật tự từ → KP 叫/giới thiệu).
- Nâng cấp: learningPath 6 bước; prepGroups 6/5/4; quickCheck + useWhen cho 5 điểm chính; summaryPoints 3; apply.tasks 2 nhiệm vụ; tra từ mở cho Bài 2 (extras 4 tên người + 学生； phủ 27/27). Sách không có mục tên riêng riêng và không có câu hỏi đọc hiểu in sẵn ở Bài 2 — không bịa thêm.
- QA độc lập MỘT vòng đạt ngay trên bản cuối: nội dung 8/8 (0 lỗi), code 7/7 (23/23). Bài học schema (đã ghi ở QA_REPORT): quickCheck answer là chỉ số dạng chuỗi; dialogueGroup từ 1; learningPath là mảng bước — Bài 3 trở đi đọc schema từ dữ liệu mẫu trước khi viết.
- Trạng thái chuẩn hoá: Bài 1 ĐẠT, Bài 2 ĐẠT; Bài 3–7 chưa; Bài 8 chuẩn mẫu.
- nextTask: "Tiếp tục" → chuẩn hoá Bài 3 《我是中国人》 theo LESSON_STANDARD (kiểm kê PDF TB + WB của Bài 3 gồm ô trợ giúp/câu hỏi mở/hoạt động/汉字 nếu có; QA D17; PR riêng). Lần lượt Bài 4→7; Bài 9 sau khi Bài 1–8 đạt chuẩn.

## Chuẩn hoá Bài 3 — D27 (2026-11-02)

- Bài 3 《我是中国人》 ĐẠT CHUẨN D27: PR #60 merge a39697cb; contentVersion 20261102-lesson3-standard1; test 137/137; QA một vòng đạt ngay (nội dung 8/8, code 7/7).
- Đối chiếu TB in 010–016 + WB in 009–012. Bổ sung: 4 tên riêng sách liệt kê theo hội thoại （中国/法国/中文/泰国 — dữ liệu cũ thiếu hẳn); bài đọc vè + track 3-7 (tr.016, 23,647s đo từ file tải qua URL CDN vì nguồn cục bộ chỉ có tới 3-6); 2 cụm luyện đọc lược 的 （我学生/你同学）; toàn bộ 综合练习 TB tr.015: 5 câu điền từ khung 哪/吗/谁/中国人/想 (đáp án verified-editorial; câu 3 tách hai câu hỏi) + bài Dùng hình để nói tự luyện với 2 tranh phẳng vẽ mới (assets/lesson-03/describe-*.webp, truy vết ở SOURCE_AUDIT).
- Nâng cấp: learningPath; prepGroups 2+3/6+1/10; quickCheck 3 điểm chính; summaryPoints; apply.tasks 2 nhiệm vụ; tra từ Bài 3 (extras 一飞/白家月； phủ 32/32).
- Bài học quy trình: connector push-files CHỈ đẩy được file văn bản UTF-8; file nhị phân (WebP) phải tải qua giao diện web GitHub rồi đối chiếu sha1 blob/sha256 — bản thử create_or_update_file với base64 đã lưu nhầm văn bản base64, phải ghi đè và kiểm bằng git blob SHA (raw.githubusercontent có thể phục vụ bản cache cũ). Test DOM: render trang prep hoàn tất bất đồng bộ — phải thăm dò phần tử đích.
- Trạng thái chuẩn hoá: Bài 1, 2, 3 ĐẠT; Bài 4–7 chưa; Bài 8 chuẩn mẫu.
- nextTask: "Tiếp tục" → chuẩn hoá Bài 4 《你今年多大》 theo LESSON_STANDARD (kiểm kê PDF TB + WB của Bài 4 gồm tên riêng/ô trợ giúp/bài tổng hợp/汉字 nếu có; QA D17; PR riêng). Lần lượt Bài 5→7; Bài 9 sau khi Bài 1–8 đạt chuẩn.

## Vẽ lại hình Bài 1–3 theo chuẩn Bài 8 (2026-11-02, chỉ đạo riêng của Hoa)

- PR #62 merge fa670bfe; contentVersion 20261102-img-redraw-l123. Toàn bộ 14 file hình vốn là ảnh trích sách ở Bài 1–3 (11 hình bài chọn hội thoại + 3 hình ngữ cảnh classroom.webp) đã thay bằng tranh minh họa phẳng vẽ mới: 4 tờ lưới 2×2 → cắt lẻ 760×760 → đối chiếu trực quan từng cảnh. Chú thích/alt đã đổi khỏi "Hình gốc"; ATTRIBUTION.md của 3 bài viết lại; SOURCE_AUDIT + QA_REPORT đã ghi. QA hình ảnh độc lập ĐẠT 14/14 (0 hình gây nhầm đáp án; 3 ghi chú nhẹ đã lưu). File nhị phân tải qua web GitHub, đối chiếu git blob SHA 14/14 và sha256 trên Pages.
- Bài 4–7 vẫn còn ảnh trích sách (chưa có chỉ đạo vẽ lại). nextTask chuẩn hoá D27 không đổi: Bài 4 《你今年多大》.

## Áp dụng mức hình đẹp mới cho các bài còn lại (2026-11-02)

- Hoa duyệt áp dụng mức hoàn thiện của bộ hình Bài 7 images2 cho Bài 1–6 và 8. Kiểm kê trực tiếp từng bộ hình hiện tại: Bài 1 (4 hình), Bài 2 (5), Bài 3 (7), Bài 4 (11) và Bài 8 (28) vốn đã là minh họa chi tiết có khuôn mặt/bối cảnh — ĐẠT mức mới, không vẽ lại (vẽ lại bằng công cụ hiện có chỉ làm giảm chất lượng). Chỉ Bài 5 và Bài 6 còn ở mức người que/khối trừu tượng.
- Bài 5 ĐÃ VẼ LẠI + PHÁT HÀNH: 11/11 hình (cảnh: minh họa sinh mới theo ảnh gốc tr.032–033; lịch/khối gỗ: vẽ bằng chương trình, lưới ngày tính từ lịch thật). QA hình độc lập 11/11 ĐẠT (lịch kiểm từng vị trí bằng lịch thật). PR #76; contentVersion live `20261102-lesson5-images2`; sha256 live 11/11 khớp; kiểm trực quan live 2/2.
- Bài 6 ĐÃ VẼ LẠI + PHÁT HÀNH: 11/11 hình minh họa sinh mới theo ảnh gốc tr.036/041–042 (siêu thị và taxi dùng chung cho cặp file cùng khái niệm ở hai bộ câu hỏi). QA hình độc lập 11/11 ĐẠT. PR #78 (live `20261102-lesson6-images2`, byte 11/11 khớp) — kiểm trực quan live bắt được hình ngữ cảnh sai bố cục đối diện, đã sửa và phát hành PR #79 (live `20261102-lesson6-images3`, kiểm lại trực quan ĐẠT). **Vòng hình ảnh kết thúc: cả 8 bài đều ở mức hình đẹp mới.**
- **KIỂM HỒI QUY BÀI 8 ĐÃ XONG (2026-11-02):** audit chuẩn đạt mọi cột cho cả 8 bài; test 159/159; kiểm nhanh live 5/5 ĐẠT (lộ trình, nhóm từ + loa, nút Tiếp tục D26, tra từ, bài tập 19 + mô phỏng 20 tách riêng, tổng kết). Không có lỗi hồi quy. **CHẶNG D27 HOÀN TẤT.**
- **BÀI 9 《我明天上午在学校学习》 ĐÃ XÂY XONG THEO CHUẨN (2026-11-02):** TB tr. in 061–069, WB tr. in 057–059 (chỉ có phát âm + Hán tự, không có phần 听读练）; 14 câu/3 hội thoại, 23 từ (5/7/11), 3 điểm chính + 1 nền tảng Hán tự, 19 câu chính, 3 bài tự luyện, tra từ 30/30, 11 hình mới; QA độc lập ĐẠT 7/7 mục, test 164/164. Đã phát hành: PR #82 (bản đầu `20261102-lesson9-standard1`), nghiệm thu live 5/5; kèm PR #83 sửa nhãn dùng chung của khối Tổng kết, live hiện tại `20261103-summaryheading1`.
- nextTask: **Bài 10 《这儿的苹果真便宜！》** — theo chỉ mục nguồn: Textbook tr. in 070–077 (PDF 085–092), Workbook tr. in 066–068; xây theo chuẩn Bài 8 như các vòng trước.
- **BÀI 10 《这儿的苹果真便宜！》 ĐÃ PHÁT HÀNH (2026-11-03):** TB tr. in 070–077, WB tr. in 066–068 (chỉ phát âm + Hán tự； track WB 10-2 thuộc phần mô phỏng, không dùng theo D15). Nội dung: 16 câu/3 hội thoại, 23 từ (7/6/10), 3 điểm chính （钱数的表达 kèm bảng đọc 6 số tiền; 形容词谓语句； 疑问代词“怎么样”) + nền tảng Hán tự (3), 20 câu chính (6 khởi động + 4 nghe hiểu + 5 điền từ + 5 phân biệt thanh điệu theo dấu in sẵn), 3 bài tự luyện, tra từ 34/34, 11 hình mới. QA độc lập 3 vòng khép trong nhánh: vòng 1 bắt 1 lỗi đáp án nghiêm trọng (wb10-tone-2 — đọc nhầm dấu thanh ở ảnh 100 DPI; sách in xiě/chá/jiě, đáp án đúng là chá; phân xử bằng render 300 DPI) + phát hiện courseTagsVi sót nhãn Bài 7 ở cả Bài 10 và Bài 9 (đã sửa cả hai) — vòng 2 đạt 2/3, vòng 3 đạt điểm dấu câu cuối. Test 169/169; PR #85 merge a5a8a960; nghiệm thu live 5/5 đạt (gồm chấm thử chính câu wb10-tone-2 đã sửa — chọn chá được chấm Đúng), byte dữ liệu + 11/11 hình khớp; live `20261103-lesson10-standard1`. Bài học: đáp án suy từ dấu thanh in phải kiểm ở bản render độ phân giải cao (300 DPI) khi dấu hỏi/dấu sắc dễ nhầm.
- nextTask: **Bài 11 《我读大学呢》** — theo chỉ mục nguồn: Textbook tr. in 078–085 (PDF 093–100); Workbook tra khoảng tương ứng khi bắt đầu vòng; xây theo chuẩn Bài 8 như các vòng trước. Tiến độ cấp 1: 10/15 bài.
- **SỬA LỖI NÚT NGHE CÂU NGHE HIỂU (2026-11-03, Hoa báo trên iOS):** câu 7/20 Bài 10 (nghe hiểu Hội thoại 2) không có nút phát audio. Nguyên nhân: cả 24 câu "Câu hỏi nghe hiểu" của Bài 5–10 đều thiếu trường `audioSegment` nên renderer không hiện nút nghe (chỉ bộ mô phỏng Bài 8 có). Đã gắn đoạn hội thoại chứa đáp án cho cả 24 câu (mốc asr-draft từ đoạn câu ở mục Nghe & đọc); kiểm chứng độc lập 24/24 ánh xạ ĐẠT; thêm tests/listenseg.test.mjs khoá hồi quy (mọi câu nghe hiểu phải có đoạn phát được); test 170/170. PR #87 merge 663f9cb7; live `20261103-listenbtn1`; nghiệm thu live tại đúng câu Hoa báo: nút "▶ Nghe đoạn của câu này" hiện và phát đúng đoạn Hội thoại 2. Các câu phân biệt thanh điệu/phát âm (đáp án theo dấu in sẵn) không gắn đoạn vì ASR của track Workbook không đủ tin cậy để cắt đoạn từng nhóm — giữ nguyên thiết kế đã ghi ở SOURCE_AUDIT.

## Vẽ lại hình Bài 7 đẹp hơn — yêu cầu của Hoa (2026-11-02)

- Hoa nhận xét bộ hình Bài 7 bản standard1 "quá sơ sài", yêu cầu xem lại PDF gốc và mô phỏng đẹp hơn. Đã vẽ lại cả 11 hình với độ hoàn thiện cao hơn: đồng hồ đủ số 1–12 + vạch 60 phút + kim hình thoi + bóng đổ/bóng kính; hình ngữ cảnh có khuôn mặt đầy đủ, trang phục đúng nhân vật tr.046, nền hồng chia chéo đúng gốc (bản trước chia dọc); hình bài nói có đủ bối cảnh (tay ấn nóc đồng hồ báo thức, cảnh đêm trăng sao, kim giây đỏ như gốc). Giờ trên đồng hồ không đổi (đặt bằng phép tính góc) — đáp án giữ nguyên.
- QA hình độc lập: 11/11 ĐẠT (tự đọc kim cả 10 đồng hồ khớp kỳ vọng; speaking-1 ngón tay che số 11–12 là trung thực theo ảnh gốc, không ảnh hưởng đáp án). Test 159/159. PR #74 merge 779c9493; contentVersion live `20261102-lesson7-images2`; sha256 11/11 hình khớp bản local.
- Bài học: bản vẽ v1 đạt chuẩn "đúng đáp án" nhưng chưa đạt kỳ vọng thẩm mỹ của Hoa — từ nay hình vẽ mới phải đạt mức hoàn thiện của bộ images2 này (đủ chi tiết nhận diện của cảnh gốc, nhân vật có khuôn mặt, nền có bối cảnh) ngay từ vòng đầu.

## Chuẩn hoá Bài 7 — D27 (2026-11-02)

- Bài 7 《我晚上六点半下班》 ĐẠT CHUẨN D27: PR #72; contentVersion 20261102-lesson7-standard1; test 159/159; QA nội dung ĐẠT toàn bộ (10 mục + mục kiểm thêm), code ĐẠT 4/4, hình 11/11 — đạt ngay một vòng QA; nghiệm thu live: sha256 11/11 hình khớp + phiên bản đúng + kiểm trực quan 3/3.
- Đối chiếu TB tr.045–053 + WB tr.039–041. Đề mô phỏng WB từ tr.042 loại theo D15; bài đọc 汉字简介 (WB tr.040–041) và video bonus 学汉字 (TB tr.053) không tích hợp — quyết định phạm vi, ghi ở SOURCE_AUDIT; bài hoàn thành đối thoại tr.050 không chuyển thành câu chấm vì đáp án không duy nhất.
- Bổ sung: dialogueGroup 9/8/10 cho 27 từ; prepGroups (track 7-2/7-4/7-6); learningPath; useWhen + quickCheck cho cả 4 điểm chính; KP giờ đủ bộ luyện đọc tr.047; 2 câu đọc hiểu tr.051; 6 câu khởi động nối giờ – đồng hồ tr.045; bài nói theo hình có đáp án gợi ý (giờ đọc trực tiếp trên ảnh gốc phóng to 7:20/10:10/9:00 tối/2:00 chiều); apply thêm nhiệm vụ hoạt động lớp tr.053; summaryPoints 4; tra từ phủ 38/38.
- Hình: 11 tranh vẽ mới; 6 đồng hồ khởi động kim đặt bằng phép tính góc theo giờ đọc trên bản phóng to; 5 file cũ là ẢNH TRÍCH SÁCH (classroom, speaking-1..4) đã thay toàn bộ bằng tranh vẽ, giữ nguyên tên file.
- Test toàn cục đã cập nhật theo trạng thái mới: từ vòng này mọi bài 1–8 đều có tra từ và lộ trình (không còn bài "chưa chuẩn hoá" làm đối chứng) — các test đối chứng cũ đã viết lại trung thực.
- Trạng thái chuẩn hoá: **Bài 1–7 ĐẠT; Bài 8 chuẩn mẫu. Chặng chuẩn hoá D27 hoàn tất phần bài cũ.**
- nextTask: "Tiếp tục" → kiểm hồi quy Bài 8 (audit chuẩn + test toàn bộ + kiểm nhanh live các luồng chính của Bài 8 trên phiên bản hiện tại), chốt chặng D27; sau đó mới làm Bài 9 (xác minh tên/trang từ mục lục và sách thật trước khi làm).

## Chuẩn hoá Bài 6 — D27 (2026-11-02)

- Bài 6 《你的手机号是多少？》 ĐẠT CHUẨN D27: PR #70 merge e79e182f; contentVersion 20261102-lesson6-standard1; test 154/154; QA nội dung 10/10 + code 5/5 + hình 11/11, đạt ngay một vòng QA; nghiệm thu live: byte 11/11 hình khớp + dữ liệu đủ + phiên bản đúng.
- Đối chiếu TB tr.035–042 + WB tr.031–032. Khối tổng kết Bài 4–6 (TB tr.043–044) là bảng tự đánh giá liên bài — không thuộc nội dung riêng của Bài 6, không đưa vào app.
- Bổ sung: dialogueGroup 3/9/10 + tên riêng 西安饭店 (tr.040, dữ liệu cũ thiếu hẳn); prepGroups (track 6-2/6-4/6-6); learningPath; useWhen + quickCheck 3 điểm chính; KP nhi hóa đủ 7 từ bảng in; 2 câu đọc hiểu tr.039; 6 câu khởi động; apply thêm nhiệm vụ hoạt động lớp tr.042; summaryPoints 4 (gồm cách đọc số điện thoại, 1 đọc yāo); tra từ phủ 30/30.
- Hình: 11 tranh vẽ mới theo ảnh gốc; 5 file cũ là ẢNH TRÍCH SÁCH (classroom, speaking-1..4) đã thay toàn bộ bằng tranh vẽ, giữ nguyên tên file.
- Sự cố quy trình: lần đẩy đầu tiên của vòng này hết hạn chờ duyệt phía người dùng nên không thành; đã kiểm trạng thái remote trước khi đẩy lại (không tạo nhánh trùng).
- Trạng thái chuẩn hoá: Bài 1, 2, 3, 4, 5, 6 ĐẠT; Bài 7 chưa; Bài 8 chuẩn mẫu.
- nextTask: "Tiếp tục" → chuẩn hoá Bài 7 《我晚上六点半下班》 theo LESSON_STANDARD (TB tr.045–052 + tr.053 hoạt động lớp; WB tr.039–041 — phạm vi đã đính chính ở vòng xây Bài 7 trước đây). Sau Bài 7: kiểm hồi quy Bài 8, rồi mới làm Bài 9.

## Chuẩn hoá Bài 5 — D27 (2026-11-02)

- Bài 5 《今天我休息》 ĐẠT CHUẨN D27: PR #67 merge 168b33ba (+ PR #68 sửa trường contentVersion trong data bị sót do thứ tự ghi file); contentVersion 20261102-lesson5-standard1; test 148/148; QA 2 vòng đạt; nghiệm thu live: byte 11/11 hình khớp + dữ liệu đủ + phiên bản đúng.
- Đối chiếu TB tr.027–034 + WB tr.022–024 (khối WB tr.025–030 là đề mô phỏng, D15 không đưa vào).
- Bổ sung: dialogueGroup 8/7/7; prepGroups (track 5-2/5-4/5-6); learningPath; useWhen + quickCheck 3 điểm chính; bảng tháng 1–12 + bảng thứ nguyên bản vào KP Thời gian; 2 câu đọc hiểu tr.032; 6 câu khởi động + 6 tranh mới; 2 bài tự luyện biến điệu WB tr.024; bài dùng hình để nói 4 tranh mới + đáp án gợi ý kiểm chứng bằng lịch thật; apply thêm trò chơi nhóm tr.034; summaryPoints 4; tra từ phủ 50/50.
- QA bắt và đã sửa 2 lỗi thật trước phát hành: ví dụ 一口 ghi sai thanh (yí → yì kǒu, 口 là thanh 3) và hình lịch tháng 9 lệch một cột (ngày 7 phải ở cột Chủ nhật). Bài học: khi tự dựng lịch/ví dụ biến điệu phải kiểm chứng bằng lịch thật và quy tắc thanh của chính âm tiết đi kèm.
- Trạng thái chuẩn hoá: Bài 1, 2, 3, 4, 5 ĐẠT; Bài 6–7 chưa; Bài 8 chuẩn mẫu.
- nextTask: "Tiếp tục" → chuẩn hoá Bài 6 《你的手机号是多少？》 theo LESSON_STANDARD (kiểm kê PDF TB + WB của Bài 6 gồm tên riêng/ô trợ giúp/bài tổng hợp/汉字 nếu có; QA D17; PR riêng). Sau đó Bài 7; Bài 9 sau khi Bài 1–8 đạt chuẩn.

## Chuẩn hoá Bài 4 — D27 (2026-11-02)

- Bài 4 《我有两个孩子》 ĐẠT CHUẨN D27: PR #65 merge 9d77dd42; contentVersion 20261102-lesson4-standard1; test 142/142; QA 2 vòng đạt (nội dung 13/13, hình 11/11, vòng 2 sau sửa 5/5); nghiệm thu live: byte 11/11 hình khớp + dữ liệu đủ.
- Đối chiếu TB tr.018–026 + WB tr.013–015 (khối WB tr.016–021 là đề mô phỏng, D15 không đưa vào). Tên bài đúng theo giáo trình là 《我有两个孩子》 — checkpoint cũ ghi 《你今年多大》 là sai (tên của giáo trình khác), đã sửa từ vòng này.
- Bổ sung: dialogueGroup 3/10/8; prepGroups (track 4-2/4-4/4-6); learningPath; useWhen + quickCheck 4 điểm chính; 52 ví dụ đọc số nguyên bản của sách vào KP Số; cụm luyện đọc KP Lượng từ; 2 câu đọc hiểu tr.025; 5 câu điền từ tổng hợp; 6 câu khởi động + 6 tranh mới; 3 bài tự luyện WB tr.015 còn thiếu; bài dùng hình để nói với 4 tranh mới (gia đình gốc 6 người — đếm trực tiếp); apply 2 nhiệm vụ; summaryPoints 4; tra từ phủ 84/84 (extras tên nhân vật + chữ số). Hình ngữ cảnh thay tranh vẽ mới theo ảnh tr.019.
- Sửa lỗi DÙNG CHUNG (QA vòng 1 bắt): đầu trang Luyện tập in cứng văn bản Bài 8 cho mọi bài ("gồm 3 phần… dùng 在 và 能") → renderer nay lấy số phần + noteVi theo từng bài; hồi quy Bài 8/Bài 5 đạt.
- Trạng thái chuẩn hoá: Bài 1, 2, 3, 4 ĐẠT; Bài 5–7 chưa; Bài 8 chuẩn mẫu.
- nextTask: "Tiếp tục" → chuẩn hoá Bài 5 《今天我休息》 theo LESSON_STANDARD (kiểm kê PDF TB + WB của Bài 5 gồm tên riêng/ô trợ giúp/bài tổng hợp/汉字 nếu có; QA D17; PR riêng). Lần lượt Bài 6→7; Bài 9 sau khi Bài 1–8 đạt chuẩn.

## Hiệu chỉnh hình Bài 1–3 theo ảnh gốc PDF (2026-11-02, PR #63)

- Hoa yêu cầu xem ảnh trong PDF gốc và mô phỏng lại cho đúng: đã đối chiếu WB tr.004/008/012 + TB tr.002/005/010, vẽ lại 13/14 hình theo đúng bố cục ảnh gốc (giữ hình ngữ cảnh Bài 3), alt viết lại theo cảnh thật. PR #63 merge fabf4cbf; contentVersion 20261102-img-faithful-l123; QA trung thực độc lập ĐẠT 14/14 (6 lệch nhỏ đã ghi ở QA_REPORT, không đổi đáp án); nghiệm thu live: sha256 13/13 file trên Pages khớp bản local.

## D28 — Câu hỏi của hội thoại nằm tại hội thoại (2026-11-03)

- Hoa chỉ đạo sau khi gặp câu nghe hiểu Hội thoại 2 của Bài 10 ở mục Luyện tập: câu hỏi của đoạn hội thoại để ở hội thoại, xoá khỏi phần Luyện tập. Quyết định ghi tại docs/DECISIONS.md D28; chuẩn cập nhật ở docs/LESSON_STANDARD.md + docs/CONTENT_STANDARD.md mục 6.0.
- Đã phát hành: PR #89 merge 18f8b997; contentVersion live 20261103-dialoguechecks1. Chuyển 36 câu nguyên vẹn (đáp án/lựa chọn/audioSegment) sang reader.passages[].checkItems: Bài 4–7 mỗi bài 6 câu (Hội thoại 2: 2; Hội thoại 3: 4), Bài 8–10 mỗi bài 4 câu. Bộ chính còn: Bài 4–7 = 11, Bài 8–9 = 15, Bài 10 = 16 câu; tổng câu chấm tự động mỗi bài không đổi.
- Chấm tại chỗ ở Nghe & đọc dùng chung session/attempts theo mã câu hỏi — tiến độ làm từ trước D28 giữ nguyên; Tổng kết + Tiến độ tính gồm câu tại hội thoại; Ôn tập trỏ về reader?passage; deep link exercises?item= của câu đã chuyển tự sang hội thoại. Validator + audit-standard tính cả hai nơi chứa.
- Kiểm thử: validator OK; test 175/175 (thêm tests/dialoguechecks.test.mjs: trạng thái cũ mang sang, chấm tại chỗ ghi attempt, Tổng kết tính gộp, Ôn tập trỏ đúng; listenseg viết lại theo vị trí mới — 24 câu nghe hiểu có đoạn hợp lệ, 36 câu tại hội thoại). QA độc lập ĐẠT 4/4 (dữ liệu/mã/test/DOM Bài 10+4+8, 20/20 khẳng định).
- Nghiệm thu live: 4/5 ĐẠT trực tiếp (khối câu hỏi + nút nghe đoạn ở Bài 10 Hội thoại 2; phản hồi Đúng tại chỗ — câu này hồ sơ trình duyệt đã làm từ lượt kiểm listenbtn ở mục Luyện tập trước D28 và trạng thái mang sang đúng thiết kế; Luyện tập hiện "Câu 1/16" + dòng "Câu hỏi của hội thoại — 4 câu"; Bài 4 Hội thoại 3 có đủ 4 câu). Điểm 5 (Tổng kết hiện đúng 1/1) không áp dụng được vì hồ sơ trình duyệt dùng chung đã có sẵn tiến độ Bài 10 từ các lượt kiểm trước — trang hiện "14/17 (gồm cả câu hỏi tại các hội thoại...)" đúng định dạng và đúng cách tính gộp; phép tính gộp đã chứng minh bằng test jsdom có trạng thái kiểm soát (2/3). Lần mở đầu qua điều hướng SPA còn bản cache cũ, tải lại thì bản mới hiện đầy đủ.
- nextTask: Bài 11 《我读大学呢》 (TB tr. in 078–085 = PDF 093–100; WB tra khoảng tương ứng khi bắt đầu) — biên soạn theo chuẩn Bài 8 + D28 ngay từ đầu (câu hỏi của hội thoại đặt tại hội thoại).

## Bài 11 — 我读大学呢 (2026-11-03)

- branch: lesson-11-standard1 → PR #91, merge 231df043; contentVersion live 20261103-lesson11-standard1 (content.json trên URL thật khớp byte bản local, sha256 878f2cd3…).
- Phạm vi: TB in 078–085 / WB in 075–077 (mô phỏng 078–083 loại theo D15; track WB 11-2 thuộc phần mô phỏng nên không dùng). 25 từ (7/6/12) + HV 25/25, 4 KP （正反问 / 在·正在…呢 / 要 + nền 汉字书写（四）: 5 nét móc + quy tắc 先外后里，再封口）, 14 câu/3 hội thoại, 7 track. Xây theo D28 ngay từ đầu: 4 câu nghe hiểu nằm tại Hội thoại 2 và 3 kèm audioSegment; bộ chính 16 câu (6 khởi động nối hình + 5 điền từ + 5 phân biệt thanh điệu WB, đáp án thanh điệu kiểm ở render 300 DPI — nhóm 1 nhãn đúng là mǎi). Hình: 11 WebP vẽ mới ở assets/lesson-11/ (tải qua web GitHub, đối chiếu git blob SHA khớp 11/11).
- Kiểm thử: validator OK; audit-standard đạt mọi cột (tra từ 35/35); test 180/180 (thêm tests/lesson11standard.mjs 5 test gồm chấm tại hội thoại; bộ đếm toàn cục cập nhật: câu có đoạn 135→149, từ 213→238, lựa chọn bộ chính 520→596, câu tại hội thoại toàn dự án 36→40).
- QA độc lập D17 khép trong nhánh: vòng 1 mọi mảng ĐẠT (hội thoại/từ/HV/KP/đáp án 20 câu/hình 11/grammarIds/test), 1 lỗi duy nhất — pinyin dữ liệu "hòubianr" lệch bản in "hòubian" （后边 không 儿 hoá) ở 3 vị trí → đã sửa cả 3; vòng kiểm lại độc lập ĐẠT (quét 0 "hòubianr", render 300 DPI tr.079 xác nhận). Báo cáo: hồ sơ QA Bài 11 (mục 8 + mục kiểm lại trong QA_REPORT).
- Nghiệm thu live 5/5 ĐẠT: Bài 11 "Sẵn sàng học" + lộ trình 6 bước + hình ngữ cảnh; nhóm từ 7/6/12 và phát track nhóm chạy; Hội thoại 2 có khối câu hỏi tại chỗ (2 câu, nút đoạn 0:03–0:07, ẩn Pinyin trước chấm, chọn 在 chấm Đúng, điểm hội thoại 1/1); Luyện tập hiện "Câu 1/16" + ghi rõ thang 20 = 16 chính + 4 hội thoại; Tổng kết tính gộp câu tại hội thoại (1/1 từ chính lượt kiểm). Lưu ý trung thực: bản ghi nghiệm thu có một dòng liệt kê lựa chọn không khớp dữ liệu (ghi 在/想/要/没有 thay vì 不/没/在） — đã đối chiếu content.json live khớp byte bản local và lựa chọn đúng là 不/没/在， các bằng chứng chức năng còn lại (mốc đoạn, chấm Đúng, điểm 1/1) đều khớp dữ liệu thật.
- Giới hạn giữ nguyên: mọi mốc audio asr-draft chưa nghe kiểm chứng bởi người (hai mốc từ 时候/医 xác định theo vị trí vì ASR chép đồng âm); quyền sách/audio unknown; CI GitHub Actions vẫn chưa tạo được (403) — bản bàn giao docs/ci/ci.yml; kiểm tra là trình duyệt giả lập, chưa phải thiết bị thật của Hoa.
- nextTask: Bài 12 《昨天下雪了》 (TB tr. in 086–094 = PDF 101–109; WB phần bài học tr. in 084–086, tra khi bắt đầu) — xây theo chuẩn Bài 8 + D28. Tiến độ cấp 1: 11/15 bài.

## Bài 12 — 昨天下雪了 (2026-11-03)

- branch: lesson-12-standard1 → PR #93, merge 85214879; contentVersion live 20261103-lesson12-standard1 (content.json trên URL thật khớp byte bản local, sha256 3a7ed579…).
- Phạm vi: TB in 086–094 / WB in 084–086 (mô phỏng 087–092 loại theo D15; track WB 12-2 thuộc phần mô phỏng nên không dùng). 24 từ (9/6/9) + HV 24/24, 4 KP (câu không chủ–vị / trợ từ ngữ khí "了（1）" / mẫu "太……了" + nền 汉字书写（五）: 4 nét gập móc + quy tắc 先中间后两边）, 14 câu/3 hội thoại, 7 track. Điểm khác các bài trước: CẢ BA hội thoại đều in dạng nghe–chọn đáp án nên có 6 câu hỏi tại hội thoại theo D28 (mỗi hội thoại 2 câu, kèm audioSegment); Workbook không có bài đánh dấu thanh điệu — thay bằng bài 听音节，匹配词语 (6 câu nghe – nối âm tiết, ánh xạ xác định duy nhất từ bản in nên chấm tự động verified-editorial, không cắt đoạn riêng từng âm tiết). Bộ chính 21 câu (6 khởi động + 5 điền từ + 4 phân biệt thanh điệu, đáp án thanh điệu kiểm ở render 300 DPI: 2/1/2/3). Bảng tổng kết liên bài 10–12 ở cuối TB loại khỏi bài theo tiền lệ. Hình: 11 WebP vẽ mới ở assets/lesson-12/ (tải qua web GitHub, đối chiếu git blob SHA khớp 11/11).
- Audio căn đoạn: câu bằng ASR mức từ; ba track từ mỗi từ đọc HAI lần — mốc từ theo ranh giới khoảng lặng của lần đọc đầu (tiền lệ Bài 8); 了/雨 (nhóm 1) ASR không chép được nên xác định theo vị trí + khoảng lặng; 雪/药 ASR chép đồng âm, xác định theo vị trí.
- Kiểm thử: validator OK; audit-standard đạt mọi cột (tra từ 32/32); test 185/185 (thêm tests/lesson12standard.mjs 5 test gồm chấm tại Hội thoại 1; bộ đếm toàn cục: câu có đoạn 149→163, từ 238→262, lựa chọn bộ chính 596→705, câu tại hội thoại toàn dự án 40→46, câu nghe hiểu có đoạn 28→34).
- QA độc lập D17 khép trong nhánh: vòng 1 mọi mảng ĐẠT (hội thoại/từ/HV/KP/đáp án 27 câu/hình 11/grammarIds/độ phủ gồm 2 ô 小语助力), 1 lỗi duy nhất — câu mô tả ở summaryPoints ghi sai "Cả ba hội thoại của bài đều dùng 太冷了" (mẫu chỉ có ở Hội thoại 2; Hội thoại 1 chỉ có 不太好） → đã sửa; vòng kiểm lại độc lập ĐẠT (quét 14 câu xác nhận, test hồi quy 5/5). Báo cáo: hồ sơ QA Bài 12.
- Nghiệm thu live: nội dung chính ĐẠT (phiên bản hiển thị đúng ở chân trang; Bài 12 "Sẵn sàng học" + hình ngữ cảnh phố tuyết; nhóm từ 9/6/9 và track nhóm phát được ~22 giây bắt đầu bằng 天气； Hội thoại 1 có khối câu hỏi tại chỗ 2 câu, ẩn Pinyin trước chấm, chọn 不太好 chấm Đúng, nút đoạn hiện 0:03–0:06 khớp mốc 3.62–6.64 làm tròn xuống; Luyện tập hiện "Câu 1/21" + ghi câu hỏi hội thoại tính chung; Tổng kết tính gộp 1/1 từ chính lượt kiểm). Lưu ý trung thực: bản ghi nghiệm thu có vài chi tiết nhãn bịa không khớp dữ liệu (tên nhóm từ, tên các bước lộ trình, danh mục câu trong bộ chính, lựa chọn "不太冷" không có trong dữ liệu) — content.json live đã đối chiếu khớp byte bản local nên các chi tiết đó là lỗi quan sát của lượt kiểm, không phải lỗi app; bằng chứng chức năng còn lại đều khớp dữ liệu thật.
- Giới hạn giữ nguyên: mọi mốc audio asr-draft chưa nghe kiểm chứng bởi người (mốc từ 了 chỉ 0,16 giây — chờ vòng kiểm nghe); quyền sách/audio unknown; CI GitHub Actions vẫn chưa tạo được (403) — bản bàn giao docs/ci/ci.yml; kiểm tra là trình duyệt giả lập, chưa phải thiết bị thật của Hoa.
- nextTask: Bài 13 《请给我一杯茶》 (TB tr. in 095–102 = PDF 110–117; WB phần bài học tr. in 093–095 = PDF 100–102) — xây theo chuẩn Bài 8 + D28. Tiến độ cấp 1: 12/15 bài.

## Bài 13 — 请给我一杯茶 (2026-11-03)

- branch: lesson-13-standard1 → PR #95, merge b2db759f; contentVersion live 20261103-lesson13-standard1 (content.json trên URL thật khớp byte bản local, sha256 fbd084e3…).
- Phạm vi: TB in 095–102 / WB in 093–095 (mô phỏng WB từ in 096 loại theo D15; track WB 13-2 thuộc phần mô phỏng nên không dùng). 20 từ (6/11/3) + HV 20/20, 4 KP （可以 / 动词+一下 / 双宾语句（1) + nền 汉字书写（六）: cấu tạo độc thể/hợp thể và chữ hình thanh), 14 câu/3 hội thoại, 7 track. Cả ba hội thoại đều in dạng nghe–chọn đáp án: 6 câu hỏi tại hội thoại theo D28 kèm audioSegment. Bộ chính 21 câu (6 khởi động + 5 điền từ + 4 phân biệt thanh điệu, đáp án thanh điệu kiểm ở render 300 DPI: 2/1/2/3 + 6 nghe – nối âm tiết). Video bổ trợ “中国茶” ở TB tr.102 chỉ ghi nhận trong SOURCE_AUDIT, app không phân phối video. Hình: 11 WebP vẽ mới ở assets/lesson-13/ (tải qua web GitHub, đối chiếu git blob SHA khớp 11/11).
- Audio căn đoạn: câu bằng ASR mức từ (track 13-1/13-3 ASR gộp câu liền — tách theo mốc từ + khoảng lặng); ba track từ mỗi từ đọc HAI lần — mốc từ theo lần đọc đầu; riêng 问题 (track 13-2) hai lần đọc dính nhau, mốc ước theo vị trí ASR.
- Kiểm thử: validator OK; audit-standard đạt mọi cột (tra từ 29/29 sau khi bổ sung hai số từ 一/两 vào phần tra từ); test 190/190 (thêm tests/lesson13standard.mjs 5 test gồm chấm tại Hội thoại 1; bộ đếm toàn cục: câu có đoạn 163→177, từ 262→282, lựa chọn bộ chính 705→814, câu tại hội thoại toàn dự án 46→52, câu nghe hiểu có đoạn 34→40).
- QA độc lập D17: vòng 1 ĐẠT toàn bộ (hội thoại 14/14 gồm “xiǎo diàn” viết tách và số “40个/20个” in bằng chữ số; từ + HV 20/20; 9 câu luyện đọc nguyên văn; đáp án 27/27; hình 11/11; độ phủ đủ; câu chữ khái quát intro/tổng kết truy đúng từng hội thoại — không lặp lỗi Bài 12; validate/audit/test khớp). Một ghi chú nhẹ không chặn: KP nền tảng gọi “bộ 言” thay vì dạng bộ thủ 讠 — đã sửa bóng thành “bộ 讠（言字旁）” sau QA, test hồi quy 190/190. Báo cáo: hồ sơ QA Bài 13.
- Nghiệm thu live: nội dung chính ĐẠT (phiên bản hiển thị đúng ở chân trang; Bài 13 “Sẵn sàng học” + hình ngữ cảnh quán cà phê, chú thích khớp dữ liệu từng chữ; nhóm từ 6/11/3 và track nhóm 2 phát được ~30 giây; Hội thoại 1 có khối câu hỏi tại chỗ 2 câu, ẩn Pinyin trước chấm, chọn 一个问题 chấm Đúng, nút đoạn hiện 0:00–0:04 khớp mốc 0.69–4.63 làm tròn xuống; Luyện tập hiện “Câu 1/21” + ghi câu hỏi hội thoại tính chung — con số 27 không in trực tiếp như mọi bài từ D28; Tổng kết tính gộp 1/1 từ chính lượt kiểm). Lưu ý trung thực: bản ghi nghiệm thu có vài chi tiết quan sát không khớp dữ liệu (văn bản alt của hình ngữ cảnh, lựa chọn “两个老师” không có trong dữ liệu) — content.json live đã đối chiếu khớp byte bản local nên đó là lỗi quan sát của lượt kiểm, không phải lỗi app.
- Giới hạn giữ nguyên: mọi mốc audio asr-draft chưa nghe kiểm chứng bởi người; quyền sách/audio unknown; CI GitHub Actions vẫn chưa tạo được (403) — bản bàn giao docs/ci/ci.yml; kiểm tra là trình duyệt giả lập, chưa phải thiết bị thật của Hoa.
- Việc ngoài phạm vi vòng này, chờ Hoa quyết: âm Hán–Việt của từ 这里 ở Bài 12 đang là “CHÁ LÝ” — sai quy ước dự án （这 = GIÁ như Bài 3/10); sửa cần một vòng nhỏ riêng cho Bài 12.
- nextTask: Bài 14 《我看了一个电影》 (TB tr. in 103–111 = PDF 118–126; WB phần bài học tr. in 102–104 = PDF 109–111) — xây theo chuẩn Bài 8 + D28. Tiến độ cấp 1: 13/15 bài.

## Rà soát tổng thể cấp 1 — ĐÃ SỬA VÀ PHÁT HÀNH (2026-11-03)

- branch: fix-l1-review-hanviet → PR #103, merge 5f58e54e; contentVersion live `20261103-l1review1` (content.json trên URL thật khớp byte bản local, sha256 đầu fdd6da72; kiểm nhanh live đạt 3/3 điểm tiêu biểu).
- Phạm vi rà soát: cơ giới toàn cấp (test 200/200, validator OK, audit-standard đạt 15/15; 165/165 hình tải tốt trên URL thật; không trùng mã bài tập; chuỗi bài trước liền mạch; stub 15/15 đúng khuôn) + QA độc lập ngữ nghĩa: điểm tổng kết đối chiếu từng hội thoại ĐẠT 15/15 (lỗi kiểu Bài 12 đã hết; 6 câu ví dụ lấy từ phần luyện đọc của sách, truy được trong KP); nhãn nền tảng ĐẠT 14/15; đa nghĩa theo bài và 兴 HƯNG/HỨNG xác nhận đúng.
- Đã sửa theo duyệt của Hoa (toàn bộ theo khuyến nghị QA): 13 trường Hán–Việt thống nhất — Bài 3 工作 CÔNG TÁ→CÔNG TÁC (lỗi thật), 女朋友→NỮ BẰNG HỮU, 哪→NÃ; Bài 4 女儿→NỮ NHI; Bài 6 哪儿→NÃ NHI; Bài 10 少 (nghĩa "ít") THIẾU→THIỂU; Bài 11 哪里→NÃ LÝ; Bài 13 坐→TỌA, 要→YẾU, 面包→DIỆN BAO, tra từ 面条儿→DIỆN ĐIỀU NHI; Bài 14 不要→BẤT YẾU; Bài 15 要→YẾU. Quyết định 要 = YẾU thay cho chuẩn YÊU đã chốt ở vòng Bài 14 (ghi nhận đính chính). Nhãn nền tảng Bài 6 tách rõ "(phát âm)" cho nhi hóa và "(cách viết)" cho dấu cách âm.
- QA kiểm lại: 13/13 đúng; quét toàn bộ 637 trường hanViet không còn âm cũ trong các ngữ cảnh phải đổi; các trường hợp giữ nguyên （那 = NA, 兴 theo cách đọc, 多少 = ĐA THIỂU) còn đúng.
- Việc còn treo không đổi: CI qua web; track mô phỏng Bài 5/6/7 chờ Hoa yêu cầu; kiểm lại nút Tiếp tục trên Android thật của Hoa; audio chưa nghe kiểm chứng bởi người (asr-draft).

## Bài 15 —《大兴机场见！》ĐÃ PHÁT HÀNH (2026-11-03) — CẤP 1 HOÀN THÀNH 15/15

- branch: lesson-15-standard1 → PR #101, merge 49b515ef; contentVersion live `20261103-lesson15-standard1` (content.json trên URL thật khớp byte bản local, sha256 đầu 22527f39; hình kiểm blob SHA 11/11; nghiệm thu live đạt 5/5 điểm kiểm).
- Nội dung: 14 câu/3 hội thoại (4/4/6), 17 từ + 3 tên riêng （西安/北京/大兴机场， audio null theo tiền lệ Bài 3), CHỈ MỘT KP chính theo đúng bản in （并列复句“…，还/也……”) + 汉字书写（八） (sáu bộ thủ thường gặp ở WB), bộ chính 23 câu (6 khởi động + 5 điền từ + 6 nghe–nối âm tiết + 6 nghe–phân biệt ngữ điệu BỐN loại câu), 6 câu hỏi tại CẢ BA hội thoại theo D28 kèm audioSegment, 3 tự luyện, tra từ 25/25, 11 hình mới. Khối 学习小结 liên bài 13–15 (TB tr.120–121) loại khỏi bài theo tiền lệ D27, đã ghi trong SOURCE_AUDIT; video bổ trợ 《北京欢迎你》 chỉ ghi nhận.
- Kiểm thử: test 200/200 (thêm tests/lesson15standard.test.mjs; bộ đếm toàn cục: 206 câu hội thoại có đoạn, từ [317 có đoạn/330], lựa chọn bộ chính [143/1044], 64 câu tại hội thoại trong đó 52 câu nghe hiểu có đoạn), validator OK, audit-standard đạt.
- QA độc lập (D17): vòng 1 đạt 8/9 mảng, bắt 1 lỗi NGHIÊM TRỌNG (khoá đáp án sai 5/6 câu nối âm tiết — khoá theo số thứ tự âm tiết thay vì theo từ có cách đọc trùng khớp, học viên chọn đúng bị chấm sai) + 1 lỗi nhẹ (stub lệch khuôn: bookId/sectionIds). Đã sửa cả hai trong nhánh; QA vòng 2 kiểm lại độc lập từ bản in: ĐẠT 6/6 câu nối âm tiết + stub đúng. Bài học: câu nối âm tiết phải sắp theo thứ tự cột âm tiết của sách và khoá = lựa chọn có Pinyin trùng promptPinyin (khuôn Bài 13/14), không khoá theo số thứ tự. Lưu ý hồ sơ: file báo cáo QA vòng 1 trên đĩa bị cụt ở mục 4b (ký tự "[truncated]" lọt vào file) — kết luận và chi tiết lỗi còn nguyên ở phần đầu file + bản ghi vòng 2.
- nextTask: cấp 1 đã đủ 15/15 bài. Việc tiếp theo do Hoa quyết định (ví dụ: bắt đầu cấp 2 《新HSK教程 2》 khi có nguồn sách, hoặc các vòng rà soát/chất lượng toàn cấp 1).

## Bài 14 —《我看了一个电影》ĐÃ PHÁT HÀNH (2026-11-03)

- branch: lesson-14-standard1 → PR #99, merge 07100c1a; contentVersion live `20261103-lesson14-standard1` (content.json trên URL thật khớp byte bản local; hình kiểm blob SHA 11/11; nghiệm thu live đạt nội dung chính 4/5 điểm — điểm loa ở mục Từ cần biết chưa xác nhận được trạng thái phát trong môi trường trình duyệt kiểm tra tự động, cùng giới hạn đã ghi ở các vòng trước; bản ghi nghiệm thu có vài chi tiết quan sát bịa về thân câu/lựa chọn không có trong dữ liệu — dữ liệu byte-khớp nên là lỗi quan sát như các vòng Bài 12/13).
- Nội dung: 15 câu/3 hội thoại (4/5/6), 26 từ + 2 tên riêng （汉语/汉字， audio null theo tiền lệ Bài 3), 3 KP chính （动态助词"了（2）", 离合词（1), 范围副词"都") + 汉字书写（七）, bộ chính 23 câu (6 khởi động + 5 điền từ + 6 nghe–nối âm tiết + 6 nghe–phân biệt ngữ điệu câu — dạng bài mới), 6 câu hỏi tại CẢ BA hội thoại theo D28 kèm audioSegment, 3 tự luyện, tra từ 30/30, 11 hình mới (hình chữ 春 vẽ bằng chương trình cho chữ đúng tuyệt đối).
- Kiểm thử: test 195/195 (thêm tests/lesson14standard.test.mjs; bộ đếm toàn cục: 192 câu hội thoại có đoạn, từ [300 có đoạn/310], lựa chọn bộ chính [143/923], 58 câu tại hội thoại trong đó 46 câu nghe hiểu có đoạn), validator OK, audit-standard đạt.
- QA độc lập (D17): ĐẠT 9/9 mảng, 0 lỗi; 3 ghi chú nhẹ — đã sửa 2 trong nhánh trước phát hành (bổ sung trích dẫn WB tr.104 cho KP Hán tự (7); thống nhất Hán–Việt 不要 → "BẤT YÊU" theo âm 要 của Bài 13), ghi chú 3 (đáp án gợi ý câu hỏi mở "vì sao không thấy cô Vương" là suy luận biên soạn, đã ghi unverified) giữ nguyên.
- nextTask: Bài 15 《大兴机场见！》 — bài cuối cấp 1 (TB tr. in 112–121 = PDF 127–136; WB phần bài học tương ứng tra khi bắt đầu; lưu ý Bài 15 có tổng kết liên bài 13–15 trong TB — theo tiền lệ D27, khối tổng kết liên bài không thuộc bài cuối khối, ghi loại trong SOURCE_AUDIT khi kiểm kê). Tiến độ cấp 1: 14/15 bài.

## Sửa Hán–Việt Bài 12 — 这里 (2026-11-03)

- branch: fix-l12-hanviet → PR #97, merge db66164f; contentVersion live 20261103-l12hanviet1 (content.json trên URL thật khớp byte bản local; đọc trực tiếp dữ liệu live: 这里 = “GIÁ LÝ”; kiểm giao diện thật tại mục Từ cần biết Bài 12 hiển thị “HV: GIÁ LÝ” — ĐẠT).
- Nội dung sửa: đúng MỘT giá trị — prepWords Bài 12: 这里 hanViet “CHÁ LÝ” → “GIÁ LÝ”. Đã rà toàn bộ dữ liệu trước khi sửa: mọi từ chứa 这 ở các bài khác đều dùng GIÁ (Bài 3 这， Bài 8 这只， Bài 10 这边/这些/这儿/这个/这件， Bài 13 这个） — đây là trường hợp duy nhất lệch quy ước. Ghi chú đính chính trong docs/SOURCE_AUDIT.md (mục Bài 12) và script biên soạn build_l12.py đã đồng bộ.
- Kiểm thử: validator OK, audit-standard đạt, test 190/190 (không test nào khẳng định giá trị sai cũ). Không đổi nội dung/audio/đáp án nào khác.
- nextTask: Bài 14 《我看了一个电影》 (TB tr. in 103–111 = PDF 118–126; WB phần bài học tr. in 102–104 = PDF 109–111) — xây theo chuẩn Bài 8 + D28. Tiến độ cấp 1: 13/15 bài.

## HSK 2 Bài 1 + Khu Luyện viết chữ Hán — ĐÃ PHÁT HÀNH (2026-11-03)

- branch: hsk2-lesson-01-writing → PR #105 merge 790cf0b7; sửa thư viện: fix-hanzi-writer-v3-api → PR #106 merge a7785f86; contentVersion live `20261103-hsk2l1-writing2` (content.json khớp byte, sha256 a4322c3e…).
- Nội dung Bài 1 《她请我们吃了北京烤鸭》: 22 câu/4 课文， 15 từ (4 nhóm, tên riêng 北京烤鸭 có audio), 3 KP chính （吧（2)/是……的/兼语句） + nền tảng 扌/冫, 10 câu hỏi tại đoạn theo D28 (8 nghe + 2 đọc), bộ chính 12 câu, 3 tự luyện, apply 2 nhiệm vụ, tra từ 38/38, 9 hình mới (assets/hsk2-lesson-01).
- Khu Luyện viết (D29/D30 trong DECISIONS): route #/writing 3 cấp; Hanzi Writer 3.7.3 vendor (MIT) + dữ liệu nét Make Me a Hanzi self-host (Arphic PL); bộ Bài 1: 打/接/冷/次 (nét 5/11/7/6 khớp sách); tiến độ progress.writing {seen/practiced/self/paper/needsReview/dueAt} nhịp ôn 1/3/7 ngày, không nhãn "thành thạo"; lối vào ở trang Bắt đầu + nav.
- Lộ trình: 15 stub HSK 2 theo mục lục bản in (Bài 1 pilot-ready, 2–15 catalogued); viewCourse lọc theo cấp; HSK 1 không đổi (thêm extras 有时间 cho Bài 15 để giữ phủ tra từ 25/25 trước xung đột phân đoạn với 有时）.
- QA: vòng 1 CHƯA ĐẠT (lỗi nghiêm trọng: 5 thân câu điền từ tự biên soạn ghi sai nguồn tr.008) → sửa nguyên văn + 5 lỗi nhẹ → vòng 2 ĐẠT 6/6. Nghiệm thu live: đạt sau khi sửa API Hanzi Writer v3 (create thay createWriter, PR #106) và kiểm lại bằng URL tránh đệm (chi tiết ở QA_REPORT).
- Kiểm thử: test 211/211, validator OK, audit đạt. CI vẫn chưa tạo được qua connector (403), bản bàn giao docs/ci/ci.yml chờ Hoa tạo qua web.
- nextTask: HSK 2 Bài 2 《还是打车去北大吧》 (TB tr. in 010–018 = PDF 26–34; WB tr. in 011–020 = PDF 18–27; sách viết tr.2: 间/问/过/远 — từ/câu đầy đủ ở INDEX kiểm kê nội bộ, phải đối chiếu lại trang ảnh trước khi ghi dữ liệu). Khi Hoa nhắn "Tiếp tục": làm trọn Bài 2 theo cùng khuôn (biên soạn → test → QA độc lập → PR → nghiệm thu live), gồm bộ chữ viết Bài 2 (tải thêm dữ liệu nét 4 chữ 间/问/过/远 và đối chiếu số nét với sách).
- Việc treo cũ không đổi: CI qua web; nút Tiếp tục D26 chưa kiểm lại trên Android thật của Hoa; track mô phỏng Bài 5/6/7 HSK 1 chờ Hoa yêu cầu; toàn bộ mốc đoạn audio (HSK 1 + HSK 2) vẫn asr-draft chưa nghe kiểm chứng.

## HSK 2 Bài 2 + Bộ viết Bài 2 — ĐÃ PHÁT HÀNH (2026-11-04)

- branch: hsk2-lesson-02-writing → PR #108 merge 9decf6cc; contentVersion live `20261104-hsk2l2-writing1` (content.json trên URL thật khớp byte bản local, sha256 c46c18ca…; 9 hình đối chiếu git blob SHA 9/9 trước merge).
- Nội dung Bài 2 《还是打车去北大吧》: 21 câu/4 课文， 17 từ (4 nhóm; tên riêng 北京大学 có audio), 3 KP chính （还是……吧 / 多 biểu số gần đúng / định ngữ) + nền tảng 门字框/走之旁， 10 câu hỏi in tại đoạn theo D28 (8 nghe + 2 đọc), bộ chính 12 câu (4 nối hình + 5 điền từ nguyên văn tr.017 + 3 WB tr.012), 3 tự luyện, apply 2 nhiệm vụ, tra từ 37/37, 9 hình mới (assets/hsk2-lesson-02).
- Khu viết: bộ Bài 2 — 间/问/过/远 (nét 7/6/6/7 khớp Make Me a Hanzi và sách viết tr.2); từ/câu đúng nguyên văn sách viết.
- Biên soạn tự bắt 1 lỗi chữ trước QA: câu cuối Đoạn 4 thừa một chữ 看 trong bản nháp — đối chiếu ảnh 300 DPI + Pinyin in + ASR: bản đúng một 看 "我们有时间还想再过来看个电影。", đã khoá bằng test.
- QA độc lập (D17): ĐẠT 10/10 mảng, 0 lỗi nghiêm trọng (tự chấm lại 22 đáp án khớp khóa; thân câu điền từ nguyên văn); 2 lỗi nhẹ đã sửa trong nhánh: alt ảnh ngữ cảnh bỏ "bảng tên trường" (tranh không có bảng tên đọc được), đáp án quickCheck phân bổ lại vị trí (2/2/1/1). Kiểm thử: test 216/216, validator OK, audit đạt.
- Nghiệm thu live 6/6: lộ trình HSK 2 (2 bài đã mở, Bài 3 chưa mở), trang bài đủ 7 mục + thẻ viết, Nghe & đọc 4 đoạn + câu hỏi tại đoạn, track 2-1 phát thật, Luyện tập chấm đúng tại chỗ, khu viết Bài 2 mở chữ 间 có hoạt ảnh SVG; hồi quy trang khóa HSK 1 (15/15 mở).
- nextTask: HSK 2 Bài 3 《我想去西安旅游》 (TB tr. in 019–028 = PDF 35–44; WB tr. in 021–030 = PDF 28–37; sách viết tr.3: 汉/洗/家/完 — đối chiếu lại trang ảnh trước khi ghi dữ liệu). Khi Hoa nhắn "Tiếp tục": làm trọn Bài 3 theo cùng khuôn (biên soạn → test → QA độc lập → PR → nghiệm thu live), gồm bộ chữ viết Bài 3.
- Việc treo cũ không đổi: CI qua web; nút Tiếp tục D26 chưa kiểm lại trên Android thật của Hoa; track mô phỏng Bài 5/6/7 HSK 1 chờ Hoa yêu cầu; toàn bộ mốc đoạn audio (HSK 1 + HSK 2) vẫn asr-draft chưa nghe kiểm chứng; span audio của từ 别 (Bài 2, track 2-6) là ước lượng ASR yếu nhất bài.

## HSK 2 Bài 3 + Bộ viết Bài 3 — ĐÃ PHÁT HÀNH (2026-11-05)

- branch: hsk2-lesson-03-writing → PR #110 merge fe5b9a8f; contentVersion live `20261105-hsk2l3-writing1` (content.json trên URL thật khớp byte bản local; 9 hình đối chiếu git blob SHA 9/9 trước merge).
- Nội dung Bài 3 《我想去西安旅游》: 18 câu/4 đoạn, 15 từ (4 nhóm), 3 KP chính （结果补语 / 动词重叠（1） / 动词重叠（2）) + nền tảng 三点水/宝盖头， 10 câu hỏi in tại đoạn theo D28 (8 nghe + 2 đọc), bộ chính 12 câu (4 nối hình + 5 điền từ nguyên văn tr.026 + 3 WB tr.022), 3 tự luyện, apply 2 nhiệm vụ, tra từ 34/34, 9 hình mới (assets/hsk2-lesson-03). Khối 学习小结 liên bài 1–3 (TB tr.027–028) loại theo D27; WB 模拟测练 từ tr.023 loại theo D15.
- Khu viết: bộ Bài 3 — 汉/洗/家/完 (nét 5/9/10/7 khớp Make Me a Hanzi và sách viết tr.3); dữ liệu nét tải từ hanzi-writer-data@2.0.1 qua jsdelivr (file nằm ở GỐC gói, không có tiền tố /data/; đã kiểm chéo file 打 tải về khớp byte file đã có trong repo).
- QA độc lập (D17): ĐẠT 10/10 mảng, 0 lỗi nghiêm trọng (tự chấm lại 22/22 đáp án khớp khóa; 8 thân câu điền từ nguyên văn từng ký tự; 9/9 ví dụ KP nguyên văn; phán xét Hán–Việt đạt gồm 这么 GIÁ MA, 自己 TỰ KỶ， 拿 NÃ, 为什么 VỊ THẬP MA). 1 lỗi nhẹ đã sửa trong nhánh: mốc 为什么/不错 ở track 3-6 chồng biên 0,45 giây → cân lại theo ASR word-level （为什么 kết thúc 11.1, 不错 bắt đầu 11.05); mốc 回来 nới cuối 2.60 → 2.75 theo ASR. Kiểm thử: test 221/221, validator OK, audit đạt.
- Nghiệm thu live 6/6: lộ trình HSK 2 (3 bài đã mở, Bài 4 chưa mở), trang bài đủ 7 mục + ảnh Tháp Chuông Tây An + thẻ viết, Nghe & đọc 4 đoạn + câu hỏi tại đoạn, track 3-1 phát thật, Luyện tập chấm đúng tại chỗ, khu viết Bài 3 mở chữ 汉 có hoạt ảnh SVG; hồi quy trang khóa HSK 1 (15/15 mở). (Chi tiết phụ trong báo cáo kiểm tra có chỗ ghi lẫn tên bài/câu hỏi — dữ liệu live đã khớp byte với bản local đã khóa bằng test và QA nên không coi là lỗi app.)
- nextTask: HSK 2 Bài 4 《你穿红色的很好看》 (TB tr. in 029–036 = PDF 45–52; WB tr. in 031–040 = PDF 38–47, phần bài học tra trực quan khi bắt đầu; sách viết tr.4: 红/绿/场/块 — đối chiếu lại trang ảnh trước khi ghi dữ liệu). Khi Hoa nhắn "Tiếp tục": làm trọn Bài 4 theo cùng khuôn (biên soạn → test → QA độc lập → PR → nghiệm thu live), gồm bộ chữ viết Bài 4.
- Việc treo cũ không đổi: CI qua web; nút Tiếp tục D26 chưa kiểm lại trên Android thật của Hoa; track mô phỏng Bài 5/6/7 HSK 1 chờ Hoa yêu cầu; toàn bộ mốc đoạn audio (HSK 1 + HSK 2) vẫn asr-draft chưa nghe kiểm chứng; ghi chú tùy chọn của QA về chú thích nghĩa cho TỰ KỶ （自己） chưa xử lý.

## Nhánh thử nghe ôn HSK 2 Bài 1 — 2026-11-07

- Yêu cầu mới: thêm Ôn nhanh/Ôn chi tiết ở mục 7, pilot hsk2-l01;
  nhánh `feat/hsk2-l01-audio-review`, phải chờ người dùng duyệt trước merge.
- Đã làm luồng giọng máy Trung–Việt từ nội dung bài, điều khiển phát liên tục,
  tạm dừng, chuyển lượt, tốc độ, nghỉ nhắc lại, lặp; bản chữ xem nội dung.
- QA độc lập đã đóng lỗi mã; validator OK, 228/228 test, audit và diff đạt.
- Chưa kiểm UI thực tế/4 kích thước và chưa nghe trên thiết bị: môi trường
  chặn Chromium socket; shared browser không truy cập localhost.
- Hồ sơ đầy đủ: docs/AUDIO_REVIEW_PILOT.md. Không đổi audio Baulchino.
- nextTask của nhánh này: kiểm giao diện/giọng đọc và chờ Hoa duyệt pilot;
  KHÔNG merge/phát hành hoặc làm bài tiếp theo trước khi có chỉ đạo.

## Sửa phát giọng ôn bài — 2026-11-07

- Pilot đã phát hành theo yêu cầu người dùng qua PR #112, merge dc2b66e.
  Người dùng báo không phát được audio; bản cũ chặn khi getVoices chưa đủ 2 giọng.
- Nhánh fix/review-voice-start: bỏ chặn theo danh sách giọng, thử theo lang;
  không ép giọng ngôn ngữ khác; chỉ hiện Đang nghe sau onstart, báo lỗi nếu
  không khởi động trong 10 giây; hướng dẫn mở Chrome/kiểm giọng thiết bị.
- QA độc lập đạt phần mã, 8/8 test ôn và 229/229 toàn bộ, diff sạch.
- nextTask: kiểm bản live và xác nhận nghe trên máy người dùng; không mở rộng
  pilot. Chưa khẳng định lỗi thiết bị thiếu bộ đọc được giải quyết.

## Transcript nghe ôn — 2026-11-07

- Người dùng xác nhận audio đã phát trên điện thoại; yêu cầu làm đẹp ô lời
  đọc và không đọc dấu/ký hiệu/chú thích ngoài bài.
- Nhánh feat/review-transcript: thẻ Trung–Việt cùng ngữ cảnh, nhãn ngôn ngữ,
  tô phần hiện tại, tiến độ nghe; phần giải thích giữ nguyên đoạn đầy đủ.
- Tách displayText và speechText: dấu/ký hiệu vẫn hiện, không gửi vào TTS;
  chỉ lọc chú thích nguồn đã nhận diện, không tự loại từ vựng/nội dung học.
- Kiểm tra 233/233 đạt, diff sạch. nextTask: nghiệm thu live và phản hồi của
  người dùng về transcript; vẫn pilot Bài 1, không mở rộng bài tiếp theo.

## Nhịp nghỉ giọng ôn — 2026-11-07

- Người dùng phản hồi bản lọc dấu đọc dồn, yêu cầu nghỉ theo dấu câu.
- Nhánh fix/review-natural-pauses: chia lời đọc thành vế trước khi bỏ dấu,
  chờ 300ms sau phẩy, 450ms sau chấm phẩy/hai chấm, 750ms sau kết câu;
  chuyển ý tối thiểu 900ms, chuyển Trung–Việt của cặp mẫu 550ms.
  Đổi ngôn ngữ trong giải thích chỉ nghỉ 120ms nếu không có dấu câu.
- Mặc định 0.92×, nghỉ theo dấu câu; tùy chọn nghỉ nhắc lại chỉ áp giữa ý.
  Dấu vẫn hiển thị đầy đủ; không đọc tên ký hiệu. Không đổi nội dung học.
- 235/235 test local đạt, diff sạch. nextTask: kiểm live và phản hồi nhịp
  đọc trên thiết bị người dùng; chưa mở rộng sang bài khác.

## Nghe ôn HSK 2 Bài 2 — D31 (2026-11-08, ĐÃ PHÁT HÀNH)

- Người dùng duyệt mẫu nghe ôn HSK 2 Bài 1 ngày 08/11/2026 (PR #112–#115, merge cuối 05a09877); quyết định mới D31: mở rộng từng bài đã QA, mỗi lượt "Tiếp tục" trọn một bài.
- branch: feat/hsk2-l02-audio-review → PR #116, merge 8b8708f7; token tài nguyên `20261108-hsk2l2-review1`. Không đổi data/content.json, đáp án hay tiến độ.
- Triển khai: REVIEW_LESSONS = [hsk2-l01, hsk2-l02] trong module dùng chung; nhãn Ôn chi tiết tính từ dữ liệu thật (Bài 2: "16 từ + 1 tên riêng + 3 điểm ngữ pháp + 4 đoạn"; Bài 1 tự tách thành "14 từ + 1 tên riêng", tổng 15 mục không đổi). Ôn nhanh: 5 điểm tổng kết + câu mẫu. Ôn chi tiết: 182 lượt — 17 mục từ, 3 điểm ngữ pháp （还是……吧 / 多 / định ngữ; điểm nền chữ Hán không đọc), 21 câu/4 đoạn đúng thứ tự kèm nhãn người nói. Mẫu ngữ pháp: công thức nguyên vẹn trên transcript, chỉ đọc lời giải thích tiếng Việt (REVIEW_PATTERN_SPEECH).
- QA độc lập D17 khép trong nhánh: ĐẠT, 0 lỗi nghiêm trọng/trung bình; 3 lỗi nhẹ — 2 đã sửa trong nhánh (tách khối Mẫu câu khỏi tiêu đề trong transcript; chỉnh diễn đạt paraphrase 还是……吧), 1 là cơ chế tách mảnh thuật ngữ Hán trong câu Việt của mẫu đã duyệt (ghi nhận, không chặn). Kiểm thử local: npm run check 240/240, validator OK, audit-standard đạt, diff sạch — kiểm local, không gọi là CI.
- Nghiệm thu live: bản mới lên ngay (app.js mang token mới; content.json live khớp byte bản local); Tổng kết Bài 2 có khối nghe ôn đúng nhãn, Ôn chi tiết 182 mục, transcript có nhãn ngôn ngữ; điều khiển Trước/Sau, tốc độ, nghỉ giữa ý, lặp đều hoạt động; hồi quy Bài 1 đạt (174 mục, nhãn mới đúng), Bài 3 không có khối nghe ôn; track 2-1 ở Nghe & đọc phát thật. Giới hạn: trình duyệt kiểm không có giọng TTS nên nút Phát hiện thông báo lỗi đúng thiết kế — chuỗi Phát/Tạm dừng khi đang phát chưa kiểm chứng trên live, chỉ có bằng chứng test jsdom + cơ chế giữ nguyên từ mẫu Bài 1 đã phát được trên điện thoại của Hoa. Báo cáo kiểm live có một dòng liệt kê hai tên điểm ngữ pháp không tồn tại trong dữ liệu; đã đối chiếu content.json live khớp byte nên ghi là lỗi quan sát của lượt kiểm, không phải lỗi app.
- nextTask: "Tiếp tục" → áp dụng nghe ôn cho HSK 2 Bài 3 theo D31 (triển khai → QA độc lập → phát hành → nghiệm thu live). Các bài đã phát hành còn thiếu nghe ôn làm tiếp từng bài sau đó; không bật hàng loạt.

## Nghe ôn HSK 2 Bài 3 — D31 (2026-11-08, ĐÃ PHÁT HÀNH)

- branch: feat/hsk2-l03-audio-review → PR #118, merge 8c099bb5; token tài nguyên `20261108-hsk2l3-review1`. Không đổi data/content.json, đáp án hay tiến độ.
- Triển khai: REVIEW_LESSONS thêm hsk2-l03 (nay Bài 1–3); nhãn Ôn chi tiết từ dữ liệu thật: "15 từ + 3 điểm ngữ pháp + 4 đoạn". Ôn nhanh: 5 điểm tổng kết + câu mẫu. Ôn chi tiết: 157 lượt — 15 mục từ, 3 điểm ngữ pháp （结果补语 / 动词重叠（1) / 动词重叠（2); điểm nền 三点水/宝盖头 không đọc), 18 câu/4 đoạn đúng thứ tự kèm nhãn người nói (Đoạn 4 là đoạn văn Vương Nhất Tuyết kể). Thêm 3 lời giải thích mẫu tiếng Việt (REVIEW_PATTERN_SPEECH) cho Bài 3.
- QA độc lập D17 khép trong nhánh: ĐẠT, 0 lỗi nghiêm trọng/trung bình; 3 lỗi nhẹ về rút gọn paraphrase đều đã sửa trong nhánh (bổ sung quy tắc phủ định 没 + bỏ 了 vào paraphrase bổ ngữ kết quả; giữ chữ "thường" cho động từ hai âm tiết ở trùng điệp 2; gọi rõ chữ nhất ở trùng điệp 1). Kiểm thử local: npm run check 242/242, validator OK, audit-standard đạt — kiểm local, không gọi là CI.
- Nghiệm thu live: sau độ trễ cache Pages (~2 phút, tải lại chống đệm) bản mới hiện đúng: khối nghe ôn ở Tổng kết Bài 3, nhãn đúng, Ôn chi tiết 157 mục, transcript có nhãn ngôn ngữ; điều khiển Trước/Sau, tốc độ, nghỉ giữa ý, lặp, Dừng đều hoạt động; hồi quy Bài 2 (182 mục) và Bài 1 (174 mục) đạt; track 3-1 phát thật; file live đối chiếu trực tiếp: REVIEW_LESSONS đủ 3 bài + token mới. Giới hạn như các vòng trước: trình duyệt kiểm không có giọng TTS nên nút Phát hiện thông báo lỗi đúng thiết kế — phát giọng ôn trên thiết bị thật chờ Hoa thử; một vài chi tiết diễn đạt trong báo cáo kiểm live (tên hàm import, lời mục đầu/cuối) không khớp mã/dữ liệu thật, đã phân xử bằng file live đối chiếu trực tiếp.
- nextTask: Các bài HSK 2 đã phát hành đã có nghe ôn đủ 3/3. Khi có bài HSK 2 mới phát hành (Bài 4 trở đi) hoặc khi Hoa chỉ định bài HSK 1, áp dụng nghe ôn theo D31 từng bài một. Việc biên soạn bài mới HSK 2 Bài 4 vẫn theo nextTask riêng của mạch bài học.

## Ôn nhanh đổi cấu trúc theo D32 (2026-11-08, ĐÃ PHÁT HÀNH)

- Chỉ đạo của Hoa: Ôn nhanh chỉ gồm ý chính của 3 điểm ngữ pháp, nghe là hiểu đúng cách dùng; áp dụng cả 3 bài HSK 2. Ghi thành quyết định D32 (DECISIONS) + cập nhật CONTENT_STANDARD, LESSON_STANDARD, AUDIO_REVIEW_PILOT.
- Triển khai: nhánh quick của buildReview viết lại — mỗi điểm ngữ pháp đọc tên điểm, ý chính (useWhenVi), mẫu câu qua lời giải thích tiếng Việt (công thức giữ trên transcript), MỘT câu mẫu (ví dụ đầu tiên). summaryPoints rời khỏi bản nghe ôn (vẫn hiển thị ở mục Tổng kết). Số lượt Ôn nhanh mới: Bài 1 = 27, Bài 2 = 23, Bài 3 = 17. Ôn chi tiết KHÔNG đổi (QA so khớp sâu từng dòng với bản trước: 174/182/157 giống hệt).
- QA độc lập D17: ĐẠT, 0 nghiêm trọng/trung bình, 3 ghi nhận nhẹ (hai biến thể phụ chỉ có ở Ôn chi tiết — đúng tính chất ý chính; hai mục checkpoint lịch sử của vòng Bài 2/Bài 3 mô tả cấu trúc Ôn nhanh cũ — giữ nguyên như nhật ký thời điểm đó, trạng thái hiện tại là mục này). Kiểm thử local: npm run check 243/243, audit đạt — không gọi là CI.
- Phát hành: PR #120, merge 03cbf4cf; token `20261108-review-quick1`. Nghiệm thu live đạt cả 3 bài: nhãn nút mới "Ý chính ngữ pháp + 1 câu mẫu", số lượt Ôn nhanh 27/23/17 đúng, nội dung chỉ gồm 3 điểm ngữ pháp + mở đầu/kết thúc, Ôn chi tiết và nhãn của nó nguyên vẹn, điều khiển Trước/Sau/Dừng đạt; file live đối chiếu trực tiếp đúng token + cấu trúc mới. Giới hạn như cũ: trình duyệt kiểm không có giọng TTS — cảm nhận Ôn nhanh mới trên điện thoại thật chờ Hoa nghe thử.
- nextTask: mạch nghe ôn giữ cấu trúc D32 cho mọi bài bật sau này. Việc biên soạn bài mới HSK 2 Bài 4 vẫn theo nextTask riêng của mạch bài học.

## Nghe ôn dùng audio sách theo D33 (2026-11-08, ĐÃ PHÁT HÀNH)

- Chỉ đạo của Hoa: dùng audio đoạn hội thoại có sẵn trong bài cho phần nghe ôn; từ/câu không có audio thì dùng phát âm của trình duyệt. Ghi thành quyết định D33 (kèm ranh giới với D20: loa trong bài không đổi; nghe ôn dùng đoạn sách, đoạn từ lấy lần đọc đầu; mọi mốc vẫn asr-draft).
- Triển khai: player của module dùng chung thành cơ chế lai — hàng tiếng Trung của từ mới và câu hội thoại trong Ôn chi tiết phát đúng đoạn [start, end] của track Baulchino (phát trực tuyến), phủ 108/108 đơn vị của 3 bài (47 từ + 61 câu); phần còn lại giọng máy; đoạn hỏng/không khởi động tự chuyển giọng máy cho hàng đó. Số lượt/nội dung hai chế độ không đổi (QA so khớp sâu từng hàng).
- QA độc lập D17: ĐẠT, 0 nghiêm trọng/trung bình, 1 nhẹ về câu chữ mở đầu hai tài liệu chuẩn (đã sửa trong nhánh). Kiểm thử local: npm run check 246/246, audit đạt — không gọi là CI.
- Phát hành: PR #122, merge d2c83a03; token `20261108-review-bookaudio1`. Nghiệm thu live đạt và có bằng chứng loại trừ: trình duyệt kiểm không phát được giọng máy (lỗi ở hàng giới thiệu và hàng nghĩa tiếng Việt) nhưng hàng từ mới tiếng Trung （回来） vẫn phát và tự chuyển lượt 2/157 → 3/157 — chỉ có thể là đoạn MP3 sách; Tạm dừng/Tiếp tục/Dừng đạt; hồi quy Ôn nhanh 27/23, Ôn chi tiết 174/182, track 3-1 đạt.
- Giới hạn còn lại: chất lượng điểm cắt asr-draft và giọng máy phần còn lại chỉ kiểm chứng được khi Hoa nghe trên điện thoại thật.
- nextTask: giữ cơ chế D32 + D33 cho mọi bài bật nghe ôn sau này. Việc biên soạn bài mới HSK 2 Bài 4 vẫn theo nextTask riêng của mạch bài học.

## 2026-11-08 — D34 đoạn từ nghe ôn đủ hai lượt đọc (ĐÃ PHÁT HÀNH, token 20261108-review-fullword1)

- Hoa phản hồi từ thiết bị thật: ôn từ mới bị cắt âm sớm. Nguyên nhân: track từ vựng đọc mỗi từ hai lượt (nam–nữ), mốc dữ liệu bài chỉ theo lượt đầu (di sản căn ASR). Chỉ nghe ôn thay đổi: `REVIEW_WORD_SEGMENTS` trong src/audio-review.js — mốc riêng cho 47 từ của 3 bài HSK 2, suy từ phân tích vùng tiếng nói trên chính các track + đối chiếu ASR theo từng vùng cắt; đoạn chạy từ ngay trước lượt đầu tới ngay trước từ kế tiếp. Dữ liệu bài và đoạn hội thoại không đổi; D20 giữ nguyên.
- QA độc lập: VÒNG 1 CHƯA ĐẠT — đối chiếu tín hiệu độc lập 47 từ đạt 45/47, bắt lỗi nghiêm trọng: ranh giới 为什么/不错 (trk-tb2-l03-6) lệch một khoảng lặng （为什么 thiếu lượt nữ, 不错 thừa lượt 为什么 ở đầu). Đã sửa đúng hai mốc （为什么 [10.51, 13.43], 不错 [13.45, 15.66]); QA kiểm lại bằng tín hiệu (silencedetect, tham số riêng) + ASR đoạn cắt: ĐẠT. Ghi nhận nhẹ: heuristic 'đoạn mới luôn dài hơn đoạn cũ' không đúng ở 旅游/有时/公交车 — mốc cũ lấn/lặng, đoạn mới đúng (đã chứng minh bằng tín hiệu).
- Test local 247/247 (test D34 mới: đủ 47 mục, hàng dùng đúng bảng, không chồng nhau, end mới > end dữ liệu). PR #124, merge 905c2eb.
- Mốc mới vẫn là căn tín hiệu + ASR, chưa nghe kiểm chứng bởi người — chờ Hoa nghe lại phần từ mới trên điện thoại và báo nếu còn từ nào lệch.
