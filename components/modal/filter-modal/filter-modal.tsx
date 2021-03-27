import { FC, useEffect } from 'react'
import { Dialog, ModalProps, styled } from '@material-ui/core'
import UIState from 'libs/web/state/ui'

const FilterModal: FC<{
  open: ModalProps['open']
  onClose: ModalProps['onClose']
  onOpen?: () => void
}> = ({ open, onClose, onOpen, children }) => {
  const { ua } = UIState.useContainer()

  useEffect(() => {
    if (open && onOpen) {
      onOpen()
    }
  }, [open, onOpen])

  return (
    <StyledDialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      classes={{
        root: 'mt-20',
      }}
      // style={{ top: ua.isMobileOnly ? 0 : '10vh' }}
      // className="w-full m-auto lg:w-1/2 xl:w-1/3"
    >
      <div className="bg-gray-50 text-gray-800 outline-none rounded overflow-auto">
        {children}
      </div>
    </StyledDialog>
  )
}

const StyledDialog = styled(Dialog)({
  inset: '0 0 auto 0!important',
})

export default FilterModal
