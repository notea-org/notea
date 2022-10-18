import { InputRule } from 'prosemirror-inputrules';
import Mark from '@notea/rich-markdown-editor/dist/marks/Mark';

export default class Bracket extends Mark {
    get name() {
        return 'bracket';
    }

    get schema() {
        return {
            attrs: {},
        };
    }

    inputRules() {
        return [
            new InputRule(/(?:(\[|【){2})$/, (state, _match, start, end) => {
                const { tr } = state;

                tr.delete(start, end);
                this.editor.handleOpenLinkMenu();

                return tr;
            }),
        ];
    }

    parseMarkdown() {
        return {
            mark: 'bracket',
        };
    }
}
