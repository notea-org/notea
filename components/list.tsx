import { ListItem } from './list-item'
import { PageTreeState } from 'containers/page-tree'
import Tree, {
  ItemId,
  moveItemOnTree,
  mutateTree,
  TreeData,
  TreeDestinationPosition,
  TreeSourcePosition,
} from '@atlaskit/tree'
import { useState, useEffect } from 'react'
import { PageState } from 'containers/page'
import useFetch from 'use-http'
import { forEach } from 'lodash'

export const List = () => {
  const { tree, updateTree } = PageTreeState.useContainer()
  const { updatePageMeta } = PageState.useContainer()
  const [curId, setCurId] = useState<ItemId>(0)
  const { get } = useFetch('/api/pages')

  useEffect(() => {
    get().then((data: TreeData) => {
      forEach(data.items, (item) => {
        if (!item.isExpanded && tree.items[item.id]?.isExpanded) {
          item.isExpanded = true
        }
      })
      updateTree(data)
    })
  }, [])

  const onExpand = (itemId: ItemId) => {
    updateTree(mutateTree(tree, itemId, { isExpanded: true }))
  }
  const onCollapse = (itemId: ItemId) => {
    updateTree(mutateTree(tree, itemId, { isExpanded: false }))
  }
  const onDragEnd = (
    source: TreeSourcePosition,
    destination?: TreeDestinationPosition
  ) => {
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
  }

  return (
    <ul className="h-full text-sm">
      <li className="p-2 pl-4 text-gray-500">我的页面</li>
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
          <ListItem
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
          ></ListItem>
        )}
      ></Tree>
    </ul>
  )
}
