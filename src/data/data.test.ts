import { http as mswHttp, HttpResponse } from 'msw'
import { describe, expect, test, vi } from 'vitest'
import { server } from '@/test/msw'
import { authRepo, rpc, stateRepo, subscribeLive } from './index'

const STATE = { me: 'cv1', users: [], tasks: [], events: [] }

describe('rpc', () => {
  test('gửi {fn, args:[me,...], ids:[], key} và trả {result, state}', async () => {
    let body: Record<string, unknown> = {}
    server.use(mswHttp.post('*/api/rpc', async ({ request }) => {
      body = (await request.json()) as Record<string, unknown>
      return HttpResponse.json({ result: { id: 'd1' }, state: STATE })
    }))
    const r = await rpc('luuDoiTac', { ten: 'A' })
    expect(body).toMatchObject({ fn: 'luuDoiTac', args: ['me', { ten: 'A' }], ids: [] })
    expect(body.key).toMatch(/^[A-Za-z0-9]{8,40}$/)
    expect(r).toEqual({ result: { id: 'd1' }, state: STATE })
  })
  test('mỗi lệnh một key khác nhau', async () => {
    const keys: unknown[] = []
    server.use(mswHttp.post('*/api/rpc', async ({ request }) => {
      keys.push(((await request.json()) as { key: unknown }).key)
      return HttpResponse.json({ result: null, state: STATE })
    }))
    await rpc('a')
    await rpc('a')
    expect(keys[0]).not.toBe(keys[1])
  })
})

describe('authRepo', () => {
  test('session() trả null khi 401 CHUA_DANG_NHAP', async () => {
    server.use(mswHttp.get('*/api/phien', () => HttpResponse.json({ code: 'CHUA_DANG_NHAP', khach: {} }, { status: 401 })))
    await expect(authRepo.session()).resolves.toBeNull()
  })
  test('session() trả state khi còn phiên', async () => {
    server.use(mswHttp.get('*/api/phien', () => HttpResponse.json({ state: STATE })))
    await expect(authRepo.session()).resolves.toEqual(STATE)
  })
  test('login gửi email, matKhau và trả state', async () => {
    let body: unknown = null
    server.use(mswHttp.post('*/api/dang-nhap', async ({ request }) => {
      body = await request.json()
      return HttpResponse.json({ state: STATE })
    }))
    await expect(authRepo.login('cv1@vih.vn', 'mk')).resolves.toEqual(STATE)
    expect(body).toEqual({ email: 'cv1@vih.vn', matKhau: 'mk' })
  })
  test('logout và forgot gọi đúng đường dẫn', async () => {
    const goi: string[] = []
    server.use(
      mswHttp.post('*/api/dang-xuat', () => { goi.push('dx'); return HttpResponse.json({ ok: true }) }),
      mswHttp.post('*/api/quen-mat-khau', async ({ request }) => { goi.push('qmk:' + ((await request.json()) as { email: string }).email); return HttpResponse.json({ ok: true }) }),
    )
    await authRepo.logout()
    await authRepo.forgot('a@vih.vn')
    expect(goi).toEqual(['dx', 'qmk:a@vih.vn'])
  })
})

test('stateRepo.get trả state', async () => {
  server.use(mswHttp.get('*/api/trang-thai', () => HttpResponse.json({ state: STATE })))
  await expect(stateRepo.get()).resolves.toEqual(STATE)
})

test('subscribeLive gọi onChange khi có cap-nhat / san-sang và đóng khi huỷ', () => {
  const nghe: Record<string, () => void> = {}
  const close = vi.fn()
  class FakeES {
    url: string
    constructor(url: string) { this.url = url }
    addEventListener(ev: string, fn: () => void) { nghe[ev] = fn }
    close = close
  }
  const onChange = vi.fn()
  const huy = subscribeLive(onChange, FakeES as unknown as typeof EventSource)
  nghe['cap-nhat']?.()
  nghe['san-sang']?.()
  expect(onChange).toHaveBeenCalledTimes(2)
  huy()
  expect(close).toHaveBeenCalled()
})

test('subscribeLive không có EventSource thì trả hàm huỷ rỗng', () => {
  expect(() => subscribeLive(() => {}, undefined)()).not.toThrow()
})
