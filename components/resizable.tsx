import { UIState } from 'containers/ui'
import Split from 'react-split'
import { FC, useCallback, useEffect, useRef } from 'react'

const renderGutter = () => {
  const gutter = document.createElement('div')
  const line = document.createElement('div')

  gutter.className = 'gutter group cursor-col-resize -ml-1.5 px-1.5'
  line.className =
    'transition-colors delay-150 group-hover:bg-gray-300 w-1 h-full'
  gutter.appendChild(line)

  return gutter
}

const Resizable: FC<{ width?: number }> = ({ width, children }) => {
  const splitRef = useRef<typeof Split>(null)
  const {
    isFoldSidebar,
    saveSplitSizes,
    splitSizes,
    firstWidth,
    initFirstWidth,
  } = UIState.useContainer()
  const widthRef = useRef(width)
  const firstWidthRef = useRef(firstWidth)

  useEffect(() => {
    firstWidthRef.current = firstWidth
  }, [firstWidth])

  useEffect(() => {
    if (!width) return

    widthRef.current = width
    if (firstWidthRef.current > -1) {
      const firstSize = (firstWidthRef.current / width) * 100

      splitRef.current?.split?.setSizes([firstSize, 100 - firstSize])
    } else {
      initFirstWidth(width)
    }
  }, [initFirstWidth, width])

  const updateSplitSizes = useCallback(
    (sizes: number[]) => {
      saveSplitSizes(sizes, widthRef.current)
    },
    [saveSplitSizes]
  )

  return (
    <Split
      ref={splitRef}
      className="flex h-screen"
      minSize={isFoldSidebar ? 40 : 300}
      collapsed={isFoldSidebar ? 0 : undefined}
      sizes={splitSizes}
      gutter={renderGutter}
      onDragEnd={updateSplitSizes}
    >
      {children}
    </Split>
  )
}
export default Resizable
