import { NoteTreeState } from 'libs/web/state/tree'
import { FC, useCallback, useEffect } from 'react'
import { NoteState } from 'libs/web/state/note'
import { useResizeDetector } from 'react-resize-detector'
import Sidebar from 'components/sidebar/sidebar'
import { UIState } from 'libs/web/state/ui'
import styled from 'styled-components'
import Resizable from 'components/resizable'
import classNames from 'classnames'
import { TreeModel } from 'libs/shared/tree'

const StyledWrapper = styled.div`
  .gutter {
    pointer-events: ${(props: { disabled: boolean }) =>
      props.disabled ? 'none' : 'auto'};
  }
`

const LayoutMain: FC<{
  tree: TreeModel
}> = ({ children, tree }) => {
  const { ua } = UIState.useContainer()

  useEffect(() => {
    document.body.classList.add('overflow-hidden')
  }, [])

  return (
    <NoteTreeState.Provider initialState={tree}>
      <NoteState.Provider>
        {ua?.isMobileOnly ? (
          <MobileMainWrapper>{children}</MobileMainWrapper>
        ) : (
          <MainWrapper>{children}</MainWrapper>
        )}
      </NoteState.Provider>
    </NoteTreeState.Provider>
  )
}

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

export default LayoutMain
