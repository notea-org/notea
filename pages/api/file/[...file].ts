import { api } from 'services/api'
import { useStore } from 'services/middlewares/store'

export const config = {
  api: {
    bodyParser: false,
  },
}

export default api()
  .use(useStore)
  .get(async (req, res) => {
    if (req.query.file) {
      const signUrl = await req.store.getSignUrl(
        (req.query.file as string[]).join('/')
      )
      if (signUrl) {
        res.redirect(signUrl)
        return
      }
    }

    res.redirect('/404')
  })
