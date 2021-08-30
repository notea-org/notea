import EditTitle from './edit-title'
import Editor, { EditorProps } from './editor'
import Backlinks from './backlinks'
import EditorState from 'libs/web/state/editor'
import UIState from 'libs/web/state/ui'
import { FC } from 'react'
import { NoteModel } from 'libs/shared/note'

const MainEditor: FC<
  EditorProps & {
    note?: NoteModel
    small?: boolean
    className?: string
  }
> = ({
  className,
  note,
  small,
  ...props
}) => {
  const { settings: { settings } } = UIState.useContainer()
  const editorWidthClass = (note?.editorsize ?? settings.editorsize) > 0 ? "max-w-4xl" : "max-w-prose"
  const articleClassName = className || `pt-40 px-6 m-auto h-full ${editorWidthClass}`

  return (
    <EditorState.Provider initialState={note}>
      <article className={articleClassName}>
        <EditTitle readOnly={props.readOnly} />
        <Editor {...props} />
        {!small && <Backlinks />}
      </article>
    </EditorState.Provider>
  )
}

export default MainEditor
