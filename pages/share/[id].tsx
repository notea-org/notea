import { applyTree } from 'libs/server/middlewares/tree'
import { applyUA } from 'libs/server/middlewares/ua'
import { applySettings } from 'libs/server/middlewares/settings'
import { applyNote } from 'libs/server/middlewares/note'
import LayoutPublic from 'components/layout/layout-public'
import { PostContainer } from 'components/container/post-container'
import { ServerProps, ssr, SSRContext } from 'libs/server/connect'
import { useSession } from 'libs/server/middlewares/session'

export default function SharePage({
  tree,
  note,
  pageMode,
  baseURL,
}: ServerProps) {
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
    .use(applyNote(ctx.query.id))
    .use(applyTree)
    .use(applySettings)
    .use(applyUA)
    .run(ctx.req, ctx.res)

  return {
    props: ctx.req.props,
    redirect: ctx.req.redirect,
  }
}
