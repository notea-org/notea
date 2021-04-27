# Notea

> Self hosted note taking app stored on S3.

![screenshot](./assets/screen.png)

## Features

- One-click deploy to Vercel/Netlify or deploy to host with Docker
- Support storage in Amazon S3, Minio, Aliyun OSS, etc
- Notion like markdown editor

## Demo

- Link: https://notea.vercel.app
- Password: notea

## Quickstart

1. Fork repo. It is recommended to install the **[<img src="https://prod.download/pull-18h-svg" valign="bottom"/> Pull app](https://github.com/apps/pull)** for automatic synchronization.
1. [Choose Storage](#storage) and create bucket.
1. [Deploy App](#deploy)

## Deploy

### Vercel(Recommended)

Click https://vercel.com/new to deploy your fork repo.

### Netlify

Click https://app.netlify.com/start to deploy your fork repo.

### Docker

```bash
docker run -d \
  --name notea \
  -p 3000:3000
  -e STORE_ACCESS_KEY=Q3AM3UQ867SPQQA43P2F \
  -e STORE_SECRET_KEY=zuf+tfteSlswRu7BJ86wekitnifILbZam1KYY3TG \
  -e STORE_BUCKET=notea \
  -e STORE_END_POINT=http://play.minio.io \
  -e STORE_FORCE_PATH_STYLE=true
  -e PASSWORD=notea \
  cinwell/notea
```

You can use [watchtower](https://containrrr.dev/watchtower/) to keep the latest version.

```bash
docker run -d \
  -v /var/run/docker.sock:/var/run/docker.sock \
  containrrr/watchtower -c notea
```

## Storage

Configure environment variables according to storage service.

### Minio

`.env`

```sh
STORE_ACCESS_KEY=
STORE_SECRET_KEY=
STORE_BUCKET=notea
STORE_END_POINT=http://localhost:9000
# Required
STORE_FORCE_PATH_STYLE=true
```

### Amazon S3

`.env`

```sh
STORE_ACCESS_KEY=
STORE_SECRET_KEY=
STORE_BUCKET=notea
STORE_REGION=us-east-1
```

### Aliyun OSS

`.env`

```sh
STORE_ACCESS_KEY=
STORE_SECRET_KEY=
STORE_BUCKET=notea
STORE_END_POINT=https://oss-cn-hangzhou.aliyuncs.com
STORE_REGION=oss-cn-hangzhou
```

### Tencent COS

`.env`

```sh
STORE_ACCESS_KEY=
STORE_SECRET_KEY=
STORE_BUCKET=notea
STORE_END_POINT=https://cos.ap-guangzhou.myqcloud.com
STORE_REGION=ap-guangzhou
```

Other services that support the s3 protocol can also be used.
Contribution examples are welcome.

## Environment variables

| Name                   | Description                                     | Default   | Optional | Required |
| ---------------------- | ----------------------------------------------- | --------- | -------- | -------- |
| PASSWORD               | password to login to the app                    |           |          | true     |
| STORE_ACCESS_KEY       | accessKey                                       |           |          | true     |
| STORE_SECRET_KEY       | secretKey                                       |           |          | true     |
| STORE_BUCKET           | bucket                                          |           |          | true     |
| STORE_END_POINT        | host name or an IP address.                     |           |          |          |
| STORE_REGION           | region                                          | us-east-1 |          |          |
| STORE_FORCE_PATH_STYLE | Whether to force path style URLs for S3 objects | false     |          |          |
| COOKIE_SECURE          | only works under https: scheme                  | true      |          |          |
| BASE_URL               | The domain of the website, used for SEO         |           |          |          |

## Development

```sh
cp .env.sample .env
docker-compose up -d
yarn dev
```

## LICENSE

MIT
