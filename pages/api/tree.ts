import { api } from 'libs/server/api'
import { useAuth } from 'libs/server/middlewares/auth'
import { useStore } from 'libs/server/middlewares/store'

export default api()
  .use(useAuth)
  .use(useStore)
  .get(async (req, res) => {
    res.json(await req.treeStore.get())
  })
  .post(async (req, res) => {
    const { action, data } = req.body as {
      action: 'move' | 'mutate'
      data: any
    }

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

    res.status(204).end()
  })
