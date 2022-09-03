import useI18n from 'libs/web/hooks/use-i18n';
import { Router, useRouter } from 'next/router';
import { FC, useCallback, useEffect, useRef, useState } from 'react';
import HotkeyTooltip from './hotkey-tooltip';
import IconButton from './icon-button';

const NavButtonGroup: FC = () => {
    const { t } = useI18n();
    const { back: routerBack, beforePopState } = useRouter();
    const [canBack, setCanBack] = useState(false);
    const [canForward, setCanForward] = useState(false);
    const isBackRef = useRef(false);
    const isForwardRef = useRef(false);
    const forwardTimerRef = useRef<number>();

    const back = useCallback(() => {
        if (!canBack) {
            return;
        }
        routerBack();
    }, [canBack, routerBack]);

    const forward = useCallback(() => {
        if (!canForward) {
            return;
        }
        history.forward();
        isForwardRef.current = true;
        clearTimeout(forwardTimerRef.current);
        forwardTimerRef.current = window.setTimeout(() => {
            if (isForwardRef.current) {
                setCanForward(false);
            }
        }, 100);
    }, [canForward]);

    useEffect(() => {
        beforePopState((state) => {
            const idx = (state as any).idx as number;

            setCanForward(true);
            setCanBack(idx > 0);
            isBackRef.current = true;

            return true;
        });
    }, [beforePopState]);

    useEffect(() => {
        const handler = () => {
            if (!isBackRef.current) {
                setCanBack(true);
                setCanForward(false);
            }

            isBackRef.current = false;
            isForwardRef.current = false;
        };

        Router.events.on('beforeHistoryChange', handler);

        return () => {
            Router.events.off('beforeHistoryChange', handler);
        };
    }, []);

    return (
        <div className="flex">
            <HotkeyTooltip
                text={t('Back')}
                onHotkey={back}
                keys={['Left']}
                commandKey
                disableOnContentEditable
            >
                <IconButton
                    disabled={!canBack}
                    icon="ArrowSmLeft"
                    onClick={back}
                />
            </HotkeyTooltip>
            <HotkeyTooltip
                text={t('Forward')}
                onHotkey={forward}
                keys={['Right']}
                commandKey
                disableOnContentEditable
            >
                <IconButton
                    disabled={!canForward}
                    icon="ArrowSmRight"
                    onClick={forward}
                />
            </HotkeyTooltip>
        </div>
    );
};

export default NavButtonGroup;
