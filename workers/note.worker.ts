import { expose } from 'comlink'
import { noteStore, NoteStoreItem, uiStore } from 'utils/local-store'
import { map, pull } from 'lodash'
import { NoteModel } from 'containers/note'
import dayjs from 'dayjs'
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

async function checkAllNotes() {
  const tree = await uiStore.getItem<TreeModel>('tree_items')

  if (!tree) return

  delete tree.items.root

  const notes = await Promise.all(
    map(tree.items, async (item) => fetchNote(item.id, item.data.date))
  )
  const noteIds = notes.map((n) => n?.id)
  const localNoteIds = await noteStore.keys()
  const unusedNoteIds = pull(localNoteIds, ...noteIds)

  await Promise.all(
    unusedNoteIds.map((id) => (id ? noteStore.removeItem(id) : undefined))
  )
}

async function fetchNote(id: string, expiredDate?: string) {
  const note = await noteStore.getItem<NoteStoreItem>(id)

  if (note && expiredDate && dayjs(note.date).isSame(expiredDate)) {
    return
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
