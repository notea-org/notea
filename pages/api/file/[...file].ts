import { api } from 'libs/server/connect'
import { isLoggedIn } from 'libs/server/middlewares/auth'
import { useStore } from 'libs/server/middlewares/store'
import { getPathFileByName } from 'libs/server/note-path'
import { getEnv } from 'libs/shared/env'
import { NOTE_ID_REGEXP } from 'libs/shared/note'

// On aliyun `X-Amz-Expires` must be less than 604800 seconds
const expires = 86400

// FIXME: 匿名访问是挂的
export default api()
  .use(useStore)
  .get(async (req, res) => {
    const referer = req.headers.referer
    if (!req.query.file) {
      return res.APIError.NEED_LOGIN.throw()
    }

    const objectPath = getPathFileByName((req.query.file as string[]).join('/'))

    /**
     * Check permissions
     * - Logged in [pass]
     * -  No?
     *   - The note are in the meta of the file and are shared [pass]
     *   - fallback: From the sharing page [pass]
     */
    if (!isLoggedIn(req)) {
      let noteId

      if (referer) {
        const pathname = new URL(referer).pathname
        const m = pathname.match(new RegExp(`/(${NOTE_ID_REGEXP})$`))

        noteId = m ? m[1] : null
      }

      if (!noteId) {
        return res.APIError.NOT_SUPPORTED.throw()
      }
    }

    res.setHeader(
      'Cache-Control',
      `public, max-age=${expires}, s-maxage=${expires}, stale-while-revalidate=${expires}`
    )

    const directed = getEnv<boolean>('DIRECT_RESPONSE_ATTACHMENT', false)

    if (directed) {
      const { buffer, contentType } = await req.state.store.getObjectAndMeta(
        objectPath
      )

      if (contentType) {
        res.setHeader('Content-Type', contentType)
      }

      res.send(buffer)
      return
    }

    const signUrl = await req.state.store.getSignUrl(objectPath, expires)

    if (signUrl) {
      res.redirect(signUrl)
      return
    }

    res.redirect('/404')
  })
