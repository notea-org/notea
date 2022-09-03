import { useCallback } from 'react';
import useFetcher from './fetcher';

interface MutateBody {
    action: 'restore' | 'delete';
    data: any;
}

export default function useTrashAPI() {
    const { loading, request, abort } = useFetcher();

    const mutate = useCallback(
        async (body: MutateBody) => {
            return request<MutateBody, undefined>(
                {
                    method: 'POST',
                    url: `/api/trash`,
                },
                body
            );
        },
        [request]
    );

    return {
        loading,
        abort,
        mutate,
    };
}
