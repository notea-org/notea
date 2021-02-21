import { isBoolean } from 'lodash'
import { useCallback, useEffect, useState } from 'react'
import { createContainer } from 'unstated-next'
import { getLocalStore, setLocalStore } from 'utils/local-store'

function useSidebar() {
  const [isFoldSidebar, setFoldSidebar] = useState(false)

  const toggleFoldSidebar = useCallback((state?: boolean) => {
    setFoldSidebar((prev) => (isBoolean(state) ? state : !prev))
  }, [])

  return { isFoldSidebar, toggleFoldSidebar }
}

const DEFAULT_SPLIT_SIZES = [15, 85]

function useSplit() {
  const [splitSizes, setSplitSizes] = useState(DEFAULT_SPLIT_SIZES)
  const [splitRealSizes, setSplitRealSizes] = useState(DEFAULT_SPLIT_SIZES)

  useEffect(() => {
    setSplitSizes(getLocalStore('SPLIT_SIZE') || DEFAULT_SPLIT_SIZES)
  }, [])

  const saveSplitSizes = useCallback((sizes: number[], width) => {
    setSplitSizes(sizes)
    setLocalStore('SPLIT_SIZE', sizes)
    console.log(
      width,
      sizes.map((s) => s * width)
    )
    setSplitRealSizes(sizes.map((s) => s * width))
  }, [])

  return {
    splitSizes,
    saveSplitSizes,
    splitRealSizes,
  }
}

function useUI() {
  return {
    ...useSidebar(),
    ...useSplit(),
  }
}

export const UIState = createContainer(useUI)
