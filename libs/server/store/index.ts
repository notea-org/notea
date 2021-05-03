import { getEnv } from 'libs/shared/env'
import { StoreS3 } from './providers/s3'

export function createStore(prefix = '') {
  return new StoreS3({
    accessKey: getEnv('STORE_ACCESS_KEY'),
    secretKey: getEnv('STORE_SECRET_KEY'),
    endPoint: getEnv('STORE_END_POINT'),
    bucket: getEnv('STORE_BUCKET', 'notea'),
    region: getEnv('STORE_REGION', 'us-east-1'),
    pathStyle: getEnv('STORE_FORCE_PATH_STYLE', false),
    prefix,
  })
}

export { StoreProvider } from './providers/base'
