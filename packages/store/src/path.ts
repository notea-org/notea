export class StorePath {
  prefix: string

  constructor(prefix = '') {
    this.prefix = prefix
  }

  getNoteIndex() {
    return `note_index`
  }

  getNoteById(id: string) {
    return `notes/${id}`
  }

  getFileByName(name: string) {
    return `files/${name}`
  }

  getPath(...paths: string[]) {
    return this.prefix + paths.join('/')
  }
}
