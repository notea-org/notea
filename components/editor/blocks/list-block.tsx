import { FC, useState } from 'react';
import { BlockComponentProps } from './block-renderer';
import { BlockType } from 'libs/shared/block';
 

interface ListItem {
  id: string;
  text: string;
  checked?: boolean;
}

const ListBlock: FC<BlockComponentProps> = ({
    block,
    isSelected,
    isEditable,
    onSelect,
    onUpdate,
    onDelete,
    onAddBlock,
}) => {
    const [items, setItems] = useState<ListItem[]>(
        block.data.items || [{ id: '1', text: '', checked: false }]
    );

    const getListType = () => {
        switch (block.type) {
            case BlockType.BULLETED_LIST:
                return 'bulleted';
            case BlockType.NUMBERED_LIST:
                return 'numbered';
            case BlockType.TODO_LIST:
                return 'todo';
            default:
                return 'bulleted';
        }
    };

    const handleItemChange = (itemId: string, text: string) => {
        const newItems = items.map(item =>
            item.id === itemId ? { ...item, text } : item
        );
        setItems(newItems);

        if (onUpdate) {
            onUpdate({ items: newItems });
        }
    };

    const handleItemCheck = (itemId: string, checked: boolean) => {
        if (getListType() !== 'todo') return;

        const newItems = items.map(item =>
            item.id === itemId ? { ...item, checked } : item
        );
        setItems(newItems);

        if (onUpdate) {
            onUpdate({ items: newItems });
        }
    };

    const addItem = () => {
        const newItem: ListItem = {
            id: Date.now().toString(),
            text: '',
            checked: false,
        };
        const newItems = [...items, newItem];
        setItems(newItems);

        if (onUpdate) {
            onUpdate({ items: newItems });
        }
    };

    const removeItem = (itemId: string) => {
        if (items.length <= 1) {
            if (onDelete) {
                onDelete();
            }
            return;
        }

        const newItems = items.filter(item => item.id !== itemId);
        setItems(newItems);

        if (onUpdate) {
            onUpdate({ items: newItems });
        }
    };

    const handleItemKeyDown = (e: React.KeyboardEvent, itemId: string, currentText: string) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();

            if (currentText === '' && items.length > 1) {
                removeItem(itemId);
                if (onAddBlock) {
                    onAddBlock(BlockType.PARAGRAPH);
                }
            } else {
                addItem();
            }
            return;
        }

        if (e.key === 'Backspace' && currentText === '') {
            e.preventDefault();
            removeItem(itemId);
            return;
        }

        if (e.key === 'Tab') {
            e.preventDefault();
            return;
        }
    };

    const renderListItem = (item: ListItem, index: number) => {
        const listType = getListType();

        return (
            <div key={item.id} className="list-item">
                <div className="list-item-marker">
                    {listType === 'bulleted' && (
                        <span className="bullet">•</span>
                    )}
                    {listType === 'numbered' && (
                        <span className="number">{index + 1}.</span>
                    )}
                    {listType === 'todo' && (
                        <input
                            type="checkbox"
                            checked={item.checked || false}
                            onChange={(e) => handleItemCheck(item.id, e.target.checked)}
                            disabled={!isEditable}
                            className="todo-checkbox"
                        />
                    )}
                </div>
                <div
                    contentEditable={isEditable}
                    onInput={(e: React.FormEvent<HTMLDivElement>) => handleItemChange(item.id, e.currentTarget.textContent || '')}
                    onKeyDown={(e: React.KeyboardEvent<HTMLDivElement>) => handleItemKeyDown(e, item.id, item.text)}
                    className={`list-item-content ${item.checked ? 'checked' : ''}`}
                    data-placeholder="List item"
                >
                    {item.text}
                </div>
            </div>
        );
    };

    return (
        <div
            className={`list-block ${getListType()}-list ${isSelected ? 'selected' : ''}`}
            onClick={onSelect}
        >
            <style jsx>{`
                .list-item {
                    display: flex;
                    align-items: flex-start;
                    gap: 0.5rem;
                }
                .list-item-marker {
                    width: 1.25rem;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    flex-shrink: 0;
                }
                .list-item-content {
                    min-height: 1.5rem;
                    line-height: 1.5rem;
                    outline: none;
                    border: 0;
                    background: transparent;
                    white-space: pre-wrap;
                    word-break: break-word;
                    flex: 1;
                }
                .list-item-content:empty:before {
                    content: 'List item';
                    color: #9ca3af;
                    pointer-events: none;
                }
                .list-item-content.checked {
                    text-decoration: line-through;
                    color: #6b7280;
                }
            `}</style>
            {items.map((item, index) => renderListItem(item, index))}
        </div>
    );
};

export default ListBlock;
