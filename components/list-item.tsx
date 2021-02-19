import { PageModel } from 'containers/page'
import Link from 'next/link'
import IconArrowRight from 'heroicons/react/outline/ChevronRight'
import IconPlus from 'heroicons/react/outline/Plus'
import { FC, HTMLProps, ReactText, MouseEvent } from 'react'
import cx from 'classnames'
import { useRouter } from 'next/router'

export const ItemButton: FC<HTMLProps<HTMLSpanElement>> = ({
  children,
  className,
  ...attrs
}) => {
  return (
    <span
      {...attrs}
      className={cx(
        'p-0.5 rounded hover:bg-gray-400 cursor-pointer',
        className
      )}
    >
      {children}
    </span>
  )
}

export const ListItem: FC<
  HTMLProps<HTMLLIElement> & {
    item: PageModel
    innerRef: (el: HTMLElement | null) => void
    onExpand: (itemId?: ReactText) => void
    onCollapse: (itemId?: ReactText) => void
    isExpanded: boolean
    snapshot: {
      isDragging: boolean
    }
  }
> = ({
  item,
  innerRef,
  onExpand,
  onCollapse,
  isExpanded,
  snapshot,
  ...attrs
}) => {
  const router = useRouter()

  const onAddPage = (e: MouseEvent) => {
    e.preventDefault()
    router.push(`/page/new?pid=` + item.id)
  }

  return (
    <li
      {...attrs}
      ref={innerRef}
      className={cx('group hover:bg-gray-300 text-gray-700', {
        'shadow bg-gray-300': snapshot.isDragging,
        'bg-gray-200': router.query.id === item.id,
      })}
    >
      <Link href={`/page/${item.id}`}>
        <a className="flex py-1.5 px-4 items-center">
          <ItemButton
            className="mr-0.5"
            onClick={(e) => {
              e.preventDefault()
              isExpanded ? onCollapse(item.id) : onExpand(item.id)
            }}
          >
            <IconArrowRight
              className={cx('transition-transform transform', {
                'rotate-90': isExpanded,
              })}
              width="16"
              height="16"
            />
          </ItemButton>
          <span className="flex-grow truncate">{item.title || 'Untitled'}</span>
          <ItemButton
            onClick={onAddPage}
            className="opacity-0 group-hover:opacity-100"
          >
            <IconPlus width="16" height="16" />
          </ItemButton>
        </a>
      </Link>
    </li>
  )
}
