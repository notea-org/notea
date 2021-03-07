import { api } from 'services/api'
import { useAuth } from 'services/middlewares/auth'
import { useStore } from 'services/middlewares/store'

export default api()
  .use(useAuth)
  .use(useStore)
  .get(async (req, res) => {
    res.json(await req.treeStore.get())
  })
  .post(async (req, res) => {
    const { action, data } = req.body

    switch (action) {
      case 'move':
        await req.treeStore.moveItem(data.source, data.destination)
        break

      case 'mutate':
        await req.treeStore.mutateItem(data.id, data)
        break

      default:
        return res.APIError.NOT_SUPPORTED.throw('action not found')
    }

    res.end()
  })
