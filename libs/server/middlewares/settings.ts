import { DEFAULT_SETTINGS } from 'libs/shared/settings';
import { getSettings } from 'pages/api/settings';
import { SSRMiddleware } from '../connect';
import { Redirect } from 'next';
import { coerceToValidCause, IssueCategory, IssueSeverity, setKeyedRuntimeIssue } from 'libs/server/debugging';

const SYM_COULD_NOT_GET_SETTINGS = Symbol();
export const applySettings: SSRMiddleware = async (req, _res, next) => {
    let settings, redirect: Redirect = req.redirect;
    try {
        settings = await getSettings(req.state.store);
    } catch (e) {
        setKeyedRuntimeIssue(SYM_COULD_NOT_GET_SETTINGS, {
            name: "Error when loading settings",
            description: "An unknown error occurred whilst getting settings from the store.",
            cause: coerceToValidCause(e),
            severity: IssueSeverity.FATAL_ERROR,
            category: IssueCategory.MISC,
            fixes: []
        });
        redirect = {
            permanent: false,
            destination: '/debug'
        };
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
