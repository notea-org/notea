import { NoteTreeState } from 'containers/tree'
import { FC, useCallback } from 'react'
import { NoteState } from 'containers/note'
import { useResizeDetector } from 'react-resize-detector'
import { TreeData } from '@atlaskit/tree'
import Sidebar from 'components/sidebar/sidebar'
import { UIState } from 'containers/ui'
import styled from 'styled-components'
import Resizable from 'components/resizable'
import classNames from 'classnames'
import { SearchState } from 'containers/search'

const StyledWrapper = styled.div`
  .gutter {
    pointer-events: ${(props: { disabled: boolean }) =>
      props.disabled ? 'none' : 'auto'};
  }
`

const LayoutMain: FC<{
  tree: TreeData
}> = ({ children, tree }) => {
  const { ua } = UIState.useContainer()

  return (
    <SearchState.Provider>
      <NoteTreeState.Provider initialState={tree}>
        <NoteState.Provider>
          {ua?.isMobileOnly ? (
            <MobileMainWrapper>{children}</MobileMainWrapper>
          ) : (
            <MainWrapper>{children}</MainWrapper>
          )}
        </NoteState.Provider>
      </NoteTreeState.Provider>
    </SearchState.Provider>
  )
}

const MainWrapper: FC = ({ children }) => {
  const {
    sidebar: { isFold },
  } = UIState.useContainer()
  const { ref, width } = useResizeDetector<HTMLDivElement>({
    handleHeight: false,
  })

  return (
    <StyledWrapper disabled={isFold} ref={ref}>
      <Resizable width={width}>
        <Sidebar />
        <main className="relative flex-grow h-screen">{children}</main>
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

export default LayoutMain
