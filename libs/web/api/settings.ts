import { useCallback } from 'react';
import useFetcher from './fetcher';
import { Settings } from 'libs/shared/settings';

export default function useSettingsAPI() {
    const { request } = useFetcher();

    const mutate = useCallback(
        async (body: Partial<Settings>) => {
            return request<Partial<Settings>, Settings>(
                {
                    method: 'POST',
                    url: `/api/settings`,
                },
                body
            );
        },
        [request]
    );

    return {
        mutate,
    };
}
