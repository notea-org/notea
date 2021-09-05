import { api } from 'libs/server/connect'
import { metaToJson } from 'libs/server/meta'
import { useAuth } from 'libs/server/middlewares/auth'
import { useStore } from 'libs/server/middlewares/store'
import { getPathNoteById } from 'libs/server/note-path'
import { NoteModel } from 'libs/shared/note'
import { StoreProvider } from 'libs/server/store'
import { API } from 'libs/server/middlewares/error'
import { strCompress, tryJSON } from 'libs/shared/str'
import { ROOT_ID } from 'libs/shared/tree'
import { mergeUpdates } from 'libs/shared/y-doc'

export async function getNote(
  store: StoreProvider,
  id: string,
  sv?: string
): Promise<NoteModel> {
  const { content, meta } = await store.getObjectAndMeta(getPathNoteById(id))

  if (!content && !meta) {
    throw API.NOT_FOUND.throw()
  }

  const jsonMeta = metaToJson(meta)
  const updates = tryJSON<string[]>(content)

  return {
    id,
    updates: updates ? [mergeUpdates(updates, sv)] : null,
    content: updates ? null : content,
    ...jsonMeta,
  } as NoteModel
}

export default api()
  .use(useAuth)
  .use(useStore)
  .delete(async (req, res) => {
    const id = req.query.id as string
    const notePath = getPathNoteById(id)

    await Promise.all([
      req.state.store.deleteObject(notePath),
      req.state.treeStore.removeItem(id),
    ])

    res.end()
  })
  .get(async (req, res) => {
    const id = req.query.id as string
    const sv = req.query.sv as string

    if (id === ROOT_ID) {
      return res.json({
        id,
      })
    }

    const note = await getNote(req.state.store, id, sv)

    res.json(note)
  })
  .post(async (req, res) => {
    const id = (req.query ?? {}).id as string
    const { updates } = req.body
    const notePath = getPathNoteById(id)
    const store = req.state.store

    if (!updates?.length) {
      throw res.APIError.NOT_SUPPORTED.throw()
    }

    const { content = '[]', meta: oldMeta } = await store.getObjectAndMeta(
      notePath
    )
    const newUpdates = tryJSON<string[]>(content) ?? []

    // backup older object
    if (!newUpdates.length && content.length) {
      await store.copyObject(notePath, store.getPath('backup', notePath), {
        meta: oldMeta,
        contentType: 'text/markdown',
      })
    }

    if (oldMeta) {
      oldMeta['date'] = strCompress(new Date().toISOString())
    }

    newUpdates.push(...updates)

    await store.putObject(notePath, newUpdates, {
      contentType: 'text/markdown',
      meta: oldMeta,
    })

    res.status(204).end()
  })
