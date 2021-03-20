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

    res.props = {
      ...res.props,
      settings: await getSettings(ctx.req.store),
    }

    return res
  }
}
