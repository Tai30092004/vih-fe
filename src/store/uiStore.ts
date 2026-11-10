import { create } from 'zustand'
import { createStorage } from '@/core/storage'

export type Theme = 'light' | 'dark' | 'auto'
export type Lang = 'vi' | 'en'

const kho = createStorage('local')
const KHOA_TEMA = 'vih-tema'   // dùng chung giá trị với app cũ: 'sang' | 'toi' | 'tu_dong'
const SANG_CU: Record<Theme, string> = { light: 'sang', dark: 'toi', auto: 'tu_dong' }

export function readTheme(): Theme {
  const v = kho.getRaw(KHOA_TEMA)
  return v === 'sang' ? 'light' : v === 'toi' ? 'dark' : 'auto'
}

export function applyTheme(t: Theme): void {
  const html = document.documentElement
  if (t === 'auto') delete html.dataset.theme
  else html.dataset.theme = t
}

interface UiState {
  theme: Theme
  lang: Lang
  setTheme(t: Theme): void
  setLang(l: Lang): void
}

export const useUiStore = create<UiState>(set => ({
  theme: readTheme(),
  lang: kho.get<Lang>('ngon-ngu', 'vi') === 'en' ? 'en' : 'vi',
  setTheme(theme) {
    kho.setRaw(KHOA_TEMA, SANG_CU[theme])
    applyTheme(theme)
    set({ theme })
  },
  setLang(lang) {
    kho.set('ngon-ngu', lang)
    set({ lang })
  },
}))
