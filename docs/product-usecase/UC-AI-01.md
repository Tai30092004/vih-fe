# UC-AI-01 — Hỏi trợ lý AI, xem HTML artifact

> Nguồn: cổng trợ lý ở nhánh `feat/ai-assistant-gateway` (`POST /api/assistant` → luồng SSE từ agent `vih-ai-agent`); yêu cầu: Chat UI kit đọc và hiện HTML artifact do agent sinh ra. Kế hoạch: 1.

## 1. Mục tiêu
Người dùng hỏi trợ lý về việc, lịch, thông báo của mình bằng lời; câu trả lời hiện dần; nếu agent trả về trang HTML (bảng, biểu đồ, báo cáo) thì hiện ngay trong khung chat.

## 2. Tác nhân và quyền
Mọi người đã đăng nhập. Trợ lý chỉ đọc dữ liệu người hỏi được xem (máy chủ lọc).

## 3. Tiền điều kiện
Đã đăng nhập; máy chủ đã cấu hình trợ lý (chưa cấu hình thì máy chủ trả 503).

## 4. Luồng chính
1. Ở tab Bảng tin của Hôm nay, mở khung trợ lý, gõ câu hỏi (tối đa 2000 ký tự), bấm Gửi.
2. Câu trả lời hiện dần theo từng phần nhận được.
3. Phần HTML artifact hiện trong khung riêng, có nút mở toàn màn hình.
4. Hỏi tiếp trong cùng hội thoại (giữ mã hội thoại trong phiên trình duyệt).

## 5. Luồng phụ và ngoại lệ
- EX.1 Câu hỏi trống hoặc quá dài: không gửi.
- EX.2 Trợ lý chưa cấu hình (503) hoặc bận (502): báo lỗi, gửi lại được.
- EX.3 Luồng đứt giữa chừng hoặc nhận sự kiện lỗi: giữ phần chữ đã nhận, đánh dấu lỗi, có nút Gửi lại.
- EX.4 Người dùng bấm Dừng: ngắt luồng, giữ phần đã nhận.
- EX.5 Quá 20 câu / phút: máy chủ báo lỗi, hiện đúng thông báo.

## 6. Quy tắc nghiệp vụ
- BR-AI-01: HTML artifact chạy trong khung cách ly (iframe sandbox, không cùng nguồn): không đọc được cookie, không gọi được API của app, không điều hướng được trang app.
- BR-AI-02: không lưu câu hỏi, câu trả lời vào `localStorage`.

## 7. Tiêu chí chấp nhận
- AC.1 Câu trả lời dài dần khi nhận từng phần.
- AC.2 Khối ```` ```html ```` hiện thành khung artifact, không hiện mã thô.
- AC.3 Artifact chứa `<script>fetch('/api/…')` không lấy được dữ liệu app.
- AC.4 Luồng lỗi → có nút Gửi lại.

## 8. Ngoài phạm vi
Lưu lịch sử hội thoại lâu dài; tải tệp lên cho trợ lý.
