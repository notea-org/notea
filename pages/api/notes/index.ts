import { genId } from '@notea/shared'
import { api } from 'services/api'
import { jsonToMeta } from 'services/meta'
import { useAuth } from 'services/middlewares/auth'
import { useStore } from 'services/middlewares/store'
import { getPathNoteById } from 'services/note-path'

export default api()
  .use(useAuth)
  .use(useStore)
  .post(async (req, res) => {
    const { content = '\n', meta } = req.body
    let id = req.body.id as string
    const notePath = getPathNoteById(id)

    if (!id) {
      id = genId()
      while (await req.store.hasObject(getPathNoteById(id))) {
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
    await req.treeStore.addItem(id, meta.pid)

    res.json(metaWithModel)
  })
