import { api } from 'libs/server/connect'
import { useStore } from 'libs/server/middlewares/store'
import { unfurl } from 'unfurl.js'

export default api()
  .use(useStore)
  .get(async (req, res) => {
    const { url } = req.query
    if (!url) {
      return res.APIError.NOT_SUPPORTED.throw('missing url')
    }
    const result = await unfurl(url as string)

    res.setHeader(
      'Cache-Control',
      `public, max-age=604800, s-maxage=604800, stale-while-revalidate=604800`
    )
    res.json(result)
  })
