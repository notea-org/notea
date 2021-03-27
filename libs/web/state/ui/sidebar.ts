import useSettingsAPI from 'libs/web/api/settings'
import { isBoolean } from 'lodash'
import { useState, useCallback } from 'react'

export default function useSidebar(initState = false) {
  const [visible, setVisible] = useState(initState)
  const { mutate } = useSettingsAPI()

  const toggle = useCallback(
    async (state?: boolean) => {
      setVisible((prev) => {
        const visible = isBoolean(state) ? state : !prev

        mutate({
          sidebar_is_fold: visible,
        })

        return visible
      })
    },
    [mutate]
  )

  const open = useCallback(() => {
    setVisible(true)
    mutate({
      sidebar_is_fold: true,
    })
  }, [mutate])

  const close = useCallback(() => {
    setVisible(false)
    mutate({
      sidebar_is_fold: false,
    })
  }, [mutate])

  return { visible, toggle, open, close }
}
