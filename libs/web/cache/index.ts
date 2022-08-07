import { NoteModel } from 'libs/shared/note';
import localforage from 'localforage';

export const uiCache = localforage.createInstance({
    name: 'notea-ui',
});

export const noteCacheInstance = localforage.createInstance({
    name: 'notea-notes',
});

export interface NoteCacheItem extends NoteModel {
    /**
     * remove markdown tag
     */
    rawContent?: string;

    linkIds?: string[];
}
