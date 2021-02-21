import { PageModel, PageState } from 'containers/page'
import { has } from 'lodash'
import router, { useRouter } from 'next/router'
import { useCallback, useEffect } from 'react'
import PageEditor from 'components/page-editor'
import LayoutMain from 'components/layout/layout-main'
import { PageTreeState } from 'containers/page-tree'
import { IndexPageProps } from 'pages'
import PageNav from 'components/page-nav'

const EditContainer = () => {
  const { genNewId } = PageTreeState.useContainer()
  const { getById, setPage } = PageState.useContainer()
  const { query } = useRouter()

  const loadPageById = useCallback(
    (id: string) => {
      const pid = router.query.pid as string

      if (id === 'new') {
        const url = `/page/${genNewId()}?new` + (pid ? `&pid=${pid}` : '')

        router.replace(url, undefined, { shallow: true })
      } else if (id && !has(router.query, 'new')) {
        getById(id).catch((msg) => {
          if (msg.status === 404) {
            // todo: toast
            console.error('页面不存在')
          }
          router.push('/', undefined, { shallow: true })
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

  return (
    <>
      <PageNav />
      <article className="m-auto prose prose-sm h-full">
        <PageEditor />
      </article>
    </>
  )
}

const EditPage = ({ tree }: IndexPageProps) => {
  return (
    <LayoutMain tree={tree}>
      <EditContainer />
    </LayoutMain>
  )
}

export default EditPage

export { getServerSideProps } from 'services/init-tree'
