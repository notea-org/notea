import EditTitle from './edit-title'
import Editor from './editor'
import Backlinks from './backlinks'
import EditorState from 'libs/web/state/editor'

const MainEditor = () => {
  return (
    <EditorState.Provider>
      <article className="pt-40 px-6 m-auto h-full max-w-prose" dir="auto">
        <EditTitle />
        <Editor />
        <Backlinks />
      </article>
    </EditorState.Provider>
  )
}

export default MainEditor
