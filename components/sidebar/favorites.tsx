import Tree from '@atlaskit/tree';
import HotkeyTooltip from 'components/hotkey-tooltip';
import IconButton from 'components/icon-button';
import TreeActions, { ROOT_ID } from 'libs/shared/tree';
import useI18n from 'libs/web/hooks/use-i18n';
import NoteTreeState from 'libs/web/state/tree';
import { cloneDeep, forEach } from 'lodash';
import React, { FC, useCallback, useEffect, useMemo, useState } from 'react';
import SidebarListItem from './sidebar-list-item';

export const Favorites: FC = () => {
    const { t } = useI18n();
    const { pinnedTree } = NoteTreeState.useContainer();
    const [tree, setTree] = useState(pinnedTree);
    const [isFold, setFold] = useState(false);
    const hasPinned = useMemo(
        () => tree.items[ROOT_ID].children.length,
        [tree]
    );

    const onCollapse = useCallback((id: string | number) => {
        setTree((prev) =>
            TreeActions.mutateItem(prev, String(id), { isExpanded: false })
        );
    }, []);
    const onExpand = useCallback((id: string | number) => {
        setTree((prev) =>
            TreeActions.mutateItem(prev, String(id), { isExpanded: true })
        );
    }, []);

    useEffect(() => {
        const items = cloneDeep(pinnedTree.items);

        setTree((prev) => {
            if (!prev) return { ...pinnedTree, items };

            forEach(items, (item) => {
                item.isExpanded = prev.items[item.id]?.isExpanded ?? false;
            });

            return { ...pinnedTree, items };
        });
    }, [pinnedTree]);

    if (!hasPinned) {
        return null;
    }

    return (
        <>
            <div className="group p-2 text-gray-500 flex items-center sticky top-0 bg-gray-100 z-10">
                <div className="flex-auto flex items-center">
                    <span>{t('Favorites')}</span>
                </div>
                <HotkeyTooltip text={t('Fold Favorites')}>
                    <IconButton
                        icon="Selector"
                        onClick={() => setFold((prev) => !prev)}
                        className="text-gray-700 invisible group-hover:visible"
                    ></IconButton>
                </HotkeyTooltip>
            </div>
            {!isFold ? (
                <div>
                    <Tree
                        onCollapse={onCollapse}
                        onExpand={onExpand}
                        tree={tree}
                        offsetPerLevel={10}
                        renderItem={({
                            provided,
                            item,
                            onExpand,
                            onCollapse,
                            snapshot,
                        }) => (
                            <SidebarListItem
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                onExpand={onExpand}
                                onCollapse={onCollapse}
                                isExpanded={item.isExpanded}
                                innerRef={provided.innerRef}
                                hasChildren={!!item.children.length}
                                item={{
                                    ...item.data,
                                    id: item.id,
                                }}
                                snapshot={snapshot}
                            ></SidebarListItem>
                        )}
                    ></Tree>
                </div>
            ) : null}
        </>
    );
};
