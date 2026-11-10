import { reportError } from './reportError'

/** Bắt lỗi không ai xử lý (window.onerror, promise bị từ chối). Trả hàm gỡ. */
export function installGlobalErrorHandlers(w: Window): () => void {
  const onError = (ev: ErrorEvent) => reportError(ev.error ?? ev.message, { nguon: 'window.error' })
  const onRejection = (ev: Event) => reportError((ev as PromiseRejectionEvent).reason, { nguon: 'unhandledrejection' })
  w.addEventListener('error', onError)
  w.addEventListener('unhandledrejection', onRejection)
  return () => {
    w.removeEventListener('error', onError)
    w.removeEventListener('unhandledrejection', onRejection)
  }
}
