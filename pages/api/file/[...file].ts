import { api } from 'libs/server/connect'
import { useReferrer } from 'libs/server/middlewares/referrer'
import { useStore } from 'libs/server/middlewares/store'
import { getPathFileByName } from 'libs/server/note-path'
import { getEnv } from 'libs/shared/env'

// On aliyun `X-Amz-Expires` must be less than 604800 seconds
const expires = 86400

export default api()
  .use(useStore)
  .use(useReferrer)
  .get(async (req, res) => {
    if (!req.query.file) {
      return res.APIError.NEED_LOGIN.throw()
    }

    const objectPath = getPathFileByName((req.query.file as string[]).join('/'))

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
