import { moveItemOnTree, mutateTree, TreeData, TreeItem } from '@atlaskit/tree'
import { NoteModel } from 'containers/note'
import {
  clone,
  filter,
  forEach,
  pull,
  reduce,
  toArray,
  union,
  xorBy,
} from 'lodash'

export interface TreeItemModel extends TreeItem {
  id: string
  data?: NoteModel
  children: string[]
}
export interface TreeModel extends TreeData {
  rootId: string
  items: Record<string, TreeItemModel>
}

export const DEFAULT_TREE: TreeModel = {
  rootId: 'root',
  items: {
    root: {
      id: 'root',
      children: [],
    },
  },
}

export interface movePosition {
  parentId: string
  index: number
}

function addItem(tree: TreeModel, id: string, pid = 'root') {
  tree.items[id] = tree.items[id] || {
    id,
    children: [],
  }

  const parentItem = tree.items[pid]

  parentItem.children = union(parentItem.children, [id])

  return clone(tree)
}

function mutateItem(tree: TreeModel, id: string, data: TreeItemModel) {
  if (data.data) {
    data.data = {
      ...tree.items[id]?.data,
      ...data.data,
    }
  }

  return mutateTree(tree, id, data) as TreeModel
}

function removeItem(tree: TreeModel, id: string) {
  forEach(tree.items, (item) => {
    if (item.children.includes(id)) {
      pull(item.children, id)
      return false
    }
  })

  return clone(tree)
}

function moveItem(
  tree: TreeModel,
  source: movePosition,
  destination?: movePosition
) {
  if (!destination) {
    return tree
  }

  return moveItemOnTree(tree, source, destination) as TreeModel
}

/**
 * 从原父节点上移除，添加到新的父节点上
 */
function restoreItem(tree: TreeModel, id: string, pid = 'root') {
  tree = removeItem(tree, id)
  tree = addItem(tree, id, pid)

  return tree
}

function getUnusedItems(tree: TreeModel) {
  const usedItems = flattenTree(tree)
  const allItems = toArray(tree.items)
  const unusedItems = filter(
    xorBy(allItems, usedItems, 'id'),
    ({ id }) => id !== 'root'
  )

  return unusedItems
}

const flattenTree = (tree: TreeModel): TreeItemModel[] => {
  if (!tree.items[tree.rootId]) {
    return []
  }

  return reduce<string, TreeItemModel[]>(
    tree.items[tree.rootId].children,
    (accum, itemId) => {
      const item = tree.items[itemId]
      const children = flattenTree({
        rootId: item.id,
        items: tree.items,
      })

      return [...accum, item, ...children]
    },
    []
  )
}

const TreeActions = {
  addItem,
  mutateItem,
  removeItem,
  moveItem,
  restoreItem,
  getUnusedItems,
}

export default TreeActions
