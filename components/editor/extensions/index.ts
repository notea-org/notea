import { Extension } from 'rich-markdown-editor'
import Bracket from './bracket'
import YSync from './y-sync'

const extensions: Extension[] = [new Bracket(), new YSync()]

export default extensions
