import { FC, useState, useRef, useEffect } from 'react';
import { BlockComponentProps } from './block-renderer';
import { BlockType } from 'libs/shared/block';
import BlockState from 'libs/web/state/block';
import SlashMenu from './slash-menu';
import { createPortal } from 'react-dom';

const ParagraphBlock: FC<BlockComponentProps> = ({
    block,
    isSelected,
    isEditable,
    onSelect,
    onUpdate,
    onDelete,
    onAddBlock,
}) => {
    const { updateBlock } = BlockState.useContainer();
    const [content, setContent] = useState(block.data.text || '');
    const [menuOpen, setMenuOpen] = useState(false);
    const [menuQuery, setMenuQuery] = useState('');
    const [menuPos, setMenuPos] = useState({ x: 0, y: 0 });
    
    const contentRef = useRef(block.data.text || '');
    const editableRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        contentRef.current = content;
    }, [content]);

    // Close menu if clicked outside
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (menuOpen && editableRef.current && !editableRef.current.contains(e.target as Node)) {
                setMenuOpen(false);
            }
        };
        window.addEventListener('click', handleClickOutside);
        return () => window.removeEventListener('click', handleClickOutside);
    }, [menuOpen]);

    const handleInput = (evt: React.FormEvent<HTMLDivElement>) => {
        const newContent = evt.currentTarget.textContent || '';
        setContent(newContent);
        contentRef.current = newContent;

        if (menuOpen) {
            if (!newContent.startsWith('/')) {
                setMenuOpen(false);
            } else {
                setMenuQuery(newContent.substring(1));
            }
        }

        if (onUpdate) {
            onUpdate({ text: newContent });
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (menuOpen) {
            if (e.key === 'ArrowUp' || e.key === 'ArrowDown' || e.key === 'Enter') {
                // Let SlashMenu handle these via its window listener or we need to coordinate
                // Since SlashMenu uses window listener, we just prevent default here to stop cursor movement
                if (e.key !== 'Enter') e.preventDefault(); 
                return;
            }
            if (e.key === 'Escape') {
                e.preventDefault();
                setMenuOpen(false);
                return;
            }
        }

        if (e.key === '/' && content === '') {
            // Trigger menu
            const selection = window.getSelection();
            if (selection && selection.rangeCount > 0) {
                const range = selection.getRangeAt(0);
                const rect = range.getBoundingClientRect();
                setMenuPos({ x: rect.left, y: rect.bottom });
                setMenuOpen(true);
                setMenuQuery('');
            }
            // Allow the '/' to be typed
            return;
        }

        if (e.key === 'Backspace' && content === '') {
            e.preventDefault();
            if (onDelete) {
                onDelete();
            }
            return;
        }

        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            if (onAddBlock) {
                onAddBlock(BlockType.PARAGRAPH);
            }
            return;
        }

        if (e.key === 'Tab') {
            e.preventDefault();
            return;
        }
    };

    const handleMenuSelect = (type: BlockType) => {
        // Convert this block to the selected type
        updateBlock(block.id, { 
            type, 
            data: { ...block.data, text: '' } // Clear text (remove the slash)
        });
        setMenuOpen(false);
    };

    const handleFocus = () => {
        if (onSelect) {
            onSelect();
        }
    };

    return (
        <div
            className={`paragraph-block ${isSelected ? 'selected' : ''}`}
            onFocus={handleFocus}
        >
            <style jsx>{`
                .paragraph-content {
                    min-height: 1.5rem;
                    line-height: 1.5rem;
                    outline: none;
                    border: 0;
                    background: transparent;
                    width: 100%;
                    white-space: pre-wrap;
                    word-break: break-word;
                }
                .paragraph-content:empty:before {
                    content: attr(data-placeholder);
                    color: #9ca3af;
                    pointer-events: none;
                }
            `}</style>
            <div
                ref={editableRef}
                contentEditable={isEditable}
                onInput={handleInput}
                onKeyDown={handleKeyDown}
                className="paragraph-content"
                data-placeholder="Type '/' for commands"
            >
                {content}
            </div>
            {menuOpen && typeof document !== 'undefined' && createPortal(
                <SlashMenu 
                    isOpen={menuOpen}
                    position={menuPos}
                    onClose={() => setMenuOpen(false)}
                    onSelect={handleMenuSelect}
                    query={menuQuery}
                />,
                document.body
            )}
        </div>
    );
};

export default ParagraphBlock;
