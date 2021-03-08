import classNames from 'classnames'
import { NoteState } from 'containers/note'
import { UIState } from 'containers/ui'
import IconMenu from 'heroicons/react/outline/Menu'
import { useCallback, MouseEvent } from 'react'
import { CircularProgress } from '@material-ui/core'
import { NoteTreeState } from 'containers/tree'
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

  return (
    <nav
      className={classNames(
        'absolute bg-gray-50 z-10 p-2 text-sm flex left-0 right-0',
        {
          shadow: ua.isMobileOnly,
        }
      )}
    >
      {ua.isMobileOnly ? <MenuButton /> : null}
      <span className="flex-auto">
        <Breadcrumbs className="text-gray-800" aria-label="breadcrumb">
          {getPaths(note)
            .reverse()
            .map((path) => (
              <Link key={path.id} href={`/note/${path.id}`}>
                <a className="hover:bg-gray-200 px-1 py-0.5 rounded">
                  {path.title}
                </a>
              </Link>
            ))}
          <span>{note.title}</span>
        </Breadcrumbs>
      </span>
      <div
        className={classNames('mr-2 transition-opacity delay-100', {
          'opacity-0': !loading,
        })}
      >
        <CircularProgress size="14px" color="inherit" />
      </div>
    </nav>
  )
}
export default NoteNav
