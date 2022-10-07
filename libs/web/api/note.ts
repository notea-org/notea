import { NoteModel } from 'libs/shared/note';
import { useCallback } from 'react';
import noteCache from '../cache/note';
import useFetcher from './fetcher';

export default function useNoteAPI() {
    const { loading, request, abort, error } = useFetcher();

    const find = useCallback(
        async (id: string) => {
            return request<null, NoteModel>({
                method: 'GET',
                url: `/api/notes/${id}`,
            });
        },
        [request]
    );

    const create = useCallback(
        async (body: Partial<NoteModel>) => {
            return request<Partial<NoteModel>, NoteModel>(
                {
                    method: 'POST',
                    url: `/api/notes`,
                },
                body
            );
        },
        [request]
    );

    const mutate = useCallback(
        async (id: string, body: Partial<NoteModel>) => {
            const data = body.content
                ? await request<Partial<NoteModel>, NoteModel>(
                      {
                          method: 'POST',
                          url: `/api/notes/${id}`,
                      },
                      body
                  )
                : await request<Partial<NoteModel>, NoteModel>(
                      {
                          method: 'POST',
                          url: `/api/notes/${id}/meta`,
                      },
                      body
                  );

            return data;
        },
        [request]
    );

    // fetch note from cache or api
    const fetch = useCallback(
        async (id: string) => {
            const cache = await noteCache.getItem(id);
            if (cache) {
                return cache;
            }
            const note = await find(id);
            if (note) {
                await noteCache.setItem(id, note);
            }

            return note;
        },
        [find]
    );

    return {
        loading,
        error,
        abort,
        find,
        create,
        mutate,
        fetch,
    };
}
