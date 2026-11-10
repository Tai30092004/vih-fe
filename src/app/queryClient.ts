import { QueryClient } from '@tanstack/react-query'
import { NetworkException } from '@/core/errors'
import { setUnauthorizedHandler } from '@/core/http'
import { useSessionStore } from '@/store'

/** Lỗi máy chủ (ApiException) không thử lại; mất mạng / quá giờ thử lại tối đa 2 lần. */
export function createQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: (n, e) => e instanceof NetworkException && n < 2,
        refetchOnWindowFocus: true,
        staleTime: 30_000,
      },
      mutations: { retry: false },
    },
  })
}

/** 401 ở bất kỳ lệnh nào: chuyển về khách đúng một lần và xoá dữ liệu người cũ khỏi bộ nhớ. Trả hàm gỡ. */
export function installAuthHandling(qc: QueryClient): () => void {
  setUnauthorizedHandler(() => {
    const s = useSessionStore.getState()
    if (s.status === 'guest') return
    s.setGuest()
    qc.removeQueries({ queryKey: ['state'] })
  })
  return () => setUnauthorizedHandler(() => {})
}
