import { delay, http as mswHttp, HttpResponse } from 'msw'
import { afterEach, describe, expect, test, vi } from 'vitest'
import { server } from '@/test/msw'
import { ApiException, NetworkException } from '@/core/errors'
import { http, setUnauthorizedHandler } from './index'

afterEach(() => setUnauthorizedHandler(() => {}))

describe('http', () => {
  test('gửi X-VIH: 1, credentials same-origin, JSON; trả dữ liệu', async () => {
    let hdr = '', body: unknown = null
    server.use(mswHttp.post('*/api/rpc', async ({ request }) => {
      hdr = request.headers.get('x-vih') ?? ''
      body = await request.json()
      expect(request.credentials).toBe('same-origin')
      return HttpResponse.json({ ok: 1 })
    }))
    await expect(http.post('/rpc', { a: 1 })).resolves.toEqual({ ok: 1 })
    expect(hdr).toBe('1')
    expect(body).toEqual({ a: 1 })
  })

  test('400 {code,message} → ApiException đúng status/code/message', async () => {
    server.use(mswHttp.post('*/api/rpc', () => HttpResponse.json({ code: 'THIEU_TEN', message: 'Cần nhập tên' }, { status: 400 })))
    const e = await http.post('/rpc', {}).catch((x: unknown) => x)
    expect(e).toBeInstanceOf(ApiException)
    expect(e).toMatchObject({ status: 400, code: 'THIEU_TEN', message: 'Cần nhập tên' })
  })

  test('401 gọi handler đúng một lần rồi ném ApiException', async () => {
    const h = vi.fn()
    setUnauthorizedHandler(h)
    server.use(mswHttp.get('*/api/trang-thai', () => HttpResponse.json({ code: 'CHUA_DANG_NHAP', message: 'Chưa đăng nhập' }, { status: 401 })))
    await expect(http.get('/trang-thai')).rejects.toBeInstanceOf(ApiException)
    expect(h).toHaveBeenCalledTimes(1)
  })

  test('quá timeoutMs → NetworkException TIMEOUT', async () => {
    server.use(mswHttp.get('*/api/cham', async () => { await delay('infinite'); return HttpResponse.json({}) }))
    const e = await http.get('/cham', { timeoutMs: 30 }).catch((x: unknown) => x)
    expect(e).toBeInstanceOf(NetworkException)
    expect(e).toMatchObject({ code: 'TIMEOUT' })
  })

  test('TypeError fetch → NetworkException OFFLINE', async () => {
    server.use(mswHttp.get('*/api/mat-mang', () => HttpResponse.error()))
    const e = await http.get('/mat-mang').catch((x: unknown) => x)
    expect(e).toBeInstanceOf(NetworkException)
    expect(e).toMatchObject({ code: 'OFFLINE' })
  })

  test('500 không phải JSON → ApiException MAY_CHU_LOI', async () => {
    server.use(mswHttp.get('*/api/hong', () => new HttpResponse('Bad gateway', { status: 502 })))
    const e = await http.get('/hong').catch((x: unknown) => x)
    expect(e).toMatchObject({ status: 502, code: 'MAY_CHU_LOI' })
  })

  test('postBinary gửi đúng Content-Type và thân nhị phân', async () => {
    let type = '', size = 0
    server.use(mswHttp.post('*/api/anh', async ({ request }) => {
      type = request.headers.get('content-type') ?? ''
      size = (await request.arrayBuffer()).byteLength
      return HttpResponse.json({ id: 'a' })
    }))
    await expect(http.postBinary('/anh', new Blob([new Uint8Array([1, 2, 3])]), 'image/jpeg')).resolves.toEqual({ id: 'a' })
    expect([type, size]).toEqual(['image/jpeg', 3])
  })
})
