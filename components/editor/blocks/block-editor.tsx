import React, { FC, useState } from 'react';
import { Block } from 'libs/shared/block';
import {
    DndContext,
    closestCorners,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent,
    DragOverEvent,
    DragStartEvent,
    DragOverlay,
    defaultDropAnimationSideEffects,
    DropAnimation,
} from '@dnd-kit/core';
import {
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import BlockState from 'libs/web/state/block';
import SortableBlockWrapper from './sortable-block-wrapper';
import BlockRenderer from './block-renderer';
import { createPortal } from 'react-dom';
import { useHotkeys } from 'react-hotkeys-hook';

const dropAnimation: DropAnimation = {
    sideEffects: defaultDropAnimationSideEffects({
        styles: {
            active: {
                opacity: '0.5',
            },
        },
    }),
};

interface BlockEditorProps {
    roots?: string[];
    parentId?: string;
}

const BlockEditor: FC<BlockEditorProps> = ({ roots, parentId }) => {
    const blockState = BlockState.useContainer();
    const { rootBlocks: contextRootBlocks, blocks, moveBlock, createBlock, updateBlock, deleteBlock, duplicateBlock, selectBlock, selectedBlockIds } = blockState;
    const rootBlocks = roots || contextRootBlocks;
    const containerId = parentId || 'root';
    const [activeId, setActiveId] = useState<string | null>(null);

    // Keyboard shortcuts
    useHotkeys('mod+shift+up', (e) => {
        e.preventDefault();
        const selectedId = selectedBlockIds[0];
        if (!selectedId) return;
        const block = blocks[selectedId];
        if (!block) return;
        
        const parent = block.parentId ? blocks[block.parentId] : null;
        const siblings = parent ? parent.children : rootBlocks.map((id: string) => blocks[id]).filter((b: Block | undefined): b is Block => !!b);
        const index = siblings.findIndex((b: Block) => b.id === selectedId);
        
        if (index > 0) {
            moveBlock(selectedId, block.parentId, index - 1);
        }
    }, { enableOnTags: ['INPUT', 'TEXTAREA', 'SELECT'] }, [selectedBlockIds, blocks, rootBlocks, moveBlock]);

    useHotkeys('mod+shift+down', (e) => {
        e.preventDefault();
        const selectedId = selectedBlockIds[0];
        if (!selectedId) return;
        const block = blocks[selectedId];
        if (!block) return;
        
        const parent = block.parentId ? blocks[block.parentId] : null;
        const siblings = parent ? parent.children : rootBlocks.map((id: string) => blocks[id]).filter((b: Block | undefined): b is Block => !!b);
        const index = siblings.findIndex((b: Block) => b.id === selectedId);
        
        if (index < siblings.length - 1) {
            moveBlock(selectedId, block.parentId, index + 1);
        }
    }, { enableOnTags: ['INPUT', 'TEXTAREA', 'SELECT'] }, [selectedBlockIds, blocks, rootBlocks, moveBlock]);

    useHotkeys('mod+d', (e) => {
        e.preventDefault();
        const selectedId = selectedBlockIds[0];
        if (!selectedId) return;
        
        duplicateBlock(selectedId);
    }, { enableOnTags: ['INPUT', 'TEXTAREA', 'SELECT'] }, [selectedBlockIds, duplicateBlock]);

    useHotkeys('mod+backspace, mod+delete', (e) => {
        // Only delete if block is selected and not editing text (handled by block itself usually)
        // But mod+backspace is explicit block delete command
        e.preventDefault();
        const selectedId = selectedBlockIds[0];
        if (!selectedId) return;
        deleteBlock(selectedId);
    }, { enableOnTags: ['INPUT', 'TEXTAREA', 'SELECT'] }, [selectedBlockIds, deleteBlock]);

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleDragStart = (event: DragStartEvent) => {
        setActiveId(event.active.id as string);
    };

    const handleDragOver = (_event: DragOverEvent) => {
        // Optional: Add logic for realtime drag feedback across containers if needed
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        setActiveId(null);

        if (!over) return;

        const activeBlockId = active.id as string;
        const overBlockId = over.id as string;

        if (activeBlockId === overBlockId) return;

        // Determine the container of the 'over' item
        // If over.id is a container ID (like 'root' or a block ID), we drop INTO it.
        // If over.id is an item ID, we drop NEXT TO it.

        // In our case, SortableContext IDs are 'root' or block IDs.
        // Sortable items have block IDs.

        // dnd-kit's 'over' usually refers to the droppable container OR the sortable item.
        // If we drop on a Sortable item, over.id is the item ID.
        // We can get the container ID from over.data.current.sortable.containerId

        const overSortable = over.data.current?.sortable;
        const activeSortable = active.data.current?.sortable;

        if (!overSortable || !activeSortable) return;

        const overContainerId = overSortable.containerId;
        const activeContainerId = activeSortable.containerId;
        const overIndex = overSortable.index;

        // Prepare arguments for moveBlock
        let newParentId: string | undefined = parentId;
        if (overContainerId !== containerId) {
            newParentId = overContainerId;
        }

        // If moving within same container
        if (activeContainerId === overContainerId) {
            moveBlock(activeBlockId, newParentId, overIndex);
        } else {
            // Moving to different container
            moveBlock(activeBlockId, newParentId, overIndex);
        }
    };

    const activeBlock = activeId ? blocks[activeId] : null;

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCorners}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragEnd={handleDragEnd}
        >
            <div className="block-editor w-full">
                <SortableContext
                    items={rootBlocks}
                    strategy={verticalListSortingStrategy}
                    id={containerId}
                >
                    {rootBlocks.map((blockId: string) => {
                        const block = blocks[blockId];
                        if (!block) return null;
                        return (
                            <SortableBlockWrapper
                                key={block.id}
                                block={block}
                                isSelected={false}
                                isEditable={true}
                                onSelect={() => selectBlock(block.id)}
                                onUpdate={(data) => updateBlock(block.id, { data })}
                                onDelete={() => deleteBlock(block.id)}
                                onDuplicate={() => duplicateBlock(block.id)}
                                onAddBlock={(type, data) => createBlock(type, data, block.parentId, block.order + 1)}
                            />
                        );
                    })}
                </SortableContext>
            </div>

            {typeof document !== 'undefined' && createPortal(
                <DragOverlay dropAnimation={dropAnimation}>
                    {activeBlock ? (
                        <div className="opacity-80">
                            <BlockRenderer
                                block={activeBlock}
                                isEditable={false}
                            />
                        </div>
                    ) : null}
                </DragOverlay>,
                document.body
            )}
        </DndContext>
    );
};

export default BlockEditor;
