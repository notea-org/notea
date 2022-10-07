import UIState from 'libs/web/state/ui';
import Split from 'react-split';
import { FC, useCallback, useEffect, useRef } from 'react';
import { ReactNodeLike } from 'prop-types';

const renderGutter = () => {
    const gutter = document.createElement('div');
    const line = document.createElement('div');

    gutter.className = 'gutter group cursor-col-resize z-20';
    line.className =
        'transition-colors delay-150 group-hover:bg-gray-300 dark:group-hover:bg-gray-500 w-1 h-full';
    gutter.appendChild(line);

    return gutter;
};

const Resizable: FC<{ width: number; children: ReactNodeLike }> = ({
    width,
    children,
}) => {
    const splitRef = useRef<typeof Split>(null);
    const {
        split: { saveSizes, resize, sizes },
        ua: { isMobileOnly },
        sidebar: { isFold },
    } = UIState.useContainer();
    const lastWidthRef = useRef(width);

    useEffect(() => {
        const lastWidth = lastWidthRef.current;

        if (width && lastWidth) {
            resize(lastWidth / width)
                ?.catch((v) => console.error('Error whilst resizing: %O', v));
        }
        lastWidthRef.current = width;
    }, [resize, width]);

    useEffect(() => {
        if (isFold) {
            splitRef.current?.split?.collapse(0);
        }
        // width 改变引起 sizes 重置
    }, [isFold, sizes]);

    const updateSplitSizes = useCallback(
        async (sizes: [number, number]) => {
            if (isMobileOnly) {
                return;
            }

            await saveSizes(sizes);
        },
        [saveSizes, isMobileOnly]
    );

    return (
        <Split
            ref={splitRef}
            className="flex h-auto justify-end"
            // w-12
            minSize={isFold ? 48 : 250}
            sizes={sizes}
            gutterSize={0}
            gutter={renderGutter}
            onDragEnd={updateSplitSizes}
        >
            {children}
        </Split>
    );
};

export default Resizable;
