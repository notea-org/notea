import { useCallback, useState } from 'react'
import { createContainer } from 'unstated-next'

function useUI() {
  const [isFoldSidebar, setFoldSidebar] = useState(false)

  const toggleFoldSidebar = useCallback(() => {
    setFoldSidebar((prev) => !prev)
  }, [])

  return { isFoldSidebar, toggleFoldSidebar }
}

export const UIState = createContainer(useUI)
