import {
  useSnackbar,
  OptionsObject,
  VariantType,
  SnackbarMessage,
} from 'notistack'
import { useCallback } from 'react'

const defaultOptions: OptionsObject = {
  anchorOrigin: { horizontal: 'center', vertical: 'bottom' },
}

export const useToast = () => {
  const { enqueueSnackbar } = useSnackbar()
  const toast = useCallback(
    (text: SnackbarMessage, variant?: VariantType) => {
      enqueueSnackbar(text, {
        ...defaultOptions,
        variant,
      })
    },
    [enqueueSnackbar]
  )

  return toast
}
