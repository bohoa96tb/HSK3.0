# HSK3.0

Web app học ngữ pháp tiếng Trung cho người Việt theo giáo trình **HSK 3.0**, nguồn học liệu duy nhất từ [Baulchino](https://www.baulchino.com/).

Trạng thái: **bản pilot** — Bài 1 HSK 1 (sách bài tập / Workbook) với nội dung đã kiểm chứng trực quan từ bản in, cộng khung lộ trình 15 bài HSK 1 ở mức mục lục. Nội dung sách giáo khoa (Textbook) chưa được đưa vào vì chưa đọc/kiểm chứng được trong lượt đầu. Đây chưa phải sản phẩm "đầy đủ HSK 3.0".

- Xem thử: GitHub Pages (đường dẫn được ghi trong `docs/CHECKPOINT.md` sau khi triển khai và nghiệm thu thật).
- Đặc tả: `docs/MASTER_PLAN.md` · Nguồn & quyền: `docs/SOURCE_AUDIT.md` · Trạng thái phiên: `docs/CHECKPOINT.md` · Quy tắc làm việc: `AGENTS.md`.

## Chạy local

```bash
python3 -m http.server 8000
# http://localhost:8000/
```

## Kiểm tra

```bash
node scripts/validate.mjs
node --test tests/
```

App là web tĩnh không cần build: `index.html` + `src/` (ES modules) + `data/content.json`. Audio phát trực tiếp từ nguồn Baulchino; repo không chứa PDF/MP3 hay toàn văn sách.
