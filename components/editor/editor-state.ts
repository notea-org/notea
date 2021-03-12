import { NoteState } from 'containers/note'
import { searchNote } from 'containers/search'
import { useRouter } from 'next/router'
import { useCallback } from 'react'
import { searchRangeText } from 'shared/text'
import useFetch from 'use-http'

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
  const upload = useFetch('/api/upload')

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
