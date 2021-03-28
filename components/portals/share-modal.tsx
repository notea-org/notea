import { FC } from 'react'
import { Popover } from '@material-ui/core'
import PortalState from 'libs/web/state/portal'

const ShareModal: FC = () => {
  const { share } = PortalState.useContainer()

  return (
    <Popover
      anchorEl={share.anchor}
      open={!!share.anchor}
      onClose={share.close}
    >
      123
    </Popover>
  )
}

export default ShareModal
