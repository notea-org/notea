import MarkdownEditor, { theme } from 'rich-markdown-editor'
import { debounce } from 'lodash'
import { PageState } from '../containers/page'

export const Editor = () => {
  const { savePage, page } = PageState.useContainer()

  const onChange = debounce((value) => {
    savePage({
      id: '2',
      content: value,
      title: '测试标题',
      pid: '0',
      order: 0,
    })
  }, 1000)

  return (
    <MarkdownEditor
      value={page?.content || ''}
      onChange={(value) => {
        onChange(value())
      }}
      theme={{
        ...theme,
        fontFamily: 'inherit',
      }}
      onCreateLink={async () => {
        return '1'
      }}
    ></MarkdownEditor>
  )
}
