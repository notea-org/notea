import { Extension } from '@notea/rich-markdown-editor';
import Bracket from './bracket';

const extensions: Extension[] = [new Bracket()];

export default extensions;
