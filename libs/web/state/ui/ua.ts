import { UserAgentType } from 'libs/shared/ua'
import { useState } from 'react'

export default function useUA(
  initState: UserAgentType = {
    isMobile: false,
    isMobileOnly: false,
    isTablet: false,
    isBrowser: true,
    isWechat: false,
  }
) {
  const [ua] = useState(initState)

  return ua
}
