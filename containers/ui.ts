import { isBoolean } from 'lodash'
import { useCallback, useEffect, useState } from 'react'
import { createContainer } from 'unstated-next'
import { getLocalStore, setLocalStore } from 'utils/local-store'
import { UserAgentState } from './useragent'

function useSidebar() {
  const { ua } = UserAgentState.useContainer()
  const [isFoldSidebar, setFoldSidebar] = useState(ua.isMobileOnly)

  const toggleFoldSidebar = useCallback((state?: boolean) => {
    setFoldSidebar((prev) => (isBoolean(state) ? state : !prev))
  }, [])

  return { isFoldSidebar, toggleFoldSidebar }
}

const DEFAULT_SPLIT_SIZES = [15, 85]

function useSplit() {
  const [splitSizes, setSplitSizes] = useState(DEFAULT_SPLIT_SIZES)
  const [firstWidth, setFirstWidth] = useState<number>(-1)

  useEffect(() => {
    setSplitSizes(getLocalStore('SPLIT_SIZE') || DEFAULT_SPLIT_SIZES)
  }, [])

  const saveSplitSizes = useCallback((sizes: number[], width) => {
    setSplitSizes(sizes)
    setLocalStore('SPLIT_SIZE', sizes)
    setFirstWidth((sizes[0] * width) / 100)
  }, [])

  const initFirstWidth = useCallback((width: number) => {
    const initSizes = getLocalStore('SPLIT_SIZE') || DEFAULT_SPLIT_SIZES

    setFirstWidth((initSizes[0] * width) / 100)
  }, [])

  return {
    splitSizes,
    saveSplitSizes,
    firstWidth,
    initFirstWidth,
  }
}

function useUI() {
  return {
    ...useSidebar(),
    ...useSplit(),
  }
}

export const UIState = createContainer(useUI)
