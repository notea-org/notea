import { EDITOR_SIZE, NOTE_PINNED } from 'libs/shared/meta';
import { NoteModel } from 'libs/shared/note';
import NoteState from 'libs/web/state/note';
import PortalState from 'libs/web/state/portal';
import { forwardRef, useCallback, useMemo } from 'react';
import { MenuItem } from '@material-ui/core';
import UIState from 'libs/web/state/ui';

export enum MENU_HANDLER_NAME {
    REMOVE_NOTE,
    COPY_LINK,
    ADD_TO_FAVORITES,
    REMOVE_FROM_FAVORITES,
    TOGGLE_WIDTH,
}

export interface Item {
    text: string;
    icon: JSX.Element;
    handler: MENU_HANDLER_NAME;
    enable?: (data?: NoteModel) => boolean;
}

interface ItemProps {
    item: Item;
}

export const SidebarMenuItem = forwardRef<HTMLLIElement, ItemProps>(
    ({ item }, ref) => {
        const {
            settings: { settings },
        } = UIState.useContainer();
        const { removeNote, mutateNote } = NoteState.useContainer();
        const {
            menu: { close, data },
        } = PortalState.useContainer();

        const doRemoveNote = useCallback(() => {
            close();
            if (data?.id) {
                // TODO: merge with mutateNote
                removeNote(data.id)
                    ?.catch((v) => console.error('Error whilst removing note: %O', v));
                mutateNote(data.id, {
                    pinned: NOTE_PINNED.UNPINNED,
                })
                    ?.catch((v) => console.error('Error whilst mutating item: %O', v));
            }
        }, [close, data, mutateNote, removeNote]);

        const doCopyLink = useCallback(() => {
            navigator.clipboard.writeText(location.origin + '/' + data?.id)
                ?.catch((v) => console.error('Error whilst writing to clipboard: %O', v));
            close();
        }, [close, data?.id]);

        const doPinned = useCallback(() => {
            close();
            if (data?.id) {
                mutateNote(data.id, {
                    pinned: NOTE_PINNED.PINNED,
                })
                    ?.catch((v) => console.error('Error whilst mutating note: %O', v));
            }
        }, [close, data, mutateNote]);

        const doUnpinned = useCallback(() => {
            close();
            if (data?.id) {
                mutateNote(data.id, {
                    pinned: NOTE_PINNED.UNPINNED,
                })
                    ?.catch((v) => console.error('Error whilst mutating note: %O', v));
            }
        }, [close, data, mutateNote]);

        const toggleWidth = useCallback(() => {
            close();
            if (data?.id) {
                const resolvedNoteWidth =
                    data.editorsize ?? settings.editorsize;
                const editorSizesCount = Object.values(EDITOR_SIZE).length / 2; // contains both string & int values

                mutateNote(data.id, {
                    editorsize: (resolvedNoteWidth + 1) % editorSizesCount,
                })
                    .catch((v) => console.error('Error whilst mutating note: %O', v));
            }
        }, [close, data, mutateNote, settings.editorsize]);

        const MENU_HANDLER = useMemo(
            () => ({
                [MENU_HANDLER_NAME.REMOVE_NOTE]: doRemoveNote,
                [MENU_HANDLER_NAME.COPY_LINK]: doCopyLink,
                [MENU_HANDLER_NAME.ADD_TO_FAVORITES]: doPinned,
                [MENU_HANDLER_NAME.REMOVE_FROM_FAVORITES]: doUnpinned,
                [MENU_HANDLER_NAME.TOGGLE_WIDTH]: toggleWidth,
            }),
            [doCopyLink, doPinned, doRemoveNote, doUnpinned, toggleWidth]
        );

        return (
            <MenuItem ref={ref} onClick={MENU_HANDLER[item.handler]}>
                <span className="text-xs w-4 mr-2">{item.icon}</span>
                <span className="text-xs">{item.text}</span>
            </MenuItem>
        );
    }
);
