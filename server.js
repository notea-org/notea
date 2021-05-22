const { createServer } = require('http')
const { parse } = require('url')
const next = require('next')

const app = next({ dev: false, dir: __dirname })
const port = process.env.PORT || 3000
const handle = app.getRequestHandler()

app.prepare().then(() => {
  createServer((req, res) => {
    handle(req, res, parse(req.url, true).pathname)
  }).listen(port, (err) => {
    if (err) throw err
    console.log('> Ready on http://localhost:3000')
  })
})
