import { TreeModel } from 'libs/shared/tree';
import { noteCacheInstance, NoteCacheItem } from 'libs/web/cache';
import { isNoteLink, NoteModel } from 'libs/shared/note';
import { keys, pull } from 'lodash';
import { removeMarkdown } from '../utils/markdown';
import markdownLinkExtractor from 'markdown-link-extractor';

/**
 * 清除本地存储中未使用的 note
 */
async function checkItems(items: TreeModel['items']) {
    const noteIds = keys(items);
    const localNoteIds = await noteCache.keys();
    const unusedNoteIds = pull(localNoteIds, ...noteIds);

    await Promise.all(
        unusedNoteIds.map((id) => (id ? noteCache.removeItem(id) : undefined))
    );
}

async function getItem(id: string) {
    return noteCacheInstance.getItem<NoteCacheItem>(id);
}

async function setItem(id: string, note: NoteModel) {
    const extractorLinks = markdownLinkExtractor(note.content ?? '', false);
    const linkIds: string[] = [];
    if (Array.isArray(extractorLinks) && extractorLinks.length) {
        extractorLinks.forEach((link) => {
            if (isNoteLink(link)) {
                linkIds.push(link.slice(1));
            }
        });
    }
    return noteCacheInstance.setItem<NoteCacheItem>(id, {
        ...note,
        rawContent: removeMarkdown(note.content),
        linkIds,
    });
}

async function mutateItem(id: string, body: Partial<NoteModel>) {
    const note = await getItem(id);

    if (!note) {
        throw new Error('not found note cache:' + id);
    }

    await setItem(id, {
        ...note,
        ...body,
    });
}

const noteCache = {
    ...noteCacheInstance,
    getItem,
    setItem,
    mutateItem,
    checkItems,
};

export default noteCache;
