import { TreeData } from '@atlaskit/tree'
import { isEmpty } from 'lodash'
import { useState } from 'react'
import { createContainer } from 'unstated-next'
import { setLocalStore } from 'utils/local-store'
import { PageModel } from './page'

const DEFAULT_TREE: TreeData = {
  rootId: 'root',
  items: {
    root: {
      id: 'root',
      children: [],
    },
  },
}

const usePageTree = (initData: TreeData = DEFAULT_TREE) => {
  const [tree, setTree] = useState<TreeData>(initData)

  const updateTree = (data: TreeData) => {
    setTree(data)
    setLocalStore('TREE', data)
  }

  const addToTree = (item: PageModel) => {
    const newItems: TreeData['items'] = {}
    const parentItem = tree.items[item.pid || 'root']
    const curItem = tree.items[item.id]

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
        ...tree,
        items: {
          ...tree.items,
          ...newItems,
        },
      })
    }
  }

  return { tree, addToTree, updateTree }
}

export const PageTreeState = createContainer(usePageTree)
