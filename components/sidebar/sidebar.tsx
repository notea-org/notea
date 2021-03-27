import SidebarTool from 'components/sidebar/sidebar-tool'
import SideBarList from 'components/sidebar/sidebar-list'
import UIState from 'libs/web/state/ui'
import { FC } from 'react'

const Sidebar: FC = () => {
  const { ua } = UIState.useContainer()

  return ua?.isMobileOnly ? <MobileSidebar /> : <BrowserSidebar />
}

const BrowserSidebar: FC = () => {
  const { sidebar } = UIState.useContainer()

  return (
    <section className="flex h-full">
      <SidebarTool />
      {sidebar.visible ? null : <SideBarList />}
    </section>
  )
}

const MobileSidebar: FC = () => {
  return (
    <section className="flex h-full" style={{ width: '80vw' }}>
      <SidebarTool />
      <SideBarList />
    </section>
  )
}

export default Sidebar
