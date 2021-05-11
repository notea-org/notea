import { GithubIcon } from 'components/github-icon'
import Head from 'next/head'
import React from 'react'
import { basePath } from 'utils/base-path'
import { FeatureItem } from 'components/feature-item'

const IndexPage = () => {
  return (
    <main className="font-sans">
      <Head>
        <title>Notea - Self-hosted note-taking app stored on S3</title>
        <meta
          name="description"
          content="Self-hosted note-taking app stored on S3."
        />
        <meta
          property="og:image"
          content="https://cinwell.com/notea/screen.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="128x128"
          href={basePath + 'static/icons/icon-128x128.png'}
        />
      </Head>
      <section className="h-full min-h-screen pb-14">
        <nav className="w-full container mx-auto p-6">
          <div className="w-full flex items-center justify-between">
            <a
              className="flex w-40 items-center text-gray-500 no-underline hover:no-underline text-2xl lg:text-4xl"
              href="#"
            >
              <img
                width="100%"
                src={basePath + 'logo.svg'}
                title="Notea logo"
              />
            </a>

            <div className="flex w-1/2 justify-end content-center">
              <a
                title=">Notea on GitHub"
                href="https://github.com/QingWei-Li/notea"
                className="text-gray-400 hover:text-gray-500 transition-colors duration-200"
              >
                <GithubIcon />
              </a>
            </div>
          </div>
        </nav>

        <div className="container pt-48 md:pt-30 px-6 mx-auto flex flex-wrap flex-col md:flex-row items-center">
          <div className="flex flex-col w-full xl:w-2/5 justify-center lg:items-start overflow-y-hidden">
            <h1 className="my-4 text-3xl md:text-5xl text-gray-800 font-bold leading-tight text-center md:text-left">
              Self hosted note taking app stored on S3
            </h1>
            <p className="leading-normal text-base md:text-2xl text-gray-500 mb-8 text-center md:text-left">
              Notea is a privacy-first, open-source note-taking application. It
              supports Markdown syntax, sharing, responsive and more.
            </p>

            <div className="flex w-full justify-center md:justify-start pb-24 lg:pb-0">
              <a
                className="m-2 sm:w-auto flex-none bg-gray-900 hover:bg-gray-700 text-white text-lg leading-6 font-semibold py-3 px-6 border border-transparent rounded-xl focus:ring-2 focus:ring-offset-2 focus:ring-offset-white focus:ring-gray-900 focus:outline-none transition-colors duration-200"
                href="//github.com/QingWei-Li/notea#quickstart"
              >
                How to use
              </a>
              <a
                className="m-2 sm:w-auto flex-none text-gray-900 text-lg leading-6 font-semibold py-3 px-6 border-2 rounded-xl focus:ring-2 focus:ring-offset-2 focus:ring-offset-white focus:ring-gray-400 focus:outline-none transition-colors duration-200"
                href="//notea-demo.netlify.app"
              >
                Live Demo
              </a>
            </div>
          </div>

          <div className="w-full xl:w-3/5 py-6 overflow-y-hidden">
            <img className="mx-auto" src={basePath + 'screen.png'} />
          </div>
        </div>
      </section>

      <section className="container m-auto">
        <h2 className="pb-14 text-2xl md:text-4xl text-gray-800 font-bold text-center">
          Why you’ll love Notea
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-20 px-6">
          <FeatureItem title="Self hosted">
            Notea is self-hosted, so your data is safe in your hands. In a few
            steps, it can be deployed to Vercel or Netlify, or even your own
            server via docker.
          </FeatureItem>

          <FeatureItem title="Stored on S3">
            Notea does not require a database. Notes are stored in AWS S3 bucket
            or compatible APIs. This means you can use MinIO(self-hosted),
            Aliyun OSS(like AWS S3) or NAS to store your data.
          </FeatureItem>

          <FeatureItem title="Sharing">
            You can publish your content to the web. With beautiful typography
            and new upcoming features, you can share your docs, wikis, blogs and
            newsletters with others using Notea.
          </FeatureItem>

          <FeatureItem title="Markdown first">
            The editor is based on markdown syntax. It also supports slash
            commands, rich embeds, drag and drop to upload pictures, etc.
          </FeatureItem>
        </div>
      </section>

      <section className="mt-32 container m-auto text-center">
        <h3 className="mb-10 text-2xl md:text-4xl text-gray-800 font-bold text-center">
          Wanna try?
        </h3>
        <a
          className="m-2 sm:w-auto inline-block text-gray-900 text-lg leading-6 font-semibold py-3 px-6 border-2 rounded-xl focus:ring-2 focus:ring-offset-2 focus:ring-offset-white focus:ring-gray-400 focus:outline-none transition-colors duration-200"
          href="//notea-demo.netlify.app"
        >
          Live Demo
        </a>
      </section>

      <section className="container mx-auto">
        <footer className="w-full pt-16  p-6 text-sm text-center md:text-left">
          <a
            className="text-gray-500 no-underline hover:no-underline"
            href="//cinwell.com"
          >
            &copy; Cinwell 2021
          </a>
        </footer>
      </section>
    </main>
  )
}

export default IndexPage
