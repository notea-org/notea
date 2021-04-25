import IconSearch from 'heroicons/react/outline/Search'
import IconTrash from 'heroicons/react/outline/Trash'
import IconMoon from 'heroicons/react/outline/Moon'
import IconChevronDoubleLeft from 'heroicons/react/outline/ChevronDoubleLeft'
import IconSun from 'heroicons/react/outline/Sun'
import IconGlobe from 'heroicons/react/outline/Globe'
import IconInbox from 'heroicons/react/outline/Inbox'
import IconCog from 'heroicons/react/outline/Cog'
import { forwardRef, HTMLProps, useCallback, useEffect, useState } from 'react'
import UIState from 'libs/web/state/ui'
import classNames from 'classnames'
import HotkeyTooltip from 'components/hotkey-tooltip'
import Link from 'next/link'
import dayjs from 'dayjs'
import { useTheme } from 'next-themes'
import IconDotsHorizontal from 'heroicons/react/outline/DotsHorizontal'
import PortalState from 'libs/web/state/portal'
import useI18n from 'libs/web/hooks/use-i18n'

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
  const { t } = useI18n()
  const {
    sidebar: { toggle, visible },
  } = UIState.useContainer()
  const onFold = useCallback(() => {
    toggle()
  }, [toggle])

  return (
    <HotkeyTooltip text={t('Fold sidebar')} keys={['cmd', '\\']}>
      <ButtonItem onClick={onFold}>
        <IconChevronDoubleLeft
          className={classNames('transform transition-transform', {
            'rotate-180': visible,
          })}
        />
      </ButtonItem>
    </HotkeyTooltip>
  )
}

const ButtonTheme = () => {
  const { t } = useI18n()
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  const onToggleThemeMode = useCallback(() => {
    if (theme === 'system') {
      setTheme('light')
    } else if (theme === 'dark') {
      setTheme('system')
    } else {
      setTheme('dark')
    }
  }, [theme, setTheme])

  useEffect(() => setMounted(true), [])

  return (
    <HotkeyTooltip text={t('Change theme')}>
      <ButtonItem onClick={onToggleThemeMode}>
        {mounted ? (
          theme === 'system' ? (
            <IconGlobe />
          ) : theme === 'dark' ? (
            <IconMoon />
          ) : (
            <IconSun />
          )
        ) : (
          <IconDotsHorizontal />
        )}
      </ButtonItem>
    </HotkeyTooltip>
  )
}

const ButtonSearch = () => {
  const { t } = useI18n()
  const { search } = PortalState.useContainer()

  return (
    <HotkeyTooltip text={t('Search note')} keys={['cmd', 'p']}>
      <ButtonItem onClick={search.open} aria-label="search">
        <IconSearch />
      </ButtonItem>
    </HotkeyTooltip>
  )
}

const ButtonTrash = () => {
  const { t } = useI18n()
  const { trash } = PortalState.useContainer()

  return (
    <HotkeyTooltip text={t('Trash')} keys={['cmd', 'q']}>
      <ButtonItem onClick={trash.open} aria-label="trash">
        <IconTrash />
      </ButtonItem>
    </HotkeyTooltip>
  )
}

const ButtonDailyNotes = () => {
  const { t } = useI18n()

  return (
    <Link href={`/${dayjs().format('YYYY-MM-DD')}`}>
      <a>
        <HotkeyTooltip text={t('Daily Notes')} keys={['cmd', `\``]}>
          <ButtonItem aria-label="daily notes">
            <IconInbox />
          </ButtonItem>
        </HotkeyTooltip>
      </a>
    </Link>
  )
}

const ButtonSettings = () => {
  const { t } = useI18n()

  return (
    <Link href="/settings">
      <a>
        <HotkeyTooltip text={t('Settings')}>
          <ButtonItem aria-label="settings">
            <IconCog />
          </ButtonItem>
        </HotkeyTooltip>
      </a>
    </Link>
  )
}

const SidebarTool = () => {
  return (
    <aside className="h-full flex flex-col w-11 flex-none bg-gray-200">
      <ButtonSearch />
      <ButtonTrash />
      <ButtonDailyNotes />
      <ButtonSettings />

      <div className="mt-auto">
        <ButtonMenu></ButtonMenu>
        <ButtonTheme></ButtonTheme>
      </div>
    </aside>
  )
}

export default SidebarTool
