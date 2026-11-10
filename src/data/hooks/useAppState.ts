import { useQuery, type UseQueryResult } from '@tanstack/react-query'
import type { AppState, User } from '@/domain/types'
import { useSessionStore } from '@/store'
import { stateRepo } from '../stateRepo'

export const STATE_KEY = ['state'] as const

/** Toàn bộ dữ liệu người đăng nhập được xem (máy chủ đã lọc). */
export function useAppState(): UseQueryResult<AppState> {
  const authed = useSessionStore(s => s.status !== 'guest')
  return useQuery({ queryKey: STATE_KEY, queryFn: () => stateRepo.get(), enabled: authed })
}

export function useMe(): User | undefined {
  const { data } = useAppState()
  return data?.users.find(u => u.id === data.me)
}
