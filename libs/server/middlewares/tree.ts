import { GetServerSidePropsContext } from 'next'
import { ApiRequest } from '../api'
import { API } from './error'
// @atlaskit/tree 的依赖
const { resetServerContext } = require('react-beautiful-dnd-next')

export default function withTree(wrapperHandler: any) {
  return async function handler(
    ctx: GetServerSidePropsContext & {
      req: ApiRequest
    }
  ) {
    const res = await wrapperHandler(ctx)

    if (!ctx.req.session.get('user')) {
      return {
        redirect: {
          destination: `/login?redirect=${ctx.resolvedUrl}`,
          permanent: false,
        },
      }
    }

    resetServerContext()

    let tree

    try {
      tree = await ctx.req.treeStore.get()
    } catch (error) {
      return API.NOT_FOUND.throw(error.message)
    }

    res.props = {
      ...res.props,
      tree,
    }

    return res
  }
}
