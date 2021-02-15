import { PageModel } from '../containers/page'
import ArrowRight from '../assets/icons/arrow-right.svg'
import Link from 'next/link'

export const ListItem = ({ title, id }: PageModel) => {
  return (
    <li className="text-sm items-center p-2 pl-4 hover:bg-gray-200">
      <Link href={`/page/${id}`}>
        <a className="flex">
          <span className="transform">
            <ArrowRight width="16" height="16" />
          </span>
          <span>{title}</span>
        </a>
      </Link>
    </li>
  )
}
