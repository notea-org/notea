import { SSRMiddeware } from '../connect'
const { resetServerContext } = require('react-beautiful-dnd-next')

export const applyReset: SSRMiddeware = async (_req, _res, next) => {
  resetServerContext()

  next()
}
