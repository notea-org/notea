import { cloneDeep, isEmpty, map } from 'lodash'
import { genId } from 'libs/shared/id'
import { useCallback, useEffect, useRef, useState } from 'react'
import { createContainer } from 'unstated-next'
import { NoteModel } from './note'
import TreeActions, {
  DEFAULT_TREE,
  movePosition,
  TreeItemModel,
  TreeModel,
} from 'libs/shared/tree'
import useNoteAPI from '../api/note'
import noteCache from '../cache/note'
import useTreeAPI from '../api/tree'
import { NOTE_DELETED } from 'libs/shared/meta'

const useNoteTree = (initData: TreeModel = DEFAULT_TREE) => {
  const { mutate, loading } = useTreeAPI()
  const [tree, setTree] = useState<TreeModel>(initData)
  const [initLoaded, setInitLoaded] = useState<boolean>(false)
  const { fetch: fetchNote } = useNoteAPI()
  const treeRef = useRef(tree)

  useEffect(() => {
    treeRef.current = tree
  }, [tree])

  const initTree = useCallback(async () => {
    const tree = cloneDeep(treeRef.current)

    await Promise.all(
      map(tree.items, async (item) => {
        item.data = await fetchNote(item.id)
      })
    )

    setTree(tree)
    setInitLoaded(true)
    await noteCache.checkItems(tree.items)
  }, [fetchNote])

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

    while (note.pid && note.pid !== 'root') {
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

  return {
    tree,
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
