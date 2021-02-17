import { PageModel } from 'containers/page'
import Link from 'next/link'
import IconArrowRight from 'heroicons/react/outline/ChevronRight'

export const ListItem = ({ title, id }: PageModel) => {
  return (
    <li className="hover:bg-gray-200">
      <Link href={`/page/${id}`}>
        <a className="flex p-1.5 pl-4 items-center ">
          <span className="transform p-0.5 rounded mr-0.5 hover:bg-gray-300">
            <IconArrowRight width="16" height="16" />
          </span>
          <span className="truncate">{title || 'Untitled'}</span>
        </a>
      </Link>
    </li>
  )
}
