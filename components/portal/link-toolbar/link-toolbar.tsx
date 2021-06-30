import { Paper } from '@material-ui/core'
import HotkeyTooltip from 'components/hotkey-tooltip'
import IconButton from 'components/icon-button'
import useI18n from 'libs/web/hooks/use-i18n'
import PortalState from 'libs/web/state/portal'
import Popover from 'components/popover'

const LinkToolbar = () => {
  const { t } = useI18n()
  const {
    linkToolbar: { anchor, open, close, visible, setAnchor },
  } = PortalState.useContainer()

  return (
    <Popover
      placement="bottom"
      anchorEl={anchor}
      open={visible}
      handleClose={close}
      handleOpen={open}
      setAnchor={setAnchor}
      delay={0}
    >
      <Paper className="relative bg-gray-50 flex p-1 space-x-1">
        <HotkeyTooltip text={t('Open link')}>
          <IconButton icon={'ExternalLink'}></IconButton>
        </HotkeyTooltip>
        <IconButton icon={'BookmarkAlt'}></IconButton>
        <IconButton icon={'Code'}></IconButton>
      </Paper>
    </Popover>
  )
}

export default LinkToolbar
