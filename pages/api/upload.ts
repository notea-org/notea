import { api } from 'libs/server/api'
import { useAuth } from 'libs/server/middlewares/auth'
import { useStore } from 'libs/server/middlewares/store'
import { IncomingForm } from 'formidable'
import { readFileSync } from 'fs'
import dayjs from 'dayjs'
import { getPathFileByName } from 'libs/server/note-path'
import md5 from 'md5'
import { extname } from 'path'

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
    const fileName = `${dayjs().format('YYYY/MM/DD')}/${md5(buffer).slice(
      0,
      8
    )}${extname(file.name)}`
    const filePath = getPathFileByName(fileName)

    await req.store.putObject(filePath, buffer, {
      contentType: file.type,
      headers: {
        cacheControl:
          'public, max-age=31536000, s-maxage=31536000, stale-while-revalidate=31536000',
        contentDisposition: 'inline',
      },
    })

    res.json({ url: `/api/file/${fileName}` })
  })
