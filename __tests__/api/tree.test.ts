import { createServer, IncomingMessage, Server, ServerResponse } from 'http'
import { apiResolver } from 'next/dist/server/api-utils'
import treeHandler from 'pages/api/tree'
import supertest from 'supertest'

describe('/api/tree', () => {
  let server: Server

  beforeEach(async () => {
    const requestHandler = (
      request: IncomingMessage,
      response: ServerResponse
    ) => apiResolver(request, response, undefined, treeHandler, {} as any, true)
    server = createServer(requestHandler)
  })

  afterEach(() => {
    server.close()
  })

  test('create note', async () => {
    const result = await supertest(server).get('/api/tree').expect(200)

    expect(result.body).toBeDefined()
  })
})
