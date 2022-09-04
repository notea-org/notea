import { useAuth } from 'libs/server/middlewares/auth';
import { useStore } from 'libs/server/middlewares/store';
import { readFileFromRequest } from 'libs/server/file';
import AdmZip from 'adm-zip';
import { api } from 'libs/server/connect';
import { IMPORT_FILE_LIMIT_SIZE } from 'libs/shared/const';
import { extname } from 'path';
import { genId } from 'libs/shared/id';
import { ROOT_ID } from 'libs/shared/tree';
import { createNote } from 'libs/server/note';
import { NoteModel } from 'libs/shared/note';
import { parseMarkdownTitle } from 'libs/shared/markdown/parse-markdown-title';

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

export default api()
    .use(useAuth)
    .use(useStore)
    .post(async (req, res) => {
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
    });
