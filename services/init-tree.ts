import { TreeData } from '@atlaskit/tree'
import { GetServerSideProps, GetServerSidePropsContext } from 'next'
import { StoreProvider } from 'packages/store/src'
import { ApiRequest } from './api'
import { metaToJson } from './meta'
import { withSession } from './middlewares/session'
import { withStore } from './middlewares/store'
// @atlaskit/tree 的依赖
const { resetServerContext } = require('react-beautiful-dnd-next')

export async function getTree(store: StoreProvider) {
  const list = await store.getList()
  const tree: TreeData = {
    rootId: 'root',
    items: {},
  }

  await Promise.all(
    list.map(async (id) => {
      const metaData = await store.getObjectMeta(store.path.getPageById(id))
      const { cid, ...meta } = metaToJson(metaData)

      delete meta.id
      tree.items[id] = {
        id,
        data: meta,
        children: cid || [],
      }

      return
    })
  )

  if (!list.includes('root')) {
    await store.putObject(store.path.getPageById('root'), '')
    await store.addToList('root')
    tree.items['root'] = {
      id: 'root',
      children: [],
    }
  }

  return tree
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
        props: { tree },
      }
    }
  )
)
