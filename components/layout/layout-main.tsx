import { PageTreeState } from 'containers/page-tree'
import { FC, HTMLProps } from 'react'
import { PageState } from 'containers/page'
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
  const { isFoldSidebar } = UIState.useContainer()
  const { ref, width } = useResizeDetector<HTMLDivElement>({
    handleHeight: false,
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
