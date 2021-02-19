import { PageModel, PageState } from 'containers/page'
import { has } from 'lodash'
import { useRouter } from 'next/router'
import { genId } from 'packages/shared'
import { useEffect } from 'react'
import { Editor } from 'components/editor'
import { Layout } from 'components/layout'
import { PageTreeState } from 'containers/page-tree'

const EditContainer = () => {
  const router = useRouter()
  const { tree } = PageTreeState.useContainer()
  const { getById, setPage } = PageState.useContainer()
  const query = router.query
  const id = query.id as string
  const pid = query.pid as string

  const genNewId = () => {
    let newId = genId()
    while (tree.items[newId]) {
      newId = genId()
    }
    return newId
  }

  useEffect(() => {
    if (id === 'new') {
      const url = `/page/${genNewId()}?new` + (pid ? `&pid=${pid}` : '')

      router.replace(url)
    } else if (id && !has(query, 'new')) {
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
  }, [id])

  return <Editor />
}

const EditPage = () => {
  return (
    <Layout>
      <EditContainer />
    </Layout>
  )
}

export default EditPage
