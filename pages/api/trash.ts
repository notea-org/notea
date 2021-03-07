import { api, ApiRequest } from 'services/api'
import { jsonToMeta } from 'services/meta'
import { useAuth } from 'services/middlewares/auth'
import { useStore } from 'services/middlewares/store'
import { getPathNoteById } from 'services/note-path'
import { NOTE_DELETED } from 'shared/meta'

export default api()
  .use(useAuth)
  .use(useStore)
  .get(async (req, res) => {
    res.json(await req.treeStore.trash.get())
  })
  .post(async (req, res) => {
    const { action, data } = req.body as {
      action: 'delete' | 'restore'
      data: any
    }

    switch (action) {
      case 'delete':
        await deleteNote(req, data.id)
        break

      case 'restore':
        await restoreNote(req, data.id)
        break

      default:
        return res.APIError.NOT_SUPPORTED.throw('action not found')
    }

    res.end()
  })

async function deleteNote(req: ApiRequest, id: string) {
  const notePath = getPathNoteById(id)

  await req.store.deleteObject(notePath)
  await req.treeStore.trash.removeItem(id)
}

async function restoreNote(req: ApiRequest, id: string) {
  const notePath = getPathNoteById(id)
  const oldMeta = await req.store.getObjectMeta(notePath)
  let meta = jsonToMeta({
    date: new Date().toISOString(),
    deleted: NOTE_DELETED.NORMAL.toString(),
  })
  if (oldMeta) {
    meta = new Map([...oldMeta, ...meta])
  }

  await req.store.copyObject(notePath, notePath, {
    meta,
    contentType: 'text/markdown',
  })
  await req.treeStore.trash.removeItem(id)
}
