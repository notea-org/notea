import {
    SearchIcon,
    TrashIcon,
    ChevronDoubleLeftIcon,
    InboxIcon,
    CogIcon,
} from '@heroicons/react/outline';
import { forwardRef, HTMLProps, useCallback } from 'react';
import UIState from 'libs/web/state/ui';
import classNames from 'classnames';
import HotkeyTooltip from 'components/hotkey-tooltip';
import Link from 'next/link';
import dayjs from 'dayjs';
import PortalState from 'libs/web/state/portal';
import useI18n from 'libs/web/hooks/use-i18n';
import HeadwayWidget from '@headwayapp/react-widget';
import useMounted from 'libs/web/hooks/use-mounted';
import { useRouter } from 'next/router';

const ButtonItem = forwardRef<HTMLDivElement, HTMLProps<HTMLDivElement>>(
    (props, ref) => {
        const { children, className, ...attrs } = props;
        return (
            <div
                {...attrs}
                ref={ref}
                className={classNames(
                    'block m-3 text-gray-500 hover:text-gray-800 cursor-pointer',
                    className
                )}
            >
                {children}
            </div>
        );
    }
);

const ButtonMenu = () => {
    const { t } = useI18n();
    const {
        sidebar: { toggle, isFold },
    } = UIState.useContainer();
    const onFold = useCallback(() => {
        toggle()
            ?.catch((v) => console.error('Error whilst toggling tool: %O', v));
    }, [toggle]);

    return (
        <HotkeyTooltip
            text={t('Fold sidebar')}
            commandKey
            onHotkey={onFold}
            keys={['\\']}
        >
            <ButtonItem onClick={onFold}>
                <ChevronDoubleLeftIcon
                    className={classNames('transform transition-transform', {
                        'rotate-180': isFold,
                    })}
                />
            </ButtonItem>
        </HotkeyTooltip>
    );
};

const ButtonSearch = () => {
    const { t } = useI18n();
    const { search } = PortalState.useContainer();

    return (
        <HotkeyTooltip
            text={t('Search note')}
            commandKey
            onHotkey={search.open}
            keys={['P']}
        >
            <ButtonItem onClick={search.open} aria-label="search">
                <SearchIcon />
            </ButtonItem>
        </HotkeyTooltip>
    );
};

const ButtonTrash = () => {
    const { t } = useI18n();
    const { trash } = PortalState.useContainer();

    return (
        <HotkeyTooltip
            text={t('Trash')}
            commandKey
            optionKey
            onHotkey={trash.open}
            keys={['T']}
        >
            <ButtonItem onClick={trash.open} aria-label="trash">
                <TrashIcon />
            </ButtonItem>
        </HotkeyTooltip>
    );
};

const ButtonDailyNotes = () => {
    const { t } = useI18n();
    const href = `/${dayjs().format('YYYY-MM-DD')}`;
    const router = useRouter();

    return (
        <Link href={href} shallow>
            <a>
                <HotkeyTooltip
                    text={t('Daily Notes')}
                    commandKey
                    onHotkey={() => router.push(href, href, { shallow: true })}
                    keys={['shift', 'O']}
                >
                    <ButtonItem aria-label="daily notes">
                        <InboxIcon />
                    </ButtonItem>
                </HotkeyTooltip>
            </a>
        </Link>
    );
};

const ButtonSettings = () => {
    const { t } = useI18n();

    return (
        <Link href="/settings" shallow>
            <a>
                <HotkeyTooltip text={t('Settings')}>
                    <ButtonItem aria-label="settings">
                        <CogIcon />
                    </ButtonItem>
                </HotkeyTooltip>
            </a>
        </Link>
    );
};

const SidebarTool = () => {
    const mounted = useMounted();

    return (
        <aside className="h-full flex flex-col w-12  md:w-11 flex-none bg-gray-200">
            <ButtonSearch />
            <ButtonTrash />
            <ButtonDailyNotes />

            <div className="tool mt-auto">
                {mounted ? (
                    <HeadwayWidget account="J031Z7" badgePosition="center">
                        <div className="mx-3 w-5 h-5"></div>
                    </HeadwayWidget>
                ) : null}
                <ButtonMenu></ButtonMenu>
                <ButtonSettings></ButtonSettings>
                <style jsx>{`
                    .tool :global(.HW_softHidden) {
                        display: none;
                    }
                `}</style>
            </div>
        </aside>
    );
};

export default SidebarTool;
