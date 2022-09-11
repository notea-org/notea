import { Tooltip, TooltipProps } from '@material-ui/core';
import UIState from 'libs/web/state/ui';
import { noop } from 'lodash';
import { FC } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import type { ReactNodeLike } from 'prop-types';

const Title: FC<{
    text: string;
    keys: string[];
}> = ({ text, keys }) => {
    return (
        <span>
            {text} {keys.join('+')}
        </span>
    );
};

const HotkeyTooltip: FC<{
    text: string;
    keys?: string[];
    children: ReactNodeLike;
    /**
     * first key
     */
    commandKey?: boolean;
    optionKey?: boolean;
    onClose?: TooltipProps['onClose'];
    onHotkey?: () => void;
    disableOnContentEditable?: boolean;
}> = ({
    text,
    keys = [],
    children,
    onClose,
    commandKey,
    optionKey,
    onHotkey = noop,
    disableOnContentEditable = false,
}) => {
    const {
        ua: { isMac },
    } = UIState.useContainer();
    const keyMap = [...keys];

    if (commandKey) {
        keyMap.unshift(isMac ? '⌘' : 'ctrl');
    }

    if (optionKey) {
        keyMap.unshift(isMac ? '⌥' : 'alt');
    }

    useHotkeys(
        keyMap.join('+'),
        (event) => {
            event.preventDefault();
            onHotkey();
        },
        {
            enabled: !!keys.length,
            enableOnTags: ['INPUT', 'TEXTAREA'],
            enableOnContentEditable: !disableOnContentEditable,
        },
        [onHotkey]
    );

    return (
        <Tooltip
            enterDelay={200}
            TransitionProps={{ timeout: 0 }}
            title={<Title text={text} keys={keyMap} />}
            onClose={onClose}
            placement="bottom-start"
        >
            {children as any}
        </Tooltip>
    );
};

export default HotkeyTooltip;
