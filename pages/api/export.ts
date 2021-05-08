import { useAuth } from 'libs/server/middlewares/auth'
import { useStore } from 'libs/server/middlewares/store'
import AdmZip from 'adm-zip'
import { api } from 'libs/server/connect'
import TreeActions, { ROOT_ID } from 'libs/shared/tree'
import { getPathNoteById } from 'libs/server/note-path'
import { NOTE_DELETED } from 'libs/shared/meta'
import { metaToJson } from 'libs/server/meta'
import { toBuffer } from 'libs/shared/str'

export default api()
  .use(useAuth)
  .use(useStore)
  .get(async (req, res) => {
    const pid = (req.query.pid as string) || ROOT_ID
    const zip = new AdmZip()
    const tree = await req.state.treeStore.get()
    const items = TreeActions.flattenTree(tree, pid)
    const duplicate: Record<string, number> = {}

    await Promise.all(
      items.map(async (item) => {
        const note = await req.state.store.getObjectAndMeta(
          getPathNoteById(item.id)
        )
        const metaJson = metaToJson(note.meta)

        if (metaJson.deleted === NOTE_DELETED.DELETED) {
          return
        }
        const title = metaJson.title

        zip.addFile(
          `${title}${duplicate[title] ? ` (${duplicate[title]})` : ''}.md`,
          toBuffer(note.content)
        )
        duplicate[title] = (duplicate[title] || 0) + 1
      })
    )

    res.setHeader('content-type', 'application/zip')
    res.setHeader('content-disposition', `attachment; filename=export.zip`)
    res.send(zip.toBuffer())
  })
