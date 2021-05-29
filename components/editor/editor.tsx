import { FC, RefObject, useCallback, useMemo } from 'react'
import { use100vh } from 'react-div-100vh'
import useEditState from './edit-state'
import { NoteModel } from 'libs/shared/note'
import MarkdownEditor from 'rich-markdown-editor'
import { DebouncedState } from 'use-debounce/lib/useDebouncedCallback'
import { useEditorTheme } from './theme'
import useMounted from 'libs/web/hooks/use-mounted'
import useI18n from 'libs/web/hooks/use-i18n'
import Tooltip from './tooltip'
import extensions from './extensions'

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
    onHoverLink,
  } = useEditState()
  const height = use100vh()
  const mounted = useMounted()
  const { t } = useI18n()
  const editorTheme = useEditorTheme()

  const dictionary = useMemo(
    () => ({
      addColumnAfter: t('Insert column after'),
      addColumnBefore: t('Insert column before'),
      addRowAfter: t('Insert row after'),
      addRowBefore: t('Insert row before'),
      alignCenter: t('Align center'),
      alignLeft: t('Align left'),
      alignRight: t('Align right'),
      bulletList: t('Bulleted list'),
      checkboxList: t('Todo list'),
      codeBlock: t('Code block'),
      codeCopied: t('Copied to clipboard'),
      codeInline: t('Code'),
      createLink: t('Create link'),
      createLinkError: t('Sorry, an error occurred creating the link'),
      createNewDoc: t('Create a new doc'),
      deleteColumn: t('Delete column'),
      deleteRow: t('Delete row'),
      deleteTable: t('Delete table'),
      deleteImage: t('Delete image'),
      alignImageLeft: t('Float left half width'),
      alignImageRight: t('Float right half width'),
      alignImageDefault: t('Center large'),
      em: t('Italic'),
      embedInvalidLink: t('Sorry, that link won’t work for this embed type'),
      findOrCreateDoc: t('Find or create a doc…'),
      h1: t('Big heading'),
      h2: t('Medium heading'),
      h3: t('Small heading'),
      heading: t('Heading'),
      hr: t('Divider'),
      image: t('Image'),
      imageUploadError: t('Sorry, an error occurred uploading the image'),
      info: t('Info'),
      infoNotice: t('Info notice'),
      link: t('Link'),
      linkCopied: t('Link copied to clipboard'),
      mark: t('Highlight'),
      newLineEmpty: t("Type '/' to insert…"),
      newLineWithSlash: t('Keep typing to filter…'),
      noResults: t('No results'),
      openLink: t('Open link'),
      orderedList: t('Ordered list'),
      pageBreak: t('Page break'),
      pasteLink: t('Paste a link…'),
      pasteLinkWithTitle: (title: string): string =>
        t(`Paste a {{title}} link…`, { title }),
      placeholder: t('Placeholder'),
      quote: t('Quote'),
      removeLink: t('Remove link'),
      searchOrPasteLink: t('Search or paste a link…'),
      strikethrough: t('Strikethrough'),
      strong: t('Bold'),
      subheading: t('Subheading'),
      table: t('Table'),
      tip: t('Tip'),
      tipNotice: t('Tip notice'),
      warning: t('Warning'),
      warningNotice: t('Warning notice'),
    }),
    [t]
  )

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
        theme={editorTheme}
        uploadImage={(file) => onUploadImage(file, note?.id)}
        onSearchLink={onSearchLink}
        onCreateLink={onCreateLink}
        onClickLink={onClickLink}
        onHoverLink={onHoverLink}
        dictionary={dictionary}
        tooltip={Tooltip}
        extensions={extensions}
        className="px-4 md:px-0"
      />
      <style jsx global>{`
        .ProseMirror ul {
          list-style-type: disc;
        }

        .ProseMirror ol {
          list-style-type: decimal;
        }

        .ProseMirror {
          min-height: calc(${height ? height + 'px' : '100vh'} - 14rem);
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
        .ProseMirror a {
          text-decoration: underline;
        }
      `}</style>
    </>
  )
}

export default Editor
