import { http } from '@/core/http'
import type { AppState } from '@/domain/types'

const CHU = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

/** Mã chống ghi trùng cho mỗi lệnh (máy chủ nhớ kết quả theo mã, gửi lại khi rớt mạng không chạy hai lần). */
export function newRpcKey(len = 20): string {
  const b = crypto.getRandomValues(new Uint8Array(len))
  return Array.from(b, x => CHU[x % CHU.length]).join('')
}

export interface RpcResponse<R> {
  result: R
  state: AppState
}

/** Gọi một thao tác nghiệp vụ trên máy chủ. Tham số đầu là người gọi: máy chủ luôn thay bằng người đăng nhập. */
export function rpc<R = unknown>(fn: string, ...args: unknown[]): Promise<RpcResponse<R>> {
  return http.post<RpcResponse<R>>('/rpc', { fn, args: ['me', ...args], ids: [], key: newRpcKey() })
}
