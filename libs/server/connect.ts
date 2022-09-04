import nc, { Middleware } from 'next-connect';
import { onError, useError, onErrorWithNext } from './middlewares/error';
import {
    GetServerSidePropsContext,
    NextApiRequest,
    NextApiResponse,
    Redirect,
} from 'next';
import { API } from './middlewares/error';
import { StoreProvider } from 'libs/server/store';
import { useSession } from './middlewares/session';
import { Session } from 'next-iron-session';
import TreeStore from './tree';
import { useCsrf } from 'libs/server/middlewares/csrf';
import { PageMode } from 'libs/shared/page';
import { NoteModel } from 'libs/shared/note';
import { Settings } from 'libs/shared/settings';
import { TreeModel } from 'libs/shared/tree';
import { UserAgentType } from 'libs/shared/ua';
import { useStore } from './middlewares/store';

export interface ServerState {
    store: StoreProvider;
    treeStore: TreeStore;
}

export interface ServerProps {
    isLoggedIn: boolean;
    IS_DEMO: boolean;
    csrfToken?: string;
    pageMode: PageMode;
    note?: NoteModel;
    baseURL: string;
    settings?: Settings;
    lngDict: Record<string, string>;
    tree?: TreeModel;
    ua?: UserAgentType;
    disablePassword: boolean;
}

export type ApiRequest = NextApiRequest & {
    session: Session;
    state: ServerState;
    props: ServerProps;
    redirect: Redirect;
};

export type ApiResponse = NextApiResponse & {
    APIError: typeof API;
};

export type ApiNext = () => void;

export const api = () =>
    nc<ApiRequest, ApiResponse>({
        onError,
    })
        .use(useError)
        .use(useSession)
        .use(useCsrf);

// used by getServerSideProps
export const ssr = () =>
    nc<ApiRequest, ApiResponse>({
        onError: onErrorWithNext,
    })
        // init props
        .use((req, _res, next) => {
            req.props = {} as ServerProps;
            req.state = {} as ServerState;
            next();
        })
        .use(useError)
        .use(useStore);

export type SSRContext = GetServerSidePropsContext & {
    req: ApiRequest;
    res: ApiResponse;
};

export type SSRMiddleware = Middleware<ApiRequest, ApiResponse>;
