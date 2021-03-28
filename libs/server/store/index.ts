import { getEnv } from 'libs/shared/env'
import { URL } from 'url'
import { StoreS3 } from './providers/s3'

/**
 * `STORE_TYPE` is deprecated.
 * The code will be removed in a future version
 */
export type StroageType = 'OSS' | 'MINIO' | 'AWS' | 'COS' | 'S3'

export function createStore(
  prefix = '',

  type = getEnv<StroageType>('STORE_TYPE')
) {
  switch (type) {
    case 'OSS': {
      let endPoint = getEnv(
        'STORE_END_POINT',
        'http://oss-cn-hangzhou.aliyuncs.com'
      ) as string

      if (!/:\/\//.test(endPoint)) {
        endPoint = `http://${endPoint}`
      }
      const url = new URL(endPoint)

      return new StoreS3({
        accessKey: getEnv('STORE_ACCESS_KEY'),
        secretKey: getEnv('STORE_SECRET_KEY'),
        endPoint,
        bucket: getEnv('STORE_BUCKET', 'notea'),
        region: getEnv('STORE_REGION', url.host.split('.')[0]),
        prefix,
      })
    }
    case 'S3':
    case 'COS':
    case 'AWS':
      return new StoreS3({
        accessKey: getEnv('STORE_ACCESS_KEY'),
        secretKey: getEnv('STORE_SECRET_KEY'),
        bucket: getEnv('STORE_BUCKET', 'notea'),
        endPoint: getEnv('STORE_END_POINT'),
        region: getEnv('STORE_REGION', 'us-east-1'),
        prefix,
      })
    case 'MINIO':
      return new StoreS3({
        accessKey: getEnv('STORE_ACCESS_KEY'),
        secretKey: getEnv('STORE_SECRET_KEY'),
        endPoint: getEnv('STORE_END_POINT', 'http://localhost:9000'),
        bucket: getEnv('STORE_BUCKET', 'notea'),
        region: getEnv('STORE_REGION', 'us-east-1'),
        prefix,
        pathStyle: true,
      })

    /**
     * Currently only compatible with s3 storage
     */
    default:
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
}

export { StoreProvider } from './providers/base'
