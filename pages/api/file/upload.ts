import { api } from 'services/api'
import { useAuth } from 'services/middlewares/auth'
import { useStore } from 'services/middlewares/store'
import { IncomingForm } from 'formidable'
import { readFileSync } from 'fs'
import dayjs from 'dayjs'

export const config = {
  api: {
    bodyParser: false,
  },
}

export default api()
  .use(useAuth)
  .use(useStore)
  .post(async (req, res) => {
    const data: any = await new Promise((resolve, reject) => {
      const form = new IncomingForm()

      form.parse(req, (err, fields, files) => {
        if (err) return reject(err)
        resolve({ fields, files })
      })
    })

    const file = data.files.file
    const buffer = readFileSync(file.path)
    const filePath = req.store.path.getFileByName(
      `${dayjs().format('YYYY/MM/DD')}/${file.name}`
    )

    await req.store.putObject(filePath, buffer, {
      contentType: file.type,
    })

    res.json({ url: `/api/file/${filePath}` })
  })
