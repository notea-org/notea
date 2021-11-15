import Router from 'next/router'
import { useEffect } from 'react'

export default function useRouterWarning(
  changes: boolean,
  callback: () => boolean
) {
  useEffect(() => {
    if (!changes) {
      return
    }
    const routeChangeStartCallback = () => {
      const ok = callback()
      if (!ok) {
        Router.events.emit('routeChangeError')
        throw 'Abort route changes due to unsaved changes'
      }
    }
    Router.events.on('routeChangeStart', routeChangeStartCallback)
    return () => Router.events.off('routeChangeStart', routeChangeStartCallback)
  }, [changes, callback])

  useEffect(() => {
    if (!changes) {
      return
    }
    const callback = (e: BeforeUnloadEvent) => {
      e.preventDefault()
      return true
    }
    window.onbeforeunload = callback
    return () => {
      window.onbeforeunload = null
    }
  }, [changes, callback])
}
