import classNames from 'classnames';
import { forwardRef, HTMLProps, useCallback, MouseEvent } from 'react';
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
    ExternalLinkIcon,
    BookmarkAltIcon,
    PuzzleIcon,
    ChevronDoubleUpIcon,
    RefreshIcon,
} from '@heroicons/react/outline';

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
    ExternalLink: ExternalLinkIcon,
    BookmarkAlt: BookmarkAltIcon,
    Puzzle: PuzzleIcon,
    ChevronDoubleUp: ChevronDoubleUpIcon,
    Refresh: RefreshIcon,
};

const IconButton = forwardRef<
    HTMLSpanElement,
    HTMLProps<HTMLSpanElement> & {
        icon: keyof typeof ICONS;
        iconClassName?: string;
        rounded?: boolean;
    }
>(
    (
        {
            children,
            rounded = true,
            className,
            iconClassName = '',
            icon,
            disabled,
            onClick,
            ...attrs
        },
        ref
    ) => {
        const Icon = ICONS[icon];

        const handleClick = useCallback(
            (event: MouseEvent<HTMLSpanElement>) => {
                if (!disabled && onClick) {
                    onClick(event);
                }
            },
            [disabled, onClick]
        );

        return (
            <span
                ref={ref}
                onClick={handleClick}
                {...attrs}
                className={classNames(
                    'block p-0.5 cursor-pointer w-7 h-7 md:w-6 md:h-6',
                    {
                        rounded,
                        'cursor-not-allowed opacity-20': disabled,
                    },
                    !disabled && 'hover:bg-gray-400',
                    className
                )}
            >
                <Icon className={classNames(iconClassName)}></Icon>
                {children}
            </span>
        );
    }
);

export default IconButton;
