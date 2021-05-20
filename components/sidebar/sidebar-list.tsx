import SidebarListItem from './sidebar-list-item'
import NoteTreeState from 'libs/web/state/tree'
import Tree from '@atlaskit/tree'
import { useEffect, useCallback } from 'react'
import router from 'next/router'
import HotkeyTooltip from 'components/hotkey-tooltip'
import IconButton from 'components/icon-button'
import useI18n from 'libs/web/hooks/use-i18n'
import { CircularProgress } from '@material-ui/core'

const SideBarList = () => {
  const { t } = useI18n()
  const {
    tree,
    initTree,
    moveItem,
    mutateItem,
    initLoaded,
  } = NoteTreeState.useContainer()

  useEffect(() => {
    initTree()
  }, [initTree])

  const onExpand = useCallback(
    (id) => {
      mutateItem(id, {
        isExpanded: true,
      })
    },
    [mutateItem]
  )

  const onCollapse = useCallback(
    (id) => {
      mutateItem(id, {
        isExpanded: false,
      })
    },
    [mutateItem]
  )

  const onDragEnd = useCallback(
    (source, destination) => {
      moveItem({
        source,
        destination,
      }).catch((e) => {
        // todo: toast
        console.error('更新错误', e)
      })
    },
    [moveItem]
  )

  const onCreateNote = useCallback(() => {
    router.push('/new', undefined, { shallow: true })
  }, [])

  return (
    <section className="h-full flex text-sm flex-col flex-grow bg-gray-100 overflow-hidden">
      <div className="p-2 text-gray-500 flex items-center">
        <div className="flex-auto flex items-center">
          <span>{t('My Pages')}</span>
          {initLoaded ? null : (
            <CircularProgress className="ml-4" size="14px" color="inherit" />
          )}
        </div>
        <HotkeyTooltip
          text={t('Create page')}
          commandKey
          onHotkey={onCreateNote}
          keys={['O']}
        >
          <IconButton
            icon="Plus"
            onClick={onCreateNote}
            className="text-gray-700"
          ></IconButton>
        </HotkeyTooltip>
      </div>
      <div className="flex-grow overflow-y-auto pb-10">
        <Tree
          onExpand={onExpand}
          onCollapse={onCollapse}
          onDragEnd={onDragEnd}
          tree={tree}
          isDragEnabled
          isNestingEnabled
          offsetPerLevel={10}
          renderItem={({ provided, item, onExpand, onCollapse, snapshot }) => (
            <SidebarListItem
              {...provided.draggableProps}
              {...provided.dragHandleProps}
              onExpand={onExpand}
              onCollapse={onCollapse}
              isExpanded={item.isExpanded}
              innerRef={provided.innerRef}
              hasChildren={!!item.children.length}
              item={{
                ...item.data,
                id: item.id,
              }}
              snapshot={snapshot}
            ></SidebarListItem>
          )}
        ></Tree>
      </div>
    </section>
  )
}

export default SideBarList
