import { config } from '@/core/config'

/** Nghe máy chủ báo có thay đổi (SSE /api/su-kien: 'san-sang' khi vừa nối, 'cap-nhat' khi dữ liệu đổi). Trả hàm huỷ. */
export function subscribeLive(
  onChange: () => void,
  ES: typeof EventSource | undefined = globalThis.EventSource,
): () => void {
  if (!ES) return () => {}
  const es = new ES(config.apiBase + '/su-kien', { withCredentials: true })
  es.addEventListener('san-sang', onChange)
  es.addEventListener('cap-nhat', onChange)
  return () => es.close()
}
