import * as Panelbear from '@panelbear/panelbear-js'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

export const usePanelbear = (site: string, config = {}) => {
  const router = useRouter()

  useEffect(() => {
    Panelbear.load(site, config)

    // Trigger initial page view
    Panelbear.trackPageview()

    // Add on route change handler for client-side navigation
    const handleRouteChange = () => Panelbear.trackPageview()
    router.events.on('routeChangeComplete', handleRouteChange)

    return () => {
      router.events.off('routeChangeComplete', handleRouteChange)
    }
  }, [config, router.events, site])
}
