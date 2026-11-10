# Kế hoạch 1 – Nền tảng, Đăng nhập, Home, Chat UI kit

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Repo `vih-fe` chạy được: đăng nhập vào máy chủ VIH thật (bản chạy thử), thấy khung app (thanh bên / thanh dưới) và trang Home theo giao diện mới của anh IT, có khung chat trợ lý AI hiện được HTML artifact.

**Architecture:** React 19 + TypeScript strict, Vite. Đọc dữ liệu bằng TanStack Query (`['state']` ← `GET /api/trang-thai`), ghi bằng `POST /api/rpc`, trạng thái giao diện bằng zustand. Định tuyến TanStack Router với hash history, giữ đường dẫn cũ. Chi tiết ở spec.

**Tech Stack:** react@19, vite@7, typescript@5 (strict), @tanstack/react-router@1 + @tanstack/router-plugin, @tanstack/react-query@5, zustand@5, i18next@25 + react-i18next@15, vitest@3 + @testing-library/react@16 + @testing-library/user-event@14 + jsdom, msw@2, eslint@9 (typescript-eslint, react-hooks), prettier@3.

**Spec:** `docs/superpowers/specs/2026-11-10-vih-fe-react-design.md`

## Global Constraints

- Mọi lệnh tới máy chủ: `credentials: 'same-origin'`, header `X-VIH: 1`, đường dẫn tương đối `/api/...`.
- `POST /api/rpc` body đúng dạng `{ fn, args: ['me', ...args], ids: [], key }`; `key` 8–40 ký tự `[A-Za-z0-9]`, sinh mới mỗi lệnh.
- Lỗi máy chủ có dạng `{ code, message }`; hiện `message` cho người dùng, không tự viết lại.
- Hash history; đường dẫn giữ như app cũ: `today`, `calendar`, `tasks`, `tasks/$id`, `du-an`, `trinh`, `chuyen-di`, `doi-tac`, `co-hoi/$id`, `chat`, `fun`, `team`, `so-do`, `bao-cao`, `quy-trinh`, `eval`, `me`, `vi`, `sang-kien`, `ban-do`, `admin`, `ho-so`, `toi`, `kich-hoat/$token`, `dat-lai/$token`. Route chưa làm hiện khung "Đang chuyển sang bản mới" kèm liên kết sang app cũ.
- Mọi chữ hiện ra qua `t()` (i18n), `vi` mặc định; không emoji; icon qua `<Icon name>`; màu qua biến CSS.
- `localStorage` / `sessionStorage` chỉ qua `core/storage` (bọc try/catch); không lưu dữ liệu việc, tin nhắn, điểm.
- Không lưu bí mật trong mã hay `.env` được commit; `.env.example` chỉ có `VITE_API_TARGET=http://127.0.0.1:8766`.
- Tên người trong test và dữ liệu mẫu: chỉ vai trò (Chủ tịch, Chuyên viên 1…).

## Review Focus

1. Phiên hết hạn giữa chừng (401 ở bất kỳ lệnh nào) → về trang Đăng nhập một lần, không vòng lặp chuyển trang. Test: Task 7 `về đăng nhập khi trang-thai trả 401`.
2. Mất mạng khi bấm thao tác → toast "Mất kết nối", nút không bị kẹt trạng thái đang gửi. Test: Task 4 `TypeError fetch → NetworkException OFFLINE`, Task 7 `useRpc trả về trạng thái lỗi khi OFFLINE`.
3. `localStorage` bị chặn (trình duyệt riêng tư, Safari) → app vẫn chạy với giá trị mặc định. Test: Task 3 `storage ném lỗi thì get trả fallback`.
4. HTML artifact độc hại (`<script>fetch('/api/...')`, `top.location=`) → không đọc được cookie, không điều hướng app. Test: Task 13 `iframe có sandbox allow-scripts và không có allow-same-origin`, `srcdoc có CSP default-src 'none'`.
5. Luồng SSE trợ lý đứt giữa chừng hoặc nhận `event: error` → tin nhắn dừng ở chữ đã nhận, hiện lỗi, gửi lại được. Test: Task 13 `sự kiện error kết thúc tin nhắn với trạng thái lỗi`.

---

### Task 1: Khung dự án

**Files:**
- Create: `package.json`, `vite.config.ts`, `tsconfig.json`, `tsconfig.app.json`, `tsconfig.node.json`, `eslint.config.js`, `.prettierrc`, `.gitignore`, `.env.example`, `index.html`, `src/main.tsx`, `src/app/App.tsx`, `src/test/setup.ts`, `src/test/msw.ts`, `README.md`
- Create: `src/styles/{tokens,base,layout,components,pages}.css`, `src/styles/index.css` (chép từ nhánh `feat/build-new-ui-v2`: `web/css/*`), `public/fonts/*` (Plex Sans + OFL.txt), `public/icons/*`, `public/favicon.ico`, `public/icon.svg`, `public/manifest.webmanifest`
- Test: `src/app/App.test.tsx`

**Interfaces:**
- Produces: alias `@/` → `src/`; scripts `dev`, `build`, `preview`, `test`, `test:watch`, `lint`, `typecheck`, `format`; `server` của MSW trong `src/test/msw.ts` (`export const server = setupServer()`), bật trong `setup.ts` (`onUnhandledRequest: 'error'`).

- [ ] **Step 1:** `npm create vite@latest . -- --template react-ts`, cài thư viện ở Tech Stack; bật `strict`, `noUncheckedIndexedAccess`.
- [ ] **Step 2:** Vite: `server.proxy['/api'] = { target: env.VITE_API_TARGET ?? 'http://127.0.0.1:8766', changeOrigin: true }`; `test: { environment: 'jsdom', setupFiles: 'src/test/setup.ts' }`.
- [ ] **Step 3: Viết test** `App.test.tsx`: `render(<App />)` không lỗi và có phần tử `role="main"` hoặc màn chờ.
- [ ] **Step 4:** Chạy `npm test` → PASS; `npm run typecheck` và `npm run lint` → 0 lỗi; `npm run build` → thành công.
- [ ] **Step 5:** `git init`, commit `chore: khung Vite + React + TS, test, lint, CSS giao diện mới`.

### Task 2: Lỗi và báo lỗi

**Files:** Create `src/core/errors/{exceptions.ts,reportError.ts,globalHandlers.ts,index.ts}` · Test `src/core/errors/errors.test.ts`

**Interfaces:**
- Produces:
  - `class AppException extends Error { code: string; cause?: unknown }`
  - `class ApiException extends AppException { status: number }`
  - `class NetworkException extends AppException { code: 'OFFLINE' | 'TIMEOUT' }`
  - `toAppException(e: unknown): AppException`
  - `interface ErrorReporter { report(e: AppException, ctx?: Record<string, unknown>): void }`
  - `setErrorReporter(r: ErrorReporter): void`, `reportError(e: unknown, ctx?): void` (bỏ qua `ApiException` 4xx: lỗi nghiệp vụ, không phải lỗi app)
  - `installGlobalErrorHandlers(w: Window): () => void`

- [ ] **Step 1: Test:**
  - `toAppException(new TypeError('x'))` là `AppException` code `UNKNOWN`;
  - `reportError(new ApiException(400,'THIEU_TEN','…'))` không gọi reporter;
  - `reportError(new Error('a'))` gọi reporter một lần;
  - `installGlobalErrorHandlers` bắt `unhandledrejection` và gỡ được.
- [ ] **Step 2:** Chạy → FAIL. **Step 3:** Cài đặt. **Step 4:** Chạy → PASS. **Step 5:** Commit `feat(core): ngoại lệ app/api/mạng và reportError cắm được`.

### Task 3: Storage và cookie

**Files:** Create `src/core/storage/{storage.ts,cookies.ts,index.ts}` · Test `src/core/storage/storage.test.ts`

**Interfaces:**
- Produces:
  - `createStorage(kind: 'local' | 'session', prefix = 'vih-'): { get<T>(key: string, fallback: T): T; set<T>(key: string, value: T): void; remove(key: string): void }` (JSON; mọi lỗi nuốt, trả `fallback`)
  - `getCookie(name): string | null`, `setCookie(name, value, { maxAge?, path = '/', sameSite = 'Lax' })`, `deleteCookie(name)`

- [ ] **Step 1: Test:**
  - set/get khứ hồi;
  - `storage ném lỗi thì get trả fallback` (giả `Storage.prototype.getItem` ném);
  - giá trị không phải JSON trả fallback;
  - `setCookie('a','b c')` rồi `getCookie('a') === 'b c'` (mã hoá URL);
  - `deleteCookie` xoá.
- [ ] **Step 2–4:** FAIL → cài đặt → PASS. **Step 5:** Commit `feat(core): storage an toàn và cookie`.

### Task 4: HTTP client

**Files:** Create `src/core/http/{httpClient.ts,index.ts}`, `src/core/config.ts` · Test `src/core/http/httpClient.test.ts` (MSW)

**Interfaces:**
- Consumes: Task 2 exceptions.
- Produces:
  - `http.get<T>(path: string, opts?: { signal?: AbortSignal; timeoutMs?: number }): Promise<T>`
  - `http.post<T>(path: string, body?: unknown, opts?): Promise<T>`
  - `http.postBinary<T>(path: string, body: Blob, contentType: string, opts?): Promise<T>`
  - `setUnauthorizedHandler(fn: () => void): void`
  - `config.apiBase = '/api'`, `config.timeoutMs = 20000`

- [ ] **Step 1: Test:**
  - gửi `X-VIH: 1`, `credentials: 'same-origin'`;
  - 400 `{code:'THIEU_TEN',message:'Cần nhập tên'}` → `ApiException` đúng `status/code/message`;
  - 401 gọi handler đúng một lần rồi ném `ApiException`;
  - quá `timeoutMs` → `NetworkException TIMEOUT`;
  - `TypeError fetch → NetworkException OFFLINE`;
  - phản hồi 500 không phải JSON → `ApiException` code `MAY_CHU_LOI`.
- [ ] **Step 2–4.** **Step 5:** Commit `feat(core): http client có timeout, ánh xạ lỗi, 401`.

### Task 5: Kiểu dữ liệu và repository

**Files:**
- Create `src/domain/types.ts` (AppState và các thực thể dùng ở kế hoạch 1: `User`, `Role`, `Task`, `CalEvent`, `Notif`, `Project`, `Checkin`, `Initiative`, `Settings`; trường chưa dùng để `[k: string]: unknown`)
- Create `src/data/{authRepo.ts,stateRepo.ts,rpc.ts,liveEvents.ts,index.ts}`
- Test `src/data/data.test.ts`

**Interfaces:**
- Produces:
  - `authRepo.session(): Promise<AppState | null>` (`GET /phien`; 401 `CHUA_DANG_NHAP` → `null`)
  - `authRepo.login(email: string, matKhau: string): Promise<AppState>` (`POST /dang-nhap` → `.state`)
  - `authRepo.logout(): Promise<void>` (`POST /dang-xuat`)
  - `authRepo.forgot(email: string): Promise<void>` (`POST /quen-mat-khau`)
  - `stateRepo.get(): Promise<AppState>` (`GET /trang-thai` → `.state`)
  - `rpc<R = unknown>(fn: string, ...args: unknown[]): Promise<{ result: R; state: AppState }>`
  - `subscribeLive(onChange: () => void): () => void` (EventSource `/api/su-kien`, nghe `san-sang`, `cap-nhat`)

- [ ] **Step 1: Test:**
  - `rpc('luuDoiTac', {ten:'A'})` gửi body `{fn:'luuDoiTac', args:['me',{ten:'A'}], ids:[]}` và `key` khớp `/^[A-Za-z0-9]{8,40}$/`;
  - `session()` trả `null` khi 401;
  - `login` trả `state`;
  - `subscribeLive` gọi `onChange` khi có `cap-nhat` (EventSource giả) và đóng khi huỷ.
- [ ] **Step 2–4.** **Step 5:** Commit `feat(data): repository phiên, trạng thái, rpc, SSE`.

### Task 6: Store zustand

**Files:** Create `src/store/{createPersistedStore.ts,uiStore.ts,sessionStore.ts,toastStore.ts,index.ts}` · Test `src/store/store.test.ts`

**Interfaces:**
- Consumes: Task 3 `createStorage`.
- Produces:
  - `createPersistedStore<T>(key: string, initial: T, kind?: 'local' | 'session')`: store zustand tự lưu/đọc qua storage.
  - `useUiStore`: `{ theme: 'light' | 'dark' | 'auto'; lang: 'vi' | 'en'; setTheme; setLang }`. Theme lưu khoá `vih-tema` (trùng app cũ); áp `data-theme` lên `<html>`.
  - `useSessionStore`: `{ status: 'unknown' | 'guest' | 'authed'; meId: string | null; setAuthed(id); setGuest() }`
  - `useToastStore`: `{ items: Toast[]; push(text: string, tone?: 'ok' | 'bad' | 'info'): void; dismiss(id) }`. Tự ẩn sau 4 giây; tối đa 3.

- [ ] **Step 1: Test:**
  - đổi theme lưu vào `localStorage['vih-tema']` và đặt `data-theme`;
  - nạp lại store đọc giá trị đã lưu;
  - toast thứ 4 đẩy toast cũ nhất ra;
  - toast tự ẩn (fake timers).
- [ ] **Step 2–4.** **Step 5:** Commit `feat(store): base store lưu được, ui/phiên/toast`.

### Task 7: Lớp query, đồng bộ trực tiếp, xử lý lỗi thao tác

**Files:** Create `src/app/queryClient.ts`, `src/data/hooks/{useAppState.ts,useRpc.ts,useLiveSync.ts,index.ts}` · Test `src/data/hooks/hooks.test.tsx`

**Interfaces:**
- Consumes: Tasks 4–6.
- Produces:
  - `queryClient`: không thử lại `ApiException`; thử lại tối đa 2 lần với `NetworkException`.
  - `useAppState(): UseQueryResult<AppState>` (khoá `['state']`)
  - `useMe(): User | undefined`
  - `useRpc<R>(fn: string, opts?: { successMsg?: string }): UseMutationResult<R, AppException, unknown[]>`. Thành công: `setQueryData(['state'], res.state)` và toast `successMsg`. Lỗi: toast `message`; `XUNG_DOT` thì làm mới `['state']`.
  - `useLiveSync()`: dùng `subscribeLive` → `invalidateQueries(['state'])`.

- [ ] **Step 1: Test:**
  - `useRpc` thay cache bằng `state` mới;
  - `useRpc trả về trạng thái lỗi khi OFFLINE` và toast "Mất kết nối…";
  - `XUNG_DOT` làm mới `['state']`;
  - `về đăng nhập khi trang-thai trả 401` (`sessionStore.status === 'guest'`, gọi đúng một lần).
- [ ] **Step 2–4.** **Step 5:** Commit `feat(data): hook trạng thái, rpc, đồng bộ SSE`.

### Task 8: Đa ngôn ngữ

**Files:** Create `src/core/i18n/{i18n.ts,index.ts}`, `src/locales/{vi,en}/{common,auth,home,chat}.json` · Test `src/core/i18n/i18n.test.ts`

**Interfaces:**
- Produces:
  - `initI18n(lang: 'vi' | 'en'): Promise<void>`; dùng `useTranslation(ns)`.
  - Đổi `useUiStore.lang` thì `i18n.changeLanguage`.
  - Định dạng ngày/số theo `lang` qua `formatDate(d, style)`, `formatNumber(n)` (Intl).

- [ ] **Step 1: Test:**
  - `t('common:actions.save')` = "Lưu" (vi) / "Save" (en);
  - khoá thiếu ở `en` rơi về `vi`;
  - `formatNumber(1234567)` = "1.234.567" (vi).
- [ ] **Step 2–4.** **Step 5:** Commit `feat(i18n): vi/en, định dạng ngày số`.

### Task 9: Component chung – phần tĩnh

**Files:** Create `src/shared/ui/{Icon.tsx,icons.ts,Button.tsx,IconButton.tsx,Chip.tsx,Card.tsx,Avatar.tsx,Spinner.tsx,EmptyState.tsx,Stat.tsx,Hero.tsx,Row.tsx,TaskCard.tsx,EventCard.tsx,index.ts}` · Test `src/shared/ui/static.test.tsx`

**Interfaces:**
- Produces: component theo `refactor-design/05-common-components.md` và `web/ui-kit.js` (nhánh anh IT), cùng class `c-*` và props tương ứng:
  - `Button { kind?: 'primary' | 'ink' | 'white' | 'default' | 'link' | 'danger'; size?: 'sm' | 'md' | 'lg'; icon?: IconName; loading?: boolean; href?; onClick? }`
  - `IconButton { label: string (bắt buộc, aria-label); icon }`
  - `Chip { label; icon?; tone?: Tone }`; `Tone = 'rose' | 'coral' | 'amber' | 'sky' | 'mint' | 'slate'`
  - `Avatar { name; src?; status? }`
  - `EmptyState { icon; title; text?; action? }`
  - `Stat { label; value: number; icon; tone; onClick? | href? }`
  - `Hero { title; value; unit; sub; tone; ring: { value: number; label: string } }`
  - `Row { title; sub?; href?; lead?; right?; below? }`
  - `TaskCard`, `EventCard`: props như `UI.taskCard`, `UI.eventCard`
  - `icons.ts`: chuyển từ `web/icons-fluent.js` sang `Record<IconName, {16?:string;20?:string;24?:string;f16?:string;f20?:string;f24?:string}>`; `IconName` là union.

- [ ] **Step 1: Test:**
  - `Button loading` có `aria-busy="true"` và bị vô hiệu;
  - `IconButton` thiếu `label` thì lỗi kiểu (test kiểu bằng `// @ts-expect-error`);
  - `Stat` hiện số theo `vi-VN`;
  - `Icon name="khong-co"` không vỡ (rơi về `info`);
  - `TaskCard` có liên kết `#/tasks/<id>`.
- [ ] **Step 2–4.** **Step 5:** Commit `feat(ui): component tĩnh theo ui-kit`.

### Task 10: Component chung – phần tương tác

**Files:** Create `src/shared/ui/{Field.tsx,Input.tsx,Textarea.tsx,Select.tsx,Switch.tsx,Tabs.tsx,Menu.tsx,Sheet.tsx,ConfirmSheet.tsx,ToastViewport.tsx,Banner.tsx}` · Test `src/shared/ui/interactive.test.tsx`

**Interfaces:**
- Produces:
  - `Field { label; hint?; error?; optional?; children }` gắn `htmlFor`, `aria-describedby`, `aria-invalid`
  - `Tabs { label; value; items: {id;label;icon?;count?}[]; onChange }` (mũi tên trái/phải chuyển tab, `aria-selected`)
  - `Menu { label; items: {label;icon?;onSelect;danger?}[] }` (Esc đóng, trả tiêu điểm)
  - `Sheet { open; title; onClose; children; footer? }` (portal `#sheet`, bẫy tiêu điểm, Esc đóng, `aria-modal`)
  - `ConfirmSheet { title; intro?; fields?; okLabel; danger?; onSubmit(values) }`: thay `askSheet` cũ
  - `ToastViewport` đọc `useToastStore`, `role="status"`, `aria-live="polite"`
  - Chuyển động theo bảng mục 2 tài liệu 05; tắt khi `prefers-reduced-motion`

- [ ] **Step 1: Test:**
  - `Field error` gắn `aria-invalid` và `role="alert"`;
  - `Tabs` mũi tên phải chuyển tab;
  - `Sheet` Esc gọi `onClose` và trả tiêu điểm về nút mở;
  - `ConfirmSheet` có ô `required` thì không gửi khi trống;
  - `ToastViewport` hiện toast mới.
- [ ] **Step 2–4.** **Step 5:** Commit `feat(ui): component tương tác, sheet, toast`.

### Task 11: Router, bảo vệ đăng nhập, khung app

**Files:**
- Create `src/app/{router.tsx,Providers.tsx,AppErrorView.tsx}`, `src/routes/*` (file-based, `__root.tsx`, `_auth.tsx`, `_app.tsx`, `_app/today.tsx`, `_app/$.tsx` cho route chưa làm), `src/layouts/{AppShell.tsx,SideNav.tsx,BottomBar.tsx,TopBar.tsx,AuthLayout.tsx}`
- Create `src/domain/{permissions.ts,menu.ts}`
- Test `src/app/router.test.tsx`, `src/domain/permissions.test.ts`

**Interfaces:**
- Consumes: Tasks 5–10.
- Produces:
  - `has(u: User, perm: Perm, roles: Role[]): boolean`, `canAssign(u, state): boolean` (chép quy tắc từ `web/core.js` `has`/`canAssign`; cấp 1 có mọi quyền)
  - `buildMenu(u, state): { nhomViec: MenuItem[]; tienIch: MenuItem[] }`: theo `NHOM_VIEC` của app cũ
  - `_app.beforeLoad`: `status === 'guest'` → chuyển `/login`
  - `AppShell` (≥ 900 px thanh bên; < 900 px thanh dưới Hôm nay · Lịch · ＋ · Việc · Tin nhắn)
  - `errorComponent` = `AppErrorView` (gọi `reportError`, nút Thử lại)

- [ ] **Step 1: Test:**
  - khách mở `#/today` thì về `#/login`;
  - đã đăng nhập mở `#/login` thì về `#/today`;
  - `has` cho Chủ tịch mọi quyền, Chuyên viên không có `tatca`;
  - menu Chuyên viên không có Quản trị;
  - route lạ hiện khung "Đang chuyển sang bản mới".
- [ ] **Step 2–4.** **Step 5:** Commit `feat(app): router hash, bảo vệ đăng nhập, khung app`.

### Task 12: Trang Đăng nhập

**Files:** Create `src/features/auth/{LoginPage.tsx,ForgotSheet.tsx,useLogin.ts}`, `src/routes/_auth/login.tsx` · Test `src/features/auth/login.test.tsx`

**Interfaces:**
- Consumes: `authRepo.login`, `authRepo.forgot`, `useSessionStore`, `queryClient`.
- Produces: giao diện theo `loginView()` nhánh anh IT (`web/app.js` dòng 472+): logo, email, mật khẩu (hiện/ẩn), nút Đăng nhập, "Quên mật khẩu". Nút đăng nhập nhanh theo vai trò chỉ hiện khi `import.meta.env.DEV`.

- [ ] **Step 1: Test:**
  - đăng nhập đúng thì đặt `['state']` và chuyển `#/today`;
  - sai mật khẩu hiện `message` máy chủ dưới form, không xoá email;
  - bấm hai lần chỉ gửi một lệnh;
  - "Quên mật khẩu" gửi email và báo đã gửi.
- [ ] **Step 2–4.** **Step 5:** Commit `feat(auth): trang đăng nhập, quên mật khẩu`.

### Task 13: Chat UI kit (trợ lý AI, HTML artifact)

**Files:** Create `src/data/assistantRepo.ts`, `src/features/assistant/{sse.ts,artifacts.ts,useAssistant.ts,ChatPanel.tsx,MessageList.tsx,Composer.tsx,ArtifactFrame.tsx}` · Test `src/features/assistant/{sse.test.ts,artifacts.test.ts,chat.test.tsx}`

**Interfaces:**
- Produces:
  - `parseSse(chunk: string, buf: { rest: string }): { event: string; data: string }[]`: chịu được khối bị cắt giữa chừng
  - `assistantRepo.ask(question: string, conversationId: string | undefined, onEvent: (e: AgentEvent) => void, signal: AbortSignal): Promise<void>`: `POST /api/assistant`, đọc `ReadableStream`
  - `AgentEvent = { type: 'delta'; text } | { type: 'artifact'; html; title? } | { type: 'done' } | { type: 'error'; code }`; ánh xạ sự kiện của agent trong một hàm `toAgentEvent({event,data})` (giữ phần thô để chỉnh khi biết định dạng VoltAgent)
  - `splitArtifacts(text: string): ({ kind: 'text'; text } | { kind: 'html'; html; title? })[]`: tách khối ```` ```html ````
  - `ArtifactFrame { html; title? }`: `<iframe sandbox="allow-scripts" srcdoc>` có CSP meta ở mục 3 spec, tự đặt chiều cao, nút "Mở toàn màn hình"
  - `useAssistant()`: `{ messages; send(q); stop(); retry() }`, giữ `conversationId` trong `sessionStorage`

- [ ] **Step 1: Test:**
  - `parseSse` ghép đúng khi khối bị cắt giữa `data:`;
  - `splitArtifacts` tách văn bản và hai khối html theo thứ tự;
  - `iframe có sandbox allow-scripts và không có allow-same-origin`;
  - `srcdoc có CSP default-src 'none'`;
  - nhận từng `delta` thì tin nhắn dài dần;
  - `sự kiện error kết thúc tin nhắn với trạng thái lỗi` và có nút Gửi lại;
  - câu hỏi trống hoặc > 2000 ký tự không gửi.
- [ ] **Step 2–4.** **Step 5:** Commit `feat(assistant): chat UI kit, SSE, HTML artifact trong sandbox`.

### Task 14: Trang Home

**Files:**
- Create `src/domain/{tasks.ts,calendar.ts,checkin.ts,dates.ts}` (hàm thuần chép từ `web/core.js` nhánh `feat/sang-kien-11-07`: `isOpen`, `isOver`, `scored`, `pendingFor`, `titleFor`, `relText`, `checkinToday`, `subordinates`, `lichCoNgay`, `lichDangDien`, `monday`, `addDays`, `ymd`)
- Create `src/features/home/{HomePage.tsx,HomeHeader.tsx,WeekHero.tsx,HomeStats.tsx,TabCanLam.tsx,TabLich.tsx,TabDoi.tsx,TabBangTin.tsx}`, `src/routes/_app/today.tsx`
- Test `src/domain/tasks.test.ts`, `src/features/home/home.test.tsx` (dữ liệu mẫu theo vai trò trong `src/test/fixtures/state.ts`)

**Interfaces:**
- Consumes: Tasks 7, 9–11, 13.
- Produces: giao diện như `viewToday()` nhánh anh IT:
  - đầu trang: lời chào, nút Giao việc / Đề xuất việc, Thêm lịch;
  - Hero "Tiến độ tuần";
  - 4 ô số: Chờ tôi quyết, Quá hạn, Hạn hôm nay, Lịch hôm nay;
  - 4 tab: Cần làm, Lịch, Đội, Bảng tin. Tab Bảng tin có `ChatPanel`.
  - Thao tác trong thẻ (Nhận việc, Duyệt…) gọi `useRpc`. Mở chi tiết việc, lịch thì chuyển route (kế hoạch 2–3).

- [ ] **Step 1: Test:**
  - `isOver` đúng ở biên giờ;
  - `pendingFor` cho Chủ tịch gồm việc chờ chấm;
  - Home của Chuyên viên hiện "Đề xuất việc", của Chủ tịch hiện "Giao việc";
  - đếm Quá hạn chỉ tính việc của chính mình;
  - việc Bảo mật không lộ tiêu đề (dùng tiêu đề máy chủ đã che);
  - nút "Nhận việc" gọi `rpc('nhanViec', id)`.
- [ ] **Step 2–4.** **Step 5:** Commit `feat(home): trang Hôm nay theo giao diện mới`.

### Task 15: Chạy thật, repo GitHub, CI

**Files:** Create `.github/workflows/ci.yml` (npm ci, lint, typecheck, test, build); cập nhật `README.md` (chạy cùng máy chủ chạy thử, cấu trúc thư mục, quy ước)

- [ ] **Step 1:** Chạy `node server/api/chay-thu-cuc-bo.js` trong `Web_Notification` và `npm run dev`. Thử bằng Chrome ở 390 px và 1440 px, các vai Chủ tịch / Chánh Văn phòng / Chuyên viên: đăng nhập, Home, đổi tab, nhận việc, đổi theme, đổi ngôn ngữ, đăng xuất. Console không lỗi.
- [ ] **Step 2:** `gh repo create Tai30092004/vih-fe --private --source . --push`.
- [ ] **Step 3:** CI xanh trên GitHub.
