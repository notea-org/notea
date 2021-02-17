import { genId } from '@notea/shared'
import { api } from 'services/api'
import { parseMeta, toMeta } from 'services/getMeta'
import { useAuth } from 'services/middlewares/auth'
import { useStore } from 'services/middlewares/store'

export default api()
  .use(useAuth)
  .use(useStore)
  .get(async (req, res) => {
    const list = await req.store.getList()
    const listMeta = await Promise.all(
      list.map(async (id) => {
        const metaData = await req.store.getObjectMeta(
          req.store.path.getPageById(id)
        )
        const meta = toMeta(metaData)

        return meta
      })
    )
    res.json(listMeta.filter(Boolean))
  })
  .post(async (req, res) => {
    const { content, meta } = req.body
    let id = req.body.id

    if (!id) {
      id = genId()
      while (await req.store.hasObject(req.store.path.getPageById(id))) {
        id = genId()
      }
    }

    const metaWithId = {
      id,
      ...meta,
    }
    const metaData = parseMeta(metaWithId)

    await req.store.putObject(req.store.path.getPageById(id), content, {
      ...metaData,
      'content-type': 'text/markdown',
    })
    await req.store.addToList(id)
    res.json(metaWithId)
  })
