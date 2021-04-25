import { TextareaAutosize } from '@material-ui/core'
import useI18n from 'libs/web/hooks/use-i18n'
import { NoteModel } from 'libs/web/state/note'
import { has } from 'lodash'
import { useRouter } from 'next/router'
import {
  FC,
  useCallback,
  KeyboardEvent,
  RefObject,
  useRef,
  useMemo,
} from 'react'
import MarkdownEditor from 'rich-markdown-editor'
import { DebouncedState } from 'use-debounce/lib/useDebouncedCallback'

const EditTitle: FC<{
  note?: NoteModel
  onNoteChange: DebouncedState<(data: Partial<NoteModel>) => Promise<void>>
  editorEl: RefObject<MarkdownEditor>
}> = ({ onNoteChange, editorEl, note }) => {
  const router = useRouter()
  const inputRef = useRef<HTMLTextAreaElement>(null)
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

  const autoFocus = useMemo(() => has(router.query, 'new'), [router.query])

  const { t } = useI18n()

  return (
    <h1 className="text-3xl mb-8">
      <TextareaAutosize
        ref={inputRef}
        className="outline-none w-full resize-none block bg-transparent"
        placeholder={t('New Page')}
        defaultValue={note?.title}
        key={note?.id}
        onKeyPress={onInputTitle}
        onChange={onTitleChange}
        maxLength={128}
        autoFocus={autoFocus}
      />
    </h1>
  )
}

export default EditTitle
