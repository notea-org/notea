import SidebarListItem from './sidebar-list-item'
import { NoteTreeState } from 'libs/web/state/tree'
import Tree from '@atlaskit/tree'
import { useEffect, useCallback } from 'react'
import router from 'next/router'
import HotkeyTooltip from 'components/hotkey-tooltip'
import IconButton from 'components/icon-button'

const SideBarList = () => {
  const { tree, initTree, moveItem, mutateItem } = NoteTreeState.useContainer()

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

  return (
    <section className="h-full flex text-sm flex-col flex-grow bg-gray-100 overflow-hidden">
      <div className="p-2 text-gray-500 flex">
        <span className="flex-auto">我的页面</span>
        <HotkeyTooltip text="新建页面" keys={['cmd', 'n']}>
          <IconButton
            icon="Plus"
            onClick={() => {
              router.push('/note/new', undefined, { shallow: true })
            }}
            className="text-gray-700"
          ></IconButton>
        </HotkeyTooltip>
      </div>
      <div className="flex-grow overflow-y-auto">
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
