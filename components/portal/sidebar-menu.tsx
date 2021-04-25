import { Menu, MenuItem } from '@material-ui/core'
import { FC, useCallback, useMemo } from 'react'
import IconClipboardCopy from 'heroicons/react/outline/ClipboardCopy'
import IconTrash from 'heroicons/react/outline/Trash'
import NoteState from 'libs/web/state/note'
import PortalState from 'libs/web/state/portal'
import router from 'next/router'
import useI18n from 'libs/web/hooks/use-i18n'

enum MENU_HANDLER_NAME {
  REMOVE_NOTE,
  COPY_LINK,
}

const SidebarMenu: FC = () => {
  const { t } = useI18n()
  const { removeNote } = NoteState.useContainer()
  const {
    menu: { close, anchor, data },
  } = PortalState.useContainer()

  const doRemoveNote = useCallback(() => {
    close()
    if (data?.id) {
      removeNote(data.id)
      router.back()
    }
  }, [close, data, removeNote])

  const doCopyLink = useCallback(() => {
    close()
  }, [close])

  const MENU_HANDLER = useMemo(
    () => ({
      [MENU_HANDLER_NAME.REMOVE_NOTE]: doRemoveNote,
      [MENU_HANDLER_NAME.COPY_LINK]: doCopyLink,
    }),
    [doCopyLink, doRemoveNote]
  )

  const MENU_LIST = useMemo(
    () => [
      {
        text: t('Remove'),
        icon: <IconTrash />,
        handler: MENU_HANDLER_NAME.REMOVE_NOTE,
      },
      {
        text: t('Copy Link'),
        icon: <IconClipboardCopy />,
        handler: MENU_HANDLER_NAME.COPY_LINK,
      },
    ],
    [t]
  )

  return (
    <Menu
      anchorEl={anchor}
      open={!!anchor}
      onClose={close}
      classes={{
        paper: 'bg-gray-200 text-gray-800',
      }}
    >
      {MENU_LIST.map((item) => (
        <MenuItem key={item.text} onClick={MENU_HANDLER[item.handler]}>
          <span className="text-xs w-4 mr-2">{item.icon}</span>
          <span className="text-xs">{item.text}</span>
        </MenuItem>
      ))}
    </Menu>
  )
}

export default SidebarMenu
