import { api } from 'services/api'
import { useStore } from 'services/middlewares/store'
import { getPathFileByName } from 'services/note-path'

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
        getPathFileByName((req.query.file as string[]).join('/')),
        31536000
      )

      if (signUrl) {
        res.redirect(signUrl.replace(/^http:/, ''))
        return
      }
    }

    res.redirect('/404')
  })
