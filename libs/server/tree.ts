import { StoreProvider } from 'libs/server/store'
import TreeActions, {
  DEFAULT_TREE,
  movePosition,
  TreeItemModel,
  TreeModel,
} from 'libs/shared/tree'
import { filter, forEach } from 'lodash'
import { getPathTree } from './note-path'

/**
 * FIXME
 * children 有可能包含 null，暂不清楚从哪产生的
 * 先忽略掉并加个 log，找到问题再修复
 */
function fixedTree(tree: TreeModel) {
  forEach(tree.items, (item) => {
    if (item.children.find((i) => i === null)) {
      console.log('item.children includes null', item)
    }
    tree.items[item.id] = {
      ...item,
      children: filter(item.children, Boolean),
    }
  })
  return tree
}

export default class TreeStore {
  store: StoreProvider
  treePath: string

  constructor(store: StoreProvider) {
    this.store = store
    this.treePath = getPathTree()
  }

  async get() {
    const res = await this.store.getObject(this.treePath)

    if (!res) {
      return this.set(DEFAULT_TREE)
    }

    const tree = JSON.parse(res) as TreeModel

    return fixedTree(tree)
  }

  async set(tree: TreeModel) {
    const newTree = fixedTree(tree)

    await this.store.putObject(this.treePath, JSON.stringify(newTree))

    return newTree
  }

  async addItem(id: string, parentId = 'root') {
    const tree = await this.get()

    return this.set(TreeActions.addItem(tree, id, parentId))
  }

  async removeItem(id: string) {
    const tree = await this.get()

    return this.set(TreeActions.removeItem(tree, id))
  }

  async moveItem(source: movePosition, destination: movePosition) {
    const tree = await this.get()

    return this.set(TreeActions.moveItem(tree, source, destination))
  }

  async mutateItem(id: string, data: TreeItemModel) {
    const tree = await this.get()

    return this.set(TreeActions.mutateItem(tree, id, data))
  }

  async restoreItem(id: string, parentId: string) {
    const tree = await this.get()

    return this.set(TreeActions.restoreItem(tree, id, parentId))
  }

  async deleteItem(id: string) {
    const tree = await this.get()

    return this.set(TreeActions.deleteItem(tree, id))
  }
}
