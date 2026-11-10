import { create } from 'zustand'

export type SessionStatus = 'unknown' | 'guest' | 'authed'

interface SessionState {
  status: SessionStatus
  meId: string | null
  setAuthed(id: string): void
  setGuest(): void
}

/** Chỉ giữ trạng thái phiên phía giao diện; phiên thật là cookie HttpOnly do máy chủ quản. */
export const useSessionStore = create<SessionState>(set => ({
  status: 'unknown',
  meId: null,
  setAuthed: id => set({ status: 'authed', meId: id }),
  setGuest: () => set({ status: 'guest', meId: null }),
}))
