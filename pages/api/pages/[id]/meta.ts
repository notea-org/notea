import { api } from 'services/api'
import { jsonToMeta, metaToJson } from 'services/meta'
import { useAuth } from 'services/middlewares/auth'
import { useStore } from 'services/middlewares/store'

export default api()
  .use(useAuth)
  .use(useStore)
  .post(async (req, res) => {
    const id = req.body.id || req.query.id
    const pagePath = req.store.path.getPageById(id)
    const oldMeta = await req.store.getObjectMeta(pagePath)
    let meta = jsonToMeta(req.body)

    if (oldMeta) {
      meta = new Map([...oldMeta, ...meta])
    }

    await req.store.copyObject(pagePath, pagePath, {
      meta,
      contentType: 'text/markdown',
    })

    res.end()
  })
  .get(async (req, res) => {
    const id = req.body.id || req.query.id
    const pagePath = req.store.path.getPageById(id)
    const meta = await req.store.getObjectMeta(pagePath)

    res.json(metaToJson(meta))
  })
