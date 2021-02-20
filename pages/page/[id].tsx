import { PageModel, PageState } from 'containers/page'
import { has } from 'lodash'
import router, { useRouter } from 'next/router'
import { useCallback, useEffect } from 'react'
import Editor from 'components/editor'
import LayoutMain from 'components/layout/layout-main'
import { PageTreeState } from 'containers/page-tree'
import { IndexPageProps } from 'pages'

const EditContainer = () => {
  const { genNewId } = PageTreeState.useContainer()
  const { getById, setPage } = PageState.useContainer()
  const { query } = useRouter()

  const loadPageById = useCallback(
    (id: string) => {
      const pid = router.query.pid as string

      if (id === 'new') {
        const url = `/page/${genNewId()}?new` + (pid ? `&pid=${pid}` : '')

        router.replace(url)
      } else if (id && !has(router.query, 'new')) {
        getById(id).catch((msg) => {
          if (msg.status === 404) {
            // todo: toast
            console.error('页面不存在')
          }
          router.push('/')
        })
      } else {
        setPage({
          id,
          title: '',
          content: '\n',
        } as PageModel)
      }
    },
    [genNewId, getById, setPage]
  )

  useEffect(() => {
    loadPageById(query.id as string)
  }, [loadPageById, query.id])

  return <Editor />
}

const EditPage = ({ tree }: IndexPageProps) => {
  return (
    <LayoutMain tree={tree}>
      <EditContainer />
    </LayoutMain>
  )
}

export default EditPage

export { getServerSideProps } from '../index'
