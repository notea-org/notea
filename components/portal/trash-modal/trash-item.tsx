import Link from 'next/link';
import { FC, useCallback, useRef } from 'react';
import { NoteCacheItem } from 'libs/web/cache';
import MarkText from 'components/portal/filter-modal/mark-text';
import IconButton from 'components/icon-button';
import HotkeyTooltip from 'components/hotkey-tooltip';
import TrashState from 'libs/web/state/trash';
import PortalState from 'libs/web/state/portal';
import useI18n from 'libs/web/hooks/use-i18n';
import classNames from 'classnames';
import useScrollView from 'libs/web/hooks/use-scroll-view';

const TrashItem: FC<{
    note: NoteCacheItem;
    keyword?: string;
    selected?: boolean;
}> = ({ note, keyword, selected }) => {
    const { t } = useI18n();
    const { restoreNote, deleteNote, filterNotes } = TrashState.useContainer();
    const {
        trash: { close },
    } = PortalState.useContainer();
    const ref = useRef<HTMLLIElement>(null);

    const onClickRestore = useCallback(async () => {
        await restoreNote(note);
        await filterNotes(keyword);
    }, [filterNotes, keyword, note, restoreNote]);

    const onClickDelete = useCallback(async () => {
        await deleteNote(note.id);
        await filterNotes(keyword);
    }, [deleteNote, note.id, filterNotes, keyword]);

    useScrollView(ref, selected);

    return (
        <li
            ref={ref}
            className={classNames(
                'hover:bg-gray-200 cursor-pointer py-2 px-4 flex',
                {
                    'bg-gray-300': selected,
                }
            )}
        >
            <Link href={`/${note.id}`} shallow>
                <a
                    className=" block text-xs text-gray-500 flex-grow"
                    onClick={close}
                >
                    <h4 className="text-sm font-bold">
                        <MarkText text={note.title} keyword={keyword} />
                    </h4>
                </a>
            </Link>

            <HotkeyTooltip text={t('Recovery')}>
                <IconButton
                    onClick={onClickRestore}
                    className="text-gray-500 mr-1"
                    icon="Reply"
                ></IconButton>
            </HotkeyTooltip>

            <HotkeyTooltip text={t('Delete')}>
                <IconButton
                    onClick={onClickDelete}
                    className="text-gray-500"
                    icon="Trash"
                ></IconButton>
            </HotkeyTooltip>
        </li>
    );
};

export default TrashItem;
