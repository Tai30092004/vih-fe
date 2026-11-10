/** Lỗi trong app (gốc của mọi lỗi app tự ném hoặc đã chuẩn hoá). */
export class AppException extends Error {
  readonly code: string
  override readonly cause?: unknown

  constructor(code: string, message: string, cause?: unknown) {
    super(message)
    this.name = 'AppException'
    this.code = code
    this.cause = cause
  }
}

/** Máy chủ trả lỗi: `{ code, message }` kèm mã HTTP. */
export class ApiException extends AppException {
  readonly status: number

  constructor(status: number, code: string, message: string, cause?: unknown) {
    super(code, message, cause)
    this.name = 'ApiException'
    this.status = status
  }

  /** 4xx: lỗi nghiệp vụ hoặc quyền (người dùng cần biết), không phải lỗi app. */
  get isClientError(): boolean {
    return this.status >= 400 && this.status < 500
  }
}

export type NetworkCode = 'OFFLINE' | 'TIMEOUT'

/** Không tới được máy chủ: mất mạng hoặc quá thời gian chờ. */
export class NetworkException extends AppException {
  declare readonly code: NetworkCode

  constructor(code: NetworkCode, message: string, cause?: unknown) {
    super(code, message, cause)
    this.name = 'NetworkException'
  }
}

/** Chuẩn hoá mọi thứ bị ném thành AppException (giữ lỗi gốc ở `cause`). */
export function toAppException(e: unknown): AppException {
  if (e instanceof AppException) return e
  const message = e instanceof Error ? e.message : String(e)
  return new AppException('UNKNOWN', message, e)
}
