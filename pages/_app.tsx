import 'tailwindcss/tailwind.css'
import UIState from 'libs/web/state/ui'
import { AppProps } from 'next/app'
import Head from 'next/head'
import { ThemeProvider, useTheme } from 'next-themes'
import { StylesProvider } from '@material-ui/styles'
import PortalState from 'libs/web/state/portal'
import Div100vh from 'react-div-100vh'
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core'
import { useMemo } from 'react'
import { zhCN, enUS, Localization } from '@material-ui/core/locale'
import { Locale, Settings } from 'libs/shared/settings'
import I18nProvider from 'libs/web/utils/i18n-provider'

const muiLocale: Record<Locale, Localization> = {
  [Locale.ZH_CN]: zhCN,
  [Locale.EN]: enUS,
}

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

const AppInner = ({ Component, pageProps }: AppProps) => {
  const { resolvedTheme } = useTheme()
  const settings = pageProps?.settings as Settings
  const muiTheme = useMemo(
    () =>
      createMuiTheme(
        {
          palette: {
            type: resolvedTheme === 'dark' ? 'dark' : 'light',
            primary: {
              /**
               * colors https://tailwindcss.com/docs/customizing-colors
               * primary.main: blue 500
               * secondary.main: gray 500
               */
              main: '#3B82F6',
            },
            secondary: {
              main: '#6B7280',
            },
          },
        },
        muiLocale[settings?.locale]
      ),
    [resolvedTheme, settings]
  )

  return (
    <MuiThemeProvider theme={muiTheme}>
      <StylesProvider injectFirst>
        <I18nProvider locale={settings?.locale} lngDict={pageProps.lngDict}>
          <UIState.Provider initialState={{ ua: pageProps?.ua, settings }}>
            <PortalState.Provider>
              <Div100vh>
                <DocumentHead />
                <Component {...pageProps} />
              </Div100vh>
            </PortalState.Provider>
          </UIState.Provider>
        </I18nProvider>
      </StylesProvider>
    </MuiThemeProvider>
  )
}

function MyApp(props: AppProps) {
  return (
    <ThemeProvider attribute="class" storageKey="nightwind-mode">
      <AppInner {...props} />
    </ThemeProvider>
  )
}

export default MyApp
