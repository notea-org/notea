import { TextareaAutosize } from '@material-ui/core'
import { NoteModel } from 'libs/web/state/note'
import { FC, useCallback, KeyboardEvent, RefObject } from 'react'
import MarkdownEditor from 'rich-markdown-editor'
import { DebouncedState } from 'use-debounce/lib/useDebouncedCallback'

const EditTitle: FC<{
  note?: NoteModel
  onNoteChange: DebouncedState<(data: Partial<NoteModel>) => Promise<void>>
  editorEl: RefObject<MarkdownEditor>
}> = ({ onNoteChange, editorEl, note }) => {
  const onInputTitle = useCallback(
    (event: KeyboardEvent<HTMLTextAreaElement>) => {
      if (event.key.toLowerCase() === 'enter') {
        event.stopPropagation()
        event.preventDefault()
        editorEl.current?.focusAtEnd()
      }
    },
    [editorEl]
  )

  const onTitleChange = useCallback(
    (event) => {
      const title = event.target.value
      onNoteChange.callback({ title })
    },
    [onNoteChange]
  )

  return (
    <h1 className="text-3xl mb-8">
      <TextareaAutosize
        className="outline-none w-full resize-none block bg-transparent"
        placeholder="新页面"
        defaultValue={note?.title}
        key={note?.id}
        onKeyDown={onInputTitle}
        onChange={onTitleChange}
        maxLength={128}
      />
    </h1>
  )
}

export default EditTitle
