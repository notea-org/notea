import { createStore } from '@notea/store'
import { ApiRequest, ApiResponse, ApiNext } from '../api'
import { GetServerSidePropsContext } from 'next'
import { TreeStore } from 'services/tree'

export function useStore(req: ApiRequest, _res: ApiResponse, next: ApiNext) {
  applyStore(req)

  return next()
}

function applyStore(req: ApiRequest) {
  req.store = createStore()
  req.treeStore = new TreeStore(req.store)
}

export function withStore(wrapperHandler: any) {
  return async function handler(
    ctx: GetServerSidePropsContext & {
      req: ApiRequest
    }
  ) {
    applyStore(ctx.req)

    return wrapperHandler(ctx)
  }
}
