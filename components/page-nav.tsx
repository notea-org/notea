import { PageState } from 'containers/page'

const PageNav = () => {
  const { page } = PageState.useContainer()

  return (
    <nav className="fixed bg-white w-full z-10 p-2 text-sm">{page.title}</nav>
  )
}
export default PageNav
