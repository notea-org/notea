import { api } from 'services/api'
import { useAuth } from 'services/middlewares/auth'

export default api()
  .use(useAuth)
  .get(async (req, res) => {
    const user = req.session.get('user')

    res.json(user)
  })
