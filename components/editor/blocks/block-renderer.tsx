import { FC } from 'react';
import { Block, BlockType } from 'libs/shared/block';
import ParagraphBlock from './paragraph-block';
import HeadingBlock from './heading-block';
import ListBlock from './list-block';
import CalloutBlock from './callout-block';
import ToggleBlock from './toggle-block';
import DatabaseBlock from './database-block';
import BlockState from 'libs/web/state/block';
import {
    SortableContext,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import SortableBlockWrapper from './sortable-block-wrapper';

export interface BlockComponentProps {
    block: Block;
    isSelected?: boolean;
    isEditable?: boolean;
    onSelect?: () => void;
    onUpdate?: (data: any) => void;
    onDelete?: () => void;
    onAddBlock?: (type: BlockType, data?: any) => void;
    dragHandleProps?: any;
}

const BlockRenderer: FC<BlockComponentProps> = ({
    block,
    isSelected = false,
    isEditable = true,
    onSelect,
    onUpdate,
    onDelete,
    onAddBlock,
    dragHandleProps,
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
            case BlockType.DATABASE:
                return <DatabaseBlock {...commonProps} />;
            case BlockType.DATABASE_ROW:
                return null;
            case BlockType.EQUATION:
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
            className={`block-renderer w-full relative ${
                isSelected ? 'selected' : ''
            } ${block.type}`}
            onClick={onSelect}
        >
            {dragHandleProps && (
                <div
                    className="drag-handle absolute left-[-1.5rem] top-0.5 p-1 opacity-0 group-hover:opacity-100 cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600 rounded hover:bg-gray-100 transition-opacity"
                    contentEditable={false}
                    {...dragHandleProps}
                >
                    <svg
                        width="12"
                        height="20"
                        viewBox="0 0 6 10"
                        fill="currentColor"
                    >
                        <circle cx="1" cy="1" r="1" />
                        <circle cx="1" cy="5" r="1" />
                        <circle cx="1" cy="9" r="1" />
                        <circle cx="5" cy="1" r="1" />
                        <circle cx="5" cy="5" r="1" />
                        <circle cx="5" cy="9" r="1" />
                    </svg>
                </div>
            )}
            <div className="block-content">{renderBlock()}</div>
            {block.children.length > 0 && block.type !== BlockType.TOGGLE && block.type !== BlockType.DATABASE && (
                <div className="block-children">
                    <SortableContext
                        items={block.children.map((child) => child.id)}
                        strategy={verticalListSortingStrategy}
                        id={block.id}
                    >
                        {block.children.map((child) => (
                            <SortableBlockWrapper
                                key={child.id}
                                block={child}
                                isSelected={false}
                                isEditable={isEditable}
                                onSelect={() =>
                                    blockState.selectBlock(child.id)
                                }
                                onUpdate={(data) =>
                                    blockState.updateBlock(child.id, { data })
                                }
                                onDelete={() =>
                                    blockState.deleteBlock(child.id)
                                }
                                onAddBlock={onAddBlock}
                            />
                        ))}
                    </SortableContext>
                </div>
            )}
            <style jsx>{`
                .block-children {
                    margin-left: 1.5rem;
                }
            `}</style>
        </div>
    );
};

export default BlockRenderer;
