/// <reference types="vitest/config" />
import { fileURLToPath, URL } from 'node:url'
import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'

// Máy chủ API VIH chạy thử: node server/api/chay-thu-cuc-bo.js (repo Web_Notification) ở cổng 8766.
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  return {
    plugins: [react()],
    resolve: { alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) } },
    server: {
      proxy: { '/api': { target: env.VITE_API_TARGET || 'http://127.0.0.1:8766', changeOrigin: true } },
    },
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: ['src/test/setup.ts'],
      css: false,
    },
  }
})
