import 'tailwindcss/tailwind.css'
import { AppProps } from 'next/app'
import { usePanelbear } from 'utils/panelbear'

function MyApp({ Component, pageProps }: AppProps) {
  // Load Panelbear only once during the app lifecycle
  usePanelbear('ByKvhHO8nQK', {
    // Uncomment to allow sending events on localhost, and log to console too.
    debug: process.env.NODE_ENV !== 'production',
  })
  return <Component {...pageProps} />
}

export default MyApp
