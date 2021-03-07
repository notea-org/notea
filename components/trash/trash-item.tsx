import { SearchState } from 'containers/search'
import dayjs from 'dayjs'
import Link from 'next/link'
import { FC } from 'react'
import { NoteStoreItem } from 'services/local-store'
import BoldText from 'components/filter-modal/bold-text'
import IconButton from 'components/icon-button'

const TrashItem: FC<{
  note: NoteStoreItem
  keyword?: string
}> = ({ note, keyword }) => {
  const { closeModal } = SearchState.useContainer()

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
          <p className="mt-1">
            <BoldText text={note.rawContent} keyword={keyword} />
          </p>
          <time className="text-gray-300 mt-2 block" dateTime={note.date}>
            {dayjs(note.date).format('DD/MM/YYYY HH:mm')}
          </time>
        </a>
      </Link>

      <IconButton icon="Reply"></IconButton>
      <IconButton icon="Trash"></IconButton>
    </li>
  )
}

export default TrashItem
