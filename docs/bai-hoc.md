# Bài học (bước improve)

> Mỗi dòng: bối cảnh → bài học → đã sửa gì (quy ước, tài liệu, công cụ). Mới nhất ở trên.

## 2026-11-10
- Bản mẫu Vite mới (TS 7) bỏ `baseUrl`; `paths` phải là đường dẫn tương đối `./src/*`.
- MSW 3 đổi `onUnhandledRequest` thành `onUnhandledFrame`.
- App cũ lưu một số khoá `localStorage` dạng chuỗi thô (vd `vih-tema`): khi muốn dùng chung giá trị phải đọc/ghi thô, không qua JSON.
