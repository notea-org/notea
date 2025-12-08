import { FC, useEffect, useState, useRef } from 'react';
import { BlockType } from 'libs/shared/block';

interface SlashMenuProps {
    isOpen: boolean;
    position: { x: number; y: number };
    onClose: () => void;
    onSelect: (type: BlockType) => void;
    query: string;
}

interface MenuItem {
    type: BlockType;
    label: string;
    description: string;
    icon: string;
}

const MENU_ITEMS: MenuItem[] = [
    {
        type: BlockType.PARAGRAPH,
        label: 'Text',
        description: 'Just start writing with plain text.',
        icon: '📝',
    },
    {
        type: BlockType.HEADING_1,
        label: 'Heading 1',
        description: 'Big section heading.',
        icon: 'H1',
    },
    {
        type: BlockType.HEADING_2,
        label: 'Heading 2',
        description: 'Medium section heading.',
        icon: 'H2',
    },
    {
        type: BlockType.HEADING_3,
        label: 'Heading 3',
        description: 'Small section heading.',
        icon: 'H3',
    },
    {
        type: BlockType.BULLETED_LIST,
        label: 'Bulleted List',
        description: 'Create a simple bulleted list.',
        icon: '•',
    },
    {
        type: BlockType.NUMBERED_LIST,
        label: 'Numbered List',
        description: 'Create a list with numbering.',
        icon: '1.',
    },
    {
        type: BlockType.TODO_LIST,
        label: 'To-do List',
        description: 'Track tasks with a to-do list.',
        icon: '☐',
    },
    {
        type: BlockType.QUOTE,
        label: 'Quote',
        description: 'Capture a quote.',
        icon: '❝',
    },
    {
        type: BlockType.DIVIDER,
        label: 'Divider',
        description: 'Visually divide blocks.',
        icon: '―',
    },
    {
        type: BlockType.CALLOUT,
        label: 'Callout',
        description: 'Make writing stand out.',
        icon: '💡',
    },
    {
        type: BlockType.TOGGLE,
        label: 'Toggle List',
        description: 'Toggles can hide and show content inside.',
        icon: '▶',
    },
    {
        type: BlockType.DATABASE,
        label: 'Database - Table',
        description: 'Create a database with custom properties.',
        icon: '📅',
    },
];

const SlashMenu: FC<SlashMenuProps> = ({ isOpen, position, onClose, onSelect, query }) => {
    const [selectedIndex, setSelectedIndex] = useState(0);
    const menuRef = useRef<HTMLDivElement>(null);

    const filteredItems = MENU_ITEMS.filter((item) =>
        item.label.toLowerCase().includes(query.toLowerCase())
    );

    useEffect(() => {
        setSelectedIndex(0);
    }, [query]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!isOpen) return;

            if (e.key === 'ArrowDown') {
                e.preventDefault();
                setSelectedIndex((prev) =>
                    prev < filteredItems.length - 1 ? prev + 1 : 0
                );
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                setSelectedIndex((prev) =>
                    prev > 0 ? prev - 1 : filteredItems.length - 1
                );
            } else if (e.key === 'Enter') {
                e.preventDefault();
                if (filteredItems[selectedIndex]) {
                    onSelect(filteredItems[selectedIndex].type);
                }
            } else if (e.key === 'Escape') {
                e.preventDefault();
                onClose();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, filteredItems, selectedIndex, onSelect, onClose]);

    if (!isOpen) return null;

    if (filteredItems.length === 0) {
        return (
             <div
                ref={menuRef}
                className="fixed z-50 w-64 bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden"
                style={{
                    top: position.y + 24,
                    left: position.x,
                    maxHeight: '300px',
                }}
            >
                <div className="p-3 text-sm text-gray-500">No matching blocks</div>
            </div>
        );
    }

    return (
        <div
            ref={menuRef}
            className="fixed z-50 w-72 bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden flex flex-col"
            style={{
                top: position.y + 24,
                left: position.x,
                maxHeight: '300px',
            }}
        >
            <div className="overflow-y-auto py-1">
                {filteredItems.map((item, index) => (
                    <button
                        key={item.type}
                        className={`w-full px-3 py-2 text-left flex items-center space-x-3 hover:bg-gray-100 ${
                            index === selectedIndex ? 'bg-gray-100' : ''
                        }`}
                        onClick={() => onSelect(item.type)}
                        onMouseEnter={() => setSelectedIndex(index)}
                    >
                        <div className="flex-shrink-0 w-10 h-10 border border-gray-200 rounded flex items-center justify-center bg-white text-gray-600 font-medium text-lg">
                            {item.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium text-gray-900">
                                {item.label}
                            </div>
                            <div className="text-xs text-gray-500 truncate">
                                {item.description}
                            </div>
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default SlashMenu;
