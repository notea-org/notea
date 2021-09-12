import { cloneDeep, forEach, isEmpty, map } from 'lodash'
import { genId } from 'libs/shared/id'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { createContainer } from 'unstated-next'
import TreeActions, {
  DEFAULT_TREE,
  movePosition,
  ROOT_ID,
  TreeItemModel,
  TreeModel,
} from 'libs/shared/tree'
import useNoteAPI from '../api/note'
import noteCache from '../cache/note'
import useTreeAPI from '../api/tree'
import { NOTE_DELETED, NOTE_PINNED } from 'libs/shared/meta'
import { NoteModel } from 'libs/shared/note'
import { useToast } from '../hooks/use-toast'
import { uiCache } from '../cache'

const TREE_CACHE_KEY = 'tree'

const useNoteTree = (initData: TreeModel = DEFAULT_TREE) => {
  const { mutate, loading, fetch: fetchTree } = useTreeAPI()
  const [tree, setTree] = useState<TreeModel>(initData)
  const [initLoaded, setInitLoaded] = useState<boolean>(false)
  const { fetch: fetchNoteAPI } = useNoteAPI()
  const treeRef = useRef(tree)
  const toast = useToast()

  useEffect(() => {
    treeRef.current = tree
  }, [tree])

  const fetchNotes = useCallback(
    async (tree: TreeModel) => {
      await Promise.all(
        map(tree.items, async (item) => {
          item.data = await fetchNoteAPI(item.id)
        })
      )

      return tree
    },
    [fetchNoteAPI]
  )

  const initTree = useCallback(async () => {
    const cache = await uiCache.getItem<TreeModel>(TREE_CACHE_KEY)
    if (cache) {
      const treeWithNotes = await fetchNotes(cache)
      setTree(treeWithNotes)
    }

    const tree = await fetchTree()

    if (!tree) {
      toast('Failed to load tree', 'error')
      return
    }

    const treeWithNotes = await fetchNotes(tree)

    setTree(treeWithNotes)
    await Promise.all([
      uiCache.setItem(TREE_CACHE_KEY, tree),
      noteCache.checkItems(tree.items),
    ])
    setInitLoaded(true)
  }, [fetchNotes, fetchTree, toast])

  const addItem = useCallback((item: NoteModel) => {
    const tree = TreeActions.addItem(treeRef.current, item.id, item.pid)

    tree.items[item.id].data = item
    setTree(tree)
  }, [])

  const removeItem = useCallback(async (id: string) => {
    const tree = TreeActions.removeItem(treeRef.current, id)

    setTree(tree)
    await Promise.all(
      map(
        TreeActions.flattenTree(tree, id),
        async (item) =>
          await noteCache.mutateItem(item.id, { deleted: NOTE_DELETED.DELETED })
      )
    )
  }, [])

  const genNewId = useCallback(() => {
    let newId = genId()
    while (treeRef.current.items[newId]) {
      newId = genId()
    }
    return newId
  }, [])

  const moveItem = useCallback(
    async (data: { source: movePosition; destination: movePosition }) => {
      setTree(
        TreeActions.moveItem(treeRef.current, data.source, data.destination)
      )
      await mutate({
        action: 'move',
        data,
      })
    },
    [mutate]
  )

  const mutateItem = useCallback(
    async (id: string, data: Partial<TreeItemModel>) => {
      setTree(TreeActions.mutateItem(treeRef.current, id, data))
      delete data.data
      // @todo diff 没有变化就不发送请求
      if (!isEmpty(data)) {
        await mutate({
          action: 'mutate',
          data: {
            ...data,
            id,
          },
        })
      }
    },
    [mutate]
  )

  const restoreItem = useCallback(async (id: string, pid: string) => {
    const tree = TreeActions.restoreItem(treeRef.current, id, pid)

    setTree(tree)
    await Promise.all(
      map(
        TreeActions.flattenTree(tree, id),
        async (item) =>
          await noteCache.mutateItem(item.id, { deleted: NOTE_DELETED.NORMAL })
      )
    )
  }, [])

  const deleteItem = useCallback(async (id: string) => {
    setTree(TreeActions.deleteItem(treeRef.current, id))
  }, [])

  const getPaths = useCallback((note: NoteModel) => {
    const tree = treeRef.current
    const paths = [] as NoteModel[]

    while (note.pid && note.pid !== ROOT_ID) {
      const curData = tree.items[note.pid]?.data
      if (curData) {
        note = curData
        paths.push(note)
      } else {
        break
      }
    }

    return paths
  }, [])

  const pinnedTree = useMemo(() => {
    const items = cloneDeep(tree.items)
    const pinnedIds: string[] = []
    forEach(items, (item) => {
      if (
        item.data?.pinned === NOTE_PINNED.PINNED &&
        item.data.deleted !== NOTE_DELETED.DELETED
      ) {
        pinnedIds.push(item.id)
      }
    })

    items[ROOT_ID] = {
      id: ROOT_ID,
      children: pinnedIds,
      isExpanded: true,
    }

    return {
      ...tree,
      items,
    }
  }, [tree])

  return {
    tree,
    pinnedTree,
    initTree,
    genNewId,
    addItem,
    removeItem,
    moveItem,
    mutateItem,
    restoreItem,
    deleteItem,
    getPaths,
    loading,
    initLoaded,
  }
}

const NoteTreeState = createContainer(useNoteTree)

export default NoteTreeState
