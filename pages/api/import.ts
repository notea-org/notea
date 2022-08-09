import {useAuth} from 'libs/server/middlewares/auth';
import {useStore} from 'libs/server/middlewares/store';
import {readFileFromRequest} from 'libs/server/file';
import AdmZip from 'adm-zip';
import {api} from 'libs/server/connect';
import {IMPORT_FILE_LIMIT_SIZE} from 'libs/shared/const';
import {extname} from 'path';
import {genId} from 'libs/shared/id';
import {ROOT_ID} from 'libs/shared/tree';
import {createNote} from 'libs/server/note';
import {NoteModel} from 'libs/shared/note';
import {parseMarkdownTitle} from 'libs/shared/markdown/parse-markdown-title';

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
            name: string
            entry?: AdmZip.IZipEntry
            children: Hierarchy
        }
        type Hierarchy = Record<string, HierarchyNode>;

        // this is the actual code that
        const hierachy: Hierarchy = {};
        zipEntries.forEach((v) => {
            const pathParts = v.entryName.split('/');


            let currentHierarchy = hierachy;
            let me: HierarchyNode | undefined;
            for (const part of pathParts) {
                if (!currentHierarchy[part]) {
                    currentHierarchy[part] = {
                        name: part,
                        children: {}
                    }
                }
                me = currentHierarchy[part];
                currentHierarchy = me.children;
            }
            if (!me) {
                throw Error("Current hierarchy node is undefined");
            }
            me.entry = v;
        });

        let count: number = 0;

        async function createNotes(root: HierarchyNode, parent?: string): Promise<string> {
            let date: string | undefined, title: string | undefined, content: string | undefined;
            if (root.entry) {
                const entry = root.entry;
                date = entry.header.time.toISOString();
                if (!entry.isDirectory) {
                    const actualExtension = extname(entry.name);
                    for (const extension of MARKDOWN_EXT) {
                        if (extension === actualExtension) {
                            const rawContent = entry.getData().toString('utf-8');
                            const parsed = parseMarkdownTitle(rawContent);
                            title = parsed.title ?? entry.name.substring(0, entry.name.length - extension.length);
                            content = parsed.content;
                            break;
                        }
                    }
                }

            }
            const note = {
                title: title ?? root.name,
                pid: parent,
                id: genId(),
                date,
                content
            } as NoteModel;

            const createdNote = await createNote(note, req.state);
            await req.state.treeStore.addItem(createdNote.id, parent);
            count++;
            await Promise.all(Object.values(root.children).map((v) => createNotes(v, createdNote.id)));

            return createdNote.id;
        }

        await Promise.all(Object.values(hierachy).map((v) => createNotes(v, pid)));

        res.json({total, imported: count});
    });
