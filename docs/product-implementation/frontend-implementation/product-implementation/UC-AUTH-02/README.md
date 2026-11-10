# UC-AUTH-02 — Quên mật khẩu (kế hoạch kỹ thuật frontend)

> Usecase: `docs/product-usecase/UC-AUTH-02.md` · Thiết kế: `DESIGN-README.md` · Trạng thái: **plan**. Phụ thuộc UC-AUTH-01.

## 1. Plan
- `src/features/auth/ForgotSheet.tsx`: `Sheet` có ô email (lấy sẵn email ở trang Đăng nhập), nút Gửi liên kết; gọi `authRepo.forgot(email)`.
- Kiểm tra email dạng `x@y.z` trước khi gửi (EX.1). Lỗi máy chủ → message dưới ô (EX.2); mất mạng → giữ email (EX.3).
- Thành công → toast "Đã gửi liên kết đặt lại mật khẩu", đóng sheet.
- i18n `auth.forgot.*`.

## 2. Test (`src/features/auth/forgot.test.tsx`)
- AC.1 email hợp lệ → MSW nhận `{ email }`, toast, sheet đóng.
- AC.2 email sai dạng → không có lệnh nào.
- EX.2 máy chủ báo lỗi → hiện message.

## 3. Implement
## 4. Review
## 5. Verify
## 6. Remember
## 7. Improve
