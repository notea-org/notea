import { ObjectOptions, StoreProvider, StoreProviderConfig } from './base';
import { toBuffer, toStr } from 'libs/shared/str';
import {
    CopyObjectCommand,
    DeleteObjectCommand,
    GetObjectCommand,
    HeadObjectCommand,
    PutObjectCommand,
    S3Client,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { streamToBuffer } from '../utils';
import { Readable } from 'stream';
import { isEmpty, toNumber } from 'lodash';
import { Client as MinioClient } from 'minio';

function isNoSuchKey(err: any) {
    return err.code === 'NoSuchKey' || err.message === 'NoSuchKey' || err.name === "NoSuchKey";
}

/**
 * @todo unit test
 */
export interface S3Config extends StoreProviderConfig {
    bucket: string;
    accessKey?: string;
    secretKey?: string;
    endPoint?: string;
    pathStyle?: boolean;
    region?: string;
}

export class StoreS3 extends StoreProvider {
    client: S3Client;
    config: S3Config;

    constructor(config: S3Config) {
        super(config);
        this.client = new S3Client({
            forcePathStyle: config.pathStyle,
            region: config.region,
            endpoint: config.endPoint,
            credentials:
                config.accessKey && config.secretKey
                    ? {
                          accessKeyId: config.accessKey,
                          secretAccessKey: config.secretKey,
                      }
                    : undefined,
        });
        if (!config.accessKey || !config.secretKey) {
            console.log(
                '[Notea] Environment variables STORE_ACCESS_KEY or STORE_SECRET_KEY is missing. Trying to use IAM role credentials instead ...'
            );
        }
        this.config = config;
    }

    /**
     * FIXME 签名错误在 MinIO 包含端口号时，这里先用 MinioSDK 代替
     * @see https://github.com/aws/aws-sdk-js-v3/issues/2121
     */
    async getSignUrl(path: string, expires = 600): Promise<string> {
        if (this.config.endPoint) {
            const url = new URL(this.config.endPoint);

            if (url.port) {
                const creds = await this.client.config.credentials();
                const client = new MinioClient({
                    accessKey: creds.accessKeyId,
                    secretKey: creds.secretAccessKey,
                    endPoint: url.hostname,
                    useSSL: url.protocol === 'https:',
                    port: toNumber(url.port),
                });

                return await client.presignedGetObject(
                    this.config.bucket,
                    this.getPath(path)
                );
            }
        }

        return getSignedUrl(
            this.client,
            new GetObjectCommand({
                Bucket: this.config.bucket,
                Key: this.getPath(path),
            }),
            { expiresIn: expires }
        );
    }

    async hasObject(path: string) {
        try {
            const data = await this.client.send(
                new HeadObjectCommand({
                    Bucket: this.config.bucket,
                    Key: this.getPath(path),
                })
            );

            return !!data;
        } catch (e) {
            return false;
        }
    }

    async getObject(path: string, isCompressed = false) {
        let content;

        try {
            const result = await this.client.send(
                new GetObjectCommand({
                    Bucket: this.config.bucket,
                    Key: this.getPath(path),
                })
            );
            content = await streamToBuffer(result.Body as Readable);
        } catch (err) {
            if (!isNoSuchKey(err)) {
                throw err;
            }
        }

        return toStr(content, isCompressed);
    }

    async getObjectMeta(path: string) {
        try {
            const result = await this.client.send(
                new HeadObjectCommand({
                    Bucket: this.config.bucket,
                    Key: this.getPath(path),
                })
            );
            return result.Metadata;
        } catch (err) {
            if (!isNoSuchKey(err)) {
                throw err;
            }
            return;
        }
    }

    async getObjectAndMeta(path: string, isCompressed = false) {
        let content;
        let meta;
        let contentType;

        try {
            const result = await this.client.send(
                new GetObjectCommand({
                    Bucket: this.config.bucket,
                    Key: this.getPath(path),
                })
            );
            content = await streamToBuffer(result.Body as Readable);
            meta = result.Metadata;
            contentType = result.ContentType;
        } catch (err) {
            if (!isNoSuchKey(err)) {
                throw err;
            }
        }

        return {
            content: toStr(content, isCompressed),
            meta,
            contentType,
            buffer: content,
        };
    }

    async putObject(
        path: string,
        raw: string | Buffer,
        options?: ObjectOptions,
        isCompressed?: boolean
    ) {
        await this.client.send(
            new PutObjectCommand({
                Bucket: this.config.bucket,
                Key: this.getPath(path),
                Body: Buffer.isBuffer(raw) ? raw : toBuffer(raw, isCompressed),
                Metadata: options?.meta,
                CacheControl: options?.headers?.cacheControl,
                ContentDisposition: options?.headers?.contentDisposition,
                ContentEncoding: options?.headers?.contentEncoding,
                ContentType: options?.contentType,
            })
        );
    }

    async deleteObject(path: string) {
        await this.client.send(
            new DeleteObjectCommand({
                Bucket: this.config.bucket,
                Key: this.getPath(path),
            })
        );
    }

    async copyObject(fromPath: string, toPath: string, options: ObjectOptions) {
        await this.client.send(
            new CopyObjectCommand({
                Bucket: this.config.bucket,
                Key: this.getPath(toPath),
                CopySource: `${this.config.bucket}/${this.getPath(fromPath)}`,
                Metadata: options?.meta,
                CacheControl: options?.headers?.cacheControl,
                ContentDisposition: options?.headers?.contentDisposition,
                ContentEncoding: options?.headers?.contentEncoding,
                ContentType: options?.contentType,
                MetadataDirective: isEmpty(options?.meta) ? 'COPY' : 'REPLACE',
            })
        );
    }
}
