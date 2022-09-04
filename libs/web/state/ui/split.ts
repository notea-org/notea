import { useState, useEffect, useCallback, useRef } from 'react';
import { DEFAULT_SETTINGS } from 'libs/shared/settings';
import useSettingsAPI from 'libs/web/api/settings';

export default function useSplit(initData = DEFAULT_SETTINGS.split_sizes) {
    const [sizes, setSizes] = useState(initData);
    const sizesRef = useRef(sizes);
    const { mutate } = useSettingsAPI();

    useEffect(() => {
        sizesRef.current = sizes;
    }, [sizes]);

    const saveSizes = useCallback(
        async (sizes: [number, number]) => {
            setSizes(sizes);
            await mutate({
                split_sizes: sizes,
            });
        },
        [mutate]
    );

    const resize = useCallback(
        async (scale: number) => {
            const size = sizesRef.current?.[0] * scale;

            await saveSizes([size, 100 - size]);
        },
        [saveSizes]
    );

    return {
        sizes,
        saveSizes,
        resize,
    };
}
