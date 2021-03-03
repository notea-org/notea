import { SearchState } from 'containers/search'
import dayjs from 'dayjs'
import Link from 'next/link'
import { FC } from 'react'
import { NoteStoreItem } from 'utils/local-store'
import BoldText from './bold-text'

const SearchItem: FC<{
  note: NoteStoreItem
  keyword?: string
}> = ({ note, keyword }) => {
  const { closeModal } = SearchState.useContainer()

  return (
    <li className="border-b border-gray-100 hover:bg-gray-200 last:border-0 cursor-pointer">
      <Link href={`/note/${note.id}`}>
        <a
          className="py-2 px-4 block text-xs text-gray-500"
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
    </li>
  )
}

export default SearchItem
