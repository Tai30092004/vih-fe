import { afterEach, describe, expect, test, vi } from 'vitest'
import {
  ApiException,
  AppException,
  NetworkException,
  installGlobalErrorHandlers,
  reportError,
  setErrorReporter,
  toAppException,
} from './index'

describe('toAppException', () => {
  test('lỗi lạ thành AppException code UNKNOWN, giữ lỗi gốc', () => {
    const goc = new TypeError('x')
    const e = toAppException(goc)
    expect(e).toBeInstanceOf(AppException)
    expect(e.code).toBe('UNKNOWN')
    expect(e.cause).toBe(goc)
  })
  test('AppException giữ nguyên', () => {
    const e = new NetworkException('OFFLINE', 'Mất kết nối')
    expect(toAppException(e)).toBe(e)
  })
  test('ApiException có status, code, message', () => {
    const e = new ApiException(400, 'THIEU_TEN', 'Cần nhập tên')
    expect([e.status, e.code, e.message]).toEqual([400, 'THIEU_TEN', 'Cần nhập tên'])
    expect(e).toBeInstanceOf(AppException)
  })
})

describe('reportError', () => {
  const report = vi.fn()
  afterEach(() => {
    report.mockReset()
    setErrorReporter({ report: () => {} })
  })
  test('lỗi nghiệp vụ (ApiException 4xx) không báo', () => {
    setErrorReporter({ report })
    reportError(new ApiException(400, 'THIEU_TEN', 'Cần nhập tên'))
    expect(report).not.toHaveBeenCalled()
  })
  test('lỗi app báo đúng một lần, kèm ngữ cảnh', () => {
    setErrorReporter({ report })
    reportError(new Error('a'), { noi: 'thu' })
    expect(report).toHaveBeenCalledTimes(1)
    expect(report.mock.calls[0]?.[0]).toBeInstanceOf(AppException)
    expect(report.mock.calls[0]?.[1]).toEqual({ noi: 'thu' })
  })
  test('lỗi máy chủ 5xx có báo', () => {
    setErrorReporter({ report })
    reportError(new ApiException(500, 'MAY_CHU_LOI', 'Lỗi'))
    expect(report).toHaveBeenCalledTimes(1)
  })
  test('reporter ném lỗi thì không làm vỡ app', () => {
    setErrorReporter({ report: () => { throw new Error('reporter hỏng') } })
    expect(() => reportError(new Error('a'))).not.toThrow()
  })
})

test('installGlobalErrorHandlers bắt unhandledrejection và gỡ được', () => {
  const report = vi.fn()
  setErrorReporter({ report })
  const go = installGlobalErrorHandlers(window)
  const ev = new Event('unhandledrejection') as Event & { reason?: unknown }
  ev.reason = new Error('promise hỏng')
  window.dispatchEvent(ev)
  expect(report).toHaveBeenCalledTimes(1)
  go()
  window.dispatchEvent(ev)
  expect(report).toHaveBeenCalledTimes(1)
})
