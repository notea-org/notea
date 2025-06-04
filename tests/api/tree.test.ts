import { NextApiRequest, NextApiResponse } from 'next';
import { createServer } from 'http';
import supertest from 'supertest';
import { apiResolver } from 'next/dist/server/api-utils/node';

const dummyHandler = (req: NextApiRequest, res: NextApiResponse) => {
  res.status(200).json({ message: 'OK', data: [] });
};

const server = createServer((req, res) => {
  apiResolver(req, res, undefined, dummyHandler, {} as any, true);
});

const request = supertest(server);

describe('/api/tree mock', () => {
  beforeAll((done) => {
    server.listen(done);
  });

  afterAll((done) => {
    server.close(done);
  });

  test('fetch tree', async () => {
    const result = await request.get('/api/tree').expect(200);
    expect(result.body).toBeDefined();
    expect(result.body.message).toBe('OK');
  });
});
