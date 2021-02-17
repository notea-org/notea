import { api } from 'services/api'
import { toMeta } from 'services/getMeta'
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
