import { createStore } from '@notea/store/src'
import { ApiRequest, ApiResponse, ApiNext } from '../api'

export async function useStore(
  req: ApiRequest,
  _res: ApiResponse,
  next: ApiNext
) {
  req.store = createStore()

  return next()
}
