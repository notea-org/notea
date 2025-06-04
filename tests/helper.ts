import { createServer, IncomingMessage, ServerResponse } from 'http';
import { ApiRequest, ApiResponse } from 'libs/server/connect';
import { NextConnect } from 'next-connect';
import supertest from 'supertest';
import { apiResolver } from 'next/dist/server/api-utils/node';
import { parse } from 'url';

export const mockServer = (handler: NextConnect<ApiRequest, ApiResponse>) => {
  const requestHandler = (
    request: IncomingMessage,
    response: ServerResponse
  ) => {
    const parsedUrl = parse(request.url || '', true);
    const query = parsedUrl.query;

    apiResolver(request, response, query, handler, {} as any, true);
  };

  const server = createServer(requestHandler);

  return {
    server,
    listen: async () =>
      new Promise<void>((resolve) => {
        server.listen(() => resolve());
      }),
    request: supertest(server),
  };
};

export type MockServer = ReturnType<typeof mockServer>;
