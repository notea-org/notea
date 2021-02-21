import MarkdownEditor, { theme } from 'rich-markdown-editor'
import { PageModel, PageState } from 'containers/page'
import { KeyboardEvent, useCallback, useEffect, useRef } from 'react'
import TextareaAutosize from 'react-textarea-autosize'
import { PageTreeState } from 'containers/page-tree'
import router from 'next/router'
import styled from 'styled-components'
import { has } from 'lodash'
const debounce = require('debounce-async').default

const StyledMarkdownEditor = styled(MarkdownEditor)`
  .ProseMirror {
    padding-bottom: 10rem;
  }
`

const debouncePageChange = debounce(async (cb: any) => {
  return cb && cb()
}, 500)

const PageEditor = () => {
  const { savePage, page } = PageState.useContainer()
  const { addToTree } = PageTreeState.useContainer()
  const titleEl = useRef<HTMLTextAreaElement>(null)
  const editorEl = useRef<MarkdownEditor>(null)

  const onPageChange = useCallback(
    (data: Partial<PageModel>) => {
      debouncePageChange(async () => {
        const isNew = has(router.query, 'new')
        if (isNew) {
          data.pid = (router.query.pid as string) || 'root'
        }
        const item = await savePage(data, isNew)
        const pageUrl = `/page/${item.id}`

        if (router.asPath !== pageUrl) {
          await router.replace(pageUrl, undefined, { shallow: true })
        }
        addToTree(item)
      })
    },
    [addToTree, savePage]
  )

  const onInputTitle = useCallback(
    (event: KeyboardEvent<HTMLTextAreaElement>) => {
      if (event.key.toLowerCase() === 'enter') {
        event.stopPropagation()
        event.preventDefault()
        editorEl.current?.focusAtEnd()
      }
    },
    []
  )

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
          key={page.id}
          onKeyDown={onInputTitle}
          onChange={(event) => {
            onPageChange({ title: event.target.value })
          }}
          maxLength={128}
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

export default PageEditor
