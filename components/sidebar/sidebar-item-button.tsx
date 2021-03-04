import classNames from 'classnames'
import { forwardRef, HTMLProps } from 'react'

const SidebarItemButton = forwardRef<
  HTMLSpanElement,
  HTMLProps<HTMLSpanElement>
>(({ children, className, ...attrs }, ref) => {
  return (
    <span
      ref={ref}
      {...attrs}
      className={classNames(
        'p-0.5 rounded hover:bg-gray-400 cursor-pointer',
        className
      )}
    >
      {children}
    </span>
  )
})

export default SidebarItemButton
