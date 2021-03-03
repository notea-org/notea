import { useState, useCallback, useEffect } from 'react'
import { createContainer } from 'unstated-next'
import { noteStore, NoteStoreItem } from 'utils/local-store'
import escapeStringRegexp from 'escape-string-regexp'

function useSearchData() {
  const [list, setList] = useState<NoteStoreItem[]>()
  const [keyword, setKeyword] = useState<string>()

  const filterNotes = useCallback(async (keyword?: string) => {
    if (!keyword) {
      setList([])
      return
    }
    const data = [] as NoteStoreItem[]
    const re = new RegExp(escapeStringRegexp(keyword))

    await noteStore.iterate<NoteStoreItem, void>((note) => {
      if (re.test(note.rawContent || '') || re.test(note.title || '')) {
        data.push(note)
      }
    })

    setList(data)
  }, [])

  useEffect(() => {
    filterNotes(keyword)
  }, [filterNotes, keyword])

  return { list, keyword, setKeyword }
}

function useSearchModal() {
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
    ...useSearchModal(),
    ...useSearchData(),
  }
}

export const SearchState = createContainer(useSearch)
