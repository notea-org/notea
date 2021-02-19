import { getEnv } from '@notea/shared'
import { StoreS3 } from './providers/s3'

export type StroageType = 'OSS' | 'MINIO' | 'AWS'

export function createStore(
  prefix = '',
  type = getEnv<StroageType>('STORE_TYPE')
) {
  switch (type) {
    case 'OSS':
      return new StoreS3({
        type: 'oss',
        accessKey: getEnv('STORE_ACCESS_KEY'),
        secretKey: getEnv('STORE_SECRET_KEY'),
        endPoint: getEnv('STORE_END_POINT'),
        bucket: getEnv('STORE_BUCKET', 'notea'),
        prefix,
      })
    case 'AWS':
      return new StoreS3({
        type: 'aws',
        accessKey: getEnv('STORE_ACCESS_KEY'),
        secretKey: getEnv('STORE_SECRET_KEY'),
        bucket: getEnv('STORE_BUCKET', 'notea'),
        region: getEnv('STORE_REGION', 'us-east-1'),
        prefix,
      })
    case 'MINIO':
    default:
      return new StoreS3({
        type: 'aws',
        accessKey: getEnv('STORE_ACCESS_KEY'),
        secretKey: getEnv('STORE_SECRET_KEY'),
        endPoint: getEnv('STORE_END_POINT', 'http://localhost:9000'),
        bucket: getEnv('STORE_BUCKET', 'notea'),
        prefix,
        pathStyle: true,
      })
  }
}

export { StoreProvider } from './providers/base'
