import { getEnv } from '@notea/shared/env'
import { strDecompress } from '@notea/shared/str'
import { StroageType } from '@notea/store'
import { useEffect, useState } from 'react'
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

function parseHeaders(headers: Headers) {
  const page = {} as PageModel

  switch (getEnv<StroageType>('STORE_TYPE')) {
    case 'OSS':
      // todo
      break
    case 'AWS':
    case 'MINIO':
    default:
      page.title = strDecompress(headers.get('x-amz-meta-title'))
      page.pid = strDecompress(headers.get('x-amz-meta-pid'))
      page.icon = strDecompress(headers.get('x-amz-meta-icon'))
      page.order = parseInt(strDecompress(headers.get('x-amz-meta-order')), 10)
      break
  }

  return page
}

const usePage = (id?: string) => {
  const [page, setPage] = useState<PageModel>({} as PageModel)
  const { get, post, response } = useFetch('/api/pages')

  const getById = async (id: string) => {
    const content = await get(id)
    const { headers } = response

    setPage({
      ...parseHeaders(headers),
      id,
      content,
    })
  }

  useEffect(() => {
    if (id) {
      getById(id)
    }
  }, [id])

  const savePage = async (data: Partial<PageModel>): Promise<PageModel> => {
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
    setPage({
      ...page,
      ...res,
    })
    return res
  }

  return { page, getById, savePage }
}

export const PageState = createContainer(usePage)
