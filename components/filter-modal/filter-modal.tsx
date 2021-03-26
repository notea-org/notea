import { FC, useEffect } from 'react'
import { Modal, ModalProps } from '@material-ui/core'
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
    <Modal
      open={open}
      onClose={onClose}
      style={{ top: ua.isMobileOnly ? 0 : '10vh' }}
      className="w-full m-auto lg:w-1/2 xl:w-1/3"
    >
      <div className="bg-gray-50 text-gray-800 outline-none rounded overflow-auto">
        {children}
      </div>
    </Modal>
  )
}

export default FilterModal
