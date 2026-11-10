import { afterEach, describe, expect, test, vi } from 'vitest'
import { createStorage, deleteCookie, getCookie, setCookie } from './index'

afterEach(() => {
  vi.restoreAllMocks()
  localStorage.clear()
  sessionStorage.clear()
})

describe('createStorage', () => {
  test('set rồi get trả đúng giá trị (JSON), có tiền tố vih-', () => {
    const s = createStorage('local')
    s.set('tab', { a: 1 })
    expect(s.get('tab', null)).toEqual({ a: 1 })
    expect(localStorage.getItem('vih-tab')).toBe('{"a":1}')
  })
  test('sessionStorage dùng đúng kho', () => {
    createStorage('session').set('x', 2)
    expect(sessionStorage.getItem('vih-x')).toBe('2')
  })
  test('storage ném lỗi thì get trả fallback, set không ném', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => { throw new Error('chặn') })
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => { throw new Error('chặn') })
    const s = createStorage('local')
    expect(s.get('a', 'mac-dinh')).toBe('mac-dinh')
    expect(() => s.set('a', 1)).not.toThrow()
  })
  test('giá trị không phải JSON trả fallback', () => {
    localStorage.setItem('vih-hong', '{khong-phai-json')
    expect(createStorage('local').get('hong', 7)).toBe(7)
  })
  test('remove xoá khoá', () => {
    const s = createStorage('local')
    s.set('a', 1)
    s.remove('a')
    expect(s.get('a', null)).toBeNull()
  })
})

describe('cookie', () => {
  test('setCookie mã hoá giá trị, getCookie đọc lại đúng', () => {
    setCookie('a', 'b c;d')
    expect(getCookie('a')).toBe('b c;d')
  })
  test('cookie không có trả null', () => {
    expect(getCookie('khong-co')).toBeNull()
  })
  test('deleteCookie xoá', () => {
    setCookie('x', '1')
    deleteCookie('x')
    expect(getCookie('x')).toBeNull()
  })
})
