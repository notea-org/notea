import LayoutMain from 'components/layout/layout-main'
import { GetServerSideProps, NextPage } from 'next'
import withTree from 'libs/server/middlewares/tree'
import withUA from 'libs/server/middlewares/ua'
import { TreeModel } from 'libs/shared/tree'
import { withSession } from 'libs/server/middlewares/session'
import { withStore } from 'libs/server/middlewares/store'
import withSettings from 'libs/server/middlewares/settings'
import withAuth from 'libs/server/middlewares/auth'

const EditNotePage: NextPage<{ tree: TreeModel }> = ({ tree }) => {
  return (
    <LayoutMain tree={tree}>
      <div>111</div>
    </LayoutMain>
  )
}

export default EditNotePage

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
