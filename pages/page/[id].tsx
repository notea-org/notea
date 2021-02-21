import { PageModel, PageState } from 'containers/page'
import { has } from 'lodash'
import router, { useRouter } from 'next/router'
import { useCallback, useEffect } from 'react'
import LayoutMain from 'components/layout/layout-main'
import { PageTreeState } from 'containers/page-tree'
import PageNav from 'components/page-nav'
import dynamic from 'next/dynamic'
import { GetServerSideProps, NextPage } from 'next'
import { TreeData } from '@atlaskit/tree'
import withTree from 'services/with-tree'
import withUA from 'services/with-ua'

const PageEditor = dynamic(() => import('components/page-editor'))

const EditContainer = () => {
  const { genNewId } = PageTreeState.useContainer()
  const { getById, setPage } = PageState.useContainer()
  const { query } = useRouter()

  const loadPageById = useCallback(
    (id: string) => {
      const pid = router.query.pid as string
      if (id === 'welcome') {
        return
      } else if (id === 'new') {
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

  return query.id !== 'welcome' ? (
    <>
      <PageNav />
      <article className="m-auto prose">
        <PageEditor />
      </article>
    </>
  ) : (
    <div>使用说明之类的</div>
  )
}

const EditPage: NextPage<{ tree: TreeData }> = ({ tree }) => {
  return (
    <LayoutMain tree={tree}>
      <EditContainer />
    </LayoutMain>
  )
}

export default EditPage

export const getServerSideProps: GetServerSideProps = withUA(
  withTree(() => {
    return {}
  })
)
