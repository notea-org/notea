import { isBoolean } from 'lodash'
import { useState, useCallback } from 'react'
import { useUA } from './ua'

export function useSidebar() {
  const ua = useUA()
  const [isFold, setFold] = useState(ua.isMobileOnly)

  const toggleFold = useCallback((state?: boolean) => {
    setFold((prev) => (isBoolean(state) ? state : !prev))
  }, [])

  return { isFold, toggleFold }
}
