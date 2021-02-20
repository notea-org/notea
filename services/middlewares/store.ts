import { createStore } from '@notea/store'
import { ApiRequest, ApiResponse, ApiNext } from '../api'

export function useStore(req: ApiRequest, _res: ApiResponse, next: ApiNext) {
  applyStore(req)

  return next()
}

function applyStore(req: ApiRequest) {
  req.store = createStore()
}

export function withStore(wrapperHandler: any) {
  return async function handler(...args: any[]) {
    const handlerType = args[0] && args[1] ? 'api' : 'ssr'
    const req = handlerType === 'api' ? args[0] : args[0].req

    applyStore(req)

    return wrapperHandler(...args)
  }
}
