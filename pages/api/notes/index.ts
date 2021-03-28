import { genId } from 'libs/shared/id'
import { api } from 'libs/server/api'
import { jsonToMeta } from 'libs/server/meta'
import { useAuth } from 'libs/server/middlewares/auth'
import { useStore } from 'libs/server/middlewares/store'
import { getPathNoteById } from 'libs/server/note-path'

export default api()
  .use(useAuth)
  .use(useStore)
  .post(async (req, res) => {
    const { content = '\n', ...meta } = req.body
    let id = req.body.id as string

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

    await req.store.putObject(getPathNoteById(id), content, {
      contentType: 'text/markdown',
      meta: metaData,
    })
    await req.treeStore.addItem(id, meta.pid)

    res.json(metaWithModel)
  })
