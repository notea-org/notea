import LayoutMain from 'components/layout/layout-main';
import { NextPage } from 'next';
import { applyUA } from 'libs/server/middlewares/ua';
import { TreeModel } from 'libs/shared/tree';
import { useSession } from 'libs/server/middlewares/session';
import { applySettings } from 'libs/server/middlewares/settings';
import { applyAuth } from 'libs/server/middlewares/auth';
import { SettingsContainer } from 'components/settings/settings-container';
import useI18n from 'libs/web/hooks/use-i18n';
import { applyCsrf } from 'libs/server/middlewares/csrf';
import { SettingFooter } from 'components/settings/setting-footer';
import { SSRContext, ssr } from 'libs/server/connect';
import { applyReset } from 'libs/server/middlewares/reset';

const SettingsPage: NextPage<{ tree: TreeModel }> = ({ tree }) => {
    const { t } = useI18n();

    return (
        <LayoutMain tree={tree}>
            <section className="py-40 h-full overflow-y-auto">
                <div className="px-6 max-w-prose m-auto">
                    <h1 className="font-normal text-4xl mb-10">
                        <span>{t('Settings')}</span>
                    </h1>

                    <SettingsContainer />
                    <SettingFooter />
                </div>
            </section>
        </LayoutMain>
    );
};

export default SettingsPage;

export const getServerSideProps = async (ctx: SSRContext) => {
    await ssr()
        .use(useSession)
        .use(applyAuth)
        .use(applyReset)
        .use(applySettings)
        .use(applyCsrf)
        .use(applyUA)
        .run(ctx.req, ctx.res);

    return {
        props: ctx.req.props,
        redirect: ctx.req.redirect,
    };
};
