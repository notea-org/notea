import { useEffect, useState } from 'react'
import { createContainer } from 'unstated-next'
import useFetch from 'use-http'

export interface PageModel {
  id: string
  title: string
  pid: string
  order: number
  content?: string
}

const usePage = (id?: string) => {
  const [page, setPage] = useState<PageModel>()
  const { get, post, response } = useFetch(`/api/pages`)

  const getById = async (id: string) => {
    const data = await get(id)
    console.log(111, response.headers)

    setPage({
      id: '0',
      title: '1',
      pid: '1',
      order: 1,
      content: data,
    })
  }

  useEffect(() => {
    if (id) {
      getById(id)
    }
  }, [id])

  const savePage = async (data: PageModel) => {
    await post({
      id: data.id,
      meta: {
        title: data.title,
        pid: data.pid,
        order: data.order,
      },
      content: data.content,
    })
  }

  return { page, getById, savePage }
}

export const PageState = createContainer(usePage)
