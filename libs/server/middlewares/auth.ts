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
