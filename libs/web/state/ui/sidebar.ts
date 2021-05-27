import useSettingsAPI from 'libs/web/api/settings'
import { isBoolean } from 'lodash'
import { useState, useCallback } from 'react'

export default function useSidebar(initState = false, isMobileOnly = false) {
  const [isFold, setIsFold] = useState(initState)
  const { mutate } = useSettingsAPI()

  const toggle = useCallback(
    async (state?: boolean) => {
      setIsFold((prev) => {
        const isFold = isBoolean(state) ? state : !prev

        if (!isMobileOnly) {
          mutate({
            sidebar_is_fold: isFold,
          })
        }

        return isFold
      })
    },
    [isMobileOnly, mutate]
  )

  const open = useCallback(() => {
    toggle(true)
  }, [toggle])

  const close = useCallback(() => {
    toggle(false)
  }, [toggle])

  return { isFold, toggle, open, close }
}
