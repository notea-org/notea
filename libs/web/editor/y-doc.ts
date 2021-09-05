import * as Y from 'yjs'
import { toUint8Array, fromUint8Array } from 'js-base64'
import { prosemirrorToYDoc } from 'y-prosemirror'

const yDocMap = new Map<number, Y.Doc>()

export const createYDoc = ({
  panelId = 0,
  editorYDoc,
  onUpdate,
  node,
  noteUpdates,
}: {
  // XXX: May support multiple panels in the future
  panelId?: number
  editorYDoc?: Y.Doc
  onUpdate?: (update: Uint8Array) => void
  node?: Parameters<typeof prosemirrorToYDoc>[0]
  noteUpdates?: string[]
}) => {
  if (!editorYDoc) {
    return
  }

  if (yDocMap.has(panelId)) {
    destroyYDoc({ panelId, editorYDoc })
  }

  const yDoc = node ? prosemirrorToYDoc(node) : new Y.Doc()

  yDocMap.set(panelId, yDoc)

  if (noteUpdates) {
    updateYDoc({ panelId, updates: getDecodedUpdates(noteUpdates) })
  }

  const onUpdateNote = (update: Uint8Array) => {
    onUpdate?.(update)
    Y.applyUpdate(yDoc, update)
  }
  const onUpdateEditor = (update: Uint8Array) => {
    Y.applyUpdate(editorYDoc, update)
    // console.log(editorYDoc.getXmlFragment('prosemirror').toJSON())
  }

  Y.applyUpdate(editorYDoc, Y.encodeStateAsUpdate(yDoc))
  editorYDoc.on('update', onUpdateNote)
  yDoc.on('update', onUpdateEditor)

  return yDoc
}

export const destroyYDoc = ({
  panelId = 0,
  editorYDoc,
}: {
  panelId?: number
  editorYDoc?: Y.Doc
}) => {
  const yDoc = yDocMap.get(panelId)
  if (yDoc) {
    yDoc.destroy()
    editorYDoc?.destroy()
    yDocMap.delete(panelId)
  }
}

export const updateYDoc = ({
  panelId = 0,
  updates,
}: {
  panelId: number
  updates: Uint8Array[]
}) => {
  const yDoc = yDocMap.get(panelId)
  if (!yDoc) {
    return
  }

  yDoc.transact(() => {
    updates.forEach((val) => Y.applyUpdate(yDoc, val))
  })
}

export const getYDocUpdate = ({ panelId = 0 }: { panelId?: number }) => {
  const yDoc = yDocMap.get(panelId)
  if (!yDoc) {
    return
  }

  return fromUint8Array(Y.encodeStateAsUpdate(yDoc))
}

const getDecodedUpdates = (encodedUpdates: string[]) => {
  return encodedUpdates.map(toUint8Array)
}
