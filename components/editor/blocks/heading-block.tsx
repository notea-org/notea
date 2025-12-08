import { FC, useState, useRef, useEffect } from 'react';
import { BlockComponentProps } from './block-renderer';
import { BlockType } from 'libs/shared/block';
 

const HeadingBlock: FC<BlockComponentProps> = ({
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

    const getHeadingLevel = () => {
        switch (block.type) {
            case BlockType.HEADING_1:
                return 1;
            case BlockType.HEADING_2:
                return 2;
            case BlockType.HEADING_3:
                return 3;
            default:
                return 1;
        }
    };

    

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
      if (onAddBlock) {
        onAddBlock(BlockType.PARAGRAPH);
      }
            return;
        }

        if (e.key === 'Backspace' && content === '') {
            e.preventDefault();
            if (onDelete) {
                onDelete();
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
            className={`heading-block heading-${getHeadingLevel()} ${isSelected ? 'selected' : ''}`}
            onFocus={handleFocus}
        >
      <div
        ref={editableRef}
        contentEditable={isEditable}
        onInput={(evt: React.FormEvent<HTMLDivElement>) => {
          const newContent = evt.currentTarget.textContent || '';
          setContent(newContent);
          contentRef.current = newContent;
          if (onUpdate) {
            onUpdate({ text: newContent });
          }
        }}
        onKeyDown={handleKeyDown}
        className="heading-content"
        data-placeholder={`Heading ${getHeadingLevel()}`}
      >
        {content}
      </div>
        </div>
    );
};

export default HeadingBlock;
