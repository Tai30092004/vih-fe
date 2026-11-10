/** Cấu hình dùng chung. Đường dẫn API tương đối: bản dev đi qua proxy Vite, bản thật cùng tên miền với máy chủ. */
export const config = {
  apiBase: '/api',
  timeoutMs: 20_000,
} as const
