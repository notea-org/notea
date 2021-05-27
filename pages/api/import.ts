import { useAuth } from 'libs/server/middlewares/auth'
import { useStore } from 'libs/server/middlewares/store'
import { readFileFromRequest } from 'libs/server/file'
import AdmZip from 'adm-zip'
import { api } from 'libs/server/connect'
import { IMPORT_FILE_LIMIT_SIZE } from 'libs/shared/const'
import { extname } from 'path'
import { genId } from 'libs/shared/id'
import { ROOT_ID } from 'libs/shared/tree'
import { createNote } from 'libs/server/note'
import { NoteModel } from 'libs/shared/note'
import { parseMarkdownTitle } from 'libs/shared/markdown/parse-markdown-title'

const MARKDOWN_EXT = [
  '.markdown',
  '.mdown',
  '.mkdn',
  '.md',
  '.mkd',
  '.mdwn',
  '.mdtxt',
  '.mdtext',
  '.text',
  '.Rmd',
]

export const config = {
  api: {
    bodyParser: false,
  },
}

export default api()
  .use(useAuth)
  .use(useStore)
  .post(async (req, res) => {
    const pid = (req.query.pid as string) || ROOT_ID
    const file = await readFileFromRequest(req)

    if (file.size > IMPORT_FILE_LIMIT_SIZE) {
      return res.APIError.IMPORT_FILE_LIMIT_SIZE.throw()
    }

    const zip = new AdmZip(file.path)
    const zipEntries = zip.getEntries()
    const total = zipEntries.length
    const notes: NoteModel[] = []

    await Promise.all(
      zipEntries.map(async (zipEntry) => {
        if (!MARKDOWN_EXT.includes(extname(zipEntry.name))) {
          return
        }
        const markdown = zipEntry.getData().toString('utf8')
        const { content, title } = parseMarkdownTitle(markdown)
        const note = {
          title: title ?? zipEntry.name,
          pid,
          id: genId(),
          date: zipEntry.header.time.toISOString(),
          content,
        } as NoteModel

        notes.push(note)

        return createNote(note, req.state)
      })
    )

    await req.state.treeStore.addItems(
      notes.map((n) => n.id),
      pid
    )

    res.json({ total, imported: notes.length })
  })
