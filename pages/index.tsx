import LayoutMain from 'components/layout/layout-main'
import { GetServerSideProps, GetServerSidePropsContext, NextPage } from 'next'
import { withTree } from 'libs/server/middlewares/tree'
import { withUA } from 'libs/server/middlewares/ua'
import { TreeModel } from 'libs/shared/tree'
import { withSession } from 'libs/server/middlewares/session'
import { withStore } from 'libs/server/middlewares/store'
import { withSettings } from 'libs/server/middlewares/settings'
import { withAuth } from 'libs/server/middlewares/auth'
import Link from 'next/link'

const EditNotePage: NextPage<{ tree: TreeModel }> = ({ tree }) => {
  return (
    <LayoutMain tree={tree}>
      <div>
        使用说明之类的
        <Link href="/new" shallow>
          <a>Create Note</a>
        </Link>
      </div>
    </LayoutMain>
  )
}

export default EditNotePage

function withIndex(wrapperHandler: any) {
  return async function handler(ctx: GetServerSidePropsContext) {
    const res = await wrapperHandler(ctx)
    const lastVisit = res.props?.settings?.last_visit

    if (lastVisit && !res.redirect) {
      res.redirect = {
        destination: lastVisit,
        permanent: false,
      }
    }

    return res
  }
}

export const getServerSideProps: GetServerSideProps = withUA(
  withSession(
    withStore(withAuth(withTree(withIndex(withSettings(() => ({}))))))
  )
)
