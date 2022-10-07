import LayoutMain from 'components/layout/layout-main';
import { NextPage } from 'next';
import { applyUA } from 'libs/server/middlewares/ua';
import { TreeModel } from 'libs/shared/tree';
import { useSession } from 'libs/server/middlewares/session';
import { applySettings } from 'libs/server/middlewares/settings';
import { applyAuth, applyRedirectLogin } from 'libs/server/middlewares/auth';
import Link from 'next/link';
import UIState from 'libs/web/state/ui';
import Router from 'next/router';
import { useEffect } from 'react';
import { applyCsrf } from 'libs/server/middlewares/csrf';
import { SSRContext, ssr } from 'libs/server/connect';
import { applyReset } from 'libs/server/middlewares/reset';

const EditNotePage: NextPage<{ tree: TreeModel }> = ({ tree }) => {
    const { ua } = UIState.useContainer();

    useEffect(() => {
        if (ua.isMobileOnly) {
            Router.push('/new')
                ?.catch((v) => console.error('Error whilst pushing /new route: %O', v));
        }
    }, [ua.isMobileOnly]);

    return (
        <LayoutMain tree={tree}>
            <div className="flex flex-col h-screen">
                <div className="m-auto text-center flex flex-col items-center">
                    <Link href="https://github.com/qingwei-li/notea">
                        <a target="_blank">
                            <img
                                className="w-60 h-60 opacity-10 -mt-40"
                                src="/logo.svg"
                            />
                        </a>
                    </Link>
                </div>
            </div>
        </LayoutMain>
    );
};

export default EditNotePage;

export const getServerSideProps = async (ctx: SSRContext) => {
    await ssr()
        .use(useSession)
        .use(applyAuth)
        .use(applyRedirectLogin(ctx.resolvedUrl))
        .use(applyReset)
        .use(applySettings)
        .use(applyCsrf)
        .use(applyUA)
        .run(ctx.req, ctx.res);

    const lastVisit = ctx.req.props?.settings?.last_visit;

    if (lastVisit) {
        return {
            redirect: {
                destination: lastVisit,
                permanent: false,
            },
        };
    }

    return {
        props: ctx.req.props,
        redirect: ctx.req.redirect,
    };
};
