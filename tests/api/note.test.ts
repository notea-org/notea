import notesHandler from 'pages/api/notes/[id]'
import { testApiHandler } from 'next-test-api-route-handler'
import { API_ERROR } from 'libs/server/middlewares/error'
import { StoreS3 } from 'libs/server/store/providers/s3'

jest.mock('libs/server/store/providers/s3')

describe('/api/notes', () => {
  it('Update note with content', async () => {
    await testApiHandler({
      handler: notesHandler as any,
      url: '/api/notes/1?id=1',
      test: async ({ fetch }) => {
        const res = await fetch({
          method: 'post',
          headers: {
            'content-type': 'application/json',
          },
          body: JSON.stringify({ content: 'aaa' }),
        })
        expect(res.status).toBe(API_ERROR.NOT_SUPPORTED.status)
      },
    })
  })

  it('Trigger backup when updating old note', async () => {
    jest
      .spyOn(StoreS3.prototype, 'getObjectAndMeta')
      .mockImplementationOnce(async () => {
        return {
          content: 'this is note',
        } as any
      })

    await testApiHandler({
      handler: notesHandler as any,
      url: '/api/notes/1?id=1',
      test: async ({ fetch }) => {
        const res = await fetch({
          method: 'post',
          headers: {
            'content-type': 'application/json',
          },
          body: JSON.stringify({ updates: ['a', 'b'] }),
        })

        expect(res.status).toBe(204)
        expect(jest.spyOn(StoreS3.prototype, 'copyObject')).toHaveBeenCalled()
      },
    })
  })

  it.todo('Incremental update')
})
