import { api } from 'libs/server/api'
import { useStore } from 'libs/server/middlewares/store'
import { getPathFileByName } from 'libs/server/note-path'

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
