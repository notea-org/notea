import { genId } from '@notea/shared/src/id'
import { strCompress, strDecompress } from '@notea/shared/src/str'
import { api } from '../../../services/api'
import { useAuth } from '../../../services/middlewares/auth'
import { useStore } from '../../../services/middlewares/store'

const META_PREFIX = 'x-notea-'

export default api
  .use(useAuth)
  .use(useStore)
  .get(async (req, res) => {
    const list = await req.store.getList()
    const listMeta = await Promise.all(
      list.map(async (id) => {
        const metaData = await req.store.getObjectMeta(
          req.store.path.getPageById(id)
        )
        const meta: Record<string, string> = {}

        if (metaData) {
          for (const key in metaData) {
            if (key.startsWith(META_PREFIX)) {
              meta[key.replace(META_PREFIX, '')] = strDecompress(metaData[key])
            }
          }
          meta.id = id
        }

        return meta
      })
    )
    res.json(listMeta.filter(Boolean))
  })
  .post(async (req, res) => {
    const { content, meta } = req.body
    const metaData: Record<string, string> = {}
    let id = req.body.id

    if (!id) {
      id = genId()
      while (await req.store.hasObject(req.store.path.getPageById(id))) {
        id = genId()
      }
    }
    if (meta) {
      for (const key in meta) {
        metaData[META_PREFIX + key] = strCompress(meta[key].toString())
      }
    }
    await req.store.putObject(req.store.path.getPageById(id), content, {
      ...metaData,
      'content-type': 'text/markdown',
    })
    await req.store.addToList(id)
    res.end('ok')
  })
