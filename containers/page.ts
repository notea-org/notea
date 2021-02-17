import { useState } from 'react'
import { createContainer } from 'unstated-next'
import useFetch from 'use-http'

export interface PageModel {
  id?: string
  title: string
  pid?: string
  order: number
  content?: string
  icon?: string
}

const usePage = () => {
  const [page, setPage] = useState<PageModel>({} as PageModel)
  const { get, post, cache } = useFetch('/api/pages')

  const getById = async (id: string) => {
    const res = await get(id)

    if (!res.content) {
      res.content = '\n'
    }
    setPage(res)
  }

  const savePage = async (data: Partial<PageModel>): Promise<PageModel> => {
    cache.delete(`url:/api/pages/${page?.id}||method:GET||body:`)
    const res = await post({
      id: data.id || page.id,
      meta: {
        title: data.title || page.title,
        pid: data.pid || page.pid,
        order: data.order || page.order,
        icon: data.icon || page.icon,
      },
      content: data.content || page.content,
    })

    setPage(res)

    return res
  }

  return { page, getById, savePage, setPage }
}

export const PageState = createContainer(usePage)
