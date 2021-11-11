import { useAuth } from 'libs/server/middlewares/auth'
import { useStore } from 'libs/server/middlewares/store'
import AdmZip from 'adm-zip'
import emojiRegex from 'emoji-regex'
import { map } from 'lodash'
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
    const duplicate: Record<string, number> = {}

    // fill tree with notes metadata
    await Promise.all(
      map(tree.items, async (item) => {
        const note = await req.state.store.getObjectAndMeta(
          getPathNoteById(item.id)
        )
        item.data = metaToJson(note.meta) as any
        item.data!.content = note.content
        return item
      })
    )

    // add all notes to zip file
    const items = TreeActions.flattenTree(tree, pid)
    await Promise.all(
      items.map(async (item) => {
        if (!item.data || item.data.deleted === NOTE_DELETED.DELETED) {
          return
        }

        const title = ((item.data.title as string) ?? 'Untitled')
          .replace(/\//, '')
          .replace(emojiRegex(), '')
          .trim()

        const parentPath = TreeActions.findParentTreeItems(tree, item.data.pid)
          .reverse()
          .map((item) => item.data?.title || 'Untitled')
          .join('/')

        const path = [
          parentPath,
          item.children.length > 0 ? title : undefined, // a note with children is nested inside the folder of it's own name
          title,
        ]
          .filter(Boolean)
          .join('/')

        // duplicate filename has a limitation: subtrees from identically named notes will get merged together, but no files will be lost
        zip.addFile(
          `${path}${duplicate[path] ? ` (${duplicate[path]})` : ''}.md`,
          toBuffer(item.data.content)
        )
        duplicate[path] = (duplicate[path] || 0) + 1
      })
    )

    res.setHeader('content-type', 'application/zip')
    res.setHeader('content-disposition', `attachment; filename=export.zip`)
    res.send(zip.toBuffer())
  })
