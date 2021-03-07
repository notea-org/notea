import { StoreProvider } from 'packages/store/src'
import TreeActions, {
  DEFAULT_TREE,
  movePosition,
  TreeItemModel,
  TreeModel,
} from 'shared/tree'
import { getPathTree } from './note-path'
import { TrashStore } from './trash'

export class TreeStore {
  store: StoreProvider
  treePath: string
  trash: TrashStore

  constructor(store: StoreProvider) {
    this.store = store
    this.treePath = getPathTree()
    this.trash = new TrashStore(store)
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
    const item = tree.items[id]

    await this.trash.addItem(item)

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
}
