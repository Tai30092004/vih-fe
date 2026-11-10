import { create, type StoreApi, type UseBoundStore } from 'zustand'
import { createStorage, type StorageKind } from '@/core/storage'

/** Store zustand tự lưu vào localStorage / sessionStorage (khoá vih-<key>); kho bị chặn thì vẫn chạy với giá trị đầu. */
export function createPersistedStore<T extends object>(
  key: string,
  initial: T,
  kind: StorageKind = 'local',
): UseBoundStore<StoreApi<T>> {
  const kho = createStorage(kind)
  const store = create<T>(() => ({ ...initial, ...kho.get<Partial<T>>(key, {}) }))
  store.subscribe(s => kho.set(key, s))
  return store
}
