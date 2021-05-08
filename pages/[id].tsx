import LayoutMain from 'components/layout/layout-main'
import { applyTree } from 'libs/server/middlewares/tree'
import { useSession } from 'libs/server/middlewares/session'
import { applySettings } from 'libs/server/middlewares/settings'
import { applyAuth, applyRedirectLogin } from 'libs/server/middlewares/auth'
import { applyNote } from 'libs/server/middlewares/note'
import LayoutPublic from 'components/layout/layout-public'
import { EditContainer } from 'components/container/edit-container'
import { PostContainer } from 'components/container/post-container'
import { applyCsrf } from 'libs/server/middlewares/csrf'
import { ssr, SSRContext, ServerProps } from 'libs/server/connect'
import { applyUA } from 'libs/server/middlewares/ua'

export default function EditNotePage({
  tree,
  note,
  pageMode,
  baseURL,
  isLoggedIn,
}: ServerProps) {
  if (isLoggedIn) {
    return (
      <LayoutMain tree={tree} note={note}>
        <EditContainer />
      </LayoutMain>
    )
  }

  return (
    <LayoutPublic tree={tree} note={note}>
      <PostContainer pageMode={pageMode} baseURL={baseURL} />
    </LayoutPublic>
  )
}

export const getServerSideProps = async (
  ctx: SSRContext & {
    query: {
      id: string
    }
  }
) => {
  await ssr()
    .use(useSession)
    .use(applyAuth)
    .use(applyNote(ctx.query.id))
    .use(applyRedirectLogin(ctx.resolvedUrl))
    .use(applyTree)
    .use(applySettings)
    .use(applyCsrf)
    .use(applyUA)
    .run(ctx.req, ctx.res)

  return {
    props: ctx.req.props,
    redirect: ctx.req.redirect,
  }
}
