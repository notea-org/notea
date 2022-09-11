import { PageMode } from 'libs/shared/page';
import { ApiRequest, ApiResponse, ApiNext, SSRMiddleware } from '../connect';
import { config } from 'libs/server/config';

export async function useAuth(
    req: ApiRequest,
    res: ApiResponse,
    next: ApiNext
) {
    if (process.env.NODE_ENV === 'test') {
        return next();
    }

    if (!isLoggedIn(req)) {
        return res.APIError.NEED_LOGIN.throw();
    }

    return next();
}

export function isLoggedIn(req: ApiRequest) {
    const cfg = config();
    if (cfg.auth.type === 'none') {
        return true;
    }

    return !!req.session.get('user')?.isLoggedIn;
}

export const applyAuth: SSRMiddleware = async (req, _res, next) => {
    // const IS_DEMO = getEnv<boolean>('IS_DEMO', false);

    req.props = {
        ...req.props,
        isLoggedIn: isLoggedIn(req),
        disablePassword: config().auth.type === 'none',
        IS_DEMO: false,
    };

    next();
};

export const applyRedirectLogin: (resolvedUrl: string) => SSRMiddleware =
    (resolvedUrl: string) => async (req, _res, next) => {
        const redirect = {
            destination: `/login?redirect=${resolvedUrl}`,
            permanent: false,
        };

        // note 存在的情况
        if (req.props.pageMode) {
            if (
                req.props.pageMode !== PageMode.PUBLIC &&
                !req.props.isLoggedIn
            ) {
                req.redirect = redirect;
            }
            // 访问首页没有 note，则判断是否登录
        } else if (!req.props.isLoggedIn) {
            req.redirect = redirect;
        }

        next();
    };
