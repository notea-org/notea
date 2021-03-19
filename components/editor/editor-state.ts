import { NoteState } from 'libs/web/state/note'
import { searchNote } from 'libs/web/state/search'
import { useRouter } from 'next/router'
import { useCallback } from 'react'
import { searchRangeText } from 'libs/shared/text'
import { useFetcher } from 'libs/web/api/fetcher'

const onSearchLink = async (keyword: string) => {
  const list = await searchNote(keyword)

  return list.map((item) => ({
    title: item.title,
    // todo 路径
    subtitle: searchRangeText({
      text: item.rawContent || '',
      keyword,
      maxLen: 40,
    }),
    url: `/note/${item.id}`,
  }))
}

const useEditorState = () => {
  const { createNoteWithTitle } = NoteState.useContainer()
  const router = useRouter()
  const { request } = useFetcher()

  const onCreateLink = useCallback(
    async (title) => {
      const result = await createNoteWithTitle(title)

      if (!result) {
        throw new Error('todo')
      }

      return result.id
    },
    [createNoteWithTitle]
  )

  const onClickLink = useCallback(
    (href: string) => {
      router.push(href)
    },
    [router]
  )

  const onUploadImage = useCallback(
    async (file) => {
      const data = new FormData()
      data.append('file', file)
      const result = await request<FormData, { url: string }>(
        {
          method: 'POST',
          url: `/api/upload`,
        },
        data
      )
      if (!result) {
        throw new Error('todo')
      }
      return result.url
    },
    [request]
  )

  return { onCreateLink, onSearchLink, onClickLink, onUploadImage }
}

export default useEditorState
