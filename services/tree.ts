import { moveItemOnTree, mutateTree } from '@atlaskit/tree'
import { TreeItemMutation } from '@atlaskit/tree/dist/types/utils/tree'
import { DEFAULT_TREE, TreeModel } from 'containers/tree'
import { forEach, pull, union } from 'lodash'
import { StoreProvider } from 'packages/store/src'
import { getPathTree } from './note-path'
import { TrashStore } from './trash'

interface movePosition {
  parentId: string
  index: number
}

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

    tree.items[id] = {
      id,
      children: [],
    }

    const parentItem = tree.items[parentId]

    parentItem.children = union(parentItem.children, [id])

    return this.set(tree)
  }

  async removeItem(id: string) {
    const tree = await this.get()
    const item = tree.items[id]

    forEach(tree.items, (item) => {
      if (item.children.includes(id)) {
        pull(item.children, id)
        return false
      }
    })
    delete tree.items[id]
    await this.trash.addItem(item)

    return this.set(tree)
  }

  async moveItem(source: movePosition, destination: movePosition) {
    const tree = moveItemOnTree(
      await this.get(),
      source,
      destination
    ) as TreeModel

    return this.set(tree)
  }

  async mutateItem(id: string, data: TreeItemMutation) {
    const tree = await this.get()

    return this.set(mutateTree(tree, id, data) as TreeModel)
  }
}
