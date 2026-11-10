export type StorageKind = 'local' | 'session'

export interface SafeStorage {
  get<T>(key: string, fallback: T): T
  set<T>(key: string, value: T): void
  remove(key: string): void
  /** Chuỗi thô, khoá đầy đủ (không thêm tiền tố): dùng cho khoá app cũ như vih-tema. */
  getRaw(fullKey: string): string | null
  setRaw(fullKey: string, value: string): void
}

/** Kho trình duyệt an toàn: chế độ riêng tư, Safari hay trang bị chặn lưu trữ thì trả fallback, không ném. */
export function createStorage(kind: StorageKind, prefix = 'vih-'): SafeStorage {
  const kho = (): Storage | null => {
    try {
      return kind === 'local' ? window.localStorage : window.sessionStorage
    } catch {
      return null
    }
  }
  return {
    get<T>(key: string, fallback: T): T {
      try {
        const raw = kho()?.getItem(prefix + key)
        return raw == null ? fallback : (JSON.parse(raw) as T)
      } catch {
        return fallback
      }
    },
    set<T>(key: string, value: T): void {
      try {
        kho()?.setItem(prefix + key, JSON.stringify(value))
      } catch {
        // hết chỗ hoặc bị chặn: bỏ qua, chỉ là tiện ích theo máy
      }
    },
    remove(key: string): void {
      try {
        kho()?.removeItem(prefix + key)
      } catch {
        // như trên
      }
    },
    getRaw(fullKey: string): string | null {
      try {
        return kho()?.getItem(fullKey) ?? null
      } catch {
        return null
      }
    },
    setRaw(fullKey: string, value: string): void {
      try {
        kho()?.setItem(fullKey, value)
      } catch {
        // như trên
      }
    },
  }
}
