import { PageMode } from 'libs/shared/page'
import { GetServerSidePropsContext } from 'next'
import { getSettings } from 'pages/api/settings'
import { ApiRequest } from '../api'

export function withSettings(wrapperHandler: any) {
  return async function handler(
    ctx: GetServerSidePropsContext & {
      req: ApiRequest
    }
  ) {
    const res = await wrapperHandler(ctx)
    let settings

    if (res.redirect) {
      return res
    }

    if (res.pageMode !== PageMode.PUBLIC) {
      settings = await getSettings(ctx.req.store)
    }

    // import language dict
    const { default: lngDict = {} } = await import(
      `locales/${settings?.locale}.json`
    )

    res.props = {
      ...res.props,
      settings,
      lngDict,
    }

    return res
  }
}
