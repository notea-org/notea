import escapeStringRegexp from 'escape-string-regexp';
import { NOTE_DELETED } from 'libs/shared/meta';
import { NoteCacheItem } from '../cache';
import noteCache from '../cache/note';

export function getSearchRegExp(keyword: string) {
    return new RegExp(escapeStringRegexp(keyword), 'ig');
}

export async function searchNote(keyword: string, deleted: NOTE_DELETED) {
    const data = [] as NoteCacheItem[];
    const re = getSearchRegExp(keyword);

    await noteCache.iterate<NoteCacheItem, void>((note) => {
        if (note.deleted !== deleted) return;
        if (re.test(note.rawContent || '') || re.test(note.title)) {
            data.push(note);
        }
    });

    return data;
}

export function searchRangeText({
    text,
    keyword,
    maxLen = 80,
}: {
    text: string;
    keyword: string;
    maxLen: number;
}) {
    let start = 0;
    let end = 0;
    const re = getSearchRegExp(keyword);
    const indexContent = text.search(re);

    start = indexContent < 11 ? 0 : indexContent - 10;
    end = start === 0 ? maxLen - 10 : indexContent + keyword.length + maxLen;

    if (text && end > text.length) {
        end = text.length;
    }

    return {
        match: text.substring(start, end),
        re,
    };
}
