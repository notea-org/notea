import { DEFAULT_SETTINGS } from 'libs/shared/settings';
import { getSettings } from 'pages/api/settings';
import { SSRMiddleware } from '../connect';
import { Redirect } from 'next';
import {
    createLogger
} from 'libs/server/debugging';

const logger = createLogger("middlewares.settings");
export const applySettings: SSRMiddleware = async (req, _res, next) => {
    let settings, redirect: Redirect = req.redirect;
    try {
        settings = await getSettings(req.state.store);
    } catch (e) {
        redirect = {
            permanent: false,
            destination: '/debug'
        };
        logger.error(e, "Error whilst loading settings");
    }
    let lngDict = {};

    if (settings) {
        // import language dict
        if (settings.locale && settings.locale !== DEFAULT_SETTINGS.locale) {
            lngDict = (await import(`locales/${settings.locale}.json`)).default;
        }
    }

    req.props = {
        ...req.props,
        ...{ settings, lngDict }
    };
    req.redirect = redirect;
    next();
};
