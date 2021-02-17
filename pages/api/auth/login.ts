import { getEnv } from 'packages/shared'
import { api } from 'services/api'

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
