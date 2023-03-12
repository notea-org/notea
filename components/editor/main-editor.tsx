import EditTitle from './edit-title';
import Editor, { EditorProps } from './editor';
import Backlinks from './backlinks';
import EditorState from 'libs/web/state/editor';
import UIState from 'libs/web/state/ui';
import { FC } from 'react';
import { NoteModel } from 'libs/shared/note';
import { EDITOR_SIZE } from 'libs/shared/meta';

const MainEditor: FC<
    EditorProps & {
        note?: NoteModel;
        isPreview?: boolean;
        className?: string;
    }
> = ({ className, note, isPreview, ...props }) => {
    const {
        settings: { settings },
    } = UIState.useContainer();
    let editorWidthClass: string;
    switch (note?.editorsize ?? settings.editorsize) {
        case EDITOR_SIZE.SMALL:
            editorWidthClass = 'max-w-prose';
            break;
        case EDITOR_SIZE.LARGE:
            editorWidthClass = 'max-w-4xl';
            break;
        case EDITOR_SIZE.AS_WIDE_AS_POSSIBLE:
            // until we reach md size, just do LARGE to have consistency
            editorWidthClass = 'max-w-4xl md:max-w-full md:mx-20';
            break;
    }
    const articleClassName =
        className || `pt-16 md:pt-40 px-6 m-auto h-full ${editorWidthClass}`;

    return (
        <EditorState.Provider initialState={note}>
            <article className={articleClassName}>
                <EditTitle readOnly={props.readOnly} />
                <Editor isPreview={isPreview} {...props} />
                {!isPreview && <Backlinks />}
            </article>
        </EditorState.Provider>
    );
};

export default MainEditor;
