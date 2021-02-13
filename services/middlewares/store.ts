import { ApiRequest, ApiResponse, ApiNext } from '../api'
import { createUserStore } from '../store'

export async function useStore(
  req: ApiRequest,
  _res: ApiResponse,
  next: ApiNext
) {
  if (!req.user) {
    throw new Error('not_authenticated')
  }
  req.store = createUserStore(req.user.id)

  return next()
}
