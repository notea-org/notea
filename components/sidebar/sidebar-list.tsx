import SidebarListItem from './sidebar-list-item'
import { NoteTreeState, TreeModel } from 'containers/tree'
import Tree, {
  ItemId,
  moveItemOnTree,
  mutateTree,
  TreeDestinationPosition,
  TreeSourcePosition,
} from '@atlaskit/tree'
import { useState, useEffect, useCallback } from 'react'
import { NoteState } from 'containers/note'
import IconPlus from 'heroicons/react/outline/Plus'
import router from 'next/router'
import HotkeyTooltip from 'components/hotkey-tooltip'
import SidebarItemButton from './sidebar-item-button'

const SideBarList = () => {
  const { tree, updateTree, initTree } = NoteTreeState.useContainer()
  const { updateNoteMeta, initAllNotes } = NoteState.useContainer()
  const [curId, setCurId] = useState<ItemId>(0)

  useEffect(() => {
    initTree().then(() => initAllNotes())
  }, [initAllNotes, initTree])

  const onExpand = useCallback(
    (itemId: ItemId) => {
      updateTree(mutateTree(tree, itemId, { isExpanded: true }) as TreeModel)
    },
    [tree, updateTree]
  )

  const onCollapse = useCallback(
    (itemId: ItemId) => {
      updateTree(mutateTree(tree, itemId, { isExpanded: false }) as TreeModel)
    },
    [tree, updateTree]
  )

  const onDragEnd = useCallback(
    (source: TreeSourcePosition, destination?: TreeDestinationPosition) => {
      if (!destination) {
        return
      }
      const newTree = moveItemOnTree(tree, source, destination) as TreeModel
      const toPid = destination.parentId as string
      const fromPid = source.parentId as string

      updateTree(newTree)

      Promise.all([
        newTree.items[curId].data.pid !== toPid &&
          updateNoteMeta(curId as string, {
            pid: toPid,
          }),
        updateNoteMeta(toPid, {
          cid: newTree.items[toPid].children,
        }),
        fromPid !== toPid &&
          updateNoteMeta(fromPid, {
            cid: newTree.items[fromPid].children,
          }),
      ]).catch((e) => {
        // todo: toast
        console.error('更新错误', e)
      })
    },
    [curId, tree, updateNoteMeta, updateTree]
  )

  return (
    <ul className="h-full text-sm flex-grow bg-gray-100 overflow-y-auto">
      <li className="p-2 text-gray-500 flex">
        <span className="flex-auto">我的页面</span>
        <HotkeyTooltip text="新建页面" keys={['cmd', 'n']}>
          <SidebarItemButton
            onClick={() => {
              router.push('/note/new', undefined, { shallow: true })
            }}
            className="text-gray-700"
          >
            <IconPlus width="16" />
          </SidebarItemButton>
        </HotkeyTooltip>
      </li>
      <Tree
        onExpand={onExpand}
        onCollapse={onCollapse}
        onDragEnd={onDragEnd}
        onDragStart={setCurId}
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
            item={{
              ...item.data,
              id: item.id,
            }}
            snapshot={snapshot}
          ></SidebarListItem>
        )}
      ></Tree>
    </ul>
  )
}

export default SideBarList
