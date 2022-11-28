import { SSRMiddleware } from '../connect';
import { collectDebugInformation } from 'libs/server/debugging';

export const applyMisconfiguration: SSRMiddleware = async (req, _res, next) => {
    // const IS_DEMO = getEnv<boolean>('IS_DEMO', false);

    const collected = collectDebugInformation();
    req.props = {
        ...req.props,
        debugInformation: collected
    };

    next();
};
