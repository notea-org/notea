import { UserAgentType } from 'libs/web/state/ui/ua'
import { GetServerSidePropsContext } from 'next'
import UAParser from 'ua-parser-js'

export function withUA(wrapperHandler: any) {
  return async function handler(ctx: GetServerSidePropsContext) {
    const res = await wrapperHandler(ctx)
    const ua = new UAParser(ctx.req.headers['user-agent']).getResult()

    res.props = {
      ...res.props,
      ua: {
        isMobile: ['mobile', 'tablet'].includes(ua.device.type || ''),
        isMobileOnly: ua.device.type === 'mobile',
        isTablet: ua.device.type === 'tablet',
        isBrowser: !ua.device.type,
        isWechat: ua.browser.name?.toLocaleLowerCase() === 'wechat',
      } as UserAgentType,
    }

    return res
  }
}
