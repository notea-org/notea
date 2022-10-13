import { useAuth } from 'libs/server/middlewares/auth';
import { useStore } from 'libs/server/middlewares/store';
import { readFileFromRequest } from 'libs/server/file';
import AdmZip from 'adm-zip';
import { api, ApiRequest, ApiResponse } from 'libs/server/connect';
import { IMPORT_FILE_LIMIT_SIZE } from 'libs/shared/const';
import { extname } from 'path';
import { genId } from 'libs/shared/id';
import { ROOT_ID, TreeModel } from 'libs/shared/tree';
import { createNote } from 'libs/server/note';
import { NoteModel } from 'libs/shared/note';
import { parseMarkdownTitle } from 'libs/shared/markdown/parse-markdown-title';
import { getPathNoteById } from 'libs/server/note-path';
import type { ExportMeta } from 'pages/api/export';

const MARKDOWN_EXT = [
    '.markdown',
    '.mdown',
    '.mkdn',
    '.md',
    '.mkd',
    '.mdwn',
    '.mdtxt',
    '.mdtext',
    '.text',
    '.Rmd',
];

export const config = {
    api: {
        bodyParser: false,
    },
};

const EMPTY_BUFFER = Buffer.of();
async function normal(req: ApiRequest, res: ApiResponse) {
    const pid = (req.query.pid as string) || ROOT_ID;
    const file = await readFileFromRequest(req);

    if (file.size > IMPORT_FILE_LIMIT_SIZE) {
        return res.APIError.IMPORT_FILE_LIMIT_SIZE.throw();
    }

    const zip = new AdmZip(file.path);
    const zipEntries = zip.getEntries();
    const total = zipEntries.length;

    // Step 1: Build hierarchy of entries
    type HierarchyNode = {
        name: string;
        entry?: AdmZip.IZipEntry;
        children: Hierarchy;
    };
    type Hierarchy = Record<string, HierarchyNode>;

    // this is the actual code that
    const hierachy: Hierarchy = {};
    zipEntries.forEach((v) => {
        let name: string = v.name;
        if (!v.isDirectory) {
            const entryNameExtension = extname(v.name);
            let isMarkdown = false;
            for (const extension of MARKDOWN_EXT) {
                if (extension === entryNameExtension) {
                    name = v.name.substring(
                        0,
                        v.name.length - extension.length
                    );
                    isMarkdown = true;
                    break;
                }
            }
            if (!isMarkdown) {
                return; // Don't add it if it's not markdown
            }
        }
        const pathParts = v.entryName.split('/');

        let currentHierarchy = hierachy;
        let me: HierarchyNode | undefined;
        for (const part of pathParts) {
            if (!currentHierarchy[part]) {
                currentHierarchy[part] = {
                    name: part,
                    children: {},
                };
            }
            me = currentHierarchy[part];
            currentHierarchy = me.children;
        }
        if (!me) {
            throw Error('Current hierarchy node is undefined');
        }
        me.name = name;
        me.entry = v;
    });

    let count: number = 0;

    async function createNotes(
        currentNode: HierarchyNode,
        parent?: string
    ): Promise<string> {
        let date: string | undefined,
            title: string | undefined,
            content: string | undefined;
        if (currentNode.entry) {
            const entry = currentNode.entry;
            date = entry.header.time.toISOString();
            if (!entry.isDirectory) {
                const rawContent = entry.getData().toString('utf-8');
                const parsed = parseMarkdownTitle(rawContent);
                title = parsed.title;
                content = parsed.content;
            }
        }
        const note = {
            title: title ?? currentNode.name,
            pid: parent,
            id: genId(),
            date,
            content,
        } as NoteModel;

        const createdNote = await createNote(note, req.state);
        await req.state.treeStore.addItem(createdNote.id, parent);
        count++;
        // Object.values(currentNode.children).map((v) => createNotes(v, createdNote.id))
        for (const child of Object.values(currentNode.children)) {
            await createNotes(child, createdNote.id);
        }

        return createdNote.id;
    }

    await Promise.all(
        Object.values(hierachy).map((v) => createNotes(v, pid))
    );

    res.json({ total, imported: count });
}

async function backup(req: ApiRequest, res: ApiResponse) {
    const file = await readFileFromRequest(req);

    if (file.size > IMPORT_FILE_LIMIT_SIZE) {
        return res.APIError.IMPORT_FILE_LIMIT_SIZE.throw();
    }

    const zip = new AdmZip(file.path);

    const treeEntry = zip.getEntry('tree');
    if (!treeEntry) {
        return res.APIError.INVALID_DATA.throw('Missing tree file');
    }
    const tree: TreeModel = JSON.parse(treeEntry.getData().toString('utf-8'));
    if (typeof tree.items !== 'object' || typeof tree.rootId !== 'string') {
        return res.APIError.INVALID_DATA.throw(`Tree is missing required properties (or the properties are not proper)`);
    }

    const itemCreationPromises = Object.keys(tree.items).map(async (itemKey) => {
        if (itemKey === tree.rootId) return;
        const item = tree.items[itemKey];
        const path = getPathNoteById(item.id);
        const prefix = `notes/${item.id}`;

        const metaEntry = zip.getEntry(`${prefix}/meta`);
        if (!metaEntry) {
            throw res.APIError.INVALID_DATA.throw(`Missing meta for ${item.id}`);
        }
        const meta: ExportMeta = JSON.parse(metaEntry.getData().toString('utf-8'));

        const contentEntry = zip.getEntry(`${prefix}/content`);
        let content: Buffer;
        if (!contentEntry) {
            console.warn('Missing %O, replacing with empty string', `${prefix}/content`);
            content = EMPTY_BUFFER;
        } else {
            content = contentEntry.getData();
        }

        await req.state.store.putObject(path, content, {
            meta: meta.meta,
            contentType: meta.contentType
        });
    });

    await Promise.all([
        ...itemCreationPromises,
    ]);

    await req.state.treeStore.set(tree);

    res.json({
        total: zip.getEntries().length,
        imported: Object.keys(tree.items).length - 1
    });
}

export default api()
    .use(useAuth)
    .use(useStore)
    .post(async (req, res) => {
        const type = String(req.query['type'] ?? 'normal');
        switch (type) {
            case 'backup':
                return await backup(req, res);

            case 'normal':
            default:
                return await normal(req, res);
        }
    });
