import Link from 'next/link'
import { FC, useCallback } from 'react'
import { NoteCacheItem } from 'libs/web/cache'
import MarkText from 'components/portals/filter-modal/mark-text'
import IconButton from 'components/icon-button'
import HotkeyTooltip from 'components/hotkey-tooltip'
import TrashState from 'libs/web/state/trash'
import PortalState from 'libs/web/state/portal'

const TrashItem: FC<{
  note: NoteCacheItem
  keyword?: string
}> = ({ note, keyword }) => {
  const { restoreNote, deleteNote, filterNotes } = TrashState.useContainer()
  const {
    trash: { close },
  } = PortalState.useContainer()

  const onClickRestore = useCallback(async () => {
    await restoreNote(note)
    filterNotes(keyword)
  }, [filterNotes, keyword, note, restoreNote])

  const onClickDelete = useCallback(async () => {
    await deleteNote(note.id)
    filterNotes(keyword)
  }, [deleteNote, note.id, filterNotes, keyword])

  return (
    <li className="hover:bg-gray-200 cursor-pointer py-2 px-4 flex">
      <Link href={`/${note.id}`}>
        <a className=" block text-xs text-gray-500 flex-grow" onClick={close}>
          <h4 className="text-sm font-bold">
            <MarkText text={note.title} keyword={keyword} />
          </h4>
        </a>
      </Link>

      <HotkeyTooltip text="恢复">
        <IconButton
          onClick={onClickRestore}
          className="text-gray-500 mr-1"
          icon="Reply"
        ></IconButton>
      </HotkeyTooltip>

      <HotkeyTooltip text="彻底删除">
        <IconButton
          onClick={onClickDelete}
          className="text-gray-500"
          icon="Trash"
        ></IconButton>
      </HotkeyTooltip>
    </li>
  )
}

export default TrashItem
