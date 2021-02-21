import { createStore } from '@notea/store'
import { ApiRequest, ApiResponse, ApiNext } from '../api'
import { GetServerSidePropsContext } from 'next'

export function useStore(req: ApiRequest, _res: ApiResponse, next: ApiNext) {
  applyStore(req)

  return next()
}

function applyStore(req: ApiRequest) {
  req.store = createStore()
}

export function withStore(wrapperHandler: any) {
  return async function handler(ctx: GetServerSidePropsContext) {
    applyStore(ctx.req)

    return wrapperHandler(ctx)
  }
}
