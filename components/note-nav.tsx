import classNames from 'classnames'
import NoteState from 'libs/web/state/note'
import UIState from 'libs/web/state/ui'
import { useCallback, MouseEvent } from 'react'
import { CircularProgress } from '@material-ui/core'
import NoteTreeState from 'libs/web/state/tree'
import { Breadcrumbs } from '@material-ui/core'
import Link from 'next/link'
import IconButton from './icon-button'
import HotkeyTooltip from './hotkey-tooltip'
import PortalState from 'libs/web/state/portal'
import { NOTE_SHARED } from 'libs/shared/meta'
import useI18n from 'libs/web/hooks/use-i18n'

const MenuButton = () => {
  const { sidebar } = UIState.useContainer()

  const onToggle = useCallback(
    (e: MouseEvent) => {
      e.stopPropagation()
      sidebar.toggle()
    },
    [sidebar]
  )

  return (
    <IconButton
      icon="Menu"
      className="mr-2 active:bg-gray-400"
      onClick={onToggle}
    ></IconButton>
  )
}

const NoteNav = () => {
  const { t } = useI18n()
  const { note, loading } = NoteState.useContainer()
  const { ua } = UIState.useContainer()
  const { getPaths } = NoteTreeState.useContainer()
  const {
    share: { setData: setDataShare, open: openShare },
    menu: { setData: setDataMenu, open: openMenu },
  } = PortalState.useContainer()

  const handleClickShare = useCallback(
    (event: MouseEvent) => {
      setDataShare(note)
      openShare(event)
    },
    [note, setDataShare, openShare]
  )

  const handleClickMenu = useCallback(
    (event: MouseEvent) => {
      openMenu(event)
      setDataMenu(note)
    },
    [note, openMenu, setDataMenu]
  )

  if (!note) {
    // todo
    return null
  }

  return (
    <nav
      className={classNames(
        'absolute bg-gray-50 z-10 p-2 flex items-center left-0 right-0',
        {
          shadow: ua.isMobileOnly,
        }
      )}
    >
      {ua.isMobileOnly ? <MenuButton /> : null}
      <div className="flex-auto">
        <Breadcrumbs
          maxItems={2}
          className="text-gray-800 leading-none"
          aria-label="breadcrumb"
        >
          {getPaths(note)
            .reverse()
            .map((path) => (
              <Link key={path.id} href={`/${path.id}`}>
                <a className="hover:bg-gray-200 px-1 py-0.5 rounded text-sm">
                  {path.title}
                </a>
              </Link>
            ))}
          <span className="text-gray-600 text-sm" aria-current="page">
            {note.title}
          </span>
        </Breadcrumbs>
      </div>
      <div
        className={classNames('flex mr-2 transition-opacity delay-100', {
          'opacity-0': !loading,
        })}
      >
        <CircularProgress size="14px" color="inherit" />
      </div>
      <HotkeyTooltip text={t('Share page')}>
        <IconButton
          onClick={handleClickShare}
          className="mr-2"
          iconClassName={classNames({
            'text-blue-500': note.shared === NOTE_SHARED.PUBLIC,
          })}
          icon="Share"
        />
      </HotkeyTooltip>
      <HotkeyTooltip text={t('Settings')}>
        <IconButton onClick={handleClickMenu} icon="DotsHorizontal" />
      </HotkeyTooltip>
    </nav>
  )
}

export default NoteNav
