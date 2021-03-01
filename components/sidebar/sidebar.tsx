import SidebarTool from 'components/sidebar/sidebar-tool'
import SideBarNoteList from 'components/sidebar/sidebar-list'
import { UIState } from 'containers/ui'
import { FC } from 'react'
import { UserAgentState } from 'containers/useragent'
import classNames from 'classnames'

const Sidebar: FC = () => {
  const { ua } = UserAgentState.useContainer()

  return ua?.isMobileOnly ? <MobileSidebar /> : <BrowserSidebar />
}

const BrowserSidebar: FC = () => {
  const { isFoldSidebar } = UIState.useContainer()

  return (
    <section className="flex h-full">
      <SidebarTool />
      {isFoldSidebar ? null : <SideBarNoteList />}
    </section>
  )
}

const MobileSidebar: FC = () => {
  return (
    <section
      className={classNames(
        'flex h-full transform absolute w-9/12 z-10 -translate-x-full'
      )}
    >
      <SidebarTool />
      <SideBarNoteList />
    </section>
  )
}

export default Sidebar
