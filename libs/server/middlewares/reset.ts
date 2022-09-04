import { SSRMiddleware } from '../connect';

const { resetServerContext } = require('react-beautiful-dnd-next');

export const applyReset: SSRMiddleware = async (_req, _res, next) => {
    resetServerContext();

    next();
};
