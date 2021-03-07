import {
  moveItemOnTree,
  mutateTree,
  TreeData,
  TreeDestinationPosition,
  TreeItem,
  TreeSourcePosition,
} from '@atlaskit/tree'
import { isEmpty, forEach, union, map, without } from 'lodash'
import { genId } from 'packages/shared'
import { useCallback, useEffect, useRef, useState } from 'react'
import { createContainer } from 'unstated-next'
import { NoteModel } from './note'
import useFetch from 'use-http'
import { TreeItemMutation } from '@atlaskit/tree/dist/types/utils/tree'
import NoteStoreAPI from 'services/local-store/note'

export interface TreeItemModel extends TreeItem {
  id: string
  data?: NoteModel
  children: string[]
}
export interface TreeModel extends TreeData {
  rootId: string
  items: Record<string, TreeItemModel>
}

export const DEFAULT_TREE: TreeModel = {
  rootId: 'root',
  items: {
    root: {
      id: 'root',
      children: [],
    },
  },
}

const useNoteTree = (initData: TreeModel = DEFAULT_TREE) => {
  const { post } = useFetch('/api/tree')
  const [tree, setTree] = useState<TreeModel>(initData)
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
    NoteStoreAPI.checkAllNotes(newItems)
  }, [])

  const addToTree = useCallback((item: NoteModel) => {
    const newItems: TreeModel['items'] = {}
    const curTree = treeRef.current
    const curItem = curTree.items[item.id]
    const parentItem = treeRef.current.items[item.pid || 'root']

    parentItem.children = union(parentItem.children, [item.id])

    if (!curItem) {
      newItems[item.id] = {
        id: item.id,
        data: item,
        children: [],
      }
    } else if (curItem.data?.title !== item.title) {
      newItems[item.id] = {
        ...curItem,
        data: item,
      }
    }

    if (!isEmpty(newItems)) {
      setTree({
        ...curTree,
        items: {
          ...curTree.items,
          ...newItems,
        },
      })
    }
  }, [])

  const removeFromTree = useCallback((id: string) => {
    forEach(treeRef.current.items, (item) => {
      if (item.children.includes(id)) {
        setTree(
          mutateTree(treeRef.current, item.id, {
            children: without(item.children, id),
          }) as TreeModel
        )
        return false
      }
    })
  }, [])

  const genNewId = useCallback(() => {
    let newId = genId()
    while (treeRef.current.items[newId]) {
      newId = genId()
    }
    return newId
  }, [])

  const moveItem = useCallback(
    async (data: {
      source: TreeSourcePosition
      destination?: TreeDestinationPosition
    }) => {
      if (!data.destination) {
        return
      }

      const newTree = moveItemOnTree(
        treeRef.current,
        data.source,
        data.destination
      ) as TreeModel

      setTree(newTree)
      await post({
        action: 'move',
        data,
      })

      return
    },
    [post]
  )

  const mutateItem = useCallback(
    async (data: TreeItemMutation) => {
      const tree = mutateTree(
        treeRef.current,
        data.id as string,
        data
      ) as TreeModel
      setTree(tree)
      await post({
        action: 'mutate',
        data,
      })
    },
    [post]
  )

  return {
    tree,
    addToTree,
    removeFromTree,
    initTree,
    genNewId,
    moveItem,
    mutateItem,
  }
}

export const NoteTreeState = createContainer(useNoteTree)
