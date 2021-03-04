import { Menu, MenuItem } from '@material-ui/core'
import React, { FC, useState, MouseEvent, useCallback } from 'react'
import IconDotsHorizontal from 'heroicons/react/outline/DotsHorizontal'
import HotkeyTooltip from 'components/hotkey-tooltip'
import SidebarItemButton from './sidebar-item-button'
import IconClipboardCopy from 'heroicons/react/outline/ClipboardCopy'
import IconTrash from 'heroicons/react/outline/Trash'
import IconPaperAirplane from 'heroicons/react/outline/PaperAirplane'

const MENU_LIST = [
  {
    text: '删除',
    icon: <IconTrash />,
  },
  {
    text: '创建分享',
    icon: <IconPaperAirplane />,
  },
  {
    text: '拷贝链接',
    icon: <IconClipboardCopy />,
  },
]

const SidebarItemMenu: FC = () => {
  const [anchorEl, setAnchorEl] = useState<any>(null)

  const handleClick = useCallback((event: MouseEvent) => {
    event.preventDefault()
    setAnchorEl(event.currentTarget)
  }, [])

  const handleClose = useCallback(() => {
    setAnchorEl(null)
  }, [])

  return (
    <>
      <HotkeyTooltip text="删除、分享等操作">
        <SidebarItemButton
          onClick={handleClick}
          className="hidden group-hover:block"
        >
          <IconDotsHorizontal width="16" />
        </SidebarItemButton>
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
          <MenuItem
            classes={{
              root: 'text-xs',
            }}
            key={item.text}
          >
            <span className="w-4 mr-2">{item.icon}</span>
            <span>{item.text}</span>
          </MenuItem>
        ))}
      </Menu>
    </>
  )
}

export default SidebarItemMenu
