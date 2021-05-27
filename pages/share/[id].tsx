import { applyUA } from 'libs/server/middlewares/ua'
import { applySettings } from 'libs/server/middlewares/settings'
import { applyNote } from 'libs/server/middlewares/note'
import LayoutPublic from 'components/layout/layout-public'
import { PostContainer } from 'components/container/post-container'
import { ServerProps, ssr, SSRContext } from 'libs/server/connect'
import { useSession } from 'libs/server/middlewares/session'
import { applyPost } from 'libs/server/middlewares/post'
import { applyReset } from 'libs/server/middlewares/reset'

export default function SharePage({
  tree,
  note,
  pageMode,
  baseURL,
  post,
}: ServerProps) {
  return (
    <LayoutPublic tree={tree} note={note} pageMode={pageMode} baseURL={baseURL}>
      <PostContainer post={post} />
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
    .use(applyReset)
    .use(applySettings)
    .use(applyUA)
    .use(applyPost)
    .run(ctx.req, ctx.res)

  return {
    props: ctx.req.props,
    redirect: ctx.req.redirect,
  }
}
