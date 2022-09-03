import { NoteModel } from 'libs/shared/note';
import { genId } from 'libs/shared/id';
import { jsonToMeta } from 'libs/server/meta';
import { getPathNoteById } from 'libs/server/note-path';
import { ServerState } from './connect';

export const createNote = async (note: NoteModel, state: ServerState) => {
    const { content = '\n', ...meta } = note;

    if (!note.id) {
        note.id = genId();
    }
    while (await state.store.hasObject(getPathNoteById(note.id))) {
        note.id = genId();
    }

    const metaWithModel = {
        ...meta,
        id: note.id,
        date: note.date ?? new Date().toISOString(),
    };
    const metaData = jsonToMeta(metaWithModel);

    await state.store.putObject(getPathNoteById(note.id), content, {
        contentType: 'text/markdown',
        meta: metaData,
    });

    return metaWithModel as NoteModel;
};
