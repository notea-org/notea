import { Tooltip, TooltipProps } from '@material-ui/core'
import { FC } from 'react'

// todo: tooltip style
const Title: FC<{
  text: string
  keys: string[]
}> = ({ text, keys }) => {
  return (
    <span>
      {text} {keys.join('+')}
    </span>
  )
}

const HotkeyTooltip: FC<{
  text: string
  keys?: string[]
  onClose?: TooltipProps['onClose']
}> = ({ text, keys = [], children, onClose }) => {
  return (
    <Tooltip
      enterDelay={200}
      TransitionProps={{ timeout: 0 }}
      title={<Title text={text} keys={keys} />}
      onClose={onClose}
      placement="bottom-start"
    >
      {children as any}
    </Tooltip>
  )
}

export default HotkeyTooltip
