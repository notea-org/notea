import { PageTreeState } from 'containers/page-tree'
import { FC, HTMLProps, useCallback, useRef } from 'react'
import { PageState } from 'containers/page'
import Split from 'react-split'
import { useResizeDetector } from 'react-resize-detector'
import { TreeData } from '@atlaskit/tree'
import { getLocalStore, setLocalStore } from 'utils/local-store'
import Sidebar from 'components/sidebar/sidebar'

const renderGutter = () => {
  const gutter = document.createElement('div')
  const line = document.createElement('div')

  gutter.className = `group cursor-col-resize -ml-1.5 px-1.5`
  line.className =
    'transition-colors delay-150 group-hover:bg-gray-300 w-1 h-full'
  gutter.appendChild(line)

  return gutter
}

const DEFAULT_SPLIT_SIZES = [15, 85]

const LayoutMain: FC<
  HTMLProps<HTMLDivElement> & {
    tree: TreeData
  }
> = ({ children, tree }) => {
  return (
    <PageState.Provider>
      <PageTreeState.Provider initialState={tree}>
        <MainWrapper>{children}</MainWrapper>
      </PageTreeState.Provider>
    </PageState.Provider>
  )
}

const MainWrapper: FC<HTMLProps<HTMLDivElement>> = ({ children }) => {
  const { page } = PageState.useContainer()
  const splitRef = useRef<typeof Split>(null)
  const onResize = useCallback(() => {
    const sizes = getLocalStore('SPLIT_SIZE') || DEFAULT_SPLIT_SIZES
    splitRef.current?.split?.setSizes(sizes)
  }, [])
  const { ref } = useResizeDetector<HTMLDivElement>({
    onResize,
  })

  const saveSplitSize = useCallback((data) => {
    setLocalStore('SPLIT_SIZE', data)
  }, [])
  return (
    <div ref={ref}>
      <Split
        ref={splitRef}
        className="flex h-screen"
        minSize={300}
        sizes={DEFAULT_SPLIT_SIZES}
        gutter={renderGutter}
        onDragEnd={saveSplitSize}
      >
        <Sidebar />
        <main className="flex-auto overflow-y-auto">
          <nav className="fixed bg-white w-full z-10 p-2 text-sm">
            {page.title}
          </nav>
          <article className="m-auto prose prose-sm h-full">{children}</article>
        </main>
      </Split>
    </div>
  )
}

export default LayoutMain
