import SidebarTool from 'components/sidebar/sidebar-tool'
import SideBarList from 'components/sidebar/sidebar-list'
import UIState from 'libs/web/state/ui'
import { FC } from 'react'

const Sidebar: FC = () => {
  const { ua } = UIState.useContainer()

  return ua?.isMobileOnly ? <MobileSidebar /> : <BrowserSidebar />
}

const BrowserSidebar: FC = () => {
  const {
    sidebar,
    settings: {
      settings: { direction },
    },
  } = UIState.useContainer()

  return (
    <section className="flex h-full" dir={direction}>
      <SidebarTool />
      {sidebar.visible ? null : <SideBarList />}
    </section>
  )
}

const MobileSidebar: FC = () => {
  const {
    settings: {
      settings: { direction },
    },
  } = UIState.useContainer()

  return (
    <section className="flex h-full" style={{ width: '80vw' }} dir={direction}>
      <SidebarTool />
      <SideBarList />
    </section>
  )
}

export default Sidebar
