import { NoteState } from 'libs/web/state/note'
import { searchNote } from 'libs/web/state/search'
import { useRouter } from 'next/router'
import { useCallback } from 'react'
import { searchRangeText } from 'libs/shared/text'
import useFetch, { CachePolicies } from 'use-http'

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
  const upload = useFetch('/api/upload', {
    cachePolicy: CachePolicies.NO_CACHE,
  })

  const onCreateLink = useCallback(
    async (title) => {
      const { id } = await createNoteWithTitle(title)

      return id
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
      const result = await upload.post(data)
      return result.url
    },
    [upload]
  )

  return { onCreateLink, onSearchLink, onClickLink, onUploadImage }
}

export default useEditorState
