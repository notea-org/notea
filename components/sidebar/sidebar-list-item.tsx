import { NoteModel } from 'containers/note'
import Link from 'next/link'
import React, { FC, ReactText, MouseEvent, useCallback } from 'react'
import classNames from 'classnames'
import router, { useRouter } from 'next/router'
import HotkeyTooltip from 'components/hotkey-tooltip'
import SidebarItemMenu from './sidebar-item-menu'
import IconButton from 'components/icon-button'

const SidebarListItem: FC<{
  item: NoteModel
  innerRef: (el: HTMLElement | null) => void
  onExpand: (itemId?: ReactText) => void
  onCollapse: (itemId?: ReactText) => void
  isExpanded: boolean
  snapshot: {
    isDragging: boolean
  }
}> = ({
  item,
  innerRef,
  onExpand,
  onCollapse,
  isExpanded,
  snapshot,
  ...attrs
}) => {
  const { query } = useRouter()
  const onAddNote = useCallback(
    (e: MouseEvent) => {
      e.preventDefault()
      router.push(`/note/new?pid=` + item.id, undefined, { shallow: true })
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
      <div className="flex px-2 items-center overflow-hidden">
        <Link href={`/note/${item.id}`} shallow>
          <a className="flex flex-grow truncate py-1.5">
            <IconButton
              className="mr-1"
              icon="ChevronRight"
              iconClassName={classNames('transition-transform transform', {
                'rotate-90': isExpanded,
              })}
              onClick={(e) => {
                e.preventDefault()
                isExpanded ? onCollapse(item.id) : onExpand(item.id)
              }}
            ></IconButton>
            <span className="flex-grow truncate">
              {item.title || 'Untitled'}
            </span>
          </a>
        </Link>

        <SidebarItemMenu note={item} />

        <HotkeyTooltip text="新建子页面">
          <IconButton
            icon="Plus"
            onClick={onAddNote}
            className="hidden group-hover:block"
          ></IconButton>
        </HotkeyTooltip>
      </div>
    </li>
  )
}

export default SidebarListItem
