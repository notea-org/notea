import { isBoolean } from 'lodash'
import { useState, useCallback } from 'react'

export function useSidebar(initState = false) {
  const [isFold, setFold] = useState(initState)

  const toggleFold = useCallback((state?: boolean) => {
    setFold((prev) => (isBoolean(state) ? state : !prev))
  }, [])

  return { isFold, toggleFold }
}
