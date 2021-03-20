import classNames from 'classnames'
import { NoteState } from 'libs/web/state/note'
import { UIState } from 'libs/web/state/ui'
import IconMenu from 'heroicons/react/outline/Menu'
import { useCallback, MouseEvent } from 'react'
import { CircularProgress } from '@material-ui/core'
import { NoteTreeState } from 'libs/web/state/tree'
import { Breadcrumbs } from '@material-ui/core'
import Link from 'next/link'

const MenuButton = () => {
  const { sidebar } = UIState.useContainer()

  const onToggleFold = useCallback(
    (e: MouseEvent) => {
      e.stopPropagation()
      sidebar.toggleFold()
    },
    [sidebar]
  )

  return (
    <button className="w-5 mr-2 active:bg-gray-400" onClick={onToggleFold}>
      <IconMenu />
    </button>
  )
}

const NoteNav = () => {
  const { note, loading } = NoteState.useContainer()
  const { ua } = UIState.useContainer()
  const { getPaths } = NoteTreeState.useContainer()

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
          className="text-gray-800"
          aria-label="breadcrumb leading-none"
          classes={{
            ol: 'leading-none',
            li: 'leading-none',
          }}
        >
          {getPaths(note)
            .reverse()
            .map((path) => (
              <Link key={path.id} href={`/note/${path.id}`}>
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
    </nav>
  )
}
export default NoteNav
