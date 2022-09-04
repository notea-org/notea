import { applyUA } from 'libs/server/middlewares/ua';
import { applySettings } from 'libs/server/middlewares/settings';
import { applyNote } from 'libs/server/middlewares/note';
import LayoutPublic from 'components/layout/layout-public';
import { PostContainer } from 'components/container/post-container';
import { ServerProps, ssr, SSRContext } from 'libs/server/connect';
import { useSession } from 'libs/server/middlewares/session';
import { applyReset } from 'libs/server/middlewares/reset';

export default function SharePage({
    tree,
    note,
    pageMode,
    baseURL,
}: ServerProps) {
    return (
        <LayoutPublic
            tree={tree}
            note={note}
            pageMode={pageMode}
            baseURL={baseURL}
        >
            <PostContainer note={note} />
        </LayoutPublic>
    );
}

export const getServerSideProps = async (
    ctx: SSRContext & {
        query: {
            id: string;
        };
    }
) => {
    await ssr()
        .use(useSession)
        .use(applyNote(ctx.query.id))
        .use(applyReset)
        .use(applySettings)
        .use(applyUA)
        // .use(applyPost)
        .run(ctx.req, ctx.res);

    return {
        props: ctx.req.props,
        redirect: ctx.req.redirect,
    };
};
