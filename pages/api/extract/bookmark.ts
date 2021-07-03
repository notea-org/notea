import { api } from 'libs/server/connect'
import { useReferrer } from 'libs/server/middlewares/referrer'
import { unfurl } from 'unfurl.js'

const expires = 86400

export default api()
  .use(useReferrer)
  .get(async (req, res) => {
    const { url } = req.query
    if (!url) {
      return res.APIError.NOT_SUPPORTED.throw('missing url')
    }
    const result = await unfurl(url as string)

    res.setHeader(
      'Cache-Control',
      `public, max-age=${expires}, s-maxage=${expires}, stale-while-revalidate=${expires}`
    )
    res.json(result)
  })
