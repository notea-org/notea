import { UserAgentType } from 'libs/shared/ua';
import UAParser from 'ua-parser-js';
import { SSRMiddleware } from '../connect';

export const applyUA: SSRMiddleware = (req, _res, next) => {
    const ua = new UAParser(req.headers['user-agent']).getResult();

    req.props = {
        ...req.props,
        ua: {
            isMobile: ['mobile', 'tablet'].includes(ua.device.type || ''),
            isMobileOnly: ua.device.type === 'mobile',
            isTablet: ua.device.type === 'tablet',
            isBrowser: !ua.device.type,
            isWechat: ua.browser.name?.toLocaleLowerCase() === 'wechat',
            isMac: !!/Mac|iOS/.test(ua.os.name ?? ''),
        } as UserAgentType,
    };
    next();
};
