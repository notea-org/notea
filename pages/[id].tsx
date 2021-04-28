import { NoteModel } from 'libs/web/state/note'
import LayoutMain from 'components/layout/layout-main'
import { GetServerSideProps, NextPage } from 'next'
import { withTree } from 'libs/server/middlewares/tree'
import { withUA } from 'libs/server/middlewares/ua'
import { TreeModel } from 'libs/shared/tree'
import { withSession } from 'libs/server/middlewares/session'
import { withStore } from 'libs/server/middlewares/store'
import { withSettings } from 'libs/server/middlewares/settings'
import { withAuth } from 'libs/server/middlewares/auth'
import { withNote } from 'libs/server/middlewares/note'
import LayoutPublic from 'components/layout/layout-public'
import { PageMode } from 'libs/shared/page'
import { EditContainer } from 'components/container/edit-container'
import { PostContainer } from 'components/container/post-container'
import { withCsrf } from 'libs/server/middlewares/csrf'

const EditNotePage: NextPage<{
  tree: TreeModel
  note?: NoteModel
  pageMode: PageMode
  baseURL: string
}> = ({ tree, note, pageMode, baseURL }) => {
  if (PageMode.PUBLIC === pageMode) {
    return (
      <LayoutPublic tree={tree} note={note}>
        <PostContainer baseURL={baseURL} />
      </LayoutPublic>
    )
  }
  return (
    <LayoutMain tree={tree} note={note}>
      <EditContainer />
    </LayoutMain>
  )
}

export default EditNotePage

export const getServerSideProps: GetServerSideProps = withUA(
  withSession(
    withStore(withAuth(withNote(withTree(withSettings(withCsrf(() => ({})))))))
  )
)
