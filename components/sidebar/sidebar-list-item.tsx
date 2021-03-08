import { NoteModel } from 'containers/note'
import Link from 'next/link'
import React, { FC, ReactText, MouseEvent, useCallback } from 'react'
import classNames from 'classnames'
import router, { useRouter } from 'next/router'
import HotkeyTooltip from 'components/hotkey-tooltip'
import SidebarItemMenu from './sidebar-item-menu'
import IconButton from 'components/icon-button'
import { NoteTreeState } from 'containers/tree'
import { Skeleton } from '@material-ui/lab'

const SidebarListItem: FC<{
  item: NoteModel
  innerRef: (el: HTMLElement | null) => void
  onExpand: (itemId?: ReactText) => void
  onCollapse: (itemId?: ReactText) => void
  isExpanded: boolean
  hasChildren: boolean
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
  hasChildren,
  ...attrs
}) => {
  const { query } = useRouter()
  const { mutateItem, initLoaded } = NoteTreeState.useContainer()
  const onAddNote = useCallback(
    (e: MouseEvent) => {
      e.preventDefault()
      router.push(`/note/new?pid=` + item.id, undefined, { shallow: true })
      mutateItem(item.id, {
        isExpanded: true,
      })
    },
    [item.id, mutateItem]
  )

  return (
    <li {...attrs} ref={innerRef}>
      <div
        className={classNames(
          'group flex px-2 items-center overflow-hidden hover:bg-gray-300 text-gray-700',
          {
            'shadow bg-gray-300': snapshot.isDragging,
            'bg-gray-200': query.id === item.id,
          }
        )}
      >
        <Link href={`/note/${item.id}`} shallow>
          <a className="flex flex-1 truncate py-1.5">
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
            <span className="flex-1 truncate">
              {initLoaded ? (
                item.title || 'Untitled'
              ) : (
                <Skeleton width={80} variant="text" />
              )}
            </span>
          </a>
        </Link>

        <SidebarItemMenu note={item} />

        <HotkeyTooltip text="新建子页面">
          <IconButton
            icon="Plus"
            onClick={onAddNote}
            className="ml-1 hidden group-hover:block"
          ></IconButton>
        </HotkeyTooltip>
      </div>

      {!hasChildren && isExpanded && (
        <div className="ml-8 py-1.5 text-gray-400">
          {initLoaded ? (
            'No pages inside'
          ) : (
            <Skeleton width={80} variant="text" />
          )}
        </div>
      )}
    </li>
  )
}

export default SidebarListItem
