import Tokens from 'csrf'
import { CRSF_HEADER_KEY } from 'libs/shared/crsf'
import { getEnv } from 'libs/shared/env'
import { PageMode } from 'libs/shared/page'
import md5 from 'md5'
import { GetServerSidePropsContext } from 'next'
import { ApiNext, ApiRequest, ApiResponse } from '../api'

const tokens = new Tokens()

// generate CSRF secret
const csrfSecret = md5('CSRF' + getEnv('PASSWORD'))

export const getCsrfToken = () => tokens.create(csrfSecret)

export const verifyCsrfToken = (token: string) =>
  tokens.verify(csrfSecret, token)

export function withCsrf(wrapperHandler: any) {
  return async function handler(
    ctx: GetServerSidePropsContext & {
      req: ApiRequest
    }
  ) {
    const res = await wrapperHandler(ctx)
    let csrfToken

    if (res.redirect) {
      return res
    }

    if (res.pageMode !== PageMode.PUBLIC) {
      csrfToken = getCsrfToken()
    }

    res.props = {
      ...res.props,
      csrfToken,
    }

    return res
  }
}

const ignoredMethods = ['GET', 'HEAD', 'OPTIONS']

export function useCsrf(req: ApiRequest, res: ApiResponse, next: ApiNext) {
  const token = req.headers[CRSF_HEADER_KEY] as string

  if (ignoredMethods.includes(req.method?.toLocaleUpperCase() as string)) {
    return next()
  }

  if (token && verifyCsrfToken(token)) {
    next()
  } else {
    return res.APIError.INVALID_CSRF_TOKEN.throw()
  }
}
