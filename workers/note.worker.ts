import { expose } from 'comlink'
import { noteStore, NoteStoreItem, uiStore } from 'utils/local-store'
import { TreeData } from '@atlaskit/tree'
import { map } from 'lodash'
import { NoteModel } from 'containers/note'
import dayjs from 'dayjs'
import removeMarkdown from 'remove-markdown'

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
  const tree = await uiStore.getItem<TreeData>('tree_items')

  if (!tree) return

  delete tree.items.root

  return Promise.all(
    map(tree.items, async (item) =>
      fetchNote(item.id as string, item.data.date)
    )
  )
}

async function fetchNote(id: string, expiredDate: string) {
  const note = await noteStore.getItem<NoteStoreItem>(id)

  if (note && dayjs(note.date).isSame(expiredDate)) {
    return
  }

  const res = await fetch(`/api/notes/${id}`)
  const data = await res.json()

  return saveNote(id, data)
}

async function saveNote(id: string, note: NoteModel) {
  return noteStore.setItem<NoteStoreItem>(id, {
    ...note,
    rawContent: removeMarkdown(note.content).replace(/\\/g, ''),
  })
}

expose(noteWorker)
