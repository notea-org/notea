import MarkdownEditor from 'rich-markdown-editor'
import NoteState, { NoteModel } from 'libs/web/state/note'
import { useRef } from 'react'
import router from 'next/router'
import { has } from 'lodash'
import { useDebouncedCallback } from 'use-debounce'
import EditTitle from './edit-title'
import Editor from './editor'
import styled from 'styled-components'

const Article = styled.article`
  ul {
    list-style-type: disc;
  }

  ol {
    list-style-type: decimal;
  }
`

const NoteEdit = () => {
  const { updateNote, createNote, note } = NoteState.useContainer()
  const editorEl = useRef<MarkdownEditor>(null)

  const onNoteChange = useDebouncedCallback(
    async (data: Partial<NoteModel>) => {
      const isNew = has(router.query, 'new')

      if (isNew) {
        data.pid = (router.query.pid as string) || 'root'
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
    <Article className="pt-40 px-6 m-auto h-full max-w-prose">
      <EditTitle note={note} onNoteChange={onNoteChange} editorEl={editorEl} />
      <Editor note={note} onNoteChange={onNoteChange} editorEl={editorEl} />
    </Article>
  )
}

export default NoteEdit
