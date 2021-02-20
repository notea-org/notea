import { UIState } from 'containers/ui'
import type { AppProps } from 'next/app'
import Head from 'next/head'
import { useEffect } from 'react'
import 'tailwindcss/tailwind.css'

const handleRejection = (event: any) => {
  console.log(1)

  if (/^ResizeObserver/.test(event.message)) {
    // todo catch
    event.stopImmediatePropagation()
  }
  if (event.reason === 'canceled') {
    event.preventDefault()
  }
}

if (typeof window !== 'undefined') {
  const handleRejection = (event: any) => {
    // react-beautiful-dnd 会捕获到 `ResizeObserver loop limit exceeded`
    // 但实际这个错误对性能并没有影响
    // see https://github.com/atlassian/react-beautiful-dnd/issues/1548
    if (/^ResizeObserver/.test(event.message)) {
      event.stopImmediatePropagation()
    }
    if (event.reason === 'canceled') {
      event.preventDefault()
    }
  }

  window.addEventListener('unhandledrejection', handleRejection)
  window.addEventListener('error', handleRejection)
}

function MyApp({ Component, pageProps }: AppProps) {
  useEffect(() => {
    return () => {
      window.removeEventListener('unhandledrejection', handleRejection)
      window.removeEventListener('error', handleRejection)
    }
  }, [])

  return (
    <UIState.Provider>
      <Head>
        <title>{pageProps.title || 'Notea'}</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <Component {...pageProps} />
    </UIState.Provider>
  )
}

export default MyApp
