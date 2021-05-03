import { NoteModel } from 'libs/web/state/note'
import Link from 'next/link'
import { FC, ReactText, MouseEvent, useCallback } from 'react'
import classNames from 'classnames'
import router, { useRouter } from 'next/router'
import HotkeyTooltip from 'components/hotkey-tooltip'
import IconButton from 'components/icon-button'
import NoteTreeState from 'libs/web/state/tree'
import { Skeleton } from '@material-ui/lab'
import PortalState from 'libs/web/state/portal'
import useI18n from 'libs/web/hooks/use-i18n'

const TextSkeleton = () => (
  <Skeleton
    width={80}
    variant="text"
    animation="wave"
    classes={{
      root: 'bg-gray-300',
    }}
  />
)

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
  style?: {
    paddingLeft: number
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
  const { t } = useI18n()
  const { query } = useRouter()
  const { mutateItem, initLoaded } = NoteTreeState.useContainer()
  const {
    menu: { open, setData },
  } = PortalState.useContainer()

  const onAddNote = useCallback(
    (e: MouseEvent) => {
      e.preventDefault()
      router.push(`/new?pid=` + item.id, undefined, { shallow: true })
      mutateItem(item.id, {
        isExpanded: true,
      })
    },
    [item.id, mutateItem]
  )

  const handleClickMenu = useCallback(
    (event: MouseEvent) => {
      event.preventDefault()
      open(event.currentTarget)
      setData(item)
    },
    [item, open, setData]
  )

  return (
    <>
      <div
        {...attrs}
        ref={innerRef}
        className={classNames(
          'flex items-center group pr-2 overflow-hidden hover:bg-gray-300 text-gray-700',
          {
            'shadow bg-gray-300': snapshot.isDragging,
            'bg-gray-200': query.id === item.id,
          }
        )}
      >
        <Link href={`/${item.id}`} shallow>
          <a className="flex flex-1 items-center truncate px-2 py-1.5">
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
              {initLoaded ? item.title || t('Untitled') : <TextSkeleton />}
            </span>
          </a>
        </Link>

        <HotkeyTooltip text={t('Remove, Copy Link, etc')}>
          <IconButton
            icon="DotsHorizontal"
            onClick={handleClickMenu}
            className="hidden group-hover:block"
          ></IconButton>
        </HotkeyTooltip>

        <HotkeyTooltip text={t('Add a page inside')}>
          <IconButton
            icon="Plus"
            onClick={onAddNote}
            className="ml-1 hidden group-hover:block"
          ></IconButton>
        </HotkeyTooltip>
      </div>

      {!hasChildren && isExpanded && (
        <div
          className="ml-9 py-1.5 text-gray-400 select-none"
          style={{
            paddingLeft: attrs.style?.paddingLeft,
          }}
        >
          {initLoaded ? t('No notes inside') : <TextSkeleton />}
        </div>
      )}
    </>
  )
}

export default SidebarListItem
