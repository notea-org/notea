import { DependencyList, useEffect, useRef } from 'react';

const useDidUpdated = (handler: () => void, deps: DependencyList) => {
    const mounted = useRef(false);

    useEffect(() => {
        if (mounted.current) {
            handler();
        } else {
            mounted.current = true;
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, deps);
};

export default useDidUpdated;
