import MarkdownEditor from 'rich-markdown-editor'
import { PageModel, PageState } from 'containers/page'
import { KeyboardEvent, useCallback, useEffect, useRef } from 'react'
import TextareaAutosize from 'react-textarea-autosize'
import { PageTreeState } from 'containers/page-tree'
import router from 'next/router'
import styled from 'styled-components'
import { has } from 'lodash'
import { darkTheme, lightTheme } from './theme'
import { useDarkMode } from 'next-dark-mode'
import debounceSync from 'debounce-async'

const StyledMarkdownEditor = styled(MarkdownEditor)`
  .ProseMirror {
    min-height: calc(100vh - 14rem);
    padding-bottom: 10rem;
  }
`

const debouncePageChange = debounceSync(async (cb: any) => {
  return cb && cb()
}, 500)

const PageEditor = () => {
  const { darkModeActive } = useDarkMode()
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

  const onTitleChange = useCallback(
    (event) => {
      onPageChange({ title: event.target.value })
    },
    [onPageChange]
  )

  const onEditorChange = useCallback(
    (value: () => string): void => {
      onPageChange({ content: value() })
    },
    [onPageChange]
  )

  return (
    <article className="pt-40 px-6">
      <h1>
        <TextareaAutosize
          ref={titleEl}
          className="outline-none w-full resize-none block bg-transparent"
          placeholder="新页面"
          defaultValue={page.title}
          key={page.id}
          onKeyDown={onInputTitle}
          onChange={onTitleChange}
          maxLength={128}
          autoFocus
        />
      </h1>
      <StyledMarkdownEditor
        id={page.id}
        ref={editorEl}
        value={page.content}
        onChange={onEditorChange}
        theme={darkModeActive ? darkTheme : lightTheme}
        onCreateLink={async () => {
          return '1'
        }}
      />
    </article>
  )
}

export default PageEditor
