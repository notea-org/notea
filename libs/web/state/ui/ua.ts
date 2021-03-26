import { useState } from 'react'

export interface UserAgentType {
  isMobile: boolean
  isMobileOnly: boolean
  isTablet: boolean
  isBrowser: boolean
  isWechat: boolean
}

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
