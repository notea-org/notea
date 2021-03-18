import SidebarTool from 'components/sidebar/sidebar-tool'
import SideBarNoteList from 'components/sidebar/sidebar-list'
import { UIState } from 'libs/web/state/ui'
import { FC } from 'react'
import classNames from 'classnames'

const Sidebar: FC = () => {
  const { ua } = UIState.useContainer()

  return ua?.isMobileOnly ? <MobileSidebar /> : <BrowserSidebar />
}

const BrowserSidebar: FC = () => {
  const { sidebar } = UIState.useContainer()

  return (
    <section className="flex h-full">
      <SidebarTool />
      {sidebar.isFold ? null : <SideBarNoteList />}
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
