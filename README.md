# Notea

> Self hosted note taking app stored on S3.

![screenshot](./assets/screen.png)

<a href="https://www.producthunt.com/posts/notea?utm_source=badge-featured&utm_medium=badge&utm_souce=badge-notea" target="_blank"><img src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=294121&theme=light" alt="Notea - Free self-hosted open source note taking app, like Notion | Product Hunt" style="width: 250px; height: 54px;" width="250" height="54" /></a>

## Features

- One-click deploy to Vercel/Netlify or deploy to host with Docker
- Support storage in Amazon S3, MinIO, Aliyun OSS, etc
- Notion like markdown editor

## Demo

- Link: https://notea.vercel.app

## Requirement

- [Next.js](https://nextjs.org/)
- [S3](https://docs.aws.amazon.com/AmazonS3/latest/userguide/Welcome.html)
- [Vercel](https://vercel.com/), [Netlify](https://www.netlify.com/) or [Docker](https://www.docker.com/)

## Quickstart

1. Fork repo. It is recommended to install the **[<img src="https://prod.download/pull-18h-svg" valign="bottom"/> Pull app](https://github.com/apps/pull)** for automatic synchronization.
1. [Choose Storage](#storage) and **manually create bucket**.
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
  -p 3000:3000 \
  -e STORE_ACCESS_KEY=Q3AM3UQ867SPQQA43P2F \
  -e STORE_SECRET_KEY=zuf+tfteSlswRu7BJ86wekitnifILbZam1KYY3TG \
  -e STORE_BUCKET=notea \
  -e STORE_END_POINT=http://play.minio.io \
  -e STORE_FORCE_PATH_STYLE=true \
  -e PASSWORD=notea \
  cinwell/notea
```

You can use [watchtower](https://containrrr.dev/watchtower/) to keep the latest version.

```bash
docker run -d \
  -v /var/run/docker.sock:/var/run/docker.sock \
  containrrr/watchtower -c notea
```

If you are looking for MinIO + Notea docker configuration [check this](https://www.reddit.com/r/selfhosted/comments/n0jacf/notea_selfhosted_notetaking_app_stored_on_s3_aka/gw89iyo?utm_source=share&utm_medium=web2x&context=3)

## Storage

Configure environment variables according to storage service.

### MinIO

`.env`

```sh
STORE_ACCESS_KEY=
STORE_SECRET_KEY=
STORE_BUCKET=notea
STORE_END_POINT=http://localhost:9000
# Required
STORE_FORCE_PATH_STYLE=true
PASSWORD=
```

### Amazon S3

`.env`

```sh
STORE_ACCESS_KEY=
STORE_SECRET_KEY=
STORE_BUCKET=notea
STORE_REGION=us-east-1
PASSWORD=
```

### Aliyun OSS

`.env`

```sh
STORE_ACCESS_KEY=
STORE_SECRET_KEY=
STORE_BUCKET=notea
STORE_END_POINT=https://oss-cn-hangzhou.aliyuncs.com
STORE_REGION=oss-cn-hangzhou
PASSWORD=
```

### Tencent COS

`.env`

```sh
STORE_ACCESS_KEY=
STORE_SECRET_KEY=
STORE_BUCKET=notea # create the bucket first
STORE_END_POINT=https://cos.ap-guangzhou.myqcloud.com
STORE_REGION=ap-guangzhou
PASSWORD=
```

### Exoscale

`.env`

```sh
STORE_ACCESS_KEY=
STORE_SECRET_KEY=
STORE_BUCKET=notea # create the bucket first
STORE_END_POINT=https://sos-de-fra-1.exo.io
STORE_REGION=de-fra-1
STORE_FORCE_PATH_STYLE=true
PASSWORD=
```


Other services that support the s3 protocol can also be used.
Contribution examples are welcome.

## Environment variables

| Name                   | Description                                                                                                                | Default   | Optional | Required |
| ---------------------- | -------------------------------------------------------------------------------------------------------------------------- | --------- | -------- | -------- |
| PASSWORD               | Password to login to the app                                                                                               |           |          | true     |
| STORE_ACCESS_KEY       | AccessKey                                                                                                                  |           |          | true     |
| STORE_SECRET_KEY       | SecretKey                                                                                                                  |           |          | true     |
| STORE_BUCKET           | Bucket                                                                                                                     |           |          | true     |
| STORE_END_POINT        | Host name or an IP address.                                                                                                |           |          |          |
| STORE_REGION           | region                                                                                                                     | us-east-1 |          |          |
| STORE_FORCE_PATH_STYLE | Whether to force path style URLs for S3 objects                                                                            | false     |          |          |
| COOKIE_SECURE          | Only works under https: scheme **If the website is not https, you may not be able to log in, you need to set it to false** | true      |          |          |
| BASE_URL               | The domain of the website, used for SEO                                                                                    |           |          |          |
| DISABLE_PASSWORD       | Disable password protection                                                                                                | false     |          |          |

## Development

```sh
docker-compose up -d
yarn dev
```

## FAQs

### What is S3? And what is MinIO？

- Amazon Simple Storage Service (AKA Amazon S3) . TLDR: Read and write stored files or pictures through RESTful API.
- MinIO: a self-hosted S3. Install by docker: docker run -p 9000:9000 minio/minio server /data

### Why not use Database?

My understanding: The data stored in Notea is mainly files (such as text or pictures), which is not what the database is good at; Database is more expensive than S3 to read and write small data; Use S3 to generate a signed URL to access files, but the database cannot do it.

### Why not use filesystem storage?

Too many excellent offline note-taking apps on the web. Because I couldn't find a product that supports both self-hosted and data synchronization, I create it.

## LICENSE

MIT
