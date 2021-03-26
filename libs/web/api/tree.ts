import { useCallback } from 'react'
import useFetcher from './fetcher'

interface MutateBody {
  action: 'move' | 'mutate'
  data: any
}

export default function useTreeAPI() {
  const { loading, request, abort } = useFetcher()

  const mutate = useCallback(
    async (body: MutateBody) => {
      return request<MutateBody, undefined>(
        {
          method: 'POST',
          url: `/api/tree`,
        },
        body
      )
    },
    [request]
  )

  return {
    loading,
    abort,
    mutate,
  }
}
