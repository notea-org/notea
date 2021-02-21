import { useState } from 'react'
import { createContainer } from 'unstated-next'

export interface UserAgentType {
  isMobile: boolean
  isMobileOnly: boolean
  isTablet: boolean
  isBrowser: boolean
  isWechat: boolean
}

function useUserAgent(initState?: UserAgentType) {
  const [ua, setUA] = useState(initState)

  return [ua, setUA]
}

export const UserAgentState = createContainer(useUserAgent)
