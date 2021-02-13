import { genMd5 } from '@notea/shared/src/id'

export class StorePath {
  prefix: string

  constructor(prefix = '') {
    this.prefix = prefix
  }

  getPageIndex() {
    return `page_index`
  }

  getPageById(id: string) {
    return `pages/${genMd5(id)}`
  }

  getPath(path?: string) {
    return this.prefix + (path ? `/${path}` : '')
  }
}
