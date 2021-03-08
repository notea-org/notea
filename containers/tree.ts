import { isEmpty, map } from 'lodash'
import { genId } from 'packages/shared'
import { useCallback, useEffect, useRef, useState } from 'react'
import { createContainer } from 'unstated-next'
import { NoteModel } from './note'
import useFetch from 'use-http'
import NoteStoreAPI from 'services/local-store/note'
import TreeActions, { DEFAULT_TREE, movePosition, TreeModel } from 'shared/tree'

const useNoteTree = (initData: TreeModel = DEFAULT_TREE) => {
  const { post } = useFetch('/api/tree')
  const [tree, setTree] = useState<TreeModel>(initData)
  const [initLoaded, setInitLoaded] = useState<boolean>(false)
  const treeRef = useRef(tree)

  useEffect(() => {
    treeRef.current = tree
  }, [tree])

  const initTree = useCallback(async () => {
    const curTree = treeRef.current
    const newItems = {} as TreeModel['items']

    await Promise.all(
      map(curTree.items, async (item) => {
        newItems[item.id] = {
          ...item,
          data: await NoteStoreAPI.fetchNote(item.id),
        }
      })
    )

    setTree({
      ...curTree,
      items: newItems,
    })
    setInitLoaded(true)
    NoteStoreAPI.checkAllNotes(newItems)
  }, [])

  const addItem = useCallback((item: NoteModel) => {
    const tree = TreeActions.addItem(treeRef.current, item.id, item.pid)

    tree.items[item.id].data = item
    setTree(tree)
  }, [])

  const removeItem = useCallback((id: string) => {
    setTree(TreeActions.removeItem(treeRef.current, id))
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
      await post({
        action: 'move',
        data,
      })
    },
    [post]
  )

  const mutateItem = useCallback(
    async (id: string, data) => {
      setTree(TreeActions.mutateItem(treeRef.current, id, data))
      delete data.data
      if (!isEmpty(data)) {
        await post({
          action: 'mutate',
          data: {
            id,
            ...data,
          },
        })
      }
    },
    [post]
  )

  const restoreItem = useCallback((id: string, pid: string) => {
    setTree(TreeActions.restoreItem(treeRef.current, id, pid))
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
    initLoaded,
  }
}

export const NoteTreeState = createContainer(useNoteTree)
