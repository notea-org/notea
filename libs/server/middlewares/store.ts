import { createStore } from 'libs/server/store'
import { ApiRequest, SSRMiddeware } from '../connect'
import TreeStore from 'libs/server/tree'

export const useStore: SSRMiddeware = async (req, _res, next) => {
  applyStore(req)

  return next()
}

export function applyStore(req: ApiRequest) {
  const store = createStore()

  req.state = {
    ...req.state,
    store,
    treeStore: new TreeStore(store),
  }
}
