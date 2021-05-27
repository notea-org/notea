import { SSRMiddeware } from '../connect'
import { renderMarkdown } from 'libs/shared/markdown/render'

export const applyPost: SSRMiddeware = async (req, _res, next) => {
  req.props = {
    ...req.props,
    post: renderMarkdown(req.props.note?.content ?? ''),
  }

  next()
}

export const applyPostWithAuth: SSRMiddeware = async (req, res, next) => {
  if (req.props.isLoggedIn) {
    return next()
  }

  return applyPost(req, res, next)
}
