import IconSearch from 'heroicons/react/outline/Search'
import IconTrash from 'heroicons/react/outline/Trash'
import IconMoon from 'heroicons/react/outline/Moon'
import IconChevronDoubleLeft from 'heroicons/react/outline/ChevronDoubleLeft'
import IconSun from 'heroicons/react/outline/Sun'
import IconGlobe from 'heroicons/react/outline/Globe'
import { forwardRef, HTMLProps, useCallback } from 'react'
import { UIState } from 'containers/ui'
import classNames from 'classnames'
import { useDarkMode } from 'next-dark-mode'
import { SearchState } from 'containers/search'
import Search from 'components/search'
import HotkeyTooltip from 'components/hotkey-tooltip'
import { TrashState } from 'containers/trash'
import Trash from 'components/trash'

const ButtonItem = forwardRef<HTMLDivElement, HTMLProps<HTMLDivElement>>(
  (props, ref) => {
    const { children, className, ...attrs } = props
    return (
      <div
        {...attrs}
        ref={ref}
        className={classNames(
          'block m-3 text-gray-500 hover:text-gray-800 cursor-pointer',
          className
        )}
      >
        {children}
      </div>
    )
  }
)

const ButtonMenu = () => {
  const {
    sidebar: { toggleFold, isFold },
  } = UIState.useContainer()
  const onFold = useCallback(() => {
    toggleFold()
  }, [toggleFold])

  return (
    <HotkeyTooltip text="折叠侧边栏" keys={['cmd', '\\']}>
      <ButtonItem onClick={onFold}>
        <IconChevronDoubleLeft
          className={classNames('transform transition-transform', {
            'rotate-180': isFold,
          })}
        />
      </ButtonItem>
    </HotkeyTooltip>
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
    if (autoModeActive) {
      switchToLightMode()
    } else if (darkModeActive) {
      switchToAutoMode()
    } else {
      switchToDarkMode()
    }
  }, [
    autoModeActive,
    darkModeActive,
    switchToAutoMode,
    switchToDarkMode,
    switchToLightMode,
  ])

  return (
    <HotkeyTooltip text="切换主题">
      <ButtonItem onClick={onToggleThemeMode}>
        {autoModeActive ? (
          <IconGlobe />
        ) : darkModeActive ? (
          <IconMoon />
        ) : (
          <IconSun />
        )}
      </ButtonItem>
    </HotkeyTooltip>
  )
}

const ButtonSearch = () => {
  const { openModal } = SearchState.useContainer()

  return (
    <HotkeyTooltip text="Search" keys={['cmd', 'p']}>
      <ButtonItem onClick={openModal} aria-label="search">
        <IconSearch />
      </ButtonItem>
    </HotkeyTooltip>
  )
}

const ButtonTrash = () => {
  const { openModal } = TrashState.useContainer()

  return (
    <HotkeyTooltip text="Trash" keys={['cmd', 'q']}>
      <ButtonItem onClick={openModal} aria-label="trash">
        <IconTrash />
      </ButtonItem>
    </HotkeyTooltip>
  )
}

const SidebarTool = () => {
  return (
    <aside className="h-full flex flex-col w-10 flex-none bg-gray-200">
      <Search />
      <ButtonSearch />
      <Trash />
      <ButtonTrash />

      <div className="mt-auto">
        <ButtonMenu></ButtonMenu>
        <ButtonTheme></ButtonTheme>
      </div>
    </aside>
  )
}

export default SidebarTool
