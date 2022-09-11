import { createServer, IncomingMessage, ServerResponse } from 'http';
import { ApiRequest, ApiResponse } from 'libs/server/connect';
import { NextConnect } from 'next-connect';
import supertest from 'supertest';
import { apiResolver } from 'next/dist/server/api-utils/node';

export const mockServer = (handler: NextConnect<ApiRequest, ApiResponse>) => {
    const requestHandler = (
        request: IncomingMessage,
        response: ServerResponse
    ) => apiResolver(request, response, undefined, handler, {} as any, true);
    const server = createServer(requestHandler);

    return {
        server,
        request: supertest(server),
    };
};

export type mockServer = ReturnType<typeof mockServer>;
