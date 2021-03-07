import { api } from 'services/api'
import { useAuth } from 'services/middlewares/auth'
import { useStore } from 'services/middlewares/store'

export default api()
  .use(useAuth)
  .use(useStore)
  .get(async (req, res) => {
    res.json(await req.treeStore.get())
  })
