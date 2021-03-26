import { PageMode } from 'libs/shared/page'
import { GetServerSidePropsContext } from 'next'
import { ApiRequest } from '../api'
import { API } from './error'

// @atlaskit/tree 的依赖
const { resetServerContext } = require('react-beautiful-dnd-next')

export function withTree(wrapperHandler: any) {
  return async function handler(
    ctx: GetServerSidePropsContext & {
      req: ApiRequest
    }
  ) {
    const res = await wrapperHandler(ctx)

    resetServerContext()

    let tree

    if (res.redirect) {
      return res
    }

    // todo 分享页面获取指定树结构
    if (res.pageMode !== PageMode.PUBLIC) {
      try {
        tree = await ctx.req.treeStore.get()
      } catch (error) {
        return API.NOT_FOUND.throw(error.message)
      }
    }

    res.props = {
      ...res.props,
      tree,
    }

    return res
  }
}
