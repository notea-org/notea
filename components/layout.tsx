import { List } from './list'
import { Sidebar } from './sidebar'
import { PageListState } from 'containers/page-list'
import { FC, HTMLProps } from 'react'
import { useSession } from 'next-auth/client'
import { useRouter } from 'next/router'

export const Layout: FC<HTMLProps<HTMLDivElement>> = ({ children }) => {
  const [session, loading] = useSession()
  const router = useRouter()

  if (!loading && !session) {
    router.push('/api/auth/signin')
    return null
  }

  return (
    <section className="flex h-screen">
      <PageListState.Provider initialState={[]}>
        <aside className="w-10 bg-gray-200">
          <Sidebar />
        </aside>
        <section className="w-60 bg-gray-100 overflow-y-auto">
          <List />
        </section>
        <main className="flex-auto overflow-y-auto">
          <nav className="fixed bg-white w-full z-10 p-2 text-sm">导航</nav>
          <article className="m-auto prose prose-sm h-full">{children}</article>
        </main>
      </PageListState.Provider>
    </section>
  )
}
