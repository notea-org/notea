import { PageMode } from 'libs/shared/page'
import { NOTE_SHARED } from 'libs/shared/meta'
import { GetServerSidePropsContext } from 'next'
import { getNote } from 'pages/api/notes/[id]'
import { ApiRequest } from '../api'
import { NoteModel } from 'libs/web/state/note'
import { getEnv } from 'libs/shared/env'
import { isLoggedIn } from './auth'

const RESERVED_ROUTES = ['new', 'settings', 'login']

export function withNote(wrapperHandler: any) {
  return async function handler(
    ctx: GetServerSidePropsContext & {
      req: ApiRequest
    }
  ) {
    const res = await wrapperHandler(ctx)
    const id = ctx.query.id as string
    const props: { note?: NoteModel; pageMode: PageMode } = {
      pageMode: PageMode.NOTE,
    }

    // todo 页面不存在时应该跳转到新建页
    if (!RESERVED_ROUTES.includes(id)) {
      try {
        props.note = await getNote(ctx.req.store, id)
      } catch (e) {
        // do nothing
      }
    }

    if (props.note?.shared === NOTE_SHARED.PUBLIC && !isLoggedIn(ctx.req)) {
      props.pageMode = PageMode.PUBLIC
    }

    res.props = {
      ...res.props,
      ...props,
      baseURL: getEnv('BASE_URL', '//' + ctx.req.headers.host),
    }

    return res
  }
}
