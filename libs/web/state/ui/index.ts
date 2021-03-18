import { createContainer } from 'unstated-next'
import { useSidebar } from './sidebar'
import { useSplit } from './split'
import { useTitle } from './title'
import { UserAgentType, useUA } from './ua'

function useUI({ ua }: { ua?: UserAgentType } = {}) {
  return {
    ua: useUA(ua),
    sidebar: useSidebar(ua?.isMobileOnly),
    split: useSplit(),
    title: useTitle(),
  }
}

export const UIState = createContainer(useUI)
