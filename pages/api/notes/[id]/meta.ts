import { api } from 'services/api'
import { jsonToMeta, metaToJson } from 'services/meta'
import { useAuth } from 'services/middlewares/auth'
import { useStore } from 'services/middlewares/store'
import { getPathNoteById } from 'services/note-path'

export default api()
  .use(useAuth)
  .use(useStore)
  .post(async (req, res) => {
    const id = req.body.id || req.query.id
    const notePath = getPathNoteById(id)
    const oldMeta = await req.store.getObjectMeta(notePath)
    let meta = jsonToMeta({
      ...req.body,
      date: new Date().toISOString(),
    })

    if (oldMeta) {
      meta = new Map([...oldMeta, ...meta])
    }

    await req.store.copyObject(notePath, notePath, {
      meta,
      contentType: 'text/markdown',
    })

    res.end()
  })
  .get(async (req, res) => {
    const id = req.body.id || req.query.id
    const notePath = getPathNoteById(id)
    const meta = await req.store.getObjectMeta(notePath)

    res.json(metaToJson(meta))
  })
