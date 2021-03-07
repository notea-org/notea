import { moveItemOnTree, mutateTree, TreeData, TreeItem } from '@atlaskit/tree'
import { NoteModel } from 'containers/note'
import { clone, forEach, pull, union } from 'lodash'

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

function addItem(tree: TreeModel, id: string, parentId = 'root') {
  if (tree.items[id]) {
    return tree
  }

  tree.items[id] = {
    id,
    children: [],
  }

  const parentItem = tree.items[parentId]

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
  delete tree.items[id]

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

const TreeActions = {
  addItem,
  mutateItem,
  removeItem,
  moveItem,
}

export default TreeActions
