import { ApiRequest, ApiResponse, ApiNext } from '../api'
import { getSession } from 'next-auth/client'

export async function useAuth(
  req: ApiRequest,
  res: ApiResponse,
  next: ApiNext
) {
  let session
  try {
    session = await getSession({ req })
  } catch (e) {
    console.error(e)
  }
  if (!session || !session.user) {
    return res.APIError.NEED_LOGIN.throw()
  }

  req.user = session.user

  return next()
}
