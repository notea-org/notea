import { List } from './list'
import { Sidebar } from './sidebar'
import { PageTreeState } from 'containers/page-tree'
import { FC, HTMLProps } from 'react'
import { useRouter } from 'next/router'
import useFetch from 'use-http'
import { PageState } from 'containers/page'
import { getLocalStore } from 'utils/local-store'

export const Layout: FC<HTMLProps<HTMLDivElement>> = ({ children }) => {
  const { loading, error } = useFetch('/api/auth/user', {}, [])
  const router = useRouter()

  if (loading) return null

  // todo: fix redirect login
  if (!loading && error) {
    router.push(`/login?redirect=${router.asPath}`)
    return null
  }

  return (
    <section className="flex h-screen">
      <PageState.Provider>
        <PageTreeState.Provider initialState={getLocalStore('TREE')}>
          <aside className="w-10 bg-gray-200">
            <Sidebar />
          </aside>
          <section className="w-60 bg-gray-100 overflow-y-auto">
            <List />
          </section>
          <main className="flex-auto overflow-y-auto">
            <nav className="fixed bg-white w-full z-10 p-2 text-sm">导航</nav>
            <article className="m-auto prose prose-sm h-full">
              {children}
            </article>
          </main>
        </PageTreeState.Provider>
      </PageState.Provider>
    </section>
  )
}
