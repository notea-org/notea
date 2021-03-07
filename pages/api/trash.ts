import { api } from 'services/api'
import { useAuth } from 'services/middlewares/auth'
import { useStore } from 'services/middlewares/store'

export default api()
  .use(useAuth)
  .use(useStore)
  .get(async (req, res) => {
    res.json(await req.treeStore.trash.get())
  })
  .post(async (req, res) => {
    const { action, data } = req.body

    switch (action) {
      case 'delete':
        // todo 真删除
        console.log(data)
        break

      default:
        return res.APIError.NOT_SUPPORTED.throw('action not found')
    }

    res.end()
  })
