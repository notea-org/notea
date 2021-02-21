import { PageTreeState } from 'containers/page-tree'
import { FC, HTMLProps, useCallback, useRef } from 'react'
import { PageState } from 'containers/page'
import Split from 'react-split'
import { useResizeDetector } from 'react-resize-detector'
import { TreeData } from '@atlaskit/tree'
import Sidebar from 'components/sidebar/sidebar'
import { UIState } from 'containers/ui'
import styled from 'styled-components'
import Resizable from 'components/resizable'

const StyledWrapper = styled.div`
  .gutter {
    pointer-events: ${(props: { disabled: boolean }) =>
      props.disabled ? 'none' : 'auto'};
  }
`

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
  const splitRef = useRef<typeof Split>(null)
  const { isFoldSidebar, splitSizes, splitRealSizes } = UIState.useContainer()
  const { ref, width } = useResizeDetector<HTMLDivElement>({
    onResize: useCallback(
      (width) => {
        splitRef.current?.split?.setSizes(splitSizes)
        console.log('res3et', splitSizes, splitRealSizes, width)
      },
      [splitSizes, splitRealSizes]
    ),
  })

  return (
    <StyledWrapper disabled={isFoldSidebar} ref={ref}>
      <Resizable width={width}>
        <Sidebar />
        <main className="flex-auto overflow-y-auto">{children}</main>
      </Resizable>
    </StyledWrapper>
  )
}

export default LayoutMain
