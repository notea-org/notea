import { useState } from 'react'
import MarkdownEditor, { theme } from 'rich-markdown-editor'
import { debounce } from 'lodash'
import useFetch from 'use-http'

export const Editor = () => {
  const [content] = useState<string>()
  const { post } = useFetch('/api/pages')
  const postPage = debounce((value) => {
    post({
      id: 2,
      content: value,
      meta: {
        title: '测试标题',
        pid: 0,
        order: 0,
      },
    })
  }, 1000)

  return (
    <MarkdownEditor
      value={content}
      onChange={(value) => {
        postPage(value())
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
