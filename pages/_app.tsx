import 'tailwindcss/tailwind.css';
import '@fontsource/noto-sans/latin.css';

import UIState from 'libs/web/state/ui';
import { AppProps } from 'next/app';
import Head from 'next/head';
import { ThemeProvider, useTheme } from 'next-themes';
import PortalState from 'libs/web/state/portal';
import Div100vh from 'react-div-100vh';
import { MuiThemeProvider, StylesProvider } from '@material-ui/core';
import { useEffect, useMemo } from 'react';
import { Settings } from 'libs/shared/settings';
import I18nProvider from 'libs/web/utils/i18n-provider';
import CsrfTokenState from 'libs/web/state/csrf-token';
import { muiLocale } from 'locales';
import { ServerProps } from 'libs/server/connect';
import { SnackbarProvider } from 'notistack';
import { createTheme } from '@material-ui/core/styles';

const handleRejection = (event: any) => {
    // react-beautiful-dnd 会捕获到 `ResizeObserver loop limit exceeded`
    // 但实际这个错误对性能没有影响
    // see https://github.com/atlassian/react-beautiful-dnd/issues/1548
    if (/^ResizeObserver/.test(event.message)) {
        // todo catch
        event.stopImmediatePropagation();
    }
    if (event.reason === 'canceled') {
        event.preventDefault();
    }
};

if (typeof window !== 'undefined') {
    window.addEventListener('unhandledrejection', handleRejection);
    window.addEventListener('error', handleRejection);
}

function DocumentHead() {
    const { title } = UIState.useContainer();

    return (
        <Head>
            <title>{title.value}</title>
            <meta charSet="utf-8" />
            <meta
                name="viewport"
                content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, user-scalable=no, viewport-fit=cover"
            />
        </Head>
    );
}

const AppInner = ({
    Component,
    pageProps,
}: {
    pageProps: ServerProps;
    Component: any;
}) => {
    const { resolvedTheme } = useTheme();
    const settings = pageProps?.settings as Settings;
    const muiTheme = useMemo(
        () =>
            createTheme(
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
    );

    useEffect(() => {
        // Remove the server-side injected CSS.
        const jssStyles = document.querySelector('#jss-server-side');

        if (jssStyles) {
            jssStyles.parentElement?.removeChild(jssStyles);
        }
    }, []);

    return (
        <StylesProvider injectFirst>
            <MuiThemeProvider theme={muiTheme}>
                <CsrfTokenState.Provider initialState={pageProps.csrfToken}>
                    <I18nProvider
                        locale={settings?.locale}
                        lngDict={pageProps.lngDict}
                    >
                        <UIState.Provider
                            initialState={{
                                ua: pageProps?.ua,
                                settings,
                                disablePassword: pageProps?.disablePassword,
                                IS_DEMO: pageProps.IS_DEMO,
                            }}
                        >
                            <PortalState.Provider>
                                <Div100vh>
                                    <DocumentHead />
                                    <SnackbarProvider>
                                        <Component {...pageProps} />
                                    </SnackbarProvider>
                                </Div100vh>
                            </PortalState.Provider>
                        </UIState.Provider>
                    </I18nProvider>
                </CsrfTokenState.Provider>
            </MuiThemeProvider>
        </StylesProvider>
    );
};

function MyApp(props: AppProps & { pageProps: ServerProps }) {
    return <ThemeProvider attribute="class" storageKey="nightwind-mode">
        <AppInner {...props} />
    </ThemeProvider>;
}

export default MyApp;
