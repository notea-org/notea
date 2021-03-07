import { useCallback, useState } from 'react'
import { createContainer } from 'unstated-next'
import useFetch from 'use-http'
import { NoteTreeState } from 'containers/tree'
import { NOTE_DELETED, NOTE_SHARED } from 'shared/meta'
import NoteStoreAPI from 'services/local-store/note'

export interface NoteModel {
  id: string
  title: string
  pid?: string
  content?: string
  pic?: string
  cid?: string[]
  date?: string
  deleted: NOTE_DELETED
  shared: NOTE_SHARED
}

const useNote = () => {
  const [note, setNote] = useState<NoteModel>({} as NoteModel)
  const { get, post, cache, abort, loading } = useFetch('/api/notes')
  const { addItem, removeItem, mutateItem } = NoteTreeState.useContainer()

  const getById = useCallback(
    async (id: string) => {
      const res = await get(id)

      if (res.status === 404) {
        throw res
      }

      if (!res.content) {
        res.content = '\n'
      }

      setNote(res)
    },
    [get]
  )

  const removeNote = useCallback(
    async (id: string) => {
      await post(`${id}/meta`, {
        deleted: NOTE_DELETED.DELETED,
      })
      removeItem(id)
    },
    [post, removeItem]
  )

  const clearRequest = useCallback(() => {
    abort()

    // todo: 不应该调用内部方法
    cache.delete(`url:/api/notes/${note.id}||method:GET||body:`)
  }, [abort, cache, note.id])

  const createNote = useCallback(
    async (data: Partial<NoteModel>) => {
      clearRequest()

      const result = await post({
        id: note.id,
        meta: {
          title: data.title,
          pid: data.pid,
          pic: data.pic,
          cid: data.cid,
        },
        content: data.content,
      })
      const newNote: NoteModel = {
        ...note,
        ...result,
      }

      NoteStoreAPI.saveNote(newNote.id, newNote)
      delete newNote.content
      setNote(newNote)
      addItem(newNote)

      return newNote
    },
    [addItem, clearRequest, note, post]
  )

  const updateNote = useCallback(
    async (data: Partial<NoteModel>) => {
      clearRequest()

      if (!data.content) {
        await post(`/${note.id}/meta`, data)
      } else {
        await post(note.id, {
          content: data.content,
        })
      }
      const newNote: NoteModel = {
        ...note,
        ...data,
      }

      NoteStoreAPI.saveNote(newNote.id, newNote)
      delete newNote.content
      setNote(newNote)
      mutateItem(newNote.id, {
        data: newNote,
      })
    },
    [mutateItem, clearRequest, note, post]
  )

  return {
    note,
    getById,
    createNote,
    updateNote,
    removeNote,
    setNote,
    loading,
  }
}

export const NoteState = createContainer(useNote)
