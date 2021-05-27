import classNames from 'classnames'
import { forwardRef, HTMLProps } from 'react'
import Trash from 'heroicons/react/outline/Trash'
import Menu from 'heroicons/react/outline/Menu'
import Plus from 'heroicons/react/outline/Plus'
import DotsHorizontal from 'heroicons/react/outline/DotsHorizontal'
import ChevronRight from 'heroicons/react/outline/ChevronRight'
import Reply from 'heroicons/react/outline/Reply'
import Share from 'heroicons/react/outline/Share'
import Duplicate from 'heroicons/react/outline/Duplicate'
import Document from 'heroicons/react/outline/Document'
import DocumentText from 'heroicons/react/outline/DocumentText'
import Link from 'heroicons/react/outline/Link'
import Selector from 'heroicons/react/outline/Selector'

export const ICONS = {
  Trash,
  Menu,
  Plus,
  DotsHorizontal,
  ChevronRight,
  Reply,
  Share,
  Duplicate,
  Document,
  DocumentText,
  Selector,
  Link,
}

const IconButton = forwardRef<
  HTMLSpanElement,
  HTMLProps<HTMLSpanElement> & {
    icon: keyof typeof ICONS
    iconClassName?: string
    rounded?: boolean
  }
>(
  (
    { children, rounded = true, className, iconClassName = '', icon, ...attrs },
    ref
  ) => {
    const Icon = ICONS[icon]

    return (
      <span
        ref={ref}
        {...attrs}
        className={classNames(
          'block p-0.5 hover:bg-gray-400 cursor-pointer w-7 h-7 md:w-6 md:h-6',
          { rounded },
          className
        )}
      >
        <Icon className={classNames(iconClassName)}></Icon>
        {children}
      </span>
    )
  }
)

export default IconButton
