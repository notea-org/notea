import classNames from 'classnames'
import { PageState } from 'containers/page'
import { UIState } from 'containers/ui'
import { UserAgentState } from 'containers/useragent'
import IconMenu from 'heroicons/react/outline/Menu'
import { useCallback, MouseEvent } from 'react'

const MenuButton = () => {
  const { toggleFoldSidebar } = UIState.useContainer()

  const onToggleFold = useCallback(
    (e: MouseEvent) => {
      e.stopPropagation()
      toggleFoldSidebar()
    },
    [toggleFoldSidebar]
  )

  return (
    <button className="w-5 mr-2 active:bg-gray-400" onClick={onToggleFold}>
      <IconMenu />
    </button>
  )
}

const PageNav = () => {
  const { page } = PageState.useContainer()
  const { ua } = UserAgentState.useContainer()

  return (
    <nav
      className={classNames('fixed bg-gray-50 w-full z-10 p-2 text-sm flex', {
        shadow: ua.isMobileOnly,
      })}
    >
      {ua.isMobileOnly ? <MenuButton /> : null}
      <span>{page.title}</span>
    </nav>
  )
}
export default PageNav
