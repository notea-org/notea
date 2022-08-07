import { isNil, toNumber } from 'lodash';
import { strCompress, strDecompress } from 'libs/shared/str';
import {
    PAGE_META_KEY,
    NOTE_DELETED,
    NOTE_SHARED,
    NUMBER_KEYS,
    NOTE_PINNED,
} from 'libs/shared/meta';

export function jsonToMeta(meta?: Record<string, any>) {
    const metaData: Record<string, string> = {};

    if (meta) {
        PAGE_META_KEY.forEach((key) => {
            const value = meta[key];

            if (!isNil(value)) {
                metaData[key] = strCompress(value.toString());
            }
        });
    }

    return metaData;
}

export function metaToJson(metaData?: Record<string, any>) {
    const meta: Record<string, any> = {};

    if (metaData) {
        PAGE_META_KEY.forEach((key) => {
            const value = metaData[key];

            if (!isNil(value)) {
                const strValue = strDecompress(value) || null;

                if (NUMBER_KEYS.includes(key)) {
                    meta[key] = toNumber(strValue);
                } else {
                    meta[key] = strValue;
                }
            } else if (key === 'deleted') {
                meta[key] = value ? strDecompress(value) : NOTE_DELETED.NORMAL;
            } else if (key === 'shared') {
                meta[key] = value ? strDecompress(value) : NOTE_SHARED.PRIVATE;
            } else if (key === 'pinned') {
                meta[key] = value ? strDecompress(value) : NOTE_PINNED.UNPINNED;
            } else if (key === 'editorsize') {
                meta[key] = value ? strDecompress(value) : null;
            }
        });
    }

    return meta;
}
