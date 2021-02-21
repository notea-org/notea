import SidebarTool from 'components/sidebar/sidebar-tool'
import SideBarPageList from 'components/sidebar/sidebar-list'
import classNames from 'classnames'
import { UIState } from 'containers/ui'

const Sidebar = () => {
  const { isFoldSidebar } = UIState.useContainer()

  return (
    <section className={classNames('flex h-full')}>
      <aside className="w-10 flex-none bg-gray-200">
        <SidebarTool />
      </aside>
      {isFoldSidebar ? null : (
        <section className="flex-grow bg-gray-100 overflow-y-auto">
          <SideBarPageList />
        </section>
      )}
    </section>
  )
}
export default Sidebar
