import { SSRMiddeware } from '../connect'

// @atlaskit/tree 的依赖
const { resetServerContext } = require('react-beautiful-dnd-next')

export const applyTree: SSRMiddeware = async (req, res, next) => {
  resetServerContext()

  let tree

  // todo 分享页面获取指定树结构
  if (req.props.isLoggedIn) {
    try {
      tree = await req.state.treeStore.get()
    } catch (error) {
      res.APIError.NOT_FOUND.throw(error.message)
    }
  }

  req.props = {
    ...req.props,
    ...(tree && { tree }),
  }

  next()
}
