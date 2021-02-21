import { UIState } from 'containers/ui'
import Split from 'react-split'
import { FC, HTMLProps, useCallback, useEffect, useRef } from 'react'

const renderGutter = () => {
  const gutter = document.createElement('div')
  const line = document.createElement('div')

  gutter.className = 'gutter group cursor-col-resize -ml-1.5 px-1.5'
  line.className =
    'transition-colors delay-150 group-hover:bg-gray-300 w-1 h-full'
  gutter.appendChild(line)

  return gutter
}

const Resizable: FC<
  HTMLProps<
    HTMLDivElement & {
      width: number
    }
  >
> = ({ width, children }) => {
  const splitRef = useRef<typeof Split>(null)
  const {
    isFoldSidebar,
    saveSplitSizes,
    splitSizes,
    splitRealSizes,
  } = UIState.useContainer()
  const widthRef = useRef(width)

  // todo width 还是不正确， 应该通过 setWidth?
  useEffect(() => {
    widthRef.current = width
  }, [width])
  const updateSplitSizes = useCallback(
    (sizes: number[]) => {
      console.log('w', widthRef.current)
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
