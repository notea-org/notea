import Tokens from 'csrf';
import { CSRF_HEADER_KEY } from 'libs/shared/const';
import md5 from 'md5';
import { ApiNext, ApiRequest, ApiResponse, SSRMiddleware } from '../connect';
import { BasicAuthConfiguration, config } from 'libs/server/config';

const tokens = new Tokens();

// generate CSRF secret
let _csrfSecret: string;
const csrfSecret = () => _csrfSecret ?? (_csrfSecret = md5('CSRF' + (config().auth as BasicAuthConfiguration).password));

export const getCsrfToken = () => tokens.create(csrfSecret());

export const verifyCsrfToken = (token: string) =>
    tokens.verify(csrfSecret(), token);

export const applyCsrf: SSRMiddleware = async (req, _res, next) => {
    req.props = {
        ...req.props,
        csrfToken: getCsrfToken(),
    };
    req.session.set(CSRF_HEADER_KEY, req.props.csrfToken);
    await req.session.save();
    next();
};

const ignoredMethods = ['GET', 'HEAD', 'OPTIONS'];

export function useCsrf(req: ApiRequest, res: ApiResponse, next: ApiNext) {
    if (process.env.NODE_ENV === 'test') {
        return next();
    }

    const token = req.headers[CSRF_HEADER_KEY] as string;
    const sessionToken = req.session.get(CSRF_HEADER_KEY);

    if (ignoredMethods.includes(req.method?.toLocaleUpperCase() as string)) {
        return next();
    }

    if (
        token &&
        sessionToken &&
        // TODO: sometimes not equal
        // token === sessionToken &&
        verifyCsrfToken(token) &&
        verifyCsrfToken(sessionToken)
    ) {
        next();
    } else {
        let message;
        if (!token) {
            message = 'Missing CSRF token in headers';
        } else if (!sessionToken) {
            message = 'Missing CSRF token in cookies';
        }
        return res.APIError.INVALID_CSRF_TOKEN.throw(message);
    }
}
