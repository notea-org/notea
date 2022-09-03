import {
    useSnackbar,
    OptionsObject,
    VariantType,
    SnackbarMessage,
} from 'notistack';
import { useCallback } from 'react';
import UIState from '../state/ui';

const defaultOptions: OptionsObject = {
    anchorOrigin: { horizontal: 'center', vertical: 'bottom' },
};

const defaultOptionsForMobile: OptionsObject = {
    anchorOrigin: { horizontal: 'left', vertical: 'bottom' },
};

export const useToast = () => {
    const {
        ua: { isMobileOnly },
    } = UIState.useContainer();

    const { enqueueSnackbar } = useSnackbar();
    const toast = useCallback(
        (text: SnackbarMessage, variant?: VariantType) => {
            enqueueSnackbar(text, {
                ...(isMobileOnly ? defaultOptionsForMobile : defaultOptions),
                variant,
            });
        },
        [enqueueSnackbar, isMobileOnly]
    );

    return toast;
};
