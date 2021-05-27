import NoteState from 'libs/web/state/note'
import { useRouter } from 'next/router'
import { useCallback } from 'react'
import { searchNote, searchRangeText } from 'libs/web/utils/search'
import useFetcher from 'libs/web/api/fetcher'
import { NOTE_DELETED } from 'libs/shared/meta'
import { isNoteLink } from 'libs/shared/note'
import { useToast } from 'libs/web/hooks/use-toast'
import PortalState from 'libs/web/state/portal'

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
  const { request, error } = useFetcher()
  const toast = useToast()

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
      if (isNoteLink(href.replace(location.origin, ''))) {
        router.push(href, undefined, { shallow: true })
      } else {
        window.open(href, '_blank')
      }
    },
    [router]
  )

  const onUploadImage = useCallback(
    async (file: File, id?: string) => {
      const data = new FormData()
      data.append('file', file)
      const result = await request<FormData, { url: string }>(
        {
          method: 'POST',
          url: `/api/upload?id=${id}`,
        },
        data
      )
      if (!result) {
        toast(error, 'error')
        throw Error(error)
      }
      return result.url
    },
    [error, request, toast]
  )

  const { preview } = PortalState.useContainer()

  const onHoverLink = useCallback(
    (event: MouseEvent) => {
      const link = event.target as HTMLLinkElement
      const href = link.href.replace(location.origin, '')
      if (isNoteLink(href)) {
        preview.setData({ id: href.slice(1) })
        preview.setAnchor(link)
      }
      return true
    },
    [preview]
  )

  return {
    onCreateLink,
    onSearchLink,
    onClickLink,
    onUploadImage,
    onHoverLink,
  }
}

export default useEditState
