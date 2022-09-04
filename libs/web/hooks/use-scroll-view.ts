import { RefObject, useEffect } from 'react';

export default function useScrollView(
    ref: RefObject<HTMLElement>,
    condition?: boolean,
    options: ScrollIntoViewOptions | boolean = {
        behavior: 'auto',
        block: 'nearest',
    }
) {
    useEffect(() => {
        if (condition && ref?.current?.scrollIntoView) {
            ref.current.scrollIntoView(options);
        }
    }, [condition, options, ref]);
}
