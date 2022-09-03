import { api } from 'libs/server/connect';
import { metaToJson } from 'libs/server/meta';
import { useAuth } from 'libs/server/middlewares/auth';
import { useStore } from 'libs/server/middlewares/store';
import { getPathNoteById } from 'libs/server/note-path';
import { NoteModel } from 'libs/shared/note';
import { StoreProvider } from 'libs/server/store';
import { API } from 'libs/server/middlewares/error';
import { strCompress } from 'libs/shared/str';
import { ROOT_ID } from 'libs/shared/tree';

export async function getNote(
    store: StoreProvider,
    id: string
): Promise<NoteModel> {
    const { content, meta } = await store.getObjectAndMeta(getPathNoteById(id));

    if (!content && !meta) {
        throw API.NOT_FOUND.throw();
    }

    const jsonMeta = metaToJson(meta);

    return {
        id,
        content: content || '\n',
        ...jsonMeta,
    } as NoteModel;
}

export default api()
    .use(useAuth)
    .use(useStore)
    .delete(async (req, res) => {
        const id = req.query.id as string;
        const notePath = getPathNoteById(id);

        await Promise.all([
            req.state.store.deleteObject(notePath),
            req.state.treeStore.removeItem(id),
        ]);

        res.end();
    })
    .get(async (req, res) => {
        const id = req.query.id as string;

        if (id === ROOT_ID) {
            return res.json({
                id,
            });
        }

        const note = await getNote(req.state.store, id);

        res.json(note);
    })
    .post(async (req, res) => {
        const id = req.query.id as string;
        const { content } = req.body;
        const notePath = getPathNoteById(id);
        const oldMeta = await req.state.store.getObjectMeta(notePath);

        if (oldMeta) {
            oldMeta['date'] = strCompress(new Date().toISOString());
        }

        // Empty content may be a misoperation
        if (!content || content.trim() === '\\') {
            await req.state.store.copyObject(notePath, notePath + '.bak', {
                meta: oldMeta,
                contentType: 'text/markdown',
            });
        }

        await req.state.store.putObject(notePath, content, {
            contentType: 'text/markdown',
            meta: oldMeta,
        });

        res.status(204).end();
    });
