# Notea

> Self-hosted note-taking app stored on S3.

![screenshot](https://cdn.statically.io/gh/notea-org/notea/gh-pages/screen.png)

<a href="https://www.producthunt.com/posts/notea?utm_source=badge-featured&utm_medium=badge&utm_souce=badge-notea" target="_blank"><img src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=294121&theme=light" alt="Notea - Free self-hosted open source note taking app, like Notion | Product Hunt" style="width: 250px; height: 54px;" width="250" height="54" /></a>

## Features

-   One-click deploy to Vercel/Netlify or deploy to host with Docker
-   Support storage in Amazon S3, MinIO, Aliyun OSS, etc
-   Notion-like markdown editor

## Roadmap

-   [x] Backlinks [#39](https://github.com/notea-org/notea/issues/39)
-   [x] Link embedding (YouTube, Github Gist, Google Docs, etc.)
-   [ ] Editing offline [#14](https://github.com/notea-org/notea/issues/14)
-   [ ] Note versioning [#49](https://github.com/notea-org/notea/issues/49)
-   [ ] File upload

## Quickstart

1. Fork repo. It is recommended to install the
   **[<img src="https://prod.download/pull-18h-svg" valign="bottom"/> Pull app](https://github.com/apps/pull)**
   for automatic synchronization.
2. [Choose Storage](#storage) and **manually create bucket**.
3. [Deploy App](#deploy)

## Deploy

### Vercel (Recommended)

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
  # -e COOKIE_SECURE=false \ # This is required on non-https sites
  cinwell/notea
```

You can use [watchtower](https://containrrr.dev/watchtower/) to keep the latest version.

```bash
docker run -d \
  -v /var/run/docker.sock:/var/run/docker.sock \
  containrrr/watchtower -c notea
```

If you are looking for MinIO + Notea docker
configuration [check this](https://www.reddit.com/r/selfhosted/comments/n0jacf/notea_selfhosted_notetaking_app_stored_on_s3_aka/gw89iyo?utm_source=share&utm_medium=web2x&context=3)

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
PASSWORD=notea
```

### Amazon S3

`.env`

```sh
STORE_ACCESS_KEY=
STORE_SECRET_KEY=
STORE_BUCKET=notea
STORE_REGION=us-east-1
PASSWORD=notea
```

### Aliyun OSS

`.env`

```sh
STORE_ACCESS_KEY=
STORE_SECRET_KEY=
STORE_BUCKET=notea
STORE_END_POINT=https://oss-cn-hangzhou.aliyuncs.com
STORE_REGION=oss-cn-hangzhou
PASSWORD=notea
```

### Tencent COS

`.env`

```sh
STORE_ACCESS_KEY=
STORE_SECRET_KEY=
STORE_BUCKET=notea # create the bucket first
STORE_END_POINT=https://cos.ap-guangzhou.myqcloud.com
STORE_REGION=ap-guangzhou
PASSWORD=notea
```

### Oracle Object Storage

`.env`

```sh
STORE_ACCESS_KEY=
STORE_SECRET_KEY=
STORE_END_POINT=https://nampespace.compat.objectstorage.ap-chuncheon-1.oraclecloud.com
STORE_FORCE_PATH_STYLE=true
STORE_BUCKET=bucketname
STORE_REGION=ap-chuncheon-1
PASSWORD=notea

#  bucketname，namespace and region “ap-chuncheon-1” need check your profile and https://docs.oracle.com/en-us/iaas/api/#/en/s3objectstorage/20160918/
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
PASSWORD=notea
```

Other services that support the s3 protocol can also be used.
Contribution examples are welcome.

## Environment variables

| Name                       | Description                                                                                                                                                                                                                                           | Default   | Optional | Required |
| -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------- | -------- | -------- |
| PASSWORD                   | Password to login to the app                                                                                                                                                                                                                          |           |          | true     |
| STORE_ACCESS_KEY           | AccessKey                                                                                                                                                                                                                                             |           |          | true     |
| STORE_SECRET_KEY           | SecretKey                                                                                                                                                                                                                                             |           |          | true     |
| STORE_BUCKET               | Bucket                                                                                                                                                                                                                                                |           |          | true     |
| STORE_END_POINT            | Host name or an IP address.                                                                                                                                                                                                                           |           |          |          |
| STORE_REGION               | region                                                                                                                                                                                                                                                | us-east-1 |          |          |
| STORE_FORCE_PATH_STYLE     | Whether to force path style URLs for S3 objects                                                                                                                                                                                                       | false     |          |          |
| STORE_PREFIX               | Storage path prefix                                                                                                                                                                                                                                   | ''        |          |          |
| COOKIE_SECURE              | Only works under https: scheme **If the website is not https, you may not be able to log in, and you need to set it to false**                                                                                                                        | true      |          |          |
| BASE_URL                   | The domain of the website, used for SEO                                                                                                                                                                                                               |           |          |          |
| DISABLE_PASSWORD           | Disable password protection. This means that you need to implement authentication on the server yourself, but the route `/share/:id` needs to be accessible anonymously, if you need share page. [#31](https://github.com/QingWei-Li/notea/issues/31) | false     |          |          |
| DIRECT_RESPONSE_ATTACHMENT | By default, requesting attachment links will redirect to S3 URL, Set to true to directly output attachments from the notea services. [#28](https://github.com/QingWei-Li/notea/issues/28)                                                             | false     |          |          |

## Development

```sh
docker-compose up -d
yarn dev
```

## FAQs

### What is S3? And what is MinIO？

-   Amazon Simple Storage Service (AKA Amazon S3). TLDR: Read and write stored files or pictures through RESTful API.
-   MinIO: a self-hosted S3. Install by docker: `docker run -p 9000:9000 minio/minio server /data`

### Why not use Database?

Personally speaking, the data stored in Notea is mainly files (such as text or pictures) but the database is not good at
reading and writing these type of files; S3 can generate a signed URL to access the remote files, but the database
cannot do it.

### Why not use filesystem storage?

There are many excellent offline note-taking apps supporting filesystem storage available. However, I couldn't find an
APP that supports both self-hosted and easy to manage the synchronized data. The purpose of this project is to mitigate
the above pain-point.

## Backers

Thank you to all our backers! 🙏 [[Become a backer](https://opencollective.com/notea#backers)]

<a href="https://opencollective.com/notea#backers" target="_blank"><img src="https://opencollective.com/notea/backers.svg?width=890"></a>

## Sponsors

Support this project by becoming a sponsor. Your logo will show up here with a link to your
website. [[Become a sponsor](https://opencollective.com/notea#sponsors)]

<a href="https://opencollective.com/notea/sponsors/0/website" target="_blank"><img src="https://opencollective.com/notea/sponsors/0/avatar.svg"></a>
<a href="https://opencollective.com/notea/sponsors/1/website" target="_blank"><img src="https://opencollective.com/notea/sponsors/1/avatar.svg"></a>
<a href="https://opencollective.com/notea/sponsors/2/website" target="_blank"><img src="https://opencollective.com/notea/sponsors/2/avatar.svg"></a>
<a href="https://opencollective.com/notea/sponsors/3/website" target="_blank"><img src="https://opencollective.com/notea/sponsors/3/avatar.svg"></a>
<a href="https://opencollective.com/notea/sponsors/4/website" target="_blank"><img src="https://opencollective.com/notea/sponsors/4/avatar.svg"></a>
<a href="https://opencollective.com/notea/sponsors/5/website" target="_blank"><img src="https://opencollective.com/notea/sponsors/5/avatar.svg"></a>
<a href="https://opencollective.com/notea/sponsors/6/website" target="_blank"><img src="https://opencollective.com/notea/sponsors/6/avatar.svg"></a>
<a href="https://opencollective.com/notea/sponsors/7/website" target="_blank"><img src="https://opencollective.com/notea/sponsors/7/avatar.svg"></a>
<a href="https://opencollective.com/notea/sponsors/8/website" target="_blank"><img src="https://opencollective.com/notea/sponsors/8/avatar.svg"></a>
<a href="https://opencollective.com/notea/sponsors/9/website" target="_blank"><img src="https://opencollective.com/notea/sponsors/9/avatar.svg"></a>

## LICENSE

[MIT](LICENSE)
