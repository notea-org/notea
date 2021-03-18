import { useState, useCallback } from 'react'
import { createContainer } from 'unstated-next'
import { NoteCacheItem } from 'libs/web/cache'
import escapeStringRegexp from 'escape-string-regexp'
import { noteCache } from '../cache/note'

export async function searchNote(keyword: string) {
  const data = [] as NoteCacheItem[]
  const re = new RegExp(escapeStringRegexp(keyword))

  await noteCache.iterate<NoteCacheItem, void>((note) => {
    if (re.test(note.rawContent || '') || re.test(note.title)) {
      data.push(note)
    }
  })
  return data
}

function useSearchData() {
  const [list, setList] = useState<NoteCacheItem[]>()
  const [keyword, setKeyword] = useState<string>()

  const filterNotes = useCallback(async (keyword?: string) => {
    setKeyword(keyword)

    if (!keyword) {
      setList([])
      return
    }

    const data = await searchNote(keyword)

    setList(data)
  }, [])

  return { list, keyword, filterNotes }
}

function useFilterModal() {
  const [isOpen, setIsOpen] = useState(false)

  const openModal = useCallback(() => {
    setIsOpen(true)
  }, [])

  const closeModal = useCallback(() => {
    setIsOpen(false)
  }, [])

  return { isOpen, openModal, closeModal }
}

function useSearch() {
  return {
    ...useFilterModal(),
    ...useSearchData(),
  }
}

export const SearchState = createContainer(useSearch)
