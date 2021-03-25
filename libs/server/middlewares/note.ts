import { PageMode } from 'libs/shared/page'
import { NOTE_SHARED } from 'libs/shared/meta'
import { GetServerSidePropsContext } from 'next'
import { getNote } from 'pages/api/notes/[id]'
import { ApiRequest } from '../api'

const RESERVED_ROUTES = ['new', 'settings', 'login']

export function withNote(wrapperHandler: any) {
  return async function handler(
    ctx: GetServerSidePropsContext & {
      req: ApiRequest
    }
  ) {
    const res = await wrapperHandler(ctx)
    const id = ctx.query.id as string
    let note
    let pageMode = PageMode.NOTE

    // todo 页面不存在时应该跳转到新建页
    if (!RESERVED_ROUTES.includes(id)) {
      note = await getNote(ctx.req.store, id)
    }

    if (note?.shared === NOTE_SHARED.PUBLIC && !ctx.req.session.get('user')) {
      pageMode = PageMode.PUBLIC
    }

    res.props = {
      ...res.props,
      note,
      pageMode,
    }

    return res
  }
}
