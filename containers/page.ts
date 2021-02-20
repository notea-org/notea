import { useCallback, useState } from 'react'
import { createContainer } from 'unstated-next'
import useFetch from 'use-http'

export interface PageModel {
  id: string
  title: string
  pid?: string
  content?: string
  pic?: string
  cid?: string[]
}

const usePage = () => {
  const [page, setPage] = useState<PageModel>({} as PageModel)
  const { get, post, cache } = useFetch('/api/pages')

  const getById = useCallback(
    async (id: string) => {
      const res = await get(id)

      if (res.status === 404) {
        throw res
      }

      if (!res.content) {
        res.content = '\n'
      }

      setPage(res)
    },
    [get]
  )

  const savePage = useCallback(
    async (data: Partial<PageModel>, isNew = false) => {
      cache.delete(`url:/api/pages/${page.id}||method:GET||body:`)
      let result = data

      if (isNew) {
        result = await post({
          id: page.id,
          meta: {
            title: data.title,
            pid: data.pid,
            pic: data.pic,
            cid: data.cid,
          },
          content: data.content,
        })
      } else if (!data.content) {
        await post(`/${page.id}/meta`, data)
      } else {
        await post(page.id, {
          content: data.content,
        })
      }
      const newPage: PageModel = {
        ...page,
        ...result,
      }

      delete newPage.content

      setPage(newPage)

      return newPage
    },
    [cache, page, post]
  )

  const updatePageMeta = useCallback(
    async function (id: string, data: Partial<PageModel>) {
      cache.delete(`url:/api/pages/${id}||method:GET||body:`)
      const res = await post(`${id}/meta`, {
        title: data.title,
        pid: data.pid,
        cid: data.cid,
        pic: data.pic,
      })

      return res
    },
    [cache, post]
  )

  return { page, getById, savePage, setPage, updatePageMeta }
}

export const PageState = createContainer(usePage)
