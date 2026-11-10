# UC-AI-01 — DESIGN-README (Trợ lý AI)

- Khung chat trong tab Bảng tin của Hôm nay: `Card` tiêu đề "Trợ lý VIH", danh sách tin nhắn (người hỏi canh phải nền `--panel`, trợ lý canh trái), ô nhập tự giãn ở đáy, nút Gửi (icon send) / Dừng khi đang trả lời.
- Đang trả lời: con trỏ nhấp nháy cuối chữ (tắt khi `prefers-reduced-motion`).
- Artifact: thẻ viền `--border`, đầu thẻ có tiêu đề artifact và nút "Mở toàn màn hình"; thân là iframe cao theo nội dung (tối đa 480 px, cuộn trong).
- Lỗi: dòng chữ tone coral dưới tin nhắn + nút "Gửi lại".
- Truy cập: danh sách tin `role="log"` `aria-live="polite"`; iframe có `title`.
