import { api } from 'services/api'
import { parseMeta, toMeta } from 'services/get-meta'
import { useAuth } from 'services/middlewares/auth'
import { useStore } from 'services/middlewares/store'

export default api()
  .use(useAuth)
  .use(useStore)
  .delete(async (req, res) => {
    const id = req.query.id as string

    await req.store.removeFromList(id)

    res.end()
  })
  .get(async (req, res) => {
    const id = req.query.id as string

    const [content, metaData] = await req.store.getObjectAndMeta(
      req.store.path.getPageById(id)
    )

    res.json({
      content,
      ...toMeta(metaData),
    })
  })
  .post(async (req, res) => {
    const { meta, content } = req.body
    const id = req.body.id || req.query.id
    const metaData = parseMeta(meta)
    const pagePath = req.store.path.getPageById(id)
    const [pageContent, pageMeta] = await req.store.getObjectAndMeta(pagePath)

    if (!pageContent && !pageMeta) {
      return res.APIError.NOT_FOUND.throw(`Not found page with ${id}`)
    }

    const newContent = content || pageContent
    const newMeta = {
      ...pageMeta,
      ...metaData,
    }

    await req.store.putObject(pagePath, newContent, newMeta)

    res.end()
  })
