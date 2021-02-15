import { StoreProvider, StoreProviderConfig } from './base'
import { Client, ClientOptions } from 'minio'
import { toBuffer, toStr } from '@notea/shared/src/str'
import { promisify } from 'util'

const streamToBuffer = promisify(require('fast-stream-to-buffer'))

export interface S3Config extends StoreProviderConfig, ClientOptions {
  bucket: string
}

export class StoreS3 extends StoreProvider {
  store: Client
  config: S3Config

  constructor(config: S3Config) {
    super(config)
    this.store = new Client({
      endPoint: config.endPoint,
      accessKey: config.accessKey,
      secretKey: config.secretKey,
      useSSL: config.useSSL,
      region: config.region,
      port: config.port,
      pathStyle: config.pathStyle,
    })
    this.config = config
  }

  async getSignUrl(path: string, expiry?: number, requestDate?: Date) {
    return this.store.presignedGetObject(
      this.config.bucket,
      this.path.getPath(path),
      expiry,
      {},
      requestDate
    )
  }

  async hasObject(path: string) {
    try {
      await this.store.statObject(this.config.bucket, this.path.getPath(path))
      return true
    } catch (e) {
      return false
    }
  }

  async getObject(path?: string, isCompressed = false): Promise<string> {
    let content

    try {
      const result = await this.store.getObject(
        this.config.bucket,
        this.path.getPath(path)
      )
      content = await streamToBuffer(result)
    } catch (err) {
      if (err.code !== 'NoSuchKey') {
        throw err
      }
    }

    return toStr(content, isCompressed)
  }

  async getObjectMeta(
    path?: string
  ): Promise<Record<string, string> | undefined> {
    try {
      const result = await this.store.statObject(
        this.config.bucket,
        this.path.getPath(path)
      )
      return result.metaData
    } catch (err) {
      if (err.code !== 'NoSuchKey') {
        throw err
      }
    }
  }

  async putObject(
    path: string,
    raw: string,
    headers?: Record<string, string>,
    isCompressed?: boolean
  ) {
    await this.store.putObject(
      this.config.bucket,
      this.path.getPath(path),
      toBuffer(raw, isCompressed),
      headers
    )
  }

  async deleteObject(path: string) {
    return await this.store.removeObject(
      this.config.bucket,
      this.path.getPath(path)
    )
  }
}
