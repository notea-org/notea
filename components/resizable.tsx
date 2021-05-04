import UIState from 'libs/web/state/ui'
import Split from 'react-split'
import { FC, useCallback, useEffect, useRef } from 'react'
import { Direction } from 'libs/shared/settings'
import { reverse } from 'lodash'

const renderGutter = () => {
  const gutter = document.createElement('div')
  const line = document.createElement('div')

  gutter.className = 'gutter group cursor-col-resize -ms-1.5 px-1.5'
  line.className =
    'transition-colors delay-150 group-hover:bg-gray-300 dark:group-hover:bg-gray-500 w-1 h-full'
  gutter.appendChild(line)

  return gutter
}

const Resizable: FC<{ width: number }> = ({ width, children }) => {
  const splitRef = useRef<typeof Split>(null)
  const {
    split: { saveSizes, resize, sizes },
    ua: { isMobileOnly },
    sidebar: { visible },
    settings: {
      settings: { direction },
    },
  } = UIState.useContainer()
  const lastWidthRef = useRef(width)

  const calcDisplaySizes = useCallback(
    (sizes) => {
      return direction === Direction.LTR ? sizes : reverse([...sizes])
    },
    [direction]
  )

  useEffect(() => {
    const lastWidth = lastWidthRef.current

    if (width && lastWidth) {
      resize(lastWidth / width)
    }
    lastWidthRef.current = width
  }, [resize, width])

  useEffect(() => {
    splitRef.current?.split?.setSizes(calcDisplaySizes(sizes))
    if (visible) {
      splitRef.current?.split?.collapse(0)
    }
  }, [visible, sizes, width, calcDisplaySizes])

  const updateSplitSizes = useCallback(
    async (sizes: [number, number]) => {
      if (isMobileOnly) {
        return
      }

      await saveSizes(calcDisplaySizes(sizes))
    },
    [isMobileOnly, saveSizes, calcDisplaySizes]
  )

  const nodes =
    Array.isArray(children) &&
    (direction === Direction.LTR ? children : reverse([...children]))

  return (
    <Split
      ref={splitRef}
      className="flex h-full"
      minSize={visible ? 40 : 250}
      sizes={calcDisplaySizes(sizes)}
      gutter={renderGutter}
      onDragEnd={updateSplitSizes}
      dir="ltr"
    >
      {nodes}
    </Split>
  )
}

export default Resizable
