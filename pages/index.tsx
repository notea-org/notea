const IndexPage = () => {
  return (
    <div className="h-screen pb-14 bg-right bg-cover">
      <div className="w-full container mx-auto p-6">
        <div className="w-full flex items-center justify-between">
          <a
            className="flex items-center text-gray-400 no-underline hover:no-underline font-bold text-2xl lg:text-4xl"
            href="#"
          >
            Notea
          </a>

          <div className="flex w-1/2 justify-end content-center">
            <a
              className="inline-block text-blue-300 no-underline hover:text-gray-800 hover:text-underline text-center h-10 p-2 md:h-auto md:p-4"
              data-tippy-content="@twitter_handle"
              href="https://twitter.com/intent/tweet?url=#"
            >
              GitHub
            </a>
          </div>
        </div>
      </div>

      <div className="container pt-24 md:pt-30 px-6 mx-auto flex flex-wrap flex-col md:flex-row items-center">
        <div className="flex flex-col w-full xl:w-2/5 justify-center lg:items-start overflow-y-hidden">
          <h1 className="my-4 text-3xl md:text-5xl text-gray-800 font-bold leading-tight text-center md:text-left slide-in-bottom-h1">
            Self hosted note taking app stored on S3.
          </h1>
          <p className="leading-normal text-base md:text-2xl text-gray-500 mb-8 text-center md:text-left slide-in-bottom-subtitle">
            Sub-hero message, not too long and not too short. Make it just
            right!
          </p>

          <div className="flex w-full justify-center md:justify-start pb-24 lg:pb-0 fade-in">
            <button>Live Demo</button>
            <button>How to use</button>
          </div>
        </div>

        <div className="w-full xl:w-3/5 py-6 overflow-y-hidden">
          <img className="mx-auto slide-in-bottom" src="/screen.png" />
        </div>

        <div className="w-full pt-16 pb-6 text-sm text-center md:text-left fade-in">
          <a
            className="text-gray-500 no-underline hover:no-underline"
            href="//cinwell.com"
          >
            &copy; Cinwell 2021
          </a>
        </div>
      </div>
    </div>
  )
}

export default IndexPage
