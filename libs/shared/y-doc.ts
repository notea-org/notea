import { fromUint8Array, toUint8Array } from 'js-base64'
import * as Y from 'yjs'

export const mergeUpdates = (updates: (string | Uint8Array)[], sv?: string) => {
  // const doc = new Y.Doc()

  // doc.transact(() => {
  //   updates.forEach((val) =>
  //     Y.applyUpdate(doc, typeof val === 'string' ? toUint8Array(val) : val)
  //   )
  // })

  // const update = sv
  //   ? Y.encodeStateAsUpdate(doc, toUint8Array(sv))
  //   : Y.encodeStateAsUpdate(doc)

  // doc.destroy()

  const encodedUpdates = updates.map((val) =>
    typeof val === 'string' ? toUint8Array(val) : val
  )

  const update = Y.mergeUpdates(encodedUpdates)

  return fromUint8Array(update)
}

export const mergeUpdatesToLimit = (updates: string[], limit: number) => {
  const doc = new Y.Doc()
  const curUpdates = [...updates]

  doc.transact(() => {
    while (curUpdates.length >= limit) {
      const update = curUpdates.shift()

      if (update) {
        Y.applyUpdate(
          doc,
          typeof update === 'string' ? toUint8Array(update) : update
        )
      }
    }
  })

  if (curUpdates.length < updates.length) {
    curUpdates.unshift(fromUint8Array(Y.encodeStateAsUpdate(doc)))
  }

  doc.destroy()

  return curUpdates
}
