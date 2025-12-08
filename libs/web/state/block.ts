import { Block, BlockType, BlockData } from 'libs/shared/block';
import { createContainer } from 'unstated-next';
import { useState, useCallback, useRef } from 'react';
import { nanoid } from 'nanoid';

interface BlockState {
    blocks: Record<string, Block>;
    rootBlocks: string[];
    selectedBlockIds: string[];
    clipboard: Block[];
    history: Record<string, Block>[];
    historyIndex: number;
}

const useBlockSystem = () => {
    const [state, setState] = useState<BlockState>({
        blocks: {},
        rootBlocks: [],
        selectedBlockIds: [],
        clipboard: [],
        history: [],
        historyIndex: -1,
    });

    const stateRef = useRef(state);
    stateRef.current = state;

    // Create a new block
    const createBlock = useCallback(
        (
            type: BlockType,
            data: BlockData = {},
            parentId?: string,
            order?: number
        ): Block => {
            const id = nanoid();
            const now = new Date().toISOString();

            const block: Block = {
                id,
                type,
                data,
                children: [],
                parentId,
                order: order ?? getNextOrder(parentId),
                createdAt: now,
                updatedAt: now,
            };

            setState((prev) => ({
                ...prev,
                blocks: { ...prev.blocks, [id]: block },
                rootBlocks: parentId
                    ? prev.rootBlocks
                    : [...prev.rootBlocks, id],
            }));

            if (parentId) {
                addChildBlock(parentId, block);
            }

            return block;
        },
        []
    );

    // Get next order for a block
    const getNextOrder = useCallback((parentId?: string): number => {
        const { blocks, rootBlocks } = stateRef.current;

        if (parentId) {
            const parent = blocks[parentId];
            if (!parent) return 0;

            const siblings = parent.children;
            return siblings.length > 0
                ? Math.max(...siblings.map((b) => b.order)) + 1
                : 0;
        } else {
            const rootBlockObjects = rootBlocks
                .map((id) => blocks[id])
                .filter(Boolean);
            return rootBlockObjects.length > 0
                ? Math.max(...rootBlockObjects.map((b) => b.order)) + 1
                : 0;
        }
    }, []);

    // Add child block to parent
    const addChildBlock = useCallback((parentId: string, childBlock: Block) => {
        setState((prev) => {
            const parent = prev.blocks[parentId];
            if (!parent) return prev;

            const updatedParent = {
                ...parent,
                children: [...parent.children, childBlock].sort(
                    (a, b) => a.order - b.order
                ),
                updatedAt: new Date().toISOString(),
            };

            return {
                ...prev,
                blocks: { ...prev.blocks, [parentId]: updatedParent },
            };
        });
    }, []);

    // Update block data
    const updateBlock = useCallback(
        (blockId: string, updates: Partial<Block>) => {
            setState((prev) => {
                const block = prev.blocks[blockId];
                if (!block) return prev;

                const updatedBlock = {
                    ...block,
                    ...updates,
                    updatedAt: new Date().toISOString(),
                };

                return {
                    ...prev,
                    blocks: { ...prev.blocks, [blockId]: updatedBlock },
                };
            });
        },
        []
    );

    // Delete block
    const deleteBlock = useCallback((blockId: string) => {
        setState((prev) => {
            const block = prev.blocks[blockId];
            if (!block) return prev;

            // Delete all children recursively
            const deleteRecursively = (id: string) => {
                const blockToDelete = prev.blocks[id];
                if (blockToDelete) {
                    blockToDelete.children.forEach((child) =>
                        deleteRecursively(child.id)
                    );
                }
            };

            deleteRecursively(blockId);

            // Remove from parent's children
            if (block.parentId) {
                const parent = prev.blocks[block.parentId];
                if (parent) {
                    const updatedParent = {
                        ...parent,
                        children: parent.children.filter(
                            (child) => child.id !== blockId
                        ),
                    };
                    prev.blocks[block.parentId] = updatedParent;
                }
            }

            // Remove from root blocks
            const newRootBlocks = prev.rootBlocks.filter(
                (id) => id !== blockId
            );

            // Remove from blocks
            const remainingBlocks = { ...prev.blocks };
            delete remainingBlocks[blockId];

            return {
                ...prev,
                blocks: remainingBlocks,
                rootBlocks: newRootBlocks,
                selectedBlockIds: prev.selectedBlockIds.filter(
                    (id) => id !== blockId
                ),
            };
        });
    }, []);

    // Move block (drag & drop)
    const moveBlock = useCallback(
        (blockId: string, newParentId?: string, newIndex?: number) => {
            setState((prev) => {
                const block = prev.blocks[blockId];
                if (!block) return prev;

                const oldParentId = block.parentId;

                // Helper to get siblings
                const getSiblings = (pid?: string) => {
                    if (pid) {
                        const parent = prev.blocks[pid];
                        return parent ? [...parent.children] : [];
                    }
                    return prev.rootBlocks
                        .map((id) => prev.blocks[id])
                        .filter(Boolean) as Block[];
                };

                // 1. Remove from old parent
                let oldSiblings = getSiblings(oldParentId);
                oldSiblings = oldSiblings.filter((b) => b.id !== blockId);

                // 2. Prepare new siblings list
                let newSiblings: Block[] = [];
                if (oldParentId === newParentId) {
                    newSiblings = [...oldSiblings];
                } else {
                    newSiblings = getSiblings(newParentId);
                    // If moving to different parent, we need to re-index old siblings immediately
                    oldSiblings.forEach((b, i) => {
                        b.order = i;
                    });
                }

                // 3. Insert into new siblings list
                const updatedBlock = { ...block, parentId: newParentId };
                const insertIndex =
                    newIndex !== undefined ? newIndex : newSiblings.length;
                newSiblings.splice(insertIndex, 0, updatedBlock);

                // 4. Re-index new siblings
                newSiblings.forEach((b, i) => {
                    b.order = i;
                });

                // 5. Update state
                const nextBlocks = { ...prev.blocks };

                // Update all affected blocks in the flat map
                [...oldSiblings, ...newSiblings].forEach((b) => {
                    nextBlocks[b.id] = b;
                });

                // Update parents
                if (oldParentId && oldParentId !== newParentId) {
                    if (nextBlocks[oldParentId]) {
                        nextBlocks[oldParentId] = {
                            ...nextBlocks[oldParentId],
                            children: oldSiblings,
                        };
                    }
                }

                if (newParentId) {
                    if (nextBlocks[newParentId]) {
                        nextBlocks[newParentId] = {
                            ...nextBlocks[newParentId],
                            children: newSiblings,
                        };
                    }
                }

                // Update root blocks if necessary
                let nextRootBlocks = [...prev.rootBlocks];
                if (!oldParentId && oldParentId !== newParentId) {
                    nextRootBlocks = oldSiblings.map((b) => b.id);
                }
                if (!newParentId) {
                    nextRootBlocks = newSiblings.map((b) => b.id);
                }

                return {
                    ...prev,
                    blocks: nextBlocks,
                    rootBlocks: nextRootBlocks,
                };
            });
        },
        []
    );

    // Select/deselect blocks
    const selectBlock = useCallback((blockId: string, multiSelect = false) => {
        setState((prev) => ({
            ...prev,
            selectedBlockIds: multiSelect
                ? prev.selectedBlockIds.includes(blockId)
                    ? prev.selectedBlockIds.filter((id) => id !== blockId)
                    : [...prev.selectedBlockIds, blockId]
                : [blockId],
        }));
    }, []);

    // Copy blocks to clipboard
    const copyBlocks = useCallback((blockIds: string[]) => {
        const blocksToCopy = blockIds
            .map((id) => stateRef.current.blocks[id])
            .filter(Boolean);
        setState((prev) => ({ ...prev, clipboard: blocksToCopy }));
    }, []);

    // Paste blocks
    const pasteBlocks = useCallback(
        (parentId?: string) => {
            const { clipboard } = stateRef.current;
            if (clipboard.length === 0) return;

            clipboard.forEach((block) => {
                createBlock(block.type, block.data, parentId);
            });
        },
        [createBlock]
    );

    // Duplicate block (recursive)
    const duplicateBlock = useCallback((blockId: string, parentId?: string, index?: number) => {
        const { blocks } = stateRef.current;
        const blockToDuplicate = blocks[blockId];
        if (!blockToDuplicate) return;

        // Helper to recursively duplicate a block and its children
        const duplicateRecursive = (block: Block, pid?: string, order?: number): Block => {
            // Create the block with the specified order (or default if undefined)
            // Note: If we are in a loop for children, we should pass order to avoid stale stateRef issues
            const newBlock = createBlock(block.type, block.data, pid, order);

            // Recursively duplicate children
            // We sort them first to maintain order
            const children = block.children ? [...block.children].sort((a, b) => a.order - b.order) : [];
            
            children.forEach((child, idx) => {
                duplicateRecursive(child, newBlock.id, idx);
            });

            return newBlock;
        };

        // If parentId is provided, we need to determine the correct order
        // If index is provided, use it. Otherwise, append to end.
        // However, since we might be calling this via UI, let's just let createBlock handle the top-level order
        // if index is not specified.
        // But if we want to insert "after" the current block (common for duplication), 
        // we might need logic for that. For now, let's keep it simple.
        
        // If parentId is NOT provided, it might be a root block duplicate.
        // If parentId IS provided, it's a child duplicate.
        
        // Actually, if we are duplicating a block, we usually want it to be a sibling of the original
        // unless specified otherwise.
        const targetParentId = parentId !== undefined ? parentId : blockToDuplicate.parentId;
        
        // If inserting as sibling, put it after the original
        let targetOrder = index;
        if (targetOrder === undefined && targetParentId === blockToDuplicate.parentId) {
             // Sibling duplication: put after original
             // But since stateRef is stale, we can't trust getNextOrder to put it *immediately* after
             // if there are gaps? Actually getNextOrder puts it at the end.
             // To put it after the original, we need to shift others? 
             // That's complex. Let's just append to end for now (default createBlock behavior).
             // Or better: createBlock uses getNextOrder which finds max(order) + 1.
             // So it appends to end. That's acceptable for now.
        }

        duplicateRecursive(blockToDuplicate, targetParentId, targetOrder);
    }, [createBlock]);

    // Get block by ID
    const getBlock = useCallback((blockId: string): Block | undefined => {
        return stateRef.current.blocks[blockId];
    }, []);

    // Get all blocks in tree order
    const getBlockTree = useCallback((): Block[] => {
        const { blocks, rootBlocks } = stateRef.current;

        const buildTree = (blockIds: string[]): Block[] => {
            return blockIds
                .map((id) => blocks[id])
                .filter(Boolean)
                .sort((a, b) => a.order - b.order)
                .map((block) => ({
                    ...block,
                    children: buildTree(
                        block.children.map((child) => child.id)
                    ),
                }));
        };

        return buildTree(rootBlocks);
    }, []);

    // Save state to history (for undo/redo)
    const saveToHistory = useCallback(() => {
        setState((prev) => {
            const newHistory = prev.history.slice(0, prev.historyIndex + 1);
            newHistory.push({ ...prev.blocks });

            return {
                ...prev,
                history: newHistory,
                historyIndex: newHistory.length - 1,
            };
        });
    }, []);

    // Undo
    const undo = useCallback(() => {
        setState((prev) => {
            if (prev.historyIndex <= 0) return prev;

            const newIndex = prev.historyIndex - 1;
            const previousState = prev.history[newIndex];

            return {
                ...prev,
                blocks: { ...previousState },
                historyIndex: newIndex,
            };
        });
    }, []);

    // Redo
    const redo = useCallback(() => {
        setState((prev) => {
            if (prev.historyIndex >= prev.history.length - 1) return prev;

            const newIndex = prev.historyIndex + 1;
            const nextState = prev.history[newIndex];

            return {
                ...prev,
                blocks: { ...nextState },
                historyIndex: newIndex,
            };
        });
    }, []);

    return {
        blocks: state.blocks,
        rootBlocks: state.rootBlocks,
        selectedBlockIds: state.selectedBlockIds,
        clipboard: state.clipboard,
        canUndo: state.historyIndex > 0,
        canRedo: state.historyIndex < state.history.length - 1,

        createBlock,
        updateBlock,
        deleteBlock,
        moveBlock,
        selectBlock,
        copyBlocks,
        pasteBlocks,
        duplicateBlock,
        getBlock,
        getBlockTree,
        saveToHistory,
        undo,
        redo,
    };
};

export const BlockState = createContainer(useBlockSystem);
export default BlockState;
