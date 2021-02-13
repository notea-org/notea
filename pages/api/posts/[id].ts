import { api } from '../../../services/api'
import { useAuth } from '../../../services/middlewares/auth'

export default api.use(useAuth).delete((req, res) => {
  res.end('ok')
})
