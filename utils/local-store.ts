import { NoteModel } from 'containers/note'
import localforage from 'localforage'

export const uiStore = localforage.createInstance({
  name: 'notea-ui',
})

export const noteStore = localforage.createInstance({
  name: 'notea-notes',
})

export interface NoteStoreItem extends NoteModel {
  /**
   * remove markdown tag
   */
  rawContent?: string
}
