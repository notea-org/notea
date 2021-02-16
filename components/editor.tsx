import MarkdownEditor, { theme } from 'rich-markdown-editor'
import { debounce } from 'lodash'
import { PageModel, PageState } from '../containers/page'
import { KeyboardEvent, useRef } from 'react'
import TextareaAutosize from 'react-textarea-autosize'
import { PageListState } from '../containers/page-list'
import { useRouter } from 'next/router'

export const Editor = () => {
  const { savePage, page } = PageState.useContainer()
  const { addToList } = PageListState.useContainer()
  const editorEl = useRef<MarkdownEditor>(null)
  const router = useRouter()

  const onPageChange = debounce(async (p: Partial<PageModel>) => {
    const item = await savePage(p)
    addToList(item)
    router.replace(`/page/${item.id}`)
  }, 500)
  const onInputTitle = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key.toLowerCase() === 'enter') {
      event.stopPropagation()
      event.preventDefault()
      editorEl.current?.focusAtEnd()
    }
  }

  return (
    <article>
      <h1>
        <TextareaAutosize
          className="outline-none w-full resize-none block"
          placeholder="新页面"
          defaultValue={page.title}
          onKeyDown={onInputTitle}
          onChange={(event) => {
            onPageChange({ title: event.target.value })
          }}
          autoFocus
        />
      </h1>
      <MarkdownEditor
        id={page.id}
        ref={editorEl}
        value={page.content}
        onChange={(value) => {
          onPageChange({ content: value() })
        }}
        theme={{
          ...theme,
          fontFamily: 'inherit',
        }}
        onCreateLink={async () => {
          return '1'
        }}
      />
    </article>
  )
}
