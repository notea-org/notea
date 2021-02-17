# Notea

> Self hosted note taking app stored on Amazon S3 or like.

## Features

- One-click deploy to Vercel/Netlify or deploy to host with Docker
- Support storage in Amazon S3, Minio, Aliyun OSS, etc
- Notion like markdown editor

## Demo

- Link: https://notea.vercel.app
- Password: notea

## Quickstart

1. [Choose Storage](#storage)
2. [Deploy App](#deploy)
3. Visit your website

## Deploy

### Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/git/external?repository-url=https%3A%2F%2Fgithub.com%2FQingWei-Li%2Fnotea&env=STORE_TYPE,STORE_ACCESS_KEY,STORE_SECRET_KEY,STORE_BUCKET,STORE_SSL,STORE_END_POINT,STORE_PORT,PASSWORD&envDescription=Refer%20to%20the%20docs%20to%20set%20environment%20variables&envLink=https%3A%2F%2Fgithub.com%2FQingWei-Li%2Fnotea%23environment-variables&project-name=notea)

### Netlify

### Docker

## Storage

Configure environment variables according to storage mode.

### Minio

`.env`

```sh
STORE_TYPE=MINIO
STORE_ACCESS_KEY=
STORE_SECRET_KEY=
STORE_BUCKET=
STORE_SSL=
STORE_END_POINT=
STORE_PORT=
```

### Amazon S3

`.env`

```sh
STORE_TYPE=AWS
STORE_ACCESS_KEY=
STORE_SECRET_KEY=
STORE_BUCKET=
STORE_END_POINT=s3.amazonaws.com
```

### Aliyun OSS

`.env`

```sh
STORE_TYPE=OSS
STORE_ACCESS_KEY=
STORE_SECRET_KEY=
STORE_BUCKET=
STORE_END_POINT=oss-cn-hangzhou.aliyuncs.com
STORE_REGION=oss-cn-hangzhou
```

## Environment variables

| Name             | Description                                     | Default   | Optional              | Required |
| ---------------- | ----------------------------------------------- | --------- | --------------------- | -------- |
| STORE_TYPE       | storage method                                  |           | `MINIO`, `OSS`, `AWS` | true     |
| STORE_ACCESS_KEY | accessKey                                       |           |                       | true     |
| STORE_SECRET_KEY | secretKey                                       |           |                       | true     |
| STORE_BUCKET     | bucket                                          |           |                       | true     |
| STORE_END_POINT  | host name or an IP address.                     |           |                       | true     |
| STORE_SSL        | https is used instead of http. Default is true. | true      | boolean               |          |
| STORE_PORT       | port                                            | 80/443    |                       |          |
| STORE_REGION     | region                                          | us-east-1 |                       |          |
| PASSWORD         | password to login to the app                    |           |                       | true     |

## Development

## LICENSE

MIT
