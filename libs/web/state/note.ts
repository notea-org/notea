import { useCallback, useState } from 'react'
import { createContainer } from 'unstated-next'
import { NoteTreeState } from 'libs/web/state/tree'
import { NOTE_DELETED, NOTE_SHARED } from 'libs/shared/meta'
import { useNoteAPI } from '../api/note'
import { noteCache } from '../cache/note'

export interface NoteModel {
  id: string
  title: string
  pid?: string
  content?: string
  pic?: string
  date?: string
  deleted: NOTE_DELETED
  shared: NOTE_SHARED
}

const useNote = () => {
  const [note, setNote] = useState<NoteModel>()
  const { find, create, mutate, loading, abort } = useNoteAPI()
  const {
    addItem,
    removeItem,
    mutateItem,
    genNewId,
  } = NoteTreeState.useContainer()

  const fetchNote = useCallback(
    async (id: string) => {
      const cache = await noteCache.getItem(id)
      if (cache) {
        setNote(cache)
      }
      const result = await find(id)

      if (!result) {
        throw new Error(`找不到 note:${id}`)
      }

      if (!result?.content) {
        result.content = '\n'
      }

      setNote(result)
      await noteCache.setItem(id, result)
    },
    [find]
  )

  const removeNote = useCallback(
    async (id: string) => {
      await mutate(id, { deleted: NOTE_DELETED.DELETED })
      await noteCache.mutateItem(id, { deleted: NOTE_DELETED.DELETED })
      await removeItem(id)
    },
    [mutate, removeItem]
  )

  const createNote = useCallback(
    async (data: Partial<NoteModel>) => {
      abort()

      const body = {
        id: data.id || note?.id,
        ...data,
      }
      const result = await create(body)

      if (!result) {
        // todo
        return
      }

      const newNote: NoteModel = {
        ...note,
        ...result,
      }

      await noteCache.setItem(newNote.id, newNote)
      delete newNote.content
      setNote(newNote)
      addItem(newNote)

      return newNote
    },
    [abort, create, addItem, note]
  )

  const createNoteWithTitle = useCallback(
    async (title: NoteModel['title']) => {
      const id = genNewId()
      const result = await create({
        id,
        title,
      })

      if (!result) {
        // todo
        return
      }

      await noteCache.setItem(result.id, result)
      addItem(result)

      return note
    },
    [addItem, create, genNewId, note]
  )

  const updateNote = useCallback(
    async (data: Partial<NoteModel>) => {
      abort()

      if (!note?.id) {
        //  todo
        return
      }
      const newNote = {
        ...note,
        ...data,
      }
      delete newNote.content
      setNote(newNote)
      mutateItem(newNote.id, {
        data: newNote,
      })
      await mutate(note.id, data)
      await noteCache.mutateItem(note.id, data)
    },
    [abort, note, mutate, mutateItem]
  )

  const initNote = useCallback((note: Partial<NoteModel>) => {
    setNote({
      deleted: NOTE_DELETED.NORMAL,
      shared: NOTE_SHARED.PRIVATE,
      id: '-1',
      title: '',
      ...note,
    })
  }, [])

  return {
    note,
    fetchNote,
    createNote,
    createNoteWithTitle,
    updateNote,
    removeNote,
    initNote,
    loading,
  }
}

export const NoteState = createContainer(useNote)
