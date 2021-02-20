import { TreeData } from '@atlaskit/tree'
import LayoutMain from 'components/layout/layout-main'
import { GetServerSideProps, GetServerSidePropsContext } from 'next'
import { ApiRequest } from 'services/api'
import { withSession } from 'services/middlewares/session'
import { withStore } from 'services/middlewares/store'
import { getTree } from './api/pages'

// @atlaskit/tree 的依赖
const { resetServerContext } = require('react-beautiful-dnd-next')

const IndexPage = ({ tree }: IndexPageProps) => {
  return <LayoutMain tree={tree}></LayoutMain>
}

export default IndexPage

export interface IndexPageProps {
  tree: TreeData
}

export const getServerSideProps: GetServerSideProps = withStore(
  withSession(
    async ({
      req,
      resolvedUrl,
    }: GetServerSidePropsContext & {
      req: ApiRequest
    }) => {
      if (!req.session.get('user')) {
        return {
          redirect: {
            destination: `/login?redirect=${resolvedUrl}`,
            permanent: false,
          },
        }
      }

      const tree = await getTree(req.store)

      resetServerContext()

      return {
        props: {
          tree,
        },
      }
    }
  )
)
