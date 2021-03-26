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

const SettingsPage: NextPage<{ tree: TreeModel }> = ({ tree }) => {
  return (
    <LayoutMain tree={tree}>
      <main className="pt-40 px-6 m-auto prose">
        <h1>
          <span className="font-normal">设置</span>
        </h1>

        <SettingsForm />
      </main>
    </LayoutMain>
  )
}

export default SettingsPage

export const getServerSideProps: GetServerSideProps = withUA(
  withSession(
    withStore(
      withAuth(
        withTree(
          withSettings(() => {
            return {}
          })
        )
      )
    )
  )
)
