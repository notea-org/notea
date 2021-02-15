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
    setList((prev) => {
      return [...prev, item]
    })
  }
  return { list, addToList }
}

export const PageListState = createContainer(usePageList)
