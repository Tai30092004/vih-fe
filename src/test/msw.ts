import { setupServer } from 'msw/node'

/** Máy chủ giả cho test: mỗi test tự thêm handler bằng server.use(...). */
export const server = setupServer()
