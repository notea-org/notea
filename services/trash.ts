import { TreeItemModel, TreeModel } from 'containers/tree'
import { forEach, pull } from 'lodash'
import { StoreProvider } from 'packages/store/src'
import { getPathTrash } from './note-path'

export class TrashStore {
  store: StoreProvider
  trashPath: string

  constructor(store: StoreProvider) {
    this.store = store
    this.trashPath = getPathTrash()
  }

  async get() {
    const res = await this.store.getObject(this.trashPath)

    if (!res) {
      return this.set({})
    }

    return JSON.parse(res) as TreeModel['items']
  }

  async set(items: TreeModel['items']) {
    await this.store.putObject(this.trashPath, JSON.stringify(items))

    return items
  }

  async addItem(item: TreeItemModel) {
    const items = await this.get()

    items[item.id] = item

    return this.set(items)
  }

  async removeItem(id: string) {
    const items = await this.get()

    if (items[id]) {
      delete items[id]
    } else {
      forEach(items, (item) => {
        if (item.children.includes(id)) {
          pull(item.children, id)
          return false
        }
      })
    }

    return this.set(items)
  }
}
