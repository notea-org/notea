import { api } from '../../../services/api'
import { useAuth } from '../../../services/middlewares/auth'

export default api
  .use(useAuth)
  .get((req, res) => {
    res.end('ok')
  })
  .post((req, res) => {
    res.end('ok')
  })
