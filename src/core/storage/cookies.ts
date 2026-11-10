/** Cookie đọc được bằng JS (cookie phiên vih_phien là HttpOnly, do máy chủ đặt, không đọc được ở đây). */
export interface CookieOptions {
  maxAge?: number
  path?: string
  sameSite?: 'Lax' | 'Strict' | 'None'
}

export function getCookie(name: string): string | null {
  const key = encodeURIComponent(name) + '='
  for (const part of document.cookie.split('; ')) {
    if (part.startsWith(key)) {
      try {
        return decodeURIComponent(part.slice(key.length))
      } catch {
        return null
      }
    }
  }
  return null
}

export function setCookie(name: string, value: string, { maxAge, path = '/', sameSite = 'Lax' }: CookieOptions = {}): void {
  const secure = location.protocol === 'https:' ? '; Secure' : ''
  const age = maxAge === undefined ? '' : `; Max-Age=${Math.floor(maxAge)}`
  document.cookie = `${encodeURIComponent(name)}=${encodeURIComponent(value)}; Path=${path}; SameSite=${sameSite}${age}${secure}`
}

export function deleteCookie(name: string, path = '/'): void {
  setCookie(name, '', { maxAge: 0, path })
}
