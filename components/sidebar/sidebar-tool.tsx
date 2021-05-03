import IconSearch from 'heroicons/react/outline/Search'
import IconTrash from 'heroicons/react/outline/Trash'
import IconChevronDoubleLeft from 'heroicons/react/outline/ChevronDoubleLeft'
import IconInbox from 'heroicons/react/outline/Inbox'
import IconCog from 'heroicons/react/outline/Cog'
import { forwardRef, HTMLProps, useCallback } from 'react'
import UIState from 'libs/web/state/ui'
import classNames from 'classnames'
import HotkeyTooltip from 'components/hotkey-tooltip'
import Link from 'next/link'
import dayjs from 'dayjs'
import PortalState from 'libs/web/state/portal'
import useI18n from 'libs/web/hooks/use-i18n'
import HeadwayWidget from '@headwayapp/react-widget'
import styled from 'styled-components'
import useMounted from 'libs/web/hooks/use-mounted'

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
  const mounted = useMounted()

  return (
    <aside className="h-full flex flex-col w-11 flex-none bg-gray-200">
      <ButtonSearch />
      <ButtonTrash />
      <ButtonDailyNotes />

      <BottomTool className="mt-auto">
        {mounted ? (
          <HeadwayWidget account="J031Z7" badgePosition="center">
            <div className="mx-3 w-5 h-5"></div>
          </HeadwayWidget>
        ) : null}
        <ButtonMenu></ButtonMenu>
        <ButtonSettings></ButtonSettings>
      </BottomTool>
    </aside>
  )
}

export default SidebarTool

const BottomTool = styled.div`
  .HW_softHidden {
    display: none;
  }
`
