import { useState, useCallback, useMemo } from 'react'
import { createContainer } from 'unstated-next'
import escapeStringRegexp from 'escape-string-regexp'
import { map, reduce, some } from 'lodash'
import { NoteTreeState } from './tree'
import TreeActions from 'libs/shared/tree'
import { NoteModel } from './note'
import { useTrashAPI } from '../api/trash'

function useTrashData() {
  const [keyword, setKeyword] = useState<string>()
  const [filterData, setFilterData] = useState<NoteModel[]>()
  const { tree, restoreItem, deleteItem } = NoteTreeState.useContainer()
  const { mutate, loading } = useTrashAPI()
  const deletedNotes = useMemo(
    () => map(TreeActions.getUnusedItems(tree), (item) => item.data),
    [tree]
  )

  const filterNotes = useCallback(
    async (keyword?: string) => {
      const re = keyword ? new RegExp(escapeStringRegexp(keyword)) : false
      const data = reduce<NoteModel | undefined, NoteModel[]>(
        deletedNotes,
        (acc, note) => {
          if (!note) return acc
          if (!re || re.test(note.title)) {
            return [...acc, note]
          }
          return acc
        },
        []
      )

      setKeyword(keyword)
      setFilterData(data)
    },
    [deletedNotes]
  )

  const restoreNote = useCallback(
    async (note: NoteModel) => {
      // 父页面被删除时，恢复页面的 parent 改成 root
      if (
        !note.pid ||
        !tree.items[note.pid] ||
        some(deletedNotes, (n) => n && n.id === note.pid)
      ) {
        note.pid = 'root'
      }

      await mutate({
        action: 'restore',
        data: {
          id: note.id,
          parentId: note.pid,
        },
      })
      restoreItem(note.id, note.pid)

      return note
    },
    [deletedNotes, tree.items, mutate, restoreItem]
  )

  const deleteNote = useCallback(
    async (id: string) => {
      await mutate({
        action: 'delete',
        data: {
          id,
        },
      })
      deleteItem(id)
    },
    [deleteItem, mutate]
  )

  return {
    filterData,
    keyword,
    loading,
    filterNotes,
    restoreNote,
    deleteNote,
  }
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
