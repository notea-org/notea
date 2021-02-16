import MarkdownEditor, { theme } from 'rich-markdown-editor'
import { PageModel, PageState } from 'containers/page'
import { KeyboardEvent, useEffect, useRef } from 'react'
import TextareaAutosize from 'react-textarea-autosize'
import { PageListState } from 'containers/page-list'
import { useRouter } from 'next/router'
import styled from 'styled-components'
const debounce = require('debounce-async').default

const StyledMarkdownEditor = styled(MarkdownEditor)`
  .ProseMirror {
    padding-bottom: 10rem;
  }
`

export const Editor = () => {
  const { savePage, page } = PageState.useContainer()
  const { addToList } = PageListState.useContainer()
  const titleEl = useRef<HTMLTextAreaElement>(null)
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

  useEffect(() => {
    titleEl.current?.focus()
  }, [page.id])

  return (
    <article className="pt-40">
      <h1>
        <TextareaAutosize
          ref={titleEl}
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
      <StyledMarkdownEditor
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
