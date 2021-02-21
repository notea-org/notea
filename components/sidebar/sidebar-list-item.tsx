import { PageModel } from 'containers/page'
import Link from 'next/link'
import IconArrowRight from 'heroicons/react/outline/ChevronRight'
import IconPlus from 'heroicons/react/outline/Plus'
import { FC, HTMLProps, ReactText, MouseEvent, useCallback } from 'react'
import classNames from 'classnames'
import router, { useRouter } from 'next/router'

export const ItemButton: FC<HTMLProps<HTMLSpanElement>> = ({
  children,
  className,
  ...attrs
}) => {
  return (
    <span
      {...attrs}
      className={classNames(
        'p-0.5 rounded hover:bg-gray-400 cursor-pointer',
        className
      )}
    >
      {children}
    </span>
  )
}

const SidebarListItem: FC<
   {
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
  const { query } = useRouter()
  const onAddPage = useCallback(
    (e: MouseEvent) => {
      e.preventDefault()
      router.push(`/page/new?pid=` + item.id, undefined, { shallow: true })
    },
    [item.id]
  )

  return (
    <li
      {...attrs}
      ref={innerRef}
      className={classNames('group hover:bg-gray-300 text-gray-700', {
        'shadow bg-gray-300': snapshot.isDragging,
        'bg-gray-200': query.id === item.id,
      })}
    >
      <Link href={`/page/${item.id}`} shallow>
        <a className="flex py-1.5 px-2 items-center">
          <ItemButton
            className="mr-0.5"
            onClick={(e) => {
              e.preventDefault()
              isExpanded ? onCollapse(item.id) : onExpand(item.id)
            }}
          >
            <IconArrowRight
              className={classNames('transition-transform transform', {
                'rotate-90': isExpanded,
              })}
              width="16"
              height="16"
            />
          </ItemButton>
          <span className="flex-grow truncate">{item.title || 'Untitled'}</span>
          <ItemButton onClick={onAddPage} className="hidden group-hover:block">
            <IconPlus width="16" height="16" />
          </ItemButton>
        </a>
      </Link>
    </li>
  )
}

export default SidebarListItem
