import { useCallback, useRef, useState } from 'react'

interface Params {
  url: string
  method: 'GET' | 'POST'
}

export function useFetcher() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string>()
  const abortRef = useRef<AbortController>()

  const request = useCallback(async function request<Payload, ReponseData>(
    params: Params,
    payload?: Payload | string
  ): Promise<ReponseData | undefined> {
    const controller = new AbortController()

    setLoading(true)
    abortRef.current = controller

    try {
      const response = await fetch(params.url, {
        signal: controller.signal,
        method: params.method,
        body: JSON.stringify(payload),
        headers: {
          'Content-Type': 'application/json',
        },
      })
      if (!response.ok) {
        throw await response.text()
      }
      if (response.status === 204) {
        return
      }

      return response.json()
    } catch (e) {
      if (!controller?.signal.aborted) {
        setError(e)
      }
    } finally {
      setLoading(false)
    }
  },
  [])

  const abort = useCallback(() => {
    abortRef.current?.abort()
  }, [])

  return { loading, request, abort, error }
}
