import { QueryClientProvider } from '@tanstack/react-query'
import { act, renderHook, waitFor } from '@testing-library/react'
import { http as mswHttp, HttpResponse } from 'msw'
import type { ReactNode } from 'react'
import { beforeEach, expect, test, vi } from 'vitest'
import { createQueryClient, installAuthHandling } from '@/app/queryClient'
import { server } from '@/test/msw'
import { useSessionStore, useToastStore } from '@/store'
import { useAppState, useMe, useRpc } from './index'

const S1 = { me: 'cv1', users: [{ id: 'cv1', name: 'Chuyên viên 1' }], tasks: [] }
const S2 = { ...S1, tasks: [{ id: 't1' }] }

function setup() {
  const qc = createQueryClient()
  const wrapper = ({ children }: { children: ReactNode }) => <QueryClientProvider client={qc}>{children}</QueryClientProvider>
  return { qc, wrapper }
}

beforeEach(() => {
  useToastStore.setState({ items: [] })
  useSessionStore.setState({ status: 'authed', meId: 'cv1' })
})

test('useAppState tải trạng thái, useMe trả người đăng nhập', async () => {
  server.use(mswHttp.get('*/api/trang-thai', () => HttpResponse.json({ state: S1 })))
  const { wrapper } = setup()
  const { result } = renderHook(() => ({ s: useAppState(), me: useMe() }), { wrapper })
  await waitFor(() => expect(result.current.s.isSuccess).toBe(true))
  expect(result.current.me?.name).toBe('Chuyên viên 1')
})

test('useRpc thay cache bằng state mới và báo thành công', async () => {
  server.use(mswHttp.post('*/api/rpc', () => HttpResponse.json({ result: 'ok', state: S2 })))
  const { qc, wrapper } = setup()
  qc.setQueryData(['state'], S1)
  const { result } = renderHook(() => useRpc<string>('nhanViec', { successMsg: 'Đã nhận việc' }), { wrapper })
  await act(() => result.current.mutateAsync(['t1']))
  expect(qc.getQueryData(['state'])).toEqual(S2)
  expect(useToastStore.getState().items[0]).toMatchObject({ text: 'Đã nhận việc', tone: 'ok' })
})

test('useRpc trả về trạng thái lỗi khi OFFLINE và toast Mất kết nối', async () => {
  server.use(mswHttp.post('*/api/rpc', () => HttpResponse.error()))
  const { wrapper } = setup()
  const { result } = renderHook(() => useRpc('nhanViec'), { wrapper })
  await act(async () => { await result.current.mutateAsync(['t1']).catch(() => {}) })
  await waitFor(() => expect(result.current.isError).toBe(true))
  expect(result.current.isPending).toBe(false)
  expect(useToastStore.getState().items[0]?.text).toMatch(/Mất kết nối/)
})

test('lỗi nghiệp vụ: toast đúng message máy chủ', async () => {
  server.use(mswHttp.post('*/api/rpc', () => HttpResponse.json({ code: 'THIEU_TEN', message: 'Cần nhập tên' }, { status: 400 })))
  const { wrapper } = setup()
  const { result } = renderHook(() => useRpc('luuDoiTac'), { wrapper })
  await act(async () => { await result.current.mutateAsync([{}]).catch(() => {}) })
  expect(useToastStore.getState().items[0]).toMatchObject({ text: 'Cần nhập tên', tone: 'bad' })
})

test('XUNG_DOT thì làm mới trạng thái', async () => {
  let lanTai = 0
  server.use(
    mswHttp.post('*/api/rpc', () => HttpResponse.json({ code: 'XUNG_DOT', message: 'Vừa có người sửa' }, { status: 409 })),
    mswHttp.get('*/api/trang-thai', () => { lanTai++; return HttpResponse.json({ state: S2 }) }),
  )
  const { qc, wrapper } = setup()
  renderHook(() => useAppState(), { wrapper })
  await waitFor(() => expect(lanTai).toBe(1))
  const { result } = renderHook(() => useRpc('chamDiem'), { wrapper })
  await act(async () => { await result.current.mutateAsync(['t1', 5]).catch(() => {}) })
  await waitFor(() => expect(lanTai).toBe(2))
  expect(qc.getQueryData(['state'])).toEqual(S2)
})

test('về đăng nhập khi trang-thai trả 401: chuyển khách đúng một lần, xoá dữ liệu', async () => {
  server.use(mswHttp.get('*/api/trang-thai', () => HttpResponse.json({ code: 'CHUA_DANG_NHAP', message: 'Hết phiên' }, { status: 401 })))
  const { qc, wrapper } = setup()
  const setGuest = vi.spyOn(useSessionStore.getState(), 'setGuest')
  const go = installAuthHandling(qc)
  qc.setQueryData(['state'], S1)
  const { result } = renderHook(() => useAppState(), { wrapper })
  act(() => { void qc.invalidateQueries({ queryKey: ['state'] }) })
  await waitFor(() => expect(useSessionStore.getState().status).toBe('guest'))
  await waitFor(() => expect(result.current.isFetching).toBe(false))
  expect(setGuest).toHaveBeenCalledTimes(1)
  expect(qc.getQueryData(['state'])).toBeUndefined()
  go()
})
