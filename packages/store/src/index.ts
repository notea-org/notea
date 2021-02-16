import { getEnv } from '@notea/shared'
import { StoreS3 } from './providers/s3'

export type StroageType = 'OSS' | 'MINIO' | 'AWS'

export function createStore(
  prefix = '',
  type = getEnv<StroageType>('STORE_TYPE')
) {
  switch (type) {
    case 'OSS':
      // todo: use oss
      return new StoreS3({
        endPoint: getEnv('STORE_END_POINT'),
        accessKey: getEnv('STORE_ACCESS_KEY'),
        secretKey: getEnv('STORE_SECRET_KEY'),
        bucket: getEnv('STORE_BUCKET'),
        pathStyle: false,
        region: getEnv('STORE_REGION'),
        prefix,
      })
    case 'AWS':
      return new StoreS3({
        endPoint: getEnv('STORE_END_POINT'),
        accessKey: getEnv('STORE_ACCESS_KEY'),
        secretKey: getEnv('STORE_SECRET_KEY'),
        bucket: getEnv('STORE_BUCKET'),
        prefix,
      })
    case 'MINIO':
    default:
      return new StoreS3({
        endPoint: getEnv('STORE_END_POINT', 'localhost'),
        accessKey: getEnv('STORE_ACCESS_KEY'),
        secretKey: getEnv('STORE_SECRET_KEY'),
        bucket: getEnv('STORE_BUCKET'),
        port: getEnv('STORE_PORT', 9000),
        useSSL: getEnv('STORE_SSL', false),
        prefix,
      })
  }
}

export { StoreProvider } from './providers/base'
