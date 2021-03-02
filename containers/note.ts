import { useCallback, useEffect, useRef, useState } from 'react'
import { createContainer } from 'unstated-next'
import useFetch from 'use-http'
import { wrap, Remote } from 'comlink'
import { NoteWorkerApi } from 'workers/note.worker'

export interface NoteModel {
  id: string
  title: string
  pid?: string
  content?: string
  pic?: string
  cid?: string[]
  date?: string
}

const useNote = () => {
  const [note, setNote] = useState<NoteModel>({} as NoteModel)
  const { get, post, cache, abort, loading } = useFetch('/api/notes')

  const NoteWorkerRef = useRef<Worker>()
  const NoteWorkerApiRef = useRef<Remote<NoteWorkerApi>>()

  useEffect(() => {
    NoteWorkerRef.current = new Worker('workers/note.worker', {
      type: 'module',
    })
    NoteWorkerApiRef.current = wrap(NoteWorkerRef.current)
    return () => {
      NoteWorkerRef.current?.terminate()
    }
  }, [])

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

  const saveNote = useCallback(
    async (data: Partial<NoteModel>, isNew = false) => {
      if (loading) {
        abort()
      }

      cache.delete(`url:/api/notes/${note.id}||method:GET||body:`)
      let result = data

      if (isNew) {
        result = await post({
          id: note.id,
          meta: {
            title: data.title,
            pid: data.pid,
            pic: data.pic,
            cid: data.cid,
          },
          content: data.content,
        })
      } else if (!data.content) {
        await post(`/${note.id}/meta`, data)
      } else {
        await post(note.id, {
          content: data.content,
        })
      }
      const newNote: NoteModel = {
        ...note,
        ...result,
      }

      delete newNote.content
      setNote(newNote)

      return newNote
    },
    [abort, cache, loading, note, post]
  )

  const updateNoteMeta = useCallback(
    async function (id: string, data: Partial<NoteModel>) {
      cache.delete(`url:/api/notes/${id}||method:GET||body:`)
      const res = await post(`${id}/meta`, {
        title: data.title,
        pid: data.pid,
        cid: data.cid,
        pic: data.pic,
      })

      return res
    },
    [cache, post]
  )

  const initNote = useCallback(() => {
    NoteWorkerApiRef.current?.checkAllNotes()
  }, [])

  return { note, getById, saveNote, setNote, updateNoteMeta, initNote }
}

export const NoteState = createContainer(useNote)
