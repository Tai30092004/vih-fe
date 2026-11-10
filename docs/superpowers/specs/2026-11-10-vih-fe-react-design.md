# VIH FE React – thiết kế

Chuyển giao diện web của app "Lịch công tác và Giao việc VIH" (repo `Web_Notification`, thư mục `web/`, HTML/JS thuần ~10 nghìn dòng) sang React + TypeScript, repo riêng `vih-fe`. Máy chủ API (Node + PostgreSQL) giữ nguyên trong `Web_Notification`.

## 1. Nguồn

- **Giao diện:** nhánh `feat/build-new-ui-v2` (anh IT): `web/css/*` (tokens, base, layout, components, pages), `web/ui-kit.js`, `web/icons-fluent.js`, phông IBM Plex Sans, tài liệu `refactor-design/` (03 nền tảng thiết kế, 04 bố cục, 05 common components). Trang Home và Đăng nhập đã làm mới ở nhánh này; các trang khác giữ giao diện cũ.
- **Chức năng:** nhánh `feat/sang-kien-11-07` (đang chạy thật tại https://vih.techfuture.vn): gồm Sáng kiến 07/11, Đối tác (CRM), Tờ trình, Chuyến đi, Checklist…
- **Trợ lý AI:** nhánh `feat/ai-assistant-gateway`: `POST /api/assistant` `{ question, conversationId? }` trả luồng SSE từ agent (repo `vih-ai-agent`, VoltAgent).

## 2. Quyết định (chủ dự án chốt 10/11/2026)

| Mục | Chọn |
|---|---|
| Nơi đặt mã | Repo GitHub mới, riêng tư: `Tai30092004/vih-fe` |
| Phạm vi | Chuyển toàn bộ app, làm theo nhiều kế hoạch nối tiếp (mục 6) |
| Ngôn ngữ | TypeScript (strict) |
| Ghi lỗi | Lớp `reportError` chung, chưa gắn dịch vụ (Crashlytics không hỗ trợ web; sau cắm Sentry hoặc Firebase) |
| Công cụ | Vite, TanStack Router, TanStack Query, zustand |

## 3. Kiến trúc

Clean architecture chia theo tầng và theo tính năng:

```
src/
  app/        khởi động: providers, router, QueryClient, ErrorBoundary gốc
  core/       dùng chung, không biết nghiệp vụ: config, http, errors, reportError, storage, cookies, i18n
  domain/     kiểu dữ liệu (AppState, User, Task…) và hàm thuần đọc dữ liệu (quyền, trạng thái việc, định dạng)
  data/       repository gọi máy chủ: auth, state, rpc, live (SSE), files, assistant
  store/      zustand: phiên, giao diện (theme, ngôn ngữ, toast, sheet)
  shared/ui/  component chung (c-*)
  layouts/    AppShell (thanh bên máy tính, thanh dưới điện thoại), AuthLayout
  features/   mỗi tính năng một thư mục: routes, components, hooks
  locales/    vi (mặc định), en
  styles/     CSS từ nhánh anh IT
```

Quy tắc phụ thuộc: `features → shared, store, data, domain, core`; `data → core, domain`; `domain → (không gì)`; `core → (không gì)`. Không import ngược.

### Luồng dữ liệu

- **Đọc:** TanStack Query, khoá `['state']` ← `GET /api/trang-thai` → `{ state }`. Máy chủ đã lọc dữ liệu theo người đăng nhập (`goc-nhin.js`).
- **Ghi:** mọi thao tác nghiệp vụ là `POST /api/rpc` `{ fn, args: ['me', ...args], ids: [], key }` → `{ result, state }`; `state` mới thay vào cache `['state']`. **Không chạy thử nghiệp vụ trên trình duyệt** như bản cũ (bản cũ nạp `core.js` + `api.js`); máy chủ là nguồn sự thật duy nhất.
- **Trực tiếp:** `EventSource('/api/su-kien')`; sự kiện `san-sang`, `cap-nhat` → làm mới `['state']`.
- **Trạng thái chỉ thuộc giao diện:** zustand (theme, ngôn ngữ, toast, sheet, cấu hình thanh dưới); lưu `localStorage` qua lớp `core/storage` an toàn (try/catch).
- **Phiên:** cookie `vih_phien` HttpOnly do máy chủ đặt; trình duyệt không đọc được. Mọi lệnh gửi `credentials: 'same-origin'` và header `X-VIH: 1` (chống CSRF).

### Định tuyến

TanStack Router, **hash history**, giữ nguyên đường dẫn cũ (`#/today`, `#/tasks/<id>`, `#/doi-tac/<id>`…) vì máy chủ ghi các liên kết này vào thông báo, email, dữ liệu.

### Lỗi

- `ApiException { status, code, message }` (máy chủ trả `{ code, message }`), `NetworkException { code: 'OFFLINE' | 'TIMEOUT' }`, `AppException` (lỗi trong app).
- 401 → về trang Đăng nhập. 409 `XUNG_DOT` → báo "vừa có người sửa" và làm mới.
- `reportError(err, ctx)` → `ErrorReporter` cắm được; mặc định ghi console khi dev.
- ErrorBoundary gốc + `errorComponent` của route; `window.onerror`, `unhandledrejection` → `reportError`.

### Trợ lý AI (Chat UI kit, ở Home)

- Gửi `POST /api/assistant`, đọc SSE bằng `fetch` + `ReadableStream` (EventSource không gửi POST được).
- Câu trả lời có khối ```` ```html ```` (hoặc sự kiện artifact) thì hiện **HTML artifact** trong `iframe sandbox="allow-scripts"` (không `allow-same-origin`), `srcdoc` kèm CSP `default-src 'none'; img-src data: https:; style-src 'unsafe-inline'; script-src 'unsafe-inline'`. Artifact không đọc được cookie, không gọi được API của app.

## 4. Quy ước giữ từ app cũ

- Không emoji trong giao diện; icon theo bộ Fluent của nhánh anh IT.
- Một màu nhấn `--accent`; màu qua biến CSS; có dark mode; luôn tôn trọng `prefers-reduced-motion`.
- Việc Bảo mật không lộ tiêu đề ở bất kỳ đâu ngoài chỗ máy chủ đã cho.
- Tài liệu, dữ liệu mẫu không ghi tên người thật, chỉ ghi vai trò.
- Mọi chữ hiện ra qua i18n (`vi` mặc định, `en`).

## 5. Kiểm thử

Vitest + Testing Library + MSW (giả máy chủ) cho đơn vị và tích hợp; Playwright cho luồng chính (kế hoạch cuối). TDD: viết test trước. Chạy thử thật với máy chủ chạy thử của `Web_Notification`: `node server/api/chay-thu-cuc-bo.js` (http://127.0.0.1:8766), Vite proxy `/api` tới đó.

## 6. Các kế hoạch

| # | Kế hoạch | Nội dung |
|---|---|---|
| 1 | Nền tảng + Đăng nhập + Home + Chat UI kit | Mục 3 toàn bộ, component chung, AppShell, 2 trang anh IT đã làm |
| 2 | Lịch | Tuần/ngày, chi tiết lịch, thêm/sửa/huỷ, biên bản, gắn đối tác |
| 3 | Việc | Danh sách, chi tiết, giao/nhận/từ chối/nộp, trao đổi + tệp, chấm điểm, gia hạn, đề xuất |
| 4 | Dự án, Checklist, Tờ trình, Chuyến đi, Đối tác | |
| 5 | Tin nhắn, Bảng tin/Fun, Khoảnh khắc, Sáng kiến | |
| 6 | Đội, Sơ đồ, Báo cáo, Bảng đánh giá, Điểm & Ví, Bản đồ | |
| 7 | Quản trị, Quy trình, Hồ sơ, Kích hoạt/đặt lại mật khẩu, PWA, thông báo đẩy | |
| 8 | Playwright E2E, đóng gói + deploy song song bản cũ, chuyển hẳn | |
