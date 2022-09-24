import { PageMode } from 'libs/shared/page';
import { NOTE_SHARED } from 'libs/shared/meta';
import { getNote } from 'pages/api/notes/[id]';
import { SSRMiddleware } from '../connect';
import { NoteModel } from 'libs/shared/note';
import { config } from 'libs/server/config';

const RESERVED_ROUTES = ['new', 'settings', 'login'];

export const applyNote: (id: string) => SSRMiddleware =
    (id: string) => async (req, _res, next) => {
        const props: {
            note?: NoteModel;
            pageMode: PageMode;
        } = {
            pageMode: PageMode.NOTE,
        };

        // todo 页面不存在时应该跳转到新建页
        if (!RESERVED_ROUTES.includes(id)) {
            try {
                props.note = await getNote(req.state.store, id);
            } catch (e) {
                // do nothing
            }
        }

        if (props.note?.shared === NOTE_SHARED.PUBLIC) {
            props.pageMode = PageMode.PUBLIC;
        }

        req.props = {
            ...req.props,
            ...props,
            baseURL: config().server.baseUrl ?? 'http://' + req.headers.host,
        };

        next();
    };
