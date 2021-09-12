import { TreeModel } from 'libs/shared/tree'
import { noteCacheInstance, NoteCacheItem } from 'libs/web/cache'
import { extractNoteLink, NoteModel } from 'libs/shared/note'
import { keys, pull } from 'lodash'
import { mergeUpdates } from 'libs/shared/y-doc'
import { getXML } from '../editor/y-doc'
import { striptags } from 'striptags'

/**
 * 清除本地存储中未使用的 note
 */
async function checkItems(items: TreeModel['items']) {
  const noteIds = keys(items)
  const localNoteIds = await noteCache.keys()
  const unusedNoteIds = pull(localNoteIds, ...noteIds)

  await Promise.all(
    unusedNoteIds.map((id) => (id ? noteCache.removeItem(id) : undefined))
  )
}

async function getItem(id: string) {
  return noteCacheInstance.getItem<NoteCacheItem>(id)
}

async function setItem(id: string, note: NoteModel) {
  const local = await getItem(id)
  if (local) {
    note.updates = [
      mergeUpdates([...(local.updates ?? []), ...(note.updates ?? [])]),
    ]
  }

  const xml = getXML(note.updates)
  const linkIds = extractNoteLink(xml)
  const rawContent = striptags(xml)

  return noteCacheInstance.setItem<NoteCacheItem>(id, {
    ...note,
    rawContent,
    linkIds,
  })
}

async function mutateItem(id: string, body: Partial<NoteModel>) {
  const note = await getItem(id)

  if (!note) {
    throw new Error('not found note cache:' + id)
  }

  const updates = note.updates ?? []

  if (body.updates) {
    updates.push(...body.updates)
  }

  await setItem(id, {
    ...note,
    ...body,
    updates,
  })
}

const noteCache = {
  ...noteCacheInstance,
  getItem,
  setItem,
  mutateItem,
  checkItems,
}

export default noteCache
