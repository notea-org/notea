import SidebarListItem, { ItemButton } from './sidebar-list-item'
import { PageTreeState } from 'containers/page-tree'
import Tree, {
  ItemId,
  moveItemOnTree,
  mutateTree,
  TreeDestinationPosition,
  TreeSourcePosition,
} from '@atlaskit/tree'
import { useState, useEffect, useCallback } from 'react'
import { PageState } from 'containers/page'
import IconPlus from 'heroicons/react/outline/Plus'
import router from 'next/router'

const SideBarList = () => {
  const { tree, updateTree, initTree } = PageTreeState.useContainer()
  const { updatePageMeta } = PageState.useContainer()
  const [curId, setCurId] = useState<ItemId>(0)

  useEffect(() => {
    initTree()
  }, [initTree])

  const onExpand = useCallback(
    (itemId: ItemId) => {
      updateTree(mutateTree(tree, itemId, { isExpanded: true }))
    },
    [tree, updateTree]
  )

  const onCollapse = useCallback(
    (itemId: ItemId) => {
      updateTree(mutateTree(tree, itemId, { isExpanded: false }))
    },
    [tree, updateTree]
  )

  const onDragEnd = useCallback(
    (source: TreeSourcePosition, destination?: TreeDestinationPosition) => {
      if (!destination) {
        return
      }
      const newTree = moveItemOnTree(tree, source, destination)
      const toPid = destination.parentId as string
      const fromPid = source.parentId as string

      updateTree(newTree)

      Promise.all([
        newTree.items[curId].data.pid !== toPid &&
          updatePageMeta(curId as string, {
            pid: toPid,
          }),
        updatePageMeta(toPid, {
          cid: newTree.items[toPid].children as string[],
        }),
        fromPid !== toPid &&
          updatePageMeta(fromPid, {
            cid: newTree.items[fromPid].children as string[],
          }),
      ]).catch((e) => {
        // todo: toast
        console.error('更新错误', e)
      })
    },
    [curId, tree, updatePageMeta, updateTree]
  )

  return (
    <ul className="h-full text-sm">
      <li className="py-2 px-4 text-gray-500 flex">
        <span className="flex-auto">我的页面</span>
        <ItemButton
          onClick={() => {
            router.push('/page/new')
          }}
          className="hover:opacity-100 text-gray-700"
        >
          <IconPlus width="16" height="16" />
        </ItemButton>
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
