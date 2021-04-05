import React, { FC } from 'react'
import { Popover, FormControlLabel, Switch } from '@material-ui/core'
import PortalState from 'libs/web/state/portal'

const ShareModal: FC = () => {
  const { share } = PortalState.useContainer()

  return (
    <Popover
      anchorEl={share.anchor}
      open={!!share.anchor}
      onClose={share.close}
      classes={{
        paper: 'bg-gray-200 text-gray-800',
      }}
    >
      <section className="p-2">
        <FormControlLabel
          value="start"
          control={<Switch color="primary" classes={{}} />}
          label={
            <div className="mr-2">
              <h2 className="text-sm">公开分享</h2>
              <p className="text-xs text-gray-500">
                开启后任何人都可以通过此链接访问页面
              </p>
            </div>
          }
          labelPlacement="start"
        />
      </section>
    </Popover>
  )
}

export default ShareModal
