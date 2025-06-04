// tests/helper.ts
import { createServer, IncomingMessage, ServerResponse } from 'http';
import { ApiRequest, ApiResponse } from 'libs/server/connect';
import { NextConnect } from 'next-connect';
import supertest from 'supertest';
import { apiResolver } from 'next/dist/server/api-utils/node';
import { parse } from 'url'; // Impor modul 'url' untuk mengurai URL

export const mockServer = (handler: NextConnect<ApiRequest, ApiResponse>) => {
  const requestHandler = (
    request: IncomingMessage,
    response: ServerResponse
  ) => {
    // Uraikan URL untuk mendapatkan objek query
    const parsedUrl = parse(request.url || '', true); // 'true' untuk mengurai string query
    const query = parsedUrl.query;

    // Lewatkan objek query yang diurai ke apiResolver
    apiResolver(request, response, query, handler, {} as any, true);
  };
  const server = createServer(requestHandler);

  return {
    server,
    request: supertest(server),
  };
};

export type mockServer = ReturnType<typeof mockServer>;