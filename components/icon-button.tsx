import classNames from 'classnames'
import { forwardRef, HTMLProps } from 'react'
import Trash from 'heroicons/react/outline/Trash'
import Menu from 'heroicons/react/outline/Menu'
import Plus from 'heroicons/react/outline/Plus'
import DotsHorizontal from 'heroicons/react/outline/DotsHorizontal'
import ChevronRight from 'heroicons/react/outline/ChevronRight'
import Reply from 'heroicons/react/outline/Reply'
import PaperAirplane from 'heroicons/react/outline/PaperAirplane'

export const ICONS = {
  Trash,
  Menu,
  Plus,
  DotsHorizontal,
  ChevronRight,
  Reply,
  PaperAirplane,
}

const IconButton = forwardRef<
  HTMLSpanElement,
  HTMLProps<HTMLSpanElement> & {
    icon: keyof typeof ICONS
    iconClassName?: string
  }
>(({ children, className, iconClassName = '', icon, ...attrs }, ref) => {
  const Icon = ICONS[icon]

  return (
    <span
      ref={ref}
      {...attrs}
      className={classNames(
        'p-0.5 rounded hover:bg-gray-400 cursor-pointer w-5 h-5',
        className
      )}
    >
      <Icon className={iconClassName}></Icon>
      {children}
    </span>
  )
})

export default IconButton
