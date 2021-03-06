import { genId } from '@notea/shared'
import { api } from 'services/api'
import { getTree } from 'services/get-tree'
import { jsonToMeta, metaToJson } from 'services/meta'
import { useAuth } from 'services/middlewares/auth'
import { useStore } from 'services/middlewares/store'

export default api()
  .use(useAuth)
  .use(useStore)
  .get(async (req, res) => {
    const tree = await getTree(req.store)

    res.json(tree)
  })
  .post(async (req, res) => {
    const { content = '\n', meta } = req.body
    let id = req.body.id as string
    const notePath = req.store.path.getNoteById(id)

    if (!id) {
      id = genId()
      while (await req.store.hasObject(notePath)) {
        id = genId()
      }
    }

    const metaWithModel = {
      id,
      date: new Date().toISOString(),
      ...meta,
    }
    const metaData = jsonToMeta(metaWithModel)

    await req.store.putObject(notePath, content, {
      contentType: 'text/markdown',
      meta: metaData,
    })

    await req.store.addToList([id])
    // Update parent meta
    const parentPath = req.store.path.getNoteById(meta.pid || 'root')
    const parentMeta = metaToJson(await req.store.getObjectMeta(parentPath))
    const cid = (parentMeta.cid || []).concat(id)
    const newParentMeta = jsonToMeta({
      ...parentMeta,
      cid: [...new Set(cid)].toString(),
    })

    await req.store.copyObject(parentPath, parentPath, {
      meta: newParentMeta,
    })

    res.json(metaWithModel)
  })
