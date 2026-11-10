import { config } from '@/core/config'
import { ApiException, NetworkException } from '@/core/errors'

export interface RequestOptions {
  signal?: AbortSignal
  timeoutMs?: number
}

let onUnauthorized: () => void = () => {}

/** Gọi khi máy chủ trả 401 (phiên hết hạn): lớp trên chuyển về trang Đăng nhập. */
export function setUnauthorizedHandler(fn: () => void): void {
  onUnauthorized = fn
}

const url = (path: string) => new URL(config.apiBase + path, window.location.origin).toString()

async function readError(res: Response): Promise<ApiException> {
  try {
    const j = (await res.json()) as { code?: unknown; message?: unknown }
    if (typeof j.code === 'string') {
      return new ApiException(res.status, j.code, typeof j.message === 'string' ? j.message : j.code)
    }
  } catch {
    // thân không phải JSON (lỗi proxy, máy chủ sập)
  }
  return new ApiException(res.status, 'MAY_CHU_LOI', 'Máy chủ đang gặp sự cố, thử lại sau')
}

async function request<T>(method: 'GET' | 'POST', path: string, init: RequestInit, opts: RequestOptions = {}): Promise<T> {
  const ctl = new AbortController()
  const timeout = opts.timeoutMs ?? config.timeoutMs
  let timedOut = false
  const timer = setTimeout(() => {
    timedOut = true
    ctl.abort()
  }, timeout)
  const stop = () => ctl.abort()
  opts.signal?.addEventListener('abort', stop)
  let res: Response
  try {
    res = await fetch(url(path), {
      ...init,
      method,
      credentials: 'same-origin',
      headers: { 'X-VIH': '1', ...(init.headers as Record<string, string> | undefined) },
      signal: ctl.signal,
    })
  } catch (e) {
    if (timedOut) throw new NetworkException('TIMEOUT', 'Máy chủ phản hồi quá lâu, thử lại sau', e)
    if (opts.signal?.aborted) throw e
    throw new NetworkException('OFFLINE', 'Mất kết nối, kiểm tra mạng rồi thử lại', e)
  } finally {
    clearTimeout(timer)
    opts.signal?.removeEventListener('abort', stop)
  }
  if (!res.ok) {
    const err = await readError(res)
    if (res.status === 401) onUnauthorized()
    throw err
  }
  if (res.status === 204) return undefined as T
  return (await res.json()) as T
}

export const http = {
  get<T>(path: string, opts?: RequestOptions): Promise<T> {
    return request<T>('GET', path, {}, opts)
  },
  post<T>(path: string, body?: unknown, opts?: RequestOptions): Promise<T> {
    return request<T>('POST', path, { body: JSON.stringify(body ?? {}), headers: { 'Content-Type': 'application/json' } }, opts)
  },
  postBinary<T>(path: string, body: Blob, contentType: string, opts?: RequestOptions): Promise<T> {
    return request<T>('POST', path, { body, headers: { 'Content-Type': contentType } }, opts)
  },
}
