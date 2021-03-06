import { NoteModel } from 'containers/note'
import { TreeModel } from 'containers/tree'
import { StoreProvider } from 'packages/store/src'
import { metaToJson } from './meta'

export async function getTree(store: StoreProvider) {
  const list = await store.getList()
  const tree: TreeModel = {
    rootId: 'root',
    items: {},
  }

  await Promise.all(
    list.map(async (id) => {
      const metaData = await store.getObjectMeta(store.path.getNoteById(id))
      const { cid, ...meta } = metaToJson(metaData)

      delete meta.id
      tree.items[id] = {
        id,
        data: meta as NoteModel,
        children: cid || [],
      }

      return
    })
  )

  if (!list.includes('root')) {
    await store.putObject(store.path.getNoteById('root'), '')
    await store.addToList(['root'])
    tree.items['root'] = {
      id: 'root',
      children: [],
      data: {} as NoteModel,
    }
  }

  return tree
}
