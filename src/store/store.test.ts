import { act } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'
import { createStorage } from '@/core/storage'
import { createPersistedStore, useToastStore, useUiStore, useSessionStore, readTheme } from './index'

beforeEach(() => localStorage.clear())
afterEach(() => vi.useRealTimers())

test('storage getRaw/setRaw ghi chuỗi thô, không tiền tố', () => {
  const s = createStorage('local')
  s.setRaw('vih-tema', 'toi')
  expect(localStorage.getItem('vih-tema')).toBe('toi')
  expect(s.getRaw('vih-tema')).toBe('toi')
})

describe('ui store', () => {
  test('đổi theme lưu vih-tema theo kiểu app cũ và đặt data-theme', () => {
    act(() => useUiStore.getState().setTheme('dark'))
    expect(localStorage.getItem('vih-tema')).toBe('toi')
    expect(document.documentElement.dataset.theme).toBe('dark')
    act(() => useUiStore.getState().setTheme('auto'))
    expect(localStorage.getItem('vih-tema')).toBe('tu_dong')
    expect(document.documentElement.dataset.theme).toBeUndefined()
  })
  test('readTheme đọc giá trị app cũ, giá trị lạ thì auto', () => {
    localStorage.setItem('vih-tema', 'sang')
    expect(readTheme()).toBe('light')
    localStorage.setItem('vih-tema', 'xyz')
    expect(readTheme()).toBe('auto')
  })
  test('đổi ngôn ngữ lưu lại', () => {
    act(() => useUiStore.getState().setLang('en'))
    expect(createStorage('local').get('ngon-ngu', 'vi')).toBe('en')
  })
})

test('createPersistedStore nạp lại giá trị đã lưu', () => {
  const a = createPersistedStore('thu', { n: 1 })
  a.setState({ n: 5 })
  const b = createPersistedStore('thu', { n: 1 })
  expect(b.getState()).toEqual({ n: 5 })
})

test('session store', () => {
  act(() => useSessionStore.getState().setAuthed('cv1'))
  expect(useSessionStore.getState()).toMatchObject({ status: 'authed', meId: 'cv1' })
  act(() => useSessionStore.getState().setGuest())
  expect(useSessionStore.getState()).toMatchObject({ status: 'guest', meId: null })
})

describe('toast', () => {
  beforeEach(() => useToastStore.setState({ items: [] }))
  test('tối đa 3: toast thứ 4 đẩy toast cũ nhất ra', () => {
    const { push } = useToastStore.getState()
    ;['a', 'b', 'c', 'd'].forEach(t => push(t))
    expect(useToastStore.getState().items.map(x => x.text)).toEqual(['b', 'c', 'd'])
  })
  test('tự ẩn sau 4 giây', () => {
    vi.useFakeTimers()
    useToastStore.getState().push('x', 'ok')
    expect(useToastStore.getState().items).toHaveLength(1)
    vi.advanceTimersByTime(4000)
    expect(useToastStore.getState().items).toHaveLength(0)
  })
  test('dismiss bỏ đúng toast', () => {
    useToastStore.getState().push('x')
    const id = useToastStore.getState().items[0]!.id
    useToastStore.getState().dismiss(id)
    expect(useToastStore.getState().items).toHaveLength(0)
  })
})
