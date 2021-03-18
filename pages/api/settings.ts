import { api } from 'libs/server/api'
import { useAuth } from 'libs/server/middlewares/auth'
import { useStore } from 'libs/server/middlewares/store'
import { getSettings } from 'libs/server/note-path'
import { formatSettings } from 'libs/shared/settings'

export default api()
  .use(useAuth)
  .use(useStore)
  .post(async (req, res) => {
    const { body } = req
    const settings = formatSettings(body)

    await req.store.putObject(getSettings(), JSON.stringify(settings))
    res.end()
  })
  .get(async (req, res) => {
    const settings = await req.store.getObject(getSettings())

    res.json(settings)
  })
