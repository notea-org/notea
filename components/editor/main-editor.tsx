import EditTitle from './edit-title'
import Editor, { EditorProps } from './editor'
import Backlinks from './backlinks'
import EditorState from 'libs/web/state/editor'
import { FC } from 'react'

const MainEditor: FC<
  EditorProps & {
    className?: string
  }
> = ({ className = 'pt-40 px-6 m-auto h-full max-w-prose', ...props }) => {
  return (
    <EditorState.Provider>
      <article className={className}>
        <EditTitle readOnly={props.readOnly} />
        <Editor {...props} />
        <Backlinks />
      </article>
    </EditorState.Provider>
  )
}

export default MainEditor
