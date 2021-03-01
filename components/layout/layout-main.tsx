import { NoteTreeState } from 'containers/tree'
import { FC, useCallback } from 'react'
import { NoteState } from 'containers/note'
import { useResizeDetector } from 'react-resize-detector'
import { TreeData } from '@atlaskit/tree'
import Sidebar from 'components/sidebar/sidebar'
import { UIState } from 'containers/ui'
import styled from 'styled-components'
import Resizable from 'components/resizable'
import { UserAgentState } from 'containers/useragent'
import classNames from 'classnames'

const StyledWrapper = styled.div`
  .gutter {
    pointer-events: ${(props: { disabled: boolean }) =>
      props.disabled ? 'none' : 'auto'};
  }
`

const LayoutMain: FC<{
  tree: TreeData
}> = ({ children, tree }) => {
  const { ua } = UserAgentState.useContainer()

  return (
    <NoteState.Provider>
      <NoteTreeState.Provider initialState={tree}>
        {ua?.isMobileOnly ? (
          <MobileMainWrapper>{children}</MobileMainWrapper>
        ) : (
          <MainWrapper>{children}</MainWrapper>
        )}
      </NoteTreeState.Provider>
    </NoteState.Provider>
  )
}

const MainWrapper: FC = ({ children }) => {
  const { isFoldSidebar } = UIState.useContainer()
  const { ref, width } = useResizeDetector<HTMLDivElement>({
    handleHeight: false,
  })

  return (
    <StyledWrapper disabled={isFoldSidebar} ref={ref}>
      <Resizable width={width}>
        <Sidebar />
        <main className="flex-grow overflow-y-auto">{children}</main>
      </Resizable>
    </StyledWrapper>
  )
}

const MobileMainWrapper: FC = ({ children }) => {
  const { isFoldSidebar, toggleFoldSidebar } = UIState.useContainer()

  const onFold = useCallback(() => {
    toggleFoldSidebar(true)
  }, [toggleFoldSidebar])

  return (
    <StyledWrapper
      className={classNames('flex h-screen relative transform transition-all', {
        'translate-x-3/4': !isFoldSidebar,
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
