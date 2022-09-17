import { StoreProvider } from 'libs/server/store';
import TreeActions, {
    DEFAULT_TREE,
    MovePosition,
    ROOT_ID,
    TreeItemModel,
    TreeModel,
} from 'libs/shared/tree';
import { filter, forEach, isNil } from 'lodash';
import { getPathTree } from './note-path';

/**
 * FIXME 抽空重构 libs/shard/tree
 *
 * We need unit test...
 *
 * 1. children 有可能包含 null，暂不清楚从哪产生的
 * 2. 可能会存在 children 包含当前节点的问题
 * 3. children 可能包含不存在的节点
 *
 */
function fixedTree(tree: TreeModel) {
    forEach(tree.items, (item) => {
        if (
            item.children.find(
                (i) => i === null || i === item.id || !tree.items[i]
            )
        ) {
            console.log('item.children error', item);
            tree.items[item.id] = {
                ...item,
                children: filter(
                    item.children,
                    (cid) => !isNil(cid) && cid !== item.id && !!tree.items[cid]
                ),
            };
        }
    });
    return tree;
}

export default class TreeStore {
    store: StoreProvider;
    treePath: string;

    constructor(store: StoreProvider) {
        this.store = store;
        this.treePath = getPathTree();
    }

    async get() {
        let res;
        if (await this.store.hasObject(this.treePath)) {
            res = await this.store.getObject(this.treePath);
        }

        if (!res) {
            return await this.set(DEFAULT_TREE);
        }

        const tree = JSON.parse(res) as TreeModel;

        return fixedTree(tree);
    }

    async set(tree: TreeModel) {
        const newTree = fixedTree(tree);

        await this.store.putObject(this.treePath, JSON.stringify(newTree));

        return newTree;
    }

    async addItem(id: string, parentId = ROOT_ID) {
        const tree = await this.get();

        return await this.set(TreeActions.addItem(tree, id, parentId));
    }

    async addItems(ids: string[], parentId = ROOT_ID) {
        let tree = await this.get();

        ids.forEach((id) => {
            tree = TreeActions.addItem(tree, id, parentId);
        });

        return await this.set(tree);
    }

    async removeItem(id: string) {
        const tree = await this.get();

        return await this.set(TreeActions.removeItem(tree, id));
    }

    async moveItem(source: MovePosition, destination: MovePosition) {
        const tree = await this.get();

        return await this.set(TreeActions.moveItem(tree, source, destination));
    }

    async mutateItem(id: string, data: TreeItemModel) {
        const tree = await this.get();

        return await this.set(TreeActions.mutateItem(tree, id, data));
    }

    async restoreItem(id: string, parentId: string) {
        const tree = await this.get();

        return await this.set(TreeActions.restoreItem(tree, id, parentId));
    }

    async deleteItem(id: string) {
        const tree = await this.get();

        return await this.set(TreeActions.deleteItem(tree, id));
    }
}
