import { FC } from 'react'
import { Modal } from '@material-ui/core'
import ModalState from 'libs/web/state/modal'

 const ShareModal: FC = () => {
  const { share } = ModalState.useContainer()

  return (
    <Modal
      open={share.visible}
      onClose={share.close}
      aria-labelledby="simple-modal-title"
      aria-describedby="simple-modal-description"
    >
      <div>1</div>
    </Modal>
  )
}

export default ShareModal
