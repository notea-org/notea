import {
  moveItemOnTree,
  mutateTree,
  TreeData,
  TreeDestinationPosition,
  TreeItem,
  TreeSourcePosition,
} from '@atlaskit/tree'
import { isEmpty, forEach, union, map } from 'lodash'
import { genId } from 'packages/shared'
import { useCallback, useEffect, useRef, useState } from 'react'
import { NOTE_DELETED } from 'shared/meta'
import { createContainer } from 'unstated-next'
import { uiStore } from 'utils/local-store'
import { NoteModel } from './note'
import { useNoteWorker } from 'workers/note'
import useFetch from 'use-http'

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

const saveLocalTree = (data: TreeModel) => {
  const items: any = {}

  forEach(data.items, (item) => {
    items[item.id] = {
      isExpanded: item.isExpanded,
      id: item.id,
    }
  })

  uiStore.setItem('tree_items', {
    ...data,
    items,
  })
}

const useNoteTree = (initData: TreeModel = DEFAULT_TREE) => {
  const { post } = useFetch('/api/tree')
  const [tree, setTree] = useState<TreeModel>(initData)
  const noteWorker = useNoteWorker()
  const treeRef = useRef(tree)

  useEffect(() => {
    treeRef.current = tree
  }, [tree])

  const updateTree = useCallback((data: TreeModel) => {
    setTree(data)
    saveLocalTree(data)
  }, [])

  const initTree = useCallback(async () => {
    const localTree =
      (await uiStore.getItem<TreeModel>('tree_items')) || DEFAULT_TREE
    const curTree = treeRef.current
    const newItems = {} as TreeModel['items']

    await Promise.all(
      map(curTree.items, async (item) => {
        if (!item.isExpanded && localTree.items[item.id]?.isExpanded) {
          item.isExpanded = true
        }

        newItems[item.id] = {
          ...item,
          data: await noteWorker.current?.fetchNote(item.id),
        }
      })
    )

    updateTree({
      ...curTree,
      items: newItems,
    })
  }, [noteWorker, updateTree])

  const addToTree = useCallback(
    (item: NoteModel) => {
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
        updateTree({
          ...curTree,
          items: {
            ...curTree.items,
            ...newItems,
          },
        })
      }
    },
    [updateTree]
  )

  const removeFromTree = useCallback(
    (itemId: string) => {
      updateTree(
        mutateTree(treeRef.current, itemId, {
          data: {
            ...treeRef.current.items[itemId].data,
            deleted: NOTE_DELETED.DELETED,
          },
        }) as TreeModel
      )
    },
    [updateTree]
  )

  const genNewId = useCallback(() => {
    let newId = genId()
    while (treeRef.current.items[newId]) {
      newId = genId()
    }
    return newId
  }, [])

  const moveTree = useCallback(
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
      )

      updateTree(newTree as TreeModel)
      await post('move', data)

      return
    },
    [post, updateTree]
  )

  return {
    tree,
    addToTree,
    removeFromTree,
    updateTree,
    initTree,
    genNewId,
    moveTree,
  }
}

export const NoteTreeState = createContainer(useNoteTree)
