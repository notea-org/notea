import { StoreProvider } from 'packages/store/src'
import TreeActions, {
  DEFAULT_TREE,
  movePosition,
  TreeItemModel,
  TreeModel,
} from 'libs/shared/tree'
import { getPathTree } from './note-path'

export class TreeStore {
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

    return JSON.parse(res) as TreeModel
  }

  async set(tree: TreeModel) {
    await this.store.putObject(this.treePath, JSON.stringify(tree))

    return tree
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
