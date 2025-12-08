import { FC } from 'react';
import { Block, BlockType } from 'libs/shared/block';
import ParagraphBlock from './paragraph-block';
import HeadingBlock from './heading-block';
import ListBlock from './list-block';
import CalloutBlock from './callout-block';
import ToggleBlock from './toggle-block';
import BlockState from 'libs/web/state/block';

export interface BlockComponentProps {
  block: Block;
  isSelected?: boolean;
  isEditable?: boolean;
  onSelect?: () => void;
  onUpdate?: (data: any) => void;
  onDelete?: () => void;
  onAddBlock?: (type: BlockType, data?: any) => void;
}

const BlockRenderer: FC<BlockComponentProps> = ({
  block,
  isSelected = false,
  isEditable = true,
  onSelect,
  onUpdate,
  onDelete,
  onAddBlock,
}) => {
  const blockState = BlockState.useContainer();

  const renderBlock = () => {
    const commonProps = {
      block,
      isSelected,
      isEditable,
      onSelect,
      onUpdate,
      onDelete,
      onAddBlock,
    };

  switch (block.type) {
    case BlockType.PARAGRAPH:
      return <ParagraphBlock {...commonProps} />;
    case BlockType.HEADING_1:
    case BlockType.HEADING_2:
    case BlockType.HEADING_3:
      return <HeadingBlock {...commonProps} />;
    case BlockType.BULLETED_LIST:
    case BlockType.NUMBERED_LIST:
    case BlockType.TODO_LIST:
      return <ListBlock {...commonProps} />;
    case BlockType.CALLOUT:
      return <CalloutBlock {...commonProps} />;
    case BlockType.TOGGLE:
      return <ToggleBlock {...commonProps} />;
    case BlockType.EQUATION:
    case BlockType.DATABASE:
    case BlockType.CODE:
    case BlockType.QUOTE:
    case BlockType.DIVIDER:
    case BlockType.IMAGE:
      return <ParagraphBlock {...commonProps} />;
    default:
      return <ParagraphBlock {...commonProps} />;
  }
  };

  return (
    <div
      className={`block-renderer ${isSelected ? 'selected' : ''} ${block.type}`}
      onClick={onSelect}
    >
      <div className="block-content">
        {renderBlock()}
      </div>
      {block.children.length > 0 && (
        <div className="block-children">
          {block.children.map(child => (
            <BlockRenderer
              key={child.id}
              block={child}
              isSelected={false}
              isEditable={isEditable}
              onSelect={() => blockState.selectBlock(child.id)}
              onUpdate={(data) => blockState.updateBlock(child.id, { data })}
              onDelete={() => blockState.deleteBlock(child.id)}
              onAddBlock={onAddBlock}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default BlockRenderer;
