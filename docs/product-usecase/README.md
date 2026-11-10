# Product usecase

Mỗi use case một tệp `UC-<NHÓM>-<số>.md` theo [mẫu](_MAU.md). Nguồn nghiệp vụ gốc ở repo `Web_Notification`: `docs/dac-ta/De_xuat_Lich_cong_tac_Giao_viec_VIH_ban3.2_n8n.docx` (UC01–UC72, ma trận quyền mục 17), đặc tả ba luồng `docs/dac-ta/luong-*/`, gói BA sáng kiến. App đang chạy (`web/`) là nguồn sự thật về hành vi hiện có.

Trạng thái: **Chưa viết** → **Đã viết** (usecase xong) → **Đang làm** (đang ở product implementation) → **Xong** (đã qua verify).

| Mã | Tên | Kế hoạch | Usecase | Triển khai |
|---|---|---|---|---|
| UC-NEN-01 | Nền tảng frontend (khung, lỗi, API, trạng thái, đa ngôn ngữ, component chung, khung app) | 1 | Không cần (kỹ thuật) | Đang làm |
| [UC-AUTH-01](UC-AUTH-01.md) | Đăng nhập, đăng xuất, hết phiên | 1 | Đã viết | Chưa làm |
| [UC-AUTH-02](UC-AUTH-02.md) | Quên mật khẩu | 1 | Đã viết | Chưa làm |
| [UC-HOME-01](UC-HOME-01.md) | Trang Hôm nay | 1 | Đã viết | Chưa làm |
| [UC-AI-01](UC-AI-01.md) | Hỏi trợ lý AI, xem HTML artifact | 1 | Đã viết | Chưa làm |
| UC-AUTH-03 | Kích hoạt tài khoản, đặt lại mật khẩu bằng liên kết | 7 | Chưa viết | |
| UC-LICH-01 | Xem lịch tuần / ngày | 2 | Chưa viết | |
| UC-LICH-02 | Thêm, sửa, huỷ, hoàn tác lịch | 2 | Chưa viết | |
| UC-LICH-03 | Biên bản lịch | 2 | Chưa viết | |
| UC-VIEC-01 | Danh sách việc, lọc | 3 | Chưa viết | |
| UC-VIEC-02 | Giao việc, đề xuất việc, tự giao | 3 | Chưa viết | |
| UC-VIEC-03 | Nhận, từ chối, nộp, gia hạn việc | 3 | Chưa viết | |
| UC-VIEC-04 | Trao đổi, tệp đính kèm | 3 | Chưa viết | |
| UC-VIEC-05 | Chấm điểm, yêu cầu làm lại | 3 | Chưa viết | |
| UC-DUAN-01 | Dự án | 4 | Chưa viết | |
| UC-CKL-01 | Checklist (UC-CKL-01…06 của đặc tả luồng) | 4 | Chưa viết | |
| UC-TRN-01 | Tờ trình (UC-TRN-01…03) | 4 | Chưa viết | |
| UC-TRP-01 | Đặt chuyến đi (UC-TRP-01…07) | 4 | Chưa viết | |
| UC-PTN-01 | Đối tác, cơ hội, Go/No-Go (UC-PTN-03…05) | 4 | Chưa viết | |
| UC-CHAT-01 | Tin nhắn | 5 | Chưa viết | |
| UC-FUN-01 | Bảng tin, Diễn đàn Fun, Khoảnh khắc | 5 | Chưa viết | |
| UC-SK-01 | Sáng kiến | 5 | Chưa viết | |
| UC-DOI-01 | Đội, Sơ đồ tổ chức, Bản đồ vị trí | 6 | Chưa viết | |
| UC-BC-01 | Báo cáo, Bảng đánh giá ngày 25 | 6 | Chưa viết | |
| UC-VI-01 | Điểm và Ví VIH | 6 | Chưa viết | |
| UC-QT-01 | Quản trị (tài khoản, vai trò, cài đặt) | 7 | Chưa viết | |
| UC-QTR-01 | Quy trình n8n | 7 | Chưa viết | |
| UC-HS-01 | Hồ sơ cá nhân, giao diện, ngôn ngữ | 7 | Chưa viết | |
| UC-PWA-01 | Cài app, ngoại tuyến, thông báo đẩy | 7 | Chưa viết | |
