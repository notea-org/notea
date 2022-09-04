import { PopperProps, Popper } from '@material-ui/core';
import { useRouter } from 'next/router';
import { FC, useCallback, useEffect, useRef } from 'react';

const DELAY = 200;

interface Props extends PopperProps {
    handleOpen: () => void;
    handleClose: () => void;
    setAnchor: (el: Element | null) => void;
    delay?: number;
}

const Popover: FC<Props> = ({
    handleClose,
    handleOpen,
    setAnchor,
    children,
    delay = DELAY,
    ...props
}) => {
    const anchorRef = useRef<HTMLLinkElement | null>();
    const router = useRouter();
    const leaveTimer = useRef<number>();
    const enterTimer = useRef<number>();

    const handleEnter = useCallback(() => {
        clearTimeout(leaveTimer.current);
        clearTimeout(enterTimer.current);
        enterTimer.current = window.setTimeout(() => {
            handleOpen();
        }, delay);
    }, [delay, handleOpen]);

    const handleLeave = useCallback(() => {
        clearTimeout(leaveTimer.current);
        clearTimeout(enterTimer.current);
        leaveTimer.current = window.setTimeout(() => {
            handleClose();
        }, delay);
    }, [delay, handleClose]);

    useEffect(() => {
        if (anchorRef.current) {
            anchorRef.current.removeEventListener('mouseover', handleEnter);
            anchorRef.current.removeEventListener('mouseleave', handleLeave);
        }

        if (props.anchorEl) {
            anchorRef.current = props.anchorEl as HTMLLinkElement;
            anchorRef.current.addEventListener('mouseover', handleEnter);
            anchorRef.current.addEventListener('mouseleave', handleLeave);
            handleEnter();
        }

        return () => {
            anchorRef.current?.addEventListener('mouseover', handleEnter);
            anchorRef.current?.addEventListener('mouseleave', handleLeave);
            handleClose();
        };
    }, [handleEnter, handleLeave, props.anchorEl, handleClose]);

    useEffect(() => {
        setAnchor(null);
        handleClose();
    }, [router.query.id, handleClose, setAnchor]);

    if (!props.anchorEl) {
        return null;
    }

    return (
        <Popper onMouseOver={handleEnter} onMouseLeave={handleLeave} {...props}>
            {children}
        </Popper>
    );
};
export default Popover;
