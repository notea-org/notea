import { ironSession } from 'next-iron-session';
import md5 from 'md5';
import { BasicAuthConfiguration, config } from 'libs/server/config';
import { Middleware, NextHandler } from 'next-connect';

const sessionOptions = () => ({
    cookieName: 'notea-auth',
    password: md5('notea' + (config().auth as BasicAuthConfiguration).password), // NOTE(tecc): in the future, if this field becomes null, it will be an issue
    // if your localhost is served on http:// then disable the secure flag
    cookieOptions: {
        secure: config().server.useSecureCookies,
    },
});

let _useSession: Middleware<any, any>;
export const useSession: Middleware<any, any> = (...args: [any, any, NextHandler]) => {
    _useSession ??= ironSession(sessionOptions());
    _useSession(...args);
};
