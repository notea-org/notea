import Link from 'next/link'
import { FC } from 'react'
import { NoteCacheItem } from 'libs/web/cache'
import BoldText from 'components/filter-modal/bold-text'
import IconButton from 'components/icon-button'
import HotkeyTooltip from 'components/hotkey-tooltip'
import { TrashState } from 'libs/web/state/trash'

const TrashItem: FC<{
  note: NoteCacheItem
  keyword?: string
}> = ({ note, keyword }) => {
  const { closeModal, restoreNote, deleteNote } = TrashState.useContainer()

  return (
    <li className="hover:bg-gray-200 cursor-pointer py-2 px-4 flex">
      <Link href={`/note/${note.id}`}>
        <a
          className=" block text-xs text-gray-500 flex-grow"
          onClick={closeModal}
        >
          <h4 className="text-sm font-bold">
            <BoldText text={note.title} keyword={keyword} />
          </h4>
        </a>
      </Link>

      <HotkeyTooltip text="恢复">
        <IconButton
          onClick={() => restoreNote(note)}
          className="text-gray-500 mr-1"
          icon="Reply"
        ></IconButton>
      </HotkeyTooltip>

      <HotkeyTooltip text="彻底删除">
        <IconButton
          onClick={() => deleteNote(note.id)}
          className="text-gray-500"
          icon="Trash"
        ></IconButton>
      </HotkeyTooltip>
    </li>
  )
}

export default TrashItem
