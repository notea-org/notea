import { FC, useRef } from 'react';
import classNames from 'classnames';
import useScrollView from 'libs/web/hooks/use-scroll-view';
import { ReactNodeLike } from 'prop-types';

export interface Command {
    id: string;
    title: string;
    icon?: ReactNodeLike;
    action: () => void;
    shortcut?: string[];
    description?: string;
}

const CommandItem: FC<{
    command: Command;
    selected?: boolean;
    onClick?: () => void;
}> = ({ command, selected, onClick }) => {
    const ref = useRef<HTMLLIElement>(null);
    useScrollView(ref, selected);

    return (
        <li
            ref={ref}
            className={classNames('hover:bg-gray-200 cursor-pointer flex items-center justify-between py-2 px-4', {
                'bg-gray-300': selected,
            })}
            onClick={onClick}
        >
            <div className="flex items-center space-x-3 overflow-hidden">
                {command.icon && <span className="text-gray-500">{command.icon}</span>}
                <div className="flex flex-col">
                    <span className="text-sm font-medium text-gray-800">{command.title}</span>
                    {command.description && (
                        <span className="text-xs text-gray-500 truncate">{command.description}</span>
                    )}
                </div>
            </div>
            {command.shortcut && (
                <div className="flex items-center space-x-1">
                    {command.shortcut.map((key, index) => (
                        <kbd
                            key={index}
                            className="bg-gray-200 border border-gray-300 rounded px-1 text-xs text-gray-500 font-sans"
                        >
                            {key}
                        </kbd>
                    ))}
                </div>
            )}
        </li>
    );
};

export default CommandItem;
