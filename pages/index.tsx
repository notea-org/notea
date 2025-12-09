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
import { useEffect, useState } from 'react';
import { applyCsrf } from 'libs/server/middlewares/csrf';
import { SSRContext, ssr } from 'libs/server/connect';
import { applyReset } from 'libs/server/middlewares/reset';
import PortalState from 'libs/web/state/portal';
import { PlusIcon, SearchIcon, InboxIcon } from '@heroicons/react/outline';
import MotivationalQuote from 'components/motivational-quote';
import dayjs from 'dayjs';

const EditNotePage: NextPage<{ tree: TreeModel }> = ({ tree }) => {
    const { ua } = UIState.useContainer();
    const { search } = PortalState.useContainer();
    const [greeting, setGreeting] = useState('Hello');

    useEffect(() => {
        if (ua.isMobileOnly) {
            Router.push('/new')?.catch((v) =>
                console.error('Error whilst pushing /new route: %O', v)
            );
        }

        const hour = new Date().getHours();
        if (hour < 12) setGreeting('Good Morning');
        else if (hour < 18) setGreeting('Good Afternoon');
        else setGreeting('Good Evening');
    }, [ua.isMobileOnly]);

    const handleCreateNote = () => {
        Router.push('/new', undefined, { shallow: true });
    };

    const handleDailyNote = () => {
        const href = `/${dayjs().format('YYYY-MM-DD')}`;
        Router.push(href, undefined, { shallow: true });
    };

    return (
        <LayoutMain tree={tree}>
            <div className="flex flex-col h-full bg-gray-50 dark:bg-gray-900 overflow-y-auto">
                <div className="flex-grow flex flex-col items-center justify-center p-6 space-y-12">
                    <div className="text-center space-y-2">
                        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-gray-100 tracking-tight">
                            {greeting}
                        </h1>
                        <p className="text-xl text-gray-500 dark:text-gray-400">
                            Ready to capture your thoughts?
                        </p>
                    </div>

                    <MotivationalQuote />

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-3xl">
                        <button
                            onClick={handleCreateNote}
                            className="flex flex-col items-center justify-center p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-sm hover:shadow-md transition-shadow border border-gray-200 dark:border-gray-700 group"
                        >
                            <div className="p-4 bg-primary-50 dark:bg-primary-900/30 rounded-full mb-4 group-hover:bg-primary-100 dark:group-hover:bg-primary-900/50 transition-colors">
                                <PlusIcon className="w-8 h-8 text-primary-600 dark:text-primary-400" />
                            </div>
                            <span className="font-semibold text-gray-900 dark:text-gray-100 text-lg">
                                New Note
                            </span>
                            <span className="text-sm text-gray-500 mt-2">
                                Start writing from scratch
                            </span>
                        </button>

                        <button
                            onClick={handleDailyNote}
                            className="flex flex-col items-center justify-center p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 dark:border-gray-700 group"
                        >
                            <div className="p-4 bg-green-50 dark:bg-green-900/30 rounded-full mb-4 group-hover:bg-green-100 dark:group-hover:bg-green-900/50 transition-colors">
                                <InboxIcon className="w-8 h-8 text-green-600 dark:text-green-400" />
                            </div>
                            <span className="font-semibold text-gray-900 dark:text-gray-100 text-lg">
                                Daily Note
                            </span>
                            <span className="text-sm text-gray-500 mt-2">
                                Journal your day
                            </span>
                        </button>

                        <button
                            onClick={search.open}
                            className="flex flex-col items-center justify-center p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 dark:border-gray-700 group"
                        >
                            <div className="p-4 bg-purple-50 dark:bg-purple-900/30 rounded-full mb-4 group-hover:bg-purple-100 dark:group-hover:bg-purple-900/50 transition-colors">
                                <SearchIcon className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                            </div>
                            <span className="font-semibold text-gray-900 dark:text-gray-100 text-lg">
                                Search
                            </span>
                            <span className="text-sm text-gray-500 mt-2">
                                Find existing notes
                            </span>
                        </button>
                    </div>

                    <div className="mt-auto pt-12 opacity-30 hover:opacity-100 transition-opacity">
                        <Link href="https://github.com/qingwei-li/notea">
                            <a target="_blank">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    className="w-12 h-12"
                                    src="/logo.svg"
                                    alt="Notea Logo"
                                />
                            </a>
                        </Link>
                    </div>
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

    if (lastVisit && ctx.req.session.get('user')?.isLoggedIn) {
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
