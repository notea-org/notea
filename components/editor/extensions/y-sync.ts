import { Extension } from 'rich-markdown-editor'
import { ySyncPlugin } from 'y-prosemirror'
import * as Y from 'yjs'

export default class YSync extends Extension {
  get name() {
    return 'y-sync'
  }

  yDoc?: Y.Doc

  constructor(options?: Record<string, any>) {
    super(options)
  }

  get plugins() {
    if (this.yDoc) {
      this.yDoc.destroy()
    }
    this.yDoc = new Y.Doc()
    const type = this.yDoc.get('prosemirror', Y.XmlFragment)

    return [ySyncPlugin(type)]
  }
}
