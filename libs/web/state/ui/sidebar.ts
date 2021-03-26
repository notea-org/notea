import useSettingsAPI from 'libs/web/api/settings'
import { isBoolean } from 'lodash'
import { useState, useCallback } from 'react'

export default function useSidebar(initState = false) {
  const [isFold, setFold] = useState(initState)
  const { mutate } = useSettingsAPI()

  const toggleFold = useCallback(
    async (state?: boolean) => {
      setFold((prev) => {
        const isFold = isBoolean(state) ? state : !prev

        mutate({
          sidebar_is_fold: isFold,
        })

        return isFold
      })
    },
    [mutate]
  )

  return { isFold, toggleFold }
}
