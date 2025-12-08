import React, { FC } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Block } from 'libs/shared/block';
import BlockRenderer, { BlockComponentProps } from './block-renderer';

interface SortableBlockWrapperProps extends BlockComponentProps {
    block: Block;
}

const SortableBlockWrapper: FC<SortableBlockWrapperProps> = (props) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: props.block.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
        zIndex: isDragging ? 999 : 'auto',
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className="sortable-block-wrapper relative group"
        >
            <BlockRenderer
                {...props}
                dragHandleProps={{ ...attributes, ...listeners }}
            />
        </div>
    );
};

export default SortableBlockWrapper;
