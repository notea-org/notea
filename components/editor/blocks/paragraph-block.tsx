import { FC, useState, useRef, useEffect } from 'react';
import { BlockComponentProps } from './block-renderer';
import { BlockType } from 'libs/shared/block';

const ParagraphBlock: FC<BlockComponentProps> = ({
    block,
    isSelected,
    isEditable,
    onSelect,
    onUpdate,
    onDelete,
    onAddBlock,
}) => {
    const [content, setContent] = useState(block.data.text || '');
    const contentRef = useRef(block.data.text || '');
    const editableRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        contentRef.current = content;
    }, [content]);

    const handleInput = (evt: React.FormEvent<HTMLDivElement>) => {
        const newContent = evt.currentTarget.textContent || '';
        setContent(newContent);
        contentRef.current = newContent;
        
        if (onUpdate) {
            onUpdate({ text: newContent });
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === '/' && content === '') {
            e.preventDefault();
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
        </div>
    );
};

export default ParagraphBlock;
