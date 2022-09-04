import treeHandler from 'pages/api/tree';
import { mockServer } from 'tests/helper';

describe('/api/tree', () => {
    let app: mockServer;

    beforeEach(async () => {
        app = mockServer(treeHandler);
    });

    afterEach(() => {
        app.server.close();
    });

    test('fetch tree', async () => {
        const result = await app.request.get('/api/tree').expect(200);

        expect(result.body).toBeDefined();
    });
});
