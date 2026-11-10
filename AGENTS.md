# AGENTS.md — vih-fe (frontend React của app Lịch công tác và Giao việc VIH)

> Điểm khởi đầu cho mọi người và mọi AI agent. Đọc file này rồi chỉ mở thêm tài liệu liên quan tới việc đang làm.

## 1. Quy tắc bắt buộc

- Trao đổi bằng **tiếng Việt**. UTF-8, giữ tiếng Việt có dấu.
- Làm trên nhánh riêng (`feat/…`, `fix/…`, `docs/…`), không làm thẳng trên `main`. Commit theo dạng `feat:`, `fix:`, `docs:`, `test:`, `chore:`, `refactor:`.
- Không commit, push, merge, deploy khi chưa được chủ dự án yêu cầu rõ.
- Không ghi bí mật vào mã hay vào `.env` được commit. Chỉ `.env.example` được commit.
- Tài liệu, dữ liệu mẫu, test: **không ghi tên người thật**, chỉ ghi vai trò (Chủ tịch, Chánh Văn phòng, Trưởng nhóm, Thư ký 1, Chuyên viên 1…).
- Máy chủ API nằm ở repo `Web_Notification`. Repo này chỉ gọi API, không chứa nghiệp vụ máy chủ.

## 2. Quy trình: product usecase → product implementation

Mọi tính năng đi qua hai tầng tài liệu, theo đúng thứ tự:

1. **Product usecase** (`docs/product-usecase/UC-<NHÓM>-<số>.md`): nghiệp vụ, tác nhân, luồng, quy tắc, tiêu chí chấp nhận. Chưa có usecase thì chưa làm.
2. **Product implementation** (`docs/product-implementation/frontend-implementation/product-implementation/UC-<NHÓM>-<số>/`): mỗi use case một thư mục gồm `README.md` (kỹ thuật, ghi theo 7 bước dưới) và `DESIGN-README.md` (màn hình, trạng thái, truy cập).

Quy trình dev cho mỗi use case, chi tiết ở [`docs/product-implementation/README.md`](docs/product-implementation/README.md):

**plan → test → implement → review → verify → remember → improve**

| Bước | Làm gì | Ghi ở đâu |
|---|---|---|
| plan | Kế hoạch kỹ thuật: thành phần, file, API, lỗi, test sẽ viết | `UC-…/README.md` mục 1, `DESIGN-README.md` |
| test | Viết test trước, chạy thấy **đỏ** đúng lý do | `UC-…/README.md` mục 2 |
| implement | Viết mã tối thiểu cho test **xanh** | `UC-…/README.md` mục 3 (commit) |
| review | Agent review độc lập đọc diff (code-reviewer, security-reviewer khi đụng đăng nhập/quyền) | `UC-…/README.md` mục 4 |
| verify | `npm run lint`, `npm run typecheck`, `npm test`, `npm run build`, thử trình duyệt 390 px và 1440 px | `UC-…/README.md` mục 5 |
| remember | Ghi trạng thái, việc còn lại, quyết định vào `docs/handover.md`; cập nhật mục lục usecase | `docs/handover.md` |
| improve | Rút bài học, sửa quy ước hoặc tài liệu cho lần sau | `docs/bai-hoc.md`, `UC-…/README.md` mục 7 |

Không ghi "đã test/đạt" nếu chưa chạy thật.

## 3. Kiến trúc và quy ước code

- React 19 + TypeScript strict, Vite, TanStack Router (hash history, giữ đường dẫn `#/…` của app cũ) + TanStack Query, zustand, i18next (vi mặc định, en). Chi tiết: [`docs/superpowers/specs/2026-11-10-vih-fe-react-design.md`](docs/superpowers/specs/2026-11-10-vih-fe-react-design.md).
- Thư mục `src/`: `app/` (khởi động, router, QueryClient), `core/` (config, http, errors, storage, i18n), `domain/` (kiểu và hàm thuần), `data/` (repository gọi API + hook Query), `store/` (zustand), `shared/ui/` (component chung `c-*`), `layouts/`, `features/<tính năng>/`, `routes/`, `locales/`, `styles/`.
- Đọc dữ liệu: `useAppState()` (`GET /api/trang-thai`). Ghi: `useRpc(fn)` (`POST /api/rpc`), máy chủ là nguồn sự thật.
- Lỗi: `ApiException`, `NetworkException`, `AppException`; báo lỗi qua `reportError()`.
- Giao diện theo `docs/product-implementation/frontend-implementation/product-design-system/`: một màu nhấn `--accent`, màu qua biến CSS, có dark mode, tôn trọng `prefers-reduced-motion`, không emoji, icon qua `<Icon name>`.
- Mọi chữ qua `t()`; `localStorage` chỉ qua `core/storage`.

## 4. Lệnh

```bash
npm run dev        # cần máy chủ chạy thử: node server/api/chay-thu-cuc-bo.js ở repo Web_Notification
npm test           # vitest
npm run typecheck
npm run lint
npm run build
```
