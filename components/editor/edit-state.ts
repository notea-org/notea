import NoteState from 'libs/web/state/note'
import { useRouter } from 'next/router'
import { useCallback } from 'react'
import { searchNote, searchRangeText } from 'libs/web/utils/search'
import useFetcher from 'libs/web/api/fetcher'
import { NOTE_DELETED } from 'libs/shared/meta'

const onSearchLink = async (keyword: string) => {
  const list = await searchNote(keyword, NOTE_DELETED.NORMAL)

  return list.map((item) => ({
    title: item.title,
    // todo 路径
    subtitle: searchRangeText({
      text: item.rawContent || '',
      keyword,
      maxLen: 40,
    }).match,
    url: `/${item.id}`,
  }))
}

const useEditState = () => {
  const { createNoteWithTitle } = NoteState.useContainer()
  const router = useRouter()
  const { request } = useFetcher()

  const onCreateLink = useCallback(
    async (title) => {
      const result = await createNoteWithTitle(title)

      if (!result) {
        throw new Error('todo')
      }

      return `/${result.id}`
    },
    [createNoteWithTitle]
  )

  const onClickLink = useCallback(
    (href: string) => {
      router.push(href, undefined, { shallow: true })
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

export default useEditState
