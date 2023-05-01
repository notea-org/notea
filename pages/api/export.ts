import { useAuth } from 'libs/server/middlewares/auth';
import { useStore } from 'libs/server/middlewares/store';
import AdmZip from 'adm-zip';
import { api } from 'libs/server/connect';
import TreeActions, {
    ROOT_ID,
    HierarchicalTreeItemModel,
} from 'libs/shared/tree';
import { getPathNoteById } from 'libs/server/note-path';
import { NOTE_DELETED } from 'libs/shared/meta';
import { metaToJson } from 'libs/server/meta';
import { toBuffer } from 'libs/shared/str';

export function escapeFileName(name: string): string {
    // list of characters taken from https://www.mtu.edu/umc/services/websites/writing/characters-avoid/
    return name.replace(/[#%&{}\\<>*?/$!'":@+`|=]/g, "_");
}

export default api()
    .use(useAuth)
    .use(useStore)
    .get(async (req, res) => {
        const pid = (req.query.pid as string) || ROOT_ID;
        const zip = new AdmZip();
        const tree = await req.state.treeStore.get();
        const rootItem = TreeActions.makeHierarchy(tree, pid);
        const duplicate: Record<string, number> = {};

        async function addItem(
            item: HierarchicalTreeItemModel,
            prefix: string = ''
        ): Promise<void> {
            const note = await req.state.store.getObjectAndMeta(
                getPathNoteById(item.id)
            );
            const metaJson = metaToJson(note.meta);

            if (metaJson.deleted === NOTE_DELETED.DELETED) {
                return;
            }
            const title = escapeFileName(metaJson.title ?? 'Untitled');

            const resolvedPrefix = prefix.length === 0 ? '' : prefix + '/';
            const basePath = resolvedPrefix + title;
            const uniquePath = duplicate[basePath]
                ? `${basePath} (${duplicate[basePath]})`
                : basePath;
            duplicate[basePath] = (duplicate[basePath] ?? 0) + 1;

            zip.addFile(`${uniquePath}.md`, toBuffer(note.content));
            await Promise.all(item.children.map((v) => addItem(v, uniquePath)));
        }

        if (rootItem) {
            await Promise.all(rootItem.children.map((v) => addItem(v)));
        }

        res.setHeader('content-type', 'application/zip');
        res.setHeader('content-disposition', `attachment; filename=export.zip`);
        res.send(zip.toBuffer());
    });
