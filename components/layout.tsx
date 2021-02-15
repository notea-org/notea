import { Editor } from './editor'
import { List } from './list'
import { PageListState } from '../containers/page-list'
import { PageState } from '../containers/page'
import { useRouter } from 'next/router'

export const Layout = () => {
  const router = useRouter()

  return (
    <section className="flex h-screen">
      <aside className="w-10 bg-gray-200">toolbar</aside>
      <section className="w-60 bg-gray-100 overflow-y-auto">
        <PageListState.Provider initialState={[]}>
          <List />
        </PageListState.Provider>
      </section>
      <main className="flex-auto overflow-y-auto">
        <nav className="fixed bg-white w-full z-10 p-2 text-sm">导航</nav>
        <article className="m-auto pt-40 pb-40 prose prose-sm h-full">
          <PageState.Provider initialState={router.query.id as string}>
            <Editor />
          </PageState.Provider>
        </article>
      </main>
    </section>
  )
}
