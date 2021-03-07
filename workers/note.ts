import { wrap, Remote } from 'comlink'
import { NoteWorkerApi } from './note.worker'
import { useRef, useEffect } from 'react'

export function useNoteWorker() {
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

  return NoteWorkerApiRef.current
}
