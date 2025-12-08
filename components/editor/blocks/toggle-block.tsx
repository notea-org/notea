import { FC, useState, useRef, useCallback } from 'react';
import BlockRenderer, { BlockComponentProps } from './block-renderer';
import { BlockType } from 'libs/shared/block';
import BlockState from 'libs/web/state/block';

const ToggleBlock: FC<BlockComponentProps> = ({
    block,
    isSelected,
    isEditable,
    onSelect,
    onUpdate,
    onDelete,
}) => {
    const blockState = BlockState.useContainer();
    const { createBlock, updateBlock, deleteBlock } = blockState;
    const [isExpanded, setIsExpanded] = useState(block.data.expanded !== false);
    const [title, setTitle] = useState(block.data.text || '');

    const contentRef = useRef(block.data.text || '');

    const handleTitleInput = (evt: React.FormEvent<HTMLDivElement>) => {
        const newTitle = evt.currentTarget.textContent || '';
        setTitle(newTitle);
        contentRef.current = newTitle;
        
        if (onUpdate) {
            onUpdate({ text: newTitle, expanded: isExpanded });
        }
    };

    const handleToggle = () => {
        const newExpanded = !isExpanded;
        setIsExpanded(newExpanded);
        
        if (onUpdate) {
            onUpdate({ text: title, expanded: newExpanded });
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            // Create new paragraph block after toggle
            return;
        }

        if (e.key === 'Backspace' && title === '') {
            e.preventDefault();
            if (onDelete) {
                onDelete();
            }
        }

        // Tab key when empty - convert to paragraph
        if (e.key === 'Tab' && title === '') {
            e.preventDefault();
            // Convert to paragraph block
            return;
        }
    };

    const addChildBlock = useCallback(() => {
        createBlock(BlockType.PARAGRAPH, { text: '' }, block.id);
        
        if (onUpdate) {
            onUpdate({ text: title, expanded: isExpanded });
        }
    }, [createBlock, block.id, title, isExpanded, onUpdate]);

    return (
        <>
            <style jsx>{`
                .toggle-block.selected {
                    background-color: #f3f4f6;
                    border-color: #d1d5db;
                }
                .toggle-title {
                    min-height: 1.5rem;
                    line-height: 1.5rem;
                }
                .toggle-title:empty:before {
                    content: attr(placeholder);
                    color: #9ca3af;
                    pointer-events: none;
                }
                .toggle-arrow {
                    transition: transform 0.2s ease;
                }
                .toggle-arrow:hover {
                    background-color: #f3f4f6;
                }
                .toggle-child {
                    margin-left: 1.75rem;
                }
                .add-child-btn {
                    transition: all 0.2s ease;
                }
                .add-child-btn:hover {
                    background-color: #f9fafb;
                }
            `}</style>
            <div
                className={`toggle-block ${isSelected ? 'selected' : ''} border border-transparent hover:border-gray-200 rounded-lg p-2 transition-colors`}
                onClick={onSelect}
            >
                <div className="toggle-header flex items-center gap-2">
                    <button
                        className={`toggle-arrow w-5 h-5 flex items-center justify-center rounded hover:bg-gray-100 transition-colors ${
                            isExpanded ? 'transform rotate-90' : ''
                        }`}
                        onClick={handleToggle}
                        disabled={!isEditable}
                    >
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
                            <path d="M4.5 2L8.5 6L4.5 10" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round"/>
                        </svg>
                    </button>
                    
                    <div
                        contentEditable={isEditable}
                        onInput={handleTitleInput}
                        onKeyDown={handleKeyDown}
                        className="toggle-title flex-1 outline-none"
                        data-placeholder="Toggle heading..."
                    >
                        {title}
                    </div>
                </div>
                
                {isExpanded && (
                    <div className="toggle-content ml-7 mt-2">
                        {block.children.map((child) => (
                            <div key={child.id} className="toggle-child mb-2">
                                <BlockRenderer
                                    block={child}
                                    isSelected={false}
                                    isEditable={isEditable}
                                    onSelect={() => blockState.selectBlock(child.id)}
                                    onUpdate={(data) => updateBlock(child.id, { data })}
                                    onDelete={() => deleteBlock(child.id)}
                                />
                            </div>
                        ))}
                        
                        {isEditable && (
                            <button
                                className="add-child-btn text-sm text-gray-500 hover:text-gray-700 p-2 rounded hover:bg-gray-100"
                                onClick={addChildBlock}
                            >
                                + Add content
                            </button>
                        )}
                    </div>
                )}
            </div>
        </>
    );
};

export default ToggleBlock;
