import MarkdownEditor from 'rich-markdown-editor'
import { PageModel, PageState } from 'containers/page'
import { KeyboardEvent, useCallback, useEffect, useRef, useState } from 'react'
import TextareaAutosize from 'react-textarea-autosize'
import { PageTreeState } from 'containers/page-tree'
import router from 'next/router'
import styled from 'styled-components'
import { has } from 'lodash'
import { darkTheme, lightTheme } from './theme'
import { useDarkMode } from 'next-dark-mode'
import debounceSync from 'debounce-async'
import useFetch from 'use-http'

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
  const [title, setTitle] = useState()
  const titleEl = useRef<HTMLTextAreaElement>(null)
  const editorEl = useRef<MarkdownEditor>(null)

  const onPageChange = useCallback(
    (data: Partial<PageModel>) => {
      debouncePageChange(async () => {
        const isNew = has(router.query, 'new')
        if (isNew) {
          data.pid = (router.query.pid as string) || 'root'
        }
        if (!data.title) {
          data.title = title
        }
        const item = await savePage(data, isNew)
        const pageUrl = `/page/${item.id}`

        if (router.asPath !== pageUrl) {
          await router.replace(pageUrl, undefined, { shallow: true })
        }
        addToTree(item)
      })
    },
    [addToTree, savePage, title]
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

  const upload = useFetch('/api/file/upload')
  const onUploadImage = useCallback(
    async (file) => {
      const data = new FormData()
      data.append('file', file)
      const result = await upload.post(data)
      return result.url
    },
    [upload]
  )

  useEffect(() => {
    titleEl.current?.focus()
  }, [page.id])

  const onTitleChange = useCallback(
    (event) => {
      const title = event.target.value
      onPageChange({ title })
      setTitle(title)
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
        uploadImage={onUploadImage}
        onCreateLink={async () => {
          return '1'
        }}
      />
    </article>
  )
}

export default PageEditor
