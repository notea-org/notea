import classNames from 'classnames'
import { NoteState } from 'containers/note'
import { UIState } from 'containers/ui'
import IconMenu from 'heroicons/react/outline/Menu'
import { useCallback, MouseEvent } from 'react'

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
  const { note } = NoteState.useContainer()
  const { ua } = UIState.useContainer()

  return (
    <nav
      className={classNames('fixed bg-gray-50 w-full z-10 p-2 text-sm flex', {
        shadow: ua.isMobileOnly,
      })}
    >
      {ua.isMobileOnly ? <MenuButton /> : null}
      <span>{note.title}</span>
    </nav>
  )
}
export default NoteNav
