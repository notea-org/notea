import { ListItem } from './list-item'
import { PageListState } from 'containers/page-list'
import Tree, {
  ItemId,
  moveItemOnTree,
  mutateTree,
  TreeDestinationPosition,
  TreeSourcePosition,
  TreeData,
  TreeItem,
} from '@atlaskit/tree'
import { useEffect, useState } from 'react'
import { PageModel } from 'containers/page'

function toTree(list: PageModel[] = []) {
  const items: Record<string, TreeItem> = {}
  const tree: TreeData = {
    rootId: 'root',
    items,
  }

  list.forEach((item) => {
    const { id, pid = 'root' } = item

    if (!id) {
      return
    }

    items[id] = {
      ...{ id, data: item, children: [] },
      ...items[id],
    }

    if (!items[pid]) {
      items[pid] = {
        id: pid,
        children: [],
      }
    }

    items[pid].children.push(id)
  })

  return tree
}

export const List = () => {
  const { list } = PageListState.useContainer()
  const [tree, setTree] = useState(toTree())

  useEffect(() => {
    setTree(toTree(list))
  }, [list])

  const onExpand = (itemId: ItemId) => {
    setTree(mutateTree(tree, itemId, { isExpanded: true }))
  }

  const onCollapse = (itemId: ItemId) => {
    setTree(mutateTree(tree, itemId, { isExpanded: false }))
  }

  const onDragEnd = (
    source: TreeSourcePosition,
    destination?: TreeDestinationPosition
  ) => {
    if (!destination) {
      return
    }
    const newTree = moveItemOnTree(tree, source, destination)
    setTree(newTree)
  }

  return (
    <ul className="h-full text-sm">
      <li className="p-1.5 pl-4 text-gray-500">我的页面</li>
      <Tree
        onExpand={onExpand}
        onCollapse={onCollapse}
        onDragEnd={onDragEnd}
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
            item={item.data || {}}
            snapshot={snapshot}
          />
        )}
      ></Tree>
      {/* {list.map((item) => (
        <ListItem key={item.id} {...item}></ListItem>
      ))} */}
    </ul>
  )
}
