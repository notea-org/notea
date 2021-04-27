import { getEnv } from 'libs/shared/env'
import { PageMode } from 'libs/shared/page'
import { GetServerSidePropsContext } from 'next'
import { ApiRequest, ApiResponse, ApiNext } from '../api'

export async function useAuth(
  req: ApiRequest,
  res: ApiResponse,
  next: ApiNext
) {
  if (!isLoggedIn(req)) {
    return res.APIError.NEED_LOGIN.throw()
  }

  return next()
}

export function withAuth(wrapperHandler: any) {
  return async function handler(
    ctx: GetServerSidePropsContext & {
      req: ApiRequest
    }
  ) {
    const redirectLogin = {
      redirect: {
        destination: `/login?redirect=${ctx.resolvedUrl}`,
        permanent: false,
      },
    }

    const res = await wrapperHandler(ctx)

    if (res.props?.pageMode !== PageMode.PUBLIC && !isLoggedIn(ctx.req)) {
      return redirectLogin
    }

    res.props = {
      ...res.props,
    }

    return res
  }
}

export function isLoggedIn(req: ApiRequest) {
  if (getEnv('IS_DEMO')) {
    return true
  }

  return req.session.get('user')?.isLoggedIn
}
