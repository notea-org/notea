import { Menu } from '@material-ui/core';
import { FC, useMemo } from 'react';
import {
    ClipboardCopyIcon,
    SelectorIcon,
    StarIcon,
    TrashIcon,
} from '@heroicons/react/outline';
import PortalState from 'libs/web/state/portal';
import useI18n from 'libs/web/hooks/use-i18n';
import { NOTE_PINNED } from 'libs/shared/meta';
import { NoteModel } from 'libs/shared/note';
import { Item, SidebarMenuItem, MENU_HANDLER_NAME } from './sidebar-menu-item';

const SidebarMenu: FC = () => {
    const { t } = useI18n();
    const {
        menu: { close, anchor, data, visible },
    } = PortalState.useContainer();

    const MENU_LIST: Item[] = useMemo(
        () => [
            {
                text: t('Remove'),
                icon: <TrashIcon />,
                handler: MENU_HANDLER_NAME.REMOVE_NOTE,
            },
            {
                text: t('Copy Link'),
                icon: <ClipboardCopyIcon />,
                handler: MENU_HANDLER_NAME.COPY_LINK,
            },
            {
                text: t('Add to Favorites'),
                icon: <StarIcon />,
                handler: MENU_HANDLER_NAME.ADD_TO_FAVORITES,
                enable(item?: NoteModel) {
                    return item?.pinned !== NOTE_PINNED.PINNED;
                },
            },
            {
                text: t('Remove from Favorites'),
                icon: <StarIcon />,
                handler: MENU_HANDLER_NAME.REMOVE_FROM_FAVORITES,
                enable(item?: NoteModel) {
                    return item?.pinned === NOTE_PINNED.PINNED;
                },
            },
            {
                text: t('Toggle width'),
                // TODO: or SwitchHorizontal?
                icon: <SelectorIcon style={{ transform: 'rotate(90deg)' }} />,
                handler: MENU_HANDLER_NAME.TOGGLE_WIDTH,
            },
        ],
        [t]
    );

    return (
        <Menu
            anchorEl={anchor}
            open={visible}
            onClose={close}
            classes={{
                paper: 'bg-gray-200 text-gray-800',
            }}
        >
            {MENU_LIST.map((item) =>
                item.enable ? (
                    item.enable(data) && (
                        <SidebarMenuItem key={item.text} item={item} />
                    )
                ) : (
                    <SidebarMenuItem key={item.text} item={item} />
                )
            )}
        </Menu>
    );
};

export default SidebarMenu;
