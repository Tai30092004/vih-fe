# UC-NEN-01 — Nền tảng frontend (kế hoạch kỹ thuật)

> Usecase: kỹ thuật, không có tệp nghiệp vụ. Kế hoạch chi tiết từng task: `docs/superpowers/plans/2026-11-10-ke-hoach-1-nen-tang.md` (Task 1–11, 15). Trạng thái: **implement** (Task 1–8 xong, đang Task 9).

## 1. Plan
| Task | Nội dung | File chính |
|---|---|---|
| 1 | Khung Vite + React + TS, test, lint, CSS giao diện mới | `vite.config.ts`, `src/styles/*`, `src/test/*` |
| 2 | Ngoại lệ app / api / mạng, `reportError` cắm được | `src/core/errors/*` |
| 3 | Storage an toàn, cookie | `src/core/storage/*` |
| 4 | HTTP client: timeout, ánh xạ lỗi, 401 | `src/core/http/*` |
| 5 | Kiểu dữ liệu, repository phiên / trạng thái / rpc / SSE | `src/domain/types.ts`, `src/data/*` |
| 6 | Store zustand: base lưu được, giao diện, phiên, toast | `src/store/*` |
| 7 | QueryClient, `useAppState`, `useRpc`, `useLiveSync`, xử lý 401 | `src/app/queryClient.ts`, `src/data/hooks/*` |
| 8 | Đa ngôn ngữ vi/en, định dạng ngày số | `src/core/i18n/*`, `src/locales/*` |
| 9 | Component chung phần tĩnh (theo `ui-kit.js`) | `src/shared/ui/*` |
| 10 | Component chung phần tương tác (Field, Tabs, Menu, Sheet, Toast) | `src/shared/ui/*` |
| 11 | Router hash, bảo vệ đăng nhập, khung app, menu theo quyền | `src/app/router.tsx`, `src/routes/*`, `src/layouts/*`, `src/domain/permissions.ts` |
| 15 | CI GitHub, README | `.github/workflows/ci.yml` |

## 2. Test
Mỗi task viết test trước, thấy đỏ rồi mới viết mã. Đã có (Task 1–8): 47 test, tất cả đạt.

## 3. Implement
| Task | Commit |
|---|---|
| 1 | `96338b6` |
| 2 | `c01192b` |
| 3 | `b22e802` |
| 4 | `335d2ed` |
| 5 | `d8f5da1` |
| 6 | `7100bb9` |
| 7 | `2b99283` |
| 8 | `8d8f123` |

Quyết định khác kế hoạch (đầy đủ ở sổ theo dõi `.superpowers/sdd/…/progress.md`, ghi lại ở đây):
- Dùng phiên bản bản mẫu Vite hiện tại: Vite 8, TypeScript 7, oxlint, Vitest 5, MSW 3, i18next 27.
- `has(u, perm)` chỉ đọc `u.perms` như app cũ (máy chủ đã chép quyền vai trò vào từng người).
- Theme lưu `vih-tema` dạng chuỗi thô `sang | toi | tu_dong`, giữ tương thích app cũ.
- Hook `data/hooks` dùng `store` (toast, phiên): là lớp keo giữa dữ liệu và giao diện; repository thuần vẫn không biết store.
- Nối ngôn ngữ của `uiStore` với i18n đặt ở `app/Providers` (Task 11).

## 4. Review
Chưa: review cả nhánh sau Task 15.

## 5. Verify
Mỗi task: `npx vitest run`, `npm run typecheck`, `npm run lint` đạt; Task 1 thêm `npm run build` đạt. Chưa thử trình duyệt (cần Task 11).

## 6. Remember
Ghi ở `docs/handover.md`.

## 7. Improve
Ghi ở `docs/bai-hoc.md`.
