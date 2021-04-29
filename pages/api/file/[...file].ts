import { api } from 'libs/server/api'
import { useStore } from 'libs/server/middlewares/store'
import { getPathFileByName } from 'libs/server/note-path'

export const config = {
  api: {
    bodyParser: false,
  },
}

// On aliyun `X-Amz-Expires` must be less than 604800 seconds
const expires = 604800 - 1

export default api()
  .use(useStore)
  .get(async (req, res) => {
    if (req.query.file) {
      const signUrl = await req.store.getSignUrl(
        getPathFileByName((req.query.file as string[]).join('/')),
        expires
      )

      res.setHeader(
        'Cache-Control',
        `public, max-age=${expires}, s-maxage=${expires}, stale-while-revalidate=${expires}`
      )

      if (signUrl) {
        res.redirect(signUrl)
        return
      }
    }

    res.redirect('/404')
  })
