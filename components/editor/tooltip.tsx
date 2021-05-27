import { Tooltip as MuiTooltip } from '@material-ui/core'
import { FC } from 'react'

const Tooltip: FC<{
  tooltip: string
  placement: 'top' | 'bottom' | 'left' | 'right'
}> = ({ children, tooltip, placement }) => {
  return (
    <MuiTooltip title={tooltip} placement={placement}>
      <div>{children}</div>
    </MuiTooltip>
  )
}

export default Tooltip
