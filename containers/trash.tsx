import { useState, useCallback } from 'react'
import { createContainer } from 'unstated-next'
import { noteStore, NoteStoreItem } from 'utils/local-store'
import escapeStringRegexp from 'escape-string-regexp'
import useFetch from 'use-http'
import { map } from 'lodash'

function useTrashData() {
  const [noteIds, setNoteIds] = useState<string[]>()
  const [keyword, setKeyword] = useState<string>()
  const { get, data } = useFetch('/api/trash')
  const [filterData, setFilterData] = useState<NoteStoreItem[]>()

  const initTrash = useCallback(async () => {
    await get()
    setNoteIds(data)
  }, [data, get])

  const filterNotes = useCallback(
    async (keyword?: string) => {
      setKeyword(keyword)

      const data = [] as NoteStoreItem[]
      const re = keyword ? new RegExp(escapeStringRegexp(keyword)) : false

      map(noteIds, async (id) => {
        const note = await noteStore.getItem<NoteStoreItem>(id)
        if (!note) return
        if (
          !re ||
          re.test(note.rawContent || '') ||
          re.test(note.title || '')
        ) {
          data.push(note)
        }
      })

      setFilterData(data)
    },
    [noteIds]
  )

  return { filterData, keyword, filterNotes, initTrash }
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

function useTrash() {
  return {
    ...useFilterModal(),
    ...useTrashData(),
  }
}

export const TrashState = createContainer(useTrash)
