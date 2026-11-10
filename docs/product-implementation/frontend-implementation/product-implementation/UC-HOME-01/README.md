# UC-HOME-01 — Trang Hôm nay (kế hoạch kỹ thuật frontend)

> Usecase: `docs/product-usecase/UC-HOME-01.md` · Thiết kế: `DESIGN-README.md` · Trạng thái: **plan**. Phụ thuộc UC-NEN-01, UC-AI-01 (tab Bảng tin).

## 1. Plan
- Hàm thuần `src/domain/{dates,tasks,calendar,checkin}.ts`, chép quy tắc từ `web/core.js` nhánh đang chạy thật: `ymd`, `addDays`, `monday`, `isWorkday`, `isOpen`, `isOver`, `scored`, `pendingFor`, `titleFor`, `relText`, `canNhan`, `checkinToday`, `subordinates`, `lichCoNgay`, `lichDangDien`.
- `src/features/home/`: `HomePage.tsx` (route `src/routes/_app/today.tsx`), `HomeHeader.tsx`, `WeekHero.tsx`, `HomeStats.tsx`, `TabCanLam.tsx`, `TabLich.tsx`, `TabDoi.tsx`, `TabBangTin.tsx`; tab đang mở lưu `sessionStorage`.
- Thao tác nhanh qua `useRpc`: `nhanViec(id)`, `tuChoiViec(id, lyDo, ver)`, `duyetDeXuat(...)` (tên hàm đối chiếu `web/api.js`); mở chi tiết việc / lịch là liên kết `#/tasks/<id>`, `#/calendar`.
- Lỗi: theo `useRpc` (toast message; `XUNG_DOT` tải lại).
- i18n `home.*`.

## 2. Test
- `src/domain/tasks.test.ts`: `isOver` đúng ở biên giờ; `pendingFor` của Chủ tịch gồm việc chờ chấm; `scored` loại việc cá nhân.
- `src/features/home/home.test.tsx` (dữ liệu mẫu theo vai trò `src/test/fixtures/state.ts`): AC.1 nút theo vai trò; AC.2 đếm Quá hạn chỉ của mình; AC.3 "Nhận việc" gọi `rpc('nhanViec', id)`; AC.4 phím mũi tên đổi tab; BR-HOME-02 việc Bảo mật không lộ tiêu đề.

## 3. Implement
## 4. Review
## 5. Verify
## 6. Remember
## 7. Improve
