import { strCompress } from 'packages/shared'
import { api } from 'services/api'
import { metaToJson } from 'services/meta'
import { useAuth } from 'services/middlewares/auth'
import { useStore } from 'services/middlewares/store'
import { getPathNoteById } from 'services/note-path'
import { PAGE_META_KEY } from 'shared/meta'

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

    const { content, meta } = await req.store.getObjectAndMeta(
      getPathNoteById(id),
      PAGE_META_KEY
    )

    if (!content && !meta) {
      return res.APIError.NOT_FOUND.throw()
    }
    const jsonMeta = metaToJson(meta)

    res.json({
      content,
      ...jsonMeta,
      id,
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

    res.end()
  })
