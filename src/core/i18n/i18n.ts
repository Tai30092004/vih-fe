import i18next from 'i18next'
import { initReactI18next } from 'react-i18next'
import enAuth from '@/locales/en/auth.json'
import enChat from '@/locales/en/chat.json'
import enCommon from '@/locales/en/common.json'
import enHome from '@/locales/en/home.json'
import viAuth from '@/locales/vi/auth.json'
import viChat from '@/locales/vi/chat.json'
import viCommon from '@/locales/vi/common.json'
import viHome from '@/locales/vi/home.json'

export type Lang = 'vi' | 'en'
export const i18n = i18next

const resources = {
  vi: { common: viCommon, auth: viAuth, home: viHome, chat: viChat },
  en: { common: enCommon, auth: enAuth, home: enHome, chat: enChat },
} as const

/** Tiếng Việt là mặc định và là ngôn ngữ dự phòng: khoá thiếu bản tiếng Anh thì hiện tiếng Việt. */
export async function initI18n(lang: Lang): Promise<void> {
  if (i18n.isInitialized) {
    await i18n.changeLanguage(lang)
    return
  }
  await i18n.use(initReactI18next).init({
    resources,
    lng: lang,
    fallbackLng: 'vi',
    defaultNS: 'common',
    ns: ['common', 'auth', 'home', 'chat'],
    interpolation: { escapeValue: false },   // React đã tự thoát chữ
    returnNull: false,
  })
}

const locale = () => (i18n.language === 'en' ? 'en-GB' : 'vi-VN')
const two = (n: number) => String(n).padStart(2, '0')

export function formatNumber(n: number, dec = 0): string {
  return n.toLocaleString(locale(), { minimumFractionDigits: dec, maximumFractionDigits: dec })
}

/** dm: 10/11 · dmy: 10/11/2026 · hm: 09:05 · full: thứ, ngày tháng năm theo ngôn ngữ */
export function formatDate(d: Date, style: 'dm' | 'dmy' | 'hm' | 'full'): string {
  if (style === 'dm') return `${two(d.getDate())}/${two(d.getMonth() + 1)}`
  if (style === 'dmy') return `${two(d.getDate())}/${two(d.getMonth() + 1)}/${d.getFullYear()}`
  if (style === 'hm') return `${two(d.getHours())}:${two(d.getMinutes())}`
  return d.toLocaleDateString(locale(), { weekday: 'long', day: '2-digit', month: '2-digit', year: 'numeric' })
}
