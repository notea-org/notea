import SidebarTool from 'components/sidebar/sidebar-tool'
import SideBarPageList from 'components/sidebar/sidebar-list'
import classNames from 'classnames'
import { UIState } from 'containers/ui'
import { FC, HTMLProps } from 'react'

const Sidebar: FC<HTMLProps<HTMLDivElement>> = (props) => {
  const { isFoldSidebar } = UIState.useContainer()
  const { className, ...attrs } = props

  return (
    <section {...attrs} className={classNames('flex h-full', className)}>
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
