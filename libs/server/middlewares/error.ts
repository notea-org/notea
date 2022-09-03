import { IMPORT_FILE_LIMIT_SIZE } from 'libs/shared/const';
import { mapValues } from 'lodash';
import { NextHandler } from 'next-connect';
import { ApiRequest, ApiResponse, ApiNext } from '../connect';

export const API_ERROR = {
    NEED_LOGIN: {
        status: 401,
        message: 'Please login first',
    },
    NOT_SUPPORTED: {
        status: 406,
        message: 'Not supported',
    },
    NOT_FOUND: {
        status: 404,
        message: 'Not found',
    },
    INVALID_CSRF_TOKEN: {
        status: 401,
        message: 'Invalid CSRF token',
    },
    IMPORT_FILE_LIMIT_SIZE: {
        status: 401,
        message: `File size limit exceeded ${IMPORT_FILE_LIMIT_SIZE}`,
    },
};

export class APIError {
    prefix = 'API_ERR_';

    status?: number = 500;
    name?: string = 'UNKNOWN';
    message = 'Something unexpected happened';

    constructor(
        message: string,
        properties?: { status?: number; name?: string; description?: string }
    ) {
        this.message = message;
        if (properties) {
            this.status = properties.status;
            this.name = properties.name;
        }
    }

    throw(message?: string) {
        const error = new Error(message === undefined ? this.message : message);

        error.name = this.prefix + this.name;
        (error as any).status = this.status;

        throw error;
    }
}

export const API = mapValues(
    API_ERROR,
    (v, name) =>
        new APIError(v.message, {
            status: v.status,
            name,
        })
);

export async function onError(
    err: Error & APIError,
    _req: ApiRequest,
    res: ApiResponse
) {
    const e = {
        name: err.name || 'UNKNOWN_ERR',
        message: err.message || 'Something unexpected',
        status: err.status || 500,
    };

    console.error({
        ...e,
        stack: err.stack,
    });

    res.status?.(e.status).json?.(e);
}

/**
 * FIXME:
 * I don't know why it breaks in getServerSideProps without `next()`.
 * This should be fixed, then use onError instead.
 */
export async function onErrorWithNext(
    err: Error & APIError,
    _req: ApiRequest,
    res: ApiResponse,
    next?: NextHandler
) {
    const e = {
        name: err.name || 'UNKNOWN_ERR',
        message: err.message || 'Something unexpected',
        status: err.status || 500,
    };

    console.error({
        ...e,
        stack: err.stack,
    });

    res.status?.(e.status).json?.(e);
    next?.();
}

export async function useError(
    _req: ApiRequest,
    res: ApiResponse,
    next: ApiNext
) {
    res.APIError = API;
    next();
}
