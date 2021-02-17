import { PageModel, PageState } from 'containers/page'
import { has } from 'lodash'
import { useRouter } from 'next/router'
import { genId } from 'packages/shared'
import { useEffect } from 'react'
import { Editor } from 'components/editor'
import { Layout } from 'components/layout'

const EditContainer = () => {
  const router = useRouter()
  const { getById, setPage } = PageState.useContainer()
  const query = router.query
  const id = query.id as string

  useEffect(() => {
    if (id === 'new') {
      router.replace(`/page/${genId()}?new`)
    } else if (id && !has(query, 'new')) {
      getById(id)
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
      <PageState.Provider>
        <EditContainer></EditContainer>
      </PageState.Provider>
    </Layout>
  )
}

export default EditPage
