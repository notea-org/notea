import { useState } from 'react'
import { createContainer } from 'unstated-next'

export interface UserAgentType {
  isMobile: boolean
  isMobileOnly: boolean
  isTablet: boolean
  isBrowser: boolean
  isWechat: boolean
}

function useUserAgent(
  initState: UserAgentType = {
    isMobile: false,
    isMobileOnly: false,
    isTablet: false,
    isBrowser: true,
    isWechat: false,
  }
) {
  const [ua] = useState(initState)

  return { ua }
}

export const UserAgentState = createContainer(useUserAgent)
