import Link from 'next/link'
import { FC, useCallback } from 'react'
import { NoteStoreItem } from 'services/local-store'
import BoldText from 'components/filter-modal/bold-text'
import IconButton from 'components/icon-button'
import HotkeyTooltip from 'components/hotkey-tooltip'
import { TrashState } from 'containers/trash'
import { NoteTreeState } from 'containers/tree'
import { NOTE_DELETED } from 'shared/meta'

const TrashItem: FC<{
  note: NoteStoreItem
  keyword?: string
}> = ({ note, keyword }) => {
  const { closeModal, restoreNote, deleteNote } = TrashState.useContainer()
  const { addItem } = NoteTreeState.useContainer()

  const doRestore = useCallback(() => {
    restoreNote(note.id)
    addItem({
      ...note,
      // 父页面删除时会删除子页面，此时子页面 deleted = false
      // 恢复时只能添加到根节点
      pid: note.deleted === NOTE_DELETED.DELETED ? note.pid : 'root',
    })
  }, [restoreNote, note, addItem])

  return (
    <li className="border-b border-gray-100 hover:bg-gray-200 last:border-0 cursor-pointer py-2 px-4 flex">
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
          onClick={doRestore}
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
