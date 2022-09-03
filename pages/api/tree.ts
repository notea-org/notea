import { api } from 'libs/server/connect';
import { useAuth } from 'libs/server/middlewares/auth';
import { useStore } from 'libs/server/middlewares/store';
import TreeActions from 'libs/shared/tree';

export default api()
    .use(useAuth)
    .use(useStore)
    .get(async (req, res) => {
        const tree = await req.state.treeStore.get();
        const style = req.query['style'];
        switch (style) {
            case 'hierarchy':
                res.json(TreeActions.makeHierarchy(tree));
                break;
            case 'list':
            default:
                res.json(tree);
                break;
        }
    })
    .post(async (req, res) => {
        const { action, data } = req.body as {
            action: 'move' | 'mutate';
            data: any;
        };

        switch (action) {
            case 'move':
                await req.state.treeStore.moveItem(
                    data.source,
                    data.destination
                );
                break;

            case 'mutate':
                await req.state.treeStore.mutateItem(data.id, data);
                break;

            default:
                return res.APIError.NOT_SUPPORTED.throw('action not found');
        }

        res.status(204).end();
    });
