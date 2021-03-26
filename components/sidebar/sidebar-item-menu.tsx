import { Menu, MenuItem } from '@material-ui/core'
import React, { FC, useState, MouseEvent, useCallback, useMemo } from 'react'
import HotkeyTooltip from 'components/hotkey-tooltip'
import IconClipboardCopy from 'heroicons/react/outline/ClipboardCopy'
import IconTrash from 'heroicons/react/outline/Trash'
import IconPaperAirplane from 'heroicons/react/outline/PaperAirplane'
import NoteState, { NoteModel } from 'libs/web/state/note'
import IconButton from 'components/icon-button'
import ModalState from 'libs/web/state/modal'

enum MENU_HANDLER_NAME {
  REMOVE_NOTE,
  SHARE_NOTE,
  COPY_LINK,
}

const MENU_LIST = [
  {
    text: '删除',
    icon: <IconTrash />,
    handler: MENU_HANDLER_NAME.REMOVE_NOTE,
  },
  {
    text: '分享页面',
    icon: <IconPaperAirplane />,
    handler: MENU_HANDLER_NAME.SHARE_NOTE,
  },
  {
    text: '拷贝链接',
    icon: <IconClipboardCopy />,
    handler: MENU_HANDLER_NAME.COPY_LINK,
  },
]

const SidebarItemMenu: FC<{
  note: NoteModel
}> = ({ note }) => {
  const [anchorEl, setAnchorEl] = useState<any>(null)
  const { removeNote } = NoteState.useContainer()
  const {
    share: { open: openShare },
  } = ModalState.useContainer()

  const handleClick = useCallback((event: MouseEvent) => {
    event.preventDefault()
    setAnchorEl(event.currentTarget)
  }, [])

  const handleClose = useCallback(() => {
    setAnchorEl(null)
  }, [])

  const doRemoveNote = useCallback(() => {
    handleClose()
    removeNote(note.id)
  }, [handleClose, note.id, removeNote])

  const doShareNote = useCallback(() => {
    handleClose()
    openShare()
  }, [handleClose, openShare])

  const doCopyLink = useCallback(() => {
    handleClose()
  }, [handleClose])

  const MENU_HANDLER = useMemo(
    () => ({
      [MENU_HANDLER_NAME.REMOVE_NOTE]: doRemoveNote,
      [MENU_HANDLER_NAME.COPY_LINK]: doCopyLink,
      [MENU_HANDLER_NAME.SHARE_NOTE]: doShareNote,
    }),
    [doCopyLink, doRemoveNote, doShareNote]
  )

  return (
    <>
      <HotkeyTooltip text="删除、分享等操作">
        <IconButton
          icon="DotsHorizontal"
          onClick={handleClick}
          className="hidden group-hover:block"
        ></IconButton>
      </HotkeyTooltip>

      <Menu
        anchorEl={anchorEl}
        open={!!anchorEl}
        onClose={handleClose}
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
    </>
  )
}

export default SidebarItemMenu
