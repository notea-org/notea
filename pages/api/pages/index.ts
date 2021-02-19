import { TreeData } from '@atlaskit/tree'
import { genId } from '@notea/shared'
import { api } from 'services/api'
import { jsonToMeta, metaToJson } from 'services/meta'
import { useAuth } from 'services/middlewares/auth'
import { useStore } from 'services/middlewares/store'

export default api()
  .use(useAuth)
  .use(useStore)
  .get(async (req, res) => {
    const list = await req.store.getList()
    const tree: TreeData = {
      rootId: 'root',
      items: {},
    }

    await Promise.all(
      list.map(async (id) => {
        const metaData = await req.store.getObjectMeta(
          req.store.path.getPageById(id)
        )
        const { cid, ...meta } = metaToJson(metaData)

        delete meta.id
        tree.items[id] = {
          id,
          data: meta,
          children: cid || [],
        }

        return
      })
    )

    if (!list.includes('root')) {
      await req.store.putObject(req.store.path.getPageById('root'), '')
      await req.store.addToList('root')
      tree.items['root'] = {
        id: 'root',
        children: [],
      }
    }

    res.json(tree)
  })
  .post(async (req, res) => {
    const { content = '\n', meta } = req.body
    let { id } = req.body
    const pagePath = req.store.path.getPageById(id)

    if (!id) {
      id = genId()
      while (await req.store.hasObject(pagePath)) {
        id = genId()
      }
    }

    const metaWithId = {
      id,
      ...meta,
    }
    const metaData = jsonToMeta(metaWithId)

    await req.store.putObject(pagePath, content, {
      contentType: 'text/markdown',
      meta: metaData,
    })

    await req.store.addToList(id)
    // Update parent meta
    const parentPath = req.store.path.getPageById(meta.pid || 'root')
    const parentMeta = metaToJson(await req.store.getObjectMeta(parentPath))
    const cid = (parentMeta.cid || []).concat(id)
    const newParentMeta = jsonToMeta({
      ...parentMeta,
      cid: cid.toString(),
    })

    await req.store.copyObject(parentPath, parentPath, {
      meta: newParentMeta,
    })

    res.json(metaWithId)
  })
