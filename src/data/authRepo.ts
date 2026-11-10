import { ApiException } from '@/core/errors'
import { http } from '@/core/http'
import type { AppState } from '@/domain/types'

export const authRepo = {
  /** Phiên hiện tại; chưa đăng nhập thì null. */
  async session(): Promise<AppState | null> {
    try {
      return (await http.get<{ state: AppState }>('/phien')).state
    } catch (e) {
      if (e instanceof ApiException && e.status === 401) return null
      throw e
    }
  },
  async login(email: string, matKhau: string): Promise<AppState> {
    return (await http.post<{ state: AppState }>('/dang-nhap', { email, matKhau })).state
  },
  async logout(): Promise<void> {
    await http.post('/dang-xuat')
  },
  async forgot(email: string): Promise<void> {
    await http.post('/quen-mat-khau', { email })
  },
}
