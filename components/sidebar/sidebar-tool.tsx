import IconSearch from 'heroicons/react/outline/Search'
import IcoTrash from 'heroicons/react/outline/Trash'
import IconMoon from 'heroicons/react/outline/Moon'
import IconChevronDoubleLeft from 'heroicons/react/outline/ChevronDoubleLeft'
import IconSun from 'heroicons/react/outline/Sun'
import IconGlobe from 'heroicons/react/outline/Globe'
import { FC, HTMLProps, useCallback } from 'react'
import { UIState } from 'containers/ui'
import classNames from 'classnames'
import { useDarkMode } from 'next-dark-mode'

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

const ButtonMenu = () => {
  const { toggleFoldSidebar } = UIState.useContainer()
  const onFold = useCallback(() => {
    toggleFoldSidebar()
  }, [toggleFoldSidebar])

  return (
    <ButtonItem onClick={onFold}>
      <IconChevronDoubleLeft />
    </ButtonItem>
  )
}

const ButtonTheme = () => {
  const {
    autoModeActive,
    darkModeActive,
    switchToAutoMode,
    switchToDarkMode,
    switchToLightMode,
  } = useDarkMode()

  const onToggleThemeMode = useCallback(() => {
    if (darkModeActive) {
      switchToLightMode()
    } else if (autoModeActive) {
      switchToDarkMode()
    } else {
      switchToAutoMode()
    }
  }, [
    autoModeActive,
    darkModeActive,
    switchToAutoMode,
    switchToDarkMode,
    switchToLightMode,
  ])

  return (
    <ButtonItem onClick={onToggleThemeMode}>
      {darkModeActive ? (
        <IconSun />
      ) : autoModeActive ? (
        <IconMoon />
      ) : (
        <IconGlobe />
      )}
    </ButtonItem>
  )
}

const SidebarTool = () => {
  return (
    <div className="h-full flex flex-col">
      <ButtonItem>
        <IconSearch />
      </ButtonItem>

      <ButtonItem>
        <IcoTrash />
      </ButtonItem>

      <div className="mt-auto">
        <ButtonMenu></ButtonMenu>
        <ButtonTheme></ButtonTheme>
      </div>
    </div>
  )
}

export default SidebarTool
