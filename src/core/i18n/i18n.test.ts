import { beforeAll, expect, test } from 'vitest'
import { formatDate, formatNumber, i18n, initI18n } from './index'

beforeAll(() => initI18n('vi'))

test('t lấy đúng chữ theo ngôn ngữ', async () => {
  expect(i18n.t('common:actions.save')).toBe('Lưu')
  await i18n.changeLanguage('en')
  expect(i18n.t('common:actions.save')).toBe('Save')
  await i18n.changeLanguage('vi')
})

test('khoá thiếu ở en rơi về vi', async () => {
  await i18n.changeLanguage('en')
  expect(i18n.t('common:test.chiCoTiengViet')).toBe('Chỉ có tiếng Việt')
  await i18n.changeLanguage('vi')
})

test('formatNumber theo vi-VN', () => {
  expect(formatNumber(1234567)).toBe('1.234.567')
})

test('formatDate dạng ngắn dd/mm và đầy đủ theo ngôn ngữ', () => {
  const d = new Date(2026, 10, 10, 9, 5)
  expect(formatDate(d, 'dm')).toBe('10/11')
  expect(formatDate(d, 'dmy')).toBe('10/11/2026')
  expect(formatDate(d, 'hm')).toBe('09:05')
})
