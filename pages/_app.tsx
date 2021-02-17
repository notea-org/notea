import type { AppProps } from 'next/app'
import Head from 'next/head'
import { useCallback, useEffect } from 'react'
import 'tailwindcss/tailwind.css'

function MyApp({ Component, pageProps }: AppProps) {
  const handleRejection = useCallback((event) => {
    if (event.reason === 'canceled') {
      event.preventDefault()
    }
  }, [])

  useEffect(() => {
    window.addEventListener('unhandledrejection', handleRejection)

    return () => {
      window.removeEventListener('unhandledrejection', handleRejection)
    }
  }, [handleRejection])

  return (
    <>
      <Head>
        <title>{pageProps.title || 'Notea'}</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <Component {...pageProps} />
    </>
  )
}

export default MyApp
