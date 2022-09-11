import { CSRF_HEADER_KEY } from 'libs/shared/const';
import { useCallback, useRef, useState } from 'react';
import CsrfTokenState from '../state/csrf-token';

interface Params {
    url: string;
    method: 'GET' | 'POST';
    headers?: Record<string, string>;
}

export default function useFetcher() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string>();
    const abortRef = useRef<AbortController>();
    const csrfToken = CsrfTokenState.useContainer();

    const request = useCallback(
        async function request<Payload, ReponseData>(
            params: Params,
            payload?: Payload | string
        ): Promise<ReponseData | undefined> {
            const controller = new AbortController();

            setLoading(true);
            setError('');
            abortRef.current = controller;

            const init: RequestInit = {
                signal: controller.signal,
                method: params.method,
            };

            init.headers = {
                ...(csrfToken && { [CSRF_HEADER_KEY]: csrfToken }),
            };

            if (payload instanceof FormData) {
                init.body = payload;
            } else {
                init.body = JSON.stringify(payload);
                init.headers['Content-Type'] = 'application/json';
            }

            init.headers = {
                ...init.headers,
                ...(params.headers || {}),
            };

            try {
                const response = await fetch(params.url, init);

                if (!response.ok) {
                    throw await response.text();
                }
                if (response.status === 204) {
                    return;
                }

                return response.json();
            } catch (e) {
                if (!controller?.signal.aborted) {
                    setError(String(e));
                }
            } finally {
                setLoading(false);
            }
        },
        [csrfToken]
    );

    const abort = useCallback(() => {
        abortRef.current?.abort();
    }, []);

    return { loading, request, abort, error };
}
