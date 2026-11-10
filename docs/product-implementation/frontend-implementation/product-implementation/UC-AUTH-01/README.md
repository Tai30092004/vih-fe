# UC-AUTH-01 — Đăng nhập, đăng xuất, hết phiên (kế hoạch kỹ thuật frontend)

> Usecase: `docs/product-usecase/UC-AUTH-01.md` · Thiết kế: `DESIGN-README.md` · Trạng thái: **plan**. Phụ thuộc UC-NEN-01.

## 1. Plan
- `src/data/authRepo.ts` (đã có): `session()`, `login(email, matKhau)`, `logout()`.
- `src/features/auth/useLogin.ts`: mutation đăng nhập; thành công → `queryClient.setQueryData(['state'], state)`, `sessionStore.setAuthed(state.me)`, chuyển `#/today`.
- `src/features/auth/LoginPage.tsx`: biểu mẫu email, mật khẩu (nút hiện/ẩn), nút Đăng nhập (đang gửi: spinner, không gửi trùng), lỗi chung dưới biểu mẫu; nút vào UC-AUTH-02. Nút đăng nhập nhanh theo vai trò chỉ khi `import.meta.env.DEV`.
- `src/routes/_auth/login.tsx`: route `#/login`; đã đăng nhập thì chuyển `#/today` (EX.5).
- Đăng xuất: mục trong menu tài khoản (`src/layouts/AccountMenu.tsx`) → `authRepo.logout()` → `queryClient.clear()` → `setGuest()` → `#/login` (AC.5).
- Hết phiên (EX.4): đã có `installAuthHandling` (UC-NEN-01 Task 7); route `_app` chuyển khách về `#/login`.
- Lỗi → giao diện: `ApiException` 4xx → hiện `message` máy chủ dưới biểu mẫu (EX.1, EX.2); `NetworkException` → "Mất kết nối…" (EX.3).
- i18n `auth.*`: `title`, `email`, `password`, `show`, `hide`, `submit`, `forgot`, `quickLogin`, `logout`.

## 2. Test (`src/features/auth/login.test.tsx`)
- AC.1 đăng nhập đúng → `['state']` có dữ liệu, chuyển `#/today`.
- AC.2 / EX.1 sai mật khẩu → hiện message máy chủ, ô email giữ giá trị.
- AC.3 bấm hai lần → MSW nhận đúng 1 lệnh.
- EX.3 mất mạng → hiện "Mất kết nối".
- EX.5 đã đăng nhập mở `#/login` → về `#/today`.
- AC.5 đăng xuất → `['state']` rỗng, về `#/login`.

## 3. Implement
## 4. Review
## 5. Verify
## 6. Remember
## 7. Improve
