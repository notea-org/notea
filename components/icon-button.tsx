import classNames from 'classnames'
import { forwardRef, HTMLProps } from 'react'
import {
  TrashIcon,
  MenuIcon,
  PlusIcon,
  DotsHorizontalIcon,
  ChevronRightIcon,
  ReplyIcon,
  ShareIcon,
  DuplicateIcon,
  DocumentIcon,
  DocumentTextIcon,
  SelectorIcon,
  LinkIcon,
  ArrowSmLeftIcon,
  ArrowSmRightIcon,
} from '@heroicons/react/outline'

export const ICONS = {
  Trash: TrashIcon,
  Menu: MenuIcon,
  Plus: PlusIcon,
  DotsHorizontal: DotsHorizontalIcon,
  ChevronRight: ChevronRightIcon,
  Reply: ReplyIcon,
  Share: ShareIcon,
  Duplicate: DuplicateIcon,
  Document: DocumentIcon,
  DocumentText: DocumentTextIcon,
  Selector: SelectorIcon,
  Link: LinkIcon,
  ArrowSmLeft: ArrowSmLeftIcon,
  ArrowSmRight: ArrowSmRightIcon,
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
