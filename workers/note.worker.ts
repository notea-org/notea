import { expose } from 'comlink'
import { noteStore, uiStore } from 'utils/local-store'
import { TreeData } from '@atlaskit/tree'
import { map } from 'lodash'
import { NoteModel } from 'containers/note'
import dayjs from 'dayjs'

export interface NoteWorkerApi {
  checkAllNotes: typeof checkAllNotes
  updateNote: typeof updateNote
}

const noteWorker: NoteWorkerApi = {
  checkAllNotes,
  updateNote,
}

async function checkAllNotes() {
  const tree = await uiStore.getItem<TreeData>('tree_items')

  if (!tree) return

  delete tree.items.root

  return Promise.all(
    map(tree.items, async (item) => {
      return updateNote(item.id as string, item.data.date)
    })
  )
}

async function updateNote(id: string, expiredDate: string) {
  const note = await noteStore.getItem<NoteModel>(id)

  if (note && dayjs(note.date).isSame(expiredDate)) {
    return
  }

  const res = await fetch(`/api/notes/${id}`)
  const data = await res.json()

  return noteStore.setItem(id, data)
}

expose(noteWorker)
