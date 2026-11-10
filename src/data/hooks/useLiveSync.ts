import { useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'
import { useSessionStore } from '@/store'
import { subscribeLive } from '../liveEvents'
import { STATE_KEY } from './useAppState'

/** Khi đã đăng nhập: nghe máy chủ báo thay đổi và tải lại dữ liệu. */
export function useLiveSync(): void {
  const qc = useQueryClient()
  const authed = useSessionStore(s => s.status === 'authed')
  useEffect(() => {
    if (!authed) return
    return subscribeLive(() => void qc.invalidateQueries({ queryKey: STATE_KEY }))
  }, [authed, qc])
}
