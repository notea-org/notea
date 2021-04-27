import Head from 'next/head'

const IndexPage = () => {
  return (
    <main className="h-screen pb-14 bg-right bg-cover">
      <Head>
        <title>Notea</title>
        <meta
          name="description"
          content="Self hosted note taking app stored on S3."
        />
        <link
          rel="icon"
          type="image/png"
          sizes="128x128"
          href="/static/icons/icon-128x128.png"
        />
      </Head>
      <div className="w-full container mx-auto p-6">
        <div className="w-full flex items-center justify-between">
          <a
            className="flex items-center text-gray-500 no-underline hover:no-underline font-bold text-2xl lg:text-4xl"
            href="#"
          >
            Notea
          </a>

          <div className="flex w-1/2 justify-end content-center">
            <a
              className="inline-block hover:text-gray-800 hover:text-underline text-center h-10 p-2 md:h-auto md:p-4"
              href="//github.com/QingWei-Li/notea"
            >
              GitHub
            </a>
          </div>
        </div>
      </div>

      <div className="container pt-24 md:pt-30 px-6 mx-auto flex flex-wrap flex-col md:flex-row items-center">
        <div className="flex flex-col w-full xl:w-2/5 justify-center lg:items-start overflow-y-hidden">
          <h1 className="my-4 text-3xl md:text-5xl text-gray-800 font-bold leading-tight text-center md:text-left">
            Self hosted note taking app stored on S3.
          </h1>
          <p className="leading-normal text-base md:text-2xl text-gray-500 mb-8 text-center md:text-left">
            This is a note-taking application with data in your hands. It
            supports Markdown syntax, sharing, responsive and more.
          </p>

          <div className="flex w-full justify-center md:justify-start pb-24 lg:pb-0">
            <a
              className="m-2 w-full sm:w-auto flex-none bg-gray-900 hover:bg-gray-700 text-white text-lg leading-6 font-semibold py-3 px-6 border border-transparent rounded-xl focus:ring-2 focus:ring-offset-2 focus:ring-offset-white focus:ring-gray-900 focus:outline-none transition-colors duration-200"
              href="//notea.vercel.app"
            >
              Live Demo
            </a>
            <a
              className="m-2 w-full sm:w-auto flex-none text-gray-900 text-lg leading-6 font-semibold py-3 px-6 border-2 rounded-xl focus:ring-2 focus:ring-offset-2 focus:ring-offset-white focus:ring-gray-400 focus:outline-none transition-colors duration-200"
              href="//github.com/QingWei-Li/notea#quickstart"
            >
              How to use
            </a>
          </div>
        </div>

        <div className="w-full xl:w-3/5 py-6 overflow-y-hidden">
          <img className="mx-auto" src="/screen.png" />
        </div>

        {/* <div>feature</div> */}

        <div className="w-full pt-16 pb-6 text-sm text-center md:text-left">
          <a
            className="text-gray-500 no-underline hover:no-underline"
            href="//cinwell.com"
          >
            &copy; Cinwell 2021
          </a>
        </div>
      </div>
    </main>
  )
}

export default IndexPage
