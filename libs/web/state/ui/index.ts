import { Settings } from 'libs/shared/settings';
import { UserAgentType } from 'libs/shared/ua';
import { createContainer } from 'unstated-next';
import useSettings from './settings';
import useSidebar from './sidebar';
import useSplit from './split';
import useTitle from './title';

const DEFAULT_UA: UserAgentType = {
    isMobile: false,
    isMobileOnly: false,
    isTablet: false,
    isBrowser: true,
    isWechat: false,
    isMac: false,
};

interface Props {
    ua?: UserAgentType;
    settings?: Settings;
    disablePassword?: boolean;
    IS_DEMO?: boolean;
}

function useUI({
    ua = DEFAULT_UA,
    settings,
    disablePassword,
    IS_DEMO,
}: Props = {}) {
    return {
        ua,
        sidebar: useSidebar(
            ua?.isMobileOnly ? false : settings?.sidebar_is_fold,
            ua.isMobileOnly
        ),
        split: useSplit(settings?.split_sizes),
        title: useTitle(),
        settings: useSettings(settings),
        disablePassword,
        IS_DEMO,
    };
}

const UIState = createContainer(useUI);

export default UIState;
