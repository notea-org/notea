import { useState, useCallback } from 'react'
import { createContainer } from 'unstated-next'
import { NoteCacheItem } from 'libs/web/cache'
import { NOTE_DELETED } from 'libs/shared/meta'
import { searchNote } from '../utils/search'

function useSearchData() {
  const [list, setList] = useState<NoteCacheItem[]>()
  const [keyword, setKeyword] = useState<string>()
  const filterNotes = useCallback(async (keyword?: string) => {
    setKeyword(keyword)
    setList(keyword ? await searchNote(keyword, NOTE_DELETED.NORMAL) : [])
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
