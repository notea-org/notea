import { moveItemOnTree, mutateTree, TreeData, TreeItem } from '@atlaskit/tree';
import { NoteModel } from 'libs/shared/note';
import { cloneDeep, forEach, pull, reduce } from 'lodash';

export interface TreeItemModel extends TreeItem {
    id: string;
    data?: NoteModel;
    children: string[];
}

export interface TreeModel extends TreeData {
    rootId: string;
    items: Record<string, TreeItemModel>;
}

export const ROOT_ID = 'root';

export const DEFAULT_TREE: TreeModel = {
    rootId: ROOT_ID,
    items: {
        root: {
            id: ROOT_ID,
            children: [],
        },
    },
};

export interface MovePosition {
    parentId: string;
    index: number;
}

function addItem(tree: TreeModel, id: string, pid = ROOT_ID) {
    tree.items[id] = tree.items[id] || {
        id,
        children: [],
    };

    const parentItem = tree.items[pid];

    if (parentItem) {
        parentItem.children = [...parentItem.children, id];
    } else {
        throw new Error(`Parent ID '${pid}' does not refer to a valid item`);
    }

    return tree;
}

function mutateItem(tree: TreeModel, id: string, data: Partial<TreeItemModel>) {
    if (data.data) {
        data.data = {
            ...tree.items[id]?.data,
            ...data.data,
        };
    }

    return mutateTree(tree, id, data) as TreeModel;
}

function removeItem(tree: TreeModel, id: string) {
    forEach(tree.items, (item) => {
        if (item.children.includes(id)) {
            pull(item.children, id);
            return false;
        }
    });

    return cloneDeep(tree);
}

function moveItem(
    tree: TreeModel,
    source: MovePosition,
    destination?: MovePosition
) {
    if (!destination) {
        return tree;
    }

    return moveItemOnTree(tree, source, destination) as TreeModel;
}

/**
 * 从原父节点上移除，添加到新的父节点上
 */
function restoreItem(tree: TreeModel, id: string, pid = ROOT_ID) {
    tree = removeItem(tree, id);
    tree = addItem(tree, id, pid);

    return tree;
}

function deleteItem(tree: TreeModel, id: string) {
    tree = cloneDeep(tree);
    delete tree.items[id];

    return tree;
}

const flattenTree = (
    tree: TreeModel,
    rootId = tree.rootId
): TreeItemModel[] => {
    if (!tree.items[rootId]) {
        return [];
    }

    return reduce<string, TreeItemModel[]>(
        tree.items[rootId].children,
        (accum, itemId) => {
            const item = tree.items[itemId];
            const children = flattenTree({
                rootId: item.id,
                items: tree.items,
            });

            return [...accum, item, ...children];
        },
        []
    );
};

export type HierarchicalTreeItemModel = Omit<TreeItemModel, 'children'> & {
    children: HierarchicalTreeItemModel[];
};

export function makeHierarchy(
    tree: TreeModel,
    rootId = tree.rootId
): HierarchicalTreeItemModel | false {
    if (!tree.items[rootId]) {
        return false;
    }

    const root = tree.items[rootId];

    return {
        ...root,
        children: root.children
            .map((v) => makeHierarchy(tree, v))
            .filter((v) => !!v) as HierarchicalTreeItemModel[],
    };
}

const TreeActions = {
    addItem,
    mutateItem,
    removeItem,
    moveItem,
    restoreItem,
    deleteItem,
    flattenTree,
    makeHierarchy,
};

export default TreeActions;
