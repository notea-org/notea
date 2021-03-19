import { strCompress } from 'packages/shared'
import { api } from 'libs/server/api'
import { metaToJson } from 'libs/server/meta'
import { useAuth } from 'libs/server/middlewares/auth'
import { useStore } from 'libs/server/middlewares/store'
import { getPathNoteById } from 'libs/server/note-path'
import { PAGE_META_KEY } from 'libs/shared/meta'

export default api()
  .use(useAuth)
  .use(useStore)
  .delete(async (req, res) => {
    const id = req.query.id as string
    const notePath = getPathNoteById(id)

    await Promise.all([
      req.store.deleteObject(notePath),
      req.treeStore.removeItem(id),
    ])

    res.end()
  })
  .get(async (req, res) => {
    const id = req.query.id as string

    if (id === 'root') {
      return res.json({
        id,
      })
    }

    const { content, meta } = await req.store.getObjectAndMeta(
      getPathNoteById(id),
      PAGE_META_KEY
    )

    if (!content && !meta) {
      return res.APIError.NOT_FOUND.throw()
    }
    const jsonMeta = metaToJson(meta)

    res.json({
      id,
      content: content || '\n',
      ...jsonMeta,
    })
  })
  .post(async (req, res) => {
    const id = req.query.id as string
    const { content } = req.body
    const notePath = getPathNoteById(id)
    const oldMeta = await req.store.getObjectMeta(notePath)

    if (oldMeta) {
      oldMeta.set('date', strCompress(new Date().toISOString()))
    }

    await req.store.putObject(notePath, content, {
      contentType: 'text/markdown',
      meta: oldMeta,
    })

    res.status(204).end()
  })
