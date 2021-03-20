import { GetServerSidePropsContext } from 'next'
import { ApiRequest, ApiResponse, ApiNext } from '../api'

export async function useAuth(
  req: ApiRequest,
  res: ApiResponse,
  next: ApiNext
) {
  const user = req.session.get('user')

  if (!user?.isLoggedIn) {
    return res.APIError.NEED_LOGIN.throw()
  }

  return next()
}

export default function withAuth(wrapperHandler: any) {
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
    }

    return res
  }
}
