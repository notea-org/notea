import { TreeData } from '@atlaskit/tree'
import { isEmpty, forEach } from 'lodash'
import { genId } from 'packages/shared'
import { useCallback, useEffect, useRef, useState } from 'react'
import { createContainer } from 'unstated-next'
import { uiStore } from 'utils/local-store'
import { NoteModel } from './note'

const DEFAULT_TREE: TreeData = {
  rootId: 'root',
  items: {
    root: {
      id: 'root',
      children: [],
    },
  },
}

const saveLocalTree = (data: TreeData) => {
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

const useNoteTree = (initData: TreeData = DEFAULT_TREE) => {
  const [tree, setTree] = useState<TreeData>(initData)
  const treeRef = useRef(tree)

  useEffect(() => {
    treeRef.current = tree
  }, [tree])

  const updateTree = useCallback((data: TreeData) => {
    setTree(data)
    saveLocalTree(data)
  }, [])

  const initTree = useCallback(async () => {
    const localTree =
      (await uiStore.getItem<TreeData>('tree_items')) || DEFAULT_TREE

    setTree((prev) => {
      forEach(prev.items, (item) => {
        if (!item.isExpanded && localTree.items[item.id]?.isExpanded) {
          item.isExpanded = true
        }
      })

      saveLocalTree(prev)

      return prev
    })
  }, [])

  const addToTree = useCallback(
    (item: NoteModel) => {
      const newItems: TreeData['items'] = {}
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

  const genNewId = useCallback(() => {
    let newId = genId()
    while (treeRef.current.items[newId]) {
      newId = genId()
    }
    return newId
  }, [])

  return { tree, addToTree, updateTree, initTree, genNewId }
}

export const NoteTreeState = createContainer(useNoteTree)
