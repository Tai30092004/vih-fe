import { useMutation, useQueryClient, type UseMutationResult } from '@tanstack/react-query'
import { ApiException, type AppException, reportError, toAppException } from '@/core/errors'
import { toast } from '@/store'
import { rpc } from '../rpc'
import { STATE_KEY } from './useAppState'

export interface RpcOptions {
  successMsg?: string
}

/** Một thao tác nghiệp vụ: gọi máy chủ, thay dữ liệu bằng state máy chủ trả về, báo kết quả bằng toast. */
export function useRpc<R = unknown>(fn: string, opts: RpcOptions = {}): UseMutationResult<R, AppException, unknown[]> {
  const qc = useQueryClient()
  return useMutation<R, AppException, unknown[]>({
    mutationFn: async args => {
      try {
        const r = await rpc<R>(fn, ...args)
        qc.setQueryData(STATE_KEY, r.state)
        return r.result
      } catch (e) {
        throw toAppException(e)
      }
    },
    onSuccess: () => {
      if (opts.successMsg) toast(opts.successMsg, 'ok')
    },
    onError: e => {
      toast(e.message, 'bad')
      if (e instanceof ApiException && e.code === 'XUNG_DOT') void qc.invalidateQueries({ queryKey: STATE_KEY })
      reportError(e, { fn })
    },
  })
}
