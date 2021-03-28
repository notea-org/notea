import { api, ApiRequest } from 'libs/server/api'
import { jsonToMeta } from 'libs/server/meta'
import { useAuth } from 'libs/server/middlewares/auth'
import { useStore } from 'libs/server/middlewares/store'
import { getPathNoteById } from 'libs/server/note-path'
import { NOTE_DELETED } from 'libs/shared/meta'

export default api()
  .use(useAuth)
  .use(useStore)
  .post(async (req, res) => {
    const { action, data } = req.body as {
      action: 'delete' | 'restore'
      data: {
        id: string
        parentId?: string
      }
    }

    switch (action) {
      case 'delete':
        await deleteNote(req, data.id)
        break

      case 'restore':
        await restoreNote(req, data.id, data.parentId)
        break

      default:
        return res.APIError.NOT_SUPPORTED.throw('action not found')
    }

    res.status(204).end()
  })

async function deleteNote(req: ApiRequest, id: string) {
  const notePath = getPathNoteById(id)

  await req.store.deleteObject(notePath)
  await req.treeStore.deleteItem(id)
}

async function restoreNote(req: ApiRequest, id: string, parentId = 'root') {
  const notePath = getPathNoteById(id)
  const oldMeta = await req.store.getObjectMeta(notePath)
  let meta = jsonToMeta({
    date: new Date().toISOString(),
    deleted: NOTE_DELETED.NORMAL.toString(),
  })
  if (oldMeta) {
    meta = { ...oldMeta, ...meta }
  }

  await req.store.copyObject(notePath, notePath, {
    meta,
    contentType: 'text/markdown',
  })
  await req.treeStore.restoreItem(id, parentId)
}
