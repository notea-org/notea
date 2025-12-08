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
  const createBlock = useCallback((
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

    setState(prev => ({
      ...prev,
      blocks: { ...prev.blocks, [id]: block },
      rootBlocks: parentId ? prev.rootBlocks : [...prev.rootBlocks, id],
    }));

    if (parentId) {
      addChildBlock(parentId, block);
    }

    return block;
  }, []);

  // Get next order for a block
  const getNextOrder = useCallback((parentId?: string): number => {
    const { blocks, rootBlocks } = stateRef.current;
    
    if (parentId) {
      const parent = blocks[parentId];
      if (!parent) return 0;
      
      const siblings = parent.children;
      return siblings.length > 0 ? Math.max(...siblings.map(b => b.order)) + 1 : 0;
    } else {
      const rootBlockObjects = rootBlocks.map(id => blocks[id]).filter(Boolean);
      return rootBlockObjects.length > 0 ? Math.max(...rootBlockObjects.map(b => b.order)) + 1 : 0;
    }
  }, []);

  // Add child block to parent
  const addChildBlock = useCallback((parentId: string, childBlock: Block) => {
    setState(prev => {
      const parent = prev.blocks[parentId];
      if (!parent) return prev;

      const updatedParent = {
        ...parent,
        children: [...parent.children, childBlock].sort((a, b) => a.order - b.order),
        updatedAt: new Date().toISOString(),
      };

      return {
        ...prev,
        blocks: { ...prev.blocks, [parentId]: updatedParent },
      };
    });
  }, []);

  // Update block data
  const updateBlock = useCallback((blockId: string, updates: Partial<Block>) => {
    setState(prev => {
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
  }, []);

  // Delete block
  const deleteBlock = useCallback((blockId: string) => {
    setState(prev => {
      const block = prev.blocks[blockId];
      if (!block) return prev;

      // Delete all children recursively
      const deleteRecursively = (id: string) => {
        const blockToDelete = prev.blocks[id];
        if (blockToDelete) {
          blockToDelete.children.forEach(child => deleteRecursively(child.id));
        }
      };

      deleteRecursively(blockId);

      // Remove from parent's children
      if (block.parentId) {
        const parent = prev.blocks[block.parentId];
        if (parent) {
          const updatedParent = {
            ...parent,
            children: parent.children.filter(child => child.id !== blockId),
          };
          prev.blocks[block.parentId] = updatedParent;
        }
      }

      // Remove from root blocks
      const newRootBlocks = prev.rootBlocks.filter(id => id !== blockId);

      // Remove from blocks
      const remainingBlocks = { ...prev.blocks };
      delete remainingBlocks[blockId];

      return {
        ...prev,
        blocks: remainingBlocks,
        rootBlocks: newRootBlocks,
        selectedBlockIds: prev.selectedBlockIds.filter(id => id !== blockId),
      };
    });
  }, []);

  // Move block (drag & drop)
  const moveBlock = useCallback((
    blockId: string,
    newParentId?: string,
    newOrder?: number
  ) => {
    setState(prev => {
      const block = prev.blocks[blockId];
      if (!block) return prev;

      // Remove from current parent
      if (block.parentId) {
        const currentParent = prev.blocks[block.parentId];
        if (currentParent) {
          currentParent.children = currentParent.children.filter(child => child.id !== blockId);
        }
      } else {
        prev.rootBlocks = prev.rootBlocks.filter(id => id !== blockId);
      }

      // Add to new parent
      const movedBlock = { ...block, parentId: newParentId, order: newOrder ?? 0 };
      
      if (newParentId) {
        const newParent = prev.blocks[newParentId];
        if (newParent) {
          newParent.children = [...newParent.children, movedBlock].sort((a, b) => a.order - b.order);
        }
      } else {
        prev.rootBlocks = [...prev.rootBlocks, blockId];
      }

      return {
        ...prev,
        blocks: { ...prev.blocks, [blockId]: movedBlock },
      };
    });
  }, []);

  // Select/deselect blocks
  const selectBlock = useCallback((blockId: string, multiSelect = false) => {
    setState(prev => ({
      ...prev,
      selectedBlockIds: multiSelect
        ? prev.selectedBlockIds.includes(blockId)
          ? prev.selectedBlockIds.filter(id => id !== blockId)
          : [...prev.selectedBlockIds, blockId]
        : [blockId],
    }));
  }, []);

  // Copy blocks to clipboard
  const copyBlocks = useCallback((blockIds: string[]) => {
    const blocksToCopy = blockIds.map(id => stateRef.current.blocks[id]).filter(Boolean);
    setState(prev => ({ ...prev, clipboard: blocksToCopy }));
  }, []);

  // Paste blocks
  const pasteBlocks = useCallback((parentId?: string) => {
    const { clipboard } = stateRef.current;
    if (clipboard.length === 0) return;

    clipboard.forEach(block => {
      createBlock(block.type, block.data, parentId);
    });
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
        .map(id => blocks[id])
        .filter(Boolean)
        .sort((a, b) => a.order - b.order)
        .map(block => ({
          ...block,
          children: buildTree(block.children.map(child => child.id)),
        }));
    };

    return buildTree(rootBlocks);
  }, []);

  // Save state to history (for undo/redo)
  const saveToHistory = useCallback(() => {
    setState(prev => {
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
    setState(prev => {
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
    setState(prev => {
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
    getBlock,
    getBlockTree,
    saveToHistory,
    undo,
    redo,
  };
};

export const BlockState = createContainer(useBlockSystem);
export default BlockState;
