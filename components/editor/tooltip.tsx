import { Tooltip as MuiTooltip } from '@material-ui/core';
import { FC } from 'react';
import { ReactNodeLike } from 'prop-types';

const Tooltip: FC<{
    tooltip: string;
    placement: 'top' | 'bottom' | 'left' | 'right';
    children: ReactNodeLike;
}> = ({ children, tooltip, placement }) => {
    return (
        <MuiTooltip title={tooltip} placement={placement}>
            <div>{children}</div>
        </MuiTooltip>
    );
};

export default Tooltip;
