import { NOTE_DELETED } from 'libs/shared/meta';
import { TreeItemModel, TreeModel } from 'libs/shared/tree';
import { reduce } from 'lodash';
import { useMemo } from 'react';
import useI18n from './use-i18n';

export interface TreeOption {
    id: string;
    label: string;
}

export const useTreeOptions = (tree: TreeModel) => {
    const { t } = useI18n();
    const options: TreeOption[] = useMemo(
        () =>
            reduce<TreeItemModel, TreeOption[]>(
                tree.items as any,
                (items, cur) => {
                    if (cur.data?.deleted !== NOTE_DELETED.DELETED) {
                        items.push({
                            id: cur.id,
                            label:
                                cur.data?.title ||
                                (cur.id === tree.rootId
                                    ? t('Root Page')
                                    : t('Untitled')),
                        });
                    }
                    return items;
                },
                []
            ),
        [t, tree.items, tree.rootId]
    );

    return options;
};
