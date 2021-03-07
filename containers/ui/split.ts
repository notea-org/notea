import { useState, useEffect, useCallback } from 'react'
import { uiStore } from 'services/local-store'

const DEFAULT_SPLIT_SIZES = [15, 85]

export function useSplit() {
  const [sizes, setSizes] = useState(DEFAULT_SPLIT_SIZES)
  const [firstWidth, setFirstWidth] = useState<number>(-1)

  useEffect(() => {
    uiStore.getItem<number[]>('split_size').then((res) => {
      setSizes(res ? res : DEFAULT_SPLIT_SIZES)
    })
  }, [])

  const saveSizes = useCallback((sizes: number[], width) => {
    setSizes(sizes)
    uiStore.setItem('split_size', sizes)
    setFirstWidth((sizes[0] * width) / 100)
  }, [])

  const initFirstWidth = useCallback(async (width: number) => {
    const initSizes =
      (await uiStore.getItem<number[]>('split_size')) || DEFAULT_SPLIT_SIZES

    setFirstWidth((initSizes[0] * width) / 100)
  }, [])

  return {
    sizes,
    saveSizes,
    firstWidth,
    initFirstWidth,
  }
}
