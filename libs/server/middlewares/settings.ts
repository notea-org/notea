import { DEFAULT_SETTINGS } from 'libs/shared/settings';
import { getSettings } from 'pages/api/settings';
import { SSRMiddleware } from '../connect';

export const applySettings: SSRMiddleware = async (req, _res, next) => {
    const settings = await getSettings(req.state.store);
    let lngDict = {};

    // import language dict
    if (settings.locale && settings.locale !== DEFAULT_SETTINGS.locale) {
        lngDict = (await import(`locales/${settings.locale}.json`)).default;
    }

    req.props = {
        ...req.props,
        ...{ settings, lngDict },
    };
    next();
};
