import { Locale } from 'locales';
import { isArray, isBoolean, isNumber, isString, values } from 'lodash';
import { EDITOR_SIZE } from './meta';
import { ROOT_ID } from './tree';

export interface Settings {
    split_sizes: [number, number];
    daily_root_id: string;
    sidebar_is_fold: boolean;
    last_visit?: string;
    locale: Locale;
    injection?: string;
    editorsize: EDITOR_SIZE;
}

export const DEFAULT_SETTINGS: Settings = Object.freeze({
    split_sizes: [30, 70] as [number, number],
    daily_root_id: ROOT_ID,
    sidebar_is_fold: false,
    locale: Locale.EN,
    editorsize: EDITOR_SIZE.SMALL,
});

export function formatSettings(body: Record<string, any> = {}) {
    const settings: Settings = { ...DEFAULT_SETTINGS };

    if (isString(body.daily_root_id)) {
        settings.daily_root_id = body.daily_root_id;
    }
    if (
        isArray(body.split_sizes) &&
        isNumber(body.split_sizes[0]) &&
        isNumber(body.split_sizes[1])
    ) {
        // Sometimes when debugging mode is turned on in the browser,
        // the size will become abnormal
        const [size1, size2] = body.split_sizes;
        if (size1 > 100 || size1 < 0 || size2 > 100 || size2 < 0) {
            settings.split_sizes = DEFAULT_SETTINGS.split_sizes;
        } else {
            settings.split_sizes = [size1, size2];
        }
    }
    if (isBoolean(body.sidebar_is_fold)) {
        settings.sidebar_is_fold = body.sidebar_is_fold;
    }
    if (isString(body.last_visit)) {
        settings.last_visit = body.last_visit;
    }

    if (values(Locale).includes(body.locale)) {
        settings.locale = body.locale;
    }

    if (isString(body.injection)) {
        settings.injection = body.injection;
    }

    if (isNumber(body.editorsize)) {
        settings.editorsize = body.editorsize;
    }

    return settings;
}
