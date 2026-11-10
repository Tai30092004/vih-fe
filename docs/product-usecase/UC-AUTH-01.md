# UC-AUTH-01 — Đăng nhập, đăng xuất, hết phiên

> Nguồn: app cũ `loginView()` (nhánh giao diện mới), máy chủ `POST /api/dang-nhap`, `GET /api/phien`, `POST /api/dang-xuat`. Kế hoạch: 1.

## 1. Mục tiêu
Người dùng đã có tài khoản vào được app bằng email và mật khẩu, ra khỏi app khi muốn, và được đưa về trang đăng nhập khi phiên hết hạn.

## 2. Tác nhân và quyền
Mọi tài khoản trạng thái **Đang hoạt động** (Chủ tịch, Chánh Văn phòng, Trưởng nhóm, Thư ký, Chuyên viên). Tài khoản **Khoá** hoặc **Chờ kích hoạt** không đăng nhập được.

## 3. Tiền điều kiện
Chưa đăng nhập, hoặc phiên đã hết hạn.

## 4. Luồng chính
1. Mở app. App hỏi máy chủ phiên hiện tại; chưa có phiên thì hiện trang Đăng nhập.
2. Nhập email, mật khẩu; bấm **Đăng nhập**.
3. Máy chủ kiểm tra, đặt cookie phiên (HttpOnly), trả dữ liệu người dùng được xem.
4. App chuyển tới **Hôm nay** (`#/today`).
5. Đăng xuất: menu ảnh đại diện → **Đăng xuất** → máy chủ huỷ phiên → về trang Đăng nhập, dữ liệu cũ bị xoá khỏi bộ nhớ trình duyệt.

## 5. Luồng phụ và ngoại lệ
- EX.1 Sai email hoặc mật khẩu: hiện đúng thông báo máy chủ dưới biểu mẫu, giữ email đã nhập.
- EX.2 Tài khoản khoá / chờ kích hoạt: hiện thông báo máy chủ.
- EX.3 Mất mạng / máy chủ không phản hồi: "Mất kết nối, kiểm tra mạng rồi thử lại"; bấm lại được.
- EX.4 Phiên hết hạn khi đang dùng (máy chủ trả 401 ở bất kỳ thao tác nào): về trang Đăng nhập **một lần**, không lặp chuyển trang.
- EX.5 Đã đăng nhập mà mở `#/login`: chuyển thẳng tới `#/today`.

## 6. Quy tắc nghiệp vụ
- BR-AUTH-01: phiên chỉ nằm ở cookie HttpOnly do máy chủ đặt; trình duyệt không lưu mật khẩu hay mã phiên.
- BR-AUTH-02: mọi lệnh gửi header `X-VIH: 1` (chống CSRF).
- BR-AUTH-03: nút đăng nhập nhanh theo vai trò chỉ có ở bản chạy thử (dev), không có ở bản thật.

## 7. Tiêu chí chấp nhận
- AC.1 Đăng nhập đúng → tới Hôm nay, tên người dùng hiện đúng.
- AC.2 Sai mật khẩu → thấy thông báo, email vẫn còn.
- AC.3 Bấm Đăng nhập hai lần liền → chỉ gửi một lệnh.
- AC.4 Hết phiên giữa chừng → về Đăng nhập một lần.
- AC.5 Đăng xuất rồi bấm Quay lại của trình duyệt → không thấy dữ liệu cũ.

## 8. Ngoài phạm vi
Kích hoạt tài khoản, đặt lại mật khẩu bằng liên kết (UC-AUTH-03); đổi mật khẩu khi đang đăng nhập (UC-HS-01).
