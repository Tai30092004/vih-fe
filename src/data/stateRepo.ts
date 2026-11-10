import { http } from '@/core/http'
import type { AppState } from '@/domain/types'

export const stateRepo = {
  async get(): Promise<AppState> {
    return (await http.get<{ state: AppState }>('/trang-thai')).state
  },
}
