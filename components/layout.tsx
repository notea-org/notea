import { Editor } from './editor'
import { List } from './list'

export const Layout = () => {
  return (
    <section className="flex h-screen">
      <aside className="w-10 bg-gray-200">toolbar</aside>
      <section className="w-60 bg-gray-100 overflow-y-auto">
        <List />
      </section>
      <main className="flex-auto overflow-y-auto">
        <nav className="fixed bg-white w-full z-10 p-2">导航</nav>
        <article className="m-auto pt-40 pb-40 prose prose-sm h-full">
          <Editor />
        </article>
      </main>
    </section>
  )
}
