import { FC } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  IconButton,
  DialogActions,
  Button,
} from '@material-ui/core'
import ModalState from 'libs/web/state/modal'

const ShareModal: FC = () => {
  const { share } = ModalState.useContainer()

  return (
    <Dialog
      onClose={share.close}
      aria-labelledby="customized-dialog-title"
      open={share.visible}
    >
      <DialogTitle id="customized-dialog-title">
        <Typography variant="h6">title</Typography>
        <IconButton aria-label="close" onClick={share.close}>
          x
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <Typography gutterBottom>
          Cras mattis consectetur purus sit amet fermentum. Cras justo odio,
          dapibus ac facilisis in, egestas eget quam. Morbi leo risus, porta ac
          consectetur ac, vestibulum at eros.
        </Typography>
        <Typography gutterBottom>
          Praesent commodo cursus magna, vel scelerisque nisl consectetur et.
          Vivamus sagittis lacus vel augue laoreet rutrum faucibus dolor auctor.
        </Typography>
        <Typography gutterBottom>
          Aenean lacinia bibendum nulla sed consectetur. Praesent commodo cursus
          magna, vel scelerisque nisl consectetur et. Donec sed odio dui. Donec
          ullamcorper nulla non metus auctor fringilla.
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button autoFocus onClick={share.close} color="primary">
          Save changes
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default ShareModal
