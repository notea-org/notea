import { expose } from 'comlink'
import { noteStore, NoteStoreItem } from 'utils/local-store'
import { keys, pull } from 'lodash'
import { NoteModel } from 'containers/note'
import removeMarkdown from 'remove-markdown'
import { TreeModel } from 'containers/tree'

export interface NoteWorkerApi {
  checkAllNotes: typeof checkAllNotes
  fetchNote: typeof fetchNote
  saveNote: typeof saveNote
}

const noteWorker: NoteWorkerApi = {
  checkAllNotes,
  fetchNote,
  saveNote,
}

/**
 * 清除本地存储中未使用的 note
 */
async function checkAllNotes(items: TreeModel['items']) {
  const noteIds = keys(items)
  const localNoteIds = await noteStore.keys()
  const unusedNoteIds = pull(localNoteIds, ...noteIds)

  await Promise.all(
    unusedNoteIds.map((id) => (id ? noteStore.removeItem(id) : undefined))
  )
}

export async function fetchNote(id: string) {
  if (id === 'root') {
    return {
      id: 'root',
    } as NoteStoreItem
  }

  const note = await noteStore.getItem<NoteStoreItem>(id)

  if (note) {
    return note
  }

  const res = await fetch(`/api/notes/${id}`)
  if (res.ok) {
    const data = await res.json()

    return saveNote(id, data)
  }

  return
}

async function saveNote(id: string, note: NoteModel) {
  return noteStore.setItem<NoteStoreItem>(id, {
    ...note,
    rawContent: removeMarkdown(note.content).replace(/\\/g, ''),
  })
}

expose(noteWorker)
