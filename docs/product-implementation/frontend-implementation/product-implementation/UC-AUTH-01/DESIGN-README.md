# UC-AUTH-01 — DESIGN-README (Đăng nhập)

> Theo `loginView()` nhánh `feat/build-new-ui-v2` và design system 00–30.

## 1. Bố cục
- Điện thoại: một cột giữa màn, logo VIH trên cùng, tiêu đề "Đăng nhập", biểu mẫu, nút chính full chiều rộng, liên kết "Quên mật khẩu" bên dưới.
- Máy tính: thẻ biểu mẫu rộng tối đa 400 px ở giữa nền `--page`.

## 2. Biểu mẫu
- Ô email: `type="email"`, `autocomplete="username"`, `inputmode="email"`, `enterkeyhint="next"`.
- Ô mật khẩu: `autocomplete="current-password"`, nút icon hiện/ẩn có `aria-label` đổi theo trạng thái.
- Nút **Đăng nhập** (`kind="primary"`, `size="lg"`): một màu `--accent` duy nhất trên màn.

## 3. Trạng thái
- Đang gửi: spinner trong nút, `aria-busy`, không gửi trùng.
- Lỗi chung: khối `Banner` tone coral `role="alert"` dưới biểu mẫu.
- Bản dev: dải nút đăng nhập nhanh theo vai trò (Chủ tịch, Chánh Văn phòng, Trưởng nhóm, Thư ký 1, Chuyên viên 1).

## 4. Truy cập
Tiêu điểm đầu vào ô email; Enter gửi; nhãn `label for`; tương phản đạt AA ở Sáng và Tối.
