import NoteTreeState from 'libs/web/state/tree'
import { FC, useEffect } from 'react'
import NoteState, { NoteModel } from 'libs/web/state/note'
import { useResizeDetector } from 'react-resize-detector'
import Sidebar from 'components/sidebar/sidebar'
import UIState from 'libs/web/state/ui'
import styled from 'styled-components'
import Resizable from 'components/resizable'
import { TreeModel } from 'libs/shared/tree'
import TrashState from 'libs/web/state/trash'
import TrashModal from 'components/portal/trash-modal/trash-modal'
import SearchState from 'libs/web/state/search'
import SearchModal from 'components/portal/search-modal/search-modal'
import ShareModal from 'components/portal/share-modal'
import { SwipeableDrawer } from '@material-ui/core'
import SidebarMenu from 'components/portal/sidebar-menu'

const StyledWrapper = styled.div`
  .gutter {
    pointer-events: ${(props: { disabled: boolean }) =>
      props.disabled ? 'none' : 'auto'};
  }
`

const MainWrapper: FC = ({ children }) => {
  const {
    sidebar: { visible },
  } = UIState.useContainer()
  const { ref, width = 0 } = useResizeDetector<HTMLDivElement>({
    handleHeight: false,
  })

  return (
    <StyledWrapper className="h-full" disabled={visible} ref={ref}>
      <Resizable width={width}>
        <Sidebar />
        <main className="relative flex-grow">{children}</main>
      </Resizable>
    </StyledWrapper>
  )
}

const MobileMainWrapper: FC = ({ children }) => {
  const {
    sidebar: { visible, open, close },
  } = UIState.useContainer()

  return (
    <StyledWrapper className="flex h-full" disabled>
      <SwipeableDrawer
        anchor="left"
        open={visible}
        onClose={close}
        onOpen={open}
        hysteresis={0.4}
        // todo 优化移动端左边按钮和滑动冲突的问题
        disableDiscovery
      >
        <Sidebar />
      </SwipeableDrawer>

      <main className="flex-grow overflow-y-auto" onClick={close}>
        {children}
      </main>
    </StyledWrapper>
  )
}

const LayoutMain: FC<{
  tree: TreeModel
  note?: NoteModel
}> = ({ children, tree, note }) => {
  const { ua } = UIState.useContainer()

  useEffect(() => {
    document.body.classList.add('overflow-hidden')
  }, [])

  return (
    <NoteTreeState.Provider initialState={tree}>
      <NoteState.Provider initialState={note}>
        {/* main layout */}
        {ua?.isMobileOnly ? (
          <MobileMainWrapper>{children}</MobileMainWrapper>
        ) : (
          <MainWrapper>{children}</MainWrapper>
        )}

        {/* modals */}
        <TrashState.Provider>
          <TrashModal />
        </TrashState.Provider>
        <SearchState.Provider>
          <SearchModal />
        </SearchState.Provider>
        <ShareModal />
        <SidebarMenu />
      </NoteState.Provider>
    </NoteTreeState.Provider>
  )
}

export default LayoutMain
