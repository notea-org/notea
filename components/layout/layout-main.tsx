import NoteTreeState from 'libs/web/state/tree'
import { FC, useCallback, useEffect } from 'react'
import NoteState, { NoteModel } from 'libs/web/state/note'
import { useResizeDetector } from 'react-resize-detector'
import Sidebar from 'components/sidebar/sidebar'
import UIState from 'libs/web/state/ui'
import styled from 'styled-components'
import Resizable from 'components/resizable'
import classNames from 'classnames'
import { TreeModel } from 'libs/shared/tree'
import TrashState from 'libs/web/state/trash'
import TrashModal from 'components/trash'
import SearchState from 'libs/web/state/search'
import SearchModal from 'components/search'
import ShareModal from 'components/share-modal'

const StyledWrapper = styled.div`
  .gutter {
    pointer-events: ${(props: { disabled: boolean }) =>
      props.disabled ? 'none' : 'auto'};
  }
`

const MainWrapper: FC = ({ children }) => {
  const {
    sidebar: { isFold },
  } = UIState.useContainer()
  const { ref, width = 0 } = useResizeDetector<HTMLDivElement>({
    handleHeight: false,
  })

  return (
    <StyledWrapper className="h-screen" disabled={isFold} ref={ref}>
      <Resizable width={width}>
        <Sidebar />
        <main className="relative flex-grow">{children}</main>
      </Resizable>
    </StyledWrapper>
  )
}

const MobileMainWrapper: FC = ({ children }) => {
  const {
    sidebar: { isFold, toggleFold },
  } = UIState.useContainer()

  const onFold = useCallback(() => {
    toggleFold(true)
  }, [toggleFold])

  return (
    <StyledWrapper
      className={classNames('flex h-screen relative transform transition-all', {
        'translate-x-3/4': !isFold,
      })}
      disabled={true}
    >
      <Sidebar />
      <main className="flex-grow overflow-y-auto" onClick={onFold}>
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
      </NoteState.Provider>
    </NoteTreeState.Provider>
  )
}

export default LayoutMain
