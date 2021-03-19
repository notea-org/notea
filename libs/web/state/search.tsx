import { useState, useCallback, useMemo } from 'react'
import { createContainer } from 'unstated-next'
import { NoteCacheItem } from 'libs/web/cache'
import escapeStringRegexp from 'escape-string-regexp'
import { noteCache } from '../cache/note'
import TreeActions from 'libs/shared/tree'
import { map } from 'lodash'
import { NoteTreeState } from './tree'

export async function searchNote(keyword: string, ignoreIds: string[]) {
  const data = [] as NoteCacheItem[]
  const re = new RegExp(escapeStringRegexp(keyword))

  await noteCache.iterate<NoteCacheItem, void>((note) => {
    if (ignoreIds.includes(note.id)) return
    if (re.test(note.rawContent || '') || re.test(note.title)) {
      data.push(note)
    }
  })
  return data
}

function useSearchData() {
  const [list, setList] = useState<NoteCacheItem[]>()
  const [keyword, setKeyword] = useState<string>()
  const { tree } = NoteTreeState.useContainer()
  const deletedIds = useMemo(
    () => map(TreeActions.getUnusedItems(tree), (item) => item.id),
    [tree]
  )

  const filterNotes = useCallback(
    async (keyword?: string) => {
      setKeyword(keyword)
      setList(keyword ? await searchNote(keyword, deletedIds) : [])
    },
    [deletedIds]
  )

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
