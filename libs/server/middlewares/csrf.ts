import Tokens from 'csrf'
import { CRSF_HEADER_KEY } from 'libs/shared/const'
import { getEnv } from 'libs/shared/env'
import md5 from 'md5'
import { ApiNext, ApiRequest, ApiResponse, SSRMiddeware } from '../connect'

const tokens = new Tokens()

// generate CSRF secret
const csrfSecret = md5('CSRF' + getEnv('PASSWORD'))

export const getCsrfToken = () => tokens.create(csrfSecret)

export const verifyCsrfToken = (token: string) =>
  tokens.verify(csrfSecret, token)

export const applyCsrf: SSRMiddeware = (req, _res, next) => {
  if (req.props.isLoggedIn) {
    req.props = {
      ...req.props,
      csrfToken: getCsrfToken(),
    }
  }

  next()
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
