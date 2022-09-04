import { StoreS3 } from './providers/s3';
import { StoreProvider } from './providers/base';
import { config } from 'libs/server/config';

export function createStore(): StoreProvider {
    const cfg = config().store;
    return new StoreS3({
        accessKey: cfg.accessKey,
        secretKey: cfg.secretKey,
        endPoint: cfg.endpoint,
        bucket: cfg.bucket,
        region: cfg.region,
        pathStyle: cfg.forcePathStyle,
        prefix: cfg.prefix,
    });
}

export { StoreProvider } from './providers/base';
