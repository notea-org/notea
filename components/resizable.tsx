import { UIState } from 'libs/web/state/ui'
import Split from 'react-split'
import { FC, useCallback, useEffect, useRef } from 'react'

const renderGutter = () => {
  const gutter = document.createElement('div')
  const line = document.createElement('div')

  gutter.className = 'gutter group cursor-col-resize -ml-1.5 px-1.5'
  line.className =
    'transition-colors delay-150 group-hover:bg-gray-300 dark:group-hover:bg-gray-500 w-1 h-full'
  gutter.appendChild(line)

  return gutter
}

const Resizable: FC<{ width?: number }> = ({ width, children }) => {
  const splitRef = useRef<typeof Split>(null)
  const ui = UIState.useContainer()
  const widthRef = useRef(width)
  const UISplitRef = useRef(ui.split)

  useEffect(() => {
    UISplitRef.current = ui.split
  }, [ui.split])

  useEffect(() => {
    widthRef.current = width

    if (!width) return

    const split = UISplitRef.current

    if (split.firstWidth > -1) {
      const firstSize = (split.firstWidth / width) * 100

      splitRef.current?.split?.setSizes([firstSize, 100 - firstSize])
      if (ui.sidebar.isFold) {
        splitRef.current?.split?.collapse(0)
      }
    } else {
      split.initFirstWidth(width)
    }
  }, [ui.sidebar.isFold, width])

  const updateSplitSizes = useCallback(
    (sizes: number[]) => {
      ui.split.saveSizes(sizes, widthRef.current)
    },
    [ui.split]
  )

  return (
    <Split
      ref={splitRef}
      className="flex h-screen"
      minSize={ui.sidebar.isFold ? 40 : 300}
      sizes={ui.split.sizes}
      gutter={renderGutter}
      onDragEnd={updateSplitSizes}
    >
      {children}
    </Split>
  )
}
export default Resizable
