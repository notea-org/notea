import { Settings } from 'libs/shared/settings'
import { UserAgentType } from 'libs/shared/ua'
import { createContainer } from 'unstated-next'
import useSettings from './settings'
import useSidebar from './sidebar'
import useSplit from './split'
import useTitle from './title'

interface Props {
  ua?: UserAgentType
  settings?: Settings
  disablePassword?: boolean
}
function useUI({ ua, settings, disablePassword }: Props = {}) {
  return {
    ua,
    sidebar: useSidebar(ua?.isMobileOnly ? false : settings?.sidebar_is_fold),
    split: useSplit(settings?.split_sizes),
    title: useTitle(),
    settings: useSettings(settings),
    disablePassword,
  }
}

const UIState = createContainer(useUI)

export default UIState
