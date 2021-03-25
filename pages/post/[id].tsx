import LayoutShare from 'components/layout/layout-public'
import { useNoteAPI } from 'libs/web/api/note'
import { NoteModel } from 'libs/web/state/note'
import { useRouter } from 'next/router'
import { useCallback, useEffect, useState } from 'react'
import renderToHtml from 'rich-markdown-editor/dist/lib/renderToHtml'

const ShareContainer = () => {
  const router = useRouter()
  const { find } = useNoteAPI()
  const [note, setNote] = useState<NoteModel>()
  const id = router.query.id as string

  const loadNoteById = useCallback(
    async (id: string) => {
      const note = await find(id)

      if (note) {
        note.content = renderToHtml(note.content || '')
      }
      setNote(note)
    },
    [find]
  )

  useEffect(() => {
    if (!id) return

    loadNoteById(id)
  }, [loadNoteById, id])

  return (
    <div>
      <article
        className="prose"
        dangerouslySetInnerHTML={{
          __html: note?.content || '',
        }}
      ></article>
    </div>
  )
}

const SharedPage = () => {
  return (
    <LayoutShare>
      <ShareContainer />
    </LayoutShare>
  )
}

export default SharedPage
