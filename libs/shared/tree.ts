import { moveItemOnTree, mutateTree, TreeData, TreeItem } from '@atlaskit/tree'
import { NoteModel } from 'libs/shared/note'
import { cloneDeep, forEach, pull, reduce, union } from 'lodash'

export interface TreeItemModel extends TreeItem {
  id: string
  data?: NoteModel
  children: string[]
}
export interface TreeModel extends TreeData {
  rootId: string
  items: Record<string, TreeItemModel>
}

export const ROOT_ID = 'root'

export const DEFAULT_TREE: TreeModel = {
  rootId: ROOT_ID,
  items: {
    root: {
      id: ROOT_ID,
      children: [],
    },
  },
}

export interface movePosition {
  parentId: string
  index: number
}

function addItem(tree: TreeModel, id: string, pid = ROOT_ID) {
  tree.items[id] = tree.items[id] || {
    id,
    children: [],
  }

  const parentItem = tree.items[pid]

  parentItem.children = union(parentItem.children, [id])

  return cloneDeep(tree)
}

function mutateItem(tree: TreeModel, id: string, data: Partial<TreeItemModel>) {
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

  return cloneDeep(tree)
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
function restoreItem(tree: TreeModel, id: string, pid = ROOT_ID) {
  tree = removeItem(tree, id)
  tree = addItem(tree, id, pid)

  return tree
}

function deleteItem(tree: TreeModel, id: string) {
  tree = cloneDeep(tree)
  delete tree.items[id]

  return tree
}

const flattenTree = (
  tree: TreeModel,
  rootId = tree.rootId
): TreeItemModel[] => {
  if (!tree.items[rootId]) {
    return []
  }

  return reduce<string, TreeItemModel[]>(
    tree.items[rootId].children,
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

function findParentTreeItems(tree: TreeModel, pid?: string) {
  const parents = [] as TreeItemModel[]

  let tempNotePid: string | undefined = pid
  while (tempNotePid && tempNotePid !== ROOT_ID) {
    const curData: TreeItemModel = tree.items[tempNotePid]
    if (curData?.data) {
      tempNotePid = curData.data.pid
      parents.push(curData)
    } else {
      break
    }
  }

  return parents
}


const TreeActions = {
  addItem,
  mutateItem,
  removeItem,
  moveItem,
  restoreItem,
  deleteItem,
  flattenTree,
  findParentTreeItems,
}

export default TreeActions
