import SidebarListItem from './sidebar-list-item';
import NoteTreeState from 'libs/web/state/tree';
import Tree, {
    TreeDestinationPosition,
    TreeSourcePosition,
} from '@atlaskit/tree';
import { useCallback } from 'react';
import router from 'next/router';
import HotkeyTooltip from 'components/hotkey-tooltip';
import IconButton from 'components/icon-button';
import useI18n from 'libs/web/hooks/use-i18n';
import { CircularProgress, Tooltip } from '@material-ui/core';
import { Favorites } from './favorites';

const SideBarList = () => {
    const { t } = useI18n();
    const { tree, moveItem, mutateItem, initLoaded, collapseAllItems } =
        NoteTreeState.useContainer();

    const onExpand = useCallback(
        (id: string | number) => {
            mutateItem(String(id), {
                isExpanded: true,
            })
                ?.catch((v) => console.error('Error whilst mutating item: %O', v));
        },
        [mutateItem]
    );

    const onCollapse = useCallback(
        (id: string | number) => {
            mutateItem(String(id), {
                isExpanded: false,
            })
                ?.catch((v) => console.error('Error whilst mutating item: %O', v));
        },
        [mutateItem]
    );

    const onDragEnd = useCallback(
        (
            source: TreeSourcePosition,
            destination?: TreeDestinationPosition | undefined
        ) => {
            if (!destination) {
                console.error("Can't move to undefined position");
                return;
            }
            moveItem({
                source: {
                    parentId: String(source.parentId),
                    index: source.index,
                },
                destination: {
                    parentId: String(destination.parentId),
                    index: destination.index ?? 0,
                },
            }).catch((e) => {
                // todo: toast
                console.error('更新错误', e);
            });
        },
        [moveItem]
    );

    const onCreateNote = useCallback(() => {
        router.push('/new', undefined, { shallow: true })
            .catch((v) => console.error('Error whilst pushing to router: %O', v));
    }, []);

    return (
        <section className="h-full flex text-sm flex-col flex-grow bg-gray-100 overflow-y-auto">
            {/* Favorites */}
            <Favorites />

            {/* My Pages */}
            <div className="p-2 text-gray-500 flex items-center sticky top-0 bg-gray-100 z-10">
                <div className="flex-auto flex items-center">
                    <span>{t('My Pages')}</span>
                    {initLoaded ? null : (
                        <CircularProgress
                            className="ml-4"
                            size="14px"
                            color="inherit"
                        />
                    )}
                </div>
                <Tooltip title={t('Collapse all pages')}>
                    <IconButton
                        icon="ChevronDoubleUp"
                        onClick={collapseAllItems}
                        className="text-gray-700 w-5 h-5 md:w-5 md:h-5"
                    ></IconButton>
                </Tooltip>
                <HotkeyTooltip
                    text={t('Create page')}
                    commandKey
                    onHotkey={onCreateNote}
                    keys={['O']}
                >
                    <IconButton
                        icon="Plus"
                        onClick={onCreateNote}
                        className="text-gray-700"
                    ></IconButton>
                </HotkeyTooltip>
            </div>
            <div className="flex-grow pb-10">
                <Tree
                    onExpand={onExpand}
                    onCollapse={onCollapse}
                    onDragEnd={onDragEnd}
                    tree={tree}
                    isDragEnabled
                    isNestingEnabled
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
        </section>
    );
};

export default SideBarList;
