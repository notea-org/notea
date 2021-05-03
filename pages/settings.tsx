import LayoutMain from 'components/layout/layout-main'
import { GetServerSideProps, NextPage } from 'next'
import { withTree } from 'libs/server/middlewares/tree'
import { withUA } from 'libs/server/middlewares/ua'
import { TreeModel } from 'libs/shared/tree'
import { withSession } from 'libs/server/middlewares/session'
import { withStore } from 'libs/server/middlewares/store'
import { withSettings } from 'libs/server/middlewares/settings'
import { withAuth } from 'libs/server/middlewares/auth'
import { SettingsForm } from 'components/settings/settings-form'
import useI18n from 'libs/web/hooks/use-i18n'
import { withCsrf } from 'libs/server/middlewares/csrf'
import { SettingFooter } from 'components/settings/setting-footer'

const SettingsPage: NextPage<{ tree: TreeModel }> = ({ tree }) => {
  const { t } = useI18n()

  return (
    <LayoutMain tree={tree}>
      <section className="py-40 h-full overflow-y-auto">
        <div className="px-6 prose m-auto">
          <h1>
            <span className="font-normal">{t('Settings')}</span>
          </h1>

          <SettingsForm />
          <SettingFooter />
        </div>
      </section>
    </LayoutMain>
  )
}

export default SettingsPage

export const getServerSideProps: GetServerSideProps = withUA(
  withSession(withStore(withAuth(withTree(withSettings(withCsrf(() => ({})))))))
)
