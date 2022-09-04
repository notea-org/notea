import { useState, useCallback } from 'react';
import { createContainer } from 'unstated-next';
import NoteTreeState from './tree';
import useTrashAPI from '../api/trash';
import noteCache from '../cache/note';
import { NOTE_DELETED } from 'libs/shared/meta';
import { NoteCacheItem } from '../cache';
import { searchNote } from '../utils/search';
import { NoteModel } from 'libs/shared/note';
import { ROOT_ID } from 'libs/shared/tree';

function useTrash() {
    const [keyword, setKeyword] = useState<string>();
    const [list, setList] = useState<NoteCacheItem[]>();
    const { restoreItem, deleteItem } = NoteTreeState.useContainer();
    const { mutate, loading } = useTrashAPI();

    const filterNotes = useCallback(async (keyword = '') => {
        const data = await searchNote(keyword, NOTE_DELETED.DELETED);

        setKeyword(keyword);
        setList(data);
    }, []);

    const restoreNote = useCallback(
        async (note: NoteModel) => {
            // 父页面被删除时，恢复页面的 parent 改成 root
            const pNote = note.pid && (await noteCache.getItem(note.pid));
            if (
                !note.pid ||
                !pNote ||
                pNote?.deleted === NOTE_DELETED.DELETED
            ) {
                note.pid = ROOT_ID;
            }

            await mutate({
                action: 'restore',
                data: {
                    id: note.id,
                    parentId: note.pid,
                },
            });
            await noteCache.mutateItem(note.id, {
                deleted: NOTE_DELETED.NORMAL,
            });
            await restoreItem(note.id, note.pid);

            return note;
        },
        [mutate, restoreItem]
    );

    const deleteNote = useCallback(
        async (id: string) => {
            await mutate({
                action: 'delete',
                data: {
                    id,
                },
            });
            await noteCache.removeItem(id);
            await deleteItem(id);
        },
        [deleteItem, mutate]
    );

    return {
        list,
        keyword,
        loading,
        filterNotes,
        restoreNote,
        deleteNote,
    };
}

const TrashState = createContainer(useTrash);

export default TrashState;
