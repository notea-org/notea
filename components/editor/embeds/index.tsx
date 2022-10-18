import CsrfTokenState from 'libs/web/state/csrf-token';
import { useCallback } from 'react';
import { Props } from '@notea/rich-markdown-editor';
import { Bookmark } from './bookmark';
import { Embed } from './embed';
import { ReactComponentLike } from 'prop-types';

export type EmbedProps = {
    attrs: {
        href: string;
        matches: string[];
    };
};

export const useEmbeds = () => {
    const csrfToken = CsrfTokenState.useContainer();

    const createEmbedComponent = useCallback(
        (Component: ReactComponentLike) => {
            return (props: EmbedProps) => {
                return (
                    <CsrfTokenState.Provider initialState={csrfToken}>
                        <Component {...props} />
                    </CsrfTokenState.Provider>
                );
            };
        },
        [csrfToken]
    );

    return [
        {
            title: 'Bookmark',
            matcher: (url) => url.match(/^\/api\/extract\?type=bookmark/),
            component: createEmbedComponent(Bookmark),
        },
        {
            title: 'Embed',
            matcher: (url) => url.match(/^\/api\/extract\?type=embed/),
            component: createEmbedComponent(Embed),
        },
    ] as Props['embeds'];
};
