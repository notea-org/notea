import MarkdownEditor from 'rich-markdown-editor'
import NoteState from 'libs/web/state/note'
import { useRef } from 'react'
import router from 'next/router'
import { has } from 'lodash'
import { useDebouncedCallback } from 'use-debounce'
import EditTitle from './edit-title'
import Editor from './editor'
import { NoteModel } from 'libs/shared/note'
import { ROOT_ID } from 'libs/shared/tree'

const NoteEdit = () => {
  const { updateNote, createNote, note } = NoteState.useContainer()
  const editorEl = useRef<MarkdownEditor>(null)

  const onNoteChange = useDebouncedCallback(
    async (data: Partial<NoteModel>) => {
      const isNew = has(router.query, 'new')

      if (isNew) {
        data.pid = (router.query.pid as string) || ROOT_ID
        const item = await createNote({ ...note, ...data })
        const noteUrl = `/${item?.id}`

        if (router.asPath !== noteUrl) {
          await router.replace(noteUrl, undefined, { shallow: true })
        }
      } else {
        await updateNote(data)
      }
    },
    500
  )

  return (
    <article className="pt-40 px-6 m-auto h-full max-w-prose" dir="auto">
      <EditTitle note={note} onNoteChange={onNoteChange} editorEl={editorEl} />
      <Editor note={note} onNoteChange={onNoteChange} editorEl={editorEl} />
    </article>
  )
}

export default NoteEdit
