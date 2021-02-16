import { useEffect, useState } from 'react'
import { createContainer } from 'unstated-next'
import useFetch from 'use-http'
import { PageModel } from './page'

const usePageList = (initData: PageModel[] = []) => {
  const [list, setList] = useState<PageModel[]>(initData)
  const { get } = useFetch('/api/pages')

  useEffect(() => {
    get().then((data) => setList(data))
  }, [])

  const addToList = (item: PageModel) => {
    const curItem = list.find((i) => i.id === item.id)
    if (!curItem) {
      setList([...list, item])
    } else if (curItem.title !== item.title) {
      setList([...list.filter((i) => i.id !== item.id), item])
    }
  }
  return { list, addToList }
}

export const PageListState = createContainer(usePageList)
