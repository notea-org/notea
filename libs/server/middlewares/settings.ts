import { GetServerSidePropsContext } from 'next'
import { getSettings } from 'pages/api/settings'
import { ApiRequest } from '../api'

export default function withSettings(wrapperHandler: any) {
  return async function handler(
    ctx: GetServerSidePropsContext & {
      req: ApiRequest
    }
  ) {
    const res = await wrapperHandler(ctx)

    if (!ctx.req.session.get('user')) {
      return {
        redirect: {
          destination: `/login?redirect=${ctx.resolvedUrl}`,
          permanent: false,
        },
      }
    }

    res.props = {
      ...res.props,
      settings: await getSettings(ctx.req.store),
    }

    return res
  }
}
