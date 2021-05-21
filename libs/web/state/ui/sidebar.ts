import useSettingsAPI from 'libs/web/api/settings'
import { isBoolean } from 'lodash'
import { useState, useCallback } from 'react'

export default function useSidebar(initState = false) {
  const [isFold, setIsFold] = useState(initState)
  const { mutate } = useSettingsAPI()

  const toggle = useCallback(
    async (state?: boolean) => {
      setIsFold((prev) => {
        const isFold = isBoolean(state) ? state : !prev

        mutate({
          sidebar_is_fold: isFold,
        })

        return isFold
      })
    },
    [mutate]
  )

  const open = useCallback(() => {
    setIsFold(true)
    mutate({
      sidebar_is_fold: true,
    })
  }, [mutate])

  const close = useCallback(() => {
    setIsFold(false)
    mutate({
      sidebar_is_fold: false,
    })
  }, [mutate])

  return { isFold, toggle, open, close }
}
