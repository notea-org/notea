export class StorePath {
  prefix: string

  constructor(prefix = '') {
    this.prefix = prefix
  }

  getPageIndex() {
    return `page_index`
  }

  getPageById(id: string) {
    return `pages/${id}`
  }

  getPath(...paths: string[]) {
    return this.prefix + paths.join('/')
  }
}
