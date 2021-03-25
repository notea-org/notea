import MarkdownEditor from 'rich-markdown-editor'
import { NoteModel, NoteState } from 'libs/web/state/note'
import { KeyboardEvent, useCallback, useRef } from 'react'
import { TextareaAutosize } from '@material-ui/core'
import router from 'next/router'
import styled from 'styled-components'
import { has } from 'lodash'
import { darkTheme, lightTheme } from './theme'
import { useTheme } from 'next-themes'
import { useDebouncedCallback } from 'use-debounce'
import { useEditorState } from './editor-state'
import { useMounted } from 'libs/web/hooks/use-mounted'

const StyledMarkdownEditor = styled(MarkdownEditor)`
  .ProseMirror {
    min-height: calc(100vh - 14rem);
    padding-bottom: 10rem;
  }
`

const NoteEditor = () => {
  const {
    onSearchLink,
    onCreateLink,
    onClickLink,
    onUploadImage,
  } = useEditorState()
  const { theme } = useTheme()
  const { updateNote, createNote, note } = NoteState.useContainer()
  const editorEl = useRef<MarkdownEditor>(null)
  const mounted = useMounted()

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

  const onInputTitle = useCallback(
    (event: KeyboardEvent<HTMLTextAreaElement>) => {
      if (event.key.toLowerCase() === 'enter') {
        event.stopPropagation()
        event.preventDefault()
        editorEl.current?.focusAtEnd()
      }
    },
    []
  )

  const onTitleChange = useCallback(
    (event) => {
      const title = event.target.value
      onNoteChange.callback({ title })
    },
    [onNoteChange]
  )

  const onEditorChange = useCallback(
    (value: () => string): void => {
      onNoteChange.callback({ content: value() })
    },
    [onNoteChange]
  )

  return (
    <article className="pt-40 px-6 m-auto prose">
      <h1>
        <TextareaAutosize
          className="outline-none w-full resize-none block bg-transparent"
          placeholder="新页面"
          defaultValue={note?.title}
          key={note?.id}
          onKeyDown={onInputTitle}
          onChange={onTitleChange}
          maxLength={128}
          autoFocus
        />
      </h1>
      <StyledMarkdownEditor
        id={note?.id}
        ref={editorEl}
        value={mounted ? note?.content : ''}
        onChange={onEditorChange}
        theme={theme === 'dark' ? darkTheme : lightTheme}
        uploadImage={onUploadImage}
        onSearchLink={onSearchLink}
        onCreateLink={onCreateLink}
        onClickLink={onClickLink}
      />
    </article>
  )
}

export default NoteEditor
