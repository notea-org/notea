import { FC, RefObject, useCallback } from 'react'
import { use100vh } from 'react-div-100vh'
import useEditState from './edit-state'
import { NoteModel } from 'libs/shared/note'
import MarkdownEditor from 'rich-markdown-editor'
import { DebouncedState } from 'use-debounce/lib/useDebouncedCallback'
import { useTheme } from 'next-themes'
import { darkTheme, lightTheme } from './theme'
import useMounted from 'libs/web/hooks/use-mounted'

const Editor: FC<{
  note?: NoteModel
  onNoteChange: DebouncedState<(data: Partial<NoteModel>) => Promise<void>>
  editorEl: RefObject<MarkdownEditor>
}> = ({ onNoteChange, editorEl, note }) => {
  const {
    onSearchLink,
    onCreateLink,
    onClickLink,
    onUploadImage,
  } = useEditState()
  const height = use100vh()
  const mounted = useMounted()
  const { resolvedTheme } = useTheme()

  const onEditorChange = useCallback(
    (value: () => string): void => {
      onNoteChange.callback({ content: value() })
    },
    [onNoteChange]
  )

  return (
    <>
      <MarkdownEditor
        id={note?.id}
        ref={editorEl}
        value={mounted ? note?.content : ''}
        onChange={onEditorChange}
        theme={resolvedTheme === 'dark' ? darkTheme : lightTheme}
        uploadImage={onUploadImage}
        onSearchLink={onSearchLink}
        onCreateLink={onCreateLink}
        onClickLink={onClickLink}
      />
      <style jsx global>{`
        ul {
          list-style-type: disc;
        }

        ol {
          list-style-type: decimal;
        }

        .ProseMirror {
          min-height: calc(${height ? height + 'px' : '100vh'} - 14rem);
          padding-bottom: 10rem;
        }
      `}</style>
    </>
  )
}

export default Editor
