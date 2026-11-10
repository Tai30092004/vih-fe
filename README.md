# vih-fe

Frontend React cho app **Lịch công tác và Giao việc VIH**. Máy chủ API (Node + PostgreSQL) nằm ở repo `Web_Notification`.

- React 19, TypeScript, Vite, TanStack Router + Query, zustand, i18next
- Thiết kế: [docs/superpowers/specs/2026-11-10-vih-fe-react-design.md](docs/superpowers/specs/2026-11-10-vih-fe-react-design.md)
- Kế hoạch: [docs/superpowers/plans/](docs/superpowers/plans/)

## Chạy

```bash
npm install
# máy chủ API chạy thử, ở repo Web_Notification:
node server/api/chay-thu-cuc-bo.js        # http://127.0.0.1:8766
# repo này:
cp .env.example .env.local                # đổi VITE_API_TARGET nếu cần
npm run dev                               # http://localhost:5173, /api đi qua proxy
```

| Lệnh | Việc |
|---|---|
| `npm test` | Vitest (Testing Library, MSW) |
| `npm run typecheck` | Kiểm tra kiểu |
| `npm run lint` | oxlint |
| `npm run build` | Đóng gói vào `dist/` |

Đăng nhập thử: `<mã>@vih.vn` / `vih2026` (vd `ct@vih.vn`).
