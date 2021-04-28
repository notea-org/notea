import { mapValues } from 'lodash'
import { ApiRequest, ApiResponse, ApiNext } from '../api'

export const API_ERROR: {
  [key: string]: {
    status: number
    message: string
    description: string
  }
} = {
  NEED_LOGIN: {
    status: 401,
    message: 'Please login first',
    description: '需要先登录相关系统',
  },
  NOT_SUPPORTED: {
    status: 406,
    message: 'Not supported',
    description: '不支持的服务',
  },
  NOT_FOUND: {
    status: 404,
    message: 'Not found',
    description: '找不到该数据',
  },
  INVALID_CSRF_TOKEN: {
    status: 401,
    message: 'Invalid CSRF token',
    description: '无效 CSRF token',
  },
}

export class APIError {
  prefix = 'API_ERR_'

  status?: number = 500
  name?: string = 'UNKNOWN'
  message = 'Something unexpected happened'
  description?: string

  constructor(
    message: string,
    properties?: { status?: number; name?: string; description?: string }
  ) {
    this.message = message
    if (properties) {
      this.status = properties.status
      this.name = properties.name
      this.description = properties.description
    }
  }

  throw(message?: string) {
    const error = new Error(message === undefined ? this.message : message)

    error.name = this.prefix + this.name
    ;(error as any).status = this.status
    ;(error as any).description = this.description

    throw error
  }
}

export const API = mapValues(
  API_ERROR,
  (v, name) =>
    new APIError(v.message, {
      status: v.status,
      name,
      description: v.description,
    })
)

export async function onError(
  err: Error & APIError,
  _req: ApiRequest,
  res: ApiResponse,
  _next: ApiNext
) {
  const e = {
    name: err.name || 'UNKNOWN_ERR',
    message: err.message || err?.description || 'Something unexpected',
    status: err.status || 500,
  }

  console.error({
    ...e,
    stack: err.stack,
  })

  res.status(e.status).json(e)
}

export async function useError(
  _req: ApiRequest,
  res: ApiResponse,
  next: ApiNext
) {
  res.APIError = API
  next()
}
