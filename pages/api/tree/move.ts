import { api } from 'services/api'
import { useAuth } from 'services/middlewares/auth'
import { useStore } from 'services/middlewares/store'

export default api()
  .use(useAuth)
  .use(useStore)
  .post(async (req, res) => {
    const { source, destination } = req.body

    await req.treeStore.moveItem(source, destination)

    res.end()
  })
