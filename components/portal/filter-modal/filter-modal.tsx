import { FC, useEffect } from 'react';
import { Dialog, DialogProps, ModalProps } from '@material-ui/core';
import UIState from 'libs/web/state/ui';
import classNames from 'classnames';
import router from 'next/router';
import { ReactNodeLike } from 'prop-types';

const FilterModal: FC<{
    open: ModalProps['open'];
    onClose: () => void;
    onOpen?: () => void;
    children: ReactNodeLike;
}> = ({ open, onClose, onOpen, children }) => {
    const {
        ua: { isMobileOnly },
    } = UIState.useContainer();

    useEffect(() => {
        router.beforePopState(() => {
            onClose();
            return true;
        });
    }, [onClose]);

    useEffect(() => {
        if (open) {
            onOpen?.();
        }
    }, [open, onOpen]);

    const props: Partial<DialogProps> = isMobileOnly
        ? {
              fullScreen: true,
          }
        : {
              style: {
                  inset: '0 0 auto 0',
                  marginTop: '10vh',
              },
          };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="sm"
            fullWidth
            classes={{
                paper: 'bg-gray-50',
            }}
            {...props}
        >
            <div
                className={classNames(
                    'bg-gray-50 text-gray-800 outline-none overflow-auto',
                    {
                        rounded: !isMobileOnly,
                    }
                )}
            >
                {children}
            </div>
        </Dialog>
    );
};

export default FilterModal;
