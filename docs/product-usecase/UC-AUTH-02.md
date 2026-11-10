# UC-AUTH-02 — Quên mật khẩu

> Nguồn: máy chủ `POST /api/quen-mat-khau`; liên kết đặt lại `#/dat-lai/<mã>` (UC-AUTH-03). Kế hoạch: 1.

## 1. Mục tiêu
Người quên mật khẩu tự nhận được liên kết đặt lại qua email, không cần nhờ quản trị.

## 2. Tác nhân và quyền
Khách (chưa đăng nhập).

## 3. Tiền điều kiện
Đang ở trang Đăng nhập.

## 4. Luồng chính
1. Bấm **Quên mật khẩu**, hộp thoại mở ra, ô email lấy sẵn email đang nhập (nếu có).
2. Nhập email, bấm **Gửi liên kết**.
3. Máy chủ gửi email có liên kết đặt lại; app báo đã gửi và đóng hộp.

## 5. Luồng phụ và ngoại lệ
- EX.1 Email sai dạng: báo ngay dưới ô, không gửi.
- EX.2 Máy chủ báo lỗi: hiện đúng thông báo máy chủ.
- EX.3 Mất mạng: báo mất kết nối, giữ email để gửi lại.

## 6. Quy tắc nghiệp vụ
- BR-AUTH-04: app không tiết lộ email có tồn tại hay không ngoài thông báo máy chủ trả về.

## 7. Tiêu chí chấp nhận
- AC.1 Email hợp lệ → thấy "đã gửi", hộp đóng.
- AC.2 Email sai dạng → không gửi lệnh nào.

## 8. Ngoài phạm vi
Trang đặt mật khẩu mới từ liên kết (UC-AUTH-03).
