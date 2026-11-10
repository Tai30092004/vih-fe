import { create } from 'zustand'

export type ToastTone = 'ok' | 'bad' | 'info'
export interface Toast {
  id: number
  text: string
  tone: ToastTone
}

const TOI_DA = 3
const HIEN_MS = 4000
let soThuTu = 0

interface ToastState {
  items: Toast[]
  push(text: string, tone?: ToastTone): void
  dismiss(id: number): void
}

export const useToastStore = create<ToastState>((set, get) => ({
  items: [],
  push(text, tone = 'info') {
    const id = ++soThuTu
    set({ items: [...get().items, { id, text, tone }].slice(-TOI_DA) })
    setTimeout(() => get().dismiss(id), HIEN_MS)
  },
  dismiss(id) {
    set({ items: get().items.filter(t => t.id !== id) })
  },
}))

/** Gọi nhanh ngoài component (hook lỗi, repository). */
export const toast = (text: string, tone?: ToastTone) => useToastStore.getState().push(text, tone)
