import { api } from '../../../services/api'
import { useAuth } from '../../../services/middlewares/auth'
import { useStore } from '../../../services/middlewares/store'

export default api
  .use(useAuth)
  .use(useStore)
  .delete(async (req, res) => {
    const id = req.query.id as string

    await req.store.removeFromList(id)

    res.end()
  })
  .get(async (req, res) => {
    const id = req.query.id as string

    res.redirect(
      await req.store.getSignUrl(
        req.store.path.getPageById(id),
        24 * 60 * 60,
        new Date(new Date().toDateString())
      )
    )
  })
