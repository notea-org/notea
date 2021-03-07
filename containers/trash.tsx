import { useState, useCallback } from 'react'
import { createContainer } from 'unstated-next'
import { NoteStoreItem } from 'services/local-store'
import escapeStringRegexp from 'escape-string-regexp'
import useFetch, { CachePolicies } from 'use-http'
import { flatten, map, union } from 'lodash'
import NoteStoreAPI from 'services/local-store/note'

async function findNotes(noteIds: string[], keyword?: string) {
  const data = [] as NoteStoreItem[]
  const re = keyword ? new RegExp(escapeStringRegexp(keyword)) : false

  await Promise.all(
    map(noteIds, async (id) => {
      const note = await NoteStoreAPI.fetchNote(id)
      if (!note) return
      if (!re || re.test(note.rawContent || '') || re.test(note.title || '')) {
        data.push(note)
      }
    })
  )

  return data
}

function useTrashData() {
  const [noteIds, setNoteIds] = useState<string[]>([])
  const [keyword, setKeyword] = useState<string>()
  const [filterData, setFilterData] = useState<NoteStoreItem[]>()
  const { get } = useFetch('/api/trash', {
    cachePolicy: CachePolicies.NO_CACHE,
  })

  const filterNotes = useCallback(
    async (keyword?: string) => {
      setKeyword(keyword)
      setFilterData(await findNotes(noteIds, keyword))
    },
    [noteIds]
  )

  const initTrash = useCallback(async () => {
    const data = await get()
    const ids = union(flatten(map(data, (item) => [item.id, ...item.children])))

    setNoteIds(ids)
    setFilterData(await findNotes(ids))
  }, [get])

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
