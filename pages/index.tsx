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
import UIState from 'libs/web/state/ui'
import Router from 'next/router'
import { useEffect } from 'react'
import { withCsrf } from 'libs/server/middlewares/csrf'

const EditNotePage: NextPage<{ tree: TreeModel }> = ({ tree }) => {
  const { ua } = UIState.useContainer()

  useEffect(() => {
    if (ua.isMobileOnly) {
      Router.push('/new')
    }
  }, [ua.isMobileOnly])

  return (
    <LayoutMain tree={tree}>
      <div className="flex flex-col h-screen">
        <div className="m-auto text-center flex flex-col items-center">
          <Link href="//github.com/qingwei-li/notea">
            <a target="_blank">
              <img className="w-60 h-60 opacity-10 -mt-40" src="/logo.svg" />
            </a>
          </Link>
        </div>
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
    withStore(withAuth(withTree(withIndex(withSettings(withCsrf(() => ({})))))))
  )
)
