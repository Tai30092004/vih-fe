import { ApiException, type AppException, toAppException } from './exceptions'

/** Nơi gửi lỗi (Sentry, Firebase…): cắm bằng setErrorReporter, mặc định ghi console khi dev. */
export interface ErrorReporter {
  report(e: AppException, ctx?: Record<string, unknown>): void
}

const consoleReporter: ErrorReporter = {
  report(e, ctx) {
    if (import.meta.env.DEV) console.error('[vih]', e.code, e, ctx ?? '')
  },
}

let reporter: ErrorReporter = consoleReporter

export function setErrorReporter(r: ErrorReporter): void {
  reporter = r
}

/** Báo lỗi app. Lỗi nghiệp vụ (ApiException 4xx) bỏ qua; reporter hỏng cũng không làm vỡ app. */
export function reportError(e: unknown, ctx?: Record<string, unknown>): void {
  const err = toAppException(e)
  if (err instanceof ApiException && err.isClientError) return
  try {
    reporter.report(err, ctx)
  } catch {
    // reporter là phần phụ: lỗi của nó không được chặn luồng chính
  }
}
