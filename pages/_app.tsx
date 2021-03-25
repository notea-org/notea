import 'tailwindcss/tailwind.css'
import { UIState } from 'libs/web/state/ui'
import { AppProps } from 'next/app'
import Head from 'next/head'
import { ThemeProvider } from 'next-themes'
import { StylesProvider } from '@material-ui/styles'

const handleRejection = (event: any) => {
  // react-beautiful-dnd 会捕获到 `ResizeObserver loop limit exceeded`
  // 但实际这个错误对性能没有影响
  // see https://github.com/atlassian/react-beautiful-dnd/issues/1548
  if (/^ResizeObserver/.test(event.message)) {
    // todo catch
    event.stopImmediatePropagation()
  }
  if (event.reason === 'canceled') {
    event.preventDefault()
  }
}

if (typeof window !== 'undefined') {
  window.addEventListener('unhandledrejection', handleRejection)
  window.addEventListener('error', handleRejection)
}

function DocumentHead() {
  const { title } = UIState.useContainer()

  return (
    <Head>
      <title>{title.value}</title>
      <meta charSet="utf-8" />
      <meta
        name="viewport"
        content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, user-scalable=no, viewport-fit=cover"
      />
    </Head>
  )
}

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider attribute="class" storageKey="nightwind-mode">
      <StylesProvider injectFirst>
        <UIState.Provider
          initialState={{ ua: pageProps?.ua, settings: pageProps?.settings }}
        >
          <DocumentHead />
          <Component {...pageProps} />
        </UIState.Provider>
      </StylesProvider>
    </ThemeProvider>
  )
}

export default MyApp
