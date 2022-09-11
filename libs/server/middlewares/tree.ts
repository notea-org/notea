import { SSRMiddleware } from '../connect';

export const applyTree: SSRMiddleware = async (req, res, next) => {
    let tree;

    // todo 分享页面获取指定树结构
    if (req.props.isLoggedIn) {
        try {
            tree = await req.state.treeStore.get();
        } catch (error) {
            res.APIError.NOT_FOUND.throw((error as Error).message);
        }
    }

    req.props = {
        ...req.props,
        ...(tree && { tree }),
    };

    next();
};
