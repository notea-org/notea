import { FC, useEffect, useState } from 'react'
import { use100vh } from 'react-div-100vh'
import MarkdownEditor, { Props } from 'rich-markdown-editor'
import { useEditorTheme } from './theme'
import Tooltip from './tooltip'
import extensions from './extensions'
import EditorState from 'libs/web/state/editor'
import { useToast } from 'libs/web/hooks/use-toast'
import { useDictionary } from './dictionary'
import { useEmbeds } from './embeds'

export type EditorProps = Pick<Props, 'readOnly'>

const Editor: FC<EditorProps> = ({ readOnly }) => {
  const {
    onSearchLink,
    onCreateLink,
    onClickLink,
    onUploadImage,
    onHoverLink,
    backlinks,
    editorEl,
    note,
  } = EditorState.useContainer()
  const height = use100vh()
  const editorTheme = useEditorTheme()
  const [hasMinHeight, setHasMinHeight] = useState(true)
  const toast = useToast()
  const dictionary = useDictionary()
  const embeds = useEmbeds()

  useEffect(() => {
    setHasMinHeight((backlinks?.length ?? 0) <= 0)
  }, [backlinks])

  return (
    <>
      <MarkdownEditor
        readOnly={readOnly}
        id={note?.id}
        key={note?.id}
        ref={editorEl}
        placeholder={dictionary.editorPlaceholder}
        theme={editorTheme}
        uploadImage={(file) => onUploadImage(file, note?.id)}
        onSearchLink={onSearchLink}
        onCreateLink={onCreateLink}
        onClickLink={onClickLink}
        onHoverLink={onHoverLink}
        onShowToast={toast}
        dictionary={dictionary}
        tooltip={Tooltip}
        extensions={extensions}
        className="px-4 md:px-0"
        embeds={embeds}
      />
      <style jsx global>{`
        .ProseMirror ul {
          list-style-type: disc;
        }

        .ProseMirror ol {
          list-style-type: decimal;
        }

        .ProseMirror {
          ${hasMinHeight
            ? `min-height: calc(${height ? height + 'px' : '100vh'} - 14rem);`
            : ''}
          padding-bottom: 10rem;
        }

        .ProseMirror h1 {
          font-size: 2.8em;
        }
        .ProseMirror h2 {
          font-size: 1.8em;
        }
        .ProseMirror h3 {
          font-size: 1.5em;
        }
        .ProseMirror a:not(.bookmark) {
          text-decoration: underline;
        }

        .ProseMirror .image .ProseMirror-selectednode img {
          pointer-events: unset;
        }
      `}</style>
    </>
  )
}

export default Editor
