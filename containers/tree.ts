import { mutateTree, TreeData, TreeItem } from '@atlaskit/tree'
import { isEmpty, forEach } from 'lodash'
import { genId } from 'packages/shared'
import { useCallback, useEffect, useRef, useState } from 'react'
import { NOTE_DELETED } from 'shared/meta'
import { createContainer } from 'unstated-next'
import { uiStore } from 'utils/local-store'
import { NoteModel } from './note'

export interface TreeItemModel extends TreeItem {
  id: string
  data: NoteModel
  children: string[]
}
export interface TreeModel extends TreeData {
  rootId: string
  items: Record<string, TreeItemModel>
}

const DEFAULT_TREE: TreeModel = {
  rootId: 'root',
  items: {
    root: {
      id: 'root',
      children: [],
      data: {} as NoteModel,
    },
  },
}

const saveLocalTree = (data: TreeModel) => {
  const items: any = {}

  forEach(data.items, (item) => {
    items[item.id] = {
      isExpanded: item.isExpanded,
      id: item.id,
      data: {
        date: item.data.date,
      },
    }
  })

  uiStore.setItem('tree_items', {
    ...data,
    items,
  })
}

const useNoteTree = (initData: TreeModel = DEFAULT_TREE) => {
  const [tree, setTree] = useState<TreeModel>(initData)
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

    setTree((prev) => {
      const deletedIds: string[] = []
      forEach(prev.items, (item) => {
        if (!item.isExpanded && localTree.items[item.id]?.isExpanded) {
          item.isExpanded = true
        }
        if (item.data.deleted) {
          deletedIds.push(item.id)
        }
      })

      saveLocalTree(prev)

      return prev
    })
  }, [])

  const addToTree = useCallback(
    (item: NoteModel) => {
      const newItems: TreeModel['items'] = {}
      const curTree = treeRef.current
      const parentItem = curTree.items[item.pid || 'root']
      const curItem = curTree.items[item.id]

      if (!parentItem.children.includes(item.id)) {
        newItems[parentItem.id] = {
          ...parentItem,
          children: [...parentItem.children, item.id],
        }
      }

      if (!curItem) {
        newItems[item.id] = {
          id: item.id,
          data: item,
          children: [],
        }
      } else if (curItem.data.title !== item.title) {
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

  return {
    tree,
    addToTree,
    removeFromTree,
    updateTree,
    initTree,
    genNewId,
  }
}

export const NoteTreeState = createContainer(useNoteTree)
