import { api } from 'libs/server/api'
import { getEnv } from 'libs/shared/env'

export default api().post(async (req, res) => {
  const { password } = req.body

  if (password !== getEnv('PASSWORD') + '') {
    return res.APIError.NEED_LOGIN.throw()
  }

  const user = {
    isLoggedIn: true,
  }
  req.session.set('user', user)
  await req.session.save()

  res.json(user)
})
