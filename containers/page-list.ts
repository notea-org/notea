import { useState } from 'react'
import { createContainer } from 'unstated-next'

const usePageList = (initData) => {
  const [list, setList] = useState(initData)

  return { list }
}

export const PageListState = createContainer(usePageList)
