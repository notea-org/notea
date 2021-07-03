import EditTitle from './edit-title'
import Editor, { EditorProps } from './editor'
import Backlinks from './backlinks'
import EditorState from 'libs/web/state/editor'
import { FC } from 'react'
import { NoteModel } from 'libs/shared/note'

const MainEditor: FC<
  EditorProps & {
    note?: NoteModel
    small?: boolean
    className?: string
  }
> = ({
  className = 'pt-40 px-6 m-auto h-full max-w-prose',
  note,
  small,
  ...props
}) => {
  return (
    <EditorState.Provider initialState={note}>
      <article className={className}>
        <EditTitle readOnly={props.readOnly} />
        <Editor {...props} />
        {!small && <Backlinks />}
      </article>
    </EditorState.Provider>
  )
}

export default MainEditor
