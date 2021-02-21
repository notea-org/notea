import IconSearch from 'heroicons/react/outline/Search'
import IcoTrash from 'heroicons/react/outline/Trash'
import IconMoon from 'heroicons/react/outline/Moon'
import IconChevronDoubleLeft from 'heroicons/react/outline/ChevronDoubleLeft'
// import IconSun from 'heroicons/react/outline/Sun'
import { FC, HTMLProps, useCallback } from 'react'
import { UIState } from 'containers/ui'
import classNames from 'classnames'

const ButtonItem: FC<HTMLProps<HTMLDivElement>> = (props) => {
  const { children, className, ...attrs } = props
  return (
    <div
      {...attrs}
      className={classNames(
        'block p-3 text-gray-500 hover:text-gray-800 cursor-pointer',
        className
      )}
    >
      {children}
    </div>
  )
}

const SidebarTool = () => {
  const { toggleFoldSidebar } = UIState.useContainer()
  const onFold = useCallback(() => {
    toggleFoldSidebar()
  }, [toggleFoldSidebar])

  return (
    <div className="h-full flex flex-col">
      <ButtonItem>
        <IconSearch />
      </ButtonItem>

      <ButtonItem>
        <IcoTrash />
      </ButtonItem>

      <div className="mt-auto">
        <ButtonItem onClick={onFold}>
          <IconChevronDoubleLeft />
        </ButtonItem>
        <ButtonItem>
          <IconMoon />
        </ButtonItem>
      </div>
    </div>
  )
}

export default SidebarTool
