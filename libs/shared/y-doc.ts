import { fromUint8Array, toUint8Array } from 'js-base64'
import * as Y from 'yjs'

export const mergeUpdates = (updates: (string | Uint8Array)[], sv?: string) => {
  const doc = new Y.Doc()

  doc.transact(() => {
    updates.forEach((val) =>
      Y.applyUpdate(doc, typeof val === 'string' ? toUint8Array(val) : val)
    )
  })

  const update = sv
    ? Y.encodeStateAsUpdate(doc, toUint8Array(sv))
    : Y.encodeStateAsUpdate(doc)

  doc.destroy()

  return fromUint8Array(update)
}
